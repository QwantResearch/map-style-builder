const xml2js = require('xml2js');
const xmlBuilder = new xml2js.Builder()
const util = require('util')
const parseString = util.promisify(xml2js.parseString)
const colorLib = require('color');

const isWhite = color => colorLib(color).hex() === '#FFFFFF';

module.exports.parseIcon = async function(svgStream) {
  let data = await parseString(svgStream)

  let backgroundColor = (data.svg.rect || [])
    .map(rectNode => rectNode['$'].fill)
    .filter(color => color && color !== 'none' && !isWhite(color))
    [0];

  const pictoColor = data.svg.path && data.svg.path[0].$.fill || '#ffffff';

  delete data.svg.rect
  const picto = xmlBuilder.buildObject(data);
  return { picto, pictoColor, backgroundColor };
}

function setNodesAttrs(nodes, attributes) {
  return nodes.map(node => ({
    ...node,
    $: {
      ...node.$,
      ...attributes,
    }
  }));
}

async function getColoredPin(pinStream, color) {
  const pinData = await parseString(pinStream);
  pinData.svg.g[0].path = setNodesAttrs(pinData.svg.g[0].path, {
    fill: color,
    stroke: colorLib(color).darken(0.2).hex(),
  });
  return pinData;
}

module.exports.combinePictoPin = async function(pinStream, { picto, pictoColor, backgroundColor, transform = 'translate(-0.5 -0.5)' }) {
  let pinColor;
  if (!isWhite(pictoColor)) {
    pinColor = pictoColor;
  } else {
    pinColor = backgroundColor;
  }
  const pinData = await getColoredPin(pinStream, pinColor);
  const pictoData = await parseString(picto);
  const pictoGroup = { $: { transform }};
  if (pictoData.svg.path) {
    pictoGroup.path = setNodesAttrs(pictoData.svg.path, { fill: '#fff' });
  }
  if (pictoData.svg.g) {
    pictoGroup.g = setNodesAttrs(pictoData.svg.g, { fill: '#fff' });
  }
  pinData.svg.g.push(pictoGroup);
  return xmlBuilder.buildObject(pinData);
}
