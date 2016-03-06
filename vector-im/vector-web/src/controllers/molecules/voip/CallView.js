/*
Copyright 2015 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';
var dis = require("matrix-react-sdk/lib/dispatcher");
var CallHandler = require("matrix-react-sdk/lib/CallHandler");
var MatrixClientPeg = require("matrix-react-sdk/lib/MatrixClientPeg");

var VectorConferenceHandler = require('../../../modules/VectorConferenceHandler');

/*
 * State vars:
 * this.state.call = MatrixCall|null
 *
 * Props:
 * this.props.room = Room (JS SDK)
 *
 * Internal state:
 * this._trackedRoom = (either from props.room or programatically set)
 */

module.exports = {

    componentDidMount: function() {
        this.dispatcherRef = dis.register(this.onAction);
        this._trackedRoom = null;
        if (this.props.room) {
            this._trackedRoom = this.props.room;
            this.showCall(this._trackedRoom.roomId);
        }
        else {
            var call = CallHandler.getAnyActiveCall();
            if (call) {
                console.log(
                    "Global CallView is now tracking active call in room %s",
                    call.roomId
                );
                this._trackedRoom = MatrixClientPeg.get().getRoom(call.roomId);
                this.showCall(call.roomId);
            }
        }
    },

    componentWillUnmount: function() {
        dis.unregister(this.dispatcherRef);
    },

    onAction: function(payload) {
        // don't filter out payloads for room IDs other than props.room because
        // we may be interested in the conf 1:1 room
        if (payload.action !== 'call_state' || !payload.room_id) {
            return;
        }
        this.showCall(payload.room_id);
    },

    showCall: function(roomId) {
        var call = (
            CallHandler.getCallForRoom(roomId) ||
            VectorConferenceHandler.getConferenceCallForRoom(roomId)
        );
        if (call) {
            call.setLocalVideoElement(this.getVideoView().getLocalVideoElement());
            call.setRemoteVideoElement(this.getVideoView().getRemoteVideoElement());
            // give a separate element for audio stream playback - both for voice calls
            // and for the voice stream of screen captures
            call.setRemoteAudioElement(this.getVideoView().getRemoteAudioElement());
        }
        if (call && call.type === "video" && call.state !== 'ended') {
            // if this call is a conf call, don't display local video as the
            // conference will have us in it
            this.getVideoView().getLocalVideoElement().style.display = (
                call.confUserId ? "none" : "initial"
            );
            this.getVideoView().getRemoteVideoElement().style.display = "initial";
        }
        else {
            this.getVideoView().getLocalVideoElement().style.display = "none";
            this.getVideoView().getRemoteVideoElement().style.display = "none";
            dis.dispatch({action: 'video_fullscreen', fullscreen: false});
        }
    }
};

