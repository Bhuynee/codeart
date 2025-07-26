const video = document.createElement('video');
video.setAttribute("playsinline", "");
video.muted = true;
video.loop = true;
video.style.display = "none";
document.body.appendChild(video);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const asciiOutput = document.getElementById("output");

function convertVideoToAscii(file) {
  const fileURL = URL.createObjectURL(file);
  video.src = fileURL;
  video.play();

  video.addEventListener('play', () => {
    const frameRate = 10; // số khung hình mỗi giây
    const interval = 1000 / frameRate;

    function drawFrame() {
      if (!video.paused && !video.ended) {
        const w = 120;
        const h = video.videoHeight / (video.videoWidth / w);
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const pixels = imageData.data;

        let ascii = '';
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const brightness = (r + g + b) / 3;
            const char = getAsciiChar(brightness);
            ascii += `%c${char}`;
          }
          ascii += '\n';
        }

        const styleArray = [];
        for (let i = 0; i < pixels.length; i += 4) {
          styleArray.push(`color: rgb(${pixels[i]}, ${pixels[i + 1]}, ${pixels[i + 2]})`);
        }

        console.clear();
        console.log(ascii, ...styleArray);
        asciiOutput.textContent = ascii.replace(/%c/g, '');

        setTimeout(drawFrame, interval);
      }
    }

    drawFrame();
  });
}
