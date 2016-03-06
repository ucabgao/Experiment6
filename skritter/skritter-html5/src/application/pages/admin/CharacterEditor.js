/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/admin/character-editor.html',
    'prompts/PromptCanvas'
], function(BasePage, TemplateMobile, PromptCanvas) {
    /**
     * @class CharacterEditor
     * @extends BasePage
     */
    var CharacterEditor = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Character Editor';
            this.canvas = new PromptCanvas();
            this.character = undefined;
            this.kana = app.user.data.strokes.where({kana: true}).map(function(character) {
                return character.id;
            });
            this.teaching = false;
            this.writing = undefined;
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {CharacterEditor}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.canvas.setElement(this.$('.canvas-container')).render();
            this.elements.canvasContainer = this.$('.canvas-container');
            this.elements.detailContainer = this.$('.detail-container');
            this.elements.characterOutput = this.$('#character-output');
            this.renderElements().resize();
            this.canvas.showGrid().show().enableInput();
            this.listenTo(this.canvas, 'input:down', this.handleInputDown);
            this.listenTo(this.canvas, 'input:up', this.handleInputUp);
            this.loadCharacter();
            return this;
        },
        /**
         * @method renderElements
         * @returns {CharacterEditor}
         */
        renderElements: function() {
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-backward': 'handleBackwardButtonClicked',
            'vclick #button-clear': 'handleClearButtonClicked',
            'vclick #button-forward': 'handleForwardButtonClicked',
            'vclick #button-teach': 'handleTeachButtonClicked'
        }),
        /**
         * @method handleBackwardButtonClicked
         * @param {Event} event
         */
        handleBackwardButtonClicked: function(event) {
            event.preventDefault();
            var position = this.kana.indexOf(this.writing);
            this.writing = this.kana[position - 1];
            this.loadCharacter();
        },
        /**
         * @method handleClearButtonClicked
         * @param {Event} event
         */
        handleClearButtonClicked: function(event) {
            event.preventDefault();
            this.teaching = false;
            this.character.reset();
            this.loadCharacter();
        },
        /**
         * @method handleForwardButtonClicked
         * @param {Event} event
         */
        handleForwardButtonClicked: function(event) {
            event.preventDefault();
            var position = this.kana.indexOf(this.writing);
            this.writing = this.kana[position + 1];
            this.loadCharacter();
        },
        /**
         * @method handleInputDown
         */
        handleInputDown: function() {},
        /**
         * @method handleInputUp
         * @param {Array} points
         */
        handleInputUp: function(points, shape) {
            if (points && points.length > 1 && shape) {
                var stroke = this.character.recognizeStroke(points, shape);
                if (stroke) {
                    this.canvas.lastMouseDownEvent = null;
                    this.canvas.tweenShape('stroke', stroke.getUserShape(), stroke.getShape());
                    if (this.character.isComplete()) {
                        this.canvas.clearLayer('background');
                        this.canvas.disableInput();
                    } else {
                        if (this.teaching) {
                            this.teach();
                        }
                    }
                }
            }
        },
        /**
         * @method handleTeachButtonClicked
         */
        handleTeachButtonClicked: function(event) {
            event.preventDefault();
            if (this.teaching) {
                this.teaching = false;
                this.loadCharacter();
            } else {
                this.teach();
            }
        },
        /**
         * @method loadCharacter
         * @return {CharacterEditor}
         */
        loadCharacter: function() {
            this.canvas.clearLayer('background').clearLayer('stroke');
            this.character = app.user.data.strokes.get(this.writing).getCanvasCharacter();
            this.canvas.drawShape('background', this.character.getExpectedVariations()[0].getShape(), {color: '#b3b3b3'});
            this.canvas.enableInput();
            app.router.navigate('admin/character-editor/' + this.writing);
            return this;
        },
        /**
         * @method resize
         * @returns {CharacterEditor}
         */
        resize: function() {
            var contentHeight = this.getContentHeight();
            var contentWidth = this.getContentWidth();
            if (app.isPortrait()) {
                this.canvas.resize(contentWidth);
                this.elements.detailContainer.height();
                this.elements.detailContainer.css({
                    height: contentHeight - contentWidth,
                    width: contentWidth
                });
            } else {
                this.canvas.resize(contentHeight);
                this.elements.detailContainer.css({
                    height: this.canvas.getWidth(),
                    width: contentWidth - this.canvas.getWidth()
                });
            }
            return this;
        },
        /**
         * @method set
         * @param {String} writing
         * @returns {CharacterEditor}
         */
        set: function(writing) {
            this.writing = writing;
            return this;
        },
        /**
         * @method teach
         * @returns {CharacterEditor}
         */
        teach: function() {
            var stroke = this.character.getExpectedStroke();
            if (stroke) {
                var strokeParam = stroke.getTraceParam();
                var strokePath = strokeParam.get('corners');
                this.canvas.clearLayer('background');
                this.canvas.drawShape('background', stroke.getShape(), {color: '#b3b3b3'});
                this.canvas.tracePath('background', strokePath);
                this.teaching = true;
            }
            return this;
        }
    });

    return CharacterEditor;
});
