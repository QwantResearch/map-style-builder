const xml2js = require('xml2js');
const xmlBuilder = new xml2js.Builder()
const util = require('util')
const parseString = util.promisify(xml2js.parseString)

module.exports = async function(svgStream) {
  let data = await parseString(svgStream)
  delete data.svg.rect
  return xmlBuilder.buildObject(data)
}
