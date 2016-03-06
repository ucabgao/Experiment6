Game.traits.Physics = function()
{
    Engine.Trait.call(this);

    this.enabled = true;

    this.area = 0.04;
    this.atmosphericDensity = 1.225;
    this.dragCoefficient = .045;
    this.mass = 0;

    this.acceleration = new THREE.Vector2();
    this.force = new THREE.Vector2();
    this.velocity = new THREE.Vector2();
}

Engine.Util.extend(Game.traits.Physics, Engine.Trait);

Game.traits.Physics.prototype.NAME = 'physics';

/* Megaman is 132 cm tall according to lore. He is 24 pixels tall in
   the game world. This constant was derived from 24 px / 1.32 m. */
Game.traits.Physics.prototype.UNIT_SCALE = 182;

Game.traits.Physics.prototype.__obstruct = function(object, attack)
{
    switch (attack) {
        case object.SURFACE_TOP:
        case object.SURFACE_BOTTOM:
            this.velocity.copy(object.velocity);
            break;
        case object.SURFACE_LEFT:
        case object.SURFACE_RIGHT:
            this._host.velocity.x = object.velocity.x;
            break;
    }
}

Game.traits.Physics.prototype.__timeshift = function physicsTimeshift(dt)
{
    if (this.enabled === false || this.mass <= 0) {
        return;
    }

    var g = this._host.world.gravityForce,
        v = this.velocity,
        a = this.acceleration,
        F = this.force,
        m = this.mass;

    F.y -= g.y * m;

    var Fd = this._calculateDrag();
    F.add(Fd);
    //console.log("Force: %f,%f, Resistance: %f,%f, Result: %f,%f", F.x, F.y, Fd.x, Fd.y, F.x - Fd.x, F.y - Fd.y);

    var å = new THREE.Vector2(F.x / m, F.y / m);
    a.copy(å);
    v.add(a);

    this._host.velocity.copy(v);

    F.x = 0;
    F.y = 0;
}

Game.traits.Physics.prototype._calculateDrag = function(v)
{
    var ρ = this.atmosphericDensity,
        Cd = this.dragCoefficient,
        A = this.area,
        v = this._host.velocity;
    /* abs value for one velocity component to circumvent
       signage removal on v^2 . */
    return new THREE.Vector2(-.5 * ρ * Cd * A * v.x * Math.abs(v.x),
                             -.5 * ρ * Cd * A * v.y * Math.abs(v.y));
}

Game.traits.Physics.prototype.bump = function(x, y)
{
    this.velocity.x += x;
    this.velocity.y += y;
}

Game.traits.Physics.prototype.zero = function()
{
    this.velocity.multiplyScalar(0);
    this._host.velocity.copy(this.velocity);
    this._host.integrator.reset();
}
