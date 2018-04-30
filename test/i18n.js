const yaml = require('node-yaml');
const path = require('path');

module.exports = (style, styleDir) => {
  console.log('--- Test I18n language ---');
  const languageFallbacks = yaml.readSync(path.resolve(path.join(styleDir, 'i18n.yml'))).languageFallbacks;

  const layersFields = [];
  let error = false;

  style.layers.map((layer) => {
    /* looking for text field containing {name} */
    if (layer['layout'] && layer['layout']['text-field'] && layer['layout']['text-field'].match(/^\{name/)) {
      let fallback = languageFallbacks.find((languageFallback) => {
        return languageFallback.id === layer.id;
      });

      if (fallback) {
        layersFields.push({success: true, id: layer.id, lang: fallback.lang.toString().substr(0, 30) + '…'});
      } else {
        error = true;
        layersFields.push({success: false, id: layer.id});
      }
    }
  });

  if (error) {
    console.error('ERROR I18n file config is incomplete');
    layersFields.forEach((layersField) => {
      if (layersField.success) {
        console.log(`✓ ${layersField.id} | ${layersField.lang}`);
      } else {
        console.error(`❌ ${layersField.id}`);
      }
    });
    process.exit(1);
  } else {
    console.log(`✓ i18n config file is ok`);
  }
}
