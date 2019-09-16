class Food {
    constructor() {
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);

        this.amount = random(Food.getMinMount(), Food.getMaxMount());
        this.radius = this.amount / 10;
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

    static getMaxMount() {
        return 25;
    }

    static getMinMount() {
        return 25;
    }
}
