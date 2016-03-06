
/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView'
], function(BaseView) {
    /**
     * @class ListRowTable
     * @extend BaseView
     */
    var ListRowTable = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.fields = {name: 'Name'};
            this.section = {rows: []};
            this.readonly = true;
        },
        /**
         * @method render
         * @returns {ListRowTable}
         */
        render: function() {
            this.$el.html("<table class='table table-hover table-list-row'><thead></thead><tbody></tbody></table>");
            return this;
        },
        /**
         * @method renderTable
         * @returns {ListRowTable}
         */
        renderTable: function() {
            var divBody = '';
            var divHead = '';
            this.$('table tbody').empty();
            this.$('table thead').empty();
            //remove editable fields if not creator
            if (this.readonly) {
                delete this.fields.remove;
            }
            //generates the header section
            if (this.fields) {
                divHead += '<tr>';
                for (var header in this.fields) {
                    divHead += "<th>" + this.fields[header] + "</th>";
                }
                divHead += '</tr>';
            }
            //generates the body section
            for (var i = 0, length = this.section.rows.length; i < length; i++) {
                var row = this.section.rows[i];
                divBody += "<tr id='vocab-" + row.vocabId + "' class='cursor'>";
                for (var field in this.fields) {
                    var fieldValue = row[field];
                    if (field === 'remove') {
                        divBody += "<td class='row-field-" + field + "  text-right text-danger'><i class='fa fa-2x fa-remove'></i></td>";
                    } else if (field === 'writing') {
                        divBody += "<td class='row-field-" + field + "'>";
                        divBody += app.fn.mapper.fromBase(row.vocabId);
                        if (row.tradVocabId && row.vocabId !== row.tradVocabId) {
                            divBody += " <span class='text-muted'>(" + app.fn.mapper.fromBase(row.tradVocabId) + ")</span>";
                        }
                        divBody += "</td>";
                    } else {
                        divBody += "<td class='row-field-" + field + "'>" + fieldValue + "</td>";
                    }
                }
                divBody += "</tr>";
            }
            this.$('table thead').html(divHead);
            this.$('table tbody').html(divBody);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {});
        },
        /**
         * @method clear
         * @returns {ListRowTable}
         */
        clear: function() {
            this.$('table thead').empty();
            this.$('table tbody').empty();
        },
        /**
         * @method
         * @param {String} vocabId
         * @returns {ListRowTable}
         */
        removeById: function(vocabId) {
            this.section.rows = _.filter(this.section.rows, function(row) {
                return row.vocabId !== vocabId;
            });
            return this;
        },
        /**
         * @method set
         * @param {Object} fields
         * @param {Object} list
         * @returns {ListRowTable}
         */
        set: function(fields, list) {
            this.setFields(fields).setList(list);
            return this;
        },
        /**
         * @method setFields
         * @param {Object} fields
         * @returns {ListRowTable}
         */
        setFields: function(fields) {
            this.fields = fields || {name: 'Name'};
            return this;
        },
        /**
         * @method setRows
         * @param {Object} section
         * @returns {ListRowTable}
         */
        setSection: function(section) {
            this.section = section || {rows: []};
            return this;
        }
    });

    return ListRowTable;
});