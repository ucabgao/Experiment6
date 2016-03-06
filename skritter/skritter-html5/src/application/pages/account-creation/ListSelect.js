/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/account-creation/list-select.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageListSelect
     * @extends BasePage
     */
    var PageListSelect = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'List Select';
            this.list = null;
            this.lists = [];
            this.listsFiltered = undefined;
        },
        /**
         * @method render
         * @returns {PageListSelect}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.listsContainer = this.$('.lists-container');
            this.elements.listTable = this.$('#list-table');
            this.elements.recommendedChinese = this.$('.recommended-chinese');
            this.elements.recommendedJapanese = this.$('.recommended-japanese');
            if (app.api.getGuest('lang') === 'zh') {
                this.elements.recommendedChinese.show();
                this.elements.recommendedJapanese.hide();
            } else {
                this.elements.recommendedChinese.hide();
                this.elements.recommendedJapanese.show();
            }
            this.elements.searchBox = this.$('#search-box');
            this.loadLists();
            return this;
        },
        /**
         * @method renderListTable
         * @returns {PageListSelect}
         */
        renderListTable: function() {
            var divBody = '';
            var lists = this.getLists();
            for (var i = 0, length = lists.length; i < length; i++) {
                var list = lists[i];
                divBody += "<tr id='list-" + list.id + "' class='list'>";
                divBody += "<td class='list-image'><img src='http://www.skritter.com/vocab/listimage?list=" + list.id + "' alt=''></td>";
                divBody += "<td class='list-name'>" + list.name + "</td>";
                divBody += "</tr>";

            }
            this.elements.listTable.find('tbody').html(divBody);
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick .list': 'handleListClicked',
            'vclick .recommended-list': 'handleRecommendedClicked',
            'keyup #search-box': 'handleSearchBoxChanged'
        }),
        /**
         * @method filterLists
         * @param {Object} criteria
         * @returns {PageListSelect}
         */
        filterLists: function(criteria) {
            this.listsFiltered = _.filter(this.lists, function(list) {
                for (var criterion in criteria) {
                    if (Array.isArray(list[criterion])) {
                        var normalizedArray = list[criterion].map(app.fn.toLowerCase);
                        if (normalizedArray.indexOf(criteria[criterion]) > -1) {
                            return true;
                        }
                    } else {
                        if (list[criterion].toLowerCase().indexOf(criteria[criterion].toLowerCase()) > -1) {
                            return true;
                        }
                    }
                }
            });
            return this;
        },
        /**
         * @method getLists
         * @returns {Array}
         */
        getLists: function() {
            return this.listsFiltered ? this.listsFiltered : this.lists;
        },
        /**
         * @method handleListClicked
         */
        handleListClicked: function(event) {
            event.preventDefault();
            this.list = _.find(this.lists, {id: event.currentTarget.id.replace('list-', '')});
            app.api.setGuest('list', this.list.id);
            app.dialogs.show('list-confirmation');
            app.dialogs.element('.list-name').text(this.list.shortName);
            app.dialogs.element('.list-image').html("<img src='http://www.skritter.com/vocab/listimage?list=" + this.list.id + "' alt=''>");
            app.dialogs.element('.list-description').html(this.list.description);
            app.dialogs.element('.list-categories').text(this.list.categories.join(', '));
            app.dialogs.element('.list-studying').text(this.list.peopleStudying);
            app.dialogs.element('.select').on('vclick', this.handleListSelected);
        },
        /**
         * @method handleListSelected
         */
        handleListSelected: function(event) {
            event.preventDefault();
            mixpanel.track('Selected Creation List', {"List Name": this.name});
            app.router.navigate('getting-started/signup', {trigger: true});
            app.dialogs.hide();
        },
        /**
         * @method handleRecommendedClicked
         */
        handleRecommendedClicked: function(event) {
            event.preventDefault();
            this.elements.searchBox.val($(event.currentTarget).data('search'));
            this.handleSearchBoxChanged(event);
        },
        /**
         * @method handleSearchBoxChanged
         */
        handleSearchBoxChanged: function(event) {
            event.preventDefault();
            var searchText = this.elements.searchBox.val();
            this.filterLists({
                categories: searchText,
                name: searchText,
                shortName: searchText
            });
            this.renderListTable();
        },
        /**
         * @method initialListFilter
         * @param {Object} list
         * @returns {Boolean}
         */
        initialListFilter: function(list) {
            return list.categories.length;
        },
        /**
         * @method loadLists
         * @returns {PageListSelect}
         */
        loadLists: function() {
            var self = this;
            this.elements.listsContainer.hide();
            app.dialogs.show().element('.message-title').text('LOADING LISTS');
            app.api.getVocabLists({
                sort: 'official',
                lang: app.api.getGuest('lang') ? app.api.getGuest('lang') : 'zh'
            }, function(lists) {
                self.lists = _.filter(lists, this.initialListFilter);
                self.sortLists();
                self.renderListTable();
                self.elements.listsContainer.show();
                app.dialogs.hide();
            }, function(error) {
                app.dialogs.hide();
                console.error(error);
            });
            return this;
        },
        /**
         * @method sortLists
         * @returns {PageListSelect}
         */
        sortLists: function() {
            this.lists = _.sortBy(this.lists, function(list) {
                return list.name;
            });
            return this;
        }
    });

    return PageListSelect;
});