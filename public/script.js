const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

let drawing = false;
let currentColor = colorPicker.value;

colorPicker.addEventListener('input', () => {
  currentColor = colorPicker.value;
});

canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  draw(e.offsetX, e.offsetY, false);
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
  if (drawing) draw(e.offsetX, e.offsetY, true);
});

function draw(x, y, drag) {
  const data = { x, y, drag, color: currentColor };
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  if (drag) {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  socket.send(JSON.stringify({ type: "draw", ...data }));
}

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.send(JSON.stringify({ type: "clear" }));
}

function setEraser() {
  currentColor = "white";
}

function setPen() {
  currentColor = colorPicker.value;
}

function saveImage() {
  const link = document.createElement('a');
  link.download = 'whiteboard.png';
  link.href = canvas.toDataURL();
  link.click();
}

// WebSocket
const socket = new WebSocket('ws://' + window.location.host);

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.type === "draw") {
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    if (data.drag) {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
    }
  }

  if (data.type === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};
