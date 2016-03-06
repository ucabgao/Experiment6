define([
    'async',
    'bootstrap.slider',
    'fastclick',
    'handlebars',
    'moment.timezone',
    'raygun',
    'backbone.routefilter',
    'bootstrap.switch',
    'createjs.easel',
    'createjs.tween',
    'jquery.mobile',
    'jquery.notify',
    'jquery.ui',
    'modernizr',
    'require.i18n',
    'require.text',
    'webfont'
], function(Async, BootstrapSlider, FastClick, Handlebars, Moment) {
    window.async = Async;
    window.fastclick = new FastClick(document.body);
    window.handlebars = Handlebars;
    window.moment = Moment;
    window.raygun = Raygun.noConflict();
    window.Slider = BootstrapSlider;
});