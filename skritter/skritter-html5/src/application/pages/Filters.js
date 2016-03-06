/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/filters.html',
    'components/ListTable'
], function(BasePage, TemplateMobile, ListTable) {
    /**
     * @class PageFilters
     * @extends BasePage
     */
    var PageFilters = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Filters';
            this.settings = app.user.settings;
            this.activeParts = [];
            this.activeStyles = [];
            this.enabledParts = [];
            this.listSelectTable = new ListTable();
            this.listTable = new ListTable();
        },
        /**
         * @method render
         * @returns {PageFilters}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.activeParts = this.settings.getActiveParts();
            this.activeStyles = this.settings.getActiveStyles();
            this.enabledParts = this.settings.getEnabledParts();
            this.elements.partDefn = this.$('#parts #defn');
            this.elements.partRdng = this.$('#parts #rdng');
            this.elements.partRune = this.$('#parts #rune');
            this.elements.partTone = this.$('#parts #tone');
            this.elements.styleSimp = this.$('#styles #simp');
            this.elements.styleTrad = this.$('#styles #trad');
            this.listTable.setElement(this.$('#lists .table-container')).render();
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageFilters}
         */
        renderElements: function() {
            this.undelegateEvents();
            this.elements.partDefn.bootstrapSwitch('state', this.activeParts.indexOf('defn') !== -1);
            this.elements.partRdng.bootstrapSwitch('state', this.activeParts.indexOf('rdng') !== -1);
            this.elements.partRune.bootstrapSwitch('state', this.activeParts.indexOf('rune') !== -1);
            if (app.user.isJapanese()) {
                this.elements.partTone.parent().parent().hide();
            } else {
                this.elements.partTone.bootstrapSwitch('state', this.activeParts.indexOf('tone') > -1);
            }
            this.elements.partDefn.bootstrapSwitch('disabled', this.enabledParts.indexOf('defn') === -1);
            this.elements.partRdng.bootstrapSwitch('disabled', this.enabledParts.indexOf('rdng') === -1);
            this.elements.partRune.bootstrapSwitch('disabled', this.enabledParts.indexOf('rune') === -1);
            this.elements.partTone.bootstrapSwitch('disabled', this.enabledParts.indexOf('tone') === -1);
            if (app.user.isChinese()) {
                if (this.settings.get('addSimplified') && this.settings.get('addTraditional')) {
                    this.elements.styleSimp.bootstrapSwitch('state', this.activeStyles.indexOf('simp') !== -1);
                    this.elements.styleTrad.bootstrapSwitch('state', this.activeStyles.indexOf('trad') !== -1);
                } else {
                    this.$('#styles').parent().hide();
                }
            } else {
                this.$('#styles').parent().hide();
            }
            this.listTable.setFields({
                name: '',
                remove: ''
            }).addStyle('table-no-border').setLists(app.user.data.vocablists.getFiltered().map(function(list) {
                return list.toJSON();
            })).sortByName().renderTable();
            this.delegateEvents();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-add-list': 'handleAddListClicked',
            'vclick .list-field-remove': 'handleListRemoveButtonClicked',
            'switchChange.bootstrapSwitch #parts': 'updateParts',
            'switchChange.bootstrapSwitch #styles': 'updateStyles'
        }),
        /**
         * @method handleAddListClicked
         * @param {Event} event
         */
        handleAddListClicked: function(event) {
            event.preventDefault();
            var self = this;
            app.analytics.trackEvent('Filters', 'click', 'list_add');
            app.dialogs.show('list-select').element('.modal-title span').text('Filter Lists');
            app.dialogs.element('.select-list').on('vclick', function() {
                var selected = app.dialogs.element('.list-container input:checkbox:checked').map(function() {
                    return this.value;
                }).get();
                self.settings.set('filterLists', _.uniq(self.settings.get('filterLists').concat(selected)));
                self.renderElements();
                app.dialogs.hide();
            });
            app.user.data.vocablists.fetch(function() {
                self.populateListDialog();
            }, function() {
                self.populateListDialog();
            });
        },
        /**
         * @method handleListRemoveButtonClicked
         * @param {Event} event
         */
        handleListRemoveButtonClicked: function(event) {
            event.stopPropagation();
            app.analytics.trackEvent('Filters', 'click', 'list_remove');
            var listId = event.currentTarget.parentNode.id.replace('list-', '');
            var filterLists = this.settings.get('filterLists');
            if (filterLists.indexOf(listId) > -1) {
                this.settings.get(filterLists.splice(filterLists.indexOf(listId), 1));
                this.settings.cache();
            }
            this.renderElements();
        },
        /**
         * @method populateListDialog
         */
        populateListDialog: function() {
            app.dialogs.element('.loader-image').hide();
            this.listSelectTable.setElement(app.dialogs.element('.list-container')).render();
            this.listSelectTable.addStyle('table-no-border').setFields({
                name: '',
                select: ''
            }).setLists(app.user.data.vocablists.getActive().map(function(list){
                return list.toJSON();
            })).sortByName().renderTable();
        },
        /**
         * @method updateParts
         * @param {Event} event
         */
        updateParts: function(event) {
            event.preventDefault();
            this.activeParts = [];
            app.analytics.trackEvent('Filters', 'click', 'toggle_parts');
            if (this.$('#parts #defn').bootstrapSwitch('state')) {
                this.activeParts.push('defn');
            }
            if (this.$('#parts #rdng').bootstrapSwitch('state')) {
                this.activeParts.push('rdng');
            }
            if (this.$('#parts #rune').bootstrapSwitch('state')) {
                this.activeParts.push('rune');
            }
            if (this.$('#parts #tone').bootstrapSwitch('state')) {
                this.activeParts.push('tone');
            }
            this.settings.setActiveParts(this.activeParts);
        },
        /**
         * @method updateParts
         * @param {Event} event
         */
        updateStyles: function(event) {
            event.preventDefault();
            this.activeStyles = [];
            app.analytics.trackEvent('Filters', 'click', 'toggle_styles');
            if (this.$('#styles #simp').bootstrapSwitch('state')) {
                this.activeStyles.push('simp');
            }
            if (this.$('#styles #trad').bootstrapSwitch('state')) {
                this.activeStyles.push('trad');
            }
            this.settings.setActiveStyles(['both'].concat(this.activeStyles));
        }
    });

    return PageFilters;
});
