const yargs = require('yargs');

const styleArgs = yargs
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
      type: 'boolean',
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

module.exports = styleArgs