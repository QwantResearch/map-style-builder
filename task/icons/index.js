const nodeYaml = require('node-yaml')
const path = require('path')

module.exports = (options, style) => {
  if(options.icons) {
    let styleDir = options.styleDir
    const layerConfigPath = path.resolve(`${styleDir}/icons.yml`)
    let icons = null
    try {
      icons = nodeYaml.readSync(layerConfigPath)
    } catch (e) {
      throw `You passed icon argument to true but there is no icon.yml file.`
    }

    let iconsCases = ["case"]
    let colorsCases = ["case"]

    icons.mappings.forEach((icon) => {
      if (icon.class && icon.subclass) {
        let iconSelector = ["all", ["==",
          ["get", "subclass"],
          icon.subclass],
          ["==",
            ["get", "class"],

            icon.class]
        ]
        iconsCases.push(iconSelector)
        iconsCases.push(icon.iconName)
        if (icon.color) {
          colorsCases.push(iconSelector)
          colorsCases.push(icon.color)
        }

      } else if (icon.class) {
        iconsCases.push(["==",
          ["get", "class"],
          icon.class])
        iconsCases.push(icon.iconName)
        if (icon.color) {
          colorsCases.push(["==",
            ["get", "class"],
            icon.class])
          colorsCases.push(icon.color)
        }
      } else {
        iconsCases.push(["==",
          ["get", "subclass"],
          icon.subclass])
        iconsCases.push(icon.iconName)
        if (icon.color) {
          colorsCases.push(["==",
            ["get", "subclass"],
            icon.subclass])
          colorsCases.push(icon.color)
        }
      }
    })

    iconsCases.push(icons.defaultIcon)
    colorsCases.push(icons.defaultColor)


    style.layers.forEach((layer) => {
      if (layer.id.match(/poi-level-/)) {
        layer.layout['icon-image'] = iconsCases
        layer.paint['text-color'] = colorsCases
      }
    })
  }

  return style
}
