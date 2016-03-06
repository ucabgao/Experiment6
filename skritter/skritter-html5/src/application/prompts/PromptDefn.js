/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/prompts/prompt-defn.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptDefn
     * @extends {Prompt}
     */
    var PromptDefn = Prompt.extend({
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
         * @returns {PromptDefn}
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
         * @returns {PromptDefn}
         */
        renderAnswer: function() {
            Prompt.prototype.renderAnswer.call(this);
            if (app.user.settings.isAudioEnabled()) {
                this.vocab.playAudio();
            }
            this.elements.buttonWrong.hide();
            this.elements.fieldDefinition.html(this.vocab.getDefinition());
            if (app.user.settings.get('showHeisig') && this.vocab.has('heisigDefinition')) {
                this.elements.fieldHeisig.text('Keyword: ' + this.vocab.get('heisigDefinition'));
            } else {
                this.elements.fieldHeisig.hide();
            }
            this.elements.fieldHelpText.hide();
            this.elements.fieldQuestion.hide();
            if (this.vocab.isJapanese() && app.fn.isKana(this.vocab.get('writing'))) {
                this.elements.fieldReading.empty();
            } else {
                this.elements.fieldReading.html(this.vocab.getReading(null, {
                    style: app.user.settings.get('readingStyle')
                }));
            }
            this.elements.fieldWriting.html(this.vocab.getWriting());
            this.elements.fieldHighlight.show();
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptDefn}
         */
        renderQuestion: function() {
            Prompt.prototype.renderQuestion.call(this);
            this.elements.fieldHighlight.hide();
            this.elements.fieldQuestion.html(app.strings.prompt['definition-question']);
            this.elements.fieldWriting.html(this.vocab.getWriting());
            return this;
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         */
        handlePromptClicked: function(event) {
            if (Prompt.prototype.handlePromptClicked.call(this, event)) {
                if (this.review.getAt('answered')) {
                    this.gradingButtons.triggerSelected();
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
         * @returns {PromptDefn}
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
                this.elements.fieldHighlight.css({
                    'max-height': contentHeight / 2.2,
                    margin: '15px'
                });
            } else {
                this.$el.css({
                    height: canvasSize,
                    width: contentWidth
                });
                this.elements.fieldHighlight.css({
                    'max-height': contentHeight / 3.8,
                    margin: '15px 60px'
                });
            }
            return this;
        }
    });

    return PromptDefn;
});
