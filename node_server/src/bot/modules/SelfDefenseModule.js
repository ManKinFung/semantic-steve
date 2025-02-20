class SelfDefenseModule {
    constructor(bot, combatModule) {
        this.bot = bot;
        this.combatModule = combatModule;
        // Subscribe to hostile mob events (using a simple event emitter or observer system)
        this.bot.on('hostileMobDetected', (mobs) => this.handleThreat(mobs));
    }
    
    handleThreat(mobs) {
        // Save current state (using Memento, if desired)
        this.bot.saveState();  // pseudocode for memento
        
        // Interrupt current command and switch state to SelfDefense
        this.bot.commandQueue.interrupt();
        // Use combat module to handle threats
        mobs.forEach(mob => this.combatModule.attackMob(mob));
        
        // After threat neutralized, restore previous state
        this.bot.restoreState();
    }
}
