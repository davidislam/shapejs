'use strict';
const log = console.log;
log("examples.js");

const shapeInstance = new Shape("testing-canvas");
shapeInstance.generateCollidingParticles({
  n: 300,
  radius: 5,
  colours: shapeInstance.colours.colors02,
  speed: 3,
  range: 150
})