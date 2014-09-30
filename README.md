**This project is not completed yet!**

NinjaArrows.js
==============

NinjaArrows is a Google Maps/OpenLayers extension that shows small arrows at the map's egeds indicating out of bounds markers. You can jump to these markers or extend your map's bounds by clicking on an arrow.

This project was created at [ilogs mobile software GmbH](http://ilogs.com/)

Also visit my Blog: [NinjaArrows](http://ninjadevs.wordpress.com/ninja-arrows/) ( Under construction ;) )


**Note**

ninjaarrows-gmaps-vXXX.js is using Google Maps JavaScript API v3

ninjaarrows-ol-vXXX.js is using OpenLayers 2

Usage
-----

###Google Maps
**Creating a new instance**

To use NinjaArrows and its features simply create a new NinjaArrows instance by passing a valid map to the constructor.
```javascript
var ninjaArrows = new NinjaArrows(map);
```

You can also pass an existing array of Markers to the constructor:
```javascript
var markers = [];

// add markers ...

var ninjaArrows = new NinjaArrows(map, markers);
```

You can alos instantiate NinjaArrows with several options, i.e. style, offsets etc.
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

Pass a style object to the NinjaArrows constructor or use setStyle(style) to apply a custom style. A style object can define these attributes: (If an attribute is not specified in the style object, the default property is taken.)
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

This flag specifies whether the map's bounds should extend to contain out of bounds markers or jump to out of bounds markers. Use setJumpTo(flag)

**Show/Hide**

Use the setMap() method to show or hide the arrows.
```javascript
// hide
ninjaArrows.setMap(null);

// show
ninjaArrows.setMap(map);
```

**Events**

NinjaArrows support two different events at the moment: arrows_created and update_finished.

* __arrows_created__ is fired when a new instance is created and the arrows are initialised.
* __update_finished__ is fired when the arrow update has finished

Use register(event, callback) to register for an event:

```javascript
ninjaArrows.register("update_finished", function (event) {
  // do something
};
```

###OpenLayers
OpenLayers version comming soon ;)
