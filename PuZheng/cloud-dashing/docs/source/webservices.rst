#####################
公有云项目WEB接口列表
#####################


.. _get_viewpoint_list:

I-1 获取观察点列表
==============

获取所有的观察点(即数据采集服务器)列表，

* 请求

  .. code-block:: bash

      GET /viewpoint-list

* 响应 - http code 200

  .. code-block:: python 

      {
         "data": [
            {
               "id": # viewpoint id
               "name": <str>, # 用于展示的名称， 例如"上海"
               "location": <str>, # 观察点的正式名称，例如"上海市"，用于地址反解析
            }
         ]
      }

.. _get_cloud_list:

I-2 获取被监控云列表
================
获取所有被监控的云列表

* 请求

  .. code-block:: bash

      GET /cloud-list

* 响应 - http code 200

  .. code-block:: python

      {
         "data": [
            {
               "id": <int>, # 监控云的唯一编号，后续会使用该编号获取数据
               "name": <str>, # 云名称 
               "location": <str>,  # 云地址，用于地址反解析 
            },
            # ...
         ]
      }

 
.. _get_viewpoint_cloud_status_list:

I-3 获取某个观察点所有被监控云状态
==============================

获取对指定观察点的，某些云的状态

* 请求 

  .. code-block:: bash

      GET /viewpoint-cloud-status-list/<int:viewpoint>?clouds=(<int>,)+&at=<int>[,<int>]


 * viewpoint - 观察点id, 参见 :ref:`get_viewpoint_list`
 * clouds - 云id列表, 例如"1,2,3", 可选项，若提供，只提供这些云的详细信息; 否则提供所有云的详细信息，参见 :ref:`get_cloud_list`
 * at - 返回某时间点或区间的云状态，值是自epoch time(1970年1月1日0:00)的秒数, 
   可选项，若不传，返回当前最近的状态信息. 例如 *"1390301420"* 需要返回离此时刻最近的状态, 而 *"1390301420,1390311420"* 需要返回位于时间段 *[1390301420, 1390311420)* 的所有状态

* 响应 - http code 200

  .. code-block:: python
   
      {
         "data": [
            {
               "id": <int>, # 云id
               "status-list":  # 每个时间点的状态信息
               [
                  {
                     "latency": <int>,  # 延迟，单位是毫秒(0.001秒)
                     "up": 0|1,  # 可用? 1: 0
                     "at": <int>,  # seconds since epoch, 注意!!!, 这里是实际的采集时间点，不是在url参数中传入的时间点
                  }
                  # ...
               ]
            },
            # ...
         ] 
      }

* 响应 - http code 403, 参数非法

  .. code-block:: python

      <str>  # 内容是错误原因，例如"不存在的观察点"


I-4 获取某个云在某些观察点的状态
================================

:ref:`get_viewpoint_cloud_status_list` 的正交操作 

* 请求
   
  .. code-block:: bash

   GET /cloud-status-list/<int:cloud>?viewpoints=(<int>,)+&at=<int>[,<int>]


 * cloud - 云id, 参见 :ref:`get_cloud_list`
 * viewpoints - 观察点id列表， 例如"4,5,6", 可选项，若提供，只提供这些观察点的状态信息，否则提供所有云的详细信息， 参见 :ref:`get_viewpoint_list`
 * at - 返回某时间点或区间的云状态，值是自epoch time(1970年1月1日0:00)的秒数, 
   可选项，若不传，返回当前最近的状态信息. 例如 *"1390301420"* 需要返回离此时刻最近的状态, 而 *"1390301420,1390311420"* 需要返回位于时间段 *[1390301420, 1390311420)* 的所有状态
 

* 响应 - http code 200

  .. code-block:: python
   
      {
         "data": [
            {
               "id": <int>, # 观察点id
               "status-list":  # 每个时间点的状态信息
               [
                  {
                     "latency": <int>,  # 延迟，单位是毫秒(0.001秒)
                     "up": 0|1,  # 可用? 1: 0
                     "at": <int>,  # seconds since epoch, 注意!!!, 这里是实际的采集时间点，不是在url参数中传入的时间点
                  }
                  # ...
               ]
            },
            # ...
         ] 
      }

* 响应 - http code 403, 参数非法

  .. code-block:: python

      <str>  # 内容是错误原因，例如"不存在的云"

.. _get_cloud_daily_report_list:

I-5 获取某个云在各个观察点的日报
==================================

* 请求

  .. code-block:: bash

   GET /cloud-daily-report-list/<int:cloud>?viewpoints=(<int>,)+&at=<str>[,<str>]
   
 * cloud - 云id, 参见 :ref:`get_cloud_list`
 * viewpoints - 观察点id列表， 例如"4,5,6", 可选项，若提供，只提供这些观察点的状态信息，否则提供所有云的详细信息， 参见 :ref:`get_viewpoint_list`
 * at - 返回某日或区间的云状态，注意，格式必须是 *"yyyy-mm-dd"*, 
   可选项，若不传，返回当日的状态信息. 例如 *"2013-01-16"* 返回2013-01-16日的总结, 而 *"2013-01-01,2013-01-16"* 需要返回位于时间段 *[2013-01-01, 2013-01-16)* 的所有日报，注意是半开半闭区间

* 响应 - http code 200

  .. code-block:: python
   
      {
         "data": [
            {
               "id": <int>, # 观察点id
               "report-list":  # 每个时间点的状态信息
               [
                  {
                     "avg_latency": <int>,  # 平均延迟，单位是毫秒(0.001秒)
                     "crash_num": <int>,  # crash次数
                     "at": <str>,  # yyyy-mm-dd
                  }
                  # ...
               ]
            },
            # ...
         ] 
      }

* 响应 - http code 403, 参数非法

  .. code-block:: python

      <str>  # 内容是错误原因，例如"不存在的云"
 

I-6 获取某个观察点上各个云的日报
==================================

:ref:`get_cloud_daily_report_list` 的正交操作


* 请求

  .. code-block:: bash

   GET /viewpoint-cloud-daily-report-list/<int:viewpoint>?clouds=(<int>,)+&at=<str>[,<str>]
   
 * viewpoint - 观察点id, 参见 :ref:`get_viewpoint_list`
 * clouds - 云id列表, 例如"1,2,3", 可选项，若提供，只提供这些云的详细信息; 否则提供所有云的详细信息，参见 :ref:`get_cloud_list`
 * at - 返回某日或区间的云状态，注意，格式必须是 *"yyyy-mm-dd"*, 
   可选项，若不传，返回当日的状态信息. 例如 *"2013-01-16"* 返回2013-01-16日的总结, 而 *"2013-01-01,2013-01-16"* 需要返回位于时间段 *[2013-01-01, 2013-01-16)* 的所有日报，注意是半开半闭区间

* 响应 - http code 200

  .. code-block:: python
   
      {
         "data": [
            {
               "id": <int>, # 云id
               "report-list":  # 每个时间点的状态信息
               [
                  {
                     "avg_latency": <int>,  # 平均延迟，单位是毫秒(0.001秒)
                     "crash_num": <int>,  # crash次数
                     "at": <str>,  # yyyy-mm-dd
                  }
                  # ...
               ]
            },
            # ...
         ] 
      }

* 响应 - http code 403, 参数非法

  .. code-block:: python

      <str>  # 内容是错误原因，例如"不存在的云"
 


