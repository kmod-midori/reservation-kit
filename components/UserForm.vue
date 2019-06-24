<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6>
          <v-text-field
            v-model="clonedUser.name"
            label="Name"
            :rules="[requiredRule]"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            v-model="clonedUser.uid"
            label="ID (for login)"
            :rules="[requiredRule]"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            v-model="clonedUser.email"
            label="Email"
            :rules="[requiredRule, emailRule]"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            v-model="clonedUser.password"
            type="password"
            label="Password (leave blank if not changed)"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-checkbox v-model="clonedUser.admin" label="Admin" />
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn :disabled="!valid" @click="submit">Submit</v-btn>
  </v-form>
</template>

<script>
import { validate as validateEmail } from 'email-validator'
export default {
  props: {
    user: Object
  },
  data() {
    return {
      valid: true,
      clonedUser: {},
      requiredRule: v => !!v || 'This field is required',
      emailRule: v => validateEmail(v) || 'Invalid email address'
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(user) {
        if (user) {
          this.clonedUser = user.clone()
        } else {
          const { User } = this.$FeathersVuex
          this.clonedUser = new User()
        }
      }
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        let failed = false
        if (!this.clonedUser.password) {
          delete this.clonedUser.password
        }
        try {
          await this.clonedUser.save()
        } catch (error) {
          this.$store.commit('snackbar/error', error.message || 'Failed.')
          failed = true
        }
        if (!failed) {
          this.$store.commit('snackbar/success', 'Success.')
          this.$emit('submit')
        }
      }
    }
  }
}
</script>
