class Camera {
    constructor(physics) {
        const mouse = Mouse.create(physics.render.canvas);
        this.mouseConstraint = MouseConstraint.create(physics.engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        physics.add(this.mouseConstraint);

        // keep the mouse in sync with rendering
        physics.render.mouse = mouse;

        this.viewportCentre = {
            x: physics.render.options.width * 0.5,
            y: physics.render.options.height * 0.5
        };
        this.boundsScaleTarget = 1;
        this.boundsScale = {
            x: 1,
            y: 1
        };
        this.physics = physics;
        Events.on(this.mouseConstraint, "mousedown", () => this.isClicking = true);
        Events.on(this.mouseConstraint, "mouseup", () => this.isClicking = false)
        this.isClicking = false;
    }

    async update () {
        const { render, engine } = this.physics;
        const world = engine.world;
        const { mouse } = this.mouseConstraint;
        let translate;

        // mouse wheel controls zoom
        let scaleFactor = mouse.wheelDelta * -0.1;
        if (scaleFactor !== 0) {
            if ((scaleFactor < 0 && this.boundsScale.x >= 0.6) || (scaleFactor > 0 && this.boundsScale.x <= 1.4)) {
                this.boundsScaleTarget += scaleFactor;
            }
        }

        // if scale has changed
        if (Math.abs(this.boundsScale.x - this.boundsScaleTarget) > 0.01) {
            // smoothly tween scale factor
            scaleFactor = (this.boundsScaleTarget - this.boundsScale.x) * 0.2;
            this.boundsScale.x += scaleFactor;
            this.boundsScale.y += scaleFactor;

            // scale the render bounds
            render.bounds.max.x = render.bounds.min.x + render.options.width * this.boundsScale.x;
            render.bounds.max.y = render.bounds.min.y + render.options.height * this.boundsScale.y;

            // translate so zoom is from centre of view
            translate = {
                x: render.options.width * scaleFactor * -0.5,
                y: render.options.height * scaleFactor * -0.5
            };

            Bounds.translate(render.bounds, translate);

            // update mouse
            Mouse.setScale(mouse, this.boundsScale);
            Mouse.setOffset(mouse, render.bounds.min);
        }

        // get vector from mouse relative to centre of viewport
        var deltaCentre = Vector.sub(mouse.absolute, this.viewportCentre),
            centreDist = Vector.magnitude(deltaCentre);


        // translate the view if mouse has moved over 50px from the centre of viewport
        if (centreDist > 50 && this.isClicking) {
            // create a vector to translate the view, allowing the user to control view speed
            const direction = Vector.normalise(deltaCentre);
            const speed = Math.min(10, centreDist - 50);

            translate = Vector.mult(direction, speed);

            // prevent the view moving outside the world bounds
            if (render.bounds.min.x + translate.x < world.bounds.min.x)
                translate.x = world.bounds.min.x - render.bounds.min.x;

            if (render.bounds.max.x + translate.x > world.bounds.max.x)
                translate.x = world.bounds.max.x - render.bounds.max.x;

            if (render.bounds.min.y + translate.y < world.bounds.min.y)
                translate.y = world.bounds.min.y - render.bounds.min.y;

            if (render.bounds.max.y + translate.y > world.bounds.max.y)
                translate.y = world.bounds.max.y - render.bounds.max.y;

            // move the view
            Bounds.translate(render.bounds, translate);

            // we must update the mouse too
            Mouse.setOffset(mouse, render.bounds.min);
        }
    }
}
