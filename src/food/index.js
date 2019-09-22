class Food {
    constructor(x, y, amount) {
        this.x = x || random(0, windowWidth);
        this.y = y || random(0, windowHeight);

        this.amount = amount || rules.INITIAL_FOOD_AMOUNT;
        this.radius = this.amount / 20;
    }

    update() {
        this.draw();
    }

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
