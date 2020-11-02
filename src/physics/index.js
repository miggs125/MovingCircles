function solveOverlap(circle1, circle2, distance) {
  const deltaX = circle1.location.x - circle2.location.x;
  const deltaY = circle1.location.y - circle2.location.y;
  const overlap = distance - circle1.radius - circle2.radius;

  circle1.location.x -= (deltaX / distance) * (overlap / 2);
  circle1.location.y -= (deltaY / distance) * (overlap / 2);
  circle2.location.x += (deltaX / distance) * (overlap / 2);
  circle2.location.y += (deltaY / distance) * (overlap / 2);
}


function solveVelocityVectors(circle1, circle2, distance) {
  // normal vectors
  let normal_x = (circle2.location.x - circle1.location.x) / distance;
  let normal_y = (circle2.location.y - circle1.location.y) / distance;

  // tangental vectors
  let tangental_x = -1 * normal_y;
  let tangental_y = normal_x;

  // tangental response (dot product b/w tanglental vector & velocity vector)
  let dpTan1 =
    circle1.velocityX * tangental_x + circle1.velocityY * tangental_y;
  let dpTan2 =
    circle2.velocityX * tangental_x + circle2.velocityY * tangental_y;

  // normal response (dot product b/w normal vector & velocity vector)
  let dpNormal1 = circle1.velocityX * normal_x + circle1.velocityY * normal_y;
  let dpNormal2 = circle2.velocityX * normal_x + circle2.velocityY * normal_y;

  // conservation of momentum
  let m1 =
    (dpNormal1 * (circle1.mass - circle2.mass) + 2 * circle2.mass * dpNormal2) /
    (circle1.mass + circle2.mass);
  let m2 =
    (dpNormal2 * (circle2.mass - circle1.mass) + 2 * circle1.mass * dpNormal2) /
    (circle1.mass + circle2.mass);

  vx = tangental_x * dpTan1 + normal_x * dpNormal2;
  vy = tangental_y * dpTan1 + normal_y * dpNormal2;
  vx_2 = tangental_x * dpTan2 + normal_x * dpNormal1;
  vy_2 = tangental_y * dpTan2 + normal_y * dpNormal1;

  return {
    v1: { vx, vy },
    v2: { vx: vx_2, vy: vy_2 },
  };
}

/**
 * Checks if the circles provided collide
 * @param {Object} circle1 the circle that will be checked for any collisions
 * @param {Object} circle2 The array of circles
 */
function checkCollision(circle1, circle2) {
  const minDistance =
    circle1.radius * circle1.radius + circle2.radius * circle2.radius;
  if (getSquaredDistance(circle1, circle2) <= minDistance) {
    return true;
  }
}