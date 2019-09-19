let world;
let selected;
let graphDrawSwitch;
function setup() {
    createCanvas(windowWidth, windowHeight).parent('field');
    world = new World({
        population: 1
    });
    console.log(world)
}

function draw() {
    clear();
    world.population.forEach(entity => entity.update());
    world.eggs.forEach(entity => entity.update());

    if (selected) {
        selected.drawUI();
        if (!graphDrawSwitch)
            drawGraph(selected.brain.graph(300, 500), '.draw');
        graphDrawSwitch = true;
    }
}

function mouseClicked() {
    selected = world.population.find(entity => collidePointCircle(mouseX, mouseY, entity.x, entity.y, entity.genome.size));
    graphDrawSwitch = false
}


