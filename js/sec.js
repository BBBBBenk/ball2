var methods = {
    goLine: false,
    gravity: 0,
    x: 100,
    y: 100,
    canvas: "",
    visibleH: "",
    visibleW: "",
    context: "",
    windowToCanvas: function(x, y) {
        var bbox = this.canvas.getBoundingClientRect();
        return {
            x: (x - bbox.left) * (this.canvas.width / bbox.width),
            y: (y - bbox.top) * (this.canvas.height / bbox.height)
        };
    },
    initStage: function() {
        this.canvas.width = this.visibleW;
        this.canvas.height = this.visibleH;
    },
    drawABall: function() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, 50, 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
        // var vector = Math.sqrt(Math.pow(_this.x, 2) + Math.pow(_this.y, 2));
        // setInterval(function() {
        //     _this.context.beginPath();
        //     _this.context.arc(_this.x += _this.x / vector * -Math.cos((Math.PI / 180) * 180), _this.y += _this.y / vector * -Math.sin((Math.PI / 180) * 120), 50, 0, Math.PI * 2);
        //     _this.context.stroke();
        // }, 1000 / 60);
    },
    cleanCircle: function() {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 2;
        this.context.arc(this.x, this.y, 50, 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    },
    drawLine: function(x, y, color, linewidth) {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = linewidth;
        this.context.moveTo(this.lastPointX, this.lastPointY);
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    },
    mouseMoveHandle: function() {
        var _this = this;
        this.canvas.onmousemove = function(e) {
            var $loc = _this.windowToCanvas(e.offsetX, e.offsetY);
            _this.cleanCircle();
            if (_this.goLine) {
                _this.drawLine(_this.lastLinePointX, _this.lastLinePointY, "white", 2);
                _this.drawLine($loc.x, $loc.y, "black", 1);
            }
            _this.x = $loc.x;
            _this.y = $loc.y;
            _this.drawABall();
            _this.lastLinePointX = $loc.x;
            _this.lastLinePointY = $loc.y;
        }
    },
    mouseDownAndUpHandle: function() {
        var _this = this;
        this.canvas.onmousedown = function(e) {
            var $loc = _this.windowToCanvas(e.offsetX, e.offsetY);
            _this.lastPointX = $loc.x; //记录按下的点
            _this.lastPointY = $loc.y; //同上
            _this.goLine = true; //开启辅助线
        }
        this.canvas.onmouseup = function(e) {
            _this.goLine = false; //关闭辅助线
            _this.drawLine(_this.lastLinePointX, _this.lastLinePointY, "white", 2); //擦除鼠标松开后的最后一条线条
            _this.setAnimate();
        }
    },
    workVector: function() {
        var _this = this;
        var width = Math.abs(this.lastPointX - this.lastLinePointX);
        var height = Math.abs(this.lastLinePointY - this.lastPointY);
        var vector = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        var angle = Math.atan2(this.lastPointY - this.lastLinePointY, this.lastPointX - this.lastLinePointX);
        return {
            x: _this.x / vector + (Math.cos(angle) * vector / 10),
            y: _this.y / vector + (Math.sin(angle) * vector / 10)
        };
    },
    setAnimate: function() {
        var _this = this;
        var vector = this.workVector();
        this.person = vector.x / 100;
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
        this.canvas.onmousedown = null;
        var timer = setInterval(function() {
            _this.cleanCircle();
            _this.x += vector.x;
            _this.y += vector.y + _this.gravity;
            _this.gravity += 0.5;
            if (_this.y + 25 > _this.canvas.height) {
                vector.y = -vector.y;
                _this.gravity = -_this.gravity + 4;
                _this.y = _this.canvas.height - 25;
            } else if (_this.y < 0) {
                vector.y = -vector.y;
                _this.gravity = -_this.gravity + 4;
            }
            if (_this.x + 25 > _this.canvas.width) {
                vector.x = -vector.x;
                _this.x = _this.canvas.width - 25;
            } else if (_this.x - 25 < 0) {
                vector.x = -vector.x;
            }
            _this.drawABall();
        }, 1000 / 60);
    }
};

window.onload = function() {
    methods.visibleW = document.documentElement.clientWidth;
    methods.visibleH = document.documentElement.clientHeight;
    methods.canvas = $("#draw")[0];
    methods.context = methods.canvas.getContext('2d');
    methods.initStage();
    methods.mouseMoveHandle();
    methods.mouseDownAndUpHandle();
}