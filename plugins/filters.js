import Vue from 'vue'
import sanitizeHtml from 'sanitize-html'
import marked from 'marked'
import moment from 'moment'

Vue.filter('capitalize', function(value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('safeMarkdown', function(value) {
  return sanitizeHtml(marked(value), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
  })
})

Vue.filter('moment', function(value, format = 'YYYY-MM-DD HH:mm') {
  return moment(value).format(format)
})

Vue.filter('momentRelative', function(value) {
  return moment(value).fromNow()
})
