// Modules
const { app, BrowserWindow, ipcMain, dialog, clipboard } = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

console.log("8 -- main -- process.type", process.type);

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
  console.log("34 -- text in clip board: ", clipboard.readText());

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    x: 100,
    y: 140,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true, // if no use remote, set to false, def is false
    },
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("index.html");

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
  console.log("69 -- In main.js channel1 args(see this in terminal): ", args);
  e.sender.send(
    "channel1-resp",
    "msg: from main to renderer process -- Thank you."
  );
});

ipcMain.on("synctalk-message", (e, args) => {
  console.log(
    "78 -- In main.js synctalk-message args(receive this in terminal): ",
    args
  );

  setTimeout(() => {
    e.returnValue = "83 -- in main.js -- return sync resp val in 2s...";
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
