let entities;
let neat;
let foodStock = [];
let foodAmount = Food.stock();

function setup() {
    createCanvas(windowWidth, windowHeight).parent('field');

    neat = new neataptic.Neat(
        Entity.getInputNumber(), 2,
        null,
        {
            mutation: [
                neataptic.methods.mutation.ADD_NODE,
                neataptic.methods.mutation.SUB_NODE,
                neataptic.methods.mutation.ADD_CONN,
                neataptic.methods.mutation.SUB_CONN,
                neataptic.methods.mutation.MOD_WEIGHT,
                neataptic.methods.mutation.MOD_BIAS,
                neataptic.methods.mutation.MOD_ACTIVATION,
                neataptic.methods.mutation.ADD_GATE,
                neataptic.methods.mutation.SUB_GATE,
                neataptic.methods.mutation.ADD_SELF_CONN,
                neataptic.methods.mutation.SUB_SELF_CONN,
                neataptic.methods.mutation.ADD_BACK_CONN,
                neataptic.methods.mutation.SUB_BACK_CONN
            ],
            popsize: 10,
            mutationRate: 0.3,
            elitism: 1,
            network: new neataptic.architect.Perceptron(Entity.getInputNumber(),
                3, 5, 3,
                2)
        }
    );
    resetFood();
    entities = neat.population.map((brain, i) => new Entity(brain, i));
    drawGraph(entities[0].brain.graph(300, 500), '.draw');
}

function draw(){
    clear();
    foodStock.forEach(food => food.draw());

    const aliveEntities = entities.filter(entity => entity.alive);
    $("#alive").text(`Alive ${aliveEntities.length}`)

    if (!aliveEntities.length) {

        resetFood();

        neat.sort();
        const newPopulation = [];

        // Elitism
        for(let i = 0; i < neat.elitism; i++){
            newPopulation.push(neat.population[i]);
        }

        // Breed the next individuals
        for(let i = 0; i < neat.popsize - neat.elitism; i++){
            newPopulation.push(neat.getOffspring());
        }

        neat.mutate();

        entities = entities.map((entity, i) => {
            entity.brain = newPopulation[i];
            entity.reset();
            return entity;
        });
        neat.generation++;
        $("#generation").text(`Generation ${neat.generation +1}`)

        drawGraph(entities[0].brain.graph(300, 500), '.draw');
    } else {
        aliveEntities.forEach(entity => {
            entity.update();
        });
    }

}

const resetFood = () => {
    foodStock = [];
    for (let i = 0; i< foodAmount; i++) {
        foodStock.push(new Food())
    }
};

const calculateDistance = (a, b) => int(dist(a.x, a.y, b.x, b.y));
const detectCloseFood = (entity) => foodStock.filter(food => calculateDistance(entity, food) <= entity.smellDistance);

/** Get the angle from one point to another */
const angleToPoint = (x1, y1, x2, y2) => {
    const d = dist(x1, y1, x2, y2);
    const dx = (x2-x1) / d;
    const dy = (y2-y1) / d;

    let a = Math.acos(dx);
    a = dy < 0 ? 2 * Math.PI - a : a;
    return a;
};

const random = (min, max) => Math.floor(Math.random() * max) + min;
