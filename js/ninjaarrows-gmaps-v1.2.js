/*
** The MIT License (MIT)
**
** Copyright (c) 2014 Andreas Tscheinig at ilogs mobile software GmbH
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
    var ninjaArrow = function (ref, position, count, direction, offset) {
        this.ref = ref;
        this.map = ref.map;
        this.position = position || new google.maps.LatLng(46.62794, 14.30899);
        this.count = count || "0";
        this.direction = direction || 8;
        this.offset = offset || { x: 0, y: 0 };
        this.marker = [];
        this.div = null;
        this.setMap(this.map);
    };

    ninjaArrow.prototype = new google.maps.OverlayView();

    ninjaArrow.prototype.onAdd = function () {
        var div = document.createElement("div"),
            img = document.createElement("img"),
            panes = this.getPanes();

        div.style.border = "none";
        div.style.position = "absolute";
        div.style.zIndex = "9999999";

        img.src = ninjaArrow.createNinjaArrowIcon(this.direction, this.count, this.ref.style);
        div.appendChild(img);
        this.div = div;

        panes.floatPane.appendChild(this.div);

        google.maps.event.addDomListener(this.div, "click", function () {
            this.ref.fire("arrow_click", this);
            if (!this.ref.zoomOnClick) return;

            var bounds = new google.maps.LatLngBounds();
            if (!this.marker) return;

            for (var i = 0; i < this.marker.length; i++) {
                bounds.extend(this.marker[i].getPosition());
            }
            if (!this.ref.jumpTo) {
                bounds.union(this.map.getBounds());
            }
            this.map.fitBounds(bounds);
            if (this.map.getZoom() > 16) {
                this.map.setZoom(16);
            }
        }.bind(this));

        google.maps.event.addDomListener(this.div, "mouseover", function() {
            this.ref.fire("arrow_mouseover", this);
        }.bind(this));

        google.maps.event.addDomListener(this.div, "mouseout", function() {
            this.ref.fire("arrow_mouseout", this);
        }.bind(this));
    };

    ninjaArrow.prototype.draw = function () {
        var projection = this.getProjection(),
            position = projection.fromLatLngToDivPixel(this.position);

        this.div.style.left = (position.x + this.offset.x) + "px";
        this.div.style.top = (position.y + this.offset.y) + "px";
        this.div.style.width = "40px";
        this.div.style.height = "40px";
    };

    ninjaArrow.prototype.onRemove = function () {
        this.div.parentNode.removeChild(this.div);
    };

    ninjaArrow.prototype.show = function () {
        if (this.div) {
            this.div.style.display = "block";
        }
    };

    ninjaArrow.prototype.hide = function () {
        if (this.div) {
            this.div.style.display = "none";
        }
    };

    ninjaArrow.prototype.toggle = function () {
        if (this.div) {
            if (this.div.style.display === "none") {
                this.div.style.display = "block";
            }
            else {
                this.div.style.display = "none";
            }
        }
    };

    ninjaArrow.prototype.repaint = function () {
        if (!this.div) return;
        var src = ninjaArrow.createNinjaArrowIcon(this.direction, this.count, this.style);
        this.div.childNodes[0].src = src;
        this.draw();
    };

    ninjaArrow.createNinjaArrowIcon = function (direction, text, style) {
        if (!direction || !text) return null;

        var canvas = document.createElement("canvas"),
            width = 40,
            height = 40,
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
        return { angle: angle, offsets: { x: x, y: y } };
    };

    return ninjaArrow;
})();

NinjaArrows = (function () {

    var eventTypes = ["arrows_created", "update_finished", "arrow_click", "arrow_mouseover", "arrow_mouseout"];

    var ninjaArrows = function (map, marker, options) {
        if (!map) return;

        this.map = map;
        this.marker = marker || [];
        this.arrows = [];
        this.handlers = [];

        if (!options) options = {};
        this.style = options.style || NinjaArrows.DefaultStyle;
        this.edgeOffset = options.edgeOffset || 75;
        this.borderOffset = options.borderOffset || { top: 0, right: 0, bottom: 0, left: 70 };
        this.jumpTo = typeof options.jumpTo !== "boolean" ? true : options.jumpTo;
        this.zoomOnClick = typeof options.zoomOnClick !== "boolean" ? true : options.zoomOnClick;

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

        this.init();

        var that = this;
        google.maps.event.addListener(this.map, "idle", function () {
            that.repaint();
        });
        google.maps.event.addListener(this.map, "bounds_changed", function () {
            that.hide();
        });

        this.overlay = new google.maps.OverlayView();
        this.overlay.draw = function () { };
        this.overlay.setMap(this.map);
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
        textColor: "black",
        type: ninjaArrows.TypeDefault
    };

    ninjaArrows.TypeGradient = "gradient";
    ninjaArrows.TypeDefault = "default";
    ninjaArrows.ColorStopsGradient = ["#00CC00", "#FFFF00", "#FF0000"];

    ninjaArrows.prototype.init = function () {
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

    ninjaArrows.prototype.createNinjaArrow = function (direction) {
        var x, y;
        if (direction & NinjaArrows.N) { // North
            y = 20 + this.borderOffset.top;
        }
        else if (direction & NinjaArrows.S) { // South
            y = -20 - this.borderOffset.bottom;
        }
        else {
            y = 0;
        }
        if (direction & NinjaArrows.W) { // West
            x = 20 + this.borderOffset.left;
        }
        else if (direction & NinjaArrows.E) { // East
            x = -20;
        }
        else {
            x = 0 - this.borderOffset.right;
        }
        var arrow = new NinjaArrow(this, null, 0, direction, { x: -20 + x, y: -20 + y });
        arrow.count = -1;
        arrow.marker = [];
        return arrow;
    };

    ninjaArrows.prototype.setMap = function (map) {
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].setMap(map);
        }
        this.map = map;
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
                    y = 20 + this.borderOffset.top;
                }
                else if (direction & NinjaArrows.S) { // South
                    y = -20 - this.borderOffset.bottom;
                }
                else {
                    y = 0;
                }
                if (direction & NinjaArrows.W) { // West
                    x = 20 + this.borderOffset.left;
                }
                else if (direction & NinjaArrows.E) { // East
                    x = -20 - this.borderOffset.right;
                }
                else {
                    x = 0;
                }
                this.arrows[i].offset = { x: -20 + x, y: -20 + y };
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

    ninjaArrows.prototype.setZoomOnClick = function(zoomOnClick) {
        this.zoomOnClick = typeof zoomOnClick !== "boolean" ? true : zoomOnClick;
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].zoomOnClick = this.zoomOnClick;
        }
    }

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

    ninjaArrows.prototype.repaint = function () {
        var cntN = 0, cntNe = 0, cntE = 0, cntSe = 0, cntS = 0, cntSw = 0, cntW = 0, cntNw = 0;
        var cntAvgN = 0, cntAvgE = 0, cntAvgS = 0, cntAvgW = 0, avgN = 0, avgE = 0, avgS = 0, avgW = 0;
        var bounds = 0, top = 0, right = 0, bottom = 0, left = 0, x, y, i;
        var direction, marker, arrow, arrowsToShow = [];

        bounds = this.map.getBounds();

        if (!bounds) return;

        top = bounds.getNorthEast().lat();
        right = bounds.getNorthEast().lng();
        bottom = bounds.getSouthWest().lat();
        left = bounds.getSouthWest().lng();

        this.hide();
        this.clearArrows();

        for (i = 0; i < this.marker.length; i++) {
            marker = this.marker[i];
            x = marker.getPosition().lng();
            y = marker.getPosition().lat();
            direction = -1;
            if (y > top && x < left) {
                cntNw += marker.count || 1;
                direction = NinjaArrows.NW;
            }
            else if (y > top && x > right) {
                cntNe += marker.count || 1;
                direction = NinjaArrows.NE;
            }
            else if (y > top) {
                cntN += marker.count || 1;
                cntAvgN++;
                direction = NinjaArrows.N;
                avgN += x;
            }
            else if (y < bottom && x < left) {
                cntSw += marker.count || 1;
                direction = NinjaArrows.SW;
            }
            else if (y < bottom && x > right) {
                cntSe += marker.count || 1;
                direction = NinjaArrows.SE;
            }
            else if (y < bottom) {
                cntS += marker.count || 1;
                cntAvgS++;
                direction = NinjaArrows.S;
                avgS += x;
            }
            else if (x < left) {
                cntW += marker.count || 1;
                cntAvgW++;
                direction = NinjaArrows.W;
                avgW += y;
            }
            else if (x > right) {
                cntE += marker.count || 1;
                cntAvgE++;
                direction = NinjaArrows.E;
                avgE += y;
            }
            arrow = this.getNinjaArrowByDirection(direction);
            if (arrow) {
                arrow.marker.push(marker);
            }
        }
        avgN /= cntAvgN; avgE /= cntAvgE; avgS /= cntAvgS; avgW /= cntAvgW;

        if (cntN !== 0) { //N
            arrow = this.getNinjaArrowByDirection(NinjaArrows.N);
            arrow.count = cntN;
            arrow.position = new google.maps.LatLng(top, this.calculateOffset(false, arrow, avgN));
            arrowsToShow.push(arrow);
        }
        if (cntNe !== 0) {  // NE
            arrow = this.getNinjaArrowByDirection(NinjaArrows.NE);
            arrow.count = cntNe;
            arrow.position = new google.maps.LatLng(top, right);
            arrowsToShow.push(arrow);
        }
        if (cntNw !== 0) {  // NW
            arrow = this.getNinjaArrowByDirection(NinjaArrows.NW);
            arrow.count = cntNw;
            arrow.position = new google.maps.LatLng(top, left);
            arrowsToShow.push(arrow);
        }
        if (cntW !== 0) {   // W
            arrow = this.getNinjaArrowByDirection(NinjaArrows.W);
            arrow.count = cntW;
            arrow.position = new google.maps.LatLng(this.calculateOffset(true, arrow, avgW), left);
            arrowsToShow.push(arrow);
        }
        if (cntE !== 0) {   // E
            arrow = this.getNinjaArrowByDirection(NinjaArrows.E);
            arrow.count = cntE;
            arrow.position = new google.maps.LatLng(this.calculateOffset(true, arrow, avgE), right);
            arrowsToShow.push(arrow);
        }
        if (cntSw !== 0) {  // SW
            arrow = this.getNinjaArrowByDirection(NinjaArrows.SW);
            arrow.count = cntSw;
            arrow.position = new google.maps.LatLng(bottom, left);
            arrowsToShow.push(arrow);
        }
        if (cntS !== 0) {   // S
            arrow = this.getNinjaArrowByDirection(NinjaArrows.S);
            arrow.count = cntS;
            arrow.position = new google.maps.LatLng(bottom, this.calculateOffset(false, arrow, avgS));
            arrowsToShow.push(arrow);
        }
        if (cntSe !== 0) {  // SE
            arrow = this.getNinjaArrowByDirection(NinjaArrows.SE);
            arrow.count = cntSe;
            arrow.position = new google.maps.LatLng(bottom, right);
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

    ninjaArrows.prototype.calculateOffset = function (eastWest, arrow, coordinate) {
        var projection = this.overlay.getProjection(),
                    mapWidth = this.map.getDiv().clientWidth,
                    mapHeight = this.map.getDiv().clientHeight,
                    top, left, bottom, right;

        if (eastWest) { // Y-coord (W, E)
            top = projection.fromContainerPixelToLatLng(new google.maps.Point(0, this.edgeOffset + this.borderOffset.top + 20)).lat();
            bottom = projection.fromContainerPixelToLatLng(new google.maps.Point(0, mapHeight - this.edgeOffset - this.borderOffset.bottom - 20)).lat();
            if (coordinate > top) {
                return top;
            } else if (coordinate < bottom) {
                return bottom;
            }
        } else {    // X-coord (N, S)
            right = projection.fromContainerPixelToLatLng(new google.maps.Point(mapWidth - this.edgeOffset - this.borderOffset.right - 20, 0)).lng();
            left = projection.fromContainerPixelToLatLng(new google.maps.Point(this.edgeOffset + this.borderOffset.left + 20, 0)).lng();
            if (coordinate < left) {
                return left;
            } else if (coordinate > right) {
                return right;
            }
        }
        return coordinate;
    };

    ninjaArrows.prototype.addMarker = function (marker) {
        if (marker) {
            this.marker.push(marker);
            this.repaint();
        }
    };

    ninjaArrows.prototype.removeMarker = function (marker) {
        if (marker) {
            for (var i = this.marker.length - 1; i >= 0; i--) {
                if (this.marker[i] === marker) {
                    this.marker.splice(i, 1);
                }
            }
            this.repaint();
        }
    };

    ninjaArrows.prototype.clearMarkers = function () {
        this.marker = [];
        this.clearArrows();
    };

    ninjaArrows.prototype.clearArrows = function () {
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].marker = [];
        }
    };

    ninjaArrows.prototype.register = function (event, callback) {
        if (eventTypes.indexOf(event) > -1) {
            if (!this.handlers[event]) {
                this.handlers[event] = [];
            }
            this.handlers[event].push(callback);
        }
    };

    ninjaArrows.prototype.unregister = function (event, callback) {
        if (eventTypes.indexOf(event) > -1 && this.handlers[event]) {
            for (var i = this.handlers[event].length - 1; i >= 0; i--) {
                if (this.handlers[event][i] === callback) {
                    this.handlers[event].splice(i, 1);
                }
            }
        }
    };

    ninjaArrows.prototype.fire = function (event, data) {
        if (this.handlers[event]) {
            for (var i = 0; i < this.handlers[event].length; i++) {
                this.handlers[event][i](data);
            }
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
            i, newColorStops = [], count;

        var spaces = colorStops.length - 1;
        var colorsLeft = resolution - colorStops.length;
        var factor = Math.floor(colorsLeft / spaces);

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
        if (count === 0) {
            newColors.push(colorA);
            return;
        }
        count--;
        var countAtmp = Math.ceil(count / 2);
        var countTmpB = count - countAtmp;
        var colorBetween = ninjaArrows.generateColorBetween(colorA, colorB);
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
            bB = (colorBInt & 0x0000FF) >> 0;

        var newColorInt = (((rA + rB) / 2) << 16) + (((gA + gB) / 2) << 8) + (((bA + bB) / 2) << 0);
        var newColorString = "#" + ("000000" + newColorInt.toString(16)).substr(-6);
        return newColorString;
    };

    return ninjaArrows;
})();
