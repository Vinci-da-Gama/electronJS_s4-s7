// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { nativeImage, ipcRenderer } = require("electron");
const fs = require("fs");

const splishPic = nativeImage.createFromPath(`${__dirname}/splash.png`);

const saveToDesktop = async (imgData, ext) => {
  const desktopPath = await ipcRenderer.invoke("desktop-path-channel");
  fs.writeFile(`${desktopPath}/splash.${ext}`, imgData, console.log);
};

const toPng = () => {
  const pngSplish = splishPic.toPNG();
  saveToDesktop(pngSplish, "png");
};

const toJpg = () => {
  // 100 means 100% same as prev img, u can change it...
  const jpgSplish = splishPic.toJPEG(100);
  saveToDesktop(jpgSplish, "jpg");
};

const showImg = () => {
  const size = splishPic.getSize();
  document.getElementById("previewSplash").src = splishPic
    .resize({
      width: Math.round(size.width / 4),
      height: Math.round(size.height / 4),
    })
    .toDataURL();
};

module.exports = {
  toPng,
  toJpg,
  showImg,
};
