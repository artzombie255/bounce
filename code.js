const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 300;

var scale = window.devicePixelRatio;
const WIDTH = scale * CANVAS_WIDTH;
const HEIGHT = scale * CANVAS_HEIGHT;
const canvas = document.getElementById("sandbox");
const context = canvas.getContext("2d");

canvas.style.width = CANVAS_WIDTH + "px";
canvas.style.height = CANVAS_HEIGHT + "px";
canvas.width = WIDTH;
canvas.height = HEIGHT;

var balls = [];
var paddle = { x: 300 * scale, y: 100 * scale, w: 40 * scale, h: 80 * scale };
var Key = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  SPACE: 32,
  ENTER: 13,
};

var pressedKeys = {};
window.onkeydown = (event) => {
  pressedKeys[event.keyCode] = true;
  if (event.keyCode == Key.SPACE || event.keyCode == Key.ENTER) {
    addBall();
  }
};
window.onkeyup = (event) => {
  pressedKeys[event.keyCode] = false;
};

function draw() {
  const distance = 5 * scale;
  const increment = 1 * scale;
  if (pressedKeys[Key.W]) {
    paddle.h -= increment;
    if (paddle.h < 1) paddle.h = 1;
  }
  if (pressedKeys[Key.S]) {
    paddle.h += increment;
  }
  if (pressedKeys[Key.A]) {
    paddle.w -= increment;
    if (paddle.w < 1) paddle.w = 1;
  }
  if (pressedKeys[Key.D]) {
    paddle.w += increment;
  }
  if (pressedKeys[Key.UP]) {
    paddle.y -= distance;
    if (paddle.y < 0) paddle.y = 0;
  }
  if (pressedKeys[Key.DOWN]) {
    paddle.y += distance;
    if (paddle.y + paddle.h > HEIGHT) paddle.y = HEIGHT - paddle.h;
  }
  if (pressedKeys[Key.LEFT]) {
    paddle.x -= distance;
    if (paddle.x < 0) paddle.x = 0;
  }
  if (pressedKeys[Key.RIGHT]) {
    paddle.x += distance;
    if (paddle.x + paddle.w > WIDTH) paddle.x = WIDTH - paddle.w;
  }

  context.fillStyle = "black";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = "wheat";
  const borderWidth = 2 * scale;
  context.fillRect(
    borderWidth,
    borderWidth,
    WIDTH - borderWidth * 2,
    HEIGHT - borderWidth * 2
  );

  context.fillStyle = "green";
  context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  const ballRadius = 5 * scale;
  balls.forEach((ball) => {
    context.fillStyle = ball.color;
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
    context.fill();

    // check for walls
    // left and right
    if (ball.position.x < 0 || ball.position.x > WIDTH) {
      ball.velocity.x *= -1;
    }
    // top and bottom
    if (ball.position.y < 0 || ball.position.y > HEIGHT) {
      ball.velocity.y *= -1;
    }

    // check for collisions with paddle
    var newPosition = {
      x: ball.position.x + ball.velocity.x,
      y: ball.position.y + ball.velocity.y,
    };

    const paddleRight = paddle.x + paddle.w;
    const paddleBottom = paddle.y + paddle.h;
    const hHitTest = newPosition.x > paddle.x && newPosition.x < paddleRight;
    const vHitTest = newPosition.y > paddle.y && newPosition.y < paddleBottom;
    // if new ball position hits the paddle at all
    if (hHitTest && vHitTest) {
      const ballIntersectLeft =
        ball.position.x < paddle.x && newPosition.x > paddle.x;
      const ballIntersectRight =
        ball.position.x > paddleRight && newPosition.x < paddleRight;
      if (ballIntersectLeft || ballIntersectRight) {
        ball.velocity.x *= -1;
      }
      const ballIntersectTop =
        ball.position.y < paddle.y && newPosition.y > paddle.y;
      const ballIntersectBottom =
        ball.position.y > paddleBottom && newPosition.y < paddleBottom;
      if (ballIntersectTop || ballIntersectBottom) {
        ball.velocity.y *= -1;
      }
    }

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  });
  window.requestAnimationFrame(draw);
}
Array(5).fill("").forEach(addBall);
window.requestAnimationFrame(draw);

function addBall() {
  const randomPosition = {
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
  };
  const randomVelocity = {
    x: Math.random() * 20 - 10,
    y: Math.random() * 20 - 10,
  };
  const randomColor = "#" + Math.random().toString(16).substr(-6);
  const newBall = {
    position: randomPosition,
    velocity: randomVelocity,
    color: randomColor,
    radius: Math.random() * 10 * scale,
  };
  balls.push(newBall);
}
