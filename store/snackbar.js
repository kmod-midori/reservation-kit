export const state = () => ({
  message: null,
  color: null,
  ts: +new Date()
})

export const mutations = {
  success(state, message) {
    state.ts = +new Date()
    state.message = message
    state.color = 'success'
  },

  error(state, message) {
    state.ts = +new Date()
    state.message = message
    state.color = 'error'
  }
}
