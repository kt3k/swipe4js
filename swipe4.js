/**
 * swipe4.js 1.1.0
 * author: kt3k (Yosiya Hinosawa)
 * license: MIT lisence
 */

 // swipe4 is now singleton because the underlying mainloop.js is singleton and
 // not supporting multiple mainloops.
 // But it is possible to have non-singleton version of swipe4 which only support
 // end handlers and not progress handlers.

this.swipe4 = this.exports = function (window) {
    'use strict';

    /* module constants */
    var DIRECTION = {
        UP: 0,
        DOWN: 1,
        RIGHT: 2,
        LEFT: 3
    };

    var SWIPE = {
        THRESHOLD: 3
    };

    var PHASE = {
        NONE: 0,
        TOUCHING: 1,
        END: 2,
        CANCEL: 3
    };

    /* utilities */

    var nop = function () {};

    var nopIfNotFunction = function (func) {
        return typeof func === 'function' ? func : nop;
    };

    /* module variables */
    var swipe = null;

    var phase = null;
    var fingerCount = 0;

    var touchCurrent = null;
    var touchInitial = null;

    /* swipe utilities */
    var swipeDistance = function () { // uniform distance
        var x = touchCurrent.pageX - touchInitial.pageX;
        var y = touchCurrent.pageY - touchInitial.pageY;
        return Math.max(Math.abs(x), Math.abs(y));
    };

    var swipeAngle = function () {
        var rad = Math.atan2(
            touchCurrent.pageY - touchInitial.pageY,
            touchCurrent.pageX - touchInitial.pageX
        );
        return (Math.floor(rad * 180 / Math.PI) + 360) % 360;
    };

    var swipeDirection = function () {
        var angle = swipeAngle();
        if (angle < 45 || 315 <= angle) {
            return DIRECTION.RIGHT;
        } else if (45 <= angle && angle < 135) {
            return DIRECTION.DOWN;
        } else if (135 <= angle && angle < 225) {
            return DIRECTION.LEFT;
        } else {
            return DIRECTION.UP;
        }
    };

    var swipeEnd = function () {
        var dist = swipe.ctx.dist = swipeDistance();
        if (dist < SWIPE.THRESHOLD) {
            swipe.ctx.swiped = false;
            swipe.end.neutral();
            return;
        }
        swipe.ctx.swiped = true;
        var dir = swipe.ctx.dir = swipeDirection();
        if (dir === DIRECTION.UP) {
            swipe.end.up();
        } else if (dir === DIRECTION.RIGHT) {
            swipe.end.right();
        } else if (dir === DIRECTION.DOWN) {
            swipe.end.down();
        } else if (dir === DIRECTION.LEFT) {
            swipe.end.left();
        }
    };

    var swipeProgress = function (count) {
        if (count % 10 !== 0) {
            return;
        }

        var dist = swipe.ctx.dist = swipeDistance();
        if (dist < SWIPE.THRESHOLD) {
            swipe.progress.neutral();
            return;
        }

        var dir = swipe.ctx.dir = swipeDirection();
        if (dir === DIRECTION.UP) {
            swipe.progress.up();
        } else if (dir === DIRECTION.RIGHT) {
            swipe.progress.right();
        } else if (dir === DIRECTION.DOWN) {
            swipe.progress.down();
        } else if (dir === DIRECTION.LEFT) {
            swipe.progress.left();
        }
    };

    // touch event handlers and a resetter
    var touchStart = function (touch) {
        touchInitial = {pageX: touch.pageX, pageY: touch.pageY};
        touchCurrent = touch;
        phase = PHASE.TOUCHING;
        fingerCount = 1;
    };

    var touchMove = function (touch) {
        touchCurrent = touch;
    };

    var touchEnd = function () {
        phase = PHASE.END;
    };

    var touchCancel = function () {
        phase = PHASE.CANCEL;
    };

    var touchReset = function () {
        phase = PHASE.NONE;
        touchCurrent = {pageX: 0, pageY: 0};
        fingerCount = 0;
    };

    var setHandlers = function () {
        swipe.handlers = {
            touchStart: function (event) {
                event.preventDefault();
                if (event.touches.length === 1) {
                    touchStart(event.touches[0]);
                } else {
                    touchCancel();
                }
            },

            touchMove: function (event) {
                event.preventDefault();
                if (fingerCount === 1) {
                    touchMove(event.touches[0]);
                } else {
                    touchCancel();
                }
            },

            touchEnd: function (event) {
                event.preventDefault();
                if (fingerCount === 1) {
                    touchEnd();
                } else {
                    touchCancel();
                }
            },

            touchCancel: function (event) {
                event.preventDefault();
                touchCancel();
            },

            mouseDown: function (event) {
                event.preventDefault();
                touchStart(event);
            },

            mouseMove: function (event) {
                event.preventDefault();
                touchMove(event);
            },

            mouseUp: function (event) {
                event.preventDefault();
                touchEnd();
            }
        };
    };

    var bindEvents = function () {
        var elm = swipe.target;

        setHandlers();
        if (window.document.documentElement.hasOwnProperty('ontouchstart')) {
            elm.addEventListener('touchstart', swipe.handlers.touchStart, false);
            elm.addEventListener('touchmove', swipe.handlers.touchMove, false);
            elm.addEventListener('touchend', swipe.handlers.touchEnd, false);
            elm.addEventListener('touchcancel', swipe.handlers.touchCancel, false);
        } else {
            elm.addEventListener('mousedown', swipe.handlers.mouseDown, false);
            elm.addEventListener('mousemove', swipe.handlers.mouseMove, false);
            elm.addEventListener('mouseup', swipe.handlers.mouseUp, false);
        }
    };

    var unbindEvents = function () {
        var elm = swipe.target;

        if (window.document.documentElement.hasOwnProperty('ontouchstart')) {
            elm.removeEventListener('touchstart', swipe.handlers.touchStart, false);
            elm.removeEventListener('touchmove', swipe.handlers.touchMove, false);
            elm.removeEventListener('touchend', swipe.handlers.touchEnd, false);
            elm.removeEventListener('touchcancel', swipe.handlers.touchCancel, false);
        } else {
            elm.removeEventListener('mousedown', swipe.handlers.mouseDown, false);
            elm.removeEventListener('mousemove', swipe.handlers.mouseMove, false);
            elm.removeEventListener('mouseup', swipe.handlers.mouseUp, false);
        }
    };

    var frameFunc = function (count) {
        if (phase === PHASE.NONE) {
            return;
        }
        if (phase === PHASE.TOUCHING) {
            swipeProgress(count);
            swipe.frameFunc(touchCurrent);
        } else if (phase === PHASE.END) {
            swipe.end.preHook();

            swipeEnd();

            touchReset();
            swipe.frameFunc(touchCurrent);

            swipe.end.postHook(swipe.ctx);

            touchReset();
            swipe.frameFunc(touchCurrent);
        } else if (phase === PHASE.CANCEL) {
            touchReset();
            swipe.frameFunc(touchCurrent);
        }
    };

    var initContext = function (swipe) {
        // init swipe context.
        swipe.ctx = {
            dir: null,
            dist: null,
            swiped: false
        };

        // set empty object if not specified.
        swipe.init || (swipe.init = {});

        // if init itself function then set it as init.func.
        typeof swipe.init === 'function' && (swipe.init.func = swipe.init);
        swipe.init.func = nopIfNotFunction(swipe.init.func);

        // set default fps 30.
        swipe.init.fps || (swipe.init.fps = 30);

        // set default target body.
        swipe.target || (swipe.target = window.document.body);

        // set default phase NONE.
        phase = swipe.init.phase != null ? swipe.init.phase : PHASE.NONE;

        // init by nop if not specified
        swipe.frameFunc = nopIfNotFunction(swipe.frameFunc);
        swipe.frameMonitor = nopIfNotFunction(swipe.frameMonitor);

        swipe.end || (swipe.end = {});
        swipe.end.neutral = nopIfNotFunction(swipe.end.neutral);
        swipe.end.up = nopIfNotFunction(swipe.end.up);
        swipe.end.down = nopIfNotFunction(swipe.end.down);
        swipe.end.left = nopIfNotFunction(swipe.end.left);
        swipe.end.right = nopIfNotFunction(swipe.end.right);
        swipe.end.preHook = nopIfNotFunction(swipe.end.preHook);
        swipe.end.postHook = nopIfNotFunction(swipe.end.postHook);

        swipe.progress || (swipe.progress = {});
        swipe.progress.neutral = nopIfNotFunction(swipe.progress.neutral);
        swipe.progress.up = nopIfNotFunction(swipe.progress.up);
        swipe.progress.down = nopIfNotFunction(swipe.progress.down);
        swipe.progress.left = nopIfNotFunction(swipe.progress.left);
        swipe.progress.right = nopIfNotFunction(swipe.progress.right);
    };

    var exports = function (swipe_) {
        swipe_ || (swipe_ = {});

        swipe = swipe_;

        initContext(swipe);

        bindEvents();

        // custom initialization
        swipe.init.func();

        touchReset();
        swipe.frameFunc(touchCurrent);

        swipe.mainloop = window.mainloop({
            fps: swipe.init.fps,
            frameFunc: frameFunc,
            frameMonitor: swipe.frameMonitor
        }).run();

        return swipe.mainloop;
    };

    exports.clear = function () {
        window.mainloop.reset();
        unbindEvents();
    };

    exports.PHASE = PHASE;
    exports.DIRECTION = DIRECTION;
    exports.SWIPE = SWIPE;

    return exports;

}(this);
