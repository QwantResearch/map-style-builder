const path = require('path');

const styleTest = require('./style')
const layerTest = require('./layers')
const fontTest = require('./fonts')
const i18nTest = require('./i18n')
const iconsTest = require('./icons')

let args = require('./../lib/style_args').argv;

const styleDir = path.resolve(args.style_dir);
const stylePath = path.resolve(`${styleDir}/style.json`);
const style = require(stylePath);


styleTest(style);
i18nTest(style, styleDir);
layerTest(style, stylePath);
fontTest(style);
iconsTest(style, styleDir, args);

