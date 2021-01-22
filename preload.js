const fs = require("fs");

window.writeToFile = (text) => {
  fs.writeFile(`${__dirname}/textareaContent.txt`, text, console.log);
};

window.haPreloadSet = {
  node: process.versions.node,
  electron: process.versions.electron,
};
