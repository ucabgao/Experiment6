/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'prompts/CanvasStroke'
], function(BaseCollection, CanvasStroke) {
    /**
     * @class CanvasCharacter
     * @extend BaseCollection
     */
    var CanvasCharacter = BaseCollection.extend({
        /**
         * @property model
         * @type CanvasStroke
         */
        model: CanvasStroke,
        /**
         * @method comparator
         * @param {CanvasStroke} stroke
         * @returns {Number}
         */
        comparator: function(stroke) {
            return stroke.attributes.position;
        },
        /**
         * @method contains
         * @param {CanvasStroke} stroke
         * @returns {Boolean}
         */
        contains: function(stroke) {
            var newId = stroke.id;
            var newContained = stroke.getContainedIds();
            for (var a = 0, lengthA = this.length; a < lengthA; a++) {
                var id = this.at(a).id;
                var contains = this.at(a).getContainedIds();
                if (newId === id) {
                    return true;
                }
                for (var b = 0, lengthB = contains.length; b < lengthB; b++) {
                    if (newContained.indexOf(contains[b]) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * @method expectedStroke
         * @returns {CanvasStroke}
         */
        getExpectedStroke: function() {
            var variation = this.getExpectedVariations(true)[0];
            if (this.length === 0) {
                return variation.at(0);
            }
            return variation.at(this.length);
        },
        /**
         * @method expectedVariations
         * @param {Boolean} [filterLength]
         * @returns {Array}
         */
        getExpectedVariations: function(filterLength) {
            var expectedTargets = [];
            var targetScores = [];
            for (var a = 0, lengthA = this.targets.length; a < lengthA; a++) {
                targetScores[a] = 0;
                var target = this.targets[a];
                for (var b = 0, lengthB = this.length; b < lengthB; b++) {
                    var strokeId = this.at(b).id;
                    if (target.findWhere({id: strokeId})) {
                        targetScores[a]++;
                    }
                }
            }
            var targetScore = targetScores[targetScores.indexOf(Math.max.apply(Math, targetScores))];
            for (var c = 0, lengthC = targetScores.length; c < lengthC; c++) {
                if (targetScores[c] === targetScore) {
                    expectedTargets.unshift(this.targets[c]);
                }
            }
            if (expectedTargets.length) {
                if (filterLength) {
                    var expectedLength = Math.max.apply(Math, _.pluck(expectedTargets, 'length'));
                    expectedTargets = expectedTargets.filter(function(expectedTarget) {
                        return expectedTarget.length === expectedLength;
                    });
                }
            } else {
                expectedTargets = [this.targets[0]];
            }
            return expectedTargets;
        },
        /**
         * @method getPosition
         * @returns {Number}
         */
        getPosition: function() {
            var position = 1;
            for (var i = 0, length = this.length; i < length; i++) {
                var contains = this.at(i).get('contains');
                position += contains.length ? contains.length : 1;
            }
            return position;
        },
        /**
         * @method getMax
         * @returns {Number}
         */
        getMax: function() {
            var max = 0;
            for (var i = 0, length = this.targets.length; i < length; i++) {
                var targetMax = this.targets[i].getPosition();
                max = targetMax > max ? targetMax : max;
            }
            return max;
        },
        /**
         * @method getShape
         * @param {Number} excludeStrokePosition
         * @returns {createjs.Container}
         */
        getShape: function(excludeStrokePosition) {
            var shapeContainer = new createjs.Container();
            shapeContainer.name = 'character';
            for (var i = 0, length = this.models.length; i < length; i++) {
                if (i !== excludeStrokePosition - 1) {
                    shapeContainer.addChild(this.models[i].getShape());
                }
            }
            return shapeContainer;
        },
        /**
         * @method getTone
         * @param {Number} tone
         * @returns {CanvasStroke}
         */
        getTone: function(tone) {
            if (this.name === 'tones') {
                return this.targets[tone - 1].models[0];
            }
            return null;
        },
        /**
         * @method isComplete
         * @returns {Boolean}
         */
        isComplete: function() {
            return this.getPosition() >= this.getMax();
        },
        /**
         * @method recognizeStroke
         * @param {Array} points
         * @param {createjs.Shape} shape
         * @returns {Boolean|CanvasStroke}
         */
        recognizeStroke: function(points, shape) {
            var stroke = app.fn.recognizer.recognize(this, new CanvasStroke({points: points}));
            if (stroke && !this.contains(stroke)) {
                stroke.set('squig', shape);
                this.add(stroke);
                return stroke;
            }
            return false;
        }
    });

    return CanvasCharacter;
});
