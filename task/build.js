var fs = require('fs-extra');
var transform = require('./transform.js');


fs.copySync('compare.html', 'build/compare.html');
fs.copySync('debug.html', 'build/debug.html');


var needSprite = fs.existsSync('../icons');
var slug = "qwantresearch/qwantmaps";

var stylePath = '../style.json';
var styleStr = fs.readFileSync(stylePath, 'utf8');

var langCfgPath = '../lang-fallback.json';
if (fs.existsSync(langCfgPath)) {
  var langCfgStr = fs.readFileSync(langCfgPath, 'utf8');
  var langCfg = JSON.parse(langCfgStr);
}

var style, outPath;
if (langCfg) {
  style = JSON.parse(styleStr);
  transform.adjust_style_without_tilejson({
    style: style,
    needSprite: needSprite,
    slug: slug,
    langCfg: langCfg
  }, [
    "http://a.dev.tiles.maps.qwant.ninja:6533/oz/{z}/{x}/{y}.pbf",
    "http://b.dev.tiles.maps.qwant.ninja:6533/oz/{z}/{x}/{y}.pbf",
    "http://c.dev.tiles.maps.qwant.ninja:6533/oz/{z}/{x}/{y}.pbf"
  ], [
    "http://a.dev.tiles.maps.qwant.ninja:6533/poi/{z}/{x}/{y}.pbf",
    "http://b.dev.tiles.maps.qwant.ninja:6533/poi/{z}/{x}/{y}.pbf",
    "http://c.dev.tiles.maps.qwant.ninja:6533/poi/{z}/{x}/{y}.pbf"
  ]);
  fs.writeFileSync('build/style-dev.json', JSON.stringify(style, null, 2), 'utf8');
}

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
outPath = langCfg ? 'build/style-dev-undecorated.json' : 'build/style-dev.json';
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');

if (langCfg) {
  style = JSON.parse(styleStr);
  transform.adjustStyleForOpenMapTilesCDN({
    style: style,
    needSprite: needSprite,
    slug: slug,
    langCfg: langCfg
  });
  fs.writeFileSync('build/style-omt.json', JSON.stringify(style, null, 2), 'utf8');
}

style = JSON.parse(styleStr);
transform.adjustStyleForOpenMapTilesCDN({
  style: style,
  needSprite: needSprite,
  slug: slug
});
outPath = langCfg ? 'build/style-omt-undecorated.json' : 'build/style-omt.json';
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');
if (langCfg) {
  style = JSON.parse(styleStr);
  transform.adjust_style_without_tilejson({
    style: style,
    needSprite: needSprite,
    slug: slug,
    langCfg: langCfg
  }, [
    "http://localhost:6533/oz/{z}/{x}/{y}.pbf"
  ], [
    "http://localhost:6533/poi/{z}/{x}/{y}.pbf"
  ]);
  fs.writeFileSync('build/style-docker.json', JSON.stringify(style, null, 2), 'utf8');
}

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
outPath = langCfg ? 'build/style-docker-undecorated.json' : 'build/style-local.json';
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');


if (langCfg) {
  style = JSON.parse(styleStr);
  transform.adjust_style_without_tilejson({
    style: style,
    needSprite: needSprite,
    slug: slug,
    langCfg: langCfg
  }, [
    "http://a.tiles.maps.qwant.com/oz/{z}/{x}/{y}.pbf",
    "http://b.tiles.maps.qwant.com/oz/{z}/{x}/{y}.pbf",
    "http://c.tiles.maps.qwant.com/oz/{z}/{x}/{y}.pbf"
  ], [
    "http://a.tiles.maps.qwant.com/poi/{z}/{x}/{y}.pbf",
    "http://b.tiles.maps.qwant.com/poi/{z}/{x}/{y}.pbf",
    "http://c.tiles.maps.qwant.com/poi/{z}/{x}/{y}.pbf"
  ]);
  fs.writeFileSync('build/style-prod.json', JSON.stringify(style, null, 2), 'utf8');
}

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
outPath = langCfg ? 'build/style-prod-undecorated.json' : 'build/style-prod.json';
fs.writeFileSync(outPath, JSON.stringify(style, null, 2), 'utf8');
