// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { desktopCapturer, ipcRenderer, remote } = require("electron");
const { dialog, BrowserWindow } = remote;

document.getElementById("screenshot-button").addEventListener("click", () => {
  desktopCapturer
    .getSources({
      //   types: ["screen"],
      types: ["window"], // window means electron app window
      thumbnailSize: { width: 1920, height: 1080 },
    })
    .then((source) => {
      console.log("14 -- source: ", source);
      /* why use source[0], you may have more then 1 monitor,
      so you may have multi-screens */
      document.getElementById(
        "screenshot1"
      ).src = source[0].thumbnail.toDataURL();
    })
    .catch((err) => {
      console.log("22 -- err: ", err);
    });
});

document.getElementById("talk").addEventListener("click", (e) => {
  ipcRenderer.send(
    "channel1",
    " -- In renderer.js -- send from renderer to main process -- msg is sent to main window..."
  );
});

document.getElementById("sync-talk").addEventListener("click", (e) => {
  const resp = ipcRenderer.sendSync(
    "synctalk-message",
    " -- In renderer.js -- (renderer to main) -- wait for response"
  );
  console.log("39 -- resp: ", resp);
});

ipcRenderer.on("channel1-resp", (e, args) => {
  console.log("43 -- In renderer.js -- args: ", args);
});

ipcRenderer.on("mailbox_Channel", (e, args) => {
  console.log(
    "48 -- In renderer.js -- args(when main window load is done): ",
    args
  );
});

setTimeout(() => {
  const win = new BrowserWindow({
    x: 50,
    y: 50,
    width: 300,
    height: 250,
  });
  win.loadFile("./index.html");
  //   setTimeout(remote.app.quit, 200);
  const currWin = remote.getCurrentWindow();
  currWin.maximize();
  setTimeout(() => {
    currWin.setSize(1000, 800, true);
  }, 2000);
}, 2000);

/* "ask-fruit-channel", (e) => {
    askFruit().then((answer) => {
      e.reply("answer-fruit-channel" */
document.getElementById("ask").addEventListener("click", () => {
  // ipcRenderer.send("ask-fruit-channel");
  ipcRenderer
    .invoke("ask-fruit-channel")
    .then((answer) => {
      console.log("78 -- chosen fruit: ", answer);
    })
    .catch((err) => {
      console.log("82 -- chosen fruit ERROR: ", err);
    });
});

/* ipcRenderer.on("answer-fruit-channel", (e, args) => {
  console.log("87 -- In renderer.js -- args(rz of choose fruit): ", args);
}); */
