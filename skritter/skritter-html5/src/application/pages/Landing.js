/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/landing.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageLanding
     * @extends BasePage
     */
    var PageLanding = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.landing.title;
        },
        /**
         * @method render
         * @returns {PageLanding}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            app.sidebars.disable();
            this.elements.tagline = this.$('.tagline');
            switch (app.get('languageCode')) {
                case 'zh':
                    this.elements.tagline.text(app.strings.landing['tagline-chinese']);
                    break;
                case 'ja':
                    this.elements.tagline.text(app.strings.landing['tagline-japanese']);
                    break;
                default:
                    this.elements.tagline.text(app.strings.landing.tagline);
                    break;
            }
            return this;
        }
    });

    return PageLanding;
});
