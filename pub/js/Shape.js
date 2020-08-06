'use strict';
console.log("Shape.js");

/* The main entry point to the library */
class Shape {

  /* Constructs a new instance of this library on the canvas with id <canvasID>*/
  constructor(canvasID) {
    this.canvas = document.querySelector(`#${canvasID}`);
    this.context = this.canvas.getContext("2d");
    this._rect = this.canvas.getBoundingClientRect();

    // Used for mouse interactivity
    this.mouse = { x: undefined, y: undefined, range: undefined };

    this.rectangles = [];
    this.circles = [];

    // Globals
    // Circle
    this.MAX_RADIUS = 100;
    this.MIN_RADIUS = 5;
    this.SHRINK_RADIUS = 5;
    this.SPEED = 1;
    this.SHRINK_RATE = 3;
    this.GROW_RATE = 3;

    this.RANGE = 50;

    // Rectangle
    this.MAX_WIDTH = this.canvas.width;
    this.MAX_HEIGHT = this.canvas.height;
    this.MIN_HEIGHT = this.canvas.height * 0.10;
    this.MIN_WIDTH = this.canvas.width * 0.10;
    this.COMPRESSED_HEIGHT = this.canvas.height * 0.10;
    this.AMP_SPEED = 25;

    // Colours
    this.colours = {
      rariSeatOrange: ["#031226", "#2E4159", "#64758C", "#B0C1D9", "#E38F4C"],
      colors02: ["#3F8EBF", "#042F40", "#167362", "#F2A20C", "#D90404"],
      colorThemesky: ["#00020D", "#242B40", "#101726", "#4F5F73", "#8195A6"],
    }
  }

  /* Creates and returns a new rectangle instance given the parameters in <options>*/
  makeRectangle(options) {
    const newRect = new Rectangle(options, this.context, this.canvas);
    this.rectangles.push(newRect);
    return newRect;
  }

  /* Creates and returns a new circle instance given the parameters in <options>*/
  makeCircle(options) {
    const newCircle = new Circle(options, this.context, this.canvas);
    this.circles.push(newCircle);
    return newCircle;
  }

  /* Fits canvas to the screen */
  fitCanvasToScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._rect = this.canvas.getBoundingClientRect(); // Update
  }

  /* Generates random static circles given the parameters in <options> */
  generateCircles(options) {
    this._createRandomCircles(options, true);
  }

  /* A helper function used to create random circles given some options, optionally drawing them
  on the canvas. This can be used to create static, animated, or even interactive circles. */
  _createRandomCircles(options, draw = false, animated = false, interactive = false) {
    let { n, maxRadius, minRadius, shrinkRadius, filled, colours, speed, shrinkRate, growRate } = options;
    // Set optional params
    maxRadius = maxRadius === undefined ? this.MAX_RADIUS : maxRadius;
    minRadius = minRadius === undefined ? this.MIN_RADIUS : minRadius;
    shrinkRadius = shrinkRadius === undefined ? this.SHRINK_RADIUS : shrinkRadius;
    filled = filled === undefined ? true : filled;
    speed = speed === undefined ? this.SPEED : speed;
    shrinkRate = shrinkRate === undefined ? this.SHRINK_RATE : shrinkRate;
    growRate = growRate === undefined ? this.GROW_RATE : growRate;

    for (let i = 0; i < n; i++) {
      // Create <n> circles, randomizing some of their properties
      const circleRadius = Math.random() * (maxRadius - minRadius) + minRadius; // minRadius <= circleRadius <= radius
      // Circle's center (x,y)
      const x = animated ? Math.random() * (this.canvas.width - circleRadius * 2) + circleRadius : Math.random() * this.canvas.width;
      const y = animated ? Math.random() * (this.canvas.height - circleRadius * 2) + circleRadius : Math.random() * this.canvas.height;
      // Circle's velocity
      const randX = Math.random() - 0.5;
      const randY = Math.random() - 0.5;
      const dx = randX < 0 ? Math.floor(randX) * speed : Math.ceil(randX) * speed;
      const dy = randY < 0 ? Math.floor(randY) * speed : Math.ceil(randY) * speed;
      // Colour
      const circleColour = colours === undefined ? randomColour() : colours[Math.floor(Math.random() * colours.length)];
      // Make new circle
      const newCircle = this.makeCircle({ x, y, radius: circleRadius, filled, dx, dy, colour: circleColour, shrinkRate, growRate, shrinkRadius, interactive, animated });
      if (draw) {
        newCircle.draw();
      }
    }
  }

  /* Generates n random animated circles */
  generateAnimatedCircles(options) {
    this._createRandomCircles(options, false, true);
    this.animateCircles();
  }

  /* Generates random static or animated circles with interactivity */
  generateInteractiveCircles(options) {
    const { animated, range } = options;
    // Keep track of the mouse's position
    this._addMouseMoveEventListener(range);
    this._createRandomCircles(options, !animated, animated, true);
    this.animateCircles();
  }

  /* Generates n random static rectangles */
  generateRectangles(options) {
    this._createRandomRectangles(options, true);
  }

  /* A helper function used to create random static rectangles given some options */
  _createRandomRectangles(options, draw = false) {
    let { n, filled, colours, maxWidth, maxHeight, minWidth, minHeight } = options;
    // Set optional params
    filled = filled === undefined ? true : filled;
    maxWidth = maxWidth === undefined ? this.MAX_WIDTH : maxWidth;
    maxHeight = maxHeight === undefined ? this.MAX_HEIGHT : maxHeight;
    minWidth = minWidth === undefined ? this.MIN_WIDTH : minWidth;
    minHeight = minHeight === undefined ? this.MIN_HEIGHT : minHeight;

    for (let i = 0; i < n; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const width = Math.random() * (maxWidth - minWidth) + minWidth;
      const height = Math.random() * (maxHeight - minHeight) + minHeight;
      const rectColour = colours === undefined ? randomColour() : colours[Math.floor(Math.random() * colours.length)];
      const rect = this.makeRectangle({ x, y, width, height, colour: rectColour, filled })
      if (draw) {
        rect.draw();
      }
    }
  }

  /* A helper function used to set this mouse's position relative to the canvas */
  _setMousePosition(e) {
    this.mouse.x = e.x - this._rect.left;
    this.mouse.y = e.y - this._rect.top;
  }

  /* A helper function used to add a 'mousemove' event to the canvas */
  _addMouseMoveEventListener(range) {
    this.canvas.addEventListener("mousemove", e => {
      this._setMousePosition(e);
    })
    this.mouse.range = range === undefined ? this.RANGE : range;
  }

  /* Generates n random amplifying rectangles */
  generateAmplifyingRectangles(options) {
    const { range } = options;
    this._createRectanglesFixedToBottom(options);
    this._addMouseMoveEventListener(range);
    this.animateRectangles();
  }

  /* A helper method that creates random rectangles of the same width whose base is at the bottom of the canvas */
  _createRectanglesFixedToBottom(options) {
    let { n, colours, minHeight, maxHeight, compressedHeight, speed } = options;
    // Set optional params
    minHeight = minHeight === undefined ? this.MIN_HEIGHT : minHeight;
    maxHeight = maxHeight === undefined ? this.MAX_HEIGHT : maxHeight;
    compressedHeight = compressedHeight === undefined ? this.COMPRESSED_HEIGHT : compressedHeight;
    speed = speed === undefined ? this.AMP_SPEED : speed;

    const width = this.canvas.width / n;
    const filled = true;

    for (let i = 0; i < n; i++) {
      const x = width * i;
      const height = (Math.random() * (maxHeight - minHeight)) + minHeight;
      const y = this.canvas.height - height;
      const colour = colours === undefined ? randomColour() : colours[Math.floor(Math.random() * colours.length)];
      this.makeRectangle({ x, y, width, height, minHeight: compressedHeight, colour, filled, speed });
    }
  }

  /* Clears the canvas */
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /* Animates all circles in the circles array */
  animateCircles() {
    requestAnimationFrame(this.animateCircles.bind(this));
    this.clearCanvas();
    this.circles.forEach(circle => circle.update({ mouse_x: this.mouse.x, mouse_y: this.mouse.y, range: this.mouse.range }));
  }

  /* Animates the rectangles in an amplifying way */
  animateRectangles() {
    requestAnimationFrame(this.animateRectangles.bind(this));
    this.clearCanvas();
    this.rectangles.forEach(rect => rect.update(this.mouse.x, this.mouse.range));
  }

  /* Generates Mandelbrotset fractals with mouse interactivity */
  generateMandelbrotSetFractals(options) {
    const { zoomFactor, maxIterations, hue } = options;
    const Shape = this; // bound this
    // Initialize params
    // TODO: These depend on canvas size
    let zoom = 150;
    let panX = 1.5;
    let panY = 1.2;
    const _hue = hue == undefined ? 0 : hue;
    const offsetX = -Shape.canvas.width / 2;
    const offsetY = -Shape.canvas.height / 2;
    const defaultZoomFactor = zoomFactor == undefined ? 2.00 : zoomFactor;
    let _zoomFactor;
    const _maxIterations = maxIterations == undefined ? 150 : maxIterations;
    const bailout = 5;

    /* Returns 0 iff the complex number z=x+iy belongs to the set. Otherwise returns a percentage
    used for colour lightness */
    function _belongsToMandelbrotSet(x, y) {
      let realComp = x;
      let imaginaryComp = y;

      for (let i = 0; i < _maxIterations; i++) {
        const tempRealComp = realComp * realComp - imaginaryComp * imaginaryComp + x;
        const tempImComp = 2 * realComp * imaginaryComp + y;
        realComp = tempRealComp;
        imaginaryComp = tempImComp;

        if (realComp * imaginaryComp > bailout)
          return (i / _maxIterations * 100); // z not in set
      }
      return 0; // z is in set i.e. failed to reach escape condition
    }

    /* Draws coloured pixels on the canvas creating the desired fractal using the 
    so-called "escape time algorithm"*/
    function _createMandelbrotSetFractals() {
      for (let x = 0; x < Shape.canvas.width; x++) {
        for (let y = 0; y < Shape.canvas.height; y++) {
          const colourValue = _belongsToMandelbrotSet(x / zoom - panX, y / zoom - panY);
          if (colourValue == 0) {
            // Draw a black pixel
            Shape.context.fillStyle = '#000';
            Shape.context.fillRect(x, y, 1, 1);
          } else {
            // Draw a colourful pixel using CSS HSL function
            Shape.context.fillStyle = 'hsl(' + _hue + ', 100%, ' + colourValue + '%)';
            Shape.context.fillRect(x, y, 1, 1);
          }
        }
      }
    }

    /* Zooms the fractal at the mouse position */
    function _zoomFractal(zoomin) {
      if (zoomin) {
        zoom *= _zoomFactor;
        const dx = -(Shape.mouse.x + offsetX + panX + 90 * _zoomFactor) / zoom * _zoomFactor;
        const dy = -(Shape.mouse.y + offsetY + panY + 50 * _zoomFactor) / zoom * _zoomFactor;
        // log('dx', dx);
        // log('dy', dy);
        panX += dx;
        panY += dy;
      } else {
        zoom /= _zoomFactor;
        const dx = -(Shape.mouse.x + offsetX - panX - 90 * _zoomFactor) / zoom;
        const dy = -(Shape.mouse.y + offsetY - panY - 50 * _zoomFactor) / zoom;
        // log('dx', dx);
        // log('dy', dy);
        panX += dx;
        panY += dy;
      }
    }

    /* When user clicks down, zoom in; holding shift key, pan; holding alt/option, zoom out. */
    Shape.canvas.addEventListener('mousedown', e => {
      Shape._setMousePosition(e);
      _zoomFactor = e.shiftKey ? 1.0 : defaultZoomFactor;
      const zoomIn = e.altKey ? false : true;
      _zoomFractal(zoomIn)
      // Re-render
      _createMandelbrotSetFractals();
    });

    // Init fractals
    _createMandelbrotSetFractals();
  }


}

/* An "abstract" class. All shapes should extend this class. */
class _Shape {
  constructor(options, context, canvas) {
    this.ctx = context;
    this.canvas = canvas;
    this.colour = options.colour || "rgb(0,0,0)";
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.isFilled = options.filled === undefined ? true : options.filled;
    this.animated = options.animated === undefined ? false : options.animated;
    this.interactive = options.interactive === undefined ? false : options.interactive;
  }

  /* Draws this shape on the canvas */
  draw() {
    if (this.isFilled) {
      this.fill();
    } else {
      this.outline();
    }
  }

  /* Fills this shape. Must be implemented. */
  fill() { }

  /* Strokes this shape. Must be implemented. */
  outline() { }
}


class Circle extends _Shape {
  constructor(options, ctx, canvas) {
    super(options, ctx, canvas);
    this.curRadius = options.radius || 50;
    this.originalRadius = options.radius || 50;
    this.minRadius = options.shrinkRadius || 5;
    this.maxRadius = options.radius;
    this.dx = options.dx || 1;
    this.dy = options.dy || 1;
    this.shrinkRate = options.shrinkRate || 1;
    this.growRate = options.growRate || 1;
  }

  _drawCircle() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.curRadius, degToRad(0), degToRad(360), false);
  }

  fill() {
    this.ctx.fillStyle = this.colour;
    this._drawCircle();
    this.ctx.fill();
  }

  outline() {
    this.ctx.strokeStyle = this.colour;
    this._drawCircle();
    this.ctx.stroke();
  }

  /* Updates this circle's state */
  update(options = {}) {
    const { mouse_x, mouse_y, range } = options;
    if (this.animated) {
      this._updatePosition()
    }
    if (this.interactive) {
      this._addInteractivity(mouse_x, mouse_y, range);
    }
    this.draw();
  }

  /* Updates the position of this circle, taking into account the boundaries */
  _updatePosition() {
    // Check walls
    if (this.x + this.curRadius > this.canvas.width || this.x - this.curRadius < 0) {
      // Switch directions
      this.dx = -this.dx;
    }
    if (this.y + this.curRadius > this.canvas.height || this.y - this.curRadius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  /* Makes this circle interactive to the cursor */
  _addInteractivity(mouse_x, mouse_y, range) {
    if (Math.abs(mouse_x - this.x) < range && Math.abs(mouse_y - this.y) < range && this.curRadius >= this.minRadius + this.shrinkRate) {
      // Shrink circle
      this.curRadius -= this.shrinkRate;
    } else if (Math.abs(mouse_x - this.x) >= range && Math.abs(mouse_y - this.y) >= range && this.curRadius < this.originalRadius) {
      // Grow circle back to its original size
      this.curRadius += this.growRate;
    } else if (this.curRadius > this.originalRadius) {
      // Circle is too big
      this.curRadius -= 1;
    }
  }

  /* Animates the circle by bouncing it off walls */
  animate(speed = 1) {
    this.animated = true;
    this.dx = this.dy = speed;
    this._animate();
  }

  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    // Clear the canvas before redraw
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.update();
  }

}


class Rectangle extends _Shape {
  constructor(options, ctx, canvas) {
    super(options, ctx, canvas);
    this.width = options.width || 100;
    this.curHeight = options.height || 100;
    this.originalHeight = options.height;
    this.minHeight = options.minHeight || options.height;
    this.ampRate = options.speed || 10;
  }

  fill() {
    this.ctx.fillStyle = this.colour;
    this.ctx.fillRect(this.x, this.y, this.width, this.curHeight);
  }

  outline() {
    this.ctx.strokeStyle = this.colour;
    this.ctx.strokeRect(this.x, this.y, this.width, this.curHeight);
  }

  /* Updates this rectangle's state */
  update(mouse_x, range) {
    if (Math.abs(mouse_x - this.x) <= range && this.curHeight > this.minHeight) {
      // Compress rectangle
      this.curHeight -= this.ampRate;
      this.y += this.ampRate;
    } else if (Math.abs(mouse_x - this.x) > range && this.curHeight < this.originalHeight) {
      // Restore rectangle back to its original height
      this.curHeight += this.ampRate;
      this.y -= this.ampRate;
    }
    this.draw();
  }

}

/** Helper functions **/

// Returns a random RGBA colour
const randomColour = () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;

function degToRad(degrees) {
  return degrees * Math.PI / 180;
};
