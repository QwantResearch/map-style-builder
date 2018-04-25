const nodeYaml = require('node-yaml')
const path = require('path')

module.exports = (options, style) => {

  let styleDir = options.styleDir

  if(options.i18n) {
    const languageFallbacks = nodeYaml.readSync(path.resolve(styleDir+'/i18n.yml')).languageFallbacks

    style.layers = style.layers.map((layer) => {
      if(layer['layout'] && layer['layout']['text-field']) {
        let fallback = languageFallbacks.find((languageFallback) => {
          return languageFallback.id === layer.id
        })

        if(fallback) {
          layer['layout']['text-field'] = fallback.lang
        }
      }
      if(typeof options.i18n === 'string') {
        let lang = options.i18n;
        layer = JSON.parse(JSON.stringify(layer).replace(/\{locale\}/g, lang))
      }
      return layer
    })
  }

  return style

}
