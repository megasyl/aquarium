class Entity {
    constructor(parent, x, y) {
        this.genome = new Genome(parent);
        this.brain = Brain(parent);


        // State
        this.x = x || random(0, window.innerWidth);
        this.y = y || random(0, window.innerHeight);
        this.health = this.genome.minHealth;
        this.chrono = 0;
        this.lifeTime = 0;
        this.brainActivityClock = 0;
        this.waste = 0;
        this.closeEntities = [];
        this.spikeLength = 25;
        this.rigidBody = Bodies.circle(this.x, this.y, this.genome.size, { frictionAir: 1,
            collisionFilter: {
                category: bodyCategories.entity
            }
        });
        this.foodDetector = Bodies.circle(this.x, this.y, this.genome.smellDistance, {
            frictionAir: 1,
            isSensor: true,
            mass: 0,
            collisionFilter: {
                category: bodyCategories.foodDetector,
                mask: bodyCategories.food
            },
            render: {
                fillStyle: 'transparent',
                strokeStyle: 'green',
                lineWidth: 1
            }
        });
        Body.setMass(this.foodDetector, 0.0001);
        this.foodDetectorConstraint = Constraint.create({
            bodyA: this.rigidBody,
            bodyB: this.foodDetector,
        });
        this.rigidBody.individual = this;
        this.foodDetector.individual = this;
        this.collisions = {
            food: [],
            entities: []
        };

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

    brainFreeze(array) {
        if (array.filter(i => isNaN(i)).length) {
            console.log("BVRAIN FREEZE")
            //brain freeze :(
            this.waste += this.health;
            this.health = 0;
            return true;
        }
        return false;
    }

    update() {
        const { position, velocity } = this.rigidBody;
        if (this.health <= 0) {
            world.kill(world.population.indexOf(this));
            //todo fix, beaks equilibrium
            let foodToSpawn = (this.waste + this.health) / rules.INITIAL_FOOD_AMOUNT;
            for (let i = 0; i < Math.round(foodToSpawn); i++) {
                //const position = randPositionInCircle(this.x, this.y, this.genome.size * 8);
                world.food.push(new Food(random(0, window.innerHeight), random(0, window.innerWidth)))
            }
            delete this;
            return;
        }
        this.radius = this.genome.size / 2;
        this.consumption = 1/60 + (1/180 * (Math.pow(vectorMagnitude(velocity.x, velocity.y), 2) * (1/2*this.genome.size))) + (this.waste / 4000) + (this.spikeLength / 300);
        const input = this.getInput();

        if (this.brainFreeze(input))
            return;

        const output = this.brain.activate(input);
        if (this.brainFreeze(output))
            return;
        this.setOutput(output);

        if (this.output.resetChrono) {
            this.chrono = 0;
        }

        this.spikeLength = this.output.spikeLength;


        this.lifeTime += 1;
        this.brainActivityClock += 1;
        const price = this.genome.minHealth //* (rules.EGG_LAYING_HEALTH_PRICE_PERCENTAGE / 100);
        //this.eat();
        if (this.output.wantToLay && this.health >= price && this.lifeTime >= this.genome.maxLifeTime * 0.2) {
            this.layEgg(price);

        }

        //console.log(this.health, this.consumption)
        //this.health -= this.consumption;
        //this.waste += this.consumption;

        console.log(this.output.angle)
        Body.rotate(this.rigidBody, this.output.angle)
        Body.rotate(this.foodDetector, this.output.angle);
        console.log(0.0001 * this.output.velocityFactor)
       // console.log(rotateVectorByAngle({x: 0.001, y: 0}, this.rigidBody.angle * (Math.pi / 180), this.rigidBody.angle * (Math.pi / 180))
        Body.applyForce(this.rigidBody, position, {
            x: Math.cos(this.output.angle) * this.output.velocityFactor,
            y: Math.sin(this.output.angle) * this.output.velocityFactor
        });

        //Body.applyForce(this.rigidBody, position, {x: velocity.x / (250 * this.genome.size), y: velocity.y / (250 * this.genome.size)});
        this.drawUI();
    }

    getClosestFood() {
        let closest = Infinity;
        return {
            food: this.collisions.food.reduce((min, food) => {
                const distance = calculateDistance(this.rigidBody.position, food.rigidBody.position);
                if (distance < closest) {
                    closest = distance;
                    return food;
                }
                return min;
            }, null),
            distance: closest === Infinity ? 0 : closest
        }
    }

    getInput() {
        const brainActivation = this.brainActivityClock === this.genome.brainActivityFrequency;
        if (brainActivation) {
            this.brainActivityClock = 0;
        }


        const closestFood = this.getClosestFood();
        console.log(closestFood)
        const foodAngle = closestFood.food ? this.angleToClosestFood(closestFood.food) : 0;
        const speed = vectorMagnitude(this.rigidBody.velocity.x, this.rigidBody.velocity.y) || 0;
        const closestFoodAmount = this.collisions.food.length;

        //const angleToHeadingOfEntity = this.calculateAngleToHeadingOfClosestEntity();

        /*const distanceToEntity = this.calculateDistanceToClosestEntity();
        const closestEntityConstantDifference = this.closestEntity ? Math.abs(this.closestEntity.genome.constant - this.genome.constant) : 0;
        const closestEntitySize = this.closestEntity ? this.closestEntity.genome.size : 0;
        const closestEntitySpikeLength = this.closestEntity ? this.closestEntity.spikeLength : 0;
        const closestEntityHealth = this.closestEntity ? this.closestEntity.health : 0;
        const closestEntitySpeed = this.closestEntity ? vectorMagnitude(this.closestEntity.xVelocity, this.closestEntity.yVelocity) : 0;*/

        //get the inputs !
        return [
            this.genome.constant,
            //this.consumption,
            +brainActivation,
            this.chrono / this.genome.maxChrono,
            //this.health,
            this.health / this.genome.minHealth,
            this.lifeTime,
            closestFoodAmount,
            speed,
            foodAngle,
            closestFood.distance / this.genome.smellDistance,
            //this.closeFood.length,
            //this.angleToFood,
            //distanceToFood / this.genome.smellDistance,
            //this.angleToEntity,
            //closestEntityConstantDifference,
            //angleToHeadingOfEntity,
            //distanceToEntity,
            //closestEntitySize,
            //closestEntitySpikeLength,
            //closestEntityHealth,
            //closestEntitySpeed,
            //!!this.touchedEntity,
            //this.genome.size / rules.INITIAL_SIZE
        ];
    }

    setOutput(output) {
        //this.output.angle = (output[0]) * 2 * Math.PI;
        this.output.angle = output[0] * 2 * Math.PI;
        this.output.velocityFactor = output[1] > rules.INITIAL_MAX_SPEED ? rules.INITIAL_MAX_SPEED : output[1];
        //this.output.wantToEat = output[2] < 0.5;
        this.output.wantToLay = output[2] > 0.5;
        this.output.spikeLength = this.genome.size /2 + ((output[3] % 1) * (25 - this.genome.size /2))
        //console.log(output)
        this.output.resetChrono = output[4] > 0.5;

    }

    angleToClosestFood(food) {
        const { position,velocity } = food.rigidBody;
        this.relativePosition = {
            x: position.x - this.x ,
            y: position.y - this.y
        };
        return angleToPoint(velocity.x, velocity.y, this.relativePosition.x, this.relativePosition.y);
    }

    eat(food) {
        console.log("EAT", food)
        this.health += food.amount;
        world.digest(food);
    }

    layEgg(price) {
        world.eggs.push(new Egg(this, price));
        this.health -= price;
        //this.waste += price;
        this.children += 1;
    }

    drawUI() {
        $('#health').text('Health : ' + this.health);
        $('#waste').text('Waste : ' + this.waste);
        $('#generation').text('Generation : ' + this.generation);
        const duration = moment.duration(this.lifeTimeInSeconds, 'seconds');
        const formatted = duration.format("hh:mm:ss");
        $('#lifeTime').text('LifeTime : ' + formatted);
        $('#children').text('Children : ' + this.children);

    }
}
