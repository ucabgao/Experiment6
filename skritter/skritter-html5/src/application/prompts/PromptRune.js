/**
 * @module Application
 */
define([
    'prompts/Prompt',
    'require.text!templates/prompts/prompt-rune.html'
], function(Prompt, DesktopTemplate) {
    /**
     * @class PromptRune
     * @extends {Prompt}
     */
    var PromptRune = Prompt.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            Prompt.prototype.initialize.call(this, options, controller, review);
            this.attempts = 0;
            this.character = undefined;
            this.maxAttempts = 3;
            this.revealed = false;
            this.taps = 0;
        },
        /**
         * @method render
         * @returns {PromptRune}
         */
        render: function() {
            app.timer.setLimits(30, 15);
            this.$el.html(this.compile(DesktopTemplate));
            this.elements.toolbar = this.$('.prompt-toolbar');
            this.elements.toolbarEraser = this.$('#toolbar-eraser');
            this.elements.toolbarReveal = this.$('#toolbar-reveal');
            this.attempts = 0;
            this.taps = 0;
            Prompt.prototype.render.call(this);
            this.canvas.getLayer('stroke').alpha = 1;
            this.canvas.showGrid().show();
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {PromptRune}
         */
        renderAnswer: function() {
            Prompt.prototype.renderAnswer.call(this);
            this.canvas.disableInput();
            if (app.user.settings.isAudioEnabled() && app.user.settings.get('hideReading') && this.review.isLast()) {
                this.vocab.playAudio();
            }
            this.elements.fieldDefinition.html(this.vocab.getDefinition());
            if (app.user.settings.get('showHeisig') && this.vocab.has('heisigDefinition')) {
                this.elements.fieldHeisig.text('Keyword: ' + this.vocab.get('heisigDefinition'));
            }
            if (this.vocab.isJapanese() && app.fn.hasKana(this.vocab.get('writing'))) {
                if (app.fn.isKana(this.vocab.get('writing'))) {
                    this.elements.fieldReading.empty();
                } else if (this.review.isLast()) {
                    this.elements.fieldReading.html(this.vocab.getReading(null, {
                        hide: this.review.isLast() ? false : app.user.settings.get('hideReading'),
                        style: app.user.settings.get('readingStyle')
                    }));
                } else {
                    this.elements.fieldReading.html(this.vocab.getReading(null, {
                        hide: app.user.settings.get('hideReading'),
                        hideKana: app.user.settings.get('studyKana') ? this.vocab.getKana() : [],
                        style: app.user.settings.get('readingStyle')
                    }));
                }
            } else {
                this.elements.fieldReading.html(this.vocab.getReading(app.user.settings.get('hideReading') ? this.position + 1 : null, {
                    hide: this.review.isLast() ? false : app.user.settings.get('hideReading'),
                    style: app.user.settings.get('readingStyle')
                }));
            }
            this.elements.fieldWriting.html(this.vocab.getWriting(this.position + 1, {classes: 'highlight'}));
            if (app.user.settings.get('gradingColor')) {
                var layer = app.user.settings.get('squigs') ? 'background' : 'stroke';
                this.canvas.injectLayerColor(layer, app.user.settings.get('gradingColors')[this.review.getAt('score') - 1]);
            }
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {PromptRune}
         */
        renderQuestion: function() {
            Prompt.prototype.renderQuestion.call(this);
            if (app.user.settings.isAudioEnabled() && !app.user.settings.get('hideReading') && this.review.isFirst()) {
                this.vocab.playAudio();
            }
            this.canvas.enableInput();
            this.elements.fieldDefinition.html(this.vocab.getDefinition());
            if (app.user.settings.get('showHeisig') && this.vocab.has('heisigDefinition')) {
                this.elements.fieldHeisig.text('Keyword: ' + this.vocab.get('heisigDefinition'));
            }
            if (this.vocab.isJapanese() && app.fn.hasKana(this.vocab.get('writing'))) {
                if (app.fn.isKana(this.vocab.get('writing'))) {
                    this.elements.fieldReading.empty();
                } else {
                    this.elements.fieldReading.html(this.vocab.getReading(null, {
                        hide: app.user.settings.get('hideReading'),
                        hideKana: app.user.settings.get('studyKana') ? this.vocab.getKana() : [],
                        style: app.user.settings.get('readingStyle')
                    }));
                }
            } else {
                this.elements.fieldReading.html(this.vocab.getReading(app.user.settings.get('hideReading') ? this.position : null, {
                    hide: app.user.settings.get('hideReading'),
                    style: app.user.settings.get('readingStyle')
                }));
            }
            this.elements.fieldWriting.html(this.vocab.getWriting(this.position, {classes: 'highlight'}));
            this.toggleToolbarEraser();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, Prompt.prototype.events, {
            'vclick #toolbar-eraser': 'handleToolbarEraserClicked',
            'vclick #toolbar-reveal': 'handleToolbarRevealClicked',
            'vclick #toolbar-teach': 'handleToolbarTeachClicked'
        }),
        /**
         * @method handlePromptClicked
         */
        handleCanvasClicked: function() {
            if (app.sidebars.isCollapsed() && this.promptClick) {
                if (this.review.getAt('answered')) {
                    this.next();
                } else if (!this.character.isComplete()) {
                    this.taps++;
                    this.canvas.fadeShape('background', this.character.getExpectedStroke().getShape(), {color: '#b3b3b3', milliseconds: 1000});
                }
            }
        },
        /**
         * @method handleInputDown
         */
        handleInputDown: function() {
            app.timer.stopThinking();
        },
        /**
         * @method handleInputUp
         */
        handleInputUp: function(points, shape) {
            if (points && points.length > 1 && shape) {
                var stroke = this.character.recognizeStroke(points, shape);
                if (stroke) {
                    this.attempts = 0;
                    this.toggleToolbarEraser();
                    this.canvas.lastMouseDownEvent = null;
                    if (app.user.settings.get('squigs')) {
                        this.canvas.getLayer('stroke').alpha = 1;
                        this.canvas.drawShape('stroke', shape);
                    } else {
                        this.canvas.tweenShape('stroke', stroke.getUserShape(), stroke.getShape());
                    }
                    if (this.character.isComplete()) {
                        if (this.taps > 2) {
                            this.review.setAt('score', 1);
                        } else if (this.taps >= 1 && this.character.getMax() < 6) {
                            this.review.setAt('score', 1);
                        } else if (this.taps > 1) {
                            this.review.setAt('score', 2);
                        }
                        if (app.user.settings.get('squigs')) {
                            this.canvas.tweenCharacter('background', this.review.getCharacter());
                            if (app.user.settings.get('gradingColor')) {
                                this.canvas.injectLayerColor('stroke', '#444444');
                            } else {
                                this.canvas.injectLayerColor('stroke', '#888888');
                            }
                            this.canvas.getLayer('stroke').alpha = 0.75;
                            this.review.setSquig(this.canvas.getLayer('stroke').clone(true));
                        } else {
                            this.canvas.fadeLayer('background', null);
                        }
                        this.revealed = false;
                        this.toggleToolbarReveal();
                        this.renderAnswer();
                    } else {
                        if (this.teaching) {
                            this.teach();
                        } else {
                            this.canvas.fadeLayer('background', null);
                            this.revealed = false;
                            this.toggleToolbarReveal();
                        }
                    }
                } else {
                    this.attempts++;
                    if (this.attempts > this.maxAttempts) {
                        this.canvas.fadeShape('background', this.character.getExpectedStroke().getShape(), {color: '#b3b3b3', milliseconds: 1000});
                        this.review.setAt('score', 1);
                    }
                }
            }
        },
        /**
         * @method handleCanvasSwipeUp
         */
        handleCanvasSwipeUp: function() {
            if (this.character.length) {
                this.teaching = false;
                this.hideNavigation();
                app.analytics.trackEvent('Prompt', 'swipeup', 'eraser');
                this.renderQuestion();
                this.character.reset();
                this.canvas.clearAll();
                this.revealed = false;
                this.toggleToolbarReveal();
            }
            this.toggleToolbarEraser();
        },
        /**
         * @method handleToolbarEraserClicked
         * @param {Event} event
         */
        handleToolbarEraserClicked: function(event) {
            event.preventDefault();
            this.gradingButtons.hide();
            app.analytics.trackEvent('Prompt', 'click', 'eraser');
            this.elements.toolbarReveal.show();
            this.review.setAt('answered', false);
            this.teaching = false;
            if (this.character.length) {
                this.hideNavigation();
                this.renderQuestion();
                this.character.reset();
                this.canvas.clearAll();
                this.revealed = false;
                this.teaching = false;
                this.toggleToolbarReveal();
            }
            this.toggleToolbarEraser();
        },
        /**
         * @method handleToolbarRevealClicked
         * @param {Event} event
         */
        handleToolbarRevealClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Prompt', 'click', 'reveal');
            if (this.revealed) {
                this.canvas.clearLayer('background');
                this.revealed = false;
            } else {
                this.revealCharacter();
                this.revealed = true;
            }
            this.toggleToolbarReveal();
        },
        /**
         * @method handleToolbarTeachClicked
         * @param {Event} event
         */
        handleToolbarTeachClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Prompt', 'click', 'teach');
            this.review.setAt('score', 1);
            if (this.character.isComplete()) {

                this.handleToolbarEraserClicked(event);
                this.teach();
            } else {
                if (this.teaching) {
                    this.elements.toolbarReveal.show();
                    this.canvas.clearLayer('background2');
                    this.canvas.fadeLayer('background', null);
                    this.teaching = false;
                } else {
                    this.elements.toolbarReveal.hide();
                    this.teach();
                }
            }
        },
        /**
         * @method reset
         * @returns {PromptRune}
         */
        reset: function() {
            Prompt.prototype.reset.call(this);
            this.canvas.clearAll();
            return this;
        },
        /**
         * @method resize
         * @returns {PromptRune}v
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = this.canvas.getWidth();
            var contentHeight = app.router.currentPage.getContentHeight();
            var contentWidth = app.router.currentPage.getContentWidth();
            if (app.isPortrait()) {
                this.$el.css({
                    'border-bottom': '1px solid #000000',
                    'border-right': 'none',
                    height: contentHeight - canvasSize - 1,
                    'padding-top': 0,
                    width: canvasSize
                });
                this.elements.toolbar.css({
                    'border-bottom': 'none',
                    'border-top': '1px solid #000000',
                    bottom: 0,
                    top: 'auto'
                });
                this.elements.promptText.css('max-height', contentHeight - canvasSize - 36);
            } else {
                this.$el.css({
                    'border-bottom': 'none',
                    'border-right': '1px solid #000000',
                    height: canvasSize,
                    'padding-top': '36px',
                    width: contentWidth - canvasSize - 1
                });
                this.elements.toolbar.css({
                    'border-bottom': '1px solid #000000',
                    'border-top': 'none',
                    bottom: 'auto',
                    top: 0
                });
                this.elements.promptText.css('max-height', contentHeight - 36);
            }
            this.canvas.clearAll();
            if (app.user.settings.get('gradingColor') && this.character.isComplete()) {
                this.canvas.drawShape('stroke', this.character.getShape(), {
                    color: app.user.settings.get('gradingColors')[this.review.getAt('score') - 1]
                });
                if (this.review.getSquig()) {
                    this.canvas.getLayer('stroke').addChild(this.review.getSquig());
                }
            } else if (this.character.length) {
                this.canvas.drawShape('stroke', this.character.getShape());
            }
            return this;
        },
        /**
         * @method revealCharacter
         * @param {Number} [excludeStroke]
         */
        revealCharacter: function(excludeStroke) {
            this.canvas.clearLayer('background');
            this.canvas.drawShape('background', this.character.getExpectedVariations()[0].getShape(excludeStroke), {color: '#b3b3b3'});
            this.review.setAt('score', 1);
        },
        /**
         * @method revealCharacter
         */
        revealTeachCharacter: function() {
            this.canvas.clearLayer('background2');
            this.canvas.drawShape('background2', this.character.getExpectedVariations()[0].getShape(), {color: '#b3b3b3'});
            this.review.setAt('score', 1);
        },
        /**
         * @method teach
         * @returns {PromptRune}
         */
        teach: function() {
            var stroke = this.character.getExpectedStroke();
            if (stroke) {
                var strokeParam = stroke.getTraceParam();
                var strokePath = strokeParam.get('corners');
                this.revealTeachCharacter();
                this.canvas.clearLayer('background');
                this.canvas.drawShape('background', stroke.getShape(), {color: '#b3b3b3'});
                this.canvas.tracePath('background', strokePath);
                this.review.setAt('score', 1);
                this.teaching = true;
            }
            return this;
        },
        /**
         * @method toggleToolbarEraser
         */
        toggleToolbarEraser: function() {
            if (this.character.length) {
                this.elements.toolbarEraser.removeClass('text-muted');
            } else {
                this.elements.toolbarEraser.addClass('text-muted');
            }
        },
        /**
         * @method toggleToolbarReveal
         */
        toggleToolbarReveal: function() {
            if (this.revealed) {
                this.elements.toolbarReveal.addClass('text-primary');
            } else {
                this.elements.toolbarReveal.removeClass('text-primary');
            }
        }
    });

    return PromptRune;
});