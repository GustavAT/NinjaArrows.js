NinjaArrows.js
==============

NinjaArrows is a Google Maps/OpenLayers extension that shows small arrows at the map's egeds indicating out of bounds markers. You can jump to these markers or extend your map's bounds by clicking on an arrow.

- [Google Maps](#google-maps)
- [OpenLayers](#openlayers)

This project was created at [ilogs mobile software GmbH](http://ilogs.com/). Please also visit my blog [NinjaArrows](http://ninjadevs.wordpress.com/ninja-arrows/) to receive the lastest news.

##Usage

###Google Maps
![NinjaArrows in Google Maps](https://ninjadevs.files.wordpress.com/2014/09/gmaps.png)

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

###OpenLayers
![NinjaArrows in OpenLayers](https://ninjadevs.files.wordpress.com/2014/10/ninjaarrows-openlayers-v1-0.png)

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
