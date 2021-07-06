const { app, BrowserWindow } = require('electron');
const ipc = require('./public/js/backEnd/ipc/ipcMain.js');
const dbConnect = require('./public/js/backEnd/database/connection.js')

app.on('ready', () => {
  //criar uma janela principal
  mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 1000,
    height: 750,
    minHeight: 750,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: `${__dirname}/public/images/icon.png`,
    frame: false,
  });
  //carregar a url index.html que está no diretorio atual
  mainWindow.loadURL(`${__dirname}/public/Views/index.html`);
});
