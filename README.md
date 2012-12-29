swipe4.js
=========

_swipe4.js_ processes 4-way swipes on a dom and dispatches hooks.

Usage
-----

Load the script.
```html
<script type="text/javascript" src="path/to/swipe4.full.min.js"></script>
```

Then init swipe4 object.
```html
<script type="text/javascript">
$(function() {
  swipe4({
    target: $('#swipe-panel')[0],
    end: {
      up: function() { alert('swiped up.'); },
      down: function() { alert('swiped down.'); },
      left: function() { alert('swiped left.'); },
      right: function() { alert('swiped right.'); }
    }
  });
});
</script>
<div id="swipe-panel" style="width: 300px; height: 300px; background: indianred; "></div>
```

Options
-------

 name               | description
--------------------|---------------------------
 `target`           | dom target to swipe event.
 `init.func`        | custom init function
 `init.fps`         | swipe checking function's frequency
 `end`              | hook functions dispatched when swipes ended
 `end.up`           | function dispatched when swiped up
 `end.down`         | function dispatched when swiped down
 `end.right`        | function dispatched when swiped right
 `end.left`         | function dispatched when swiped left
 `end.neutral`      | function dispatched when swiped very small distance in any direction
 `progress`         | hook functions dispatched during swipes are continuing
 `progress.up`      | function dispatched during swipes are continuing above the starting point
 `progress.down`    | function dispatched during swipes are continuing below the starting point
 `progress.left`    | function dispatched during swipes are continuing on left of the starting point
 `progress.right`   | function dispatched during swipes are continuing on right of the starting point
 `progress.neutral` | function dispatched during swipes are continuing on almost the same point from the starting point
 `frameFunc`        | function called every frame
 `frameMonitor`     | function called every .1 second with first argument `fps` of frame function.


Build
-----

First, install grunt-cli globally.

```
npm install -g grunt-cli
```

Then init node_modules and grunt.

```
npm install
grunt
```
