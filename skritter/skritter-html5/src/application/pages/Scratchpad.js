/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/scratchpad.html',
    'prompts/PromptController'
], function(BasePage, Template, PromptController) {
    /**
     * @class PageScratchpad
     * @extends BasePage
     */
    var PageHome = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Scratchpad';
            this.prompt = undefined;
            this.promptController = undefined;
        },
        /**
         * @method render
         * @returns {PageScratchpad}
         */
        render: function() {
            this.$el.html(this.compile(Template));
            this.promptController = new PromptController({el: this.$('.prompt-container')}).render();
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageScratchpad}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-audio': 'handleAudioButtonClicked',
            'vclick #button-info': 'handleInfoButtonClicked'
        }),
        /**
         * @method handleAudioButtonClicked
         * @param {Event} event
         */
        handleAudioButtonClicked: function(event) {
            event.preventDefault();
            if (this.prompt) {
                this.prompt.vocab.playAudio();
            }
        },
        /**
         * @method handleInfoButtonClicked
         * @param {Event} event
         */
        handleInfoButtonClicked: function(event) {
            event.preventDefault();
            app.sidebars.select('info').toggle();
        },
        /**
         * @method load
         * @param {Array} writings
         */
        load: function(writings) {
            var self = this;
            var vocabIds = app.fn.mapper.writingToBase(writings);
            app.api.getVocabById(vocabIds, {
                includeDecomps: true,
                includeHeisig: true,
                includeStrokes: true
            }, function(result) {
                console.log(result);
            }, function(error) {
                console.error('LOAD VOCAB ERROR', error);
            });
        }
    });

    return PageHome;
});