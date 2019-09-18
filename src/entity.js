class Entity {
    constructor(brain, color, position) {
        this.x = position ? position.x : random(0, windowWidth);
        this.y = position ? position.y : random(0, windowHeight);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.maxSpeed = 2;
        this.angle = 0;

        this.maxHealth = 500;
        this.health = this.maxHealth;

        this.brain = brain;
        this.color = color ? color : "#"+((1<<24)*Math.random()|0).toString(16);

        this.size = 25;
        this.smellDistance = 100;

        this.alive = true;
        this.lifeTime = 0;
        this.reproductionLifeTime = 2000;

        this.spikeLength = 25;
    }

    update() {
        if (Math.round(this.health) <= 0) {
            this.alive = false;
            entities.splice(entities.indexOf(this), 1);
            return;
        }

        this.leftSensor = {x: this.x - Math.sin(30) * 40, y: this.y - sin(30) * 40 }
        this.rightSensor = {x: this.x - Math.sin(30) * 40, y: this.y + sin(30) * 40 }

        angleMode(RADIANS)
        const o = {x: this.x, y: this.y}
        const a = createVector(this.xVelocity, this.yVelocity).heading();
        this.leftSensor = rotatePointAroundOrigin(this.leftSensor, o, a);
        this.rightSensor = rotatePointAroundOrigin(this.rightSensor, o, a);

        const input = this.detect();
        const output = this.brain.activate(input);
        this.angle = output[0] * 2 * Math.PI;
        this.velocityFactor = output[1] * this.maxSpeed / 2;

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
        //this.x = this.x >= windowWidth  ? windowWidth  : this.x <= 0 ? 0 : this.x;
        //this.y = this.y >= windowHeight ? windowHeight : this.y <= 0 ? 0 : this.y;

        if (this.x < 0)
            this.x = windowWidth;
        else if (this.x > windowWidth)
            this.x = 0

        if (this.y < 0)
            this.y = windowHeight;
        else if (this.y > windowHeight)
            this.y = 0;
        // Calculate rebound
        /*if(this.x === 0 || this.x === windowWidth) {
            this.xVelocity = -this.xVelocity;
            //this.health -= 10;
            this.brain.score -= 10;
        }
        if(this.y === 0 || this.y === windowHeight) {
            this.yVelocity = -this.yVelocity;
            //this.health -= 10;
            this.brain.score -= 10;
        }*/

        // Try to eat food, and loose health over time if not fed
        this.health -= 0.6
        //if (output[2] < 0.5)
            this.eat();

        this.lifeTime++;
        if (this.lifeTime%this.reproductionLifeTime === 0) {
            this.getOffSpring()
        }



        this.draw();
    }

    getOffSpring() {

        const newBrain = neataptic.Network.crossOver(this.brain, this.brain);
        if (Math.random() < neat.mutationRate) {
            newBrain.mutate(mutation)
            //this.brain.mutate()
        }

        entities.push(new Entity(newBrain, this.color, {x: this.x, y: this.y}));
    }

    detect() {
        // Normalize an input over a value to get a ratio
        // Seems to help neural network to converge faster ..
        const normalize = (value, over) => value / over;

        // Zero padding the inputs for food detection
        //const inputs = new Array(Entity.getInputNumber()).fill(0);

        /*this.detectedFood =  detectCloseFood(this);
        const foodInputs = this.detectedFood.reduce((acc, cur) => {
            acc.push(normalize(cur.x, windowWidth));
            acc.push(normalize(cur.y, windowHeight));
            acc.push(angleToPoint(this.x, this.y, cur.x, cur.y) / (Math.PI * 2));
            acc.push(normalize(cur.amount - Food.getMinAmount(), Food.getMaxAmount()));
            return acc;
        }, []);*/


        /*for (let i = 0; i < foodInputs.length; i++) {
            inputs[i+Entity.getStaticInputNumber()] = foodInputs[i];
        }*/
        const cell = foodGrid.findCell(this.x, this.y);
        const leftSensorCell = foodGrid.findCell(this.leftSensor);
        const rightSensorCell = foodGrid.findCell(this.rightSensor);
        return [
            normalize(this.health, this.maxHealth),
            normalize(cell ? cell.amount : 0, FoodGrid.maxCellAmount()),
            normalize(leftSensorCell ? leftSensorCell.amount : 0, FoodGrid.maxCellAmount()),
            normalize(rightSensorCell ? rightSensorCell.amount : 0, FoodGrid.maxCellAmount()),
            detectCloseEntitiesNumber(this)
        ]
    }

    eat() {
        //this.health -= 1;
        /*this.detectedFood.forEach(df => {
            if(collideCircleCircle(df.x,df.y,df.radius, this.x, this.y, this.size)) {
                this.health += df.amount;
                this.brain.score += 10 + 2 * df.amount;
                foodStock.splice(foodStock.indexOf(df), 1);
                foodStock.push(new Food());
            }
        });*/

        const cell = foodGrid.findCell(this.x, this.y);
        if (!cell)
            return;


        let maxEatableFood = FoodGrid.maxCellAmount() * .4
        if (cell.amount >= maxEatableFood) {
            this.health += cell.amount;
            this.brain.score += cell.amount;
            cell.amount = 0
        }

         else if (cell.amount < 0)
            cell.amount = 0;
        if (this.health > this.maxHealth)
            this.health = this.maxHealth;

    }

    draw() {
        push();
        translate(this.x, this.y);

        // Draw the body
        stroke(200, this.opacity);
        strokeWeight(2);
        //fill(127, this.opacity);
        fill(this.color);
        ellipse(0, 0, this.size, this.size);

        // Draw the head lines
        const velocityVector = createVector(this.xVelocity, this.yVelocity);
        rotate(velocityVector.heading());
        angleMode(DEGREES)
        line(0,0,25,0);

        rotate(30)
        line(0,0,40,0);
        rotate(-60)
        line(0,0,40,0);

        // Draw the smell area
        stroke(200, 255);
        strokeWeight(0.5);
        fill(127, 0);
        ellipse(0, 0, this.smellDistance * 2, this.smellDistance * 2);
        pop();
        push();


        translate(0, 0);

        const o = {x: this.x, y: this.y};
        const p = {x: this.x + 25, y: this.y - 25}
        // angleMode(RADIANS)
        // const a = velocityVector.heading();
        // const leftSensor = rotatePointAroundOrigin(this.leftSensor, o, a);
        // const rightSensor = rotatePointAroundOrigin(this.rightSensor, o, a);
        ellipse(this.leftSensor.x, this.leftSensor.y , 10 , 10)
        ellipse(this.rightSensor.x, this.rightSensor.y , 10 , 10)

        //this.detectedFood.forEach(df =>line(this.x,this.y, df.x,df.y));
        const lifeBar = {
            x: (this.x + this.size / 2) + 5,
            y: this.y + this.size / 2 - 11,
            percentage: this.health/this.maxHealth
        };
        rect(lifeBar.x + 5, lifeBar.y, 7, - (this.size + 4));
        fill(36, 138, 35);
        rect(lifeBar.x + 5, lifeBar.y, 7, - (this.size * lifeBar.percentage + 4));
        fill(127, 255);
        textSize(11);
        text(`${Math.round(lifeBar.percentage * 100)}%`, lifeBar.x, lifeBar.y + 11 );
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

        this.alive = true;
    }

    static getStaticInputNumber() {
       return 5;
    }

    // For zero padding
    // 3 food properties * 10 max food detected
    static getVariableInputNumber() {
        return 0;
    }

    static getInputNumber() {
        return Entity.getStaticInputNumber() + Entity.getVariableInputNumber();
    }
}
