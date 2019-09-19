class Entity {
    constructor(parent) {
        this.genome = new Genome(parent);
        this.brain = new Brain(parent);

        // State
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.angle = 0;
        this.health = this.genome.minHealth;
        this.chrono = 0;
        this.lifeTime = 0;
        this.brainActivityClock = 0;

        this.output = {};
    }

    update() {
        if (this.health <= 0) {
            // Remove this entity from population
            entities.splice(entities.indexOf(this), 1);
        }

        const input = this.getInput();
        const output = this.brain.activate(input);
        this.setOutput(output);

        // Calculate the new direction
        this.xAcceleration = Math.cos(this.angle) * this.velocityFactor;
        this.yAcceleration = Math.sin(this.angle) * this.velocityFactor;

        // Calculate and limit the speed
        this.xVelocity += this.xAcceleration;
        this.yVelocity += this.yAcceleration;
        this.xVelocity = this.xVelocity > this.maxSpeed ? this.maxSpeed : this.xVelocity < -this.maxSpeed ? -this.maxSpeed : this.xVelocity;
        this.yVelocity = this.yVelocity > this.maxSpeed ? this.maxSpeed : this.yVelocity < -this.maxSpeed ? -this.maxSpeed : this.yVelocity;

        // Calculate new position
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // Limit position to width and height
        this.x = this.x >= windowWidth  ? windowWidth  : this.x <= 0 ? 0 : this.x;
        this.y = this.y >= windowHeight ? windowHeight : this.y <= 0 ? 0 : this.y;

        // Calculate rebound
        if(this.x === 0 || this.x === windowWidth) {
            this.xVelocity = -this.xVelocity;
            this.health -= 10;
            this.brain.score -= 10;
        }
        if(this.y === 0 || this.y === windowHeight) {
            this.yVelocity = -this.yVelocity;
            this.health -= 10;
            this.brain.score -= 10;
        }


        // Try to eat food, and loose health over time if not fed
        this.health -= 1 + createVector(this.xVelocity, this.yVelocity).mag() / 4;
        //if (output[2] < 0.5)
        this.eat();

        this.draw();
    }

    getInput() {
        //get the inputs !
        return [];
    }

    setOutput(output) {
        this.output.angle = output[0] * 2 * Math.PI;
        this.output.velocityFactor = output[1] * this.maxSpeed;
        this.output.wantToEat = output[2] < 0.5;
        this.output.wantToLay = output[3] < 0.5;

    }

    eat() {
        this.health -= 1;
        this.detectedFood.forEach(df => {
            if(collideCircleCircle(df.x,df.y,df.radius, this.x, this.y, this.size)) {
                this.health += df.amount;
                this.brain.score += 10 + 2 * df.amount;
                foodStock.splice(foodStock.indexOf(df), 1);
                foodStock.push(new Food());
            }
        });
    }

    draw() {
        // Calculate opacity byte depending on health
        this.opacity = (this.health * 255) / 1000;

        push();
        translate(this.x, this.y);

        // Draw the body
        stroke(200, this.opacity);
        strokeWeight(2);
        fill(127, this.opacity);
        ellipse(0, 0, this.size, this.size);

        // Draw the head line
        const velocityVector = createVector(this.xVelocity, this.yVelocity);
        rotate(velocityVector.heading());
        line(0,0,25,0);

        // Draw the smell area
        stroke(200, 255);
        strokeWeight(0.5);
        fill(127, 0);
        ellipse(0, 0, this.smellDistance * 2, this.smellDistance * 2);

        pop();


        push();
        translate(0, 0);

        this.detectedFood.forEach(df =>line(this.x,this.y, df.x,df.y));
        pop()
    }
}
