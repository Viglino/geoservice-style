import map, { mvt } from './map'
import './github'

import './index.css'

/* DEBUG */
window.mvt = mvt;
window.map = map;
/**/

/**
 */
window.api = {
  /** Replace paint 
   * @param {Object} lut paint look up table
   * @param {function} filter a function that takes a layer and return a boolean
   */
  paint: function (lut, filter){
    var layers = mvt._glStyle.layers;
    layers.forEach(l => {
      if (filter(l)) {
        Object.keys(lut).forEach(k => {
          if (l.paint[k]) l.paint[k] = lut[k]
        })
      }
    })
    mvt.applyStyle(mvt._glStyle)
  },
  
  layout: function (lut, filter){
    var layers = mvt._glStyle.layers;
    layers.forEach(l => {
      if (filter(l)) {
        Object.keys(lut).forEach(k => {
          if (l.layout[k]) l.layout[k] = lut[k]
        })
      }
    })
    mvt.applyStyle(mvt._glStyle)
  },
  
  /** Remove invisible layers
   * @param {function} filter a function that takes a layer and return true to keep it
   */
  clean: (filter) => {
    if (!filter) filter = function(l) { return l.layout.visibility === "visible" }
    var layers = mvt._glStyle.layers;
    var nlayers = []
    layers.forEach(l => {
      if (filter(l)) nlayers.push(l)
    })
    mvt._glStyle.layers = nlayers;
    mvt.applyStyle(mvt._glStyle)
  },
  /** Copy layers from an other json
   */
  copy: function(from) {
    // lut
    var layer0 = {}
    from.layers.forEach(l => layer0[l.id] = l)
    // Replace
    var layers = mvt._glStyle.layers;
    layers.forEach((l,i) => {
      if (layer0[l.id]) {
        layers[i] = layer0[l.id]
        delete(layer0[l.id])
      }
    })
    // Find missing
    if (Object.keys(layer0).length !== 0) {
      var tmp = []
      Object.keys(layer0).forEach(k => tmp.push(layer0[k]))
      console.log(JSON.stringify(tmp, null, ' '))
    }
    // Apply
    mvt.applyStyle(mvt._glStyle)
  },
  /** Save to local storage
   */
  save: () => {
    localStorage.mvt = JSON.stringify(mvt._glStyle)
  },
  /** Load from local storage
   */
  load: (b) => {
    var localMvt = JSON.parse(localStorage.mvt);
    if (b) {
      mvt._glStyle = localMvt;
      mvt.applyStyle(mvt._glStyle)
    }
    return localMvt;
  },
  /** Export style in console
   */
  export: (json) => {
    if (json) return mvt._glStyle;
    console.log(JSON.stringify(mvt._glStyle, null, ' '))
  }
}

/*
api.layout({
    "text-font": [ "Bakbak One" ],
}, l => {
    if (/^toponyme num/i.test(l.id)) console.log(l.id)
    return /^toponyme/i.test(l.id)
})

api.layout({
    "text-font": [ "Audiowide" ],
}, l => {
    return /^toponyme locali/i.test(l.id)
})

api.layout({
    "text-font": [ "Wallpoet" ],
}, l => {
    if (/^toponyme hydro/i.test(l.id)) console.log(l.id)
    return /^toponyme hydro/i.test(l.id)
})
*/