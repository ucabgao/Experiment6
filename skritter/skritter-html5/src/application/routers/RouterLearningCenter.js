/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'pages/LearningCenter',
    'pages/learning-center/StrokeOrder'
], function(BaseRouter, PageLearningCenter, PageStrokeOrder) {
    /**
     * @class RouterLearningCenter
     * @extends BaseRouter
     */
    var RouterLearningCenter = BaseRouter.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property routes
         * @type Object
         */
        routes: {
            'learning-center': 'showLearningCenter',
            'learning-center/stroke-order': 'showStrokeOrder'
        },
        /**
         * @method showLearningCenter
         */
        showLearningCenter: function() {
            this.currentPage = new PageLearningCenter();
            this.currentPage.render();
        },
        /**
         * @method showStrokeOrder
         */
        showStrokeOrder: function() {
            this.currentPage = new PageStrokeOrder();
            this.currentPage.render();
        }
    });

    return RouterLearningCenter;
});
