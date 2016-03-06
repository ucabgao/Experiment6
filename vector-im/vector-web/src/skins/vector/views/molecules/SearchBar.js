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
var MatrixClientPeg = require('matrix-react-sdk/lib/MatrixClientPeg');
var sdk = require('matrix-react-sdk');

module.exports = React.createClass({
    displayName: 'SearchBar',

    getInitialState: function() {
        return ({
            scope: 'Room'
        });
    },

    onThisRoomClick: function() {
        this.setState({ scope: 'Room' });
    },

    onAllRoomsClick: function() {
        this.setState({ scope: 'All' });
    },

    onSearchChange: function(e) {
        if (e.keyCode === 13) { // on enter...
            this.props.onSearch(this.refs.search_term.value, this.state.scope);
        }
    },
    
    render: function() {
        return (
            <div className="mx_SearchBar">
                <input ref="search_term" className="mx_SearchBar_input" type="text" autoFocus={true} placeholder="Search..." onKeyDown={this.onSearchChange}/>
                <div className={"mx_SearchBar_button" + (this.state.scope !== 'Room' ? " mx_SearchBar_unselected" : "")} onClick={this.onThisRoomClick}>This Room</div>
                <div className={"mx_SearchBar_button" + (this.state.scope !== 'All' ? " mx_SearchBar_unselected" : "")} onClick={this.onAllRoomsClick}>All Rooms</div>
                <img className="mx_SearchBar_cancel" src="img/cancel-black.png" width="18" height="18" onClick={this.props.onCancelClick} />
            </div>
        );
    }
});
