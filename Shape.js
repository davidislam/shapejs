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

  // TODO: makeShape() factory method

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

  /* Generates n random static circles */
  // generateRandomCircles(options, draw = true) {
  //   const { n, colours, radius, filled, minRadius, shrinkRate, growRate, interactive } = options;
  //   for (let i = 0; i < n; i++) {
  //     const x = Math.random() * this.canvas.width;
  //     const y = Math.random() * this.canvas.height;
  //     const circleColour = colours === undefined ? randomColour() : colours[Math.floor(Math.random() * colours.length)];
  //     const circle = this.makeCircle({ x, y, colour: circleColour, radius, filled, minRadius, shrinkRate, growRate, interactive, animated: false });
  //     if (draw) {
  //       circle.draw();
  //     }
  //   }
  // }

  createRandomCircles(options) {
    const { n, radius, filled, speed, colours, shrinkRate, growRate, minRadius, interactive, animated } = options;
    for (let i = 0; i < n; i++) {
      const circleRadius = Math.random() * radius + 1;
      const x = animated ? Math.random() * (this.canvas.width - circleRadius * 2) + circleRadius : Math.random() * this.canvas.width;
      const y = animated ? Math.random() * (this.canvas.height - circleRadius * 2) + circleRadius : Math.random() * this.canvas.height;
      const randX = Math.random() - 0.5;
      const randY = Math.random() - 0.5;
      const dx = randX < 0 ? Math.floor(randX) * speed : Math.ceil(randX) * speed;
      const dy = randY < 0 ? Math.floor(randY) * speed : Math.ceil(randY) * speed;
      const circleColour = colours === undefined ? randomColour() : colours[Math.floor(Math.random() * colours.length)];
      this.makeCircle({ x, y, radius: circleRadius, filled, dx, dy, colour: circleColour, shrinkRate, growRate, minRadius, interactive, animated });
    }
  }

  /* Generates n random animated circles */
  generateRandomAnimatedCircles(options) {
    this._createRandomAnimatedCircles(options);
    this.animateCircles();
  }

  /* A helper method to create random *animated* circles */
  // _createRandomAnimatedCircles(options) {
  //   const { n, radius, filled, speed, colours, shrinkRate, growRate, minRadius, interactive } = options;
  //   for (let i = 0; i < n; i++) {
  //     const x = Math.random() * (this.canvas.width - radius * 2) + radius;
  //     const y = Math.random() * (this.canvas.height - radius * 2) + radius;
  //     const randX = Math.random() - 0.5;
  //     const randY = Math.random() - 0.5;
  //     const dx = randX < 0 ? Math.floor(randX) * speed : Math.ceil(randX) * speed;
  //     const dy = randY < 0 ? Math.floor(randY) * speed : Math.ceil(randY) * speed;
  //     const circleColour = colours === undefined ? randomColour() : colours[Math.floor(Math.random() * colours.length)];
  //     const circleRadius = Math.random() * radius + 1;
  //     this.makeCircle({ x, y, radius: circleRadius, filled, dx, dy, colour: circleColour, shrinkRate, growRate, minRadius, interactive, animated: true });
  //   }
  // }

  // TODO: Add interactivity where the circles grow upon hover instead of shrinking

  /* Generates random static or animated circles with interactivity */
  generateInteractiveCircles(options) {
    const { n, animated, radius, speed, colours, range, shrinkRate, growRate, minRadius } = options;
    this.canvas.addEventListener("mousemove", e => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    })
    this.mouse.range = range;

    // if (animated) {
    //   this._createRandomAnimatedCircles({ n, radius, filled: true, speed, colours, shrinkRate, growRate, minRadius, interactive: true });
    // } else {
    //   this.generateRandomCircles({ n, radius, filled: true, colours, shrinkRate, growRate, minRadius, interactive: true }, false);
    // }
    this.createRandomCircles({ n, animated, radius, speed, colours, shrinkRate, growRate, minRadius, filled: true, interactive: true })
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

  /* Animates all the created circles in the circles array */
  animateCircles() {
    requestAnimationFrame(this.animateCircles.bind(this));
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach(circle => circle.update({ mouse_x: this.mouse.x, mouse_y: this.mouse.y, range: this.mouse.range }));
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
    this.minRadius = options.minRadius || 5;
    this.maxRadius = options.radius; // TODO: User should provide the max radius
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

  // update(animated, mouse_x, mouse_y, limit) {
  //   if (animated) {
  //     this._updatePosition();
  //   }
  //   this._addInteractivity(mouse_x, mouse_y, limit);
  //   this.draw();
  // }

  /* Updates the position of this circle, taking into account the boundaries */
  _updatePosition() {
    // TODO: Sometimes circles get stuck to the edges
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
    if (Math.abs(mouse_x - this.x) < range && Math.abs(mouse_y - this.y) < range && this.radius > this.minRadius + this.shrinkRate) {
      // Shrink circle
      this.radius -= this.shrinkRate;
    } else if (Math.abs(mouse_x - this.x) >= range && Math.abs(mouse_y - this.y) >= range && this.radius < this.originalRadius) {
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
    this.height = options.height || 100;
  }

  fill() {
    this.ctx.fillStyle = this.colour;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  outline() {
    this.ctx.strokeStyle = this.colour;
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

}

/*** Helper functions ***/

// Returns a random RGBA colour
const randomColour = () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;

function degToRad(degrees) {
  return degrees * Math.PI / 180;
};
