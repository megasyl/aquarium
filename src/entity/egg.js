class Egg {
    constructor(parent, price) {
        // State
        this.x = parent.x;
        this.y = parent.y;

        this.waste = price;
        this.lifeTime = 0;
        this.parent = parent;

        this.id = random(0, 100000000);
    }

    update() {
        console.log(this.lifeTime)
        if (this.lifeTime >= rules.EGG_HATCHING_TIME) {
            world.hatch(this);
            console.log(world.eggs.indexOf(this))
            world.population.push(new Entity(this.parent, this.x, this.y));
        }
        this.lifeTime++;
        this.draw();
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Draw the body
        stroke(200, 255);
        strokeWeight(2);
        fill(127, 255);
        ellipse(0, 0, this.parent.genome.size / 4, this.parent.genome.size / 2);

        pop();
    }
}
