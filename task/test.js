const fs = require('fs-extra');
const mbgl = require('@mapbox/mapbox-gl-style-spec');
const checkFonts = require('./check-fonts');
const path = require('path');
const yargs = require('yargs');
const yaml = require('node-yaml')

let args = yargs
  .usage('Usage: $0 [options]')
  .options({
    style_dir: {
      describe: 'The folder with the style inside it',
      type: 'string',
      demandOption: true,
      nargs: 1
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const stylePath = path.join(args.style_dir,'style.json');
const styleString = fs.readFileSync(stylePath, 'utf8');
const style = JSON.parse(styleString);

const errors = mbgl.validate(style);
if(errors && errors.length) {
  console.error(
      'ERROR: The style is not valid according to mapbox-gl-style-spec.');
  console.error(errors);
  process.exit(1);
} else {
  console.log('✓ The style is valid according to mapbox-gl-style-spec.')
}

checkFonts(style);

if(!style.sources.basemap) {
  console.log('WARNING: Style does not contain "basemap" source.');
}
if(!style.sources.poi) {
  console.log('WARNING: Style does not contain "poi" source.');
}
if(!style.metadata['openmaptiles:version']) {
  console.log('WARNING: Style does not contain "openmaptiles:version" metadata.');
}

const formattedStyleString = mbgl.format(style);
if(styleString.trim() !== formattedStyleString.trim()) {
  console.log(
    'WARNING: Style is not correctly formatted. You should use "gl-style-format"\n' +
    'before commit. See https://github.com/mapbox/mapbox-gl-js/blob/master/src/style-spec/README.md');
}


/* Test i18n config file */

const languageFallbacks = yaml.readSync(path.resolve(path.join(args.style_dir,'i18n.yml'))).languageFallbacks

const layersFields = [];
let error = false;

style.layers.map((layer) => {
  /* looking for text field containing {name} */
  if(layer['layout'] && layer['layout']['text-field'] && layer['layout']['text-field'].match(/^\{name/)) {
    let fallback = languageFallbacks.find((languageFallback) => {
      return languageFallback.id === layer.id
    });

    if(fallback) {
      layersFields.push({success : true, id : layer.id, lang : fallback.lang.toString().substr(0,30) + '…'})
    } else {
      error = true;
      layersFields.push({success : false, id : layer.id})
    }
  }
});

if(error) {
  console.error('ERROR I18n file config is incomplete');
  layersFields.forEach((layersField) => {
    if(layersField.success) {
      console.log(`✓ ${layersField.id} | ${layersField.lang}`)
    } else {
      console.error(`❌ ${layersField.id}`)
    }
  });
  process.exit(1);
} else {
  console.log(`✓ i18n config file is ok`)
}
