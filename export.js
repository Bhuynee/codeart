// Lưu ảnh
function exportImage() {
  html2canvas(document.getElementById("output")).then(canvas => {
    const link = document.createElement("a");
    link.download = "ascii_image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

// Ghi video ASCII
let recorder, recordedChunks;

function startRecording() {
  const output = document.getElementById("output");
  const stream = output.captureStream(25); // FPS
  recordedChunks = [];

  recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });

  recorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii_video.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  recorder.start();
}

function stopRecording() {
  recorder.stop();
  }
