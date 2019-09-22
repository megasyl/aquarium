class World {
    constructor(config = {}) {
        this.population = [];
        this.food = [];
        this.eggs = [];
        this.elapsedTime = 0;
        this.config = config;

        this.stats = {
            display: false,
            chart: this.initGraph()
        };

        $("#stats").hide();

        setInterval(this.countTime.bind(this), 1000);
    }


    countTime(){
        const duration = moment.duration(this.elapsedTime, 'seconds');
        const formatted = duration.format("hh:mm:ss");
        this.stats.chart.data.datasets[0].data.push(this.population.length);
        this.stats.chart.data.datasets[1].data.push(this.food.length);
        this.stats.chart.data.labels.push(this.elapsedTime);
        this.stats.chart.update();

        this.population.forEach(entity => {
            entity.lifeTimeInSeconds++;
        });
        $('#elapsedTime').text("Time : " + formatted);
        this.elapsedTime ++;
    }

    initGraph() {
        return new Chart(document.getElementById("stats"), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    label: "Population",
                    borderColor: "#3e95cd",
                    fill: false
                }, {
                    data: [],
                    label: "Food",
                    borderColor: "#2ecd3c",
                    fill: false
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'World stats'
                }
            }
        });
    }

    showGraph() {
        if (!this.stats.display) {
            $("#stats").show();
            this.stats.display = true;
        } else {
            $("#stats").hide();
            this.stats.display = false;
        }
    }

    init() {
        const a = this.config.population ? this.config.population : rules.INITIAL_POPULATION_SIZE;
        for (let i = 0; i < a; i++) {
            this.population.push(new Entity());
        }
        for (let i = 0; i < rules.INITIAL_FOOD_COUNT; i++) {
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
