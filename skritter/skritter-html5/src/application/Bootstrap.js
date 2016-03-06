/**
 * @module Application
 * @class Bootstrap
 */
define(function() {
    /**
     * @method alert
     * @param {String} html
     * @param {Object} [options]
     * @returns {String}
     */
    function alert(html, options) {
        html = html || '';
        options = options ? options : {};
        options.dismissible = options.dismissible ? ' alert-dismissible' : '';
        options.level = options.level ? options.level : 'info';
        var div = "<div class='alert alert-" + options.level + options.dismissible + "' role='alert'>";
        if (options.dismissible) {
            div += "<button type='button' class='close spacing' data-dismiss='alert' aria-hidden='true'>&times;</button>";
        }
        div += html;
        div += "</div>";
        return div;
    }
    /**
     * @method button
     * @param {String} text
     * @param {Object} [options]
     * @returns {String}
     */
    function button(text, options) {
        text = text || '';
        options = options ? options : {};
        options.level = options.level ? options.level : 'default';
        options.size = options.size ? 'btn-' + options.size + ' ' : '';
        return "<button type='button' class='btn " + options.size + "btn-" + options.level + " spacing'>" + text + "</button>";
    }

    return {
        alert: alert,
        button: button
    };
});
