const fs = require('fs')
const util = require('util')
const path = require('path')

const { parseIcon, combinePictoPin, getColoredPin } = require('../../lib/svg_icon');

module.exports = async (options) => {
  const readFile = util.promisify(fs.readFile)
  const readdir = util.promisify(fs.readdir)

  const iconFiles = await readdir(`${path.resolve(options.styleDir)}/icons`)
  const pinStream = await readFile('pin-mini.svg');
  fs.mkdirSync(path.join(options.styleDir, 'build/pins'), { recursive: true });

  const pinPromises = iconFiles
    /* use hi-res versions only */
    .filter(iconFile => iconFile.match(/-11\.svg$/))
    // .slice(0, 26)
    .map(iconFile => new Promise(async (resolve, reject) => {
      try {
        const svgStream = await readFile(`${path.resolve(options.styleDir)}/icons/${iconFile}`)
        const { picto, color } = await parseIcon(svgStream)
        console.log(iconFile, color);
        const coloredPin = await getColoredPin(pinStream, color);
        const pinWithPicto = await combinePictoPin(coloredPin, picto);
        const iconName = iconFile.match(/^(.*?)-[0-9]{1,2}\.svg$/)[1];
        const iconPath = path.join(options.styleDir, 'build/pins',  `${iconName}.svg`);
        fs.writeFileSync(iconPath, pinWithPicto)
        resolve(iconPath)
      } catch(e) {
        reject(e)
      }
    }))

  return Promise.all(pinPromises).then(() => {
    console.log(`${pinPromises.length} pins built`);
  }, error => {
    console.error('Error while building pinPromises!', error);
  });
}
