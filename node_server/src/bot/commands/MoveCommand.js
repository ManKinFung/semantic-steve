/**
 * MoveCommand.js
 * 
 * This command encapsulates the logic for moving the bot to a specified target position.
 * It is intended to be used as part of a command queue in the SemanticSteve bot.
 *
 * Responsibilities:
 *  - Utilize the bot's pathfinding module to navigate to the target coordinates.
 *  - Monitor for errors during navigation and handle interruptions.
 *  - Provide an interrupt mechanism for higher priority actions (e.g., self-defense).
 *
 * Usage:
 *   const MoveCommand = require('./MoveCommand');
 *   const moveCmd = new MoveCommand(bot, { x: 100, y: 64, z: 200 });
 *   commandQueue.enqueue(moveCmd);
 */

const { goals } = require('mineflayer-pathfinder');

class MoveCommand {
  /**
   * Creates an instance of MoveCommand.
   * @param {object} bot - The Mineflayer bot instance.
   * @param {object} target - The target position {x, y, z} to move to.
   */
  constructor(bot, target) {
    this.bot = bot;
    this.target = target;
    this.interrupted = false;
  }

  /**
   * Executes the move command.
   * Uses the pathfinder plugin to navigate to the target coordinates.
   * The command is interruptible if a higher priority action occurs.
   */
  async execute() {
    console.log(`MoveCommand: Moving to position x: ${this.target.x}, y: ${this.target.y}, z: ${this.target.z}`);

    // Define the target goal using mineflayer-pathfinder's GoalBlock
    const targetGoal = new goals.GoalBlock(this.target.x, this.target.y, this.target.z);

    try {
      // Use the pathfinder's goto method to navigate to the target.
      // The timeout option is provided to prevent indefinite waiting.
      await this.bot.pathfinder.goto(targetGoal, { timeout: 60000 });
      
      if (this.interrupted) {
        console.log("MoveCommand: Move was interrupted before arrival.");
      } else {
        console.log("MoveCommand: Successfully arrived at the target position.");
      }
    } catch (err) {
      console.error(`MoveCommand: Error moving to target: ${err}`);
    }
  }

  /**
   * Interrupts the current move command.
   * This method is used to halt movement in favor of higher priority actions.
   */
  interrupt() {
    console.log("MoveCommand: Interrupting current move command.");
    this.interrupted = true;
    // Cancel the current pathfinder goal
    if (this.bot.pathfinder) {
      this.bot.pathfinder.stop();
    }
  }
}

module.exports = MoveCommand;
