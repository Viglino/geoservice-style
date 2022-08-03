import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import { applyStyle } from 'ol-mapbox-style';
import Ajax from 'ol-ext/util/Ajax'
import MVTFormat from 'ol/format/MVT'

/**
 * A layer that use a vector style json file
 * @memberof ol.layer
 * @constructor
 * @extends {VectorTileLayer}
 * @param {Object} options
 *	@param {string} [options.url] source style url
 *  @param {string} [options.title] layer title, default use the style layer name
 * @fires style:load
 * @fires style:apply
 */
class MVT extends VectorTileLayer {
  constructor(options) {
    const opt = {
      title: options.title || 'MVT',
      type: 'MVT',
      // renderMode: 'hybrid',
      /*
      source: new VectorTileSource({
        format: new MVTFormat,
      }),
      */
      declutter: true
    }
    super(opt);
    if (options.url) {
      this.loadMapboxStyle({
        url: options.url,
        useTitle: !options.title
      })
    }
  }
}

/** Load a mapbox style file and apply it to the layer
 * @param {Object} options
 *  @param {string} options.url styleUrl 
 *  @param {string} [options.source] source key, default use the first source in the style object
 *  @param {boolean} [options.useTitle] get the layer name in the glStyle
 */
VectorTileLayer.prototype.loadMapboxStyle = function(options) {
  this.set('styleUrl', options.url)
  Ajax.get({
    url: options.url,
    success: (style) => {
      if (options.useTitle) {
        this.set('title', style.name || 'MVT');
      }
      // Get first tile source
      if (!options.source) options.source = Object.keys(style.sources)[0];
      this.applyStyle(style, options.source);
      // this.getSource().setUrl(style.sources[options.source].tiles[0]);
      // New style loaded
      this.dispatchEvent({ type: 'style:load', source: options.source, style: style });
    }
  });
};

/** Apply style
 * @param {Object} glStyle
 * @param {string} [source] source key, default use the first source in the style object
 */
VectorTileLayer.prototype.applyStyle = function(glStyle, source) {
  // If no source, get first source
  if (!source) source = Object.keys(glStyle.sources)[0];
  // Save style
  this._glStyle = glStyle;
  // Apply
  applyStyle(this, glStyle, source).then(() => {
    this.dispatchEvent({ type: 'style:apply', source: source, style: glStyle });
  });
};

export default MVT
