var fs = require('fs-extra');
var transform = require('./transform.js');


fs.copySync('compare.html', 'build/compare.html');
fs.copySync('debug.html', 'build/debug.html');


var needSprite = fs.existsSync('../icons');
var slug = "qwantresearch/qwantmaps";

var stylePath = '../style.json';
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
outPath = 'build/style-dev.json';
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');


style = JSON.parse(styleStr);
transform.adjustStyleForOpenMapTilesCDN({
  style: style,
  needSprite: needSprite,
  slug: slug
});
outPath =  'build/style-omt.json';
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
outPath =  'build/style-local.json';
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
outPath = 'build/style-prod.json';
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');
