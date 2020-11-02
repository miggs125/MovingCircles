function randNum(lowerLimit, upperLimit, nonZero) {
  return Math.floor(Math.random() * upperLimit + lowerLimit);
}

function getSquaredDistance(circle1, circle2) {
  const xDistance = Math.pow(circle1.location.x - circle2.location.x, 2);
  const yDistance = Math.pow(circle1.location.y - circle2.location.y, 2);

  return xDistance + yDistance;
}