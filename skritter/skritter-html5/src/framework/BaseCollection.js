/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseCollection
     * @extends Backbone.Collection
     */
    return Backbone.Collection.extend({
        /**
         * @method lazyAdd
         * @param {Array|Object} models
         * @param {Function} callback
         * @param {Object} [options]
         */
        lazyAdd: function(models, callback, options) {
            models = Array.isArray(models) ? models : [models];
            (function add(self) {
                self.add(models.splice(0, 199), options);
                if (models.length > 0) {
                    setTimeout(add, 0, self);
                } else {
                    callback();
                }
            })(this);
        }
    });
});