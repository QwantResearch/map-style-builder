const fs = require('fs')
const util = require('util')
const path = require('path')

const { parseIcon, combinePictoPin } = require('../../lib/svg_icon');

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
    .map(iconName => new Promise(async (resolve, reject) => {
      try {
        const svgStream = await readFile(`${path.resolve(options.styleDir)}/icons/${iconName}-11.svg`)
        const pictoData = await parseIcon(svgStream)
        if (['home', 'residential-community', 'town'].includes(iconName)) {
          pictoData.transform = 'translate(1.25 1.25)';
        }
        const pinWithPicto = await combinePictoPin(pinStream, pictoData);
        const iconPath = path.join(options.outPath, 'pins',  `pin-${iconName}.svg`);
        fs.writeFileSync(iconPath, pinWithPicto)
        resolve(iconPath)
      } catch(e) {
        console.error(`Error processing icon ${iconName}`, e);
        reject(e)
      }
    }))

  return Promise.all(pinPromises).then(pinIconPaths => {
    console.log(`${pinPromises.length} pins built, written in ${path.join(options.outPath, 'pins')}`);
    return pinIconPaths;
  }, error => {
    console.error('Error while building pinPromises!', error);
  });
}
