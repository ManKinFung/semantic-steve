// Concrete implementation using Socket.IO client

const io = require('socket.io-client');
const PythonInteractor = require('./PythonInteractor');

class SocketIOInteractor extends PythonInteractor {
  constructor(options = {}) {
    super();
    // URL of the Python Socket.IO server
    this.url = options.url || 'http://localhost:4000';
    this.socket = io(this.url);
  }

  send(data) {
    return new Promise((resolve, reject) => {
      // Emit a message to the Python server
      this.socket.emit('message', data);

      // Listen for the response
      this.socket.once('response', (response) => {
        resolve(response);
      });

      // Handle connection errors
      this.socket.once('connect_error', (error) => {
        reject(error);
      });
    });
  }
}

module.exports = SocketIOInteractor;
