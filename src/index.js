let entities;
let neat;
let foodStock = [];
let foodAmount = Food.stock();
let foodGrid;
let evaluationFrame = 300;
let frame = 0;
const mutation = [
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
];
function setup() {
    createCanvas(windowWidth, windowHeight).parent('field');
    neat = new neataptic.Neat(
        Entity.getInputNumber(), 2,
        null,
        {
            mutation,
            popsize: 20,
            mutationRate: 0.7,
            elitism: 2,
            network: new neataptic.architect.Perceptron(Entity.getInputNumber(), 8, 2)
        }
    );
    neat.mutate()
    //resetFood();
    entities = neat.population.map((brain) => new Entity(brain));
    drawGraph(entities[0].brain.graph(300, 500), '.draw');
    foodGrid = new FoodGrid(30);
}

const resetFood = () => {
    foodStock = [];
    for (let i = 0; i< foodAmount; i++) {
        foodStock.push(new Food())
    }
};

function draw(){
    frame++;
    if (frame === evaluationFrame) {
        frame = 0;

        drawGraph(entities[random(0, entities.length)].brain.graph(300, 500), '.draw');
    }
    clear();
    foodGrid.draw()
    foodStock.forEach(food => food.draw());
    const aliveEntities = entities.filter(entity => entity.alive);
    $("#alive").text(`Alive ${aliveEntities.length}`)

    if (!aliveEntities.length) {

        //resetFood();

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

        entities = newPopulation.map((brain) => new Entity(brain));
        neat.generation++;
        $("#generation").text(`Generation ${neat.generation +1}`)


    } else {
        aliveEntities.forEach(entity => {
            entity.update();
        });
    }

}


const calculateDistance = (a, b) => int(dist(a.x, a.y, b.x, b.y));
const detectCloseFood = (entity) => foodStock.filter(food => calculateDistance(entity, food) <= entity.smellDistance);
const detectCloseEntitiesNumber = (entity) => entities.filter(e => calculateDistance(entity, e) <= entity.smellDistance).length - 1;

const rotatePointAroundOrigin = (p, o, a) => ({
    x: Math.cos(a) * (p.x - o.x) - Math.sin(a) * (p.y - o.y) + o.x,
    y: Math.sin(a) * (p.x - o.x) + Math.cos(a) * (p.y - o.y) + o.y

});

const random = (min, max) => Math.floor(Math.random() * max) + min;
