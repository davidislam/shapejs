'use strict';
const log = console.log;
log("examples.js");

/* Draw different shapes */
// // A filled blue rectangle
// const rectInstance = shapeInstance.makeRectangle({ colour: "blue", filled: true });
// rectInstance.draw();
// // An outlined red rectangle
// const rectInstance2 = shapeInstance.makeRectangle({ x: 150, colour: "rgb(255,0,0)", filled: false });
// rectInstance2.draw();
// // A pink circle
// const circleInstance = shapeInstance.makeCircle({ x: 350, y: 50, radius: 50, colour: "pink", filled: false });
// circleInstance.draw();


/* Draw random shapes */
const randCircleShapeInstance = new Shape("random-circle-canvas");
randCircleShapeInstance.fitCanvasToScreen();
randCircleShapeInstance.generateRandomCircles({
  n: 50,
  radius: 50,
  filled: true
})
const randRectShapeInstance = new Shape("random-rectangle-canvas");
randRectShapeInstance.fitCanvasToScreen();
randRectShapeInstance.generateRandomRectangles({
  n: 50,
  maxWidth: 200,
  maxHeight: 200,
  filled: true
})

/* Animate circle */
// const animateCircleShapeInstance = new Shape("testing-canvas");
// // animateCircleShapeInstance.fitCanvasToScreen();
// const animatedCircle = animateCircleShapeInstance.makeCircle({
//   x: 50, y: 50, radius: 15, filled: true, colour: "orange"
// });
// animatedCircle.animate(3); // circle should be bouncing at a speed of 5 

/* Animates every circle in the circle array */
const animateManyCirclesShapeInstance = new Shape("testing-canvas");
animateManyCirclesShapeInstance.fitCanvasToScreen();
animateManyCirclesShapeInstance.generateRandomAnimatedCircles({
  n: 25,
  radius: 150,
  filled: true,
  speed: 1
})