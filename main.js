// Modules
const { app, BrowserWindow, ipcMain, dialog, clipboard } = require("electron");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// app.disableHardwareAcceleration();

console.log("10 -- main -- process.type", process.type);

const askFruit = async () => {
  const fruits = ["Apple", "Orange", "Grape"];
  const choice = await dialog.showMessageBox({
    message: "Pick one fruit: ",
    buttons: fruits,
  });
  return fruits[choice.response];
};

/* ipcMain.on("ask-fruit-channel", (e) => {
  askFruit().then((answer) => {
    e.reply("answer-fruit-channel", answer);
  });
}); */
ipcMain.handle("ask-fruit-channel", async (e) => {
  const dib = await askFruit();
  return dib;
});

ipcMain.handle("desktop-path-channel", () => app.getPath("desktop"));

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  clipboard.writeText("Hello from main process...");
  console.log("36 -- text in clip board: ", clipboard.readText());

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    x: 100,
    y: 140,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true, // if no use remote, set to false, def is false
      // offscreen: true, // usually should comment it
      preload: __dirname + "/preload.js",
    },
  });

  let progressbarVal = 0.01;

  let progressbarInterval = setInterval(() => {
    mainWindow.setProgressBar(progressbarVal);
    if (progressbarVal <= 1) {
      progressbarVal += 0.01;
    } else {
      mainWindow.setProgressBar(-1);
      clearInterval(progressbarInterval);
    }
  }, 100);

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("index.html");
  // mainWindow.loadURL("https://www.electronjs.org");

  // a sample of in offline stage, what u can do
  // this will keep save screenshot to desktop each paint, so comment it usually
  /* let j = 1;
  mainWindow.webContents.on("paint", (e, dirty, screenshotImgData) => {
    const screenshot = screenshotImgData.toPNG();
    fs.writeFile(
      app.getPath("desktop") + `/screeshot_${j}.png`,
      screenshot,
      console.log
    );
    j++;
  }); */

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("did-finish-load", (e) => {
    mainWindow.webContents.send(
      "mailbox_Channel",
      /* "You have mail!" */ {
        from: "hello",
        email: "world@gmail.com",
        priority: 1,
      }
    );
    console.log("93 -- in main window check title: ", mainWindow.getTitle());
    /* mainWindow.close();
    mainWindow = null; */
  });

  mainWindow.webContents.on("crashed", (e) => {
    setTimeout(() => {
      mainWindow.reload();
    }, 1000);
  });

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("channel1", (e, args) => {
  console.log("111 -- In main.js channel1 args(see this in terminal): ", args);
  e.sender.send(
    "channel1-resp",
    "msg: from main to renderer process -- Thank you."
  );
});

ipcMain.on("synctalk-message", (e, args) => {
  console.log(
    "120 -- In main.js synctalk-message args(receive this in terminal): ",
    args
  );

  setTimeout(() => {
    e.returnValue = "125 -- in main.js -- return sync resp val in 2s...";
  }, 2000);
});

// Electron `app` is ready
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
