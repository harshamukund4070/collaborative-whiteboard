const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

let drawing = false;
let currentTool = 'pen';
let color = document.getElementById("colorPicker").value;
let thickness = document.getElementById("thickness").value;

const socket = new WebSocket(`wss://${window.location.host}`);

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
  socket.send(JSON.stringify({ type: "end" }));
}

function draw(e) {
  if (!drawing) return;

  const x = e.clientX;
  const y = e.clientY - 50;

  ctx.lineWidth = thickness;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentTool === 'pen' ? color : "#ffffff";

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  socket.send(JSON.stringify({
    type: "draw",
    x,
    y,
    color: ctx.strokeStyle,
    thickness: ctx.lineWidth
  }));
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

document.getElementById("colorPicker").addEventListener("change", (e) => {
  color = e.target.value;
});

document.getElementById("thickness").addEventListener("input", (e) => {
  thickness = e.target.value;
});

document.getElementById("pen").addEventListener("click", () => {
  currentTool = 'pen';
});

document.getElementById("eraser").addEventListener("click", () => {
  currentTool = 'eraser';
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.send(JSON.stringify({ type: "clear" }));
});

socket.onmessage = (message) => {
  const data = JSON.parse(message.data);

  if (data.type === "draw") {
    ctx.lineWidth = data.thickness;
    ctx.strokeStyle = data.color;
    ctx.lineCap = "round";

    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
  }

  if (data.type === "end") {
    ctx.beginPath();
  }

  if (data.type === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};
