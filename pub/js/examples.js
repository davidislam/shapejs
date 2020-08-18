'use strict';
const log = console.log;
log("examples.js");

const shapeInstance = new Shape("testing-canvas");
shapeInstance.makeCircle({
  x: 300,
  y: 150,
  radius: 25,
  colour: "red",
  dy: 15
}).animateWithGravity();