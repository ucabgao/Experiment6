/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataSentence'
], function(BaseCollection, DataSentence) {
    /**
     * @class DataSentences
     * @extend BaseCollection
     */
    var DataSentences = BaseCollection.extend({
        /**
         * @property model
         * @type DataSentence
         */
        model: DataSentence
    });

    return DataSentences;
});
