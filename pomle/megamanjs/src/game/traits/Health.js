Game.traits.Health = function()
{
    Engine.Trait.call(this);
    Engine.logic.Energy.call(this);

    this.immune = false;

    this._lastValue = undefined;
}

Engine.Util.extend(Game.traits.Health, Engine.Trait);
Engine.Util.mixin(Game.traits.Health, Engine.logic.Energy);

Game.traits.Health.prototype.NAME = 'health';

Game.traits.Health.prototype.EVENT_HEALED = 'healed';
Game.traits.Health.prototype.EVENT_HURT = 'hurt';
Game.traits.Health.prototype.EVENT_HEALTH_CHANGED = 'health-changed';

Game.traits.Health.prototype.__timeshift = function healthUpdate()
{
    if (this._lastValue !== this._value) {
        this._host.trigger(this.EVENT_HEALTH_CHANGED);
        this._lastValue = this._value;
    }

    if (this.depleted) {
        this._host.kill();
    }
}

Game.traits.Health.prototype.inflictDamage = function(points, direction)
{
    if (this.immune === true) {
        return false;
    }
    this.amount -= points;
    this._host.trigger(this.EVENT_HURT, [points, direction]);
    return true;
}
