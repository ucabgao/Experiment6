/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/list-section.html',
    'components/ListRowTable'
], function(BasePage, TemplateMobile, ListRowTable) {
    /**
     * @class PageListSection
     * @extends BasePage
     */
    var PageListSection = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'List Section';
            this.list = undefined;
            this.listId = undefined;
            this.section = undefined;
            this.sectionId = undefined;
            this.table = new ListRowTable();
            this.removed = false;
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PageListSection}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.table.setElement(this.$('.row-table-container')).render();
            this.resize();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageListSection}
         */
        renderElements: function() {
            if (this.list.creator === app.user.id) {
                this.$('#button-add-section').show();
                this.table.readonly = false;
            } else {
                this.$('#button-add-section').hide();
                this.table.readonly = true;
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick table tr': 'handleTableRowClicked',
            'vclick #button-add-vocab': 'handleRowAddButtonClicked',
            'vclick #button-back': 'handleBackButtonClicked',
            'vclick #button-save': 'handleSaveButtonClicked',
            'vclick .row-field-remove': 'handleRowRemoveButtonClicked'
        }),
        /**
         * @method handleBackButtonClicked
         * @param {Event} event
         */
        handleBackButtonClicked: function(event) {
            event.preventDefault();
            app.router.navigate('list/' + this.list.id, {trigger: true});
        },
        /**
         * @method handleRowAddButtonClicked
         * @param {Event} event
         */
        handleRowAddButtonClicked: function(event) {
            event.preventDefault();
            var self = this;
            var sections = [];
            app.dialogs.show('add-vocab').element('.modal-title span').text('Add Vocabs');
            app.dialogs.element('.message-text').text('To add multiple vocabs use spaces.');
            app.dialogs.element('.vocabs').val('');
            app.dialogs.element('.check').on('vclick', function() {
                var vocabWritings = app.dialogs.element('.vocabs').val();
                vocabWritings = vocabWritings ? vocabWritings.trim().split(' ') : [];
                async.each(vocabWritings, function(vocabWriting, callback) {
                    app.api.getVocabByQuery(vocabWriting, {fields: 'id,style,writing'}, function(result) {
                        if (result.Vocabs.length) {
                            var vocab = _.find(result.Vocabs, {writing: vocabWriting});
                            var splitVocabId = vocab.id.split('-');
                            var row = {};
                            if (app.user.isJapanese()) {
                                row.vocabId = vocab.id;
                                row.studyWriting = true;
                            } else {
                                row.vocabId = splitVocabId[0] + '-' + splitVocabId[1] + '-0';
                                if (vocab.style === 'trad') {
                                    row.tradVocabId = app.fn.mapper.toBase(vocab.writing);
                                }
                            }
                            sections.push(row);
                        } else {
                            console.log('Search for', vocabWriting, "didn't return anything useful.");
                        }
                        mixpanel.track('Added List Word', {"List Name": self.list.name});
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }, function() {
                    self.section.rows = self.section.rows.concat(sections);
                    self.table.setSection(self.section);
                    app.dialogs.hide(function() {
                        self.saveSection();
                    });
                });
            });
        },
        /**
         * @method handleRowRemoveButtonClicked
         * @param {Event} event
         */
        handleRowRemoveButtonClicked: function(event) {
            event.stopPropagation();
            var self = this;
            var vocabId = event.currentTarget.parentNode.id.replace('vocab-', '');
            var vocabWriting = this.$(event.currentTarget.parentNode).find('.row-field-writing').text();
            app.dialogs.show('confirm').element('.modal-title span').html("Delete Vocab: <strong>" + vocabWriting + "</strong>");
            app.dialogs.element('.modal-message').html("");
            app.dialogs.element('.confirm').on('vclick', function() {
                self.table.removeById(vocabId);
                app.dialogs.hide(function() {
                    console.log(self);
                    mixpanel.track('Deleted List Word', {"List Name": self.list.name});
                    self.saveSection();
                });
            });
        },
        /**
         * @method handleTableRowClicked
         * @param {Event} event
         */
        handleTableRowClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method loadList
         */
        loadList: function() {
            var self = this;
            app.dialogs.show().element('.message-title').text('Loading');
            app.dialogs.element('.message-text').empty();
            app.api.getVocabList(this.listId, null, function(list) {
                self.list = list;
                console.log('LIST', list);
                self.section = _.find(list.sections, {id: self.sectionId});
                self.$('#list-name').text(self.list.name);
                self.$('#section-name').text(self.section.name);
                mixpanel.track('Viewing List Section', {'List Name': list.name, 'List Section': self.section.name});
                if (self.list.creator === app.user.id) {
                    self.$('#button-add-vocab').show();
                    self.table.readonly = false;
                } else {
                    self.$('#button-add-vocab').hide();
                    self.table.readonly = true;
                }
                self.table.setFields({
                    writing: 'Writing',
                    remove: ''
                }).setSection(self.section).renderTable();
                self.renderElements().resize();
                app.dialogs.hide();
            }, function(error) {
                console.error(error);
            });
        },
        /**
         * @method resize
         * @returns {PageListSection}
         */
        resize: function() {
            this.$('#list-section').css({
                height: this.getHeight() - 80,
                'overflow-y': 'auto'
            });
            return this;
        },
        /**
         * @method saveSection
         * @param {Function} [callback]
         */
        saveSection: function(callback) {
            var self = this;
            async.series([
                function(callback) {
                    app.dialogs.show().element('.message-title').text('Saving');
                    app.api.updateVocabListSection(self.list, self.table.section, function(section) {
                        self.table.setSection(section).renderTable();
                        self.section = section;
                        callback();
                    }, function() {
                        callback();
                    });
                }
            ], function() {
                if (typeof callback === 'function') {
                    app.dialogs.hide(callback);
                } else {
                    app.dialogs.hide();
                }
            });
        },
        /**
         * @method sort
         * @param {String} listId
         * @param {String} sectionId
         * @returns {PageListSection}
         */
        set: function(listId, sectionId) {
            this.listId = listId;
            this.sectionId = sectionId;
            this.loadList();
            return this;
        }
    });

    return PageListSection;
});