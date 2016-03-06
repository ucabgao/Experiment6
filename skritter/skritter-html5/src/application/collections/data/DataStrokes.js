/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataStroke',
    'application/Kana',
    'application/Tones'
], function(BaseCollection, DataStroke, Kana, Tones) {
    /**
     * @class DataStrokes
     * @extend BaseCollection
     */
    var DataStrokes = BaseCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.add(Kana.getData());
            this.add(Tones.getData());
        },
        /**
         * @property model
         * @type DataStroke
         */
        model: DataStroke,
        /**
         * @method getTones
         * @returns {CanvasCharacter}
         */
        getCanvasTones: function() {
            return this.get('tones').getCanvasCharacter();
        }
    });

    return DataStrokes;
});