# "GL Style Builder" package

Some tools to build, debug and publish GL Style at Qwant


## Build
The build command will generate some sprites out of your icons folder and create style files with the url of the tileservers.

#### Requirements
- A repository with
  - Style saved as a `style.json`
  - TileJSON, with the schema of the tiles, saved as `tileschema_base.json` and  `tileschema_poi.json`
  - Icons used in style saved as SVG files inside `icons/`
- A json configuration file, with some url in it. See `prod_conf.json` if you need inspiration

#### Usage
`npm run build_all -- --style-dir PATH/TO/YOUR/MAPSTYLE/FOLDER --conf PATH/TO/YOUR/CONF`

You can also build localised versions of your style, using the `i18n` parameter (`npm run build_all -- --style-dir PATH/TO/YOUR/MAPSTYLE/FOLDER --conf PATH/TO/YOUR/CONF --i18n fr`)

You can also define this package as a dependency of your style node package.

You can also define webfont generation using `--webfont=true` this will create a subfolder containing webfont (css + ttf + woff) inside build folder

You can also define icons sourcing generation using `--icons=true` this will read icons.yml and create rules to the style displaying icons using class & subclass definitions

### Test
`npm test -- PATH/TO/YOUR/MAPSTYLE/FOLDER` to check if your style is ok

## Compare
You can use the built `compare.html` page to check your style builds.

You need to insert a valid Mapbox token in the built `compare.html` page.

## Debug
You can use the built `debug.html` page to inspect your tiles et check your style
