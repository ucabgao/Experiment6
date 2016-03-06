/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataDecomp'
], function(BaseCollection, DataDecomp) {
    /**
     * @class DataDecomps
     * @extend BaseCollection
     */
    var DataDecomps = BaseCollection.extend({
        /**
         * @property model
         * @type DataDecomp
         */
        model: DataDecomp
    });

    return DataDecomps;
});
