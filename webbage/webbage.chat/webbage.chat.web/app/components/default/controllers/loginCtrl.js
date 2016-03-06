(function () {
    'use strict';

    angular.module('webbage.chat').controller('loginCtrl', ['$scope', '$location', '$log', 'auth', 'store', function ($scope, $location, $log, auth, store) {
        if (auth.isAuthenticated) {
            $location.path('/rooms');
        }

        $scope.login = function () {
            console.log('in login');
            auth.signin({},
                function (profile, token) { // success
                    if (profile.name.trim() === '') {
                        $log.info('No name detected. Setting name to nickname');
                        profile.name = (profile.nickname.trim() !== '' ? profile.nickname : '');
                    }

                    store.set('profile', profile);
                    store.set('token', token);
                    store.set('authed', true);
                    $location.path('/rooms');
                },
                function () { // error

                });
        }
    }])
})();