# raspi-camera-stream

### How to use

1. Run this following command on Raspberry Pi
```sh
libcamera-vid -t 0 --inline --listen -o tcp://0.0.0.0:45000 --codec mjpeg
# alternative for debian bookworm or later
rpicam-vid -t 0 --inline --listen -o tcp://0.0.0.0:45000 --codec mjpeg
```

2. Clone this repo in your local computer, or you can also clone and run it inside Raspi, but it's not recommended
```sh
git clone https://github.com/daflh/raspi-camera-stream.git
cd raspi-camera-stream
npm install
```

3. Launch the camera stream
```sh
node index.js <pi-ip-addr>
```
Replace \<pi-ip-addr\> using your Raspi IP address, like 192.168.10.123

4. Open [localhost:5050]()

### Bonus

You can also use ffmpeg instead of this shit lol
```sh
ffplay tcp://<pi-ip-addr>:<port> -vf "setpts=N/30" -fflags nobuffer -flags low_delay -framedrop
```
