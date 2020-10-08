const fs = require('fs-extra')
const transform = require('../task/transform')
const path = require('path')
const glob = require('glob')
const spritezero = require('@mapbox/spritezero')
const icons = require('../task/icons/index')
const i18n = require('../task/i18n/index')
const webfont = require('../task/webfont/index')
const pins = require('../task/pins')

module.exports = function (style, options) {
  let styleDir = options.styleDir

  const ignoreSprite = options.ignoreSprite
  const isSpriteExist = fs.existsSync(path.join(styleDir,'icons'))
  const buildSprites = isSpriteExist && !ignoreSprite
  const tileSchemaBasePath = path.join(styleDir,'tileschema_base.json')
  const tileSchemaPoiPath = path.join(styleDir,'tileschema_poi.json')
  const tileSchemaBaseStr = fs.readFileSync(tileSchemaBasePath, 'utf8')
  const tileSchemaPoiStr = fs.readFileSync(tileSchemaPoiPath, 'utf8')

  const tileSchemaBase = JSON.parse(tileSchemaBaseStr)
  const tileSchemaPoi = JSON.parse(tileSchemaPoiStr)

  if(options.output === 'production') {
    transform.adjustStyleWithoutTilejson({
      style: style,
      needSprite: isSpriteExist,
      conf_url: options.conf,
      tileschema_base: tileSchemaBase,
      tileschema_poi: tileSchemaPoi,
    })
  } else if(options.output === 'debug') {
    transform.adjustStyleWithTilejson({
      style: style,
      needSprite: isSpriteExist,
      conf_url: options.conf,
      tileschema_base: tileSchemaBase,
      tileschema_poi: tileSchemaPoi,
    })
  } else if(options.output === 'omt') {
    transform.adjustStyleForMapTilerCloud({
      style: style,
      needSprite: isSpriteExist,
    })
  }

  if(buildSprites) {
    if(!options.outPath) {
      console.error('No output path given')
      return
    }

    const svgs = glob.sync(path.resolve(path.join(styleDir, 'icons', '*.svg')))
      .map(function(f) {
        return {
          svg: fs.readFileSync(f),
          id: path.basename(f).replace('.svg', '')
        }
      })

      options.pixelRatios = options.pixelRatios || [1]
      options.pixelRatios.forEach((pixelRatio) => {
      let pixelRatioPath = `sprite${pixelRatio > 1 ? `@${pixelRatio}x` : ''}`
      let jsonPath = `${options.outPath}/${pixelRatioPath}.json`
      let pngPath = `${options.outPath}/${pixelRatioPath}.png`

      spritezero.generateLayout({ imgs: svgs, pixelRatio: pixelRatio, format: true }, (err, dataLayout) => {
        if (err) {
          console.error(err)
          return
        }
        fs.writeFileSync(jsonPath, JSON.stringify(dataLayout))
      })

      spritezero.generateLayout({ imgs: svgs, pixelRatio: pixelRatio, format: false }, (err, imageLayout) => {
        spritezero.generateImage(imageLayout, function(err, image) {
          if (err) {
            console.error(err)
            return
          }
          fs.writeFileSync(pngPath, image)
        })
      })
    })
  }

  /* apply icons logic */
  style = icons(options, style)

  /* apply i18n label logic */
  style = i18n(options, style)

  /* build webfont */
  if (options.webfont) {
    webfont(options)
  }

  if (options.pins) {
    pins(options);
  }

  return JSON.stringify(style)
}
