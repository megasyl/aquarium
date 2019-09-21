let world;
let selected;
let graphDrawSwitch;
function setup() {
    createCanvas(windowWidth, windowHeight).parent('field');
    world = new World({
        population: 5
    });
    world.init();
}


function draw() {
    clear();
    world.population.forEach(entity => entity.update());
    world.food.forEach(food => food.update());
    world.eggs.forEach(entity => entity.update());
    $('#population').text('Population : ' + world.population.length);
    $('#food').text('Food : ' + world.food.length);


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


