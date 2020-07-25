'use strict';
console.log("Shape.js");


/* The main entry point to the library */
class Shape {
  constructor(element) {
    this.canvas = document.querySelector(`#${element}`);
    this.context = this.canvas.getContext("2d");
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

  /* Generates n random circles */
  generateRandomCircles(options) {
    for (let i = 0; i < options.n; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const colour = randomColour();
      const circle = new Circle({
        x,
        y,
        colour,
        radius: options.radius,
        filled: options.filled
      }, this.context, this.canvas);
      circle.draw();
      this.circles.push(circle);
    }
  }

  generateRandomAnimatedCircles(options) {
    const { n, radius, filled, speed } = options;
    for (let i = 0; i < n; i++) {
      const x = Math.random() * (this.canvas.width - radius * 2) + radius;
      const y = Math.random() * (this.canvas.height - radius * 2) + radius;
      const randX = Math.random() - 0.5;
      const randY = Math.random() - 0.5;
      const dx = randX < 0 ? Math.floor(randX) * speed : Math.ceil(randX) * speed;
      const dy = randY < 0 ? Math.floor(randY) * speed : Math.ceil(randY) * speed;
      const colour = randomColour();
      const newCircle = new Circle({ x, y, radius, filled, dx, dy, colour }, this.context, this.canvas)
      this.circles.push(newCircle);
    }
    this._animateCircles();
  }

  /* Generates n random rectangles */
  generateRandomRectangles(options) {
    for (let i = 0; i < options.n; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const width = Math.random() * options.maxWidth;
      const height = Math.random() * options.maxHeight;
      const colour = randomColour();
      const rect = new Rectangle({
        x,
        y,
        width,
        height,
        colour,
        filled: options.filled
      }, this.context, this.canvas)
      rect.draw();
      this.rectangles.push(rect);
    }
  }

  _animateCircles() {
    requestAnimationFrame(this._animateCircles.bind(this));
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circles.forEach(circle => circle.update())
  }
}

/* An "abstract" class */
class _Shape {
  constructor(options, context, canvas) {
    this.ctx = context;
    this.canvas = canvas;
    this.colour = options.colour || "rgb(0,0,0)";
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.isFilled = options.filled;
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
    this.radius = options.radius;
    this.dx = options.dx || 1;
    this.dy = options.dy || 1;
  }

  drawCircle() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, degToRad(0), degToRad(360), false);
  }

  fill() {
    this.ctx.fillStyle = this.colour;
    this.drawCircle();
    this.ctx.fill();
  }

  outline() {
    this.ctx.strokeStyle = this.colour;
    this.drawCircle();
    this.ctx.stroke();
  }

  /* Updates the position of the circle */
  update() {
    // Check walls
    if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }

  /* Animates the circle by bouncing it off walls */
  animate(speed = 1) {
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

const randomColour = () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;

function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

function animate() {
  requestAnimationFrame(animate);
  // Clear the canvas before redraw
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.update();
}