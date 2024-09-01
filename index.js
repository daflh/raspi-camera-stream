const path = require('path');
const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');
const EventEmitter = require('node:events');
const FrameStreamTCP = require('./frame-stream-tcp');

const TCP_STREAM_ADDRESS = process.argv.length >= 3 ? process.argv[2] : '127.0.0.1';
const TCP_STREAM_PORT = process.argv.length >= 4 ? process.argv[3] : 45000;
const HTTP_SERVER_PORT = 5050;

const server = http.createServer(httpRequestListener);
const ioServer = socketio(server);
const frameStreamTCP = new FrameStreamTCP();
const eventEmitter = new EventEmitter();

function httpRequestListener(req, res) {
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'public/index.html');
    const fileData = fs.readFileSync(filePath);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fileData);
  }    
}

frameStreamTCP.connect(TCP_STREAM_PORT, TCP_STREAM_ADDRESS);

frameStreamTCP.onFrame((frameBase64) => {
  eventEmitter.emit('mjpeg-frame', frameBase64)
});

ioServer.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  eventEmitter.on('mjpeg-frame', (frameBase64) => {
    socket.emit('frame', frameBase64);
  });
});

server.listen(HTTP_SERVER_PORT, () => {
  console.log(`Server started on port ${HTTP_SERVER_PORT}`);
});
