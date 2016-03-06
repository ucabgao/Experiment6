/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/account-creation/language-select.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageLanguageSelect
     * @extends BasePage
     */
    var PageLanguageSelect = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Language Select';
        },
        /**
         * @method render
         * @returns {PageLanguageSelect}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.languageContainer = this.$('#language-container');
            this.elements.chineseOptions = this.$('#chinese-options-container');
            this.elements.selectChinese = this.$('#select-chinese');
            this.elements.selectJapanese = this.$('#select-japanese');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageLanguageSelect}
         */
        renderElements: function() {
            if (app.get('languageCode') === 'ja') {
                app.api.setGuest('lang', 'ja');
                this.next();
            } else if (app.get('languageCode') === 'zh') {
                this.elements.languageContainer.hide();
            } else {
                this.elements.chineseOptions.hide();
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick .language-select': 'handleLanguageSelected'
        }),
        /**
         * @method handleLanguageSelected
         * @param {Function} event
         */
        handleLanguageSelected: function(event) {
            event.preventDefault();
            switch (event.target.id) {
                case 'select-chinese':
                    this.elements.languageContainer.hide();
                    this.elements.chineseOptions.show();
                    break;
                case 'select-chinese-both':
                    app.api.setGuest('lang', 'zh');
                    app.api.setGuest('style', 'both');
                    mixpanel.track('Selected Creation Style', {"Language Style": "Both"});
                    this.next();
                    break;
                case 'select-chinese-simp':
                    app.api.setGuest('lang', 'zh');
                    app.api.setGuest('style', 'simp');
                    mixpanel.track('Selected Creation Style', {"Language Style": "Simplified"});
                    this.next();
                    break;
                case 'select-chinese-trad':
                    app.api.setGuest('lang', 'zh');
                    app.api.setGuest('style', 'trad');
                    mixpanel.track('Selected Creation Style', {"Language Style": "Traditional"});
                    this.next();
                    break;
                case 'select-japanese':
                    app.api.setGuest('lang', 'ja');
                    this.next();
                    break;
            }
        },
        /**
         * @method next
         */
        next: function() {
            app.router.navigate('getting-started/list-select', {trigger: true});
        }
    });

    return PageLanguageSelect;
});
