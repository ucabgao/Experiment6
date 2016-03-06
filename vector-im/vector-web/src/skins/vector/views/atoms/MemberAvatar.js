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
var Avatar = require('../../../../Avatar');

var MemberAvatarController = require('matrix-react-sdk/lib/controllers/atoms/MemberAvatar')

module.exports = React.createClass({
    displayName: 'MemberAvatar',
    mixins: [MemberAvatarController],

    avatarUrlForMember: function(member) {
        return Avatar.avatarUrlForMember(
            member,
            this.props.member,
            this.props.width,
            this.props.height,
            this.props.resizeMethod
        );
    },

    skinnedDefaultAvatarUrl: function(member, width, height, resizeMethod) {
        return Avatar.defaultAvatarUrlForString(member.userId);
    },

    render: function() {
        // XXX: recalculates default avatar url constantly
        if (this.state.imageUrl === this.defaultAvatarUrl(this.props.member)) {
            var initial;
            if (this.props.member.name[0])
                initial = this.props.member.name[0].toUpperCase();
            if (initial === '@' && this.props.member.name[1])
                initial = this.props.member.name[1].toUpperCase();
         
            return (
                <span className="mx_MemberAvatar_wrapper">
                    <span className="mx_MemberAvatar_initial"
                          style={{ fontSize: (this.props.width * 0.75) + "px",
                                   width: this.props.width + "px",
                                   lineHeight: this.props.height*1.2 + "px" }}>{ initial }</span>
                    <img className="mx_MemberAvatar" src={this.state.imageUrl}
                         onError={this.onError} width={this.props.width} height={this.props.height} />
                </span>
            );            
        }
        return (
            <img className="mx_MemberAvatar" src={this.state.imageUrl}
                onError={this.onError}
                width={this.props.width} height={this.props.height} />
        );
    }
});
