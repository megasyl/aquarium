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
        this.closeEntities = [];
        this.velocityVector = createVector(this.xVelocity, this.yVelocity);
        this.spikeLength = 25;

        this.output = {
            angle: 0,
            velocityFactor: 0,
            wantToEat: false,
            wantToLay: false,
            resetChrono: false
        };

        this.lifeTimeInSeconds = 0;
        this.children = 0;
        this.generation = parent ? parent.generation + 1 : 1;

    }

    update() {
        if (this.health <= 0) {
            world.kill(world.population.indexOf(this));
            let foodToSpawn = (this.waste + this.health) / rules.INITIAL_FOOD_AMOUNT;
            for (let i = 0; i < Math.round(foodToSpawn); i++) {
                const position = randPositionInCircle(this.x, this.y, this.genome.size * 4);
                world.food.push(new Food(position.x, position.y))
            }
            delete this;
            return;
        }
        this.radius = this.genome.size / 2;
        this.consumption = 1/45 + (1/180 * (Math.pow(vectorMagnitude(this.xVelocity, this.yVelocity), 2) * (1/2*this.genome.size))) + (this.waste / 2000);
        const input = this.getInput();
        //console.log(input)
        const output = this.brain.activate(input);
        this.setOutput(output);

        if (this.output.resetChrono) {
            this.chrono = 0;
        }

        this.spikeLength = this.output.spikeLength;

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

        this.velocityVector.x = this.xVelocity;
        this.velocityVector.y = this.yVelocity;

        // Calculate new position
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        if (rules.LIMIT_EDGES) {
            // Limit position to window width and height

            this.x = this.x + this.radius >= windowWidth ? windowWidth - this.radius  : this.x - this.radius <= 0 ? 0 + this.radius : this.x;
            this.y = this.y + this.radius >= windowHeight ? windowHeight - this.radius : this.y - this.radius <= 0 ? 0 + this.radius : this.y;
        } else {
            // Teleport entity to the opposite side
            if (this.x > windowWidth) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = windowWidth;
            }

            if (this.y > windowHeight) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = windowHeight;
            }
        }

        this.lifeTime += 1;
        this.brainActivityClock += 1;
        const price = this.genome.minHealth //* (rules.EGG_LAYING_HEALTH_PRICE_PERCENTAGE / 100);
        this.eat();
        if (this.output.wantToLay && this.health >= price && this.lifeTime >= this.genome.maxLifeTime * 0.2) {
            this.layEgg(price);

        }
        this.headOfPike = rotatePointAroundOrigin({x: this.x + this.spikeLength, y: this.y}, {x: this.x, y: this.y}, this.velocityVector.heading());
        this.detectCollisionEntity();
        if (this.touchedEntity && this.spikeLength > this.genome.size / 2) {
            const quantityToSteal = this.consumption * 100;
            const stolenHealth = this.touchedEntity.health > quantityToSteal ? quantityToSteal : this.touchedEntity.health;
            this.touchedEntity.health -= stolenHealth;
            this.health += stolenHealth;
        }

        //console.log(this.consumption)
        this.health -= this.consumption;
        this.waste += this.consumption;
        this.draw();
    }

    getInput() {
        const brainActivation = this.brainActivityClock === this.genome.brainActivityFrequency;
        if (brainActivation) {
            this.brainActivityClock = 0;
        }

        this.detectCloseFood();
        this.detectClosestFood();
        this.detectCloseEntities();
        this.detectClosestEntity();

        const angleToFood = this.calculateAngleToClosestFood();
        const distanceToFood = this.calculateDistanceToClosestFood();
        const angleToEntity = this.calculateAngleToClosestEntity();
        const angleToHeadingOfEntity = this.calculateAngleToHeadingOfClosestEntity();
        const distanceToEntity = this.calculateDistanceToClosestEntity();
        const speed = vectorMagnitude(this.xVelocity, this.yVelocity) || 0;
        const closestEntityConstantDifference = this.closestEntity ? Math.abs(this.closestEntity.genome.constant - this.genome.constant) : 0;
        //get the inputs !
        return [
            this.genome.constant,
            this.consumption,
            +brainActivation,
            this.chrono / this.genome.maxChrono,
            this.health,
            this.health / this.genome.minHealth,
            this.lifeTime,
            this.children,
            speed,
            this.closeFood.length,
            angleToFood,
            distanceToFood,
            angleToEntity,
            closestEntityConstantDifference,
            angleToHeadingOfEntity,
            distanceToEntity,
            !!this.touchedEntity,
            this.x - this.radius <= 0,
            this.x + this.radius >= windowWidth,
            this.y - this.radius <= 0,
            this.y + this.radius >= windowHeight,
            this.genome.size
        ];
    }

    setOutput(output) {
        this.output.angle = (output[0]) * 2 * Math.PI;
        this.output.velocityFactor = output[1] * this.genome.maxSpeed / 10;
        //this.output.wantToEat = output[2] < 0.5;
        this.output.wantToLay = output[2] > 0.5;
        this.output.resetChrono = output[3] > 0.5;
        this.output.spikeLength = this.genome.size /2 + ((output[4] % 1) * (25 - this.genome.size /2))

    }

    detectCloseFood() {
        this.closeFood = world.food.map(food => ({
            food: food,
            distance: calculateDistance(this, food)
        })).filter(foodDescriptor => foodDescriptor.distance <= this.genome.smellDistance);
    }

    detectClosestFood() {
        this.closestFood = this.closeFood.length ?
            this.closeFood.reduce((min, foodDescriptor) => foodDescriptor.distance < min.distance ? foodDescriptor : min, this.closeFood[0]).food
            : null;
    }

    calculateAngleToClosestFood() {
        return this.closestFood ? angleToPoint(this.x, this.y, this.closestFood.x, this.closestFood.y) / (2 * Math.PI) : 1;
    }

    calculateDistanceToClosestFood() {
        return this.closestFood ? calculateDistance(this, this.closestFood) / this.genome.smellDistance : 1;
    }

    detectCloseEntities() {
        this.closeEntities = world.population.map(entity => ({
            entity,
            distance: calculateDistance(this, entity)
        })).filter(entityDescriptor => entityDescriptor.distance <= this.genome.soundDistance && entityDescriptor.distance > 0);
    }

    detectClosestEntity() {

        this.closestEntity = this.closeEntities.length ?
            this.closeEntities.reduce((min, entityDescriptor) => entityDescriptor.distance < min.distance ? entityDescriptor : min, this.closeEntities[0]).entity
            : null;
    }

    calculateAngleToClosestEntity() {
       return this.closestEntity ? angleToPoint(this.x, this.y, this.closestEntity.x, this.closestEntity.y) / (2 * Math.PI) : 1;
    }

    calculateAngleToHeadingOfClosestEntity() {
        return this.closestEntity ? angleToPoint(this.x, this.y, this.closestEntity.velocityVector.x, this.velocityVector.y) / (2 * Math.PI) : 1;
    }

    calculateDistanceToClosestEntity() {
        return this.closestEntity ? calculateDistance(this, this.closestEntity) / this.genome.soundDistance : 1;
    }

    detectCollisionEntity() {
        const entityDescriptor = this.closeEntities.find(({entity}) => collideLineCircle(this.x,this.y, this.headOfPike.x, this.headOfPike.y, entity.x,entity.y, entity.genome.size))
        this.touchedEntity = entityDescriptor ? entityDescriptor.entity : null;
    }

    eat() {
         this.closeFood.forEach(({ food }) => {
            const hit = collideCircleCircle(food.x, food.y, food.radius, this.x, this.y, this.genome.size);
            if (hit) {
                //console.log("EATING !", food)
                this.health += food.amount;
                //this.waste += food.amount;
                //world.food.indexOf(world.food.find(f => this.closestFood.x === f.x && this.closestFood.y === f.y))
                world.food.splice(world.food.indexOf(food), 1);
                //world.food.push(new Food())
            }
        })

    }

    layEgg(price) {
        //console.log("eggley", price, this.health)
        world.eggs.push(new Egg(this, price));
        this.health -= price;
        //this.waste += price;
        //console.log("eggley", price, this.health)
        this.children += 1;
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
        rotate(this.velocityVector.heading());
        line(0,0,this.spikeLength,0);

        pop();

        push()
        translate(0,0);
    }

    drawUI() {
        if (this.health <= 0)
            return;
        push();
        translate(this.x, this.y);

        // Draw the smell area
        stroke(200, 255);
        strokeWeight(0.5);

        fill(255, 0, 0, 5);
        ellipse(0,0, this.genome.soundDistance * 2, this.genome.soundDistance * 2);
        fill(0, 255, 0, 10);
        ellipse(0,0, this.genome.smellDistance * 2, this.genome.smellDistance * 2);

        pop();

        push();
        translate(0, 0);
        stroke('green');
        if (this.closestFood)
            line(this.x,this.y,this.closestFood.x,this.closestFood.y);
        stroke('red');
        if (this.closestEntity)
            line(this.x,this.y,this.closestEntity.x,this.closestEntity.y);
        pop()

        $('#health').text('Health : ' + this.health);
        $('#waste').text('Waste : ' + this.waste);
        $('#generation').text('Generation : ' + this.generation);
        const duration = moment.duration(this.lifeTimeInSeconds, 'seconds');
        const formatted = duration.format("hh:mm:ss");
        $('#lifeTime').text('LifeTime : ' + formatted);
        $('#children').text('Children : ' + this.children);

    }
}
