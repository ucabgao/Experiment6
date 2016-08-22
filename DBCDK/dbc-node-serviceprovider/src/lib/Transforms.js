'use strict';
/**
 * @file
 * Module for registering all transforms
 */
/// <reference path="lodash.d.ts" />
//import {isArray} from 'lodash';
//import {now} from './Utils.js';
function isArray(x) { }
;
function now() { }
;
/**
 * Validate the transform object.
 *
 * @param {Object} transform
 * @return {Object}
 * @throws {Error}
 * @api public
 */
function validateTransform(transform) {
    if (!transform.event) {
        throw new Error('No event method not found on transform');
    }
    if (!transform.requestTransform) {
        throw new Error('No requestTransform method not found on transform');
    }
    if (!transform.responseTransform) {
        throw new Error('No responseTransform method not found on transform');
    }
    return transform;
}
/**
 *
 * @param transform
 * @param clients
 * @param logger
 * @returns {trigger}
 */
function Transform(transform, clients, logger) {
    if (logger === void 0) { logger = console; }
    validateTransform(transform);
    transform.clients = clients;
    transform.logger = logger;
    /**
     *
     * @deprecated
     * Call the clients directly through the clients object. this.clients.clientName.method(params);
     *
     * @param client
     * @param method
     * @param params
     * @returns {*}
     */
    transform.callServiceClient = function callServiceClient(client, method, params) {
        return clients[client][method](params);
    };
    /**
     * Trigger request on a transform
     *
     * @param params
     * @param context
     * @param callback
     */
    transform.trigger = function trigger(params, context) {
        var requestStart = now();
        var event = transform.event();
        var request = transform.requestTransform(event, params, context);
        var requests = isArray(request) && request || [request];
        return requests.map(function (requestPromise) {
            return requestPromise
                .then(function (response) {
                var transformedResponse = transform.responseTransform(response, params, context);
                var requestStop = now();
                logger.log('info', 'Transform has been triggered', {
                    event: event,
                    timing: requestStop - requestStart,
                    request: params
                });
                return transformedResponse;
            });
        });
    };
    return transform;
}
exports.__esModule = true;
exports["default"] = Transform;
