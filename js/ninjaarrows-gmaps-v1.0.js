/*
** The MIT License (MIT)
**
** Copyright (c) 2014 Andreas Tscheinig
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
    var ninjaArrow = function (map, position, count, direction, offset, style, jumpTo) {
        this.map = map;
        this.position = position || new google.maps.LatLng(46.62794, 14.30899);
        this.count = count || "0";
        this.direction = direction || 8;
        this.offset = offset || { x: 0, y: 0 };
        this.style = style || {};
        this.jumpTo = jumpTo;

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

        img.src = ninjaArrow.createNinjaArrowIcon(this.direction, this.count, this.style);
        div.appendChild(img);
        this.div = div;

        panes.floatPane.appendChild(this.div);

        var that = this;
        google.maps.event.addDomListener(this.div, "click", function () {
            var bounds = new google.maps.LatLngBounds();
            if (!that.marker) return;

            for (var i = 0; i < that.marker.length; i++) {
                bounds.extend(that.marker[i].getPosition());
            }
            if (!that.jumpTo) {
                bounds.union(that.map.getBounds());
            }
            that.map.fitBounds(bounds);
            if (that.map.getZoom() > 16) {
                that.map.setZoom(16);
            }

        });
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
        var src = ninjaArrow.createNinjaArrowIcon(this.direction, this.count, this.style);
        this.div.childNodes[0].src = src;
        this.draw();
    };

    ninjaArrow.createNinjaArrowIcon = function (direction, text, style) {
        if (!direction || !text) return null;

        var canvas = document.createElement("canvas"),
            context,
            textWidth,
            width = 40,
            height = 40,
            fontSize = 13,
            temp,
            angle,
            offsets,
            fillColor = style.fillColor,
            strokeColor = style.strokeColor,
            strokeWidth = style.strokeWidth,
            textColor = style.textColor;

        canvas.width = width;
        canvas.height = height;
        context = canvas.getContext("2d");
        context.translate(width / 2, height / 2);

        // draw text
        context.fillStyle = textColor;
        context.font = "bold " + fontSize + "px Arial";
        textWidth = context.measureText(text);
        temp = ninjaArrow.getAngleAndOffsetFromDirection(direction, fontSize, textWidth.width);
        angle = temp.angle;
        offsets = temp.offsets;
        context.fillText(text, offsets.x - textWidth.width / 2, offsets.y);

        // draw triangle and rotate according to the angle
        context.beginPath();
        context.moveTo(12 * Math.cos(deg2rad(angle)), 12 * Math.sin(deg2rad(angle)));
        context.lineTo(12 * Math.cos(deg2rad(270 + angle)), 12 * Math.sin(deg2rad(270 + angle)));
        context.lineTo(12 * Math.cos(deg2rad(180 + angle)), 12 * Math.sin(deg2rad(180 + angle)));
        //context.lineTo(12 * Math.cos(deg2rad(angle)), 12 * Math.sin(deg2rad(angle)));
        //context.closePath();

        context.fillStyle = fillColor;
        context.fill();

        context.lineWidth = strokeWidth;
        context.strokeStyle = strokeColor;
        context.stroke();

        return canvas.toDataURL();
    };

    ninjaArrow.getAngleAndOffsetFromDirection = function (direction, fontSize, textWidth) {
        var angle = 0, x = 0, y = 0;
        if (direction === 8) { // N ok
            angle = 0;
            y += fontSize;
        }
        else if (direction === 2) { // S ok
            angle = 180;
            y -= 2;
        }
        else if (direction === 12) { // NE
            angle = 45;
            y += fontSize;
            x -= textWidth / 2;
        }
        else if (direction === 4) { // E ok
            angle = 90;
            y += fontSize / 2 - 1;
            x -= textWidth / 2 + 3;
        }
        else if (direction === 6) { // SE ok
            angle = 135;
            y -= 2;
            x -= textWidth / 2;
        }
        else if (direction === 3) { // SW ok
            angle = -135;
            y -= 2;
            x += textWidth / 2;
        }
        else if (direction === 1) { // W ok
            angle = -90;
            y += fontSize / 2 - 1;
            x += textWidth / 2 + 3;
        }
        else if (direction === 9) { // NW
            angle = -45;
            y += fontSize;
            x += textWidth / 2;
        }
        return { angle: angle, offsets: { x: x, y: y} };
    };

    return ninjaArrow;
})();

NinjaArrows = (function () {

    var ARROW_STYLE = {
        fillColor: "rgb(153, 187, 232)",
        strokeColor: "black",
        strokeWidth: 2,
        textColor: "black"
    };

    var eventTypes = ["ninja_created", "ninja_calculated", "ninja_updated"];

    var ninjaArrows = function (map, marker, options) {
        if (!map) return;

        this.map = map;
        this.marker = marker || [];
        this.arrows = [];

        this.handlers = [];

        if (!options) options = {};
        this.style = options.style || ARROW_STYLE;
        this.edgeOffset = options.edgeOffset || 75;
        this.borderOffset = options.borderOffset || { top: 0, right: 0, bottom: 0, left: 70 };
        this.jumpTo = typeof options.jumpTo !== "boolean" ? true : options.jumpTo;

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

    ninjaArrows.prototype.init = function () {
        // NW N NE E SE S SW W [8,4,2,1] [N,E,S,W]
        this.arrows.push(this.createNinjaArrow("1001"));
        this.arrows.push(this.createNinjaArrow("1000"));
        this.arrows.push(this.createNinjaArrow("1100"));
        this.arrows.push(this.createNinjaArrow("0100"));
        this.arrows.push(this.createNinjaArrow("0110"));
        this.arrows.push(this.createNinjaArrow("0010"));
        this.arrows.push(this.createNinjaArrow("0011"));
        this.arrows.push(this.createNinjaArrow("0001"));
        this.fire("ninja_created", null);
    };

    ninjaArrows.prototype.createNinjaArrow = function (direction) {
        var arrow, x, y;
        direction = parseInt(direction, 2);
        if (direction & 8) { // North
            y = 20 + this.borderOffset.top;
        }
        else if (direction & 2) { // South
            y = -20 - this.borderOffset.bottom;
        }
        else {
            y = 0;
        }
        if (direction & 1) { // West
            x = 20 + this.borderOffset.left;
        }
        else if (direction & 4) { // East
            x = -20;
        }
        else {
            x = 0 - this.borderOffset.right;
        }
        //map, position, fillText, direction, offset, style
        arrow = new NinjaArrow(this.map, null, 0, direction, { x: -20 + x, y: -20 + y }, this.style, this.jumpTo);
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
        var arrow;
        if (!style) style = ARROW_STYLE;
        this.style = style;
        for (var i = 0; i < this.arrows.length; i++) {
            arrow = this.arrows[i];
            arrow.style = style;
            arrow.repaint();
        }
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
                if (direction & 8) { // North
                    y = 20 + this.borderOffset.top;
                }
                else if (direction & 2) { // South
                    y = -20 - this.borderOffset.bottom;
                }
                else {
                    y = 0;
                }
                if (direction & 1) { // West
                    x = 20 + this.borderOffset.left;
                }
                else if (direction & 4) { // East
                    x = -20;
                }
                else {
                    x = 0 - this.borderOffset.right;
                }
                this.arrows[i].offset = { x: -20 + x, y: -20 + y };
            }
        }
    };

    ninjaArrows.prototype.setJumpTo = function (jumpTo) {
        this.jumpTo = typeof jumpTo !== "boolean" ? true : jumpTo;
        for (var i = 0; i < this.arrows.length; i++) {
            this.arrows[i].jumpTo = this.jumpTo;
        }
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

    ninjaArrows.prototype.repaint = function () {
        var cntN = 0, cntNe = 0, cntE = 0, cntSe = 0, cntS = 0, cntSw = 0, cntW = 0, cntNw = 0;
        var cntAvgN = 0, cntAvgE = 0, cntAvgS = 0, cntAvgW = 0, avgN = 0, avgE = 0, avgS = 0, avgW = 0;
        var bounds = 0, top = 0, right = 0, bottom = 0, left = 0, x, y, i;
        var direction, marker, arrow, arrowsToShow = [];

        bounds = this.map.getBounds();
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
                direction = 9;
            }
            else if (y > top && x > right) {
                cntNe += marker.count || 1;
                direction = 12;
            }
            else if (y > top) {
                cntN += marker.count || 1;
                cntAvgN++;
                direction = 8;
                avgN += x;
            }
            else if (y < bottom && x < left) {
                cntSw += marker.count || 1;
                direction = 3;
            }
            else if (y < bottom && x > right) {
                cntSe += marker.count || 1;
                direction = 6;
            }
            else if (y < bottom) {
                cntS += marker.count || 1;
                cntAvgS++;
                direction = 2;
                avgS += x;
            }
            else if (x < left) {
                cntW += marker.count || 1;
                cntAvgW++;
                direction = 1;
                avgW += y;
            }
            else if (x > right) {
                cntE += marker.count || 1;
                cntAvgE++;
                direction = 4;
                avgE += y;
            }
            arrow = this.getNinjaArrowByDirection(direction);
            if (arrow) {
                arrow.marker.push(marker);
            }
        }
        avgN /= cntAvgN; avgE /= cntAvgE; avgS /= cntAvgS; avgW /= cntAvgW;

        this.fire("ninja_calculated", null);

        if (cntN !== 0) { //N
            arrow = this.getNinjaArrowByDirection(8);
            arrow.count = cntN;
            arrow.position = new google.maps.LatLng(top, this.calculateOffset(false, arrow, avgN));
            arrowsToShow.push(arrow);
        }
        if (cntNe !== 0) {  // NE
            arrow = this.getNinjaArrowByDirection(12);
            arrow.count = cntNe;
            arrow.position = new google.maps.LatLng(top, right);
            arrowsToShow.push(arrow);
        }
        if (cntNw !== 0) {  // NW
            arrow = this.getNinjaArrowByDirection(9);
            arrow.count = cntNw;
            arrow.position = new google.maps.LatLng(top, left);
            arrowsToShow.push(arrow);
        }
        if (cntW !== 0) {   // W
            arrow = this.getNinjaArrowByDirection(1);
            arrow.count = cntW;
            arrow.position = new google.maps.LatLng(this.calculateOffset(true, arrow, avgW), left);
            arrowsToShow.push(arrow);
        }
        if (cntE !== 0) {   // E
            arrow = this.getNinjaArrowByDirection(4);
            arrow.count = cntE;
            arrow.position = new google.maps.LatLng(this.calculateOffset(true, arrow, avgE), right);
            arrowsToShow.push(arrow);
        }
        if (cntSw !== 0) {  // SW
            arrow = this.getNinjaArrowByDirection(3);
            arrow.count = cntSw;
            arrow.position = new google.maps.LatLng(bottom, left);
            arrowsToShow.push(arrow);
        }
        if (cntS !== 0) {   // S
            arrow = this.getNinjaArrowByDirection(2);
            arrow.count = cntS;
            arrow.position = new google.maps.LatLng(bottom, this.calculateOffset(false, arrow, avgS));
            arrowsToShow.push(arrow);
        }
        if (cntSe !== 0) {  // SE
            arrow = this.getNinjaArrowByDirection(6);
            arrow.count = cntSe;
            arrow.position = new google.maps.LatLng(bottom, right);
            arrowsToShow.push(arrow);
        }

        for (i = 0; i < arrowsToShow.length; i++) {
            arrowsToShow[i].repaint();
            arrowsToShow[i].show();
        }

        this.fire("ninja_updated", { count: arrowsToShow.length });
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
            right = projection.fromContainerPixelToLatLng(new google.maps.Point(mapWidth - this.edgeOffset + this.borderOffset.right - 20, 0)).lng();
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
                if (this.marker === marker) {
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
            this.handlers[event] = callback;
        }
    };

    ninjaArrows.prototype.fire = function (event, data) {
        if (this.handlers[event]) {
            this.handlers[event](data);
        }
    };

    return ninjaArrows;
})();

/**
* Convert radians to degrees.
* @param angle {number}
* @returns {number}
*/
function rad2deg(angle) {
    return angle * (180 / Math.PI);
}

/**
* Convert degrees to radians
* @param angle {number}
* @returns {number}
*/
function deg2rad(angle) {
    return angle * (Math.PI / 180);
}
