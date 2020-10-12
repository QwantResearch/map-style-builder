const fs = require('fs')
const util = require('util')
const path = require('path')

const { parseIcon, combinePictoPin } = require('../../lib/svg_icon');

const excludeList = [
  // street furniture
  'barrier',
  'information',
  'post-box',
  'telephone',
  'waste-basket',
  // place types
  'home',
  'residential-community',
  'town',
];

module.exports = async (options) => {
  const readFile = util.promisify(fs.readFile)
  const readdir = util.promisify(fs.readdir)

  const iconFiles = await readdir(`${path.resolve(options.styleDir)}/icons`)
  const pinStream = await readFile(path.join(__dirname, 'pin-mini.svg'));
  fs.mkdirSync(path.join(options.outPath, 'pins'), { recursive: true });

  const pinPromises = iconFiles
    /* use lo-res versions, like for the POI layers */
    .filter(iconFile => iconFile.match(/-11\.svg$/))
    .map(iconFile => iconFile.match(/^(.*?)-[0-9]{1,2}\.svg$/)[1])
    .filter(iconName => !excludeList.includes(iconName))
    .map(iconName => new Promise(async (resolve, reject) => {
      try {
        const svgStream = await readFile(`${path.resolve(options.styleDir)}/icons/${iconName}-11.svg`)
        const { picto, color } = await parseIcon(svgStream)
        const pinWithPicto = await combinePictoPin(pinStream, picto, color);
        const iconPath = path.join(options.outPath, 'pins',  `pin-${iconName}.svg`);
        fs.writeFileSync(iconPath, pinWithPicto)
        resolve(iconPath)
      } catch(e) {
        console.error(`Error processing icon ${iconName}`, e);
        reject(e)
      }
    }))

  return Promise.all(pinPromises).then(() => {
    console.log(`${pinPromises.length} pins built, written in ${path.join(options.outPath, 'pins')}`);
  }, error => {
    console.error('Error while building pinPromises!', error);
  });
}
