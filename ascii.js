const asciiChars = "@#W$9876543210?!abc;:+=-,._ ";

document.getElementById("fileInput").addEventListener("change", async function(e) {
  const file = e.target.files[0];
  const output = document.getElementById("output");

  if (file.type.startsWith("image")) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => drawAscii(img);
  } else if (file.type.startsWith("video")) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.play();

    const interval = setInterval(() => {
      if (video.ended || video.paused) return;
      drawAscii(video);
    }, 100);
  }
});

function drawAscii(source) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 100;
  const scale = source.videoWidth ? source.videoHeight / source.videoWidth : source.height / source.width;
  const height = Math.round(width * scale * 0.55);

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(source, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height).data;

  let ascii = "";
  for (let i = 0; i < imgData.length; i += 4 * width) {
    for (let j = 0; j < width * 4; j += 4) {
      const r = imgData[i + j];
      const g = imgData[i + j + 1];
      const b = imgData[i + j + 2];
      const brightness = (r + g + b) / 3;
      const char = asciiChars[Math.floor((brightness / 255) * (asciiChars.length - 1))];
      ascii += `<span style="color:rgb(${r},${g},${b})">${char}</span>`;
    }
    ascii += "<br/>";
  }

  document.getElementById("output").innerHTML = ascii;
}
