(function () {
    'use strict';

    angular.module('webbage.chat.directives.userDisplay', []).directive('userDisplay', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/directives/userDisplay/userDisplay.tpl.html',
            scope: {
                user: '=',
                displaySize: '@',
                hideName: '@',
                showContextMenu: '@',
                kickMe: '&'
            },
            controller: ['$scope', '$rootScope', '$location', '$log', function ($scope, $root, $location, $log) {
                
            }],
            link: function (scope, ele, attrs) {
                scope.$watch('user', function (user) {
                    scope.user = user;
                });

                scope.$watch('displaySize', function (displaySize) {
                    scope.displaySize = displaySize;
                })

                scope.$watch('hideName', function (hideName) {
                    scope.hideName = hideName;
                })

                scope.$watch('showContextMenu', function (showContextMenu) {
                    scope.showContextMenu = showContextMenu;
                })
            }
        }
    })
})();