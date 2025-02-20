/**
 * CommandQueue.js
 *
 * This module implements a command queue using the Command pattern.
 * It manages scheduling, executing, and interrupting commands (actions) for the bot.
 *
 * Usage:
 *   const CommandQueue = require('./CommandQueue');
 *   const commandQueue = new CommandQueue();
 *   commandQueue.enqueue(someCommand);
 */

class CommandQueue {
    constructor() {
      this.queue = [];
      this.currentCommand = null;
      this.processing = false;
    }
  
    /**
     * Enqueues a new command.
     * @param {object} command - A command object with an execute() method.
     */
    enqueue(command) {
      this.queue.push(command);
      this.processQueue();
    }
  
    /**
     * Processes the command queue.
     * If no command is currently running, it executes the next command in the queue.
     */
    async processQueue() {
      if (this.processing) return;
      if (this.currentCommand || this.queue.length === 0) return;
      this.processing = true;
      this.currentCommand = this.queue.shift();
      try {
        await this.currentCommand.execute();
      } catch (err) {
        console.error("CommandQueue: Error executing command", err);
      }
      this.currentCommand = null;
      this.processing = false;
      // Process the next command if available
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  
    /**
     * Interrupts the current command execution and clears the queue.
     * Useful for high-priority actions such as self-defense.
     */
    interrupt() {
      if (this.currentCommand && typeof this.currentCommand.interrupt === 'function') {
        console.log("CommandQueue: Interrupting current command.");
        this.currentCommand.interrupt();
      }
      this.queue = [];
    }
  }
  
  module.exports = CommandQueue;
  