'use strict'

const fs = require('fs')
const path = require('path')
const marked = require('marked')
const highlight = require('highlightjs')
const colors = require('colors/safe')

/** marked settings */
const renderer = new marked.Renderer()
renderer.heading = (text, level) => {
  if (level === 1) {
    return `<h${level}>${text}</h${level}>`
  }
  const id = text.replace(/\s+/g, '_')
  return `<h${level} id="${id}">${text}</h${level}>`
}
renderer.image = (href, title, text) => {
  if (title === null) {
    return `<img src="${href}" alt="${text}" draggable="false">`
  }
  const sizes = title.split('x')
  const sizeAttr = sizes.map((size, index) => {
    if (/^[0-9]+$/.test(size) === false) {
      return ''
    }
    return index === 0
      ? `width: ${size}px`
      : `height: ${size}px`
  }).join(' ')
  return `<img src="${href}" alt="${text}" style="${sizeAttr}" draggable="false">`
}

marked.setOptions({
  renderer: renderer,
  highlight (code) {
    return highlight.highlightAuto(code).value
  },
})

/** constants */
const ARGV = Object.freeze({
  TARGET: {
    NAME: 'target',
    COMMAND: '-t',
    CORRECT_VALUES: ['pages', 'slides', 'posts'],
  },
  FILE: {
    NAME: 'file',
    COMMAND: '-f',
  },
})

const PATH_INFO = Object.freeze({
  DIST: `${__dirname}/../static/contents`,
})

/** functions */
const extractArgv = (argv, command) => {
  let isExtract = false
  return argv.filter((value) => {
    if (/^-/.test(value) === true) {
      isExtract = value === command
      return false
    }
    return isExtract
  })
}

const verifyValues = (values, argObject) => {
  for (let value of values) {
    if (argObject.CORRECT_VALUES.includes(value) === false) {
      // eslint-disable-next-line
      console.error(colors.red(`Error: Invalid value '${value}' in ${argObject.NAME}[${argObject.COMMAND}].`))
      process.exit()
    }
  }
}

const createTargets = (argTargets) => {
  let targets = []
  if (argTargets.length === 0) {
    targets = Array.from(ARGV.TARGET.CORRECT_VALUES)
  } else {
    targets = Array.from(argTargets)
  }
  return targets
}

const getFolderFileNames = (folderName) => {
  try {
    return fs.readdirSync(folderName)
  } catch (err) {
    // eslint-disable-next-line
    console.error(colors.red(err))
    process.exit()
  }
}

const getTargetFileNames = (targets) => {
  const fileNames = {}
  for (let target of targets) {
    fileNames[target] = getFolderFileNames(path.join(__dirname, target))
  }
  return fileNames
}

const getConvertFilePaths = (targetFileNames, argFileNames) => {
  let convertFileNames = []
  const funcFilter = (() => {
    if (argFileNames.length === 0) {
      return () => {
        return true
      }
    }
    return (fileName) => {
      return argFileNames.includes(fileName)
    }
  })()

  Object.keys(targetFileNames).forEach((folderName) => {
    const fileNames = targetFileNames[folderName]
    const tmpFileNames = fileNames.filter(funcFilter)
      .map((fileName) => `${folderName}/${fileName}`)
    convertFileNames = convertFileNames.concat(tmpFileNames)
  })
  return convertFileNames
}

const verifyFilePaths = (fileNames) => {
  if (fileNames.length === 0) {
    // eslint-disable-next-line
    console.error(colors.red('Error: No file to convert.'))
    process.exit()
  }
}

const changeExtensionMdToJson = (fileName) => {
  return fileName.replace(/\.md$/, '.json')
}

const extractTitle = (html) => {
  return html.match(/<h1>(.*?)<\/h1>/)
}

const extractDescription = (html) => {
  return html.match(/@@\n?(.*?)\n?@@/)
}

const extractDate = (html) => {
  return html.match(/==([0-9\\-]+),?([0-9\\-]+)?==/)
}

const extractThumbnail = (html) => {
  return html.match(/\+\+([a-zA-Z0-9\-/_.]*)?,?([a-z]*)?\+\+/)
}

const appendCodeHljsClass = (html) => {
  return html.replace(/<pre><code( class="([a-zA-Z\\-]+)")?>/g, '<pre><code class="hljs $2">')
}

const removeEmptyPTag = (html) => {
  return html.replace(/<p>\s*<\/p>/g, '')
}

const removeBeforeAndAfterNewLine = (html) => {
  return html.replace(/^\n*|\n*$/g, '')
}

const replaceAdContent1 = (html) => {
  return html.replace(/\[ad-content-1\]/,
    `<div class="content__ad">
    <ins class="adsbygoogle"
    style="display:block; text-align:center;"
    data-ad-layout="in-article"
    data-ad-format="fluid"
    data-ad-client="ca-pub-9428775704052737"
    data-ad-slot="2502459394"></ins>
    </div>`
  )
}

const replaceAdContent2 = (html) => {
  return html.replace(/\[ad-content-2\]/,
    `<div class="content__ad">
    <ins class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-9428775704052737"
    data-ad-slot="5032208407"
    data-ad-format="auto"></ins>
    </div>`
  )
}

const buildJson = (html) => {
  const [removeHtmlTitle, title] = extractTitle(html) || ['', '']
  const [removeHtmlDesciption, description] = extractDescription(html) || ['', '']
  const [removeHtmlDate, createdAt, updatedAt] = extractDate(html) || ['', '', '']
  const [removeHtmlThumbnail, thumbnail, twitterCardType] = extractThumbnail(html) || ['', '', '']
  html = html.replace(removeHtmlTitle, '')
          .replace(removeHtmlDesciption, '')
          .replace(removeHtmlDate, '')
          .replace(removeHtmlThumbnail, '')
  html = appendCodeHljsClass(html)
  html = removeEmptyPTag(html)
  html = removeBeforeAndAfterNewLine(html)
  html = replaceAdContent1(html)
  html = replaceAdContent2(html)

  return {
    title,
    description,
    body: html,
    thumbnail,
    twitterCardType,
    createdAt,
    updatedAt,
  }
}

/** main process */
const argv = process.argv.filter((value, index) => index > 1)

// Targets
const argTargets = extractArgv(argv, ARGV.TARGET.COMMAND)
verifyValues(argTargets, ARGV.TARGET)
const targets = createTargets(argTargets)
// eslint-disable-next-line
console.info(colors.cyan(`Target Folders: ${targets.join(', ')}`))

// File Names
const targetFileNames = getTargetFileNames(targets)
const argFileNames = extractArgv(argv, ARGV.FILE.COMMAND)
const filePaths = getConvertFilePaths(targetFileNames, argFileNames)
verifyFilePaths(filePaths)
// eslint-disable-next-line
console.info(colors.cyan(`Files to convert: ${filePaths.join(', ')}`))

// Convert
for (let filePath of filePaths) {
  try {
    let fileData = fs.readFileSync(path.join(__dirname, filePath)).toString()
    let html = marked(fileData)
    let json = JSON.stringify(buildJson(html))
    let saveFilePath = changeExtensionMdToJson(filePath)
    fs.writeFileSync(path.join(PATH_INFO.DIST, saveFilePath), json)
  } catch (error) {
    // eslint-disable-next-line
    console.error(colors.red(error))
    process.exit()
  }
}

console.info(colors.green('Completed.'))
