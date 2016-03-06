/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseModel
     * @extends Backbone.Model
     */
    return Backbone.Model.extend({
        /**
         * @method equals
         * @param {String} attribute
         * @param {Boolean|String} value
         * @returns {Boolean}
         */
        equals: function(attribute, value) {
            return this.get(attribute) === value;
        }
    });
});