/* Tests for server */
var server = require('../server');
var config = require('../config');
var nodeUnit = require('nodeunit');
var http = require('http');
var httputil = nodeUnit.utils.httputil;

//port the test server will listen on
var test_port = "8000";

var config = config.config;
config.port = test_port;

/* Server response testing function factory */
function ServerResponseTestFactory(request_params, property_to_test, expected_value) {
    return function(test) {
        var response_callback = server.response_callback; //the URL routing function of the server
        console.log(config);

        //Start the dummy server
        server.start(config);   
     
        //Create the request object and emmit it 
        var request = http.request(request_params, function(response){
                console.log(response);
                //TODO: Add the possibility to test an array of properties and values
                test.equal(response[property_to_test], expected_value);
            });
        request.end();

    }
}

/* Test cases start here */
var existant_req_params = { 
    host: "127.0.0.1",
    port: test_port,
    path: "", //Index page in the config file
    method: 'GET'
}
exports['test_existant_url'] = ServerResponseTestFactory(existant_req_params, 'statusCode', 200);

var non_existant_req_params = { 
    host: "127.0.0.1",
    port: test_port,
    path: "/DoesNotExist", //Non existant URL
    method: 'GET'
}
exports['test_nonexistant_url'] = ServerResponseTestFactory(non_existant_req_params, 'statusCode', 404);

