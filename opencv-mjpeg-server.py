import socket
import threading
import cv2

HOST = '127.0.0.1'
PORT = 45000

camera = cv2.VideoCapture(0)

def handle_client(conn, addr):
  print('Connected by', addr)
  
  while True:
    success, frame = camera.read()
    if not success:
      print('Camera failed to read')
      camera.release()
      break
    
    ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
    frame_bytes = buffer.tobytes()
    conn.sendall(frame_bytes)

def main():
  with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print('Server listening on port', PORT)

    try:
      while True:
        conn, addr = s.accept()
        thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.start()
    except KeyboardInterrupt:
      print("Exiting...")
      s.close()
      camera.release()

if __name__ == '__main__':
  main()
