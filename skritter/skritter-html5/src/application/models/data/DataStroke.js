/**
 * @module Application
 */
define([
   'framework/BaseModel',
    'prompts/CanvasCharacter',
    'prompts/CanvasStroke'
], function(BaseModel, CanvasCharacter, CanvasStroke) {
    /**
     * @class DataStroke
     * @extends BaseModel
     */
    var DataStroke = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'rune',
        /**
         * @method getCanvasCharacter
         * @returns {CanvasCharacter}
         */
        getCanvasCharacter: function() {
            var character = new CanvasCharacter();
            var targets = [];
            var variations = _.clone(this.get('strokes'));
            var rune = this.get('rune');
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var target = new CanvasCharacter();
                var variation = variations[a];
                var position = 1;
                target.name = rune;
                target.variation = a + 1;
                target.kana = this.get('kana') || false;
                for (var b = 0, lengthB = variation.length; b < lengthB; b++) {
                    var data = variation[b];
                    var stroke = new CanvasStroke();
                    var strokeId = data[0];
                    var param = app.user.data.params.findWhere({strokeId: strokeId});
                    var contains = param.get('contains');
                    stroke.set({
                        contains: contains,
                        data: data,
                        kana: target.kana,
                        id: position + '|' + strokeId,
                        position: position,
                        shape: app.assets.getStroke(strokeId),
                        strokeId: strokeId,
                        tone: rune === 'tones' ? a + 1 : undefined
                    });
                    position += contains.length ? contains.length : 1;
                    target.add(stroke);
                }
                targets.push(target);
            }
            character.name = rune;
            character.targets = rune === 'tones' ? targets : targets.reverse();
            return character;
        }
    });

    return DataStroke;
});
