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
  /** Export style in console
   */
  export: () => {
    console.log(JSON.stringify(mvt._glStyle, null, ' '))
  }
}