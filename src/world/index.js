class World {
    constructor(config = {}) {
        this.population = [];
        this.food = [];
        this.eggs = [];
        this.elapsedTime = 0;
        this.config = config;

        setInterval(this.countTime.bind(this), 1000);
    }


    countTime(){
        this.elapsedTime ++;
        const duration = moment.duration(this.elapsedTime, 'seconds');
        const formatted = duration.format("hh:mm:ss");

        this.population.forEach(entity => {
            entity.lifeTimeInSeconds++;
        });
        $('#elapsedTime').text("Time : " + formatted);
    }

    init() {
        const a = this.config.population ? this.config.population : rules.POPULATION_SIZE;
        for (let i = 0; i < a; i++) {
            this.population.push(new Entity());
        }
        for (let i = 0; i < 1000; i++) {
            this.food.push(new Food());
        }

        this.totalEnergy = this.config.totalEnergy || rules.TOTAL_ENERGY_AMOUNT;
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
