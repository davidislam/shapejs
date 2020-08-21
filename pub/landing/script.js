const shapeInstance = new Shape('canvas');
shapeInstance.fitCanvasToScreen();
shapeInstance.generateAnimatedCircles({
  n: 250,
  colours: shapeInstance.colours.colorThemesky,
  speed: 0.2,
  maxRadius: 100,
  minRadius: 25,
})
