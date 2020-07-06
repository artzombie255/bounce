const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 300;
const canvas = document.getElementById("sandbox");
const CANVAS_CONTEXT = canvas.getContext("2d");
canvas.style.width = CANVAS_WIDTH + "px";
canvas.style.height = CANVAS_HEIGHT + "px";

const context = CANVAS_CONTEXT;

var balls = [];
var paddle = { x: 300, y: 100, w: 40, h: 80 };
var Key = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

window.addEventListener("keydown", (event) => {
  const distance = 5;
  switch (event.keyCode) {
    case Key.UP:
      paddle.y -= distance;
      break;
    case Key.DOWN:
      paddle.y += distance;
      break;
    case Key.LEFT:
      paddle.x -= distance;
      break;
    case Key.RIGHT:
      paddle.x += distance;
      break;
  }
});

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "wheat";
  context.fillRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);

  context.fillStyle = "green";
  context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  balls.forEach((ball) => {
    context.fillStyle = "black";
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

    // check for collisions
    var newPosition = {
      x: ball.position.x + ball.velocity.x,
      y: ball.position.y + ball.velocity.y,
    };

    const paddleRightSide = paddle.x + paddle.w;
    const paddleBottomSide = paddle.y + paddle.h;
    const hHitTest =
      newPosition.x > paddle.x && newPosition.x < paddleRightSide;
    const vHitText =
      newPosition.y > paddle.y && newPosition.y < paddleBottomSide;
    // if new ball position hits the paddle at all
    if (hHitTest && vHitText) {
      const ballWillIntersectLeftPaddlePosition =
        ball.position.x < paddle.x && newPosition.x > paddle.x;
      const ballWillIntersectRightPaddlePosition =
        ball.position.x > paddleRightSide && newPosition.x < paddleRightSide;
      if (
        ballWillIntersectLeftPaddlePosition ||
        ballWillIntersectRightPaddlePosition
      ) {
        ball.velocity.x *= -1;
      }
      const ballWillIntersectTopPaddlePosition =
        ball.position.y < paddle.y && newPosition.y > paddle.y;
      const ballWillIntersectBottomPaddlePosition =
        ball.position.y > paddleBottomSide && newPosition.y < paddleBottomSide;
      if (
        ballWillIntersectTopPaddlePosition ||
        ballWillIntersectBottomPaddlePosition
      ) {
        ball.velocity.y *= -1;
      }
    }

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  });
  window.requestAnimationFrame(draw);
}

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
