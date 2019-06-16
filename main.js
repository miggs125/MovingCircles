/** @type {function(CanvasRenderingContext2D)} */
let frame, canvas, ctx;
let circles = [];

function drawCircle(circle) {
  ctx.fillStyle = circle.color;
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function draw(circles) {
  ctx.beginPath();
  ctx.fillStyle = `rgb(6, 6, 46)`;
  clearCanvas(canvas);

  if (circles) {
    circles.forEach(function(circle) {
      drawCircle(circle);
      circle.x = circle.x + circle.speedX;
      circle.y = circle.y + circle.speedY;
      let positionY = circle.y + circle.speedY + circle.radius;
      let positionX = circle.x + circle.speedX + circle.radius;
      if (
        (circle.y + circle.speedY + circle.radius) > canvas.height ||
        (circle.y + circle.speedY - circle.radius) < 0
      ) {
        circle.speedY = -circle.speedY;
      }
      if (
       ( circle.x + circle.speedX + circle.radius) > canvas.width ||
        (circle.x + circle.speedX  - circle.radius) < 0
      ) {
        circle.speedX = -circle.speedX;
      }
    });
  }

  frame = window.requestAnimationFrame(function() {
    draw(circles);
  });
}

function randNum(lowerLimit, upperLimit, nonZero) {
  let num;
  do {
    num = Math.floor(Math.random() * upperLimit + lowerLimit);
  } while (!num);
  return num;
}

function randomParams(canvas) {
  let rect = canvas.getBoundingClientRect();

  return {
    x: randNum(rect.left + 30, rect.right - 60),
    y: randNum(rect.top +30, rect.bottom - 60),
    radius: randNum(4, 30),
    color: `rgb(${randNum(0, 255)}, ${randNum(0, 255)}, ${randNum(0, 255)})`,
    speedX: randNum(-3, 6),
    speedY: randNum(-3, 6)
  };
}

/** @type {function(HTMLCanvas)} */
function clearCanvas(canvas) {
  ctx.fillStyle = `rgb(6, 6, 46)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fitToParent (element) {
    element.style.width = '100%';
    element.style.height = '100%';

    element.width = element.offsetWidth;
    element.height = element.offsetHeight;
  };

window.onload = () => {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  const MAX_CIRCLE_COUNT = 150;

  for (let i = 0; i < MAX_CIRCLE_COUNT; i++) {
    let circle = randomParams(canvas);
    drawCircle(ctx, circle);

    circles.push(circle);
  }

    frame = window.requestAnimationFrame(function() {
      draw(circles);
    });

    window.addEventListener('resize', () => {
        fitToParent(canvas);
      });

};
