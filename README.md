#NinjaArrows.js
NinjaArrows is a Google Maps/OpenLayers extension that displays arrows at the map's eged showing positions and the number of out-of-bounds markers. By clicking on an arrow the map will extend its bounds to show out-of-bounds markers in a special direction or change its viewport to display only these markers. NinjaArrows.js also allows you to apply a custom style for your arrows including fill color, stroke color and text color. Offsets, edge offset and border offset, are also fully customizable (see more at Explanation Offsets).

- [Google Maps](#google-maps)
- [OpenLayers](#openlayers)
- [Explanation Offsets](#explanation-offsets)
- [Dynamic Colors](#dynamic-colors) **(Google Maps v1.2+ , OpenLayers v1.1+)**

This project was created at [ilogs mobile software GmbH](http://ilogs.com/). Please also visit my blog [NinjaArrows](http://ninjadevs.wordpress.com/ninja-arrows/) to receive the lastest news.

##Usage

###Google Maps
![NinjaArrows in Google Maps](https://ninjadevs.files.wordpress.com/2014/09/gmaps.png)

[>> JSFiddle](http://jsfiddle.net/pL3x6u1c/)

**Creating a new instance**

To use NinjaArrows and its features simply create a new __NinjaArrows__ instance by passing a map to the constructor.
```javascript
var ninjaArrows = new NinjaArrows(map);
```

You can also pass an existing array of Markers to the constructor:
```javascript
var markers = [];

// add markers ...

var ninjaArrows = new NinjaArrows(map, markers);
```

You can also initialize NinjaArrows with several options, i.e. style, offsets etc.
```javascript
var customStyle = {
  fillColor: "yellow",
  strokeColor: "orange",
  strokeWidth: 2,
  textColor: "black"
};
var ninjaArrows = new NinjaArrows(map, markers, { style: customStyle } );
```

**Adding and removing markers**

To add a new marker simply call addMarker():
```javascript
ninjaArrows.addMarker(marker);
```

The same applies to removing markers. Just call removeMarker() to remove the given marker from NinjaArrows. 
```javascript
ninjaArrows.removeMarker(marker);
```

To clear all markers, call clearMarkers():
```javascript
ninjaArrows.clearMarkers();
```

**Options**

You can apply several options to the arrows: style, edgeOffset, borderOffset and jumpTo-Flag

_style_

Pass a style object to the NinjaArrows constructor or use setStyle(style) to apply a custom style. A style object defines these attributes: (If an attribute is not specified in the style object, the default property is taken.)
```javascript
{
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  textColor: string
}
```

**Dynamic Colors (v1.2+)**

```javascript
{
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  textColor: string,
  type: string,
  colorStops: [],
  resolution: number,
  maximum: number
}
```

The new style object includes **type**, **colorStops**, **resolution** and **maximum**. 

*type*

If type property is set to **gradient** a gradient will be generated based on the colorStops array and the resolution. Default is **default**.

*colorStops*

The colorStops array specifies the colors used for the spectrum to be generated. A color must be a hexadecimal string.

*resolution*

resolution specifies the gradient's resolution.

*maximum*

maximum specifies the maximum an arrow's count muast have to get the last color in the spectrum.

Example:
```javascript
var style = {
  type: "gradient",
  colorStops: ["#00CC00", "#FFFF00", "#FF0000"],
  resolution: 100,
  maximum 50
};
```
When applying the style above a gradient will be generated containing 100 colors ranging from green to yellow and red. A marker with count 1 will be green, all markers with count above 50 (the maximum) will be red and the markers between will get the matching color from the gradient.

![Dynamic Colors](https://ninjadevs.files.wordpress.com/2014/09/dynamiccolors.png)

[>> JSFiddle](http://jsfiddle.net/p57pyn3n/)

_edgeOffset_

This is the minimum distance in pixel between arrow at top/bottom and left/right. (Arrows won't overlap in corners). Use setEdgeOffset(offset) to change the offset. Default is 75px.

_borderOffset_

This is the offset from the map's border to the arrows. Use setBorderOffset(offset) to change the offset in pixel.
```javascript
{
  top: 0,
  right: 0,
  bottom: 0,
  left: 70
};
```

_jumpTo_

This flag specifies whether the map's bounds should extend to contain out-of-bounds markers or jump to out-of-bounds markers. Use setJumpTo(flag)

**Show/Hide**

Use the setMap() method to show or hide the arrows.
```javascript
// hide
ninjaArrows.setMap(null);

// show
ninjaArrows.setMap(map);
```

**Events**

NinjaArrows supports two different events: arrows_created and update_finished.

* __arrows_created__ is fired when a new instance is created and the arrows are initialised.
* __update_finished__ is fired when the arrow update has finished

Use register(event, callback) to register for an event:

```javascript
ninjaArrows.register("update_finished", function (event) {
  // do something
};
```

[▴ back to top](#ninjaarrowsjs)

###OpenLayers
![NinjaArrows in OpenLayers](https://ninjadevs.files.wordpress.com/2014/10/ninjaarrows-openlayers-v1-0.png)

[>> JSFiddle](http://jsfiddle.net/uf6gjfhh/)

**Creating a new instance**

To use NinjaArrows and all its features in OpenLayers 2 simply create a new __NinjaArrows__ instance. If a layer was specified, the arrows will be rendered on that layer. **Note:** The layer must be attached to a map!
```javascript
var map = ... // initialize map
var layer = new OpenLayers.Layer.Vector("Arrow Layer");
map.addLayers([layer]);
var ninjaArrows = new NinjaArrows(null, layer);
```

You can also pass an array of OpenLayers.Geometry.Point objects to the constructor.
```javascript
var points = [];

// add Point-objects ...

var ninjaArrows = new NinjaArrows(points, layer);
```

A third parameter specifies the options that can be applied to the arrows, i.e. the style:
```javascript
var customStyle = {
  fillColor: "white",
  strokeColor: "green",
  strokeWidth: 3,
  textColor: "black"
};
var ninjaArrows = new NinjaArrows(points, layer, { style: customStyle });
```

**Adding and removing points**

To add or remove a point call addPoint() or removePoint(). To remove all points call clearPoints().

**Note:** If the options paramter "projection" was specified as **wgs1984**, the point will be transformed to the spherical mercator projection.
```javascript
var point = new OpenLayers.Geometry.Point(14, 46);
ninjaArrows.addPoint(point);

...
ninjaArrows.removePoint(point);

ninjaArrows.clearPoints();
```

**Options**

The third constructor parameter may be used to apply options, i.e. a custom style, to the arrows.

_style_

Pass a style object to the NinjaArrows constructor or use setStyle(style) to apply a custom style. A style object defines these attributes: (If an attribute is not specified in the style object, the default property is taken.)
```javascript
{
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  textColor: string
}
```

**Dynamic Colors (v1.1+)**

```javascript
{
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  textColor: string,
  type: string,
  colorStops: [],
  resolution: number,
  maximum: number
}
```

The new style object includes **type**, **colorStops**, **resolution** and **maximum**. 

*type*

If type property is set to **gradient** a gradient will be generated based on the colorStops array and the resolution. Default is **default**.

*colorStops*

The colorStops array specifies the colors used for the spectrum to be generated. A color must be a hexadecimal string.

*resolution*

resolution specifies the gradient's resolution.

*maximum*

maximum specifies the maximum an arrow's count muast have to get the last color in the spectrum.

Example:
```javascript
var style = {
  type: "gradient",
  colorStops: ["#00CC00", "#FFFF00", "#FF0000"],
  resolution: 100,
  maximum 50
};
```
When applying the style above a gradient will be generated containing 100 colors ranging from green to yellow and red. A marker with count 1 will be green, all markers with count above 50 (the maximum) will be red and the markers between will get the matching color from the gradient.

![Dynamic Colors](https://ninjadevs.files.wordpress.com/2014/09/dynamiccolors.png)

[>> JSFiddle](http://jsfiddle.net/th4Luc3d/)

_edgeOffset_

This is the minimum distance in pixel between arrow at top/bottom and left/right. (Arrows won't overlap in corners). Use setEdgeOffset(offset) to change the offset. Default is 75px.

_borderOffset_

This is the offset from the map's border to the arrows. Use setBorderOffset(offset) to change the offset in pixel.
```javascript
{
  top: 0,
  right: 0,
  bottom: 0,
  left: 70
};
```

_jumpTo_

This flag specifies whether the map's bounds should extend to contain out-of-bounds markers or jump to out-of-bounds markers. Use setJumpTo(flag)

_projection_

The projection parameter specifies the projection of the points. Default is "sm" (spherical mercator). If projection is set to "wgs1984" points will be transformed to the spherical mercator projection.

**Show and hide**

To hide the arrows call setLayer function and pass null. To show the arrows pass a valid layer-object to the function.
```javascript
// hide
ninjaArrows.setLayer(null);

// show
ninjaArrows.setLayer(layer);
```

**Events**

NinjaArrows supports two different events: arrows_created and update_finished.

* __arrows_created__ is fired when a new instance is created and the arrows are initialised.
* __update_finished__ is fired when the arrow update has finished

Use register(event, callback) to register for an event:

```javascript
ninjaArrows.register("update_finished", function (event) {
  // do something
};
```

[▴ back to top](#ninjaarrowsjs)

### Explanation Offsets

NinjaArrows.js includes two types of offsets: *edge offset* and *border offset*. You can specifiy these offsets through the options parameter when creating a new instance or by calling setEdgeOffset() or setBorderOffset().

![Explanation Offsets](https://ninjadevs.files.wordpress.com/2014/10/offsets.png)

Blue lines represent the **edge offset**. The edge offset specifies the minimum distance between arrows in corners and arrows in north, east, south and west. In other words: arrows won't overlap in the corners.

Red lines represent the **border offset**. The border offset specifies the distance between the arrows and the map's border. This offset can be used to position arrows so that they don't overlap map controls.

[▴ back to top](#ninjaarrowsjs)

### Dynamic Colors

**Google Maps v1.2+, Openlayers v1.1+**

The Dynamic Colors update allows you to change the arrow's color according to its count. Everything is customizable so you can also define your own color spectrum or use the default one.

![Dynamic Colors](https://ninjadevs.files.wordpress.com/2014/09/dynamiccolors.png) ![More Colors](https://ninjadevs.files.wordpress.com/2014/09/customstylenew.png)

[▴ back to top](#ninjaarrowsjs)
