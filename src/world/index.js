class World {
    constructor(config = {}) {
        this.population = [];
        for (let i = 0; i < 1; i++) {
            this.population.push(new Entity())
        }
        this.eggs = [];
        this.totalEnergy = config.totalEnergy || rules.TOTAL_ENERGY_AMOUNT;
    }

    kill(entity) {
        this.population.splice(entity, 1);
        console.log(entity)
       // this.totalEnergy += entity.waste;
    }

    hatch(egg) {
        this.eggs.splice(egg, 1);
    }
}
