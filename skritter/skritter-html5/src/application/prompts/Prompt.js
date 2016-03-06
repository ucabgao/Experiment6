/**
 * @module Application
 */
define([
    'framework/BaseView'
], function(BaseView) {
    /**
     * @class Prompt
     * @extends {BaseView}
     */
    var Prompt = BaseView.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @param {PromptController} controller
         * @param {DataReview} review
         * @constructor
         */
        initialize: function(options, controller, review) {
            this.autoAdvanceTimer = undefined;
            this.canvas = controller.canvas;
            this.containedVocab = undefined;
            this.controller = controller;
            this.gradingButtons = controller.gradingButtons;
            this.item = review.getBaseItem();
            this.part = review.get('part');
            this.position = 1;
            this.promptClick = true;
            this.review = review;
            this.teaching = false;
            this.vocab = review.getBaseVocab();
            //load canvas characters for rune and tone prompts
            if (['rune', 'tone'].indexOf(this.part) !== -1 && !review.characters.length) {
                review.characters = this.item.getCanvasCharacters();
            }
            //show tutorial if not already disabled
            if (app.user.settings.hasTutorial(this.part)) {
                app.dialogs.show('tutorial-' + this.part);
                app.dialogs.element('.tutorial-reading').html(this.vocab.getReading());
                app.dialogs.element('.tutorial-writing').html(this.vocab.getWriting());
                app.dialogs.element('.tutorial-disable').on('vclick', _.bind(this.disableTutorial, this));
            }
            //update review based on audio availability
            if (this.vocab.has('audioURL')) {
                this.review.setBase({
                    missingAudioLang: undefined,
                    missingAudioReading: undefined,
                    missingAudioWriting: undefined
                });
            } else {
                this.review.setBase({
                    missingAudioLang: this.vocab.get('lang'),
                    missingAudioReading: this.vocab.get('reading'),
                    missingAudioWriting: this.vocab.get('writing')
                });
            }
        },
        /**
         * @property el
         * @type String
         */
        el: '.detail-container',
        /**
         * @method render
         * @returns {Prompt}
         */
        render: function() {
            this.position = this.review.getPosition();
            this.containedVocab = this.review.getVocab();
            this.character = this.review.getCharacter();
            this.tones = this.vocab.getTones(this.position);
            console.log('PROMPT:', this.review.get('itemId'), this.review, this.vocab);
            this.renderElements();
            if (this.review.getAt('answered')) {
                this.renderAnswer();
            } else {
                this.renderQuestion();
            }
            this.vocab.getAudio(function() {
                $('#button-audio').removeClass('inactive');
            }, function() {
                $('#button-audio').addClass('inactive');
            });
            if (this.item.isNew()) {
                this.elements.promptNewness.text('NEW');
                this.elements.promptNewness.addClass('text-warning');
            } else {
                this.elements.promptNewness.text('');
            }
            if (this.vocab.isChinese()) {
                this.elements.promptStyle.text(this.vocab.getStyle().toUpperCase());
            }
            this.reset().resize();
            if (this.teaching) {
                this.teach();
            }
            this.updateVocabSidebar();
            this.loadFont();
            return this;
        },
        /**
         * @method renderAnswer
         * @returns {Prompt}
         */
        renderAnswer: function() {
            app.timer.stop();
            this.clickTimeout();
            this.review.setAt({
                answered: true,
                reviewTime: app.timer.getReviewTime(),
                thinkingTime: app.timer.getThinkingTime()
            });
            this.gradingButtons.select(this.review.getAt('score')).show();
            if (app.user.settings.hasTutorial('grading')) {
                app.dialogs.show('tutorial-grading');
                app.dialogs.element('.tutorial-disable').on('vclick', function() {
                    app.user.settings.disableTutorial('grading');
                    app.dialogs.hide();
                });
            }
            if (app.user.settings.get('autoAdvance')) {
                //TODO: restore when auto advance has been styled
                //this.startAutoAdvance();
            }
            this.showNavigation(1.0);
            return this;
        },
        /**
         * @method renderElements
         * @returns {Prompt}
         */
        renderElements: function() {
            this.elements.autoAdvance = $('.autoadvance-counter');
            this.elements.buttonWrong = this.$('.button-wrong');
            this.elements.fieldAnswer = this.$('.field-answer');
            this.elements.fieldDefinition = this.$('.field-definition');
            this.elements.fieldHeisig = this.$('.field-heisig');
            this.elements.fieldHelpText = this.$('.field-help-text');
            this.elements.fieldHighlight = this.$('.field-highlight');
            this.elements.fieldJapaneseDefinition = this.$('.field-japanese-definition');
            this.elements.fieldMnemonic = this.$('.field-mnemonic');
            this.elements.fieldQuestion = this.$('.field-question');
            this.elements.fieldReading = this.$('.field-reading');
            this.elements.fieldWriting = this.$('.field-writing');
            this.elements.infoBan = $('#sidebar-info .info-ban');
            this.elements.infoContained = $('#sidebar-info .info-contained');
            this.elements.infoDecomps = $('#sidebar-info .info-decomps');
            this.elements.infoDefinition = $('#sidebar-info .info-definition');
            this.elements.infoHeisig = $('#sidebar-info .info-heisig');
            this.elements.infoMnemonic = $('#sidebar-info .info-mnemonic');
            this.elements.infoPleco = $('#sidebar-info .info-pleco');
            this.elements.infoReading = $('#sidebar-info .info-reading');
            this.elements.infoSentence = $('#sidebar-info .info-sentence');
            this.elements.infoSentenceReading = $('#sidebar-info .info-sentence-reading');
            this.elements.infoSentenceDefinition = $('#sidebar-info .info-sentence-definition');
            this.elements.infoSentenceToggle = $('#sidebar-info .info-sentence-toggle');
            this.elements.infoStar = $('#sidebar-info .info-star');
            this.elements.infoWriting = $('#sidebar-info .info-writing');
            this.elements.promptNewness = this.$('.prompt-newness');
            this.elements.promptStyle = this.$('.prompt-style');
            this.elements.promptText = this.$('.prompt-text');
            return this;
        },
        /**
         * @method renderQuestion
         * @returns {Prompt}
         */
        renderQuestion: function() {
            app.timer.setLapOffset(this.review.getAt('reviewTime'));
            app.timer.start();
            this.stopAutoAdvance();
            this.review.setAt('answered', false);
            this.gradingButtons.hide();
            if (app.user.reviews.previous || !this.review.isFirst()) {
                this.showNavigation(0.2);
            } else {
                this.hideNavigation();
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
            'swipeleft': 'handleSwipedLeft',
            'vclick': 'handlePromptClicked',
            'vclick .audio-button': 'handleAudioButtonClicked',
            'vclick .button-wrong': 'handleWrongButtonClicked',
            'vclick .reading-button': 'handleReadingButtonClicked'
        }),
        /**
         * @method clickTimeout
         * @param {Number} [milliseconds]
         */
        clickTimeout: function(milliseconds) {
            var self = this;
            milliseconds = milliseconds || 200;
            this.promptClick = false;
            setTimeout(function() {
                self.promptClick = true;
            }, milliseconds);
        },
        /**
         * @method disableTutorial
         */
        disableTutorial: function() {
            app.user.settings.disableTutorial(this.part);
            app.dialogs.hide();
        },
        /**
         * @method editDefinition
         */
        editDefinition: function() {
            var self = this;
            //TODO: clean up interactions with sidebar
            app.dialogs.show('edit-text').element('.modal-title span').text('Edit Definition');
            var currentDefinition = this.vocab.getDefinition(true);
            app.dialogs.element('.dialog-value').val(currentDefinition);
            app.dialogs.element('.save').on('vclick', function() {
                var value = app.dialogs.element('.dialog-value').val();
                if (!value || value === '') {
                    value = currentDefinition;
                    self.vocab.set('customDefinition', undefined);
                } else if (currentDefinition !== value) {
                    self.vocab.set('customDefinition', value);
                } else {
                    value = currentDefinition;
                }
                $('#sidebar-info .info-definition').text(value);
                self.render();
                app.dialogs.hide();
            });
        },
        /**
         * @method editDefinition
         */
        editMnemonic: function() {
            var self = this;
            //TODO: clean up interactions with sidebar
            app.dialogs.show('edit-text').element('.modal-title span').text('Edit Mnemonic');
            var currentMnemonic = this.containedVocab.get('mnemonic') ? this.containedVocab.get('mnemonic').text : '';
            app.dialogs.element('.dialog-value').empty();
            app.dialogs.element('.dialog-value').val(currentMnemonic);
            app.dialogs.element('.save').on('vclick', function() {
                var value = app.dialogs.element('.dialog-value').val();
                if (!value || value === '') {
                    value = '';
                    self.containedVocab.set('mnemonic', '');
                } else if (currentMnemonic !== value) {
                    if (self.containedVocab.get('mnemonic')) {
                        self.containedVocab.get('mnemonic').text = value;
                        self.containedVocab.set('mnemonic', self.vocab.get('mnemonic'));
                        self.containedVocab.cache();
                    } else {
                        self.containedVocab.set('mnemonic', {text: value, public: false});
                    }
                } else {
                    value = currentMnemonic;
                }
                $('#sidebar-info .info-mnemonic').text(value);
                self.render();
                app.dialogs.hide();
            });
        },
        /**
         * @method enableCanvasListeners
         * @returns {Prompt}
         */
        enableListeners: function() {
            this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClicked);
            this.listenTo(this.canvas, 'canvas:clickhold', this.handleCanvasHeld);
            this.listenTo(this.canvas, 'canvas:doubleclick', this.handleCanvasDoubleClicked);
            this.listenTo(this.canvas, 'canvas:swipeup', this.handleCanvasSwipeUp);
            this.listenTo(this.canvas, 'input:down', this.handleInputDown);
            this.listenTo(this.canvas, 'input:up', this.handleInputUp);
            this.listenTo(this.gradingButtons, 'complete', this.handleGradingButtonsCompleted);
            this.listenTo(this.gradingButtons, 'selected', this.handleGradingButtonsSelected);
            this.listenTo(app.sidebars, 'click:edit-definition', this.editDefinition);
            this.listenTo(app.sidebars, 'click:edit-mnemonic', this.editMnemonic);
            this.listenTo(app.sidebars, 'click:info-ban', this.toggleBanned);
            this.listenTo(app.sidebars, 'click:info-pleco', this.searchPleco);
            this.listenTo(app.sidebars, 'click:info-star', this.toggleStarred);
            return this;
        },
        /**
         * @method handleGradingButtonsCompleted
         */
        handleGradingButtonsCompleted: function() {
            this.next();
        },
        /**
         * @method handleGradingButtonsSelected
         */
        handleGradingButtonsSelected: function(grade) {
            this.review.setAt('score', grade);
            if (app.user.settings.get('gradingColor')) {
                var layer = app.user.settings.get('squigs') ? 'background' : 'stroke';
                this.canvas.injectLayerColor(layer, app.user.settings.get('gradingColors')[grade - 1]);
            }
        },
        /**
         * @method handlePromptClicked
         * @param {Event} event
         * @returns {Boolean}
         */
        handlePromptClicked: function(event) {
            event.preventDefault();
            return app.sidebars && app.sidebars.isCollapsed() && this.promptClick ? true : false;
        },
        /**
         * @method handleReadingButtonClicked
         * @param {Event} event
         */
        handleReadingButtonClicked: function(event) {
            event.preventDefault();
            $(event.currentTarget).removeClass('reading-button');
            $(event.currentTarget).find('span').removeClass('invisible');
        },
        /**
         * @method handleSwipedLeft
         * @param {Event} event
         */
        handleSwipedLeft: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Prompt', 'swipeleft', 'info');
            if (this.review) {
                this.review.setAt('score', 1);
            }
            app.sidebars.select('info').show();
        },
        /**
         * @method handleWrongButtonClicked
         * @param {Event} event
         * @returns {Boolean}
         */
        handleWrongButtonClicked: function(event) {
            event.stopPropagation();
            event.preventDefault();
            return app.sidebars && app.sidebars.isCollapsed() && this.promptClick ? true : false;
        },
        /**
         * @method hideNavigation
         * @param {Number} [opacity]
         * @returns {Prompt}
         */
        hideNavigation: function() {
            this.controller.elements.navigateNext.hide();
            this.controller.elements.navigatePrevious.hide();
            return this;
        },
        /**
         * @method next
         */
        next: function() {
            this.updateReview();
            if (!this.review.getAt('answered')) {
                this.renderAnswer();
            } else if (this.review.isLast()) {
                this.elements.infoSentenceToggle.hide();
                this.controller.triggerPromptComplete(this.review);
            } else {
                this.review.next();
                this.render();
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            this.updateReview();
            if (this.review.isFirst()) {
                this.elements.infoSentenceToggle.hide();
                this.controller.triggerPrevious();
            } else {
                this.review.previous();
                this.render();
            }
        },
        /**
         * @method reset
         * @returns {Prompt}
         */
        reset: function() {
            this.stopListening();
            this.enableListeners();
            return this;
        },
        /**
         * @method resize
         * @returns {Prompt}
         */
        resize: function() {
            this.scaleText();
            return this;
        },
        /**
         * @method scaleDefinition
         * @returns {Prompt}
         */
        scaleDefinition: function() {
            //TODO: dynamically scale definitions so they fit better
            //var definitionLength = this.vocab.getDefinition().length;
            //this.$('.text-definition').css('font-size');
            return this;
        },
        /**
         * @method scaleText
         * @returns {Prompt}
         */
        scaleText: function() {
            var canvasSize = this.canvas.getWidth();
            var writingLength = this.vocab.get('writing').split('').length;
            $('.text-max').css('font-size', canvasSize / 10);
            $('.text-large').css('font-size', canvasSize / 14);
            $('.text-normal').css('font-size', canvasSize / 16);
            $('.text-small').css('font-size', canvasSize / 18);
            $('.text-tiny').css('font-size', canvasSize / 22);
            $('.text-xtiny').css('font-size', canvasSize / 30);
            $('.text-xxtiny').css('font-size', canvasSize / 40);
            if (writingLength < 3) {
                this.$('.text-max-character').css('font-size', canvasSize / 5);
            } else if (writingLength < 5) {
                this.$('.text-max-character').css('font-size', canvasSize / 6);
            } else if (writingLength < 7) {
                this.$('.text-max-character').css('font-size', canvasSize / 8);
            } else {
                this.$('.text-max-character').css('font-size', canvasSize / 12);
            }
            return this;
        },
        /**
         * @method searchPleco
         */
        searchPleco: function() {
            if (plugins.core) {
                plugins.core.openPleco(this.vocab.get('writing'));
            }
        },
        /**
         * @method showNavigation
         * @param {Number} [opacity]
         * @returns {Prompt}
         */
        showNavigation: function(opacity) {
            opacity = opacity === undefined ? 0.4 : opacity;
            var bottom = 75;
            var bottomOffset = 15;
            if (this.part === 'rune' || this.part ==='tone') {
                if (this.review.getAt('answered')) {
                    this.controller.elements.navigateNext.css({
                        bottom: this.gradingButtons.isExpanded() ? bottom : bottomOffset,
                        display: 'block',
                        opacity: opacity
                    });
                } else {
                    this.controller.elements.navigateNext.hide();
                }
                if (app.user.reviews.previous || !this.review.isFirst()) {
                    this.controller.elements.navigatePrevious.css({
                        bottom: this.gradingButtons.isExpanded() ? bottom : bottomOffset,
                        display: 'block',
                        opacity: opacity
                    });
                } else {
                    this.controller.elements.navigatePrevious.hide();
                }
            } else {
                if (this.review.getAt('answered')) {
                    this.controller.elements.navigateNext.css({
                        bottom: this.gradingButtons.isExpanded() ? bottom : bottomOffset,
                        display: 'block',
                        opacity: opacity
                    });
                } else {
                    this.controller.elements.navigateNext.hide();
                }
                if (app.user.reviews.previous || !this.review.isFirst()) {
                    this.controller.elements.navigatePrevious.css({
                        bottom: this.gradingButtons.isExpanded() ? bottom : bottomOffset,
                        display: 'block',
                        opacity: opacity
                    });
                } else {
                    this.controller.elements.navigatePrevious.hide();
                }
            }
            return this;
        },
        /**
         * @method skip
         */
        skip: function() {
            this.controller.triggerNext();
        },
        /**
         * @method startAutoAdvance
         */
        startAutoAdvance: function() {
            var self = this;
            var current = 0;
            var limit = app.user.settings.get('autoAdvanceTime');
            this.elements.autoAdvance.text(limit / 1000);
            this.elements.autoAdvance.show();
            this.autoAdvanceTimer = setInterval(function() {
                if (current >= limit - 1000) {
                    self.next();
                    self.stopAutoAdvance();
                } else {
                    current += 1000;
                    self.elements.autoAdvance.text((limit - current) / 1000);
                }
            }, 1000);
        },
        /**
         * @method stopAutoAdvance
         */
        stopAutoAdvance: function() {
            clearInterval(this.autoAdvanceTimer);
            this.elements.autoAdvance.hide();
        },
        /**
         * @method teach
         * @returns {Prompt}
         */
        teach: function() {
            return this;
        },
        /**
         * @method toggleBanned
         */
        toggleBanned: function() {
            var self = this;
            if (this.vocab.isBanned()) {
                this.elements.infoBan.removeClass('text-danger');
                this.vocab.set('bannedParts', []);
            } else {
                app.dialogs.show('confirm');
                app.dialogs.element('.modal-title span').text('Ban ' + this.vocab.get('writing') + '?');
                app.dialogs.element('.modal-message').text('');
                app.dialogs.element('.confirm').one('vclick', function () {
                    self.elements.infoBan.addClass('text-danger');
                    self.vocab.set('bannedParts', app.user.settings.getAllParts());
                    app.user.reviews.current = undefined;
                    app.user.schedule.banItems(self.vocab.id);
                    app.dialogs.hide(function() {
                        app.sidebars.hide(0);
                        self.skip();
                    });
                });
            }
            this.updateVocabSidebar();
        },
        /**
         * @method toggleStarred
         */
        toggleStarred: function() {
            if (this.vocab.isStarred()) {
                this.vocab.set('starred', false);
            } else {
                this.vocab.set('starred', true);
            }
            this.updateVocabSidebar();
        },
        /**
         * @method updateVocabSidebar
         * @returns {Prompt}
         */
        updateVocabSidebar: function() {
            this.elements.infoDefinition.html(this.vocab.getDefinition());
            if (app.user.settings.get('showHeisig') && this.vocab.has('heisigDefinition')) {
                this.elements.infoHeisig.text(this.vocab.get('heisigDefinition'));
                this.elements.infoHeisig.parent().show();
            } else {
                this.elements.infoHeisig.empty();
                this.elements.infoHeisig.parent().hide();
            }
            if (this.containedVocab.get('kana')) {
                this.elements.infoMnemonic.parent().hide();
            } else {
                if (this.containedVocab.get('mnemonic')) {
                    this.elements.infoMnemonic.html(this.containedVocab.getMnemonicText());
                } else {
                    this.elements.infoMnemonic.html('');
                    this.elements.infoMnemonic.parent().find('button').text('Add Mnemonic');
                }
            }
            this.elements.infoReading.html(this.vocab.getReading(null, {
                style: app.user.settings.get('readingStyle')
            }));
            this.elements.infoWriting.html(this.vocab.getWriting());
            if (this.vocab.getContainedVocabs().length > 1) {
                this.elements.infoContained.parent().show();
                this.elements.infoContained.html(this.vocab.getContainedRows());
            } else {
                this.elements.infoContained.parent().hide();
            }
            if (this.vocab.getCharacterCount() === 1 && this.vocab.getDecomp()) {
                this.elements.infoDecomps.parent().show();
                this.elements.infoDecomps.html(this.vocab.getDecomp().getChildrenRows());
            } else {
                this.elements.infoDecomps.parent().hide();
            }
            if (this.vocab.getSentence()) {
                var sentence = this.vocab.getSentence();
                this.elements.infoSentence.parent().show();
                this.elements.infoSentence.html(sentence.getWriting());
                this.elements.infoSentenceDefinition.html(sentence.getDefinition());
                this.elements.infoSentenceReading.html(sentence.getReading());
            } else {
                this.elements.infoSentence.parent().hide();
            }
            if (this.vocab.isBanned()) {
                this.elements.infoBan.addClass('fa-star text-danger');
                this.elements.infoBan.removeClass('text-muted');
            } else {
                this.elements.infoBan.addClass('text-muted');
                this.elements.infoBan.removeClass('fa-star text-danger');
            }
            if (this.vocab.isStarred()) {
                this.elements.infoStar.addClass('fa-star text-warning');
                this.elements.infoStar.removeClass('fa-star-o');
            } else {
                this.elements.infoStar.addClass('fa-star-o');
                this.elements.infoStar.removeClass('fa-star text-warning');
            }
            if (app.isNative() && this.vocab.isChinese()) {
                this.elements.infoPleco.show();
            } else {
                this.elements.infoPleco.hide();
            }
            app.sidebars.loadFont();
            return this;
        },
        /**
         * @method updateReview
         * @returns {Prompt}
         */
        updateReview: function() {
            this.review.setAt({
                reviewTime: app.timer.getReviewTime(),
                score: this.gradingButtons.getScore(),
                thinkingTime: app.timer.getThinkingTime()
            });
            return this;
        }
    });

    return Prompt;
});
