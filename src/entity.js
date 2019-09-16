class Entity {
    constructor(brain) {
        this.x = 0;
        this.y = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.maxSpeed = 5;
        this.angle = 0;

        this.health = 1000;
        this.opacity = 255;

        this.brain = brain;
    }

    update() {
        const input = this.detect();
        const output = this.brain.activate(input);
        this.angle = output[0] + 2 * Math.PI;
        this.velocityFactor = output[1] * 0.8;

        // Calculate the new direction
        this.xAcceleration = Math.cos(this.angle) * this.velocityFactor;
        this.yAcceleration = Math.sin(this.angle) * this.velocityFactor;

        // Calculate and limit the speed
        this.xVelocity += this.xAcceleration;
        this.yVelocity += this.yAcceleration;
        this.xVelocity = this.xVelocity > this.maxSpeed ? this.maxSpeed : this.xVelocity < -this.maxSpeed ? -this.maxSpeed : this.xVelocity;
        this.yVelocity = this.yVelocity > this.maxSpeed ? this.maxSpeed : this.yVelocity < -this.maxSpeed ? -this.maxSpeed : this.yVelocity;

        //Calculate new position
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // Limit position to width and height
        this.x = this.x >= WIDTH  ? WIDTH  : this.x <= 0 ? 0 : this.x;
        this.y = this.y >= HEIGHT ? HEIGHT : this.y <= 0 ? 0 : this.y;

        // Calculate rebound
        if(this.x === 0 || this.x === WIDTH) this.xVelocity = -this.xVelocity;
        if(this.y === 0 || this.y === HEIGHT) this.yVelocity = -this.yVelocity;

        // Calculate opacity byte depending on health
        this.opacity = (this.health * 255) / 1000;
    }

    detect() {

    }

    fitness() {

    }

    draw() {
        stroke(200, this.opacity);
        strokeWeight(2);
        fill(127, this.opacity);

        ellipse(0, 0, 5, 5);
        line(0,0,25,0);
    }


}
