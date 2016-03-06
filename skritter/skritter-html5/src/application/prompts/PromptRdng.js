/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/prompts/prompt-rdng.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptRdng
     * @extends {Prompt}
     */
    var PromptRdng = Prompt.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            Prompt.prototype.initialize.call(this, options, controller, review);
        },
        /**
         * @method render
         * @returns {PromptRdng}
         */
        render: function() {
            app.timer.setLimits(30, 15);
            this.$el.html(this.compile(DesktopTemplate));
            Prompt.prototype.render.call(this);
            this.canvas.hideGrid().hide();
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptRdng}
         */
        renderAnswer: function() {
            Prompt.prototype.renderAnswer.call(this);
            if (app.user.settings.isAudioEnabled()) {
                this.vocab.playAudio();
            }
            this.elements.buttonWrong.hide();
            this.elements.fieldHelpText.hide();
            this.elements.fieldQuestion.hide();
            this.elements.fieldReading.html(this.vocab.getReading(null, {
                style: app.user.settings.get('readingStyle')
            }));
            if (this.vocab.isJapanese() && app.fn.isKana(this.vocab.get('writing'))) {
                if (this.vocab.get('writing').length === 1) {
                    this.elements.fieldWriting.html(this.vocab.getWriting());
                    this.elements.fieldReading.html(this.vocab.getDefinition());
                }
                this.elements.fieldDefinition.empty();
            } else {
                this.elements.fieldWriting.html(this.vocab.getWriting());
                this.elements.fieldDefinition.html(this.vocab.getDefinition());
            }
            this.elements.fieldHighlight.show();
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptRdng}
         */
        renderQuestion: function() {
            Prompt.prototype.renderQuestion.call(this);
            this.elements.fieldHighlight.hide();
            if (this.vocab.isJapanese() && app.fn.isKana(this.vocab.get('writing'))) {
                if (this.vocab.get('writing').length === 1 ) {
                    this.elements.fieldWriting.html(this.vocab.getWriting());
                } else {
                    this.elements.fieldJapaneseDefinition.html(this.vocab.getDefinition());
                }
            } else {
                this.elements.fieldWriting.html(this.vocab.getWriting());
            }
            this.elements.fieldQuestion.html(app.strings.prompt['reading-question']);
            return this;
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handlePromptClicked: function(event) {
            if (Prompt.prototype.handlePromptClicked.call(this, event)) {
                if (this.review.getAt('answered')) {
                    this.next();
                } else {
                    this.renderAnswer();
                }
            }
        },
        /**
         * @method handleWrongButtonClicked
         * @param {Event} event
         */
        handleWrongButtonClicked: function(event) {
            if (Prompt.prototype.handleWrongButtonClicked.call(this, event)) {
                this.review.setAt('score', 1);
                this.renderAnswer();
            }
        },
        /**
         * @method resize
         * @returns {PromptRdng}
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = this.canvas.getWidth();
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            if (app.isPortrait()) {
                this.$el.css({
                    height: contentHeight,
                    width: contentWidth
                });
                this.elements.fieldDefinition.css({
                    'max-height': contentHeight / 2.2,
                    'padding': '0 10px'
                });
            } else {
                this.$el.css({
                    height: canvasSize,
                    width: contentWidth
                });
                this.elements.fieldDefinition.css({
                    'max-height': contentHeight / 4,
                    'padding': '0 60px'
                });
            }
            return this;
        }
    });

    return PromptRdng;
});
