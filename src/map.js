// Import ol styles
import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'

import Map from 'ol/Map'
import View from 'ol/View'
import ol_ext_element from 'ol-ext/util/element'
import Permalink from 'ol-ext/control/Permalink'
import Select from 'ol/interaction/Select'
import Feature from 'ol/render/Feature'
import Geoportail from 'ol-ext/layer/Geoportail'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

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
const plink = new Permalink({ visible: false })
map.addControl(plink)

map.addLayer(new Geoportail({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' }))

// MVT Layer
const layer = plink.getUrlParam('layer') || 'erp'
const mvt = new MVT({
  url: './' + layer + '/' + layer + '.json'
})
map.addLayer(mvt)

map.addControl(new LayerSwitcher)

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

hover.on('leave', () => {
  popup.hide()
});


hover.on('hover', e => {
  const f = e.feature
  if (f) {
    popup.show(e.coordinate, f.get('layer')+ ' ' + (f.get('type_principal') || '') + '<br/>'+(f.get('symbo') || f.get('libelle') || ''))
  } else {
    popup.hide()
  }
})
map.addInteraction(hover)

export { mvt }

export default map
