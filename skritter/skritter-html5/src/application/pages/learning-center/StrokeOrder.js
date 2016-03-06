/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/learning-center/stroke-order.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageStrokeOrder
     * @extends BasePage
     */
    var PageStrokeOrder = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings['learning-center']['stroke-order'].title;
        },
        /**
         * @method render
         * @returns {PageStrokeOrder}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {})
    });

    return PageStrokeOrder;
});
