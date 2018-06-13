/*
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

/**
 * @typedef {{}} LogEntry
 * @property {Date} timestamp
 * @property {string} level
 * @property {LogPart[]} parts
 */

/**
 * @typedef {string|Object|Error|Array} LogPart
 */

export class HttpLogSender {
    constructor({url}) {
        this.url = url;
    }

    /**
     * Queue a batch of logs to be sent asynchronously
     * @param {LogEntry[]} logs
     */
    sendAsync(logs) {
        console.log('This would asynchronously send logs to the server');
    }

    /**
     * Blocking send batch. If we're using a browser that doesn't support sendBeacon, this method will block until
     * we finish the request.
     */
    sendBlocking(logs) {
        console.log('This would synchronously send logs to the server');
    }
}