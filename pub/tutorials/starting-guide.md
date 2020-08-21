### Download and load

Download [Shape.js](https://github.com/csc309-summer-2020/js-library-islamdav/tree/master/pub/js).

{@link Shape#generateJuliaFractals} requires [mathjs](https://mathjs.org/).

### Basic Usage

Set up your HTML markup.

```html
<canvas id="canvas"></canvas>
```

Add [shape.js](https://github.com/csc309-summer-2020/js-library-islamdav/tree/master/pub/js) just before your closing `<body>` tag, after [mathjs](https://mathjs.org/).

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.1.0/math.min.js"
  integrity="sha512-rCvDXOM8HOkDDjC0l9vQPhUg2n0rKlcsCtDjWG0ajYmVfjgtO6egt/RdSbKSzFCIUaE/OQRwmiU/4PmOeK3J+Q=="
  crossorigin="anonymous"
></script>
<script type="text/javascript" src="./shape.js"></script>
```

Initialize a shape instance in your script file or an inline script tag, optionally making it full screen.

```javascript
const shapeInstance = new Shape("canvas");
shapeInstance.fitCanvasToScreen();
```

Call your favourite method and enjoy the webart.

```javascript
shapeInstance.generateFollowingCircles({
  n: 1000,
  maxRadius: 50,
  colours: shapeInstance1.colours.fogUnderWhiteSky,
});
```

When complete, your HTML should look something like:

```html
<html>
  <head>
    <title>My Now Amazing Webpage</title>
  </head>
  <body>
    <canvas id="canvas"></canvas>

    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.1.0/math.min.js"
      integrity="sha512-rCvDXOM8HOkDDjC0l9vQPhUg2n0rKlcsCtDjWG0ajYmVfjgtO6egt/RdSbKSzFCIUaE/OQRwmiU/4PmOeK3J+Q=="
      crossorigin="anonymous"
    ></script>
    <script type="text/javascript" src="./shape.js"></script>

    <script>
      const shapeInstance = new Shape("canvas");
      shapeInstance.fitCanvasToScreen();
      shapeInstance.generateFollowingCircles({
        n: 1000,
        maxRadius: 50,
        colours: shapeInstance1.colours.fogUnderWhiteSky,
      });
    </script>
  </body>
</html>
```
