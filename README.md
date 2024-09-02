# raspi-camera-stream

Stream your Raspberry Pi camera over the network and view it within your local browser in "realtime" (if your WiFi's good enough).

### How to use

1. Run the following command on Raspberry Pi
```sh
# a. Raspi OS based on Debian Bookworm or later
rpicam-vid -t 0 --inline --listen -o tcp://0.0.0.0:45000 --codec mjpeg
# b. Raspi OS based on Debian Bullseye
libcamera-vid -t 0 --inline --listen -o tcp://0.0.0.0:45000 --codec mjpeg
# c. Raspi OS based on Debian Buster or earlier
raspivid -t 0 -n -l -o tcp://0.0.0.0:45000 -cd MJPEG
```
You can also test the program using your local computer webcam by running the `opencv-mjpeg-server.py` script.

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
Replace `<pi-ip-addr>` using your Raspi IP address

4. Open [localhost:5050](http://localhost:5050)

### Bonus

You can also use ffmpeg instead of this shit lol
```sh
ffplay tcp://<pi-ip-addr>:<port> -vf "setpts=N/30" -fflags nobuffer -flags low_delay -framedrop
```
