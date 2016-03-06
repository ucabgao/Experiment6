/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class CanvasStroke
     * @extends BaseModel
     */
    var CanvasStroke = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('change:points', this.updateCorners);
            this.updateCorners();
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getContainedIds
         * @returns {Array}
         */
        getContainedIds: function() {
            var ids = [];
            var contains = this.get('contains');
            var position = this.get('position');
            for (var i = 0, length = contains.length; i < length; i++) {
                var contained = contains[i];
                ids.push(position + '|' + contained);
                ids.push((position + 1) + '|' + contained);
            }
            return ids;
        },
        /**
         * @method getFirstAngle
         * @returns {Number}
         */
        getFirstAngle: function() {
            return app.fn.getAngle(this.get('corners')[0], this.get('corners')[1]);
        },
        /**
         * @method getParams
         * @returns {Array}
         */
        getParams: function() {
            var inflatedParams = [];
            var matrix = this.getShape().getMatrix();
            var params = app.user.data.params.where({strokeId: this.get('strokeId')});
            for (var a = 0, lengthA = params.length; a < lengthA; a++) {
                var param = params[a].clone();
                if (!param.has('trace')) {
                    var corners = _.cloneDeep(param.get('corners'));
                    for (var b = 0, lengthB = corners.length; b < lengthB; b++) {
                        var inflatedCorner = matrix.transformPoint(corners[b].x, corners[b].y);
                        corners[b].x = inflatedCorner.x;
                        corners[b].y = inflatedCorner.y;
                    }
                    param.set('corners', corners);
                    inflatedParams.push(param);
                }
            }
            return inflatedParams;
        },
        /**
         * @method getRectangle
         * @returns {Object}
         */
        getRectangle: function() {
            var canvasSize = app.get('canvasSize');
            var corners = _.clone(this.get('corners'));
            return app.fn.getBoundingRectangle(corners, canvasSize, canvasSize, 12);
        },
        /**
         * @method getShape
         * @return {createjs.Shape}
         */
        getShape: function() {
            //load shape, bounds and matrix
            var data = this.inflateData();
            var shape = this.get('shape').clone(true);
            var spriteBounds = shape.getBounds();
            if (this.isKana()) {
                shape.x = data.x;
                shape.y = data.y;
                shape.scaleX = data.w / 500;
                shape.scaleY = data.h / 500;
                shape.rotation = data.rot;
            } else {
                //apply rotation based on newly sized shape
                var ms = shape.getMatrix();
                var sx = data.w / spriteBounds.width;
                var sy = data.h / spriteBounds.height;
                ms.scale(sx, sy);
                ms.translate(-data.w / 2, -data.h / 2);
                ms.rotate(data.rot * Math.PI / 180);
                var t = ms.decompose();
                //find the actual position based on prior transformations
                shape.setTransform(t.x, t.y, t.scaleX, t.scaleY, t.rotation, t.skewX, t.skewY);
                var finalBounds = shape.getTransformedBounds();
                shape.name = 'stroke';
                shape.x += finalBounds.width / 2 + data.x;
                shape.y += finalBounds.height / 2 + data.y;
            }
            return shape;
        },
        /**
         * @method getTraceParam
         * @returns {DataParam}
         */
        getTraceParam: function() {
            var matrix = this.getShape().getMatrix();
            var param = app.user.data.params.findWhere({strokeId: this.get('strokeId'), trace: true});
            if (!param) {
                var params = app.user.data.params.where({strokeId: this.get('strokeId')});
                param = params[params.length - 1];
            }
            param = param.clone();
            var corners = _.cloneDeep(param.get('corners'));
            for (var i = 0, length = corners.length; i < length; i++) {
                var inflatedCorner = matrix.transformPoint(corners[i].x, corners[i].y);
                corners[i].x = inflatedCorner.x;
                corners[i].y = inflatedCorner.y;
            }
            param.set('corners', corners);
            return param;
        },
        /**
         * @method getUserShape
         * @returns {createjs.Shape}
         */
        getUserShape: function() {
            var shape = this.getShape();
            var bounds = shape.getBounds();
            var rect = this.getRectangle();
            shape.name = 'stroke';
            shape.x = rect.x;
            shape.y = rect.y;
            shape.scaleX = rect.width / bounds.width;
            shape.scaleY = rect.height / bounds.height;
            return shape;
        },
        /**
         * @method inflatedData
         * @return {Object}
         */
        inflateData: function() {
            var bounds = this.get('shape').getBounds();
            var canvasSize = app.get('canvasSize');
            var data = this.get('data');
            return {
                n: data[0],
                x: data[1] * canvasSize,
                y: data[2] * canvasSize,
                w: data[3] * canvasSize,
                h: data[4] * canvasSize,
                scaleX: (data[3] * canvasSize) / bounds.width,
                scaleY: (data[4] * canvasSize) / bounds.height,
                rot: -data[5]
            };
        },
        /**
         * @method isKana
         * @returns {Boolean}
         */
        isKana: function() {
            return this.get('kana');
        },
        /**
         * @method updateCorners
         */
        updateCorners: function() {
            var clonedPoints = _.clone(this.get('points'));
            this.set('corners', app.fn.shortstraw.process(clonedPoints));
        }
    });

    return CanvasStroke;
});
