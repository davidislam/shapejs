const shapeInstance1 = new Shape('canvas-1');
shapeInstance1.generateFollowingCircles({
  n: 1000,
  maxRadius: 50,
  colours: shapeInstance1.colours.fogUnderWhiteSky,
})

const shapeInstance2 = new Shape('canvas-2');
shapeInstance2.generateBouncingCircles({
  n: 100,
  minRadius: 10,
  maxRadius: 20,
  colours: shapeInstance2.colours.colors02
})

const shapeInstance3 = new Shape('canvas-3');
shapeInstance3.generateJuliaFractals({

})

const shapeInstance4 = new Shape('canvas-4');
shapeInstance4.generateMandelbrotSetFractals({
  maxIterations: 500
})

const shapeInstance5 = new Shape('canvas-5');
shapeInstance5.generateAmplifyingRectangles({
  n: 25,
  colours: shapeInstance5.colours.rariSeatOrange,
  minHeight: 150,
  maxHeight: 350
})

const shapeInstance6 = new Shape('canvas-6');
shapeInstance6.generateCollidingCircles({
  n: 100,
  radius: 10,
  colours: shapeInstance6.colours.colourful,
  range: 120,
})

const shapeInstance7 = new Shape('canvas-7');
shapeInstance7.generateInteractiveCircles({
  n: 250,
  colours: shapeInstance7.colours.colorThemesky,
  animated: true,
  speed: 0.2,
  range: 100
})

const shapeInstance8 = new Shape('canvas-8');
shapeInstance8.generateCircles({
  n: 200,
  colours: shapeInstance8.colours.fogUnderWhiteSky
})

const shapeInstance9 = new Shape('canvas-9');
shapeInstance9.generateRectangles({
  n: 200,
  colours: shapeInstance9.colours.rariSeatOrange,
  maxWidth: 150,
  minWidth: 50,
  maxHeight: 425,
  minHeight: 100
})
