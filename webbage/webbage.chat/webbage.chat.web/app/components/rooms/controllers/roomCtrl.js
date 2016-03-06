(function () {
    'use strict';

    angular.module('webbage.chat.rooms').controller('roomCtrl', ['$scope', '$routeParams', '$rootScope', 'hubProxy', '$log', 'hotkeys', '$timeout', '$window', '$location',
        function ($scope, $routeParams, $root, hub, $log, hotkeys, $timeout, $window) {
            //#region variable declaration
            $scope.loading = true;
            $scope.onlineUsers = [];
            $scope.messages = [];
            $scope.playSound = true;
            $scope.messageIsCode = false;
            $scope.showContextMenu = $root.auth.profile.isGod;
            
            var messageNotification = new Audio('/content/media/new-message-notification.mp3'),
                connectionNotification = new Audio('/content/media/connection-notification.mp3'),
                newMessageCount = 0,
                isTabActive = true,
                tabTitle = $routeParams.roomId + ' - webbage.chat';
            //#endregion

            //#region toggle tab dis/active
            $window.document.title = tabTitle

            angular.element($window)
                .bind('focus', function () { 
                    isTabActive = true;
                    newMessageCount = 0;
                    $window.document.title = tabTitle
                })
                .bind('blur', function () {
                    isTabActive = false;
                })
            //#endregion

            var messageNotification = new Audio('/content/media/new-message-notification.mp3'),
                connectionNotification = new Audio('/content/media/connection-notification.mp3');

            $scope.consecutive = 0;
            //#region hub instantiation
            var queryString = 'roomKey=' + $routeParams.roomKey + '&roomId=' + $routeParams.roomId + '&userName=' + $root.auth.profile.name + '&userPicture=' + $root.auth.profile.picture;
            var chatHub = hub(
                'chatHub',
                [                    
                    {
                        eventName: 'receiveMessage',
                        callback: function (message) {
                            // determine if this message is from the same user as the last message
                            if ($scope.messages.length > 0) {                            
                                message.isConsecutive =
                                    $scope.messages[$scope.messages.length - 1].Sender.Name === message.Sender.Name &&
                                    $scope.messages[$scope.messages.length - 1].Sender.Picture === message.Sender.Picture
                            }
                            $scope.messages[$scope.messages.length] = message;

                            // determine if we need to play sound and if so what sound to play
                            if ($scope.playSound) {
                                var isMyMessage = $root.auth.profile.name === message.Sender.Name &&
                                                  $root.auth.profile.picture === message.Sender.Picture;

                                var isConnectionMessage = message.Content.endsWith('has connected') &&
                                                          message.Sender.Name === 'room' &&
                                                          message.Sender.Picture === '';

                                if (!isMyMessage && !isConnectionMessage) {
                                    $timeout(function () { messageNotification.play(); });
                                } else if (isConnectionMessage) {
                                    $timeout(function () { connectionNotification.play(); });
                                }
                            }

                            // determine if we need to increment the notification count on the tab
                            if (!isTabActive) {
                                $window.document.title = '(' + ++newMessageCount + ') ' + tabTitle
                            }
                        }
                    },
                    {
                        eventName: 'kill',
                        callback: function () {
                            chatHub.kill();
                        }
                    },
                    {
                        eventName: 'updateOnlineUsers',
                        callback: function (users) {
                            $log.info('webbage.chat.rooms.roomCtrl(): updateOnlineUsers(): ', users);
                            $scope.onlineUsers = users;
                        }
                    }
                ],
                queryString
            );
            //#endregion

            // now that we've established a connection, let everyone else know
            chatHub.ready(function () {
                $log.info('webbage.chat.rooms.roomCtrl(): chatHub is ready');
                $scope.loading = false;
                //chatHub.invoke('UserConnect', [])
            });

            //#region hotkeys
            hotkeys.bindTo($scope)
                .add({ // toggle sound
                    combo: 'alt+v',
                    description: 'Toggle sound in a chatroom',
                    allowIn: ['TEXTAREA'],
                    callback: function () {
                        $scope.playSound = !$scope.playSound;
                    }
                })
                .add({ // toggle code
                    combo: 'alt+c',
                    description: 'Toggle whether or not a message should be code',
                    allowIn: ['TEXTAREA'],
                    callback: function () {
                        $scope.messageIsCode = !$scope.messageIsCode;
                    }
                })
                .add({
                    combo: 'enter',
                    description: 'Send message when enter is pressed',
                    allowIn: ['TEXTAREA'],
                    callback: function (event, hotkey) {
                        event.preventDefault();
                        $scope.sendMessage();
                    }
                });
            //#endregion

            //#region client-to-server events
            $scope.message = '';
            $scope.sendMessage = function  () {
                if ($scope.message.trim() !== '') {
                    var message = {
                        Sender: {
                            Name: $root.auth.profile.name,
                            Picture: $root.auth.profile.picture
                        },
                        Content: $scope.message,
                        IsCode: $scope.messageIsCode
                    };

                    chatHub.invoke('BroadcastMessage', [message]);
                    $scope.message = '';
                }
            }
            $scope.kickUser = function (user) {
                chatHub.invoke('RemoveUser', [user]);
            }
            //#endregion
        
            $scope.$on('$destroy', function () {
                chatHub.invoke('UserDisconnect', []);
            })
        }]);
})();