var methods = {
    initStage: function(canvas) {
        canvas.width = ls.visibleW;
        canvas.height = ls.visibleH;
    },
    windowsTocanvas: function(canvas, x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: (x - bbox.left) * (canvas.width / bbox.width),
            y: (y - bbox.top) * (canvas.height / bbox.height)
        };
    },
    drawCircle: function(canvas, x, y, r) {
        canvas.save();
        canvas.beginPath();
        canvas.arc(x, y, r, 0, Math.PI * 2);
        canvas.stroke();
        canvas.restore();
    },
    clipCircle: function(canvas, x, y, r) {
        canvas.save();
        canvas.beginPath();
        canvas.arc(x, y, r + 1, 0, Math.PI * 2);
        canvas.clip();
        canvas.clearRect(0, 0, ls.visibleW, ls.visibleH);
        canvas.restore();
    },
    drawLine: function(canvas, mx, my, dx, dy) {
        canvas.save();
        canvas.beginPath();
        canvas.moveTo(mx, my);
        canvas.lineTo(dx, dy);
        canvas.stroke();
        canvas.closePath();
        canvas.restore();
    },
    clearLine: function(canvas, lastCoordinate, fixedCoordinate) {
        canvas.save();
        canvas.beginPath();
        canvas.moveTo(fixedCoordinate.x, fixedCoordinate.y);
        canvas.strokeStyle = 'White';
        canvas.lineWidth = '2';
        canvas.lineTo(lastCoordinate.x, lastCoordinate.y);
        canvas.stroke();
        canvas.restore();
    },
    moveCircle: function(e) {
        var $loc = methods.windowsTocanvas(ls.stage[0], e.offsetX, e.offsetY);
        methods.clipCircle(ls.context, ls.lastCoordinate.x, ls.lastCoordinate.y, 50);
        methods.drawCircle(ls.context, $loc.x, $loc.y, 50);
        ls.lastCoordinate = $loc;
    },
    supportLine: function(e) {
        var $loc = methods.windowsTocanvas(ls.stage[0], e.offsetX, e.offsetY);
        methods.clipCircle(ls.context, ls.lastCoordinate.x, ls.lastCoordinate.y, 50);
        methods.clearLine(ls.context, ls.lastCoordinate, ls.fixedPoint);
        methods.drawLine(ls.context, ls.fixedPoint.x, ls.fixedPoint.y, $loc.x, $loc.y);
        methods.drawCircle(ls.context, $loc.x, $loc.y, 50);
        ls.lastCoordinate = $loc;

    },
    countCoord: function() {
        ls.v += ls.a;
        ls.y += ls.v;
        ls.x += ls.power / 10;
    },
    mouserelease: function(e) {
        var $loc = methods.windowsTocanvas(ls.stage[0], e.offsetX, e.offsetY);
        ls.x = $loc.x;
        ls.y = $loc.y;
        ls.a = 0.1;
        ls.v = 0.1;
        var timer = setInterval(function() {
            methods.countCoord();
            methods.clipCircle(ls.context, ls.animateCoord.x, ls.animateCoord.y, 50);
            //methods.animateShadow();
            methods.drawCircle(ls.context, ls.x, ls.y, 50);
            ls.animateCoord = { x: ls.x, y: ls.y };
            if (ls.y > 500) {
                clearInterval(timer);
            }
        }, 1000 / 60);
    },
    animateShadow: function() {
        ls.context.save();
        ls.context.beginPath();
        ls.context.fillStyle = "rgba(255,255,255,0.2)";
        ls.context.fillRect(0, 0, ls.stage[0].width, ls.stage[0].height);
        ls.context.restore();
    }
}

var ls = {
    v: 0,
    a: 0,
    x: 0,
    y: 0,
    power: 0,
    fixedPoint: "",
    lastCoordinate: "",
    animateCoord: "",
    visibleH: document.documentElement.clientHeight,
    visibleW: document.documentElement.clientWidth
};

$(document).ready(function() {
    ls.stage = $("#draw");
    ls.context = ls.stage[0].getContext("2d");
    methods.initStage(ls.context.canvas);
    ls.stage[0].onmousemove = methods.moveCircle;
    ls.stage[0].onmousedown = function(e) {
        ls.fixedPoint = methods.windowsTocanvas(ls.stage[0], e.offsetX, e.offsetY);
        ls.stage[0].onmousemove = methods.supportLine;
        ls.stage[0].onmouseup = function(e) {
            var $loc = methods.windowsTocanvas(ls.stage[0], e.offsetX, e.offsetY);
            methods.clearLine(ls.context, ls.lastCoordinate, ls.fixedPoint);
            ls.power = Math.sqrt((ls.fixedPoint.x - $loc.x) * (ls.fixedPoint.x - $loc.x) + ($loc.y - ls.fixedPoint.y) * ($loc.y - ls.fixedPoint.y));
            ls.stage[0].onmousemove = methods.moveCircle;
            methods.mouserelease(e);
        };
    }
});