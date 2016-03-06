(function () {
    'use strict';

    angular.module('webbage.chat.directives.roomDisplay', []).directive('roomDisplay', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/directives/roomDisplay/roomDisplay.tpl.html',
            scope: {
                roomItem: '='
            },
            controller: ['$scope', '$location', '$rootScope', '$log', function ($scope, $location, $root, $log) {
                $scope.openRoom = function () {
                    $root.openRooms[$root.openRooms.length] = $scope.roomItem;
                    $location.path('/rooms/' + $scope.roomItem.RoomKey + '/' + $scope.roomItem.RoomID);
                }
            }],
            link: function (scope, attrs, ele) {
                scope.$watch('roomItem', function (roomItem) {
                    scope.roomItem = roomItem;
                });
            }
        }
    });
})();