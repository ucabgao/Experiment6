(function () {
    'use strict';

    angular.module('webbage.chat.rooms').controller('roomsCtrl', ['$scope', '$log', 'hubProxy', function ($scope, $log, hub) {
        var roomsHub = hub('roomHub', [
            {
                eventName: 'userConnected',
                callback: updateRoomUserList
            },
            {
                eventName: 'userDisconnected',
                callback: updateRoomUserList
            }
        ]);

        function updateRoomUserList(room) {
            $log.info(room);
            for (var i = 0; i < $scope.rooms.length; i++) {
                if (room.RoomID === $scope.rooms[i].RoomID && room.RoomKey === $scope.rooms[i].RoomKey) {
                    $scope.rooms[i].Users = room.Users;
                }
            }
        }

        roomsHub.ready(function () {
            roomsHub.invoke('GetRooms', [], function (result) {
                $scope.rooms = result;
            });
        });

        $scope.rooms = [];
    }]);
})();