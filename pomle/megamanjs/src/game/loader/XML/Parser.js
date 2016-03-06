Game.Loader.XML.Parser = function(loader)
{
    this.loader = loader;
    this.node = undefined;
}

Game.Loader.XML.Parser.prototype.applyTrait = function(object, traitDescriptor)
{
    var trait = object.getTrait(traitDescriptor.ref);
    if (!trait) {
        trait = new traitDescriptor.ref();
        object[trait.NAME] = object.applyTrait(trait);
    }

    for (var p in traitDescriptor.prop) {
        var prop = traitDescriptor.prop[p];
        if (prop !== undefined) {
            trait[p] = prop;
        }
    }
    return trait;
}

Game.Loader.XML.Parser.prototype.getAbsoluteUrl = function(node, attr)
{
    var url = node.attr(attr || 'url');
    if (node[0].ownerDocument.baseURL === undefined) {
        return url;
    }

    if (url.indexOf('http') === 0) {
        return url;
    }
    var baseUrl = node[0].ownerDocument.baseURL.split('/').slice(0, -1).join('/') + '/';
    return baseUrl + url;
}

Game.Loader.XML.Parser.prototype.getBool = function(node, attr, def)
{
    var b = node.attr(attr);
    if (b === undefined) {
        return def;
    }
    else if (b === 'true') {
        return true;
    }
    return false;
}

Game.Loader.XML.Parser.prototype.getCameraPath = function(pathNode)
{
    var z = 150;
    var pathNode = $(pathNode);
    var path = new Engine.Camera.Path();
    /* y1 and y2 is swapped because they are converted to negative values and
       y2 should always be bigger than y1. */
    var windowNode = pathNode.children('window');
    path.window[0] = this.getPosition(windowNode, 'x1', 'y1');
    path.window[1] = this.getPosition(windowNode, 'x2', 'y2');

    var constraintNode = pathNode.children('constraint');
    path.constraint[0] = this.getPosition(constraintNode, 'x1', 'y1', 'z');
    path.constraint[1] = this.getPosition(constraintNode, 'x2', 'y2', 'z');
    path.constraint[0].z = z;
    path.constraint[1].z = z;

    return path;
}

Game.Loader.XML.Parser.prototype.getColor = function(node, attr)
{
    var c = node.attr(attr);
    if (c.indexOf('#') === 0) {
        var r = c.substr(1,2);
        var g = c.substr(3,2);
        var b = c.substr(5,2);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);

        return new THREE.Vector4(r, g, b, 1);
    }
    return false;
}

Game.Loader.XML.Parser.prototype.getFloat = function(node, attr, def)
{
    var value = node.attr(attr);
    if (value && isFinite(value)) {
        return parseFloat(value);
    }
    return def;
}


Game.Loader.XML.Parser.prototype.getFloatValues = function(node, def)
{
    var value = node.attr(attr);
    if (value && isFinite(value)) {
        return parseFloat(value);
    }
    return def;
}

Game.Loader.XML.Parser.prototype.getGeometry = function(node)
{
    var type = node.attr('type');
    switch (type) {
        case 'plane':
            return new THREE.PlaneGeometry(
                parseFloat(node.attr('w')),
                parseFloat(node.attr('h')),
                parseFloat(node.attr('w-segments')) || 1,
                parseFloat(node.attr('h-segments')) || 1);
    }
    throw new Error('Could not parse geometry type "' + type + '"');
}

Game.Loader.XML.Parser.prototype.getRange = function(node, attr, total)
{
    var input = $(node).attr(attr || 'range');

    var values = [];
    var groups, group, ranges, range, mod, upper, lower, i;

    groups = input.split(',');

    while (group = groups.shift()) {

        mod = parseFloat(group.split('/')[1]) || 1;
        ranges = group.split('-');

        if (ranges.length == 2) {
            lower = parseFloat(ranges[0]);
            upper = parseFloat(ranges[1]);
        }
        else if (ranges[0] == '*') {
            lower = 1;
            upper = total;
        }
        else {
            lower = parseFloat(ranges[0]);
            upper = lower;
        }

        if (lower < 1) {
            throw new RangeError("Lower range beyond 0");
        }
        if (upper > total) {
            throw new RangeError("Upper range beyond " + total);
        }

        i = 0;
        while (lower <= upper) {
            if (i++ % mod === 0) {
                values.push(lower);
            }
            ++lower;
        }
    }

    return values;
}

Game.Loader.XML.Parser.prototype.getRect = function(node, attrX, attrY, attrW, attrH)
{
    var node = $(node);
    return {
        'x': parseFloat(node.attr(attrX || 'x')),
        'y': parseFloat(node.attr(attrY || 'y')),
        'w': parseFloat(node.attr(attrW || 'w')),
        'h': parseFloat(node.attr(attrH || 'h')),
    }
}

Game.Loader.XML.Parser.prototype.getPosition = function(node, attrX, attrY, attrZ)
{
    var node = $(node);
    var vec3 = this.getVector3.apply(this, arguments);
    return vec3;
}

Game.Loader.XML.Parser.prototype.getTexture = function(textureNode)
{
    var textureNode = $(textureNode),
        parser = this;

    if (!textureNode.is('texture')) {
        throw new Error("Node not <texture>");
    }

    var textureId = textureNode.attr('id');
    var textureUrl = this.getAbsoluteUrl(textureNode, 'url');
    if (!textureId) {
        textureId = textureUrl;
    }

    var resources = this.loader.game.resource;
    var texture = resources.get('texture', textureId);

    if (!texture) {
        var textureScale = this.getFloat(textureNode, 'scale', 4);
        var texture = new THREE.Texture();
        texture.name = textureId;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        var effects = [];
        textureNode.find('> effects > color-replace').each(function() {
            var crNode = $(this);
            effects.push(function(canvas) {
                return Engine.CanvasUtil.colorReplace(canvas,
                                                      parser.getColor(crNode, 'in'),
                                                      parser.getColor(crNode, 'out'));
            });
        });

        if (textureScale !== 1) {
            effects.push(function(canvas) {
                return Engine.CanvasUtil.scale(canvas, textureScale);
            });
        }

        var image = new Image();
        image.onload = function() {
            var canvas = Engine.CanvasUtil.clone(this);
            for (var i in effects) {
                canvas = effects[i](canvas);
            }
            texture.image = canvas;
            texture.needsUpdate = true;
        }
        image.src = textureUrl;

        resources.addTexture(textureId, texture);
    }
    return texture;
}

Game.Loader.XML.Parser.prototype.getTrait = function(traitNode)
{
    var game = this.loader.game,
        source = traitNode.attr('source'),
        name = traitNode.attr('name'),
        ref = Game.traits[source];

    if (ref === undefined) {
        throw new Error('Trait "' + source + '" does not exist');
    }

    switch (name || ref.prototype.NAME) {
        case 'contactDamage':
            return {
                'ref': ref,
                'prop': {
                    'points': this.getFloat(traitNode, 'points'),
                }
            }
            break;

        case 'deathSpawn':
            return {
                'ref': ref,
                'prop': {
                    'chance': this.getFloat(traitNode, 'chance'),
                    'pool': (function() {
                        var objects = [];
                        traitNode.find('> objects > *').each(function() {
                            var type = this.tagName,
                                name = this.attributes.id.value;
                            var object = game.resource.get(type, name);
                            if (!object) {
                                throw new Error("No resource type " + type + " named " + name);
                            }
                            objects.push(object);
                        });
                        return objects;
                    })(),
                }
            }
            break;

        case 'disappearing':
            return {
                'ref': ref,
                'prop': {
                    'onDuration': this.getFloat(traitNode, 'on'),
                    'offDuration': this.getFloat(traitNode, 'off'),
                    'offset': this.getFloat(traitNode, 'offset'),
                }
            }
            break;

        case 'door':
            return {
                'ref': ref,
                'prop': {
                    'direction': this.getVector2(traitNode.find('> direction')),
                    'oneWay': this.getBool(traitNode, 'one-way'),
                }
            }
            break;

        case 'fallaway':
            return {
                'ref': ref,
                'prop': {
                    'delay': this.getFloat(traitNode, 'delay'),
                }
            }
            break;

        case 'jump':
            return {
                'ref': ref,
                'prop': {
                    'duration': this.getFloat(traitNode, 'duration'),
                    'falloff': this.getFloat(traitNode, 'falloff'),
                    'force': new THREE.Vector2(this.getFloat(traitNode, 'forward'),
                                               this.getFloat(traitNode, 'force')),
                }
            }
            break;

        case 'health':
            return {
                'ref': ref,
                'prop': {
                    'max': this.getFloat(traitNode, 'max'),
                }
            }
            break;

        case 'invincibility':
            return {
                'ref': ref,
                'prop': {
                    'duration': this.getFloat(traitNode, 'duration'),
                }
            }
            break;

        case 'translating':
            return {
                'ref': ref,
                'prop': {
                    'func': traitNode.attr('func'),
                    'amplitude': this.getVector2(traitNode.find('> amplitude')),
                    'speed': this.getFloat(traitNode, 'speed'),
                }
            }
            break;

        case 'move':
            return {
                'ref': ref,
                'prop': {
                    'speed': this.getFloat(traitNode, 'speed'),
                    'acceleration': this.getFloat(traitNode, 'acceleration'),
                }
            }
            break;

        case 'physics':
            return {
                'ref': ref,
                'prop': {
                    'area': this.getFloat(traitNode, 'area'),
                    'dragCoefficient': this.getFloat(traitNode, 'drag'),
                    'mass': this.getFloat(traitNode, 'mass'),
                }
            }
            break;

        case 'solid':
            return {
                'ref': ref,
                'prop': {
                    'attackAccept': extractAttack(),
                }
            }
            break;

        case 'stun':
            return {
                'ref': ref,
                'prop': {
                    'duration': this.getFloat(traitNode, 'duration'),
                    'force': this.getFloat(traitNode, 'force'),
                }
            }
            break;

        case 'weapon':
            var emitNode = traitNode.find('> projectile-emit');
            return {
                'ref': ref,
                'prop': {
                    'projectileEmitOffset': this.getVector2(emitNode),
                    'projectileEmitRadius': this.getFloat(emitNode, 'r'),
                },
                'equip': traitNode.attr('equip'),
            }
            break;

        default:
            var def = {
                'ref': ref,
                'prop': {},
            }
            $.each(traitNode[0].attributes, function(i, attr) {
                if (attr.name === 'source') {
                    return;
                }
                var value = parseFloat(attr.value)
                if (!isFinite(value)) {
                    value = attr.value;
                }
                def.prop[attr.name] = value;
            });
            return def;
            break;
    }

    function extractAttack()
    {
        var attack = traitNode.attr('attack');
        if (attack) {
            var surfaces = [];
            var S = Game.traits.Solid.prototype;
            var map = {
                'top': S.TOP,
                'bottom': S.BOTTOM,
                'left': S.LEFT,
                'right': S.RIGHT,
            }
            attacks = attack.split(' ');
            for (var i = 0, l = attacks.length; i < l; ++i) {
                var a = attacks[i];
                if (map[a] === undefined) {
                    throw new Error('Invalid attack direction "' + a + '"');
                }
                surfaces.push(map[a]);
            }
            return surfaces;
        }
        return undefined;
    }
}

Game.Loader.XML.Parser.prototype.getVector2 = function(node, attrX, attrY, def)
{
    var node = $(node);
    var x = node.attr(attrX || 'x');
    var y = node.attr(attrY || 'y');
    if (x === undefined || y === undefined) {
        return def;
    }
    return new THREE.Vector2(parseFloat(x),
                             parseFloat(y));
}

Game.Loader.XML.Parser.prototype.getVector3 = function(node, attrX, attrY, attrZ, def)
{
    var node = $(node);
    var x = node.attr(attrX || 'x');
    var y = node.attr(attrY || 'y');
    var z = node.attr(attrZ || 'z');
    if (x === undefined || y === undefined) {
        return def;
    }
    return new THREE.Vector3(parseFloat(x),
                             parseFloat(y),
                             parseFloat(z));
}
