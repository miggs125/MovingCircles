/** @type {function(CanvasRenderingContext2D)} */
let frame, canvas, ctx;
const circles = [];
const PI = 3.14159;
const degree = PI / 180;
const MAX_CIRCLE_COUNT = 10;
const MAX_VELOCITY = 5;
const MIN_VELOCITY = -5;
const CIRCLE_RADIUS = 10;
const COLOR = 'rgb(255, 255, 255, 0.75)';

function drawCircle(circle) {
  const { location, radius, color } = circle;
  const { x, y } = location;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

/**
 * @param {Array} circles an array containing the circles to be drawn on the canvas
 * calls itself recursively animating the circles
 */
function draw(circles) {
  ctx.beginPath();
  ctx.fillStyle = `rgb(6, 6, 46, 0.3)`; // this should be a constant
  clearCanvas(canvas);

  if (circles) {
    circles.forEach((circle) => {
      updateCirclePosition(circle, circles);
      drawCircle(circle);
    });
  }

  // recursively
  frame = window.requestAnimationFrame(function () {
    draw(circles);
  });
}

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
 * @param {Object} circle the circle to be updated
 * @param {Array} circles the array of animated circles
 */
function updateCirclePosition(circle, circles) {
  circles.forEach((cir) => {
    if (cir !== circle) {
      if (checkCollision(cir, circle)) {
        const distance = getcurrentDistance(cir, circle);

        // resolve static collision (overlap)
        if (distance <= circle.radius + cir.radius) {
          solveOverlap(circle, cir, distance);
        }
        // sum velocity vectors
        const { v1, v2 } = solveVelocityVectors(circle, cir, distance);

        // limit resultant speed to MAX_VELOCITY or MIN_VELOCITY

        if (v1.vx > MAX_VELOCITY) {
          v1.vx = MAX_VELOCITY;
        } else if (v1.vx < MIN_VELOCITY) {
          v1.vx = MIN_VELOCITY;
        }

        if (v1.vy > MAX_VELOCITY) {
          v1.vy = MAX_VELOCITY;
        } else if (v1.vy < MIN_VELOCITY) {
          v1.vy = MIN_VELOCITY;
        }

        if (v2.vx > MAX_VELOCITY) {
          v2.vx = MAX_VELOCITY;
        } else if (v2.vx < MIN_VELOCITY) {
          v2.vx = MIN_VELOCITY;
        }

        if (v2.vy > MAX_VELOCITY) {
          v2.vy = MAX_VELOCITY;
        } else if (v2.vy < MIN_VELOCITY) {
          v2.vy = MIN_VELOCITY;
        }

        circle.velocityX = v1.vx;
        circle.velocityY = v1.vy;
        cir.velocityX = v2.vx;
        cir.velocityY = v2.vy;
      }
    }
  });

  // make objects at the end of canvas appear on the other end
  if (
    circle.location.x - circle.radius < 0 ||
    circle.location.x + circle.radius > canvas.width
  ) {
    circle.velocityX = -circle.velocityX;
  }

  if (
    circle.location.y - circle.radius < 0 ||
    circle.location.y + circle.radius > canvas.height
  ) {
    circle.velocityY = -circle.velocityY;
  }

  // update circle position
  circle.location.x += circle.velocityX;
  circle.location.y += circle.velocityY;
}

/**
 * Checks if the circles provided collide
 * @param {Object} circle1 the circle that will be checked for any collisions
 * @param {Object} circle2 The array of circles
 */
function checkCollision(circle1, circle2) {
  const minDistance = circle1.radius + circle2.radius;
  if (getcurrentDistance(circle1, circle2) <= minDistance) {
    return true;
  }
}

function getcurrentDistance(circle1, circle2) {
  const xDistance = Math.pow(circle1.location.x - circle2.location.x, 2);
  const yDistance = Math.pow(circle1.location.y - circle2.location.y, 2);

  return Math.sqrt(xDistance + yDistance);
}

function randNum(lowerLimit, upperLimit, nonZero) {
  return Math.floor(Math.random() * upperLimit + lowerLimit);
}

/**
 *
 * @param {HMTLCanvas} canvas
 */
function createCircle(canvas, rad = 0, col = '') {
  let rect = canvas.getBoundingClientRect();

  return {
    location: {
      x: randNum(rect.left + 30, rect.right - 60),
      y: randNum(rect.top + 30, rect.bottom - 60),
    },
    radius: rad ? rad : CIRCLE_RADIUS,
    color: !!col ? col : COLOR,
    velocityX: randNum(MIN_VELOCITY, MAX_VELOCITY),
    velocityY: randNum(MIN_VELOCITY, MAX_VELOCITY),
    mass: this.radius * 10,
  };
}

/** @type {function(HTMLCanvas)} clears the canvas*/
function clearCanvas(canvas) {
  ctx.fillStyle = `rgb(6, 6, 46, 0.3)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fitToParent(element) {
  element.style.width = '100%';
  element.style.height = '100%';

  element.width = element.offsetWidth;
  element.height = element.offsetHeight;
}

window.onload = () => {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  for (let i = 0; i < MAX_CIRCLE_COUNT; i++) {
    let circle = createCircle(canvas);
    circles.push(circle);
  }

  frame = window.requestAnimationFrame(function () {
    draw(circles);
  });

  window.addEventListener('resize', () => {
    console.log('resize');
    fitToParent(canvas);
  });

  canvas.addEventListener('mousemove', (e) => {
    console.log('move');
    clearCanvas(canvas);
    drawCircle(createCircle(canvas, 10));
  });

  canvas.addEventListener('mouseout', (e) => {});
};
