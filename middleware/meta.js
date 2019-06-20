export default function(context) {
  const { route, store } = context
  const meta = {}

  for (const m of route.meta) {
    Object.assign(meta, m)
  }
  store.commit('meta/update', meta)
}
