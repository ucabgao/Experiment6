/**
 * @module Application
 */
define([
    'framework/BaseApplication',
    'require.i18n!locale/nls/strings',
    'application/Functions',
    'application/Router',
    'components/Dialogs',
    'components/Sidebars',
    'components/Timer',
    'models/Analytics',
    'models/Api',
    'models/Assets',
    'models/User',
    'storage/IndexedDBAdapter'
], function(BaseApplication, Strings,
            Functions, Router, Dialogs, Sidebars, Timer, Analytics, Api, Assets, User, IndexedDBAdapter) {
    /**
     * @class Application
     * @extends BaseApplication
     */
    var Application = BaseApplication.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseApplication.prototype.initialize.call(this);
            this.api = new Api();
            this.assets = new Assets();
            this.fn = Functions;
            this.router = new Router();
            this.storage = new IndexedDBAdapter();
            this.strings = Strings;
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            canvasSize: 600,
            expansionMainVersion: 3,
            expansionPatchVersion: 1,
            languageCode: '@@languageCode',
            timestamp: parseInt('@@timestamp', 10),
            version: '@@version',
            versionCode: '@@versionCode'
        },
        /**
         * @method getPackageName
         * @returns {String}
         */
        getPackageName: function() {
            return cordova.file.applicationStorageDirectory.replace('file:///data/data/', '').replace('/', '');
        },
        /**
         * @method getVersion
         * @returns {String}
         */
        getVersion: function() {
            return this.get('version').indexOf('version') === -1 ? this.get('version') : 'edge';
        },
        /**
         * @method start
         */
        start: function() {
            var self = this;
            this.analytics = new Analytics();
            this.dialogs = new Dialogs();
            this.sidebars = new Sidebars();
            this.timer = new Timer();
            this.user = new User();
            async.series([
                function(callback) {
                    self.user.load(callback);
                },
                function(callback) {
                    mixpanel.register({
                        'Client': 'HTML5 Android',
                        'Language Code': self.user.getLanguageCode()
                    });
                    callback();
                },
                function(callback) {
                    if (app.isNative()) {
                        if (self.user.getLanguageCode() === 'zh') {
                            self.analytics.startTrackerWithId('UA-52116701-1', callback);
                        } else if (self.user.getLanguageCode() === 'ja') {
                            self.analytics.startTrackerWithId('UA-52116701-2', callback);
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                }
            ], function() {
                Backbone.history.start({
                    pushState: app.isLocalhost() || app.isNative() ? false : true,
                    root: app.isLocalhost() || app.isNative() ? '/skritter-html5/www/' : '/'
                });
            });
        }
    });

    return Application;
});