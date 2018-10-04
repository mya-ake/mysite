const { getFilePathList, readFile, writeFile } = require('./lib/file')

const isHtml = (pathname) => {
  return /\.html$/.test(pathname)
}

const fixHtml = (pathname) => {
  let data = readFile(pathname)
  const isCorrectHtml = /<\/html>/.test(data)
  if (isCorrectHtml) return

  data = `${data}</body></html>`
  writeFile(pathname, data)
}

const fixGenerate = (dir) => {
  const list = getFilePathList(dir).filter(isHtml)
  list.forEach(fixHtml)
}

module.exports = {
  fixGenerate,
}
