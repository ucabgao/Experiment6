
/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView'
], function(BaseView) {
    /**
     * @class ListSectionTable
     * @extend BaseView
     */
    var ListSectionTable = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.fields = {name: 'Name'};
            this.list = {sections: []};
            this.readonly = true;
        },
        /**
         * @method render
         * @returns {ListSectionTable}
         */
        render: function() {
            this.$el.html("<table class='table table-hover'><thead></thead><tbody></tbody></table>");
            return this;
        },
        /**
         * @method renderTable
         * @returns {ListSectionTable}
         */
        renderTable: function() {
            var divBody = '';
            var divHead = '';
            this.$('table tbody').empty();
            this.$('table thead').empty();
            //remove editable fields when readonly
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
            for (var i = 0, length = this.list.sections.length; i < length; i++) {
                var section = this.list.sections[i];
                if (!section.deleted) {
                    divBody += "<tr id='section-" + section.id + "' class='cursor'>";
                    for (var field in this.fields) {
                        var fieldValue = section[field];
                        if (field === 'rows') {
                            divBody += "<td class='section-field-" + field + "'>" + fieldValue.length + "</td>";
                        } else if (field === 'remove') {
                            divBody += "<td class='section-field-" + field + "  text-right text-danger'><i class='fa fa-2x fa-remove'></i></td>";
                        } else {
                            divBody += "<td class='section-field-" + field + "'>" + fieldValue + "</td>";
                        }
                    }
                    divBody += "</tr>";
                }
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
         * @method addSection
         * @param {Object} section
         * @returns {ListSectionTable}
         */
        addSection: function(section) {
            if (this.list.studyingMode === 'finished') {
                this.list.studyingMode = 'reviewing';
            }
            this.list.sections.push(section);
            return this;
        },
        /**
         * @method clear
         * @returns {ListSectionTable}
         */
        clear: function() {
            this.$('table thead').empty();
            this.$('table tbody').empty();
        },
        /**
         * @method
         * @param {String} sectionId
         * @returns {Object}
         */
        removeById: function(sectionId) {
            var section = _.find(this.list.sections, {id: sectionId});
            section.deleted = true;
            return section;
        },
        /**
         * @method set
         * @param {Object} fields
         * @param {Object} list
         * @returns {ListSectionTable}
         */
        set: function(fields, list) {
            this.setFields(fields).setList(list);
            return this;
        },
        /**
         * @method setFields
         * @param {Object} fields
         * @returns {ListSectionTable}
         */
        setFields: function(fields) {
            this.fields = fields || {name: 'Name'};
            return this;
        },
        /**
         * @method setLists
         * @param {Object} list
         * @returns {ListSectionTable}
         */
        setList: function(list) {
            this.list = list || {sections: []};
            return this;
        }
    });

    return ListSectionTable;
});