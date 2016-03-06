define(['jquery', 'handlebars', 'text!/static/templates/agent-brief.hbs', 'collections/agents', 'bootstrap'], function ($, Handlebars, agentBriefTemplate, agents) {
    var acceptableThreshhold = 50; // 可以接受的网络延迟门槛
    var badThreshhold = 80; // 不可接受的网络延迟门槛
    var _template = Handlebars.default.compile(agentBriefTemplate);

    AgentMarker = function (agent, point) {
        this._agent = agent;
        this._length = 32;
    },

    AgentMarker.prototype = new BMap.Overlay();

    AgentMarker.prototype.initialize = function(map){
        this._map = map;
        this._tag = $("<div class='agent-marker'></div>").css({
            position: 'absolute', 
            width: this._length + 'px', 
            height: this._length + 'px',
        }).text(this._agent.get('id'));
        map.getPanes().labelPane.appendChild(this._tag[0]);
        return this._tag[0];
    }


    AgentMarker.prototype.updateTooltip = function (viewpoint) {
        var agentId = this._agent.get('id'); 
        this._tag.tooltip('destroy').tooltip({
            title: function () {
                var agent = agents.get(agentId).toJSON();
                agent.latency_in_week = agent.latency_in_week.filter(function (pair) {
                    return pair[0] === viewpoint.id;
                })[0][1];
                agent.latency_in_month = agent.latency_in_month.filter(function (pair) {
                    return pair[0] === viewpoint.id;
                })[0][1];
                return _template({
                    agent: agent,
                });
            },
            html: true,
            placement: 'right',
            container: 'body',
        });
 
    };

    AgentMarker.prototype.getAgent = function () {
        return this._agent;
    }

    AgentMarker.prototype.draw = function(){  
         var position = this._map.pointToOverlayPixel(this._agent.get('point'));  
         this._tag.css({
             left: position.x - this._length / 2 + "px",
             top: position.y - this._length / 2 + "px",
         });
    }

    AgentMarker.prototype.update = function(data) {
        var latency = null;
        if (!!data) {
            latency = data.get("latency")
        }
        this._tag.find('i').remove();
        if (latency >= badThreshhold) {
            this._tag.html(this._tag.text() + '<i class="fa fa-warning"/>');
        } else if (latency >= acceptableThreshhold) {
            this._tag.html(this._tag.text() + '<i class="fa fa-frown-o"/>');
        } else if (latency === null) {
            this._tag.html(this._tag.text() + '<i class="fa fa-ban"/>');
        } else if (latency == -1) {
            this._tag.html(this._tag.text() + '<i class="fa fa-question"/>');
        } else {
            this._tag.html(this._tag.text() + '<i class="fa fa-smile-o"/>');
        }
    }
    return AgentMarker;
});
