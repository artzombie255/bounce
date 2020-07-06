const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 300;
const canvas = document.getElementById("sandbox");
const CANVAS_CONTEXT = canvas.getContext("2d");
canvas.style.width = CANVAS_WIDTH + "px";
canvas.style.height = CANVAS_HEIGHT + "px";

const context = CANVAS_CONTEXT;

var balls = [];

function draw() {
  console.log("rendering frame");

  // context.fillStyle = "black";
  // context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // context.fillStyle = "wheat";
  // context.fillRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
  var color = (context.fillStyle =
    "#" + Math.floor(Math.random() * 16777215).toString(16));

  balls.forEach((ball) => {
    context.fillStyle = "black";
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, 5, 0, 2 * Math.PI);
    context.stroke();
    context.fill();

    if (ball.position.x < 0 || ball.position.x > CANVAS_WIDTH) {
      ball.velocity.x *= -1;
    }
    if (ball.position.y < 0 || ball.position.y > CANVAS_HEIGHT) {
      ball.velocity.y *= -1;
    }

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  });
  // addBall();
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

function addBall() {
  console.log("adding ball");
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
