const { app, BrowserWindow } = require('electron');

require('./server');

// START: npm start .
// BUILD: npm run pack

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 290,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL('http://localhost:8000').catch(() => {
        mainWindow = null;
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
