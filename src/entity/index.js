class Entity {
    constructor(parent, x, y) {
        this.genome = new Genome(parent);
        this.brain = Brain(parent);

        // State
        this.x = x || random(0, windowWidth);
        this.y = y || random(0, windowHeight);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.health = this.genome.minHealth;
        this.chrono = 0;
        this.lifeTime = 0;
        this.brainActivityClock = 0;
        this.waste = 0;

        this.closeFood = [];

        this.output = {
            angle: 0,
            velocityFactor: 0,
            wantToEat: false,
            wantToLay: false,
            resetChrono: false
        };

    }

    update() {
        if (this.health <= 0 || this.lifeTime >= this.genome.maxLifeTime) {
            delete this;
            return world.kill(world.population.indexOf(this));
        }

        const input = this.getInput();
        //console.log(input)
        const output = this.brain.activate(input);
        this.setOutput(output);

        if (this.output.resetChrono) {
            this.chrono = 0;
        }

        // Calculate the new direction
        this.xAcceleration = Math.cos(this.output.angle) * this.output.velocityFactor;
        this.yAcceleration = Math.sin(this.output.angle) * this.output.velocityFactor

        // Calculate and limit the speed
        this.xVelocity += this.xAcceleration;
        this.yVelocity += this.yAcceleration;
        this.xVelocity = this.xVelocity > this.genome.maxSpeed ?
            this.genome.maxSpeed : this.xVelocity < -this.genome.maxSpeed ?
                -this.genome.maxSpeed : this.xVelocity;
        this.yVelocity = this.yVelocity > this.genome.maxSpeed ?
            this.genome.maxSpeed : this.yVelocity < -this.genome.maxSpeed ?
                -this.genome.maxSpeed : this.yVelocity;

        // Calculate new position
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // Limit position to width and height
        //this.x = this.x >= windowWidth  ? windowWidth  : this.x <= 0 ? 0 : this.x;
        //this.y = this.y >= windowHeight ? windowHeight : this.y <= 0 ? 0 : this.y;

        // Calculate rebound
        /*if(this.x === 0 || this.x === windowWidth) {
            this.xVelocity = -this.xVelocity;
        }
        if(this.y === 0 || this.y === windowHeight) {
            this.yVelocity = -this.yVelocity;
        }*/
        //console.log(Math.floor(this.x), Math.floor(this.y))
        if (Math.floor(this.x) >= windowWidth)
            this.x = 0;
        if (Math.floor(this.y) >= windowHeight)
            this.y = 0;
        if (Math.floor(this.y) <= 0)
            this.y = windowHeight;
        if (Math.floor(this.x) <= 0)
            this.x = windowWidth;

        this.lifeTime += 1;
        this.brainActivityClock += 1;
        const price = this.genome.minHealth * (rules.EGG_LAYING_HEALTH_PRICE_PERCENTAGE / 100);
        if (this.output.wantToLay && this.health >= price && this.lifeTime >= this.genome.maxLifeTime * 0.2) {
            this.layEgg(price);

        }
        this.eat();
        this.health -= 1/60;
        this.draw();
    }

    getInput() {
        const brainActivation = this.brainActivityClock === this.genome.brainActivityFrequency;
        if (brainActivation) {
            this.brainActivityClock = 0;
        }

        this.detectCloseFood();
        this.detectClosestFood();
        const angle = this.calculateAngleToClosestFood();
        const distance = this.calculateDistanceToClosestFood();
        const speed = vectorMagnitude(this.xVelocity, this.yVelocity) || 0;
        //get the inputs !
        return [
            +brainActivation,
            this.chrono / this.genome.maxChrono,
            this.lifeTime / this.genome.maxLifeTime,
            this.genome.constant,
            speed,
            this.health,
            this.closeFood.length,
            angle,
            distance
        ];
    }

    setOutput(output) {
        this.output.angle = (output[0]) * 2 * Math.PI;
        this.output.velocityFactor = output[1] * this.genome.maxSpeed;
        this.output.wantToEat = output[2] < 0.5;
        this.output.wantToLay = output[3] > 0.5;
        this.output.resetChrono = output[4] > 0.5;

    }

    detectCloseFood() {
        this.closeFood = world.food.map(food => ({
            food: food,
            distance: calculateDistance(this, food)
        })).filter(foodDescriptor => foodDescriptor.distance <= this.genome.smellDistance);
    }

    detectClosestFood() {
        this.closestFood = this.closeFood.length ?
            this.closeFood.reduce((min, foodDescriptor) =>
                foodDescriptor.distance < min ? foodDescriptor.food : min, this.closeFood[0].food)
            : null;
        //console.log(this.closestFood)
    }

    calculateAngleToClosestFood() {
        //if (this.closestFood)
        //console.log( angleToPoint(this.x, this.y, this.closestFood.x, this.closestFood.y))
        return this.closestFood ? angleToPoint(this.x, this.y, this.closestFood.x, this.closestFood.y) / (2 * Math.PI) : 1;
    }

    calculateDistanceToClosestFood() {
        //console.log(this.x, this.y, "bitch")
        return this.closestFood ? calculateDistance(this, this.closestFood) / this.genome.smellDistance : 1;
    }

    eat() {
         this.closeFood.forEach(({ food }) => {
            console.log("-")
            const hit = collideCircleCircle(food.x, food.y, food.radius, this.x, this.y, this.genome.size);
            if (hit) {
                //console.log("EATING !", food)
                this.health += food.amount;
                //world.food.indexOf(world.food.find(f => this.closestFood.x === f.x && this.closestFood.y === f.y))
                world.food.splice(world.food.indexOf(food), 1);
                world.food.push(new Food())
            }
        })

    }

    layEgg(price) {
        //console.log("eggley", price, this.health)
        world.eggs.push(new Egg(this, price));
        this.health = this.health - price;
        //console.log("eggley", price, this.health)
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Draw the body
        stroke(200, 255);
        strokeWeight(2);
        fill(this.genome.color);
        ellipse(0, 0, this.genome.size, this.genome.size);

        // Draw the head line
        const velocityVector = createVector(this.xVelocity, this.yVelocity);
        rotate(velocityVector.heading());
        line(0,0,25,0);

        pop();
    }

    drawUI() {
        push();
        translate(this.x, this.y);

        // Draw the smell area
        stroke(200, 255);
        strokeWeight(0.5);
        fill(127, 0);
        ellipse(0, 0, this.genome.smellDistance * 2, this.genome.smellDistance * 2);

        pop();

        push();
        translate(0, 0);

        //console.log(this.lifeTime >= this.genome.maxLifeTime * 0.1, this.output.wantToLay, this.health, this.genome.minHealth)
        //this.detectedFood.forEach(df =>line(this.x,this.y, df.x,df.y));
        pop()


    }
}
