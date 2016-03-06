/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'pages/admin/CharacterEditor',
    'pages/admin/Export',
    'pages/admin/ParamEditor'
], function(BaseRouter, PageAdminCharacterEditor, PageAdminExport, PageAdminParamEditor) {
    /**
     * @class RouterAdmin
     * @extends BaseRouter
     */
    var RouterAdmin = BaseRouter.extend({
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
            'admin/character-editor': 'showCharacterEditor',
            'admin/character-editor/:writing': 'showCharacterEditor',
            'admin/export': 'showExport',
            'admin/param-editor': 'showParamEditor',
            'admin/param-editor/:strokeId': 'showParamEditor'
        },
        /**
         * @method showCharacterEditor
         * @param {String} [writing]
         */
        showCharacterEditor: function(writing) {
            this.currentPage = new PageAdminCharacterEditor();
            this.currentPage.set(writing).render();
        },
        /**
         * @method showExport
         */
        showExport: function() {
            this.currentPage = new PageAdminExport();
            this.currentPage.render();
        },
        /**
         * @method showParamEditor
         * @param {String} [strokeId]
         */
        showParamEditor: function(strokeId) {
            this.currentPage = new PageAdminParamEditor();
            this.currentPage.set(strokeId).render();
        }
    });

    return RouterAdmin;
});
