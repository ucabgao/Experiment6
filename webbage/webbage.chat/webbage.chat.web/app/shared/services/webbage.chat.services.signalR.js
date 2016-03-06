(function () {
    'use strict';

    angular.module('webbage.chat.services.signalR', []).factory('hubProxy', ['$log', '$timeout', '$rootScope', '$q', function ($log, $timeout, $root, $q) {
        return function (hubName, watches, queryString) {
            var connection = $.hubConnection(),
                hub = connection.createHubProxy(hubName),
                loadDeferment = $q.defer(),
                isLoaded = loadDeferment.promise;

            $log.info('webbage.chat.services.signalR(' + hubName + '): Creating SignalR service for ' + hubName);

            function registerWatches() {
                var deferred = $q.defer(),
                    promise = deferred.promise;

                try {
                    if (watches && watches.length > 0) {
                        for (var i = watches.length; i-- > 0;) {
                            var watch = watches[i];
                            registerWatch(watch.eventName, watch.callback);
                        }
                    } else {
                        $log.info('webbage.chat.services.signalR(' + hubName + '): No watches registered for ' + hubName);
                    }
                } finally {
                    deferred.resolve();
                }

                return promise;
            }
            function registerWatch(eventName, callback) {
                $log.info('webbage.chat.services.signalR(' + hubName + '): Registering client watch: ' + eventName + ' on ' + hubName);
                hub.on(eventName, function (result) {
                    $log.info('webbage.chat.services.signalR(' + hubName + '): Client watch ' + eventName + ' triggered on ' + hubName);
                    $root.$apply(function () {
                        if (callback) {
                            callback(result);
                        }
                    });
                });
            }                        

            function connect() {
                // set the query string before we start the connection
                if (queryString) {
                    $log.info('webbage.chat.services.signalR(' + hubName + '): Setting query string for ' + hubName + ': ' + queryString);
                    connection.qs = queryString;
                } else {
                    $log.info('webbage.chat.services.signalR(' + hubName + '): No query string set for ' + hubName);
                }

                // register the watches for events from the server to the client, need to do this before
                // the connection is started, otherwise we'll miss out on some and it'll cause bugs
                registerWatches().then(function () {
                    connection.start({ logging: true })
                        .done(function () {
                            $log.info('webbage.chat.services.signalR(' + hubName + '): Connection established to ' + hubName + '. Connection ID: ' + connection.id);
                            loadDeferment.resolve();
                        })
                        .fail(function (error) {
                            $log.error('webbage.chat.services.signalR(' + hubName + '): Error connecting to ' + hubName + ': ' + error);
                            loadDeferment = $q.defer();
                            isLoaded = loadDeferment.promise;
                        });
                });
            }
            connect();

            function kill() {
                connection.stop();
            }

            connection.error(function (error) { $log.error('webbage.chat.services.signalR(' + hubName + '): SignalR Error: ' + error); });
            connection.disconnected(function () {
                $log.error('webbage.chat.services.signalR(' + hubName + '): Connection disconnected');
                // $timeout(function () { connect(); }, 5000); don't 
            });

            return {
                // on: registerWatch,       // removed because watches should be registered during construction
                ready: function (callback) {
                    return isLoaded.then(function () {
                        callback();
                    });
                },
                invoke: function (methodName, args, callback) {
                    $log.info('webbage.chat.services.signalR(' + hubName + '): Invoking ' + methodName + ' on ' + hubName);
                    return hub.invoke.apply(hub, $.merge([methodName], args))
                        .done(function (result) {
                            $root.$apply(function () {
                                if (callback) {
                                    $log.info('webbage.chat.services.signalR(' + hubName + '): Executing callback for ' + methodName + ' on ' + hubName);
                                    callback(result);
                                }
                            });
                        })
                        .fail(function (error) {
                            $log.error('webbage.chat.services.signalR(' + hubName + '): Error invoking ' + methodName + ' on ' + hubName + ' on server: ' + error);
                        })
                },
                kill: kill,
                connection: connection
            };
        }
    }]);
})();