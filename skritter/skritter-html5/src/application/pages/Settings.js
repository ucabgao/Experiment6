/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/settings.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageSettings
     * @extends BasePage
     */
    var PageSettings = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.settings.title;
            this.settings = app.user.settings;
        },
        /**
         * @method render
         * @returns {PageSettings}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.settingAudio = this.$('#audio');
            this.elements.settingAudioTTS = this.$('#audio-tts');
            this.elements.settingAutoAdd = this.$('#auto-add');
            this.elements.settingAutoAddLimit = this.$('#auto-add-limit');
            this.elements.settingAutoAdvance = this.$('#auto-advance');
            this.elements.settingAutoAdvanceTime = this.$('#auto-advance-time');
            this.elements.settingGradingColor = this.$('#grading-color');
            this.elements.settingHeisig = this.$('#heisig');
            this.elements.settingHideReading = this.$('#hide-reading');
            this.elements.settingRawSquigs = this.$('#raw-squigs');
            this.elements.settingReadingStyle = this.$('#reading-style');
            this.elements.settingSentences = this.$('#example-sentences');
            this.elements.settingStudyKana = this.$('#study-kana');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageSettings}
         */
        renderElements: function() {
            this.undelegateEvents();
            this.elements.settingAudio.bootstrapSwitch('state', this.settings.get('volume') ? true : false);
            this.elements.settingAudioTTS.bootstrapSwitch('state', this.settings.get('audioTTS'));
            this.elements.settingAutoAdd.bootstrapSwitch('state', this.settings.get('autoAdd'));
            this.elements.settingGradingColor.bootstrapSwitch('state', this.settings.get('gradingColor'));
            this.elements.settingHeisig.bootstrapSwitch('state', this.settings.get('showHeisig'));
            this.elements.settingHideReading.bootstrapSwitch('state', this.settings.get('hideReading'));
            this.elements.settingRawSquigs.bootstrapSwitch('state', this.settings.get('squigs'));
            this.elements.settingSentences.bootstrapSwitch('state', this.settings.get('sentences'));
            if (app.user.isChinese()) {
                this.elements.settingReadingStyle.bootstrapSwitch('state', this.settings.get('readingStyle') === 'pinyin' ? true : false);
            } else {
                this.elements.settingReadingStyle.parent().parent().hide();
            }
            if (app.user.isJapanese()) {
                this.elements.settingStudyKana.bootstrapSwitch('state', this.settings.get('studyKana'));
            } else {
                this.elements.settingStudyKana.parent().parent().hide();
            }
            this.elements.settingAutoAddLimit.val(this.settings.get('autoAddLimit'));
            this.delegateEvents();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'change #auto-add-limit': 'toggleSettings',
            'switchChange.bootstrapSwitch #audio': 'toggleSettings',
            'switchChange.bootstrapSwitch #auto-add': 'toggleSettings',
            'switchChange.bootstrapSwitch #grading-color': 'toggleSettings',
            'switchChange.bootstrapSwitch #heisig': 'toggleSettings',
            'switchChange.bootstrapSwitch #hide-reading': 'toggleSettings',
            'switchChange.bootstrapSwitch #raw-squigs': 'toggleSettings',
            'switchChange.bootstrapSwitch #reading-style': 'toggleSettings',
            'switchChange.bootstrapSwitch #example-sentences': 'toggleSentences',
            'switchChange.bootstrapSwitch #study-kana': 'toggleStudyKana'
        }),
        /**
         * @method toggleSentences
         * @param {Event} event
         */
        toggleSentences: function(event) {
            event.preventDefault();
            var self = this;
            app.analytics.trackEvent('Settings', 'click', 'sentences');
            app.user.data.toggleSentences(function() {
                app.reload();
            }, function() {
                self.renderElements();
            });
        },
        /**
         * @method toggleStudyKana
         * @param {Event} event
         */
        toggleStudyKana: function(event) {
            event.preventDefault();
            var self = this;
            app.analytics.trackEvent('Settings', 'click', 'study_kana');
            app.user.data.toggleKana(function() {
                app.reload();
            }, function() {
                self.renderElements();
            });
        },
        /**
         * @method toggleSettings
         * @param {Event} event
         */
        toggleSettings: function(event) {
            event.preventDefault();
            this.settings.set({
                autoAdd: this.elements.settingAutoAdd.bootstrapSwitch('state'),
                autoAddLimit: this.elements.settingAutoAddLimit.val() ? this.elements.settingAutoAddLimit.val() : 10,
                autoAdvance: this.elements.settingAutoAdvance.bootstrapSwitch('state'),
                autoAdvanceTime: this.elements.settingAutoAdvanceTime.val() ? this.elements.settingAutoAdvanceTime.val() : 3,
                gradingColor: this.elements.settingGradingColor.bootstrapSwitch('state'),
                hideReading: this.elements.settingHideReading.bootstrapSwitch('state'),
                readingStyle: this.elements.settingReadingStyle.bootstrapSwitch('state') ? 'pinyin' : 'zhuyin',
                showHeisig: this.elements.settingHeisig.bootstrapSwitch('state'),
                squigs: this.elements.settingRawSquigs.bootstrapSwitch('state'),
                volume: this.elements.settingAudio.bootstrapSwitch('state') ? 1 : 0
            }).update();
        }
    });

    return PageSettings;
});
