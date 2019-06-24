export default async function(context) {
  const { store, redirect, route } = context
  const { auth } = store.state
  let isPublic = false

  for (const meta of route.meta) {
    // It should not happen, but whatever public stays public.
    isPublic = isPublic || meta.public
  }

  if (!auth.payload) {
    try {
      await store.dispatch('auth/authenticate')
    } catch (e) {
      if (!isPublic) return redirect('/login')
    }
  }
}
