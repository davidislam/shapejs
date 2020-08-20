const shapeInstance1 = new Shape('canvas-1');
shapeInstance1.generateFollowingCircles({
  n: 1000,
  maxRadius: 50,
  colours: shapeInstance1.colours.fogUnderWhiteSky,
})

const shapeInstance2 = new Shape('canvas-2');
shapeInstance2.generateBouncingCircles({
  n: 150,
  minRadius: 10,
  maxRadius: 20,
  colours: shapeInstance2.colours.colors02
})