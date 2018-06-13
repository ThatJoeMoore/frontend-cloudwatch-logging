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

    serializeLogs(logs) {
        return logs.map(it => {
            let result = `${it.timestamp}\t${it.level}\t`;
            result += it.parts.map(part => {
                let type;
                let value;
                if (part.string) {
                    type = 'str';
                    value = part.string;
                } else if (part.event) {
                    type = 'evt';
                    value = part.event;
                } else if (part.error) {
                    type = 'err';
                    value = part.error;
                } else if (part.element) {
                    type = 'el';
                    value = part.element;
                } else if (part.object) {
                    type = 'obj';
                    value = part.object;
                }
                return `{${type}}${JSON.stringify(value)}`
            }).join('\t');
            return result;
        }).join('\n');
    }

    /**
     * Queue a batch of logs to be sent asynchronously
     * @param {LogEntry[]} logs
     */
    sendAsync(logs) {
        console.log('Sending', logs.length, 'logs to logging server @ ', this.url);
        const serialized = this.serializeLogs(logs);
        return doSend(this.url, serialized, true);
    }

    /**
     * Blocking send batch. If we're using a browser that doesn't support sendBeacon, this method will block until
     * we finish the request.
     */
    sendBlocking(logs) {
        console.log('Sending', logs.length, 'logs to logging server @ ', this.url, '(blocking)');
        const serialized = this.serializeLogs(logs);
        return doSend(this.url, serialized, false);
    }
}

function doSend(url, body, async = true) {
    if (navigator.sendBeacon) {
        return navigator.sendBeacon(url, body)
    } else {
        let client = new XMLHttpRequest();
        client.open('POST', url, async);
        client.sendRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        client.send(body);
        return true;
    }
}