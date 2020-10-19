const fs = require('fs-extra')
const path = require('path')
const spritezero = require('@mapbox/spritezero')

module.exports = (options, files) => {
  if(!options.outPath) {
    console.error('No output path given')
    return
  }

  const svgs = files.map(function(f) {
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
  });
}