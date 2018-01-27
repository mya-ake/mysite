import axios from 'axios'

const client = () => {
  const apiClient = axios.create({
    baseURL: window.location.origin,
  })
  return {
    async get (path) {
      const requestUrl = `contents/${path}.json`
      try {
        return await apiClient.get(requestUrl)
      } catch (err) {
        return err.response
      }
    },
  }
}

const server = () => {
  const { join } = require('path')
  const fs = (() => {
    try {
      return require('fs')
    } catch (err) {
      return null
    }
  })()
  return {
    get (path) {
      return new Promise((resolve) => {
        const dirname = __dirname || process.env.PWD
        const fullpath = join(dirname, 'app', 'static', 'contents', `${path}.json`)
        try {
          const data = JSON.parse(fs.readFileSync(fullpath).toString())
          resolve({
            status: 200,
            data,
          })
        } catch (err) {
          resolve({
            status: 404,
            data: null,
          })
        }
      })
    },
  }
}

export const apiClient = (() => {
  return typeof window === 'undefined' ? server() : client()
})()
