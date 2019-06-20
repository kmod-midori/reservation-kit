// Based on https://github.com/stalniy/casl-feathersjs-example/blob/master/src/hooks/abilities.js
const { AbilityBuilder, Ability } = require('@casl/ability')
const { toMongoQuery } = require('@casl/mongoose')
const { Forbidden } = require('@feathersjs/errors')

const TYPE_KEY = Symbol.for('type')

Ability.addAlias('update', 'patch')
Ability.addAlias('read', ['get', 'find'])
Ability.addAlias('delete', 'remove')

function subjectName(subject) {
  if (!subject || typeof subject === 'string') {
    return subject
  }

  return subject[TYPE_KEY]
}

function defineAbilitiesFor(user) {
  const { rules, can } = AbilityBuilder.extract()

  if (user) {
    can(['read'], 'users', { _id: user._id })
    can(['read'], 'rooms')
    can([])
  }

  if (user.admin) {
    can(['manage'], ['users', 'rooms'])
  }

  if (process.env.NODE_ENV !== 'production') {
    can('create', ['users'])
  }

  return new Ability(rules, { subjectName })
}

function canReadQuery(query) {
  return query !== null
}

module.exports = function authorize(name = null) {
  return async function(hook) {
    const action = hook.method
    const service = name ? hook.app.service(name) : hook.service
    const serviceName = name || hook.path
    const ability = defineAbilitiesFor(hook.params.user)
    const model =
      service.options && service.options.Model && service.options.Model

    const throwUnlessCan = (action, resource) => {
      if (ability.cannot(action, resource)) {
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`)
      }
    }

    hook.params = hook.params || {}
    hook.params.ability = ability

    if (model && model.accessibleFieldsBy) {
      hook.params.abilityFields = model.accessibleFieldsBy(ability, action)
    }

    if (hook.method === 'create') {
      if (Array.isArray(hook.data) && hook.data[0]) {
        hook.data[0][TYPE_KEY] = hook.path
        throwUnlessCan('create', hook.data[0])
        delete hook.data[0][TYPE_KEY]
      } else {
        hook.data[TYPE_KEY] = hook.path
        throwUnlessCan('create', hook.data)
        delete hook.data[TYPE_KEY]
      }
    }

    if (!hook.id) {
      let query = toMongoQuery(ability, serviceName, action)

      // query optimization [https://github.com/stalniy/casl/issues/30]
      // if there only one condition don't use $or
      if (
        query &&
        typeof query === 'object' &&
        !Array.isArray(query) &&
        Object.keys(query).length === 1 &&
        Array.isArray(query.$or) &&
        query.$or.length === 1
      ) {
        query = query.$or[0]
      }

      if (canReadQuery(query)) {
        Object.assign(hook.params.query, query)
      } else {
        hook.result = {} // Skip actual service call
      }

      return hook
    }

    // TODO: make sure if params.query.$select is defined
    // it should include fields defined in the rule, orherwise it won't work proparly
    const params = Object.assign({}, hook.params, { provider: null })
    const result = await service.get(hook.id, params)

    result[TYPE_KEY] = serviceName
    throwUnlessCan(action, result)

    if (action === 'get') {
      delete result[TYPE_KEY]
      hook.result = result
    }

    return hook
  }
}
