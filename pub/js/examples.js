'use strict';
const log = console.log;
log("examples.js");

const shapeInstance = new Shape("testing-canvas");
shapeInstance.generateFollowingParticles({
  n: 1000,
  colours: shapeInstance.colours.colorThemesky,
  range: 50,
  maxRadius: 40
})