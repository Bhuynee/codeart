const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const asciiChars = "@#W$9876543210?!abc;:+=-,._ ";

function rgbToAscii(r, g, b) {
  const avg = (r + g + b) / 3;
  const index = Math.floor((avg / 255) * (asciiChars.length - 1));
  const char = asciiChars[index];
  return `<span style="color:rgb(${r},${g},${b})">${char}</span>`;
}

function imageToAscii(img) {
  const width = 100;
  const scale = img.height / img.width;
  const height = Math.round(width * scale);
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height).data;
  let ascii = "";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = imgData[index];
      const g = imgData[index + 1];
      const b = imgData[index + 2];
      ascii += rgbToAscii(r, g, b);
    }
    ascii += "<br>";
  }

  output.innerHTML = ascii;
}

function videoToAscii(video) {
  const width = 100;
  const scale = video.videoHeight / video.videoWidth;
  const height = Math.round(width * scale);
  canvas.width = width;
  canvas.height = height;

  function renderFrame() {
    ctx.drawImage(video, 0, 0, width, height);
    const frame = ctx.getImageData(0, 0, width, height).data;
    let ascii = "";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        ascii += rgbToAscii(frame[i], frame[i+1], frame[i+2]);
      }
      ascii += "<br>";
    }

    output.innerHTML = ascii;
    requestAnimationFrame(renderFrame);
  }

  video.play();
  renderFrame();
}

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type.startsWith("image/")) {
    const img = new Image();
    img.onload = () => imageToAscii(img);
    img.src = URL.createObjectURL(file);
  } else if (file.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.addEventListener("loadeddata", () => videoToAscii(video));
  }
});
