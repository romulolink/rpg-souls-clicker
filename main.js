const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
// like main.js
const {ipcMain} = require('electron');
const steamworks = require('steamworks.js');
// In some file from the main process
let isSteam = true;
let client;

Menu.setApplicationMenu(false);


function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    title: 'Monsters Idle RPG',
    icon: '/root/workspace/IncrementalMonsterslRPG/img/favicon.ico',
//    show: false,
    backgroundColor: '#ccc',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      backgroundThrottling: false,
    }
  });


  // You can pass an appId, or don't pass anything and use a steam_appid.txt file
  if(isSteam)
    client = steamworks.init(2310190);


  // Carrega o arquivo index.html
  mainWindow.loadFile(path.join(__dirname, 'index.html'));


  // Abre o DevTools (opcional)
  // mainWindow.webContents.openDevTools();

  // Receber a mensagem da página renderizada e definir o tamanho da janela
  //ipcMain.on('initializeWindow', (event, { width, height }) => {
  //  const mainWindow = BrowserWindow.getAllWindows()[0];
  //  mainWindow.setSize(width, height);
  //});


  // Attach listener in the main process with the given ID
  if(isSteam)
  ipcMain.on('activate-achievement', (event, arg) => {
      
        if (client && client.achievement.activate(arg.achi_id)) {
              // ...
        }

  });


  //app.on('ready-to-show', function() {
  //    mainWindow.show();
  //    mainWindow.focus();
  //});


  // Evento disparado quando a janela é fechada
  mainWindow.on('closed', function () {
    // Remove a referência da janela
    mainWindow = null;
  });
}


// Evento disparado quando o Electron terminou a inicialização e está pronto para criar janelas de navegador
app.on('ready', createWindow);

// Encerra o aplicativo quando todas as janelas estão fechadas
app.on('window-all-closed', function () {
  // No macOS, é comum que o aplicativo e sua barra de menu continuem ativos atÃ© que o usuário saia explicitamente com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Evento disparado quando o aplicativo é ativado, geralmente pelo ícone do dock no macOS
app.whenReady().then(() => {
  //createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

//app.disableHardwareAcceleration();
//app.commandLine.appendSwitch("disable-software-rasterizer")

require('steamworks.js').electronEnableSteamOverlay(true)