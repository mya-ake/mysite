const program = require('commander')
const path = require('path')
const packageJson = require('./../package.json')
const { fixGenerate } = require('./../build')

program.version(packageJson.version)

program
  .command('fix:generate [targetDir]')
  .description('start fix generated dist')
  .action((dir) => {
    fixGenerate(path.resolve(dir))
  })

program.parse(process.argv)
