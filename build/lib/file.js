const fs = require('fs')
const { join } = require('path')

const getFilePathList = (folderPath) => {
  const paths = fs.readdirSync(folderPath)
  return paths.reduce((newPaths, filePath) => {
    const absoluteFilePath = join(folderPath, filePath)
    if (fs.statSync(absoluteFilePath).isDirectory()) {
      return newPaths.concat(getFilePathList(absoluteFilePath))
    } else {
      return newPaths.concat(absoluteFilePath)
    }
  }, [])
}

const readFile = (pathname) => {
  return fs.readFileSync(pathname, { encoding: 'utf8' })
}

const writeFile = (pathname, data) => {
  return fs.writeFileSync(pathname, data, { encoding: 'utf8' })
}

module.exports = {
  getFilePathList,
  readFile,
  writeFile,
}
