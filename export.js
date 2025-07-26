// Export mã ASCII dưới dạng ảnh PNG
function exportAsImage() {
  const output = document.getElementById("output");
  html2canvas(output).then(canvas => {
    const link = document.createElement('a');
    link.download = 'ascii_output.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Export mã ASCII dưới dạng file .txt
function exportAsText() {
  const asciiText = document.getElementById("output").innerText;
  const blob = new Blob([asciiText], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "ascii_output.txt";
  link.href = URL.createObjectURL(blob);
  link.click();
}
