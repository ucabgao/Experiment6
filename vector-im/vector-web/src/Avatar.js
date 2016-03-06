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

var MatrixClientPeg = require('matrix-react-sdk/lib/MatrixClientPeg');

module.exports = {
    avatarUrlForMember: function(member, width, height, resizeMethod) {
        var url = member.getAvatarUrl(
            MatrixClientPeg.get().getHomeserverUrl(),
            width,
            height,
            resizeMethod
        );
        if (!url) {
            // member can be null here currently since on invites, the JS SDK
            // does not have enough info to build a RoomMember object for
            // the inviter.
            url = this.defaultAvatarUrlForString(member ? member.userId : '');
        }
        return url;
    },

    defaultAvatarUrlForString: function(s) {
        var total = 0;
        for (var i = 0; i < s.length; ++i) {
            total += s.charCodeAt(i);
        }
        switch (total % 3) {
            case 0:
                return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADRJREFUeNrszQENADAIACB9QjNbxSKP4eagAFnTseHFErFYLBaLxWKxWCwWi8Vi8cX4CzAABSwCRWJw31gAAAAASUVORK5CYII=";
            case 1:
                return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADRJREFUeNrszQENADAIACB9chOaxgCP4eagAFk9seHFErFYLBaLxWKxWCwWi8Vi8cX4CzAAtKMCks/JG8MAAAAASUVORK5CYII=";
            case 2:
                return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADRJREFUeNrszQENADAIACB9YzNayQCP4eagADldseHFErFYLBaLxWKxWCwWi8Vi8cX4CzAAyiACeHwPiu4AAAAASUVORK5CYII=";
        }
    }
}

