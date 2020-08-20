'use strict';

(function (global) {

  /* Utility functions */

  const randomRGBAColour = () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  };

  function randomColour(colours) {
    return colours[Math.floor(Math.random() * colours.length)];
  }

  function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
  }

  /** Taken from https://gist.github.com/christopher4lis/f9ccb589ee8ecf751481f05a8e59b1dc
   * Rotates coordinate system for velocities
   *
   * Takes velocities and alters them as if the coordinate system they're on was rotated
   *
   * @param  dx | velocity | The x velocity of an individual particle
   * @param  dy | velocity | The y velocity of an individual particle
   * @param  Float  | angle    | The angle of collision between two objects in radians
   * @return Object | The altered x and y velocities after the coordinate system has been rotated
   */

  function rotate(dx, dy, angle) {
    const rotatedVelocities = {
      x: dx * Math.cos(angle) - dy * Math.sin(angle),
      y: dx * Math.sin(angle) + dy * Math.cos(angle)
    };

    return rotatedVelocities;
  }

  /** Taken from https://gist.github.com/christopher4lis/f9ccb589ee8ecf751481f05a8e59b1dc
  * Swaps out two colliding particles' x and y velocities after running through
  * an elastic collision reaction equation
  *
  * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
  * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
  * @return Null | Does not return a value
  */

  function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.dx - otherParticle.dx;
    const yVelocityDiff = particle.dy - otherParticle.dy;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.dx, particle.dy, angle);
      const u2 = rotate(otherParticle.dx, otherParticle.dy, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1.x, v1.y, -angle);
      const vFinal2 = rotate(v2.x, v2.y, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.dx = vFinal1.x;
      particle.dy = vFinal1.y;

      otherParticle.dx = vFinal2.x;
      otherParticle.dy = vFinal2.y;
    }
  }

  /* The main entry point to the library */
  class Shape {

    /* Constructs a new instance of this library using the canvas with id <canvasID> */
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
        colourful: ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
      }

      this._addWindowResizeEventListener();

      // Remove mouse position periodically
      setInterval(() => {
        this.mouse.x = undefined,
          this.mouse.y = undefined
      }, 1000);
    }

    /* Creates and returns a new rectangle instance given the properties in <options> */
    makeRectangle(options) {
      const newRect = new Rectangle(options, this.context, this.canvas);
      this.rectangles.push(newRect);
      return newRect;
    }

    /* Creates and returns a new circle instance given the properties in <options> */
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

    /* Generates random static circles given the properties in <options> */
    generateCircles(options) {
      this._createRandomCircles(options, true);
    }

    /* A helper function used to create random circles given some options, optionally drawing them
    on the canvas. This can be used to create static, animated, or even interactive circles. */
    _createRandomCircles(options, draw = false, animated = false, interactive = false) {
      let { n, stroke, maxRadius, minRadius, shrinkRadius, filled, colours, speed, shrinkRate, growRate } = options;
      // Set optional params
      maxRadius = maxRadius === undefined ? this.MAX_RADIUS : maxRadius;
      minRadius = minRadius === undefined ? this.MIN_RADIUS : minRadius;
      shrinkRadius = shrinkRadius === undefined ? this.SHRINK_RADIUS : shrinkRadius;
      filled = filled === undefined ? true : filled;
      speed = speed === undefined ? this.SPEED : speed;
      shrinkRate = shrinkRate === undefined ? this.SHRINK_RATE : shrinkRate;
      growRate = growRate === undefined ? this.GROW_RATE : growRate;

      // Create <n> circles, randomizing some of their properties
      for (let i = 0; i < n; i++) {
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
        const circleColour = colours === undefined ? randomRGBAColour() : randomColour(colours);
        // Make new circle
        const newCircle = this.makeCircle({ x, y, stroke, radius: circleRadius, filled, dx, dy, colour: circleColour, shrinkRate, growRate, shrinkRadius, interactive, animated });
        if (draw) {
          newCircle.draw();
        }
      }
    }

    /* A helper used to create random circles for gravity simulations */
    _createRandomCircles2(options) {
      this.circles = [];
      let { n, colours, minRadius, maxRadius, acceleration, friction } = options;
      minRadius = minRadius ? minRadius : this.MIN_RADIUS;
      maxRadius = maxRadius ? maxRadius : this.MAX_RADIUS;
      for (let i = 0; i < n; i++) {
        const radius = randomIntFromRange(minRadius, maxRadius);
        const x = randomIntFromRange(radius, this.canvas.width - radius);
        const y = randomIntFromRange(0, this.canvas.height / 2);
        const colour = randomColour(colours);
        const dx = randomIntFromRange(-2, 2);
        const dy = randomIntFromRange(-2, 2);
        this.makeCircle({ x, y, dx, dy, colour, radius, gravity: true, acceleration, friction })
      }
    }

    /* Generates n random bouncing circles with gravity */
    generateBouncingCircles(options) {
      this._createRandomCircles2(options);
      this.canvas.addEventListener('click', () => this._createRandomCircles2(options))
      this.animateCircles();
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

    /* Generates colliding circles with mouse interactivity */
    generateCollidingCircles(options) {
      this.circles = [];
      let { n, radius, colours, speed, range } = options;
      speed = speed ? speed : this.SPEED;
      range = range ? range : this.RANGE;

      // Create <n> particles with given and randomized properties
      for (let i = 0; i < n; i++) {
        let x = randomIntFromRange(radius, this.canvas.width - radius);
        let y = randomIntFromRange(radius, this.canvas.height - radius);
        const dx = (Math.random() - 0.5) * speed;
        const dy = (Math.random() - 0.5) * speed;
        const colour = randomColour(colours);

        if (i !== 0) {
          // Ensure particles are non-overlapping
          for (let j = 0; j < this.circles.length; j++) {
            const cur = this.circles[j];
            const dist = distance(x, y, cur.x, cur.y);
            if (dist - (radius + cur.radius) < 0) {
              // Particles are overlapping. Try choosing x & y again.
              x = randomIntFromRange(radius, this.canvas.width - radius);
              y = randomIntFromRange(radius, this.canvas.height - radius);

              // Compare to each particle again
              j = -1;
            }
          }
        }
        this.makeCircle({ x, y, colour, radius, dx, dy, collision: true });
      }
      this._addMouseMoveEventListener(range);
      this.animateCircles();
    }

    /* Generates circles that follow the mouse cursor */
    generateFollowingCircles(options) {
      this.circles = [];
      let { n, colours, maxRadius, range, shrinkRate, growRate } = options;
      maxRadius = maxRadius ? maxRadius : this.MAX_RADIUS;
      range = range ? range : this.RANGE;
      shrinkRate = shrinkRate ? shrinkRate : 0.1;
      growRate = growRate ? growRate : 3;
      const radius = 0;
      const shrinkRadius = 0;
      for (let i = 0; i < n; i++) {
        const x = randomIntFromRange(0, this.canvas.width);
        const y = randomIntFromRange(0, this.canvas.height);
        const dx = (Math.random() * 0.2) - 0.1;
        const dy = (Math.random() * 0.2) - 0.1;
        const colour = randomColour(colours);
        this.makeCircle({ x, y, dx, dy, radius, colour, shrinkRadius, maxRadius, shrinkRate, growRate, fp: true, animated: true });
      }
      this._addMouseMoveEventListener(range);
      this.animateCircles();
    }

    _addWindowResizeEventListener() {
      window.addEventListener('resize', () => {
        this._rect = this.canvas.getBoundingClientRect();
      })
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
        const rectColour = colours === undefined ? randomRGBAColour() : randomColour(colours);
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
    _addMouseMoveEventListener(range = this.RANGE) {
      this.canvas.addEventListener("mousemove", e => {
        this._setMousePosition(e);
      })
      this.mouse.range = range;
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
        const colour = colours === undefined ? randomRGBAColour() : randomColour(colours);
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
      this.circles.forEach(circle => circle.update({
        mouse_x: this.mouse.x,
        mouse_y: this.mouse.y,
        range: this.mouse.range,
        particles: this.circles
      }));
    }

    /* Animates the rectangles in the rectangles array */
    animateRectangles() {
      requestAnimationFrame(this.animateRectangles.bind(this));
      this.clearCanvas();
      this.rectangles.forEach(rect => rect.update(this.mouse.x, this.mouse.range));
    }

    // This method uses mathjs to work with complex numbers
    generateJuliaFractals(options = {}) {
      const { maxIterations, hue } = options;
      const Shape = this;
      const width = this.canvas.width;
      const height = this.canvas.height;
      const ctx = this.context;
      let constant = math.complex(0.28, 0.01);
      const _maxIterations = maxIterations == undefined ? 64 : maxIterations;
      let clicked = false;
      let pan = math.complex(0, 0);
      let zoom = 1;
      const _hue = hue == undefined ? 0 : hue;

      function julia(z, i = 0) {
        // Apply formula
        z = z.mul(z);
        z = z.add(constant);
        if (math.abs(z) > 2 || i == _maxIterations)
          return i;
        return julia(z, i + 1);
      }

      // Turn a point on the complex plane into a color
      function pointToColor(point) {
        const iterations = julia(point);
        const percentage = iterations / _maxIterations;
        // point = point.sub(constant);
        // const red = percentage * 255;
        // const green = percentage * 255;
        // const blue = percentage * 255;
        return `hsl(${_hue},100%,${percentage * 100}%)`;
        // return `rgb(${red}, ${green}, ${blue})`;
      }

      // Turn XY pixel coordinates into a point on the complex plane
      function pixelToPoint(x, y) {
        // Map percentage of total width/height to a value from -1 to +1
        const zx = (x / width) * 2 - 1
        const zy = 1 - (y / height) * 2

        let z = math.complex(zx, zy);
        z = z.div(zoom);
        z = z.add(pan);

        // Create a complex number based on our new XY values
        return z
      }

      // Draw a single pixel on our canvas
      function drawPixel(x, y, color) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
      }

      // Redraw our canvas
      function draw() {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const point = pixelToPoint(x, y);
            const color = pointToColor(point);
            drawPixel(x, y, color);
          }
        }
      }

      function update() {
        // console.log(constant);
        draw();
      }

      function click(event) {
        if (!clicked) {
          clicked = true;
          return;
        }
        Shape._setMousePosition(event);
        pan = pixelToPoint(Shape.mouse.x, Shape.mouse.y);
        zoom *= 2;
        update();
      }

      function move(event) {
        // Don't move after first click
        if (clicked)
          return;

        Shape._setMousePosition(event);
        constant = pixelToPoint(Shape.mouse.x, Shape.mouse.y);

        // Round that point off to the nearest 0.01
        constant.re = math.round(constant.re * 100) / 100;
        constant.im = math.round(constant.im * 100) / 100;
        update();
      }

      this.canvas.addEventListener('pointermove', move);
      this.canvas.addEventListener('click', click);

      update();
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
          panX += dx;
          panY += dy;
        } else {
          zoom /= _zoomFactor;
          const dx = -(Shape.mouse.x + offsetX - panX - 90 * _zoomFactor) / zoom;
          const dy = -(Shape.mouse.y + offsetY - panY - 50 * _zoomFactor) / zoom;
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
      this.stroke = options.stroke !== undefined ? options.stroke : false;
      this.isFilled = options.filled === undefined ? true : options.filled;
      this.animated = options.animated === undefined ? false : options.animated;
      this.interactive = options.interactive === undefined ? false : options.interactive;
    }

    /* Updates this shape's state. Must be implemented. */
    update() { }

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
      this.radius = options.radius === undefined ? 50 : options.radius;
      this.curRadius = options.radius ? options.radius : 50; // X
      this.originalRadius = options.radius === undefined ? 50 : options.radius;
      this.minRadius = options.shrinkRadius === undefined ? 5 : options.shrinkRadius;
      this.maxRadius = options.maxRadius;
      this.dx = options.dx === undefined ? 1 : options.dx;
      this.dy = options.dy === undefined ? 1 : options.dy;
      this.shrinkRate = options.shrinkRate === undefined ? 1 : options.shrinkRate;
      this.growRate = options.growRate === undefined ? 1 : options.growRate;
      this.gravity = options.gravity === undefined ? false : options.gravity;
      this.friction = options.friction === undefined ? 0.95 : options.friction;
      this.acceleration = options.acceleration === undefined ? 0.5 : options.acceleration;
      this.collision = options.collision === undefined ? false : options.collision;
      this.mass = 1;
      this.opacity = 0;
      this.fp = options.fp === undefined ? false : options.fp; // following particles
    }

    _drawCircle() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.curRadius, degToRad(0), degToRad(360), false);
    }

    fill() {
      this.ctx.fillStyle = this.colour;
      this._drawCircle();
      this.ctx.fill();
      if (this.stroke)
        this.ctx.stroke();
      this.ctx.closePath();
    }

    outline() {
      this.ctx.strokeStyle = this.colour;
      this._drawCircle();
      this.ctx.stroke();
    }

    /* Updates this circle's state depending on its properties */
    update(options = {}) {
      const { mouse_x, mouse_y, range, particles } = options;
      if (this.animated) {
        this._updatePosition()
      }
      if (this.interactive) {
        this._addInteractivity(mouse_x, mouse_y, range);
      }
      if (this.gravity) {
        this._addGravity();
      }
      if (this.collision) {
        this._addCollision(mouse_x, mouse_y, range, particles);
        this.draw2();
        return;
      }
      if (this.fp) {
        this._updateParticles(mouse_x, mouse_y, range);
      }
      this.draw();
    }

    // Draws this circle with opacity
    draw2() {
      const ctx = this.ctx;
      this._drawCircle();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.colour;
      ctx.fill();
      ctx.closePath();
    }

    // Adds collision detection to this particle considering every particle in <particles>
    _addCollision(mouse_x, mouse_y, range, particles) {

      // Check for collisions
      for (let i = 0; i < particles.length; i++) {
        const cur = particles[i];
        if (this === cur)
          continue;
        const dist = distance(this.x, this.y, cur.x, cur.y);
        if (dist - (this.radius + cur.radius) < 0) {
          resolveCollision(this, cur);
        }
      }

      // Check boundaries
      if (this.x - this.radius <= 0 || this.radius + this.x >= this.canvas.width) {
        this.dx = -this.dx;
      }
      if (this.y - this.radius <= 0 || this.radius + this.y >= this.canvas.height) {
        this.dy = -this.dy;
      }

      // Add mouse interactivity
      if (distance(mouse_x, mouse_y, this.x, this.y) < range && this.opacity < 0.8) {
        this.opacity += 0.03;
      } else {
        this.opacity -= 0.03;
        this.opacity = Math.max(0, this.opacity);
      }

      this.x += this.dx;
      this.y += this.dy;
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

    _updateParticles(mouse_x, mouse_y, range) {
      // Like _addInteractivity() below but grows instead of shrinks
      if (distance(mouse_x, mouse_y, this.x, this.y) < range && this.curRadius < this.maxRadius) {
        this.curRadius += this.growRate;
      } else if (this.curRadius > this.minRadius) {
        this.curRadius -= this.shrinkRate;
      }
      if (this.curRadius < 0) {
        this.curRadius = 0;
      }
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

    /* Simulates the effect of gravity on this ball */
    animateWithGravity(acceleration = 1, friction = 0.95) {
      this.gravity = true;
      this.acceleration = acceleration;
      this.friction = friction;
      this._animate();
    }

    _addGravity() {
      if (this.y + this.curRadius + this.dy > this.canvas.height) {
        this.dy = -this.dy * this.friction;
        this.dx = this.dx * this.friction;
      } else {
        this.dy += this.acceleration;
      }

      if (this.x + this.curRadius >= this.canvas.width || this.x - this.curRadius <= 0) {
        this.dx = -this.dx * this.friction;
      }

      this.x += this.dx;
      this.y += this.dy;
    }

    /* Animates the circle by bouncing it off walls */
    animate(speed = 1) {
      this.animated = true;
      this.dx = this.dy = speed;
      this._animate();
    }

    // Animation loop
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

  global.Shape = global.Shape || Shape;
  global.Circle = global.Circle || Circle;
  global.Rectangle = global.Rectangle || Rectangle;

})(window);


