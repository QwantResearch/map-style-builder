exports.adjustStyleWithoutTilejson = function(opts) {

  var style = opts.style;
  var conf = opts.conf_url;
  var tileschema_base = opts.tileschema_base;
  var tileschema_poi = opts.tileschema_poi;

  delete style.created;
  delete style.draft;
  delete style.modified;
  delete style.owner;

  if (style.sources['basemap']) {
    let schema_basemap = {...tileschema_base}
    delete schema_basemap.vector_layers
    style.sources['basemap'] = {
      ...schema_basemap,
      "type": "vector",
      "tiles": conf.tileserver_base,
    }
  }
  if (style.sources['poi']) {
    let schema_poi = {...tileschema_poi}
    delete schema_poi.vector_layers
    style.sources['poi'] = {
      ...schema_poi,
      "type": "vector",
      "tiles": conf.tileserver_poi,
    }
  }
  if (opts.needSprite) {
    style.sprite = conf.spriteserver + "sprite";
  } else {
    delete style.sprite;
  }

  style.glyphs = conf.fontserver + "{fontstack}/{range}.pbf";

};

exports.adjustStyleWithTilejson = function(opts) {

  var style = opts.style;
  var tileschema_base = opts.tileschema_base;
  var tileschema_poi = opts.tileschema_poi;
  var conf = opts.conf_url;

  delete style.created;
  delete style.draft;
  delete style.modified;
  delete style.owner;

  if (style.sources['basemap']) {
    tileschema_base['type'] = "vector";
    tileschema_base['tiles'] = conf.tileserver_base;
    style.sources['basemap'] = tileschema_base;
  }
  if (style.sources['poi']) {
    tileschema_poi['type'] = "vector";
    tileschema_poi['tiles'] = conf.tileserver_poi;
    style.sources['poi'] = tileschema_poi;
  }
  if (opts.needSprite) {
    style.sprite = conf.spriteserver + "sprite";
  } else {
    delete style.sprite;
  }

  style.glyphs = conf.fontserver + "{fontstack}/{range}.pbf";
};

exports.adjustStyleForMapTilerCloud = function(opts) {

  var style = opts.style;

  delete style.created;
  delete style.draft;
  delete style.modified;
  delete style.owner;

  if (style.sources['basemap']) {
    style.sources['basemap'] = {
      "type": "vector",
      "url": "https://maps.tilehosting.com/data/v3.json?key=TwYZ3xrAkaB6GkhLM2vS"
    }
  }
  if (style.sources['poi']) {
    style.sources['poi'] = {
      "type": "vector",
      "url": "https://maps.tilehosting.com/data/v3.json?key=TwYZ3xrAkaB6GkhLM2vS"
    }
  }

  if (opts.needSprite) {
    style.sprite = "https://qwant.github.io/qwant-basic-gl-style/sprite";
  } else {
    delete style.sprite;
  }

  style.glyphs = "https://qwant.github.io/qwant-maps-fonts/{fontstack}/{range}.pbf";


};
