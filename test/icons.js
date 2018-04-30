const yaml = require('node-yaml');
const path = require('path');
const fs = require('fs');

module.exports = (style, styleDir, args) => {
  console.log('--- Test icons descriptions ---')
  if(args.icons) {


    let iconError = false;
    const iconsDescriptions = yaml.readSync(path.resolve(`${styleDir}/icons.yml`));

    if (!iconError) {
      const iconWarnings = [];
      const svgMissings = [];

      iconsDescriptions.mappings.forEach((mapping) => {
        if (!mapping.color || !mapping.iconName) {
          iconWarnings.push(mapping);
          try {
            fs.openSync(path.resolve(`${styleDir}/icons/${mapping.iconName}.svg`), 'r');
          } catch (e) {
            svgMissings.push(mapping.iconName);
          }
        }
      });

      if (svgMissings.length > 0) {
        console.error(`Warning ${svgMissings.length} svg file missing`);
        svgMissings.forEach((svgMissing) => {
          console.error(`❌ ${svgMissing}`);
        })
      } else {
        console.log('✓ no missing svg');
      }

      if (iconWarnings.length > 0) {
        console.error(`Warning ${iconWarnings.length} incomplete icons data`);
        iconWarnings.forEach((iconWarning) => {
          if (!iconWarning.color) {
            console.error(`❌ color missing ${iconWarning.class ? iconWarning.class : ''} ${iconWarning.subclass ? iconWarning.subclass : ''}`);
          } else {
            console.error(`❌ icon missing ${iconWarning.class ? iconWarning.class : ''} ${iconWarning.subclass ? iconWarning.subclass : ''}`);
          }

        })
      } else {
        console.log('✓ ok icon config file is complete');
      }

    } else {
      console.warn('No icons.yml file given');
    }

    /* test layers */
    let poiLayer = style.layers.find((layer) => {
      return layer.id.match(/poi-level-/);
    });

    if (!poiLayer) {
      console.error('❌ No poi layer found, one layer name must match /poi-level-/');
    }
  } else {
    console.log('icon parameter missing : skip')
  }
};
