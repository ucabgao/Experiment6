/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataSentence
     * @extends BaseModel
     */
    var DataSentence = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getDefinition
         * @param {Boolean} [skipFormat]
         * @returns {String}
         */
        getDefinition: function(skipFormat) {
            var definition = this.get('definitions')[app.user.settings.get('sourceLang')];
            if (definition) {
                definition = definition;
            } else {
                definition = this.get('definitions').en;
            }
            return skipFormat ? definition : app.fn.textToHTML(definition);
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return this.isChinese() ? app.fn.pinyin.toTone(this.get('reading'), true) : this.get('reading');
        },
        /**
         * @method getWriting
         * @returns {String}
         */
        getWriting: function() {
            return this.get('writing').replace(/\s+/g, '');
        },
        /**
         * @method isChinese
         */
        isChinese: function() {
            return this.get('lang') === 'zh';
        },
        /**
         * @method isJapanese
         */
        isJapanese: function() {
            return this.get('lang') === 'ja';
        }
    });

    return DataSentence;
});
