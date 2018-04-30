const mbgl = require('@mapbox/mapbox-gl-style-spec');

module.exports = (style) => {

  console.log('--- Test style validator ---');
  const errors = mbgl.validate(style);
  if (errors && errors.length) {
    console.error('ERROR: The style is not valid according to mapbox-gl-style-spec.');
    console.error(errors);
    process.exit(1);
  } else {
    console.log('✓ The style is valid according to mapbox-gl-style-spec.');
  }
}
