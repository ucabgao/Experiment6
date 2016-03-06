define(['jquery', 'backbone', 'handlebars', 'text', 
    'collections/agents', 
    'text!/static/templates/control-panel.hbs', 'select2'], 
    function ($, Backbone, Handlebars, text, agents, controlPanelTemplate) {

        var ControlPanel = Backbone.View.extend({
            _template: Handlebars.default.compile(controlPanelTemplate),

            render: function () {
                this.$el.html(this._template({agents: agents.toJSON()}));
                $('select').select2();
                this._onViewpointSet();
                return this;
            }, 

            events: {
                'change select': '_onViewpointSet',
                'click li.list-group-item': function (e) { 
                    this._toggleAgent($(e.target)); 
                },
                'click li.list-group-item i': function (e) { 
                    this._toggleAgent($(e.target).parent()); 
                    return false;
                },
                'click li.list-group-item small': function (e) { 
                    this._toggleAgent($(e.target).parent()); 
                    return false;
                }
            },

            _onViewpointSet: function (e) {
                var viewpoint = agents.get(this.$('select').val()).toJSON();
                this.trigger('viewpoint-set', viewpoint);
                this.$("ul li").each(function (index) {
                    if ($(this).attr('data-agent-id') == viewpoint.id) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            },

            _toggleAgent: function (el) {
                var enabled = !el.attr('data-enabled');
                el.attr('data-enabled', enabled? 'true': '');
                el.toggleClass('list-group-item-success', enabled);
                el.toggleClass('text-muted', !enabled);
                el.children('i').toggleClass('fa-check', enabled);
                var square = el.children('i.fa-square');
                if (enabled) {
                    el.css('text-decoration', '');
                    square.css('color', square.attr('data-color'));
                } else {
                    el.css('text-decoration', 'line-through');
                    square.css('color', '#ccc');
                }
                var agent = agents.get(el.val());
                agent.set('selected', enabled);
                this.trigger('agent-toggle', agent.toJSON());
            },

            updateLatency: function (data) {
                if (!data) {
                    this.$('li.list-group-item small').each(function () {
                        $(this).text($(this).text().replace(/-.*/, '- '));
                    });
                }
                _.each(data, function (val, i) {
                    var latency = null;
                    if (!!val) {
                        latency = val.get("latency");
                    }
                    if (latency === null) {
                        latency = '??';
                    } else if (latency === -1) {
                        latency = '当机';
                    } else {
                        latency += 'ms';
                    }
                    var agentId = val.get('agent').id;
                    var el = this.$('li.list-group-item[data-agent-id=' + agentId + ']').find('small');
                    el.text(el.text().replace(/-.*/, '- ' + latency));
                });
            }
        });

        return ControlPanel;
    });
