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
  /** Export style
   */
  export: () => {
    console.log(JSON.stringify(mvt._glStyle, null, ' '))
  }
}