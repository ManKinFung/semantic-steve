// Abstract/base class (defines the interface)

class PythonInteractor {
    /**
     * Send data to the Python process/service.
     * @param {Object} data - The data to send.
     * @returns {Promise<any>} - A promise that resolves with the response.
     */
    send(data) {
      throw new Error('Method "send" must be implemented.');
    }
  }
  
  module.exports = PythonInteractor;
  