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

        $("#stats").hide();

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
