/**
 * Blockchain Practicals Local Web Server
 * Zero external dependencies - uses Node.js standard 'http', 'fs', 'path'
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Sanitize path to prevent directory traversal
    let safePath = path.normalize(decodeURIComponent(req.url.split('?')[0]));
    if (safePath === '/' || safePath === '') safePath = '/index.html';

    let filePath = path.join(ROOT_DIR, safePath);

    // If directory requested, redirect if missing trailing slash, then serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        if (!req.url.split('?')[0].endsWith('/')) {
            res.writeHead(301, { 'Location': req.url.split('?')[0] + '/' });
            res.end();
            return;
        }
        filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <body style="background:#0b0f19; color:#f1f5f9; font-family:sans-serif; text-align:center; padding:50px;">
                    <h1 style="color:#ef4444;">404 Not Found</h1>
                    <p>The requested file does not exist: <code>${safePath}</code></p>
                    <a href="/" style="color:#38bdf8;">Return to Dashboard</a>
                </body>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(75));
    console.log(` 🌐 BLOCKCHAIN PRACTICALS WEB SERVER RUNNING`);
    console.log(`    URL: http://localhost:${PORT}`);
    console.log(`    Press Ctrl + C to stop`);
    console.log('='.repeat(75));
});
