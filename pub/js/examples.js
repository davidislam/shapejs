'use strict';
const log = console.log;
log("examples.js");

const shapeInstance = new Shape("testing-canvas");
shapeInstance.generateCollidingParticles({
  n: 5,
  radius: 50,
  colour: 'blue'
})