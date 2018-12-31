# Qwant Maps Style Builder

Some tools to build and debug GL styles for [Qwant Maps](https://github.com/QwantResearch/QwantMaps)

It can be used:

* as a node package. We used it as a a dependency on Erdapfel, Qwant Maps front end application. You can also use it as a dependency of your style node package.
* as a standalone cli application.

This readme explains the common use cases of the standalone version.

## Requirements

You will need a style repository, for instance [Qwant basic style](https://github.com/QwantResearch/qwant-basic-gl-style).
It contains:
  - a template style saved as a `style.json`
  - some config files (`*.yml`) used to overwrite some fields in the template style
  - some TileJSON, with the schema of the tiles, saved as `tileschema_base.json` and  `tileschema_poi.json`
  - many icons used in style saved as SVG files inside `icons` folder

You may also need a configuration file to define the url of your tiles services (vector tiles sources and servers that host the sprites and fonts). If you need inspiration, you can check out `prod_conf.json`, which is the one we use for Qwant Maps production instances (but please note that Qwant instances are internal components and are not meant (yet) to be used directly other than as part of Qwant Maps. You can learn more in our [Terms of services](https://about.qwant.com/fr/legal/cgu/qwant-maps/)))

The builder also create a style version that uses [OpenMapTiles Tilehosting service](https://www.maptiler.com/) which is mostly compatible with Qwant Maps schema. You may want to use this one to debug or contribute ;)

## Test
`npm test -- PATH/TO/YOUR/MAPSTYLE/FOLDER` to check if your style is ok

## Build

The `build_all` command will generate the sprites from the icons and create the GL style file using the icons and i18n config files (from the style directory) and the url of the tile servers (from the conf).

`npm run build_all -- --style-dir PATH/TO/YOUR/MAPSTYLE/FOLDER --conf PATH/TO/YOUR/CONF`

Commons options:
* add `--icons=true` to use the `icons.yml` config file to create the rules in the style for the icon and text-color used
* build a localised versions of your style, using the `i18n` parameter (`npm run build_all -- --style-dir PATH/TO/YOUR/MAPSTYLE/FOLDER --conf PATH/TO/YOUR/CONF --i18n fr`)
* add webfont generation using `--webfont=true`: this will create a subfolder containing webfont (css + ttf + woff) inside build folder

The build command generate a `build` folder inside the style directory. It contains mostly some GL style files (in json) that can be used right away, and some html files detailled to debug.

#### Compare
You can use the built `compare.html` page to compare your style to other ones (only Mapbox Streets for now).

You need to insert a valid Mapbox token in the built `compare.html` page.

If you are not from Qwant, you may also want to replace the [style url](https://github.com/QwantResearch/map-style-builder/blob/master/compare.html#L81) by `style-omt.json` to use the OpenMapTiles version of the style.


#### Debug

You can use the built `debug.html` page to inspect your tiles et check your style.

If you are not from Qwant, you may want to replace the [style url](https://github.com/QwantResearch/map-style-builder/blob/master/debug.html#L35) by `style-omt.json` to use the OpenMapTiles version of the style.
