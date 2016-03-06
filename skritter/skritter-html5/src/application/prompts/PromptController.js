/**
 * @module Application
 */
define([
    'framework/BaseView',
    'require.text!templates/prompts/prompt.html',
    'prompts/PromptCanvas',
    'prompts/PromptGradingButtons',
    'prompts/PromptDefn',
    'prompts/PromptRdng',
    'prompts/PromptRune',
    'prompts/PromptTone',
], function(BaseView, DesktopTemplate, PromptCanvas, PromptGradingButtons, PromptDefn, PromptRdng, PromptRune, PromptTone) {
    /**
     * @class PromptController
     * @extends {BaseView}
     */
    var PromptController = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.prompt = undefined;
            this.canvas = new PromptCanvas();
            this.gradingButtons = new PromptGradingButtons();
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PromptController}
         */
        render: function() {
            this.$el.append(this.compile(DesktopTemplate));
            this.canvas.setElement(this.$('.canvas-container')).render();
            this.gradingButtons.setElement(this.$('.grading-container')).render();
            this.elements.canvasContainer = this.$('.canvas-container');
            this.elements.gradingContainer = this.$('.grading-container');
            this.elements.navigateNext = this.$('.navigate-next');
            this.elements.navigatePrevious = this.$('.navigate-previous');
            this.elements.prompt = this.$('.prompt');
            this.renderElements();
            this.resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PromptController}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
            'vclick .navigate-next': 'handleNavigateNextClicked',
            'vclick .navigate-previous': 'handleNavigatePreviousClicked'
        }),
        /**
         * @method handleNavigateNextClicked
         * @param {Event} event
         */
        handleNavigateNextClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Prompt', 'click', 'next');
            this.prompt.next();
        },
        /**
         * @method handleNavigatePreviousClicked
         * @param {Event} event
         */
        handleNavigatePreviousClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Prompt', 'click', 'previous');
            this.prompt.previous();
        },
        /**
         * @method loadPrompt
         * @param {DataReview} review
         * @returns {PromptController}
         */
        loadPrompt: function(review) {
            this.reset();
            switch (review.get('part')) {
                case 'defn':
                    this.prompt = new PromptDefn(null, this, review);
                    break;
                case 'rdng':
                    this.prompt = new PromptRdng(null, this, review);
                    break;
                case 'rune':
                    this.prompt = new PromptRune(null, this, review);
                    break;
                case 'tone':
                    this.prompt = new PromptTone(null, this, review);
                    break;
            }
            return this.prompt.render();
        },
        /**
         * @method reset
         * @returns {PromptController}
         */
        reset: function() {
            if (this.prompt) {
                this.prompt.remove();
                this.prompt = undefined;
            }
            this.canvas.hide().clearAll();
            this.gradingButtons.hide().select(3);
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            this.reset();
            BaseView.prototype.remove.call(this);
        },
        /**
         * @method resize
         * @returns {PromptController}
         */
        resize: function() {
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            if (app.isPortrait()) {
                this.canvas.resize(contentWidth);
                this.elements.prompt.height(contentHeight);
            } else {
                this.canvas.resize(contentHeight);
                this.elements.prompt.height(this.canvas.getWidth());
            }
            if (this.prompt) {
                this.prompt.resize();
            }
            app.fn.recognizer.canvasSize = this.canvas.getSize();
            return this;
        },
        /**
         * @method triggerNext
         */
        triggerNext: function() {
            this.trigger('prompt:next');
        },
        /**
         * @method triggerPrevious
         */
        triggerPrevious: function() {
            this.trigger('prompt:previous');
        },
        /**
         * @method triggerPromptComplete
         * @param {DataReview} review
         */
        triggerPromptComplete: function(review) {
            this.trigger('prompt:complete', review);
        }
    });

    return PromptController;
});
