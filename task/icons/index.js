const nodeYaml = require('node-yaml')
const path = require('path')

module.exports = (options, style) => {
  if(options.icons) {
    let styleDir = options.styleDir
    const layerConfigPath = path.resolve(`${styleDir}/icons.yml`)

    const icons = nodeYaml.readSync(layerConfigPath)
    let iconsCases = ["case"]
    let colorsCases = ["case"]

    icons.forEach((icon) => {
      if (icon.class && icon.subclass) {

        iconsCases.push(["==",
          ["get", "subclass"],
          icon.subclass])
        iconsCases.push(icon.iconName)
        if (icon.color) {
          colorsCases.push(["all", ["==",
              ["get", "subclass"],

              icon.subclass],
              ["==",
                ["get", "class"],

                icon.class]
            ]
          )
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

    iconsCases.push('default')
    colorsCases.push('#123456')


    style.layers.forEach((layer) => {
      if (layer.id.match(/poi-level-/)) {
        layer.layout['icon-image'] = iconsCases
        layer.paint['text-color'] = colorsCases
      }
    })
  }


  return style

}






/*
["case",
  ["==",
    ["get", "subclass"],
    "restaurant"],
  "town-hall-11",
  ["==",
    ["get", "subclass"],
    "hotel"],
  "lodging-11",
  "grocery-11"
]*/