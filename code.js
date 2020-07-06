const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 300;
const canvas = document.getElementById("sandbox");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var balls = [];
var paddle = { x: 300, y: 100, w: 40, h: 80 };
var Key = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  S: 83,
  A: 65,
  D: 68,
};

var pressedKeys = {};
window.onkeydown = (event) => {
  pressedKeys[event.keyCode] = true;
};
window.onkeyup = (event) => {
  pressedKeys[event.keyCode] = false;
};

function draw() {
  const distance = 5;
  if (pressedKeys[Key.W]) {
    paddle.h -= 1;
    if (paddle.h < 1) paddle.h = 1;
  }
  if (pressedKeys[Key.S]) {
    paddle.h += 1;
  }
  if (pressedKeys[Key.A]) {
    paddle.w -= 1;
    if (paddle.w < 1) paddle.w = 1;
  }
  if (pressedKeys[Key.D]) {
    paddle.w += 1;
  }
  if (pressedKeys[Key.UP]) {
    paddle.y -= distance;
    if (paddle.y < 0) paddle.y = 0;
  }
  if (pressedKeys[Key.DOWN]) {
    paddle.y += distance;
    if (paddle.y + paddle.h > CANVAS_HEIGHT)
      paddle.y = CANVAS_HEIGHT - paddle.h;
  }
  if (pressedKeys[Key.LEFT]) {
    paddle.x -= distance;
    if (paddle.x < 0) paddle.x = 0;
  }
  if (pressedKeys[Key.RIGHT]) {
    paddle.x += distance;
    if (paddle.x + paddle.w > CANVAS_WIDTH) paddle.x = CANVAS_WIDTH - paddle.w;
  }

  context.fillStyle = "black";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "wheat";
  context.fillRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);

  context.fillStyle = "green";
  context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  balls.forEach((ball) => {
    context.fillStyle = "red";
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, 5, 0, 2 * Math.PI);
    context.stroke();
    context.fill();

    // check for walls
    // check for left and right walls
    if (ball.position.x < 0 || ball.position.x > CANVAS_WIDTH) {
      ball.velocity.x *= -1;
    }
    // check for top and bottom walls
    if (ball.position.y < 0 || ball.position.y > CANVAS_HEIGHT) {
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
    x: Math.random() * CANVAS_WIDTH,
    y: Math.random() * CANVAS_HEIGHT,
  };
  const randomVelocity = {
    x: Math.random() * 20 - 10,
    y: Math.random() * 20 - 10,
  };
  const newBall = {
    position: randomPosition,
    velocity: randomVelocity,
  };
  balls.push(newBall);
}
