const xml2js = require('xml2js');
const xmlBuilder = new xml2js.Builder()
const util = require('util')
const parseString = util.promisify(xml2js.parseString)
const colorLib = require('color');

const ignoreColors = ['none', '#FFF', '#fff', '#ffffff', '#FFFFFF'];

module.exports.parseIcon = async function(svgStream) {
  let data = await parseString(svgStream)

  const color = (data.svg.rect || [])
    .map(rectNode => rectNode['$'].fill)
    .filter(color => color && !ignoreColors.includes(color))[0];

  delete data.svg.rect
  const picto = xmlBuilder.buildObject(data);
  return { picto, color };
}

function modifyNodes(nodes, attributes) {
  return nodes.map(node => {
    const n = node;
    // console.log(node);
    node.$ = {
      ...node.$,
      ...attributes,
    }
    return n;
  })
}

module.exports.getColoredPin = async function(pinStream, color) {
  const pinData = await parseString(pinStream);
  pinData.svg.g[0].path[1]['$'].fill = color;
  pinData.svg.g[0].path[0]['$'].stroke = colorLib(color).darken(0.2);
  return xmlBuilder.buildObject(pinData);
}

module.exports.combinePictoPin = async function(pinStream, pictoStream) {
  const pinData = await parseString(pinStream);
  const pictoData = await parseString(pictoStream);
  if (pictoData.svg.path) {
    const pictoPaths = pictoData.svg.path
    pinData.svg.path = modifyNodes(pictoPaths, {
      fill: '#fff',
      transform: 'translate(5.5, 5.5) scale(0.75)'
    })
  }
  if (pictoData.svg.g) {
    const pictoGroups = modifyNodes(pictoData.svg.g, {
      fill: '#fff',
      transform: 'translate(5.5, 5.5) scale(0.75)'
    })
    pictoGroups.forEach(g => pinData.svg.g.push(g));
  }
  return xmlBuilder.buildObject(pinData);
}
