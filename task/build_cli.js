const fs = require('fs-extra')
const path = require('path')
const yargs = require('yargs')
const build = require('../lib/build')
const mkdirp = require('mkdirp')
const args = yargs
  .usage('Usage: $0 [options]')
  .options({
    'style-dir': {
      describe: 'The folder with the style inside it',
      type: 'string',
      demandOption: true,
      nargs: 1
    }
  })
  .options({
    conf: {
      describe: 'The conf file with the urls in it',
      type: 'string',
      demandOption: true,
      nargs: 1
    }
  })
  .options({
    i18n: {
      describe: "Name of the default locale that will be used to \
render the labels. If not defined, 'name' tag is always used.",
      type: 'string',
      nargs: 1,
      default: undefined
    }
  })
  .options({
    icons: {
      describe: "Enable the build process importing icon data from icon.yml",
      nargs: 1,
      default: false
    }
  })
  .options({
    webfont: {
      describe: "Enable the build process of an icon font containing style icons",
      type: 'boolean',
      nargs: 1,
      default: false
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv


const buildDir = path.join(args['style-dir'], 'build')
const stylePath = path.join(args['style-dir'], 'style.json')
const confStr = fs.readFileSync(args.conf, 'utf8')
const styleStr = fs.readFileSync(stylePath, 'utf8')
const style = JSON.parse(styleStr)
const jsonconf = JSON.parse(confStr)
const webfont = args.webfont

let options = {
  styleDir: args['style-dir'],
  conf: jsonconf,
  pixelRatios: [1,2],
  outPath: buildDir,
  i18n: args['i18n'],
  icons: args['icons'],
  webfont:webfont
}

mkdirp(buildDir)
options.output = 'production'
const builtStyle = build(style, options)
outPath = path.join(buildDir, 'built-style.json')
fs.writeFileSync(outPath, builtStyle, 'utf8')

options.webfont = false /* we don't need build sprite & font twice */
options.needSprite = false

options.output = 'debug'
const builtStyleDebug = build(style, options)
outPath = path.join(buildDir, 'built-style-debug.json')
fs.writeFileSync(outPath, JSON.stringify(JSON.parse(builtStyleDebug), null, 2), 'utf8') //trick to restore formatting

options.output = 'omt'
const builtStyleOmt = build(style, options)
outPath = path.join(buildDir, 'style-omt.json')
fs.writeFileSync(outPath, builtStyleOmt, 'utf8')


fs.copySync(path.join(__dirname, '..', 'compare.html'), path.join(buildDir, 'compare.html'))
fs.copySync(path.join(__dirname, '..', 'debug.html'), path.join(buildDir, 'debug.html'))
