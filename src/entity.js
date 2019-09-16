class Entity {
    constructor(brain, i) {
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.maxSpeed = 1;
        this.angle = 0;

        this.maxHealth = 1000;
        this.health = this.maxHealth;
        this.opacity = 255;

        this.brain = brain;
        this.i = i;

        this.size = 25;
        this.smellDistance = 100;

        this.detectedFood;
        this.alive = true;
    }

    update() {
        if (this.health <= 0) {
            this.detectedFood = [];
            this.alive = false;
            return;
        }

        const input = this.detect();
        const output = this.brain.activate(input);
        //console.log("ENTITY", this.i, input, output)
        this.angle = output[0] * Math.PI;
        this.velocityFactor = output[1] * 0.2;

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
        if(this.x === 0 || this.x === windowWidth) this.xVelocity = -this.xVelocity;
        if(this.y === 0 || this.y === windowHeight) this.yVelocity = -this.yVelocity;

        // Calculate opacity byte depending on health
        this.opacity = (this.health * 255) / 1000;

        // Try to eat food, and loose health over time if not fed
        this.health -= 1;
        this.eat();


        this.draw();
    }

    detect() {
        // Normalize an input over a value to get a ratio
        // Seems to help neural network to converge faster ..
        const normalize = (value, over) => value / over;

        // Zero padding the inputs for food detection
        const inputs = new Array(Entity.getInputNumber()).fill(0);

        this.detectedFood =  detectCloseFood(this);
        const foodInputs = this.detectedFood.reduce((acc, cur) => {
            acc.push(normalize(cur.x, windowWidth));
            acc.push(normalize(cur.y, windowHeight));
            acc.push(angleToPoint(this.x, this.y, cur.x, cur.y) / (Math.PI * 2));
            acc.push(normalize(cur.amount - Food.getMinMount(), Food.getMaxMount()));
            return acc;
        }, []);

        inputs[0] = normalize(this.health, this.maxHealth);
        inputs[1] = normalize(this.x, windowWidth);
        inputs[2] = normalize(this.y, windowHeight);
        inputs[3] = normalize(this.xVelocity, this.maxSpeed);
        inputs[4] = normalize(this.yVelocity, this.maxSpeed);

        for (let i = 0; i < foodInputs.length; i++) {
            inputs[i+Entity.getStaticInputNumber()] = foodInputs[i];
        }

        return inputs;
    }

    eat() {
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

    reset() {
        this.x = random(0, windowWidth);
        this.y = random(0, windowHeight);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.angle = 0;

        this.health = this.maxHealth;
        this.opacity = 255;

        this.detectedFood = [];
        this.alive = true;
    }

    static getStaticInputNumber() {
       return 5;
    }

    // For zero padding
    // 3 food properties * 10 max food detected
    static getVariableInputNumber() {
        return 4 * 6;
    }

    static getInputNumber() {
        return Entity.getStaticInputNumber() + Entity.getVariableInputNumber();
    }
}
