const DELAY1 = 200
const DELAY2 = 500

const router = (context) => {
  console.info(context)
  const p1 = new Promise((resolve) => {
    setTimeout(() => {
      console.info('comp 1')
      context.store.dispatch('content/setContent', {
        content: context.params.slug,
      })
      resolve()
    }, DELAY1)
  })

  const p2 = new Promise((resolve) => {
    setTimeout(() => {
      console.info('comp 2')
      resolve()
    }, DELAY2)
  })

  return Promise.all([p1, p2])
}

export default router
