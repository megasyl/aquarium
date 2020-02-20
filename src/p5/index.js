//let world;
let selected;
let graphDrawSwitch;
function setup() {
    /*createCanvas(windowWidth, windowHeight).parent('field');
    world = new World();
    world.init();*/
}


function draw() {
    return;
    clear();
    world.population.forEach(entity => entity.update());
    world.food.forEach(food => food.update());
    world.eggs.forEach(entity => entity.update());
    $('#population').text('Population : ' + world.population.length);
    $('#food').text('Food : ' + world.food.length);

    if (selected) {
        $('#entityTitle').val('Entity');
        selected.drawUI();
        if (!graphDrawSwitch)
            drawGraph(selected.brain.graph(300, 500), '.draw');
        graphDrawSwitch = true;

    } else {
        selected = null;
        $('#entityTitle').text('Entity');
        if (!graphDrawSwitch)
            $('.draw').html('');
        graphDrawSwitch = true;
    }
}

function mouseClicked() {
    selected = world.population.find(entity => collidePointCircle(mouseX, mouseY, entity.x, entity.y, entity.genome.size));
    if (!selected && rules.ALLOW_ENTITY_SPAWNING) {
        world.population.push(new Entity(undefined, mouseX, mouseY))
    }
    graphDrawSwitch = false
}


