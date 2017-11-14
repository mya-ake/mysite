'use strict'

const { execSync } = require('child_process')
const { ENV } = require('./env.js')

const wrapExecSync = (command) => {
  execSync(command,
    {
      stdio: 'inherit',
    })
}

process.env.ORIGIN = `http://localhost:${ENV.LOCAL_SERVER.PORT}`
wrapExecSync('yarn start:local')
try {
  wrapExecSync('yarn generate')
} finally {
  wrapExecSync('yarn stop:local')
}
