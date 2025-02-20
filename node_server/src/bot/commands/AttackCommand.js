/**
 * AttackCommand.js
 * 
 * This command encapsulates the logic for attacking a hostile mob.
 * It is intended to be used as part of a command queue in the SemanticSteve bot.
 *
 * Responsibilities:
 *  - Auto-equip the best available gear before engaging.
 *  - Chase the mob if it's out of attack range.
 *  - Perform repeated attacks until the mob is neutralized or the command is interrupted.
 *  - Provide an interrupt mechanism to stop the attack (e.g., when a higher priority threat is detected).
 *
 * Usage:
 *   const AttackCommand = require('./AttackCommand');
 *   const attackCmd = new AttackCommand(bot, mob);
 *   commandQueue.enqueue(attackCmd);
 */

class AttackCommand {
    /**
     * Creates an instance of AttackCommand.
     * @param {object} bot - The Mineflayer bot instance.
     * @param {object} mob - The target mob entity.
     */
    constructor(bot, mob) {
      this.bot = bot;
      this.mob = mob;
      this.interrupted = false;
    }
  
    /**
     * Executes the attack command.
     * The command auto-equips best gear, chases the mob if needed,
     * and attacks in a loop until the mob is defeated or the command is interrupted.
     */
    async execute() {
      console.log(`AttackCommand: Initiating attack on ${this.mob.name}`);
      
      // Auto-equip the best gear (implementation specific)
      this.equipBestGear();
  
      try {
        // Continue attacking until the mob is no longer valid or the command is interrupted.
        while (this.mob && this.mob.isValid && !this.interrupted) {
          // Check if the mob is within attack range.
          if (this.bot.entity.position.distanceTo(this.mob.position) > 3) {
            await this.moveToMob();
          }
          // Attack the mob.
          this.bot.attack(this.mob);
          console.log(`AttackCommand: Attacking ${this.mob.name}...`);
          
          // Wait briefly before the next attack cycle.
          await this.sleep(1000);
        }
        
        if (this.interrupted) {
          console.log("AttackCommand: Attack was interrupted.");
        } else {
          console.log(`AttackCommand: Finished attacking ${this.mob.name}.`);
        }
      } catch (err) {
        console.error(`AttackCommand error: ${err}`);
      }
    }
  
    /**
     * Interrupts the current attack command.
     * This method can be called by higher-priority modules to halt the current action.
     */
    interrupt() {
      console.log(`AttackCommand: Interrupting attack on ${this.mob.name}.`);
      this.interrupted = true;
    }
  
    /**
     * Equips the best available gear for attacking.
     * This is a stub method – implement gear selection logic as needed.
     */
    equipBestGear() {
      console.log(`AttackCommand: Equipping best gear for attacking ${this.mob.name}.`);
      // TODO: Implement logic to choose and equip the best gear from the bot's inventory.
    }
  
    /**
     * Moves the bot closer to the target mob.
     * This stub uses a simple delay to simulate movement and should be replaced with
     * proper pathfinding (e.g., using mineflayer-pathfinder).
     */
    async moveToMob() {
      console.log(`AttackCommand: Moving closer to ${this.mob.name}...`);
      // TODO: Integrate with the bot's pathfinder to navigate toward the mob.
      // Example (if using mineflayer-pathfinder):
      // await this.bot.pathfinder.goto(new GoalNear(this.mob.position.x, this.mob.position.y, this.mob.position.z, 1));
      
      // For now, simulate movement delay.
      await this.sleep(500);
    }
  
    /**
     * Utility function to pause execution for a given duration.
     * @param {number} ms - Milliseconds to sleep.
     * @returns {Promise}
     */
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  
  module.exports = AttackCommand;
  