const shapeInstance = new Shape('canvas');
shapeInstance.fitCanvasToScreen();
shapeInstance.generateAnimatedCircles({
  n: 100,
  colours: shapeInstance.colours.colorThemesky,
  speed: 0.2,
  maxRadius: 50,
  minRadius: 25,
})
