import axios from 'axios'

const STATUS_CODE = Object.freeze({
  NOT_FOUND: 404,
})

// const DELAY1 = 200
// const DELAY2 = 500

const router = (context) => {
  const ORIGIN = (() => {
    if (context.isClient === true) {
      return window.location.origin
    }
    return context.env.origin
  })()
  const p1 = new Promise((resolve, reject) => {
    const content = context.params.slug || 'top'
    axios.get(`${ORIGIN}/contents/pages/${content}.json`)
      .then((response) => {
        context.store.dispatch('content/setContent', response.data)
        resolve()
      })
      .catch((err) => {
        if (err.response === undefined || err.response.status === undefined) {
          console.error(err)
          reject(new Error('Routing response failed.'))
          return
        }
        switch (err.response.status) {
          case STATUS_CODE.NOT_FOUND:
            context.store.dispatch('content/setContent', {})
            resolve()
            break
          default:
            reject(err)
            break
        }
      })
  })

  // const p2 = new Promise((resolve) => {
  //   setTimeout(() => {
  //     console.info('comp 2')
  //     resolve()
  //   }, DELAY2)
  // })

  return Promise.all([p1])
}

export default router
