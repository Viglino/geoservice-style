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
const select = new Select({
  hitTolerance: 2,
  condition: click
});
select.on('select', e => {
  const f = e.selected[0];
  if (f) {
    console.log(f.getProperties())
  }
})
map.addInteraction(select);

// Hover interaction
import Hover from 'ol-ext/interaction/Hover'
import { click } from 'ol/events/condition'
import Popup from 'ol-ext/overlay/Popup'
const popup = new Popup({
  positioning: 'bottom-center'
})
map.addOverlay(popup)
const hover = new Hover({
  cursor: 'pointer',
  hitTolerance: 2
})
hover.on('hover', e => {
  const f = e.feature
  if (f) {
    popup.show(e.coordinate, f.get('layer')+'<br/>'+(f.get('symbo') || ''))
  } else {
    popup.hide()
  }
})
map.addInteraction(hover)

export { mvt }

export default map
