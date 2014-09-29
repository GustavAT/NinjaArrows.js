NinjaArrows.js
==============

A Google Maps/OpenLayers extension that shows small arrows at the map's egeds indicating out of bounds markers. You can jump to these markers or extend your map's bounds by clicking on an arrow.

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

_Style_

Pass a style object to the NinjaArrows to apply a custom style. A style object can define this attributes:
```javascript
{
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  textColor: string
}
```
If an attribute is not specified in the style object, the default property is taken.

Use the setMap() method to show or hide the arrows.
```javascript
// hide
ninjaArrows.setMap(null);

// show
ninjaArrows.setMap(map);
```


**OpenLayers**
OpenLayers version comming soon ;)
