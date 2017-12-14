var fs = require('fs-extra');
var transform = require('./transform.js');
const path = require('path');
var yargs = require('yargs');

let args = yargs
  .usage('Usage: $0 [options]')
  .options({
    style_dir: {
      describe: 'The folder with the style inside it',
      type: 'string',
      demandOption: true,
      nargs: 1
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const buildDir = path.join(args.style_dir,'build');

/*
fs.removeSync(buildDir);
fs.mkdirsSync(buildDir);*/

fs.copySync(path.join(__dirname, '..', 'compare.html'), path.join(buildDir, 'compare.html'));
fs.copySync(path.join(__dirname, '..', 'debug.html'), path.join(buildDir, 'debug.html'));

var needSprite = fs.existsSync(path.join(args.style_dir,'icons'));

/*
if (needSprite){
  //TODO : build sprites and sprite retina
}*/

var slug = "qwantresearch/qwantmaps";

var stylePath = path.join(args.style_dir,'style.json');
var styleStr = fs.readFileSync(stylePath, 'utf8');

var style, outPath;


style = JSON.parse(styleStr);
transform.adjust_style_without_tilejson({
  style: style,
  needSprite: needSprite,
  slug: slug
}, [
  "http://a.dev.tiles.maps.qwant.ninja:6533/oz/{z}/{x}/{y}.pbf",
  "http://b.dev.tiles.maps.qwant.ninja:6533/oz/{z}/{x}/{y}.pbf",
  "http://c.dev.tiles.maps.qwant.ninja:6533/oz/{z}/{x}/{y}.pbf"
], [
  "http://a.dev.tiles.maps.qwant.ninja:6533/poi/{z}/{x}/{y}.pbf",
  "http://b.dev.tiles.maps.qwant.ninja:6533/poi/{z}/{x}/{y}.pbf",
  "http://c.dev.tiles.maps.qwant.ninja:6533/poi/{z}/{x}/{y}.pbf"
]);
outPath = path.join(buildDir,'style-dev.json');
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');


style = JSON.parse(styleStr);
transform.adjustStyleForOpenMapTilesCDN({
  style: style,
  needSprite: needSprite,
  slug: slug
});
outPath = path.join(buildDir,'style-omt.json');
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');


style = JSON.parse(styleStr);
transform.adjust_style_without_tilejson({
  style: style,
  needSprite: needSprite,
  slug: slug
}, [
  "http://localhost:6533/oz/{z}/{x}/{y}.pbf"
], [
  "http://localhost:6533/poi/{z}/{x}/{y}.pbf"
]);
outPath = path.join(buildDir,'style-local.json');
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');



style = JSON.parse(styleStr);
transform.adjust_style_without_tilejson({
  style: style,
  needSprite: needSprite,
  slug: slug
}, [
  "http://a.tiles.maps.qwant.com/oz/{z}/{x}/{y}.pbf",
  "http://b.tiles.maps.qwant.com/oz/{z}/{x}/{y}.pbf",
  "http://c.tiles.maps.qwant.com/oz/{z}/{x}/{y}.pbf"
], [
  "http://a.tiles.maps.qwant.com/poi/{z}/{x}/{y}.pbf",
  "http://b.tiles.maps.qwant.com/poi/{z}/{x}/{y}.pbf",
  "http://c.tiles.maps.qwant.com/poi/{z}/{x}/{y}.pbf"
]);
outPath = path.join(buildDir,'style-prod.json');
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');
