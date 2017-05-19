const DELAY1 = 2000
const DELAY2 = 5000

const router = (context) => {
  const p1 = new Promise((resolve) => {
    setTimeout(() => {
      console.info('comp 1')
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
