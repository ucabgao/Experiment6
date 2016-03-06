(function() {

    requirejs.config({
        baseUrl: './',
        callback: loadLibraries,
        locale: undefined,
        paths: app.configs.paths,
        shim: app.configs.shim,
        urlArgs: app.isLocalhost() ? 'bust=' + (new Date()).getTime() : undefined,
        waitSeconds: 60
    });

    function loadLibraries() {
        requirejs(['application/Libraries'], function() {
            if (app.isNative()) {
                requirejs(['cordova.js'], function() {
                    document.addEventListener('deviceready', loadApplication, false);
                });
            } else {
                $(document).ready(loadApplication);
            }
        });
    }

    function loadApplication() {
        requirejs(['application/Application'], function(Application) {
            window.plugins = $.extend({}, window.plugins);
            window.app = $.extend(new Application(), window.app);
            window.app.start();
        });
    }

})();