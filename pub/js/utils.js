const randomRGBAColour = () => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;

function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

function randomColour(colours) {
  return colours[Math.floor(Math.random() * colours.length)];
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

/** Taken from https://gist.github.com/christopher4lis/f9ccb589ee8ecf751481f05a8e59b1dc
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  dx | velocity | The x velocity of an individual particle
 * @param  dy | velocity | The y velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(dx, dy, angle) {
  const rotatedVelocities = {
    x: dx * Math.cos(angle) - dy * Math.sin(angle),
    y: dx * Math.sin(angle) + dy * Math.cos(angle)
  };

  return rotatedVelocities;
}

/** Taken from https://gist.github.com/christopher4lis/f9ccb589ee8ecf751481f05a8e59b1dc
* Swaps out two colliding particles' x and y velocities after running through
* an elastic collision reaction equation
*
* @param  Object | particle      | A particle object with x and y coordinates, plus velocity
* @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
* @return Null | Does not return a value
*/

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.dx - otherParticle.dx;
  const yVelocityDiff = particle.dy - otherParticle.dy;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // Grab angle between the two colliding particles
    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.dx, particle.dy, angle);
    const u2 = rotate(otherParticle.dx, otherParticle.dy, angle);

    // Velocity after 1d collision equation
    const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
    const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1.x, v1.y, -angle);
    const vFinal2 = rotate(v2.x, v2.y, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.dx = vFinal1.x;
    particle.dy = vFinal1.y;

    otherParticle.dx = vFinal2.x;
    otherParticle.dy = vFinal2.y;
  }
}