'use strict';
const log = console.log;
log("examples.js");

/* Draw different shapes */
const shapeInstance = new Shape("shapes-canvas");
// A filled blue rectangle
const rectInstance = shapeInstance.makeRectangle({ colour: "blue", filled: true, x: 50, y: 100, width: 100, height: 200 });
rectInstance.draw();
// An outlined red rectangle
const rectInstance2 = shapeInstance.makeRectangle({ x: 300, y: 150, colour: "rgb(255,0,0)", filled: false });
rectInstance2.draw();
// A pink circle
const circleInstance = shapeInstance.makeCircle({ x: 525, y: 300, radius: 100, colour: "pink", filled: true });
circleInstance.draw();
// An outlined circle
const circleInstance2 = shapeInstance.makeCircle({ x: 775, y: 200, radius: 150, colour: "green", filled: false });
circleInstance2.draw();


/* Draw random shapes */
const randCircleShapeInstance = new Shape("random-circle-canvas");
randCircleShapeInstance.generateRandomCircles({
  n: 100,
  radius: 70,
  minRadius: 25,
  filled: true,
})

const randRectShapeInstance = new Shape("random-rectangle-canvas");
randRectShapeInstance.generateRandomRectangles({
  n: 75,
  maxWidth: 250,
  maxHeight: 250,
  filled: true
})

/* Animate circle */
const animateCircleShapeInstance = new Shape("animated-circle-canvas");
const animatedCircle = animateCircleShapeInstance.makeCircle({
  x: 50, y: 50, radius: 25, filled: true, colour: "orange",
});
animatedCircle.animate(10); // circle should be bouncing at a speed of 5 

/* Animates every circle in the circle array */
const animateManyCirclesShapeInstance = new Shape("circles-animated-canvas");
animateManyCirclesShapeInstance.generateRandomAnimatedCircles({
  n: 15,
  radius: 65,
  minRadius: 40,
  filled: true,
  speed: 3,
  colours: ["#F02F35", "#3800F0", "#F07632", "#24F05A", "#0CF0EA"],
  interactive: false,
  animated: true
})

/* Interact with static circles */
const interactiveCirclesShapeInstance = new Shape("circles-interactive-canvas");
interactiveCirclesShapeInstance.generateInteractiveCircles({
  n: 150,
  radius: 100,
  minRadius: 50,
  shrinkRadius: 5,
  animated: false,
  speed: 1,
  shrinkRate: 5,
  growRate: 5,
  range: 75,
  colours: ["#BE5FD9", "#6064BF", "#3A4E8C", "#122640", "#5FA0D9"]
})

/* Interact with animated circles */
const interactiveCirclesAnimatedShapeInstance = new Shape("circles-interactive-animated-canvas");
interactiveCirclesAnimatedShapeInstance.generateInteractiveCircles({
  n: 50,
  radius: 75,
  minRadius: 30,
  shrinkRadius: 5,
  animated: true,
  speed: 1,
  shrinkRate: 3,
  growRate: 3,
  range: 75,
  colours: ["#B3E0F2", "#24A3BF", "#F2BB13", "#F28B0C", "#A62F03"]
})


/* Rectangles Amplification */
const interactiveRectanglesShapeInstance = new Shape("rectangles-interactive-canvas");
interactiveRectanglesShapeInstance.generateAmplifyingRectangles({
  n: 25,
  colours: ["#024850", "#FFB409", "#008080", "#E87409", "#FCDDCC"],
  minHeight: 200,
  maxHeight: 450,
  compressedHeight: 25,
  range: 50,
  speed: 25
});