const webfontsGenerator = require('webfonts-generator');
const tmp = require('tmp')

const fs = require('fs')
const util = require('util')
const path = require('path')

const { keepPictoOnly } = require('../../lib/svg_icon');

module.exports = async (options) => {
  const readFile = util.promisify(fs.readFile)
  const readdir = util.promisify(fs.readdir)
  const tmpSvgs = tmp.dirSync({unsafeCleanup : true})

  const iconFiles = await readdir(`${path.resolve(options.styleDir)}/icons`)

  const cleanedIconsPromises = iconFiles
    /* use hi-res versions only */
    .filter(iconFile => iconFile.match(/-15\.svg$/))
    .map(iconFile => new Promise(async (resolve, reject) => {
      try {
        const svgStream = await readFile(`${path.resolve(options.styleDir)}/icons/${iconFile}`)
        const cleanSvg = await keepPictoOnly(svgStream)
        const iconName = iconFile.match(/^(.*?)-[0-9]{1,2}\.svg$/)[1];
        const iconPath = path.join(tmpSvgs.name,  `${iconName}.svg`);
        fs.writeFileSync(iconPath, cleanSvg)
        resolve(iconPath)
      } catch(e) {
        reject(e)
      }
    }))

  const cleanedIconFiles = await Promise.all(cleanedIconsPromises)

  /* build font */
  return new Promise((resolve, reject) => {
    webfontsGenerator({
      fontHeight : 150,
      files: cleanedIconFiles,
      dest: `${path.resolve(options.styleDir)}/build/font`
    }, (error, result) => {
      tmpSvgs.removeCallback()
      if (error) {
        console.error('Error while building webfont!', error);
        reject(err)
      } else {
        console.log(`Webfont built (${cleanedIconFiles.length} glyphs)`);
        resolve()
      }
    })
  })
}
