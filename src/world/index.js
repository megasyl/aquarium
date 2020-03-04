class World {
    constructor(config = {}) {
        this.population = [];
        this.food = [];
        this.eggs = [];
        this.elapsedTime = 0;
        this.config = config;
        this.lastUpdateTime = 0;

        this.stats = {
            display: false,
            chart: null,
            food: [],
            population: []
        };
        this.isModalDisplayed = true;


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


    async update() {
        await Promise.all(this.population.map(entity => entity.update()));
        this.food.forEach(food => food.update());
        this.eggs.forEach(entity => entity.update());
        this.camera.update();

        Engine.update(this.physics.engine, 1000/60, 1);

        requestAnimationFrame(() => this.update());

        $('#population').text('Population : ' + this.population.length);
        $('#food').text('Food : ' + this.food.length);
        //this.update()
    }

    init() {
        $("#stats").hide();
        $("#parameters").hide();

        this.physics = new Physics();
        this.camera = new Camera(this.physics);
        const a = this.config.population ? this.config.population : rules.INITIAL_POPULATION_SIZE;
        for (let i = 0; i < a; i++) {
            this.birth();
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
        this.physics.remove(food.rigidBody);
        this.food.splice(this.food.indexOf(food), 1)
    }

    birth(entity) {
        if (!entity) entity = new Entity();
        this.population.push(entity);
        this.physics.add(entity.rigidBody);
        this.physics.add(entity.foodDetector);
        this.physics.add(entity.foodDetectorConstraint);
    }

    spawnEgg(egg) {
        this.eggs.push(egg);
        this.physics.add(egg.rigidBody);
    }

    kill(entity) {
        if (entity instanceof Entity) {
            this.physics.remove(entity.foodDetectorConstraint);
            delete entity.foodDetectorConstraint;
            this.physics.remove(entity.foodDetector);
            delete entity.foodDetector;
            this.population.splice(this.population.indexOf(entity), 1);
        }
        if (entity instanceof Egg) {
            this.eggs.splice(this.eggs.indexOf(entity), 1);
        }
        this.physics.remove(entity.rigidBody);
        delete entity.rigidBody;
        // this.totalEnergy += entity.waste;
    }

    hatch(egg) {
        this.eggs.splice(egg, 1);
    }

    onCollisionStart(pairs) {
        pairs.forEach(({ bodyA, bodyB }) => {
            const bodyACategory = bodyA.collisionFilter.category;
            const bodyBCategory = bodyB.collisionFilter.category;
            const individualA = bodyA.individual;
            const individualB = bodyB.individual;

            switch (bodyACategory) {
                case bodyCategories.foodDetector:
                    individualA.detections.food.push(bodyB.individual);
                    return;
                case bodyCategories.entity:
                    if (bodyBCategory === bodyCategories.food)
                        individualA.collisions.food.push(bodyB.individual);
                    return;
                case bodyCategories.wall:
                    return;
            }
            switch (bodyBCategory) {
                case bodyCategories.foodDetector:
                    individualB.detections.food.push(bodyA.individual);
                    return;
                case bodyCategories.entity:
                    if (bodyACategory === bodyCategories.food)
                    individualB.collisions.food.push(bodyA.individual);
                    return;
                case bodyCategories.wall:
                    return;
            }
        });
    }

    onCollisionEnd(pairs) {
        pairs.forEach(({ bodyA, bodyB }) => {
            const bodyACategory = bodyA.collisionFilter.category;
            const bodyBCategory = bodyB.collisionFilter.category;
            const individualA = bodyA.individual;
            const individualB = bodyB.individual;

            switch (bodyACategory) {
                case bodyCategories.foodDetector:
                    individualA.detections.food = individualA.detections.food.filter(c => c !== individualB);
                    return;
                case bodyCategories.entity:
                    individualA.collisions.food = individualA.collisions.food.filter(c => c !== individualB);
                    return;
            }
            switch (bodyBCategory) {
                case bodyCategories.foodDetector:
                    individualB.detections.food = individualB.detections.food.filter(c => c !== individualA);
                    return;
                case bodyCategories.entity:
                    individualB.collisions.food = individualB.collisions.food.filter(c => c !== individualA);
                    return;
            }
        });

    }
}

const world = new World();

$( document ).ready(() => {

    world.init()
});
