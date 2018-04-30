module.exports = (style) => {
  console.log('--- Test text-style & test-font ---');
  const layersMissingFontSpec = [];

  style.layers.forEach(function (layer) {
    if (layer.layout &&
      layer.layout['text-field'] &&
      (!layer.layout['text-font'] || layer.layout['text-font'].length === 0)) {
      layersMissingFontSpec.push(layer.id);
    }
  });

  if (layersMissingFontSpec.length > 0) {
    console.error('ERROR: The following layers specify "text-field", but no "text-font":');
    console.error(layersMissingFontSpec.join(', '));
    process.exit(1);
  } else {
    console.log('✓ text-field & text-font ok')
  }
}
