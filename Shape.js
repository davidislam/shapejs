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

  makeRectangle(options) {
    const newRect = new Rectangle(options, this.context);
    this.rectangles.push(newRect);
    return newRect;
  }

  makeCircle(options) {
    const newCircle = new Circle(options, this.context);
    this.circles.push(newCircle);
    return newCircle;
  }

  fitCanvasToScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
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
    // TODO: stroke circle
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


function degToRad(degrees) {
  return degrees * Math.PI / 180;
};