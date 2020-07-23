'use strict';
const log = console.log;
log("examples.js");


/* Draw some shapes onto the canvas */
const shapeInstance = new Shape("shape-canvas");
// A filled blue rectangle
const rectInstance = shapeInstance.makeRectangle({ colour: "blue", filled: true });
rectInstance.draw();
// An outlined red rectangle
const rectInstance2 = shapeInstance.makeRectangle({ x: 150, colour: "rgb(255,0,0)", filled: false });
rectInstance2.draw();
// A pink circle
const circleInstance = shapeInstance.makeCircle({ x: 350, y: 50, radius: 50, colour: "pink", filled: true });
circleInstance.draw();