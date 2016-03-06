/**
 * @module Application
 */
define([
    'framework/BaseView',
    'require.text!templates/prompts/prompt-grading-buttons.html'
], function(BaseView, DesktopTemplate) {
    /**
     * @class PromptGradingButtons
     * @extend {BaseView}
     */
    var PromptGradingButtons = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.expanded = false;
            this.grade = 3;
        },
        /**
         * @method render
         * @returns {PromptGradingButtons}
         */
        render: function() {
            this.$el.html(this.compile(DesktopTemplate));
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-grading': 'handleGradingButtonClicked'
            });
        },
        /**
         * @method getScore
         * @returns {Number}
         */
        getScore: function() {
            return this.grade;
        },
        /**
         * @method handleGradingButtonClicked
         * @param {Object} event
         */
        handleGradingButtonClicked: function(event) {
            event.stopPropagation();
            var grade = parseInt(event.currentTarget.id.replace('grade', ''), 10);
            this.triggerSelected(grade);
            if (this.grade === grade) {
                this.triggerComplete();
            }
            this.select(grade);
        },
        /**
         * @method hide
         * @param {Function} [callback]
         * @returns {PromptGradingButtons}
         */
        hide: function(callback) {
            this.expanded = false;
            this.$el.hide(0, callback);
            return this;
        },
        /**
         * @method isExpanded
         * @returns {Boolean}
         */
        isExpanded: function() {
            return this.expanded;
        },
        /**
         * @method reset
         * @returns {PromptGradingButtons}
         */
        reset: function() {
            this.grade = 3;
            return this;
        },
        /**
         * @method select
         * @param {Number} grade
         * @returns {PromptGradingButtons}
         */
        select: function(grade) {
            for (var i = 1; i <= 4; i++) {
                if (i === grade) {
                    this.$('#grade' + i).addClass('active');
                    this.$('#grade' + i).find('i').show();
                } else {
                    this.$('#grade' + i).removeClass('active');
                    this.$('#grade' + i).find('i').hide();
                }
            }
            this.grade = grade;
            return this;
        },
        /**
         * @method show
         * @param {Function} [callback]
         * @returns {PromptGradingButtons}
         */
        show: function(callback) {
            this.expanded = true;
            this.$el.show(0, callback);
            return this;
        },
        /**
         * @method triggerComplete
         */
        triggerComplete: function() {
            this.trigger('complete', this.grade);
        },
        /**
         * @method triggerSelected
         * @param {Boolean} [grade]
         */
        triggerSelected: function(grade) {
            this.trigger('selected', grade ? grade : this.grade);
        }
    });

    return PromptGradingButtons;
});
