const DELAY = 2000

const router = (context) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, DELAY)
  })
}

export default router
