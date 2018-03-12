import Vue from 'vue'

const buildVueErrorParams = (err, vm, info) => {
  return {
    message: 'Vue Error',
    err,
    info,
  }
}

const addVueErrorHandler = (isDev) => {
  if (isDev === false) {
    // 本番
  } else {
    // 開発中
    Vue.config.errorHandler = (err, vm, info) => {
      // eslint-disable-next-line
      console.error('Vue Error', buildVueErrorParams(err, vm, info))
    }
  }
}

const buildWindowErrorParams = (err) => {
  return {
    message: 'Window Error',
    err,
  }
}

const addWindowErrorHandoler = (isDev) => {
  if (isDev === false) {
    // 本番
  } else {
    // 開発中
    window.addEventListener('error', (err) => {
      // eslint-disable-next-line
      console.error('Window Error', buildWindowErrorParams(err))
    })
  }
}

export default ({ isDev }) => {
  // Vueのエラーハンドリング
  addVueErrorHandler(isDev)

  if (process.client === true) {
    // windowのエラーハンドリング（クライアント時のみ）
    addWindowErrorHandoler(isDev)
  }
}
