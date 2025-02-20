const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

class SemanticSteve {
    constructor(options) {
        this.bot = mineflayer.createBot({
            host: options.host || 'localhost',
            port: options.port || 25565,
            username: options.username || 'SemanticSteve'
        });

        this.hostileMobs = [
            'zombie', 'skeleton', 'creeper', 'spider', 'witch', 'enderman',
            'slime', 'blaze', 'ghast', 'phantom', 'pillager', 'vindicator',
            'evoker', 'ravager', 'piglin', 'hoglin', 'zombified_piglin'
        ];

        this.bot.loadPlugin(pathfinder);
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.bot.once('spawn', () => {
            console.log(`${this.bot.username} has joined the world!`);
            this.setupPathfinder();
            this.startMonitoring();
        });

        this.bot.on('chat', (username, message) => this.handleChat(username, message));
        this.bot.on('health', () => this.monitorHealth());
        this.bot.on('death', () => console.log(`${this.bot.username} died!`));
        this.bot.on('error', err => console.error(`Error: ${err}`));
    }

    setupPathfinder() {
        const movements = new Movements(this.bot);
        this.bot.pathfinder.setMovements(movements);
    }

    startMonitoring() {
        setInterval(() => this.checkForHostileMobs(), 5000);
    }

    checkForHostileMobs() {
        const mobs = Object.values(this.bot.entities).filter(entity =>
            entity.type === 'mob' && this.hostileMobs.includes(entity.name)
        );

        if (mobs.length > 0) {
            console.log(`⚠️ Detected ${mobs.length} hostile mob(s)!`);
            this.handleHostileMobs(mobs);
        }
    }

    handleHostileMobs(mobs) {
        for (const mob of mobs) {
            console.log(`Handling ${mob.name} at ${mob.position}`);

            if (mob.name === 'creeper') {
                this.avoidMob(mob);
            } else if (mob.name === 'zombie' || mob.name === 'skeleton') {
                this.attackMob(mob);
            }
        }
    }

    avoidMob(mob) {
        const awayVector = this.bot.entity.position.minus(mob.position).scaled(2);
        const safePosition = this.bot.entity.position.plus(awayVector);
        this.bot.pathfinder.setGoal(new goals.GoalBlock(safePosition.x, safePosition.y, safePosition.z));
        console.log('🟢 Moving away from Creeper!');
    }

    attackMob(mob) {
        if (this.bot.canSeeBlock(mob.position)) {
            this.bot.attack(mob);
            console.log(`⚔️ Attacking ${mob.name}!`);
        }
    }

    handleChat(username, message) {
        if (username === this.bot.username) return;
        console.log(`${username}: ${message}`);

        if (message.toLowerCase() === 'hi') {
            this.bot.chat(`Hello ${username}!`);
        } else if (message.toLowerCase() === 'status') {
            this.reportStatus();
        }
    }

    reportStatus() {
        const health = this.bot.health.toFixed(1);
        const food = this.bot.food.toFixed(1);
        this.bot.chat(`Health: ${health}, Hunger: ${food}`);
    }

    monitorHealth() {
        if (this.bot.health < 10) {
            console.log('⚠️ Low health detected! Finding safety...');
        }
    }
}

// Start the bot
new SemanticSteve({
    host: 'localhost', 
    port: 25565, 
    username: 'SemanticSteve'
});
