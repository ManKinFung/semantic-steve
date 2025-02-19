const ChildProcessInteractor = require('./ChildProcessInteractor');
const SocketIOInteractor = require('./SocketIOInteractor');

class PythonInteractorFactory {
  /**
   * Create a PythonInteractor instance based on the method.
   * @param {string} method - The interaction method ('childProcess' or 'socketIO').
   * @param {Object} options - Additional options specific to the method.
   * @returns {PythonInteractor}
   */
  static createInteractor(method, options = {}) {
    switch (method) {
      case 'childProcess':
        return new ChildProcessInteractor(options);
      case 'socketIO':
        return new SocketIOInteractor(options);
      default:
        throw new Error(`Unsupported interactor method: ${method}`);
    }
  }
}

module.exports = PythonInteractorFactory;
