/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataSRSConfig
     * @extends BaseModel
     */
    var DataSRSConfig = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'part'
    });

    return DataSRSConfig;
});
