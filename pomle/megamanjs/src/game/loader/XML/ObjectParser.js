Game.Loader.XML.Parser.ObjectParser = function(loader)
{
    Game.Loader.XML.Parser.call(this, loader);

    this.animations = [];
    this.textures = [];
    this.items = new Set();
}

Engine.Util.extend(Game.Loader.XML.Parser.ObjectParser,
                   Game.Loader.XML.Parser);

Game.Loader.XML.Parser.ObjectParser.prototype.createObject = function(name, ext, func)
{
    name = name.replace(/-/g, '');
    var object = Engine.Util.renameFunction(name, func);
    Engine.Util.extend(object, ext);
    return object;
}

Game.Loader.XML.Parser.ObjectParser.prototype.getObject = function(objectNode)
{
    var parser = this,
        loader = parser.loader;

    var objectId = objectNode.attr('id'),
        type = objectNode.attr('type'),
        source = objectNode.attr('source');

    switch(type) {
        case 'character':
            var sourceObject = Game.objects.characters[source] || Game.objects.Character;
            break;
        default:
            var sourceObject = Engine.Object;
            break;
    }

    // For the local constructor
    var animations = {},
        animators = [],
        geometries = [],
        localTextures = [];

    for (var i = 0, l = this.animations.length; i < l; ++i) {
        if (this.animations[i].id) {
            animations[this.animations[i].id] = this.animations[i].animation;
        }
    }

    for (var i = 0, l = this.textures.length; i < l; ++i) {
        localTextures.push(this.textures[i].texture);
        if (this.textures[i].id) {
            localTextures[this.textures[i].id] = this.textures[i].texture;
        }
    }

    var geometryNodes = objectNode.find('> geometry');
    if (geometryNodes.length === 0) {
        throw new Error("No <geometry> defined in " + objectNode[0].outerHTML);
    }

    geometryNodes.each(function() {
        var geometryNode = $(this);
        var geometry = parser.getGeometry(geometryNode);
        var segs = parser.getVector2(geometryNode, 'w-segments', 'h-segments', new THREE.Vector2(1,1));

        var bullshitUV = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        for (var i = 0, l = geometry.faceVertexUvs[0].length; i !== l; ++i) {
            geometry.faceVertexUvs[0][i] = bullshitUV;
        }

        var geometryObject = {
            geometry: geometry,
            size: parser.getVector2(geometryNode, 'w', 'h'),
        }

        var faceNodes = geometryNode.find('> face');
        if (faceNodes.length > 0) {
            faceNodes.each(function(nodeSiblingIndex) {
                var faceNode = $(this);

                var animator = new Engine.Animator.UV();
                animator.indices = [];
                animator.offset = parser.getFloat(faceNode, 'offset', 0);

                var animationId = faceNode.attr('animation');
                animator.name = animationId;
                if (animationId === undefined) {
                    if (!parser.animations[0]) {
                        throw new Error("No default animation defined");
                    }
                    var animationObject = parser.animations[0];
                }
                else {
                    if (!parser.animations[animationId]) {
                        throw new Error("Animation " + animationId + " not defined");
                    }
                    var animationObject = parser.animations[animationId];
                }

                animator.setAnimation(animationObject.animation);
                animators.push(animator);

                var rangeNodes = faceNode.find('> range');
                if (rangeNodes.length) {
                    rangeNodes.each(function() {
                        var rangeNode = $(this);

                        try {
                            var range = {
                                'x': parser.getRange(rangeNode, 'x', segs.x),
                                'y': parser.getRange(rangeNode, 'y', segs.y),
                            };
                        } catch (e) {
                            console.error('Range node %s range error (%d,%d)', rangeNode[0].outerHTML, segs.x, segs.y);
                            throw e;
                        }

                        var i, j, x, y, faceIndex;
                        for (i in range.x) {
                            x = range.x[i] - 1;
                            for (j in range.y) {
                                y = range.y[j] - 1;
                                /* The face index is the first of the two triangles that make up a rectangular
                                   face. The Animator.UV will set the UV map to the faceIndex and faceIndex+1.
                                   Since we expect to paint two triangles at every index we need to 2x the index
                                   count so that we skip two faces for every index jump. */
                                faceIndex = (x + (y * segs.x)) * 2;
                                animator.indices.push(faceIndex);
                            }
                        }
                    });
                }

                var indexJSON = faceNode.attr('index');
                if (indexJSON !== undefined) {
                    var indices = JSON.parse(indexJSON);
                    Array.prototype.push.apply(animator.indices, indices);
                }

                /* If we had no ranges, and no indexes defined,
                   take index from order of <face> nodes. */
                if (animator.indices.length === 0) {
                    animator.indices = [nodeSiblingIndex * 2];
                }
            });
        }
        else if (parser.animations.length) {
            var animator = new Engine.Animator.UV();
            animator.setAnimation(parser.animations[0].animation);
            animator.update();
            animators.push(animator);
        }

        geometries.push(geometryObject);
    });


    var traitDescriptors = [];
    objectNode.find('> traits > trait').each(function() {
        var traitNode = $(this);
        traitDescriptors.push(parser.getTrait(traitNode));
    });

    var animationRouterFunction = undefined;
    objectNode.find('animation-router').each(function(index, node) {
        (function() {
            var animationRouter = undefined;
            eval(node.textContent);
            if (typeof animationRouter === "function") {
                animationRouterFunction = animationRouter;
            }
        }());
    });

    var collision = [];
    objectNode.find('> collision > rect').each(function() {
        var rectNode = $(this);
        collision.push(parser.getRect(rectNode));
    });

    var object = this.createObject(objectId, sourceObject, function()
    {
        this.geometry = geometries[0].geometry.clone();
        if (this.textures.length) {
            this.material = new THREE.MeshPhongMaterial({
                map: this.textures[0],
                side: THREE.DoubleSide,
                transparent: true,
            });
        }

        sourceObject.call(this);

        this.name = objectId;

        for (var i in traitDescriptors) {
            var trait = traitDescriptors[i];
            var appliedTrait = parser.applyTrait(this, trait);

            switch (appliedTrait.NAME) {
                case 'weapon':
                    if (trait.equip) {
                        if (!Game.objects.weapons[trait.equip]) {
                            throw new Error('Weapon ' + trait.equip + ' not found');
                        }
                        appliedTrait.equip(new Game.objects.weapons[trait.equip]());
                    }
                    break;
            }
        }

        /* Run initial update of all UV maps. */
        for (var i in animators) {
            var animator = animators[i].clone();
            animator.addGeometry(this.geometry);
            animator.update();
            this.animators.push(animator);
        }

        for (var i in collision) {
            var r = collision[i];
            this.addCollisionRect(r.w, r.h, r.x, r.y);
        }
    });

    object.prototype.animations = animations;
    object.prototype.textures = localTextures;
    if (animationRouterFunction !== undefined) {
        object.prototype.routeAnimation = animationRouterFunction;
    }

    this.items.add({
        object: object,
        node: objectNode,
    });

    return object;
}

Game.Loader.XML.Parser.ObjectParser.prototype.parse = function(objectsNode, callback)
{
    var objectsNode = $(objectsNode),
        parser = this,
        loader = parser.loader;

    if (!objectsNode.is('objects')) {
        throw new TypeError('Node not <objects>');
    }

    objectsNode.find('> textures').each(function() {
        parser.parseTextures(this);
    });
    if (parser.textures.length == 0) {
        console.warn("No textures found");
    }

    objectsNode.find('> animations').each(function() {
        parser.parseAnimations(this);
    });
    if (parser.animations.length == 0) {
        console.warn("No animations found");
    }

    var objects = {};
    objectsNode.find('> object').each(function() {
        var objectNode = $(this),
            objectId = objectNode.attr('id'),
            object = parser.getObject(objectNode);

        if (objects[objectId]) {
            throw new Error("Object " + objectId + " already defined");
        }
        objects[objectId] = object;
    });

    if (callback) {
        callback(objects, this);
    }

    return objects;
}

Game.Loader.XML.Parser.ObjectParser.prototype.parseAnimations = function(animationsNode)
{
    var animationsNode = $(animationsNode),
        parser = this,
        loader = parser.loader;

    var textureId = animationsNode.attr('texture');
    if (textureId === undefined) {
        if (!parser.textures[0]) {
            throw new Error("No default texture defined");
        }
        var textureObject = parser.textures[0];
    }
    else {
        if (!parser.textures[textureId]) {
            throw new Error("Texture " + textureId + " not defined");
        }
        var textureObject = parser.textures[textureId];
    }

    var animationsSize = parser.getVector2(animationsNode, 'w', 'h');
    animationsNode.find('> animation').each(function() {
        var animationNode = $(this);

        var animationId = animationNode.attr('id');
        var animationGroup = animationNode.attr('group');
        var animation = new Engine.Animator.Animation(animationId, animationGroup);
        var animationSize = parser.getVector2(animationNode, 'w', 'h', animationsSize);

        animationNode.find('> frame').each(function() {
            var frameNode = $(this);
            var offset = parser.getVector2(frameNode, 'x', 'y');
            var frameSize = parser.getVector2(frameNode, 'w', 'h', animationSize);
            var uvMap = new Engine.UVCoords(offset.x, offset.y,
                                            frameSize.x, frameSize.y,
                                            textureObject.size.x, textureObject.size.y);
            var duration = parseFloat(frameNode.attr('duration')) || undefined;
            animation.addFrame(uvMap, duration);
        });

        var animationObject = {
            id: animationId,
            animation: animation,
            texture: textureObject.texture,
        }

        if (animationObject.id) {
            parser.animations[animationObject.id] = animationObject;
        }
        parser.animations.push(animationObject);
    });
}

Game.Loader.XML.Parser.ObjectParser.prototype.parseTextures = function(texturesNode)
{
    var texturesNode = $(texturesNode),
        parser = this,
        loader = parser.loader;

    texturesNode.find('> texture').each(function() {
        var textureNode = $(this);
        var texture = parser.getTexture(this);

        var textureObject = {
            id: textureNode.attr('id'),
            texture: texture,
            size: parser.getVector2(textureNode, 'w', 'h'),
        }
        if (textureObject.id) {
            parser.textures[textureObject.id] = textureObject;
        }
        parser.textures.push(textureObject);
    });
}
