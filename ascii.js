const fileInput = document.getElementById("fileInput");
const convertBtn = document.getElementById("convertBtn");
const outputDiv = document.getElementById("output");

const density = " .:-=+*#%@"; // Mật độ pixel đơn giản

function getCharForBrightness(brightness) {
  const index = Math.floor((brightness / 255) * (density.length - 1));
  return density[index];
}

function rgbToAnsi(r, g, b) {
  return `\x1b[38;2;${r};${g};${b}m`;
}

function drawAsciiFromImage(image) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxWidth = 120;
  const scale = maxWidth / image.width;
  canvas.width = maxWidth;
  canvas.height = image.height * scale;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let ascii = "";
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const r = imageData[index];
      const g = imageData[index + 1];
      const b = imageData[index + 2];
      const brightness = (r + g + b) / 3;
      const char = getCharForBrightness(brightness);
      ascii += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
    }
    ascii += "\n";
  }

  outputDiv.innerHTML = ascii;
}

function handleFile(file) {
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        drawAsciiFromImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else if (file.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.autoplay = true;
    video.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.addEventListener("play", function () {
      const maxWidth = 120;
      const scale = maxWidth / video.videoWidth;
      canvas.width = maxWidth;
      canvas.height = video.videoHeight * scale;

      function render() {
        if (!video.paused && !video.ended) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

          let ascii = "";
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const index = (y * canvas.width + x) * 4;
              const r = data[index];
              const g = data[index + 1];
              const b = data[index + 2];
              const brightness = (r + g + b) / 3;
              const char = getCharForBrightness(brightness);
              ascii += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
            }
            ascii += "\n";
          }

          outputDiv.innerHTML = ascii;
          requestAnimationFrame(render);
        }
      }

      render();
    });
  }
}

convertBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (file) {
    handleFile(file);
  }
});
