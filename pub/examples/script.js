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