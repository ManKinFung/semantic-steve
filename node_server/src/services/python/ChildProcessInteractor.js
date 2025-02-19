// Concrete implementation using Node’s child_process module

const { spawn } = require('child_process');
const PythonInteractor = require('./PythonInteractor');

class ChildProcessInteractor extends PythonInteractor {
  constructor(options = {}) {
    super();
    this.scriptPath = options.scriptPath || 'path/to/script.py';
  }

  send(data) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [this.scriptPath]);

      let output = '';
      pythonProcess.stdout.on('data', (chunk) => {
        output += chunk.toString();
      });

      pythonProcess.stderr.on('data', (err) => {
        reject(err.toString());
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python process exited with code ${code}`));
        }
        resolve(output);
      });

      // Send JSON data to Python via stdin
      pythonProcess.stdin.write(JSON.stringify(data));
      pythonProcess.stdin.end();
    });
  }
}

module.exports = ChildProcessInteractor;
