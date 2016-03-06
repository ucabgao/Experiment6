(function () {
    'use strict';

    angular.module('webbage.chat.rooms', [
        'ngRoute',
        'webbage.chat.services.signalR',
        'webbage.chat.directives.roomDisplay',
        'webbage.chat.directives.userDisplay',
        'webbage.chat.directives.message',
        'webbage.chat.directives.scroll',
        'cfp.hotkeys'
    ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/rooms', {
                    controller: 'roomsCtrl',
                    templateUrl: 'app/components/rooms/views/rooms.tpl.html',
                    requiresLogin: true
                })
                .when('/rooms/:roomKey/:roomId', {
                    controller: 'roomCtrl',
                    templateUrl: 'app/components/rooms/views/room.tpl.html',
                    requiresLogin: true
                });
        }])
        .run(['$rootScope', function ($root) {
            $root.openRooms = [];
        }]);
})();