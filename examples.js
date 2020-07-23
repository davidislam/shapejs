'use strict';
const log = console.log;
log("examples.js");


/* Draw random circles */
const shapeInstance = new Shape("rand-circ-canvas");
shapeInstance.fitCanvasToScreen();
shapeInstance.generateRandomCircles({
  n: 50,
  radius: 50,
  filled: true
})

/* Draw random rectangles */
const shapeInstance2 = new Shape("rand-rect-canvas");
shapeInstance2.fitCanvasToScreen();
shapeInstance2.generateRandomRectangles({
  n: 100,
  maxWidth: 100,
  maxHeight: 100,
  filled: true
})

// // A filled blue rectangle
// const rectInstance = shapeInstance.makeRectangle({ colour: "blue", filled: true });
// rectInstance.draw();
// // An outlined red rectangle
// const rectInstance2 = shapeInstance.makeRectangle({ x: 150, colour: "rgb(255,0,0)", filled: false });
// rectInstance2.draw();
// // A pink circle
// const circleInstance = shapeInstance.makeCircle({ x: 350, y: 50, radius: 50, colour: "pink", filled: false });
// circleInstance.draw();