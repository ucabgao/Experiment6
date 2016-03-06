app = (function() {
    return {
        /**
         * @property configs
         * @type {Object}
         */
        configs: {
            modules: [
                {
                    name: "application/Application",
                    exclude: ["require.i18n", "require.text"]
                },
                {
                    name: "application/Libraries"
                }
            ],
            paths: {
                //directories
                collections: 'application/collections',
                components: 'application/components',
                models: 'application/models',
                pages: 'application/pages',
                prompts: 'application/prompts',
                routers: 'application/routers',
                storage: 'application/storage',
                //libraries
                async: 'libraries/async-0.9.0.min',
                backbone: 'libraries/backbone-1.1.2.min',
                'backbone.routefilter': 'libraries/backbone.routefilter-0.2.0.min',
                bootstrap: 'libraries/bootstrap-3.3.0.min',
                'bootstrap.slider': 'libraries/bootstrap.slider-4.3.0.min',
                'bootstrap.switch': 'libraries/bootstrap.switch-3.2.2.min',
                //'createjs.easel': 'libraries/createjs.easel-0.8.0.min',
                //'createjs.tween': 'libraries/createjs.tween-0.6.0.min',
                'createjs.easel': 'libraries/createjs.easel-NEXT.min',
                'createjs.tween': 'libraries/createjs.tween-NEXT.min',
                fastclick: 'libraries/fastclick-1.0.3.min',
                jasmine: 'libraries/jasmine-2.0.3',
                'jasmine.boot': 'libraries/jasmine.boot-2.0.3',
                'jasmine.html': 'libraries/jasmine.html-2.0.3',
                jquery: 'libraries/jquery-1.11.1.min',
                'jquery.mobile': 'libraries/jquery.mobile-1.4.4.min',
                'jquery.notify': 'libraries/jquery.notify-0.3.1.min',
                'jquery.ui': 'libraries/jquery.ui-1.11.1.min',
                handlebars: 'libraries/handlebars-2.0.0.min',
                modernizr: 'libraries/modernizr.custom-2.8.3.min',
                moment: 'libraries/moment-2.8.3.min',
                'moment.timezone': 'libraries/moment.timezone-0.2.4.min',
                raygun: 'libraries/raygun-1.15.0.min',
                'require.i18n': 'libraries/require.i18n-2.0.4',
                'require.text': 'libraries/require.text-2.0.12',
                underscore: 'libraries/lodash.compat-2.4.1.min',
                'webfont': 'libraries/webfont-1.5.3.min'
            },
            shim: {
                backbone: ['jquery', 'underscore'],
                'backbone.routefilter': ['backbone'],
                bootstrap: ['jquery'],
                'bootstrap.slider': ['bootstrap'],
                'bootstrap.switch': ['bootstrap'],
                'jasmine.html': ['jasmine'],
                'jasmine.boot': ['jasmine.html'],
                'jquery.mobile': ['jquery'],
                'jquery.notify': ['jquery'],
                'jquery.ui': ['jquery'],
                'moment.timezone': ['moment']
            }
        },
        /**
         * @method isLocalHost
         * @returns {Boolean}
         */
        isLocalhost: function() {
            return location.hostname === 'localhost' || location.port === '1987';
        },
        /**
         * @method isNative
         * @returns {Boolean}
         */
        isNative: function() {
            return location.protocol === 'file:';
        }
    };
})();