var fs = require('fs-extra');

exports.transform = function() {

fs.copySync('index.html', 'build/index.html');

var style = JSON.parse(fs.readFileSync('../style.json', 'utf8'));
delete style.created;
delete style.draft;
delete style.id;
delete style.modified;
delete style.owner;
style.sources = {
  "composite": {
    "type": "vector",
    "url": "https://osm2vectortiles.tileserver.com/v3.json"
  }
};
style.sprite = "https://klokantech.github.io/osm-bright-gl-style/sprite";
//style.glyphs = "fonts/{fontstack}/{range}.pbf";

style.layers.forEach(function(layer) {
  if(layer.layout && layer.layout['text-font']) {
    layer.layout['text-font'] = layer.layout['text-font'].slice(0,1);
  }
});


fs.writeFileSync('build/style.json', JSON.stringify(style, null, 2), 'utf8');

};

