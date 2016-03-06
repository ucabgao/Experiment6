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

var React = require('react');
var sdk = require('matrix-react-sdk')
var dis = require('matrix-react-sdk/lib/dispatcher');

var GeminiScrollbar = require('react-gemini-scrollbar');
var RoomListController = require('../../../../controllers/organisms/RoomList')

module.exports = React.createClass({
    displayName: 'RoomList',
    mixins: [RoomListController],

    onShowClick: function() {
        dis.dispatch({
            action: 'show_left_panel',
        });
    },

    render: function() {
        var expandButton = this.props.collapsed ? 
                           <img className="mx_RoomList_expandButton" onClick={ this.onShowClick } src="img/menu.png" width="20" alt=">"/> :
                           null;

        var RoomSubList = sdk.getComponent('organisms.RoomSubList');
        var self = this;

        return (
            <GeminiScrollbar className="mx_RoomList_scrollbar" autoshow={true} onScroll={self._repositionTooltip}>
            <div className="mx_RoomList">
                { expandButton }

                <RoomSubList list={ self.state.lists['m.invite'] }
                             label="Invites"
                             editable={ false }
                             order="recent"
                             activityMap={ self.state.activityMap }
                             selectedRoom={ self.props.selectedRoom }
                             collapsed={ self.props.collapsed } />

                <RoomSubList list={ self.state.lists['m.favourite'] }
                             label="Favourites"
                             tagName="m.favourite"
                             verb="favourite"
                             editable={ true }
                             order="manual"
                             activityMap={ self.state.activityMap }
                             selectedRoom={ self.props.selectedRoom }
                             collapsed={ self.props.collapsed } />

                <RoomSubList list={ self.state.lists['m.recent'] }
                             label="Conversations"
                             editable={ true }
                             verb="restore"
                             order="recent"
                             activityMap={ self.state.activityMap }
                             selectedRoom={ self.props.selectedRoom }
                             collapsed={ self.props.collapsed } />

                { Object.keys(self.state.lists).map(function(tagName) {
                    if (!tagName.match(/^m\.(invite|favourite|recent|lowpriority|archived)$/)) {
                        return <RoomSubList list={ self.state.lists[tagName] }
                             key={ tagName }
                             label={ tagName }
                             tagName={ tagName }
                             verb={ "tag as " + tagName }
                             editable={ true }
                             order="manual"
                             activityMap={ self.state.activityMap }
                             selectedRoom={ self.props.selectedRoom }
                             collapsed={ self.props.collapsed } />

                    }
                }) }

                <RoomSubList list={ self.state.lists['m.lowpriority'] }
                             label="Low priority"
                             tagName="m.lowpriority"
                             verb="demote"
                             editable={ true }
                             order="recent"
                             bottommost={ self.state.lists['m.archived'].length === 0 }
                             activityMap={ self.state.activityMap }
                             selectedRoom={ self.props.selectedRoom }
                             collapsed={ self.props.collapsed } />

                <RoomSubList list={ self.state.lists['m.archived'] }
                             label="Historical"
                             editable={ false }
                             order="recent"
                             bottommost={ true }
                             activityMap={ self.state.activityMap }
                             selectedRoom={ self.props.selectedRoom }
                             collapsed={ self.props.collapsed } />
            </div>
            </GeminiScrollbar>
        );
    }
});

