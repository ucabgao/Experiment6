/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataDecomp
     * @extends BaseModel
     */
    var DataDecomp = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'writing',
        /**
         * @method getChildrenRows
         * @return {String}
         */
        getChildrenRows: function() {
            var decompHTML = '';
            var children = this.get('Children');
            var definitions = this.getDefinitions();
            decompHTML += "<table class='table-decomps'><tbody>";
            for (var i = 0, length = children.length; i < length; i++) {
                var child = children[i];
                var reading = app.user.isChinese() ? app.fn.pinyin.toTone(child.reading) : child.reading;
                decompHTML += '<tr>';
                decompHTML += "<td class='writing asian-font'>" + child.writing + '</td>';
                decompHTML += "<td class='reading'>" + reading + '</td>';
                decompHTML += "<td class='definition'>" + definitions[i] + '</td>';
                decompHTML += '</tr>';

            }
            decompHTML += "</tbody></table>";
            return decompHTML;
        },
        /**
         * @method getDefinitions
         * @returns {Array}
         */
        getDefinitions: function() {
            var definitions = [];
            var children = this.get('Children');
            for (var i = 0, length = children.length; i < length; i++) {
                var child = children[i];
                var targetDefinition = child.definitions[app.user.settings.get('sourceLang')];
                if (targetDefinition) {
                    definitions.push(targetDefinition);
                } else {
                    definitions.push(child.definitions.en);
                }
            }
            return definitions;
        }
    });

    return DataDecomp;
});
