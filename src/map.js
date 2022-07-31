// Import ol styles
import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'

import Map from 'ol/Map'
import View from 'ol/View'
import ol_ext_element from 'ol-ext/util/element'
import Permalink from 'ol-ext/control/Permalink'
import Select from 'ol/interaction/Select'
import Feature from 'ol/render/Feature'

import MVT from './MVT'

// Create map
const map = new Map({
  view: new View({
    center: [0,0],
    zoom: 1
  }),
  target: ol_ext_element.create('DIV', { 
    className: 'map',
    parent: document.body
  })
})
map.addControl(new Permalink({ visible: false }))
// Layer
const mvt = new MVT({
  url: './space/space.json'
})
map.addLayer(mvt)

Feature.prototype.getStyle = () => {}
Feature.prototype.setStyle = () => {}
const select = new Select();
select.on('select', e => {
  const f = e.selected[0];
  if (f) {
    console.log(f.getProperties())
  }
})
map.addInteraction(select);

export { mvt }

export default map
