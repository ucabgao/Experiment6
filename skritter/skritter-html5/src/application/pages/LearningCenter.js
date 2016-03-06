/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/learning-center.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageLearningCenter
     * @extends BasePage
     */
    var PageLearningCenter = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings['learning-center'].title;
        },
        /**
         * @method render
         * @returns {PageLearningCenter}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            return this;
        }
    });

    return PageLearningCenter;
});
