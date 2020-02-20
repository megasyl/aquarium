class World {
    constructor(config = {}) {
        this.population = [];
        this.food = [];
        this.eggs = [];
        this.elapsedTime = 0;
        this.config = config;

        this.stats = {
            display: false,
            chart: null,
            food: [],
            population: []
        };
        this.isModalDisplayed = false;

        $("#stats").hide();
        $("#parameters").hide();

        setInterval(this.countTime.bind(this), 1000);
    }


    countTime(){
        const duration = moment.duration(this.elapsedTime, 'seconds');
        const formatted = duration.format("hh:mm:ss");
        if (this.stats.display) {
            this.stats.chart.series[0].addPoint(this.population.length);
            this.stats.chart.series[1].addPoint(this.food.length);
        }
        this.stats.food.push(this.food.length);
        this.stats.population.push(this.population.length);

        this.population.forEach(entity => {
            entity.lifeTimeInSeconds++;
        });
        $('#elapsedTime').text("Time : " + formatted);
        this.elapsedTime ++;
    }

    initGraph() {
        return Highcharts.chart('stats', {

            chart: {
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                backgroundColor: 'transparent',
                gridLineWidth: 0
            },

            boost: {
                useGPUTranslations: true
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                tickPositions: [],
            },


            title: {
                text: 'World stats'
            },

            subtitle: {
                text: 'Food and population over time'
            },

            tooltip: {
                valueDecimals: 2
            },

            series: [{
                data: this.stats.population,
                lineWidth: 1,
                name: "Population",
                color: "#3685ff"
            }, {
                data: this.stats.food,
                name: "Food",
                color: "#00FF00",
                lineWidth: 1
            }]

        });
    }

    showModal() {
        if (!this.isModalDisplayed) {
            $("#parameters").hide();
            this.isModalDisplayed = true;
        } else {
            $("#parameters").show();
            delete this.stats.chart;
            this.isModalDisplayed = false;
        }
    }

    showGraph() {
        if (!this.stats.display) {
            console.log(this.stats.population)
            this.stats.chart = this.initGraph();
            $("#stats").show();
            this.stats.display = true;
        } else {
            $("#stats").html('');
            $("#stats").hide();
            delete this.stats.chart;
            this.stats.display = false;
        }
    }

    update() {
        this.population.forEach(entity => entity.update());
        this.food.forEach(food => food.update());
        this.eggs.forEach(entity => entity.update());
        Engine.update(this.physics.engine, 1000/60, 1);

        requestAnimationFrame(() => this.update());
        //this.update()
    }

    init() {
        this.physics = new Physics();
        const a = this.config.population ? this.config.population : rules.INITIAL_POPULATION_SIZE;
        for (let i = 0; i < a; i++) {
            const entity = new Entity();
            this.population.push(entity);
            this.physics.add(entity.rigidBody);
        }
        for (let i = 0; i < rules.INITIAL_FOOD_COUNT; i++) {
            let food = new Food();
            this.food.push(food);
            this.physics.add(food.rigidBody);
        }

        this.totalEnergy = this.config.totalEnergy || rules.TOTAL_ENERGY_AMOUNT;
        this.update();
    }

    digest(food) {
        this.physics.remove(food.rigidBody)
        this.food.splice(this.food.indexOf(food), 1)
    }

    kill(entity) {
        this.physics.remove(this.population[entity].rigidBody)
        this.population.splice(entity, 1);
       // this.totalEnergy += entity.waste;
    }

    hatch(egg) {
        this.eggs.splice(egg, 1);
    }

    onCollisionStart(bodyA, bodyB) {
        bodyA.collisions.push(bodyB);
        bodyB.collisions.push(bodyA);
    }

    onCollisionEnd(bodyA, bodyB) {
        bodyA.collisions = bodyA.collisions.filter(c => c !== bodyB);
        bodyB.collisions = bodyB.collisions.filter(c => c !== bodyA);
    }
}

const world = new World();

$( document ).ready(() => {

    world.init()
});
