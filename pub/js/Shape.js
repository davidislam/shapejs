'use strict';
console.log("Shape.js");


/* The main entry point to the library */
class Shape {
  constructor(element) {
    this.canvas = document.querySelector(`#${element}`);
    this.context = this.canvas.getContext("2d");

    // Used for interactivity
    this.mouse = { x: undefined, y: undefined, range: undefined };

    this.rectangles = [];
    this.circles = [];
  }

  /* Creates and returns a new rectangle instance */
  makeRectangle(options) {
    const newRect = new Rectangle(options, this.context, this.canvas);
    this.rectangles.push(newRect);
    return newRect;
  }

  /* Creates and returns a new circle instance */
  makeCircle(options) {
    const newCircle = new Circle(options, this.context, this.canvas);
    this.circles.push(newCircle);
    return newCircle;
  }

  fitCanvasToScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  generateRandomCircles(options) {
    this.createRandomCircles(options, true)
  }

  createRandomCircles(options, draw = false) {
    const { n, radius, filled, speed, colours, shrinkRate, growRate, minRadius, interactive, animated, shrinkRadius } = options;
    for (let i = 0; i < n; i++) {
      const circleRadius = Math.random() * (radius - minRadius) + minRadius;
      const x = animated ? Math.random() * (this.canvas.width - circleRadius * 2) + circleRadius : Math.random() * this.canvas.width;
      const y = animated ? Math.random() * (this.canvas.height - circleRadius * 2) + circleRadius : Math.random() * this.canvas.height;
      const randX = Math.random() - 0.5;
      const randY = Math.random() - 0.5;
      const dx = randX < 0 ? Math.floor(randX) * speed : Math.ceil(randX) * speed;
      const dy = randY < 0 ? Math.floor(randY) * speed : Math.ceil(randY) * speed;
      const circleColour = colours === undefined ? randomColour() : colours[Math.floor(Math.random() * colours.length)];
      const newCircle = this.makeCircle({ x, y, radius: circleRadius, filled, dx, dy, colour: circleColour, shrinkRate, growRate, shrinkRadius, interactive, animated });
      if (draw) {
        newCircle.draw();
      }
    }
  }

  /* Generates n random animated circles */
  generateRandomAnimatedCircles(options) {
    this.createRandomCircles(options);
    this.animateCircles();
  }

  /* Generates random static or animated circles with interactivity */
  generateInteractiveCircles(options) {
    const { n, animated, radius, speed, colours, range, shrinkRate, growRate, minRadius, shrinkRadius } = options;
    this.canvas.addEventListener("mousemove", e => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    })
    this.mouse.range = range;
    this.createRandomCircles({ n, animated, radius, speed, colours, shrinkRate, growRate, minRadius, shrinkRadius, filled: true, interactive: true })
    this.animateCircles();
  }

  /* Generates n random static rectangles */
  generateRandomRectangles(options, draw = true) {
    const { n, filled, colour, maxWidth, maxHeight } = options;
    for (let i = 0; i < n; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const width = Math.random() * maxWidth;
      const height = Math.random() * maxHeight;
      const rectColour = colour || randomColour();
      const rect = this.makeRectangle({ x, y, width, height, colour: rectColour, filled })
      if (draw) {
        rect.draw();
      }
    }
  }

  /* Generates n random amplifying rectangles */
  generateAmplifyingRectangles(options) {
    this._createRectanglesFixedToBottom(options);
    this.canvas.addEventListener("mousemove", e => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    })
    this.mouse.range = options.range;
    this.animateRectangles();
  }

  /* A helper method that creates random rectangles of the same width whose base is at the bottom of the canvas */
  _createRectanglesFixedToBottom(options) {
    const { n, colours, minHeight, maxHeight, compressedHeight, speed } = options;
    const width = this.canvas.width / n;
    const filled = true;
    for (let i = 0; i < n; i++) {
      const x = width * i;
      const height = (Math.random() * (maxHeight - minHeight)) + minHeight;
      const y = this.canvas.height - height;
      const colour = colours[Math.floor(Math.random() * colours.length)];
      const newRect = this.makeRectangle({ x, y, width, height, minHeight: compressedHeight, colour, filled, speed });
    }
  }

  /* Clears the canvas */
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /* Animates all the created circles in the circles array */
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
}

/* An "abstract" class. All shapes should extend this class. */
class _Shape {
  constructor(options, context, canvas) {
    this.ctx = context;
    this.canvas = canvas;
    this.colour = options.colour || "rgb(0,0,0)";
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.isFilled = options.filled;
    this.animated = options.animated || false;
    this.interactive = options.interactive || false;
  }

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
    this.radius = options.radius || 50; // current radius
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
    this.ctx.arc(this.x, this.y, this.radius, degToRad(0), degToRad(360), false);
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

  /* Updates the circle */
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
    if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  /* Makes this circle interactive to the cursor */
  _addInteractivity(mouse_x, mouse_y, range) {
    // Temporary adjustment 
    const adj = (window.innerWidth - this.canvas.width) / 2
    const adj2 = (window.innerHeight - this.canvas.height) / 2
    if (Math.abs(mouse_x - this.x - adj) < range && Math.abs(mouse_y - this.y - adj2) < range && this.radius > this.minRadius + this.shrinkRate) {
      // Shrink circle
      this.radius -= this.shrinkRate;
    } else if (Math.abs(mouse_x - this.x - adj) >= range && Math.abs(mouse_y - this.y - adj2) >= range && this.radius < this.originalRadius) {
      // Grow circle back to its original size
      this.radius += this.growRate;
    } else if (this.radius > this.originalRadius) {
      // Circle is too big
      this.radius -= 1;
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
    this.height = options.height || 100; // current height
    this.originalHeight = options.height;
    this.minHeight = options.minHeight || options.height;
    this.ampRate = options.speed;
  }

  fill() {
    this.ctx.fillStyle = this.colour;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  outline() {
    this.ctx.strokeStyle = this.colour;
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  update(mouse_x, range) {
    // Account for the different origin points in window and canvas (assuming browser is in full screen)
    const adj = (window.innerWidth - this.canvas.width) / 2
    if (Math.abs(mouse_x - this.x - adj) <= range && this.height > this.minHeight) {
      // Compress rectangle
      this.height -= this.ampRate;
      this.y += this.ampRate;
    } else if (Math.abs(mouse_x - this.x - adj) > range && this.height < this.originalHeight) {
      // Restore rectangle back to its original height
      this.height += this.ampRate;
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
