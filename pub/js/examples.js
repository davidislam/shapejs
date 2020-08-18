'use strict';
const log = console.log;
log("examples.js");

const shapeInstance = new Shape("testing-canvas");
shapeInstance.generateBouncingCircles({
  n: 50,
  colours: shapeInstance.colours.colourful,
  minRadius: 20,
  maxRadius: 30,
  acceleration: 0.1,
  friction: 0.99
})