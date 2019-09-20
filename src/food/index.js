class Food {
    constructor(amount) {
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);

        this.amount = amount || 20;
        this.radius = this.amount / 10;
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
