const mbgl = require('@mapbox/mapbox-gl-style-spec');
const fs = require('fs');

module.exports = (style, stylePath) => {
  console.log('--- Test required layers ---');
  if (!style.sources.basemap) {
    console.log('WARNING: Style does not contain "basemap" source.');
  }
  if (!style.sources.poi) {
    console.log('WARNING: Style does not contain "poi" source.');
  }
  if (!style.metadata['openmaptiles:version']) {
    console.log('WARNING: Style does not contain "openmaptiles:version" metadata.');
  }

  const formattedStyleString = mbgl.format(style);
  const styleString = fs.readFileSync(stylePath, 'utf8');

  if (styleString.trim() !== formattedStyleString.trim()) {
    console.log(
`WARNING: Style is not correctly formatted. You should use "gl-style-format"
before commit. See https://github.com/mapbox/mapbox-gl-js/blob/master/src/style-spec/README.md`);
  }
}
