// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { clipboard } = require("electron");
const fs = require("fs");

const makeUppercase = () =>
  clipboard.writeText(clipboard.readText().toUpperCase());

const showClipboardImg = () => {
  const img = clipboard.readImage();
  const size = img.getSize();
  document.getElementById("imgInClipboard").src = img
    .resize({
      width: Math.round(size.width / 4),
      height: Math.round(size.height / 4),
    })
    .toDataURL();
};

module.exports = {
  makeUppercase,
  showClipboardImg,
};
