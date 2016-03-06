
/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView'
], function(BaseView) {
    /**
     * @class VocabTable
     * @extend BaseView
     */
    var VocabTable = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.fields = {writing: 'Writing'};
            this.filtered = [];
            this.vocabs = [];
        },
        /**
         * @method render
         * @returns {VocabTable}
         */
        render: function() {
            this.$el.html("<table class='table table-hover no-border vocab-table'><thead></thead><tbody></tbody></table>");
            return this;
        },
        /**
         * @method renderTable
         * @returns {VocabTable}
         */
        renderTable: function() {
            var vocabs = this.filtered.length ? this.filtered : this.vocabs;
            var divBody = '';
            var divHead = '';
            this.$('table tbody').empty();
            this.$('table thead').empty();
            //generates the header section
            if (this.fields) {
                divHead += '<tr>';
                for (var header in this.fields) {
                    divHead += "<th>" + this.fields[header] + "</th>";
                }
                divHead += '</tr>';
            }
            //generates the body section
            for (var i = 0, length = vocabs.length; i < length; i++) {
                var vocab = vocabs[i];
                divBody += "<tr id='vocab-" + vocab.id + "' class='cursor'>";
                for (var field in this.fields) {
                    var fieldValue = vocab[field];
                    if (field === 'definitions') {
                        //TODO: properly display definitions based on target language
                    } else if (field === 'reading') {
                        if (app.user.isChinese()) {
                            divBody += "<td class='vocab-field-" + field + "'>" + app.fn.pinyin.toTone(fieldValue) + "</td>";
                        } else {
                            divBody += "<td class='vocab-field-" + field + "'>" + fieldValue + "</td>";
                        }
                    } else if (field === 'banned') {
                        divBody += "<td class='vocab-field-" + field + "'><i class='fa fa-2x fa-close pull-right text-warning'></i></td>";
                    } else if (field === 'starred') {
                        divBody += "<td class='vocab-field-" + field + "'><i class='fa fa-2x fa-close pull-right text-warning'></i></td>";
                    } else if (field === 'writing') {
                        divBody += "<td class='vocab-field-" + field + " asian-font'>" + fieldValue + "</td>";
                    } else {
                        divBody += "<td class='vocab-field-" + field + "'>" + fieldValue + "</td>";
                    }
                }
            }
            this.$('table thead').html(divHead);
            this.$('table tbody').html(divBody);
            this.loadFont();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick tr': 'handleRowClicked',
                'vclick .vocab-field-banned': 'handleFieldBannedClicked',
                'vclick .vocab-field-starred': 'handleFieldStarredClicked'
            });
        },
        /**
         * @method clear
         * @returns {VocabTable}
         */
        clear: function() {
            this.$('table thead').empty();
            this.$('table tbody').empty();
        },
        /**
         * @method handleFieldStarredClicked
         * @param {Event} event
         */
        handleFieldBannedClicked: function(event) {
            event.preventDefault();
            var vocabId = this.$(event.currentTarget).parent()[0].id.replace('vocab-', '');
            this.filtered.splice(_.findIndex(this.filtered, {id: vocabId}), 1);
            this.vocabs.splice(_.findIndex(this.vocabs, {id: vocabId}), 1);
            if (app.user.data.vocabs.get(vocabId)) {
                app.user.data.vocabs.get(vocabId).set('bannedParts', []);
            }
            this.renderTable();
        },
        /**
         * @method handleFieldStarredClicked
         * @param {Event} event
         */
        handleFieldStarredClicked: function(event) {
            event.preventDefault();
            var vocabId = this.$(event.currentTarget).parent()[0].id.replace('vocab-', '');
            this.filtered.splice(_.findIndex(this.filtered, {id: vocabId}), 1);
            this.vocabs.splice(_.findIndex(this.vocabs, {id: vocabId}), 1);
            if (app.user.data.vocabs.get(vocabId)) {
                app.user.data.vocabs.get(vocabId).set('starred', false);
            }
            this.renderTable();
        },
        /**
         * @method handleRowClicked
         * @param {Event} event
         */
        handleRowClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method set
         * @param {Object} fields
         * @param {Array|Object} vocabs
         * @returns {VocabTable}
         */
        set: function(fields, vocabs) {
            this.fields = fields || {writing: 'Writing'};
            this.vocabs = Array.isArray(vocabs) ? vocabs : [vocabs];
            return this;
        }
    });

    return VocabTable;
});