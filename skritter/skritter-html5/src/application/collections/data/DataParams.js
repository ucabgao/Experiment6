/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataParam',
    'application/Params'
], function(BaseCollection, DataParam, Params) {
    /**
     * @class DataParams
     * @extend BaseCollection
     */
    var DataParams = BaseCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.add(Params.getParams());
        },
        /**
         * @property model
         * @type DataParam
         */
        model: DataParam
    });

    return DataParams;
});
