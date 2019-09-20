class World {
    constructor(config = {}) {
        this.population = [];
        this.food = [];
        this.eggs = [];

        const a = config.population ? config.population : rules.POPULATION_SIZE;
        for (let i = 0; i < a; i++) {
            this.population.push(new Entity());
        }
        for (let i = 0; i < 1500; i++) {
            this.food.push(new Food());
        }

        this.maxDist = Math.sqrt(Math.pow(windowWidth, 2), Math.pow(windowHeight, 2));

        this.totalEnergy = config.totalEnergy || rules.TOTAL_ENERGY_AMOUNT;
    }

    digest(food) {
        this.food.splice(food, 1);
        this.food.push(new Food());
        // this.totalEnergy += entity.waste;
    }

    kill(entity) {
        this.population.splice(entity, 1);
       // this.totalEnergy += entity.waste;
    }

    hatch(egg) {
        this.eggs.splice(egg, 1);
    }
}
