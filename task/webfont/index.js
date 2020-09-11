const webfontsGenerator = require('webfonts-generator');
const tmp = require('tmp')

const fs = require('fs')
const util = require('util')
const path = require('path')

const cleanSvgIcon = require('../../lib/clean_svg_icon');

module.exports = async (options) => {
  /* promisify */
  const readFile = util.promisify(fs.readFile)
  const readdir = util.promisify(fs.readdir)

  let icons = await readdir(`${path.resolve(options.styleDir)}/icons`)
  const tmpSvgs = tmp.dirSync({unsafeCleanup : true})

  /* clean circle form from SVG */
  let iconsPromises = icons.filter((icon) => {
    /* use hi-res versions only */
    return icon.match(/-15\.svg$/)
  }).map((icon) => {
    return new Promise(async (resolve, reject) => {
      try {
        const svgStream = await readFile(`${path.resolve(options.styleDir)}/icons/${icon}`)
        const cleanSvg = await cleanSvgIcon(svgStream)
        const iconName = icon.match(/^(.*?)-[0-9]{1,2}\.svg$/)[1]
        fs.writeFileSync(`${tmpSvgs.name}/${iconName}.svg`, cleanSvg)
        resolve(iconName)
      } catch(e) {
        reject(e)
      }
    })
  })

  let cleanedIcons = await Promise.all(iconsPromises)

  /* build font */
  return new Promise((resolve, reject) => {
    webfontsGenerator({
      fontHeight : 150,
      files: cleanedIcons.map((icon) => {return `${path.join(tmpSvgs.name, `${icon}.svg`)}`}),
      dest: `${path.resolve(options.styleDir)}/build/font`
    }, (error, result) => {
      tmpSvgs.removeCallback()
      if (error) {
        console.error('Error while building webfont!', error);
        reject(err)
      } else {
        console.log(`Webfont built (${cleanedIcons.length} glyphs)`);
        resolve()
      }
    })
  })
}
