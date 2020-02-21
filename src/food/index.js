class Food {
    constructor(x, y, amount) {
        this.x = x || random(0, window.innerWidth);
        this.y = y || random(0, window.innerHeight);

        this.amount = amount || rules.INITIAL_FOOD_AMOUNT;

        this.radius = this.amount / 50;

        this.rigidBody = Bodies.circle(this.x, this.y, this.radius, {
            frictionAir: 1,
            collisionFilter: {
                category: bodyCategories.food
            },
            render: {
                fillStyle: 'yellow',
            }
        });
        this.rigidBody.individual = this;
        this.collisions = [];

    }

    update() { }

    draw() {
        push();
        translate(this.x, this.y);
        stroke(200, 255);
        strokeWeight(2);
        fill(255, 204, 0);
        ellipse(0, 0, this.radius, this.radius);
        pop();
    }
}
