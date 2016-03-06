(function () {
    'use strict';

    angular.module('webbage.chat').controller('navCtrl', ['$scope', '$rootScope', '$location', '$log', 'auth', 'store', function ($scope, $root, $location, $log, auth, store) {
        $scope.login = function () {
            auth.signin({},
                function (profile, token) { // success
                    if (profile.name.trim() === '') {
                        $log.info('No name detected. Setting name to nickname');
                        profile.name = (profile.nickname.trim() !== '' ? profile.nickname : '');
                    }

                    store.set('profile', profile);
                    store.set('token', token);
                    $location.path('/rooms');
                },
                function () { // error

                });
        }

        $scope.logout = function () {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $location.path('/');
        }
    }]);
})();