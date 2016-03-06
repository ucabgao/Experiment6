crowd-pulse-web-ui
==================

Crowd Pulse Web Application.

------------------

## Configuration

To specify the port to start the server on, set the `CROWD_PULSE_UI_PORT` environment variable 
(defaults to 3000).

To configure the application, write and put a `config.json` file (see [sample](config.json.sample))
in the `dist` directory:

```json
{
  "api": "http://your-server-machine:5000/api/",
  "socket": "http://your-server-machine:5000/",
  "index": "http://your-index-machine:9000/rest/"
}
```

Alternatively, you can set the following environment variables that will be used if the JSON file
does not exist:

* `CROWD_PULSE_UI_API` instead of `api`
* `CROWD_PULSE_UI_SOCKET` instead of `socket`
* `CROWD_PULSE_UI_INDEX` instead of `index`

## Run

To execute the application, run `node ./bin/crowd-pulse-web-ui.js`.

## License

```
  Copyright 2015 Francesco Pontillo

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

```
