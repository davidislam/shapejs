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
    const newRect = new Rectangle(options, this.context);
    this.rectangles.push(newRect);
    return newRect;
  }

  /* Creates and returns a new circle instance */
  makeCircle(options) {
    const newCircle = new Circle(options, this.context);
    this.circles.push(newCircle);
    return newCircle;
  }

  fitCanvasToScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /* Generates n circles randomly positioned on the canvas
  with randomly chosen colours of fixed radius */
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
      },
        this.context);
      circle.draw();
      this.circles.push(circle);
    }
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
      },
        this.context)
      rect.draw();
      this.rectangles.push(rect);
    }
  }
}

/* An "abstract" class */
class _Shape {
  constructor(options, context) {
    this.ctx = context;
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
  fill() {

  }

  /* Strokes this shape. Must be implemented. */
  outline() {

  }
}


class Circle extends _Shape {
  constructor(options, ctx) {
    super(options, ctx);
    this.radius = options.radius;
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
}


class Rectangle extends _Shape {
  constructor(options, ctx) {
    super(options, ctx);
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