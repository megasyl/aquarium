const {
    Engine, Render, World: mWorld, Bodies, Body, Events, Constraint, Vector, Mouse, MouseConstraint, Bounds
} = Matter;

class Physics {
    constructor() {

        this.engine = Engine.create();
        this.engine.world.gravity.y = 0;
        this.engine.timing.timeScale = rules.TIMESCALE;
        const canvas = $( "#field" )[ 0 ];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.render = Render.create({
            element: canvas,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,

                hasBounds: true
                //showAngleIndicator: true,
            }
        });

       /* this.engine.world.bounds.min.x = -300;
        this.engine.world.bounds.min.y = -300;
        this.engine.world.bounds.max.x = 1100;
        this.engine.world.bounds.max.y = 900;*/

        //new Camera(this);

        Events.on(this.engine, "collisionStart", (event) => {
            world.onCollisionStart(event.pairs)
        });

        Events.on(this.engine, "collisionEnd", (event) => {
            world.onCollisionEnd(event.pairs)
        });

        Render.run(this.render);

        this.setupWalls();
    }

    addWall(x, y, w, h) {
        this.add(
            Bodies.rectangle(x, y, w, h, {
                isStatic: true,
                collisionFilter: {
                    category: bodyCategories.wall
                }
            })
        );
    }

    setupWalls() {
        const wallSize = 20;
        const offset = 0;

        this.addWall(window.innerWidth/2, -offset, window.innerWidth + 2 * offset, wallSize);

        this.addWall(window.innerWidth/2, window.innerHeight + offset, window.innerWidth + 2 * offset, wallSize);
        this.addWall(window.innerWidth+ offset, window.innerHeight /2, wallSize, window.innerHeight + 2 * offset);
        this.addWall(-offset, window.innerHeight /2, wallSize, window.innerHeight + 2 * offset);
    }

    add(body) {
        mWorld.add(this.engine.world, [body]);
    }

    remove(body) {
        mWorld.remove(this.engine.world, body);
    }
}
