const net = require('net');
const { Transform } = require('stream');

class FrameStreamTCP {
  constructor() {
    this.socket = new net.Socket();
    this.jpegParser = new JPEGStream();
    this.callback = null;
  }

  connect(port, address) {
    this.socket.connect(port, address);

    this.socket.on('connect', () => {
      console.log('Connected to frame server');

      this.socket.pipe(this.jpegParser).on('data', (data) => {
        // console.log('frame received')
        if (!this.callback) return;
  
        const frameBase64 = Buffer.from(data).toString('base64');
        this.callback(frameBase64)
      });
    });
    
    this.socket.on('error', (err) => {
      console.log('Connection to frame server failed');
      console.log('Retrying in 5 seconds...');

      setTimeout(() => this.socket.connect(port, address), 5000);
    });
  }

  onFrame(callback) {
    this.callback = callback;
  }
}

// credits: www.npmjs.com/package/jpeg-stream (@nickmomrik @guille)
class JPEGStream extends Transform {
  constructor(options) {
    super(options);
    this.jpeg = null;
    this.count = 0;
    this.expectEnd = false;
    this.expectStart = false;
  }

  _transform(buffer, encoding, callback) {
    for (let i = 0; i < buffer.length; i++) {
      if (!this.jpeg) {
        if (buffer[i] === 0xff) {
          this.jpeg = [buffer[i]];
          this.expectStart = true;
        }
      } else {
        this.jpeg.push(buffer[i]);

        if (this.expectStart) {
          if (buffer[i] === 0xd8) {
            this.expectStart = false;
            continue;
          }

          this.jpeg = null;

          if (!this.count) {
            return callback(new Error('Expected JPEG start'));
          }
        }

        if (this.expectEnd) {
          if (buffer[i] === 0xd9) {
            const jpeg = Buffer.from(this.jpeg);
            this.count++;
            this.push(jpeg);
            this.jpeg = null;
          } else if (buffer[i] === 0xd8) {
            return callback(new Error('Expected JPEG end, but found start'));
          }

          this.expectEnd = false;
          continue;
        }

        if (buffer[i] === 0xff) {
          this.expectEnd = true;
        }
      }
    }

    callback();
  }
}

module.exports = FrameStreamTCP
