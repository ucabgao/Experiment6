/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataSRSConfig'
], function(BaseCollection, DataSRSConfig) {
    /**
     * @class DataSRSConfigs
     * @extend BaseCollection
     */
    var DataSRSConfigs = BaseCollection.extend({
        /**
         * @property model
         * @type DataSRSConfig
         */
        model: DataSRSConfig,
        /**
         * @method getConfigs
         * @param {String} part
         */
        getConfigs: function(part) {
            return this.get(part) ? this.get(part).toJSON() : this.getDefault();
        },
        /**
         * @method getDefault
         * @param {Object}
         */
        getDefault: function() {
            return {
                'initialWrongInterval': 600,
                'wrongFactors': [0.25, 0.25, 0.25, 0.25],
                'rightFactors': [2.2, 2.2, 2.2, 2.2],
                'initialRightInterval': 604800
            };
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('srsconfigs', function(data) {
                self.reset();
                self.lazyAdd(data, callback);
            });
        }
    });

    return DataSRSConfigs;
});
