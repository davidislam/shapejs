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


// /* Draw random shapes */
// const randCircleShapeInstance = new Shape("random-circle-canvas");
// randCircleShapeInstance.fitCanvasToScreen();
// randCircleShapeInstance.generateRandomCircles({
//   n: 50,
//   radius: 50,
//   filled: true
// })
// const randRectShapeInstance = new Shape("random-rectangle-canvas");
// randRectShapeInstance.fitCanvasToScreen();
// randRectShapeInstance.generateRandomRectangles({
//   n: 50,
//   maxWidth: 200,
//   maxHeight: 200,
//   filled: true
// })

/* Animate circle */
// const animateCircleShapeInstance = new Shape("testing-canvas");
// // animateCircleShapeInstance.fitCanvasToScreen();
// const animatedCircle = animateCircleShapeInstance.makeCircle({
//   x: 50, y: 50, radius: 15, filled: true, colour: "orange"
// });
// animatedCircle.animate(3); // circle should be bouncing at a speed of 5 

/* Animates every circle in the circle array */
// const animateManyCirclesShapeInstance = new Shape("testing-canvas");
// animateManyCirclesShapeInstance.fitCanvasToScreen();
// animateManyCirclesShapeInstance.generateRandomAnimatedCircles({
//   n: 25,
//   radius: 50,
//   filled: true,
//   speed: 2,
// })

/* Interactivity */
// const interactiveCirclesShapeInstance = new Shape("testing-canvas");
// interactiveCirclesShapeInstance.fitCanvasToScreen();
// interactiveCirclesShapeInstance.generateInteractiveCircles({
//   n: 100,
//   radius: 100,
//   minRadius: 3,
//   animated: false,
//   speed: 1,
//   shrinkRate: 2,
//   growRate: 2,
//   range: 75,
//   colours: ["#BE5FD9", "#6064BF", "#3A4E8C", "#122640", "#5FA0D9"]
// })

/* Rectangles Amplification */
const interactiveRectanglesShapeInstance = new Shape("testing-canvas");
interactiveRectanglesShapeInstance.fitCanvasToScreen();
interactiveRectanglesShapeInstance.generateAmplifyingRectangles({
  n: 30,
  colours: ["#BE5FD9", "#6064BF", "#3A4E8C", "#122640", "#5FA0D9"],
  minHeight: 250,
  maxHeight: 500,
  compressedHeight: 50,
  range: 70,
  speed: 25
});