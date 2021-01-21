// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { shell } = require("electron");

const splishPath = `${__dirname}/splash.png`;

const shellFuncs = {
  showSite: () => {
    shell.openExternal("https://www.electronjs.org");
  },
  openSplish: () => {
    shell.openPath(splishPath);
  },
  showSplishFile: () => {
    shell.showItemInFolder(splishPath);
  },
  delSplishFile: () => {
    shell.moveItemToTrash(splishPath);
  },
};

module.exports = shellFuncs;
