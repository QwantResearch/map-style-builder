const fs = require('fs-extra');
const path = require('path');
const build = require('../lib/build');
const mkdirp = require('mkdirp');

let args = require('./../lib/style_args').argv;

const buildDir = path.join(args['style-dir'], 'build');
const stylePath = path.join(args['style-dir'], 'style.json');
const confStr = fs.readFileSync(args.conf, 'utf8');
const styleStr = fs.readFileSync(stylePath, 'utf8');
const style = JSON.parse(styleStr);
const jsonconf = JSON.parse(confStr);
const webfont = args.webfont
const pins = args.pins

let options = {
  styleDir: args['style-dir'],
  conf: jsonconf,
  pixelRatios: [1,2],
  outPath: buildDir,
  i18n: args['i18n'],
  icons: args['icons'],
  webfont:webfont,
  pins: pins,
};

mkdirp(buildDir)
options.output = 'production';
const builtStyle = build(style, options);
outPath = path.join(buildDir, 'built-style.json');
fs.writeFileSync(outPath, builtStyle, 'utf8');

// options.webfont = false; // we don't need build sprite & font twice */
// options.needSprite = false
// options.pins = false

// options.output = 'debug'
// const builtStyleDebug = build(style, options);
// outPath = path.join(buildDir, 'built-style-debug.json');
// fs.writeFileSync(outPath, JSON.stringify(JSON.parse(builtStyleDebug), null, 2), 'utf8'); //trick to restore formatting

// options.output = 'omt';
// const builtStyleOmt = build(style, options);
// outPath = path.join(buildDir, 'style-omt.json');
// fs.writeFileSync(outPath, builtStyleOmt, 'utf8');


fs.copySync(path.join(__dirname, '..', 'compare.html'), path.join(buildDir, 'compare.html'));
fs.copySync(path.join(__dirname, '..', 'debug.html'), path.join(buildDir, 'debug.html'));
