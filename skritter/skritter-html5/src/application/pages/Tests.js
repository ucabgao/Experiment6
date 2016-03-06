/**
 * @module Application
 */
define([
    'framework/BasePage'
], function(BasePage) {
    /**
     * @class PageTests
     * @extends BasePage
     */
    var PageTests = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.tests.title;
        },
        /**
         * @method render
         * @returns {PageTests}
         */
        render: function() {
            return this;
        }
    });

    return PageTests;
});
