/*
** The MIT License (MIT)
**
** Copyright (c) 2015 Andreas Tscheinig at ilogs mobile software GmbH
**
** Permission is hereby granted, free of charge, to any person obtaining a copy
** of this software and associated documentation files (the "Software"), to deal
** in the Software without restriction, including without limitation the rights
** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
** copies of the Software, and to permit persons to whom the Software is
** furnished to do so, subject to the following conditions:
**
** The above copyright notice and this permission notice shall be included in all
** copies or substantial portions of the Software.
** 
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
** OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
** SOFTWARE.
*/

NinjaArrow = (function () {

    var ninjaArrow = function (layer, position, count, direction, offset, style, jumpTo, projection) {
        this.layer = null;
        this.count = count || 0;
        this.direction = direction || 8;
        this.offset = offset || { x: 0, y: 0 };
        this.style = style || NinjaArrows.DefaultStyle;
        this.jumpTo = jumpTo;
        this.projection = projection;
        this.points = [];

        this.style.fillOpacity = "0.8";

        this.init();

        this.setLayer(layer);
    };

    ninjaArrow.prototype.init = function () {
        var point = new OpenLayers.Geometry.Point(0, 0);
        var feature = new OpenLayers.Feature.Vector(point, null, {
            style: { cursor: "pointer" },
            externalGraphic: ninjaArrow.createNinjaArrowIcon(this.direction, this.count, this.style),
            graphicHeight: 50,
            graphicWidth: 50,
            graphicXOffset: this.offset.x,
            graphicYOffset: this.offset.y,
            fillOpacity: this.style.fillOpacity
        });
        this.point = feature;
    };

    ninjaArrow.prototype.setLayer = function (layer) {
        if (layer && layer.map) {
            if (this.layer) {
                this.layer.removeFeatures([this.point]);
            }
            this.layer = layer;
            this.layer.addFeatures([this.point]);
        } else {
            if (this.layer) {
                this.layer.removeFeatures([this.point]);
            }
            this.layer = layer;
        }
    };

    ninjaArrow.prototype.show = function () {
        this.point.style.display = "block";
        if (this.layer) {
            this.layer.drawFeature(this.point);
        }
    };

    ninjaArrow.prototype.hide = function () {
        this.point.style.display = "none";
        if (this.layer) {
            this.layer.drawFeature(this.point);
        }
    };

    ninjaArrow.prototype.repaint = function () {
        this.point.style.externalGraphic = NinjaArrow.createNinjaArrowIcon(this.direction, this.count, this.style);
        this.point.style.graphicXOffset = this.offset.x;
        this.point.style.graphicYOffset = this.offset.y;
        if (this.layer) {
            this.layer.drawFeature(this.point);
        }
    };

    ninjaArrow.createNinjaArrowIcon = function (direction, text, style) {
        if (!direction || !text) return null;

        var canvas = document.createElement("canvas"),
            width = 50,
            height = 50,
            fontSize = 13,
            strokeColor = style.strokeColor || "black",
            strokeWidth = style.strokeWidth || 2,
            textColor = style.textColor || "black";

        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        context.translate(width / 2, height / 2);

        context.fillStyle = textColor;
        context.font = "bold " + fontSize + "px Arial";
        var textWidth = context.measureText(text);
        var temp = ninjaArrow.getAngleAndOffsetFromDirection(direction, fontSize, textWidth.width);
        var angle = temp.angle;
        var offsets = temp.offsets;
        context.fillText(text, offsets.x - textWidth.width / 2, offsets.y);

        context.beginPath();
        context.moveTo(12 * Math.cos(NinjaArrows.deg2rad(angle)), 12 * Math.sin(NinjaArrows.deg2rad(angle)));
        context.lineTo(12 * Math.cos(NinjaArrows.deg2rad(270 + angle)), 12 * Math.sin(NinjaArrows.deg2rad(270 + angle)));
        context.lineTo(12 * Math.cos(NinjaArrows.deg2rad(180 + angle)), 12 * Math.sin(NinjaArrows.deg2rad(180 + angle)));

        context.fillStyle = ninjaArrow.getColorFromStyle(style, text);
        context.fill();

        context.lineWidth = strokeWidth;
        context.strokeStyle = strokeColor;
        context.stroke();

        return canvas.toDataURL();
    };

    ninjaArrow.getColorFromStyle = function (style, text) {
        if (style.type === NinjaArrows.TypeGradient) {
            var percentCount,
                i,
                startPercent = 1,
                minDiff = 100,
                diff,
                foundIndex = 0;

            var colorStops = style.generatedColors;
            var maximum = style.maximum;
            var current = text <= 0 ? 1 : text;
            percentCount = Math.round(100 / maximum * current);
            var colorPercentInterval = 100 / (colorStops.length - 1);
            if (percentCount > 100) percentCount = 100;

            // find closest color
            for (i = 0; i < colorStops.length; i++) {
                diff = Math.abs(startPercent - percentCount);
                if (diff < minDiff) {
                    minDiff = diff;
                    foundIndex = i;
                }
                startPercent += colorPercentInterval;
            }
            return colorStops[foundIndex];
        } else {
            return style.fillColor || NinjaArrows.DefaultStyle.fillColor;
        }
    };

    ninjaArrow.getAngleAndOffsetFromDirection = function (direction, fontSize, textWidth) {
        var angle = 0, x = 0, y = 0;
        if (direction === NinjaArrows.N) { // N ok
            angle = 0;
            y += fontSize;
        }
        else if (direction === NinjaArrows.S) { // S ok
            angle = 180;
            y -= 2;
        }
        else if (direction === NinjaArrows.NE) { // NE
            angle = 45;
            y += fontSize;
            x -= textWidth / 2;
        }
        else if (direction === NinjaArrows.E) { // E ok
            angle = 90;
            y += fontSize / 2 - 1;
            x -= textWidth / 2 + 3;
        }
        else if (direction === NinjaArrows.SE) { // SE ok
            angle = 135;
            y -= 2;
            x -= textWidth / 2;
        }
        else if (direction === NinjaArrows.SW) { // SW ok
            angle = -135;
            y -= 2;
            x += textWidth / 2;
        }
        else if (direction === NinjaArrows.W) { // W ok
            angle = -90;
            y += fontSize / 2 - 1;
            x += textWidth / 2 + 3;
        }
        else if (direction === NinjaArrows.NW) { // NW
            angle = -45;
            y += fontSize;
            x += textWidth / 2;
        }
        return { angle: angle, offsets: { x: x, y: y} };
    };

    return ninjaArrow;
})();

NinjaArrows = (function () {

    var eventTypes = ["arrows_created", "update_finished", "arrow_click", "arrow_mouseover", "arrow_mouseout"];
    var wgs1984 = new OpenLayers.Projection("EPSG:4326");
    var sphericalMercator = new OpenLayers.Projection("EPSG:900913");

    var ninjaArrows = function (points, layer, options) {
        this.layer = layer;
        this.points = points || [];
        this.arrows = [];
        this.handlers = [];

        if (this.layer && !this.layer.map) {
            return;
        }

        if (!options) options = {};

        this.style = options.style || NinjaArrows.DefaultStyle;
        this.edgeOffset = options.edgeOffset || 75;
        this.borderOffset = options.borderOffset || { top: 0, right: 0, bottom: 0, left: 50 };
        this.jumpTo = typeof options.jumpTo !== "boolean" ? true : options.jumpTo;
        this.zoomOnClick = typeof options.zoomOnClick !== "boolean" ? true : options.zoomOnClick;

        switch (options.projection) {
            case "wgs1984":
                this.projection = wgs1984;
                this.convertPoints(wgs1984, sphericalMercator);
                break;
            case "sm":
                this.projection = sphericalMercator;
                break;
            default:
                this.projection = sphericalMercator;
        }

        // adding support for dynamic arrow color depending on count and maximum
        if (this.style.type === ninjaArrows.TypeGradient) {
            if (!this.style.colorStops) this.style.colorStops = ninjaArrows.ColorStopsGradient;
            if (!this.style.maximum) this.style.maximum = 100;
            if (!this.style.resolution) this.style.resolution = 50;

            if (this.style.resolution < 3 && resolution > 100) this.style.resolution = 50;
            if (this.style.maximum < 1 && this.style.maximum > 1000) this.style.maximum = 100;
            if (this.style.colorStops.length < 2) this.style.colorStops = ninjaArrows.ColorStopsGradient;

            ninjaArrows.generateGradient(this.style);
        }

        this.moveEnd = this.moveEndHandler.bind(this);
        this.clickArrow = this.clickArrowHandler.bind(this);
        this.mouseOverArrow = this.mouseOverArrowHandler.bind(this);
        this.mouseOutArrow = this.mouseOutArrowHandler.bind(this);
        this.move = this.moveHandler.bind(this);


        this.init();
        this.setHandler();
        this.repaint();
    };

    ninjaArrows.NW = 9;
    ninjaArrows.N = 8;
    ninjaArrows.NE = 12;
    ninjaArrows.E = 4;
    ninjaArrows.SE = 6;
    ninjaArrows.S = 2;
    ninjaArrows.SW = 3;
    ninjaArrows.W = 1;

    ninjaArrows.DefaultStyle = {
        fillColor: "rgb(153, 187, 232)",
        strokeColor: "black",
        strokeWidth: 2,
        textColor: "black"
    };

    ninjaArrows.TypeGradient = "gradient";
    ninjaArrows.TypeDefault = "default";
    ninjaArrows.ColorStopsGradient = ["#00CC00", "#FFFF00", "#FF0000"];

    ninjaArrows.prototype.convertPoints = function (source, dest) {
        var i;
        for (i = 0; i < this.points.length; i++) {
            this.points[i].transform(source, dest);
        }
    };

    ninjaArrows.prototype.init = function () {
        // NW N NE E SE S SW W [8,4,2,1] [N,E,S,W]
        this.arrows.push(this.createNinjaArrow(NinjaArrows.NW));
        this.arrows.push(this.createNinjaArrow(NinjaArrows.N));
        this.arrows.push(this.createNinjaArrow(NinjaArrows.NE));
        this.arrows.push(this.createNinjaArrow(NinjaArrows.E));
        this.arrows.push(this.createNinjaArrow(NinjaArrows.SE));
        this.arrows.push(this.createNinjaArrow(NinjaArrows.S));
        this.arrows.push(this.createNinjaArrow(NinjaArrows.SW));
        this.arrows.push(this.createNinjaArrow(NinjaArrows.W));
        this.fire("arrows_created", null);
    };



    ninjaArrows.prototype.setHandler = function () {
        if (this.layer) {
            this.layer.map.events.unregister("moveend", this.layer.map, this.moveEnd);
            this.layer.map.events.register("moveend", this.layer.map, this.moveEnd);
            this.layer.map.events.unregister("move", this.layer.map, this.move);
            this.layer.map.events.register("move", this.layer.map, this.move);
            this.layer.events.unregister("featureclick", this.layer, this.clickArrow);
            this.layer.events.register("featureclick", this.layer, this.clickArrow);
            this.layer.events.register("featureover", this.layer, this.mouseOverArrow);
            this.layer.events.register("featureout", this.layer, this.mouseOutArrow);
        }
    };

    ninjaArrows.prototype.moveEndHandler = function () {
        this.repaint();
    };

    ninjaArrows.prototype.clickArrowHandler = function (event) {
        this.ninjaArrowClick(event);
    };

    ninjaArrows.prototype.mouseOverArrowHandler = function(event) {
        this.ninjaArrowMouseOver(event);
    };

    ninjaArrows.prototype.mouseOutArrowHandler = function(event) {
        this.ninjaArrowMouseOut(event);
    };

    ninjaArrows.prototype.moveHandler = function () {
        this.hide();
    };

    ninjaArrows.prototype.ninjaArrowClick = function (event) {
        if (!this.layer || !this.layer.map) return;
        if (!this.zoomOnClick) return;

        var arrow = this.getNinjaArrowByFeatureId(event.feature.id), points, bounds, map = this.layer.map;
        if (arrow) {
            points = arrow.points;

            if (!arrow.jumpTo) {
                bounds = map.getExtent();
            } else {
                bounds = new OpenLayers.Bounds();
            }

            for (var i = 0; i < points.length; i++) {
                bounds.extend(points[i]);
            }

            this.layer.map.zoomToExtent(bounds);

            if (map.getZoom() > 16) {
                map.zoomTo(16);
            }
            this.fire("arrow_clicked", arrow);
        }
    };

    ninjaArrows.prototype.ninjaArrowMouseOver = function (event) {
        if (!this.layer || !this.layer.map) return;
        var arrow = this.getNinjaArrowByFeatureId(event.feature.id);
        if (arrow) {
            arrow.point.style.fillOpacity = "1";
            if (this.layer) {
                this.layer.drawFeature(arrow.point);
            }
            this.fire("arrow_mouseover", arrow);
        }
    };

    ninjaArrows.prototype.ninjaArrowMouseOut = function(event) {
        if (!this.layer || !this.layer.map) return;
        var arrow = this.getNinjaArrowByFeatureId(event.feature.id);
        if (arrow) {
            arrow.point.style.fillOpacity = "0.8";
            if (this.layer) {
                this.layer.drawFeature(arrow.point);
            }
            this.fire("arrow_mouseout", arrow);
        }
    };

    ninjaArrows.prototype.createNinjaArrow = function (direction) {
        var x, y;
        if (direction & 8) { // North
            y = 25 + this.borderOffset.top;
        }
        else if (direction & 2) { // South
            y = -25 - this.borderOffset.bottom;
        }
        else {
            y = 0;
        }
        if (direction & 1) { // West
            x = 25 + this.borderOffset.left;
        }
        else if (direction & 4) { // East
            x = -25 - this.borderOffset.right;
        }
        else {
            x = 0;
        }
        var marker = new NinjaArrow(this.layer, null, 0, direction, { x: -25 + x, y: -25 + y }, this.style, this.jumpTo, this.projection);
        return marker;
    };

    ninjaArrows.prototype.repaint = function () {
        var cntN = 0, cntNe = 0, cntE = 0, cntSe = 0, cntS = 0, cntSw = 0, cntW = 0, cntNw = 0;
        var cntAvgN = 0, cntAvgE = 0, cntAvgS = 0, cntAvgW = 0, avgN = 0, avgE = 0, avgS = 0, avgW = 0;
        var bounds = 0, top = 0, right = 0, bottom = 0, left = 0, x, y, i;
        var direction, point, arrow, arrowsToShow = [];

        this.hide();
        this.clearArrows();

        if (!this.layer || !this.layer.map) return;

        bounds = this.layer.map.getExtent();

        if (!bounds) return;
        
        top = bounds.top;
        right = bounds.right;
        bottom = bounds.bottom;
        left = bounds.left;

        for (i = 0; i < this.points.length; i++) {
            point = this.points[i];
            x = point.x;
            y = point.y;
            direction = -1;
            if (y > top && x < left) {
                cntNw += point.count || 1;
                direction = ninjaArrows.NW;
            }
            else if (y > top && x > right) {
                cntNe += point.count || 1;
                direction = ninjaArrows.NE;
            }
            else if (y > top) {
                cntN += point.count || 1;
                cntAvgN++;
                direction = ninjaArrows.N;
                avgN += x;
            }
            else if (y < bottom && x < left) {
                cntSw += point.count || 1;
                direction = ninjaArrows.SW;
            }
            else if (y < bottom && x > right) {
                cntSe += point.count || 1;
                direction = ninjaArrows.SE;
            }
            else if (y < bottom) {
                cntS += point.count || 1;
                cntAvgS++;
                direction = ninjaArrows.S;
                avgS += x;
            }
            else if (x < left) {
                cntW += point.count || 1;
                cntAvgW++;
                direction = ninjaArrows.W;
                avgW += y;
            }
            else if (x > right) {
                cntE += point.count || 1;
                cntAvgE++;
                direction = ninjaArrows.E;
                avgE += y;
            }
            arrow = this.getNinjaArrowByDirection(direction);
            if (arrow) {
                arrow.points.push(point);
            }
        }
        avgN /= cntAvgN; avgE /= cntAvgE; avgS /= cntAvgS; avgW /= cntAvgW;

        if (cntN !== 0) { //N
            arrow = this.getNinjaArrowByDirection(NinjaArrows.N);
            arrow.count = cntN;
            arrow.point.geometry = new OpenLayers.Geometry.Point(this.calculateOffset(arrow, avgN), top);
            arrowsToShow.push(arrow);
        }
        if (cntNe !== 0) {  // NE
            arrow = this.getNinjaArrowByDirection(NinjaArrows.NE);
            arrow.count = cntNe;
            arrow.point.geometry = new OpenLayers.Geometry.Point(right, top);
            arrowsToShow.push(arrow);
        }
        if (cntNw !== 0) {  // NW
            arrow = this.getNinjaArrowByDirection(NinjaArrows.NW);
            arrow.count = cntNw;
            arrow.point.geometry = new OpenLayers.Geometry.Point(left, top);
            arrowsToShow.push(arrow);
        }
        if (cntW !== 0) {   // W
            arrow = this.getNinjaArrowByDirection(NinjaArrows.W);
            arrow.count = cntW;
            arrow.point.geometry = new OpenLayers.Geometry.Point(left, this.calculateOffset(arrow, avgW));
            arrowsToShow.push(arrow);
        }
        if (cntE !== 0) {   // E
            arrow = this.getNinjaArrowByDirection(NinjaArrows.E);
            arrow.count = cntE;
            arrow.point.geometry = new OpenLayers.Geometry.Point(right, this.calculateOffset(arrow, avgE));
            arrowsToShow.push(arrow);
        }
        if (cntSw !== 0) {  // SW
            arrow = this.getNinjaArrowByDirection(NinjaArrows.SW);
            arrow.count = cntSw;
            arrow.point.geometry = new OpenLayers.Geometry.Point(left, bottom);
            arrowsToShow.push(arrow);
        }
        if (cntS !== 0) {   // S
            arrow = this.getNinjaArrowByDirection(NinjaArrows.S);
            arrow.count = cntS;
            arrow.point.geometry = new OpenLayers.Geometry.Point(this.calculateOffset(arrow, avgS), bottom);
            arrowsToShow.push(arrow);
        }
        if (cntSe !== 0) {  // SE
            arrow = this.getNinjaArrowByDirection(NinjaArrows.SE);
            arrow.count = cntSe;
            arrow.point.geometry = new OpenLayers.Geometry.Point(right, bottom);
            arrowsToShow.push(arrow);
        }

        for (i = 0; i < arrowsToShow.length; i++) {
            arrowsToShow[i].repaint();
            arrowsToShow[i].show();
        }

        this.fire("update_finished", { count: arrowsToShow.length });
    };

    ninjaArrows.prototype.getNinjaArrowByDirection = function (direction) {
        var arrow = null;
        for (var i = 0; i < this.arrows.length; i++) {
            if (this.arrows[i].direction === direction) {
                arrow = this.arrows[i];
            }
        }
        return arrow;
    };

    ninjaArrows.prototype.getNinjaArrowByFeatureId = function (id) {
        var arrow = null;
        for (var i = 0; i < this.arrows.length; i++) {
            if (this.arrows[i].point.id === id) {
                arrow = this.arrows[i];
            }
        }
        return arrow;
    };

    ninjaArrows.prototype.calculateOffset = function (arrow, coordinate) {
        var mapWidth = this.layer.map.getSize().w,
            mapHeight = this.layer.map.getSize().h,
            top,
            bottom,
            left,
            right,
            newPosition = coordinate;

        if (arrow.direction & 5) { // W, E
            top = this.layer.map.getLonLatFromViewPortPx({ x: 0, y: this.edgeOffset + this.borderOffset.top + 25 }).lat;
            bottom = this.layer.map.getLonLatFromViewPortPx({ x: 0, y: mapHeight - this.edgeOffset - this.borderOffset.bottom - 25 }).lat;
            if (coordinate > top) {
                newPosition = top;
            }
            else if (coordinate < bottom) {
                newPosition = bottom;
            }
        }
        else { // S, N
            right = this.layer.map.getLonLatFromViewPortPx({ x: mapWidth - this.edgeOffset - this.borderOffset.right - 25, y: 0 }).lon;
            left = this.layer.map.getLonLatFromViewPortPx({ x: this.edgeOffset + this.borderOffset.left + 25, y: 0 }).lon;
            if (coordinate < left) {
                newPosition = left;
            }
            else if (coordinate > right) {
                newPosition = right;
            }
        }
        return newPosition;
    };

    ninjaArrows.prototype.show = function () {
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].show();
        }
    };

    ninjaArrows.prototype.hide = function () {
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].hide();
        }
    };

    ninjaArrows.prototype.addPoint = function (point) {
        if (!point) return;

        if (this.projection === wgs1984) {
            point.transform(wgs1984, sphericalMercator);
        }

        this.points.push(point);
        this.repaint();
    };

    ninjaArrows.prototype.removePoint = function (point) {
        if (!point) return;

        var tmpPoint;
        for (var i = this.points.length - 1; i >= 0; i--) {
            tmpPoint = this.points[i];
            if (tmpPoint === point) {
                this.points.splice(i, 1);
            }
        }
    };

    ninjaArrows.prototype.clearPoints = function () {
        this.points = [];
        this.clearArrows();
    };

    ninjaArrows.prototype.clearArrows = function () {
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].points = [];
        }
    };

    ninjaArrows.prototype.setLayer = function(layer) {
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].setLayer(layer);
        }
        this.layer = layer;
        this.setHandler();
    };

    ninjaArrows.prototype.setStyle = function (style) {
        this.style = style || NinjaArrows.DefaultStyle;

        if (this.style.type === ninjaArrows.TypeGradient) {
            if (!this.style.colorStops) this.style.colorStops = ninjaArrows.ColorStopsGradient;
            if (!this.style.maximum) this.style.maximum = 100;
            if (!this.style.resolution) this.style.resolution = 50;

            if (this.style.resolution < 3 && resolution > 100) this.style.resolution = 50;
            if (this.style.maximum < 1 && this.style.maximum > 1000) this.style.maximum = 100;
            if (this.style.colorStops.length < 2) this.style.colorStops = ninjaArrows.ColorStopsGradient;

            ninjaArrows.generateGradient(this.style);
        }

        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].style = this.style;
        }
        this.repaint();
    };

    ninjaArrows.prototype.setEdgeOffset = function (offset) {
        if (offset) {
            this.edgeOffset = offset;
            this.repaint();
        }
    };

    ninjaArrows.prototype.setBorderOffset = function (offset) {
        if (offset) {
            this.borderOffset = offset;
            var direction, i, x, y;
            for (i = 0; i < this.arrows.length; i++) {
                direction = this.arrows[i].direction;
                if (direction & NinjaArrows.N) { // North
                    y = 25 + this.borderOffset.top;
                }
                else if (direction & NinjaArrows.S) { // South
                    y = -25 - this.borderOffset.bottom;
                }
                else {
                    y = 0;
                }
                if (direction & NinjaArrows.W) { // West
                    x = 25 + this.borderOffset.left;
                }
                else if (direction & NinjaArrows.E) { // East
                    x = -25 - this.borderOffset.right;
                }
                else {
                    x = 0;
                }
                this.arrows[i].offset = { x: -25 + x, y: -25 + y };
                this.arrows[i].repaint();
            }
            this.repaint();
        }
    };

    ninjaArrows.prototype.setJumpTo = function (jumpTo) {
        this.jumpTo = typeof jumpTo !== "boolean" ? true : jumpTo;
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].jumpTo = this.jumpTo;
        }
    };

    ninjaArrows.prototype.setZoomOnClick = function (zoomOnClick) {
        this.zoomOnClick = typeof zoomOnClick !== "boolean" ? true : zoomOnClick;
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].zoomOnClick = this.zoomOnClick;
        }
    };

    ninjaArrows.prototype.register = function (event, callback) {
        if (eventTypes.indexOf(event) > -1) {
            this.handlers[event] = callback;
        }
    };

    ninjaArrows.prototype.fire = function (event, data) {
        if (this.handlers[event]) {
            this.handlers[event](data);
        }
    };

    ninjaArrows.rad2deg = function (angle) {
        return angle * (180 / Math.PI);
    };

    ninjaArrows.deg2rad = function (angle) {
        return angle * (Math.PI / 180);
    };

    ninjaArrows.generateGradient = function (style) {
        var resolution = style.resolution,
            colorStops = style.colorStops,
            i, colorsLeft, newColorStops = [], count, factor, spaces;

        spaces = colorStops.length - 1;
        colorsLeft = resolution - colorStops.length;
        factor = Math.floor(colorsLeft / spaces);

        for (i = 0; i < colorStops.length - 1; i++) {
            count = factor;
            if (i === 0 && factor !== 0) { // first color
                count += colorsLeft % spaces;
            }
            ninjaArrows.generateColorsBetweenNodes(colorStops[i], colorStops[i + 1], newColorStops, count);
        }
        newColorStops.push(colorStops[colorStops.length - 1]); // add last color
        style.generatedColors = newColorStops;
    };

    ninjaArrows.generateColorsBetweenNodes = function (colorA, colorB, newColors, count) {
        var countAtmp, countTmpB, colorBetween;
        if (count === 0) {
            newColors.push(colorA);
            return;
        }
        count--;
        countAtmp = Math.ceil(count / 2);
        countTmpB = count - countAtmp;
        colorBetween = ninjaArrows.generateColorBetween(colorA, colorB);
        ninjaArrows.generateColorsBetweenNodes(colorA, colorBetween, newColors, countAtmp);
        ninjaArrows.generateColorsBetweenNodes(colorBetween, colorB, newColors, countTmpB);
    };

    ninjaArrows.generateColorBetween = function (colorA, colorB) {
        var colorAInt = parseInt(colorA.substring(1), 16),
            colorBInt = parseInt(colorB.substring(1), 16),
            rA = (colorAInt & 0xFF0000) >> 16,
            gA = (colorAInt & 0x00FF00) >> 8,
            bA = (colorAInt & 0x0000FF) >> 0,
            rB = (colorBInt & 0xFF0000) >> 16,
            gB = (colorBInt & 0x00FF00) >> 8,
            bB = (colorBInt & 0x0000FF) >> 0,
            newColorInt, newColorString;

        newColorInt = (((rA + rB) / 2) << 16) + (((gA + gB) / 2) << 8) + (((bA + bB) / 2) << 0);
        newColorString = "#" + ("000000" + newColorInt.toString(16)).substr(-6);
        return newColorString;
    };
    return ninjaArrows;
})();
