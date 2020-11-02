/** @type {function(HTMLCanvas)} clears the canvas*/
function clearCanvas(canvas) {
  ctx.fillStyle = CANVAS_COLOR;
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fitToParent(element) {
  element.style.width = '100%';
  element.style.height = '100%';

  element.width = element.offsetWidth;
  element.height = element.offsetHeight;
}