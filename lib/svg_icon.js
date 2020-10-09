const xml2js = require('xml2js');
const xmlBuilder = new xml2js.Builder()
const util = require('util')
const parseString = util.promisify(xml2js.parseString)
const colorLib = require('color');

const ignoreColors = ['none', '#FFF', '#fff', '#ffffff', '#FFFFFF'];
const TRANSPORT_BLUE = '#123295';

module.exports.parseIcon = async function(svgStream) {
  let data = await parseString(svgStream)

  let color = (data.svg.rect || [])
    .map(rectNode => rectNode['$'].fill)
    .filter(color => color && !ignoreColors.includes(color))[0];
  if (!color) {
    color = TRANSPORT_BLUE;
  }

  delete data.svg.rect
  const picto = xmlBuilder.buildObject(data);
  return { picto, color };
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
    stroke: colorLib(color).darken(0.2),
  });
  return pinData;
}

module.exports.combinePictoPin = async function(pinStream, pictoStream, color) {
  const pinData = await getColoredPin(pinStream, color);
  const pictoData = await parseString(pictoStream);
  const pictoGroup = { $: { transform: 'translate(-0.5 -0.5)' }};
  if (pictoData.svg.path) {
    pictoGroup.path = setNodesAttrs(pictoData.svg.path, { fill: '#fff' });
  }
  if (pictoData.svg.g) {
    pictoGroup.g = setNodesAttrs(pictoData.svg.g, { fill: '#fff' });
  }
  pinData.svg.g.push(pictoGroup);
  return xmlBuilder.buildObject(pinData);
}
