class Egg {
    constructor(parent, price) {
        // State
        this.x = parent.rigidBody.position.x + parent.genome.size + 1;
        this.y = parent.rigidBody.position.y;

        this.lifeTime = 0;
        this.parent = parent;
        this.rigidBody = Bodies.circle(this.x, this.y, 1, { frictionAir: 1,
            collisionFilter: {
                category: bodyCategories.egg
            }
        });
    }

    async update() {
        if (this.lifeTime >= rules.EGG_HATCHING_TIME) {
            world.birth(new Entity(this.parent, this.x, this.y));
            world.kill(this)
            delete this;
        } else {
            this.lifeTime++;
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Draw the body
        stroke(200, 255);
        strokeWeight(2);
        fill(127, 255);
        ellipse(0, 0, this.parent.genome.size / 3, this.parent.genome.size / 2);

        pop();
    }
}
