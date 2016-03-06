# -*- coding: UTF-8 -*-
import math
import random
from flask import render_template, make_response, request
from cloud_dashing.basemain import app
import time
import json


@app.route('/')
def index():
    return render_template('index.html', time=time.time())

@app.route("/cloud-dashing")
def cloud_dashing():
    return render_template('cloud-dashing.html', time=time.time())

@app.route('/api/agents')
def agents_view():
    ret = make_response(json.dumps([
        {
            'id': 1,
            'name': '百度云',
            'location': '北京市',
            'color': 'blue',
            'crash_in_week': 2,
            'latency_in_week': [
                (1, 0),
                (2, 100),
            ],
            'crash_in_month': 1,
            'latency_in_month': [
                (1, 0),
                (2, 110),
            ],
            'official_site': 'http://www.baidu.com',
        },
        {
            'id': 2,
            'name': '阿里云',
            'location': '杭州市',
            'color': 'green',
            'crash_in_week': 0,
            'latency_in_week': [
                (2, 0),
                (1, 100),
            ],
            'crash_in_month': 1,
            'latency_in_month': [
                (2, 0),
                (1, 110),
            ],
            'official_site': 'http://www.taobao.com',
        },
    ]))
    ret.headers['Content-Type'] = 'application/json'
    return ret


@app.route('/api/reports/<int:viewpoint_id>')
def reports_view(viewpoint_id):
    start = request.args.get('start', type=int)
    end = request.args.get('end', type=int)

    if not (start and end and viewpoint_id):
        return 'invalid parameter', 403

    step = 20 * 60 * 1000

    def _makeSlice(i):
        import random
        i += random.randint(0, 100)
        latency1 = viewpoint_id * 20 + abs(
            math.floor(15 + math.sin(i / 20 + 1) * 20 +
                       math.sin(i / 10 + 0.5) * 10))
        latency2 = viewpoint_id * 30 + abs(
            math.floor(15 + math.sin(i / 20 + 1) * 20 +
                       math.sin(i / 10 + 0.5) * 10))

        return dict(at=start + i,
                    statusList=[
                        {
                            'id': 1,
                            'latency': latency1,
                            'available': True if 0 < latency1 < 100 else False,
                            'db': True if 0 < latency1 < 50 else False
                        },
                        {
                            'id': 2,
                            'latency': latency2,
                            'available': True if 0 < latency1 < 100 else False,
                            'db': True if 0 < latency1 < 50 else False
                        }])

    ret = [_makeSlice(i) for i in xrange(0, end - start, step)]

    ret = make_response(json.dumps(ret))
    ret.headers['Content-Type'] = 'application/json'
    return ret


@app.route('/api/daily-reports/<int:viewpoint_id>')
def daily_reports_view(viewpoint_id):
    start = request.args.get('start', type=int)
    end = request.args.get('end', type=int)

    if not (start and end and viewpoint_id):
        return 'invalid parameter', 403

    step = 24 * 60 * 60 * 1000

    def _makeSlice(i):
        latency1 = viewpoint_id * random.randint(20, 30) + abs(
            math.floor(15 + math.sin(i / 20 + 1) * 20 +
                       math.sin(i / 10 + 0.5) * 10))
        latency2 = viewpoint_id * random.randint(30, 40) + abs(
            math.floor(15 + math.sin(i / 20 + 1) * 20 +
                       math.sin(i / 10 + 0.5) * 10))
        return dict(at=start + i,
                    statusList=[
                        {
                            'id': 1,
                            'latency': latency1,
                            'crash_num': random.randint(0, 3),
                        },
                        {
                            'id': 2,
                            'latency': latency2,
                            'crash_num': random.randint(0, 3),
                        },
                    ])

    ret = [_makeSlice(i) for i in xrange(0, end - start, step)]
    ret = make_response(json.dumps(ret))
    ret.headers['Content-Type'] = 'application/json'
    return ret
