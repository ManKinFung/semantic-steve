/**
 * PathfindingModule.js
 * 
 * This module provides smart pathfinding functionality for the SemanticSteve bot.
 * It uses a strategy pattern to choose the best navigation algorithm based on the environment.
 *
 * Responsibilities:
 *  - Provide an interface to navigate to arbitrary coordinates.
 *  - Select appropriate strategies for navigating into structures, exploring, or exiting structures.
 *  - Allow easy extension for advanced behaviors like auto-digging or bridging.
 *
 * Usage:
 *   const PathfindingModule = require('./PathfindingModule');
 *   const pathfinder = new PathfindingModule(bot);
 *   await pathfinder.navigateTo({ x: 100, y: 64, z: 200 });
 */

const { goals } = require('mineflayer-pathfinder');

class PathfindingModule {
  /**
   * Constructs a new PathfindingModule.
   * @param {object} bot - The Mineflayer bot instance.
   */
  constructor(bot) {
    this.bot = bot;
    // Ensure the bot has the necessary pathfinder movements set up
    const { Movements } = require('mineflayer-pathfinder');
    const movements = new Movements(bot);
    this.bot.pathfinder.setMovements(movements);
  }

  /**
   * Navigates the bot to the specified target using an appropriate strategy.
   * @param {object} target - The target position {x, y, z}.
   */
  async navigateTo(target) {
    const strategy = this.chooseStrategy(target);
    await strategy.navigateTo(target);
  }

  /**
   * Chooses a pathfinding strategy based on the target and environment.
   * @param {object} target - The target position {x, y, z}.
   * @returns {object} An instance of a navigation strategy.
   */
  chooseStrategy(target) {
    // Dummy logic: if the target y is below a threshold, assume it’s inside a structure.
    if (this.isInsideStructure(target)) {
      return new StructureNavigationStrategy(this.bot);
    } else {
      return new ExplorationStrategy(this.bot);
    }
  }

  /**
   * Determines if the target is inside a structure.
   * (Placeholder logic—replace with environment-specific detection.)
   * @param {object} target - The target position.
   * @returns {boolean} True if target is likely inside a structure.
   */
  isInsideStructure(target) {
    // Example: if y is less than 70, assume an indoor area
    return target.y < 70;
  }
}

/**
 * ExplorationStrategy
 * Uses the basic pathfinder navigation for open exploration.
 */
class ExplorationStrategy {
  constructor(bot) {
    this.bot = bot;
    this.goals = require('mineflayer-pathfinder').goals;
  }

  async navigateTo(target) {
    console.log("ExplorationStrategy: Navigating to target", target);
    const targetGoal = new this.goals.GoalBlock(target.x, target.y, target.z);
    try {
      await this.bot.pathfinder.goto(targetGoal, { timeout: 60000 });
      console.log("ExplorationStrategy: Arrived at target.");
    } catch (err) {
      console.error("ExplorationStrategy: Error during navigation", err);
    }
  }
}

/**
 * StructureNavigationStrategy
 * A specialized strategy for navigating within or out of structures.
 */
class StructureNavigationStrategy {
  constructor(bot) {
    this.bot = bot;
    this.goals = require('mineflayer-pathfinder').goals;
  }

  async navigateTo(target) {
    console.log("StructureNavigationStrategy: Navigating inside structure to", target);
    const targetGoal = new this.goals.GoalBlock(target.x, target.y, target.z);
    try {
      await this.bot.pathfinder.goto(targetGoal, { timeout: 60000 });
      console.log("StructureNavigationStrategy: Arrived at target.");
    } catch (err) {
      console.error("StructureNavigationStrategy: Error during navigation", err);
    }
  }
}

module.exports = PathfindingModule;
