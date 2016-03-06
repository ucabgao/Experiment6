/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseRouter
     * @extends Backbone.Router
     */
    return Backbone.Router.extend({
        /**
         * @property currentPage
         * @type BasePage
         */
        currentPage: undefined,
        /**
         * @method after
         */
        after: function() {
            if (this.currentPage) {
                if (this.currentPage.title) {
                    this.currentPage.setTitle(this.currentPage.title);
                    if (app.analytics) {
                        app.analytics.trackView(this.currentPage.title);
                    }
                }
                this.currentPage.$("input[type='checkbox']").bootstrapSwitch();
                this.currentPage.preloadFont();
            }
        },
        /**
         * @method back
         */
        back: function() {
            history.back();
        },
        /**
         * @method before
         */
        before: function() {
            if (app.sidebars && app.sidebars.isExpanded()) {
                app.sidebars.hide();
            }
            if (this.currentPage) {
                this.currentPage.remove();
            }
            if (app.timer) {
                app.timer.stop();
            }
            this.currentPage = undefined;
        },
        /**
         * @method defaultRoute
         */
        defaultRoute: function() {
            this.navigate(app.isLocalhost() ? '/#' : '', {replace: true, trigger: true});
        },
        /**
         * @method switch
         * @param {String} page
         * @returns {BaseRouter}
         */
        switch: function(page) {
            this.before();
            this['show' + page]();
            this.after();
            return this;
        }
    });
});