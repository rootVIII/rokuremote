const fs = require('fs');
const http = require('http');
const path = require('path');
const NetworkScan = require('./network_scan');
const Roku = require('./roku');

let rokuDevices = {};
const scan = new NetworkScan();
scan.scanNetworkRange().then((foundRokus) => {
    rokuDevices = foundRokus;
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const host = 'localhost';
const port = 8000;
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
};

const page404 = `
<!DOCTYPE html><html lang="en" dir="ltr">
    <head>
        <title>Not Found</title>
        <meta charset="UTF-8">
    </head>
    <body>
        Not Found
    </body>
</html>`;

const server = http.createServer((request, response) => {
    let filePath;
    if (request.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else {
        filePath = path.join(__dirname, request.url);
    }

    const contentType = mimeTypes[String(path.extname(filePath)).toLowerCase()] || 'application/octet-stream';

    if (filePath.includes('sendkey')) {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            const result = JSON.parse(data);

            const rokuRemote = new Roku(result.IP);

            rokuRemote.send(result.KeyID).then(() => {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end('{}', 'utf-8');
            }).catch((err) => {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ ERROR: err }), 'utf-8');
            });
        });
    } else if (filePath.includes('get-devices')) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(rokuDevices), 'utf-8');
    } else {
        fs.readFile(filePath, (error, content) => {
            if (error) {
                response.setHeader('Content-Type', 'text/html');
                response.end(page404);
            } else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
