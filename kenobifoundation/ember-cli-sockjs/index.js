/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-sockjs',
  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/sockjs-client/dist/sockjs.min.js');
    app.import('vendor/ember-cli-sockjs/shim.js', {
      type: 'vendor',
      exports: { 'sockjs': ['default'] }
    });
  

  }
};
