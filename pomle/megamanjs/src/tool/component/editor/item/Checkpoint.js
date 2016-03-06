"use strict";

Editor.Item.Checkpoint = function(checkpoint, node)
{
    let vec = new THREE.Vector3(checkpoint.pos.x, checkpoint.pos.y, 0);

    Editor.Item.Point.call(this, checkpoint, node, vec);

    this.model = new THREE.Mesh(
        new THREE.CircleGeometry(checkpoint.radius, 16),
        this.materials.checkpoint
    );

    this.moveTo(vec);
}

Editor.Item.Checkpoint.prototype = Object.create(Editor.Item.Point.prototype);
Editor.Item.Checkpoint.prototype.constructor = Editor.Item.Checkpoint;

Editor.Item.Checkpoint.prototype.TYPE = 'checkpoint';

Editor.Item.Checkpoint.prototype.materials = {
    checkpoint: new THREE.MeshBasicMaterial({color: 0xeb1e32, wireframe: true}),
}

Editor.Item.Checkpoint.prototype.update = function()
{
    this.object.pos.copy(this.point);
    Editor.Item.Point.prototype.update.call(this);
}
