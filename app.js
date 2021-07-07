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

    mainWindow.loadURL('http://localhost:8000');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('resize', (e, x, y) => {
    mainWindow.setSize(x, y);
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
