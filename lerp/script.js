myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;
const A = { x: 100, y: 300 };
const B = { x: 400, y: 100 };
const orange = { r: 230, g: 150, b: 0 };
const blue = { r: 0, g: 70, b: 160 };
const lowFreq = 200;
const highFreq = 600;
const ctx = myCanvas.getContext("2d");
let osc = null;
let audioCtx = null;
myCanvas.onclick = function () {
  if (audioCtx == null) {
    audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    osc.frequency.value = 200;
    osc.start();
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    osc.connect(node);
    node.connect(audioCtx.destination);
  }
};
animate();
function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  const sec = new Date().getTime() / 1000;
  const t = (Math.sin(sec * Math.PI) + 1) / 2;
  const C = vLerp(A, B, t);
  drawDot(C, "");
  drawDot(A, "A");
  drawDot(B, "B");
  const { r, g, b } = vLerp(orange, blue, t);
  myCanvas.style.backgroundColor = `rgb(${r},${g},${b})`;
  requestAnimationFrame(animate);
  if (osc) {
    osc.frequency.value = lerp(lowFreq, highFreq, t);
  }
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 40px Arial";
  ctx.setLineDash([lerp(50, 100, t), 100]);
  ctx.strokeText("Click for sound", myCanvas.width / 2, 10);
  ctx.setLineDash([]);
  ctx.fillText("Click for sound", myCanvas.width / 2, 10);
}
function vLerp(A, B, t) {
  const res = {};
  for (let attr in A) {
    res[attr] = lerp(A[attr], B[attr], t);
  }
  return res;
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function drawDot(pos, label) {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 12px Arial";
  ctx.fillText(label, pos.x, pos.y);
}
