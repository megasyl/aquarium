const {
    Engine, Render, World: mWorld, Bodies, Body, Events, Constraint
} = Matter;

class Physics {
    constructor() {

        this.engine = Engine.create();
        this.engine.world.gravity.y = 0;
        this.engine.timing.timeScale = 1;
        var canvas = $( "#field" )[ 0 ];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;




        var render = Render.create({
            element: $( "#field" )[ 0 ],
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                showAngleIndicator: true,
            }
        });

        /*.on(this.engine, "collisionActive", (event) => {
            console.log(event)
            event.pairs.forEach(pair => {

            })
        });*/

        Events.on(this.engine, "collisionStart", (event) => {
            world.onCollisionStart(event.pairs)
        });

        Events.on(this.engine, "collisionEnd", (event) => {
            world.onCollisionEnd(event.pairs)
        });

        //Engine.run(this.engine);

        Render.run(render);

        /*document.body.onmousemove = event => {
            var targetAngle = Matter.Vector.angle(ball.position, {x: event.clientX, y: event.clientY});
            var force = 0.0001;
            // Suivi de la position de la souris dans la console
            Body.applyForce(ball, ball.position, {
                x: Math.cos(targetAngle) * force,
                y: Math.sin(targetAngle) * force
            });
            Body.setAngularVelocity(ball, 0.5)
            console.log(`Position de la souris : X = ${event.clientX} | Y = ${event.clientY}`);
        }*/
    }

    add(body) {
        mWorld.add(this.engine.world, [body]);
    }

    remove(body) {
        mWorld.remove(this.engine.world, body);
    }
}
