/** @type {function(CanvasRenderingContext2D)} */
let frame, canvas, ctx;
const circles = [];
const PI = 3.14159;
const degree = PI / 180;
const MAX_CIRCLE_COUNT = 200;
const SPEED = 2;
const MAX_VELOCITY = SPEED;
const MIN_VELOCITY = -1 * SPEED;
const CIRCLE_RADIUS = 10;
const COLOR = 'rgb(255, 255, 255, 0.75)';
const CANVAS_COLOR = `rgb(0, 0, 0, 0.3)`;
const collisions = [];


/**
 * @param {Array} circles an array containing the circles to be drawn on the canvas
 * calls itself recursively animating the circles
 */
function draw(circles) {
  ctx.beginPath();
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


window.onload = () => {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  for (let i = 0; i < MAX_CIRCLE_COUNT; i++) {
    let circle = createCircle(canvas);
    circles.push(circle);
  }

  window.addEventListener('resize', () => {
    console.log('resize');
    fitToParent(canvas);
  });

  canvas.addEventListener('mouseout', (e) => {});

  frame = window.requestAnimationFrame(function () {
    draw(circles);
  });
};
