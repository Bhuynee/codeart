const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", () => {
  const asciiContent = output.innerHTML;

  // Chuyển HTML (span màu) thành canvas để lưu PNG
  html2canvas(output).then(canvas => {
    const link = document.createElement("a");
    link.download = "ascii_output.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// Nếu muốn lưu ra file .txt mã ASCII
const exportTextBtn = document.getElementById("exportTextBtn");
if (exportTextBtn) {
  exportTextBtn.addEventListener("click", () => {
    const plainText = output.innerText;
    const blob = new Blob([plainText], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "ascii_output.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
  });
}
