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
 * @param {Object} circle the circle to be updated
 * @param {Array} circles the array of animated circles
 */
function updateCirclePosition(circle, circles) {
  circles.forEach((cir) => {
    if (cir !== circle) {
      if (checkCollision(cir, circle)) {
        const distance = Math.sqrt(getSquaredDistance(cir, circle));

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
    velocityX: Math.random() < 0.5 ? -1 * SPEED : SPEED,
    velocityY: Math.random() < 0.5 ? -1 * SPEED : SPEED,
    mass: this.radius * 10,
  };
}