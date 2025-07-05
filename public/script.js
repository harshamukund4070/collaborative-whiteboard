const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
const socket = new WebSocket(`ws://${location.host}`);

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const x = e.clientX;
  const y = e.clientY;
  ctx.lineTo(x, y);
  ctx.stroke();
  socket.send(JSON.stringify({ x, y }));
}

socket.onmessage = (msg) => {
  const { x, y } = JSON.parse(msg.data);
  ctx.lineTo(x, y);
  ctx.stroke();
};
