const xml2js = require('xml2js');
const webfontsGenerator = require('webfonts-generator');
const tmp = require('tmp')

const asyncParseString = xml2js.parseString
const fs = require('fs')
const util = require('util')
const path = require('path')


module.exports = async (options) => {
  /* promisify */
  const readFile = util.promisify(fs.readFile)
  const readdir = util.promisify(fs.readdir)
  const parseString = util.promisify(asyncParseString)

  if(options.webfont) {
    let icons = await readdir(`${path.resolve(options.styleDir)}/icons`)
    const tmpSvgs = tmp.dirSync({unsafeCleanup : true})

    /* clean circle form from SVG */
    let iconsPromises = icons.filter((icon) => {
      /* clean size from svg */
      return icon.match(/-15\.svg$/)
    }).map((icon) => {
      const xmlBuilder = new xml2js.Builder()
      return new Promise(async (resolve, reject) => {
        try {
          let svgStream = await readFile(`${path.resolve(options.styleDir)}/icons/${icon}`)
          let data = await parseString(svgStream)
          delete data.svg.rect
          const xml = xmlBuilder.buildObject(data)
          let iconName = icon.match(/^(.*?)-[0-9]{1,2}\.svg$/)[1]
          fs.writeFileSync(`${tmpSvgs.name}/${iconName}.svg`,xml)
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
}
