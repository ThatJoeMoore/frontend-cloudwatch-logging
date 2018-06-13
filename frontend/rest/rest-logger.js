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

import {EVENT_MESSAGE} from "./constants.js";
import {FlushingQueue} from "./flushing-queue.js";
import {HttpLogSender} from "./send.js";
import {formatMessage} from "./format-messages.js";

export const DEFAULT_BATCH_SIZE = 20;
export const DEFAULT_MAX_SECONDS_BETWEEN_BATCHES = 10;


/**
 * @typedef {{}} LogEntry
 * @property {Date} timestamp
 * @property {string} level
 * @property {LogPart[]} parts
 */

/**
 * @typedef {string|Object|Error|Array} LogPart
 */

function buildDefaultQueue({maxItems, onFlush}) {
    return new FlushingQueue({maxItems, onFlush});
}

function buildDefaultSender({url}) {
    return new HttpLogSender({url});
}

export class RestLogger {
    constructor({
                    url,
                    batchSize = DEFAULT_BATCH_SIZE,
                    maxSecondsBetweenBatches = DEFAULT_MAX_SECONDS_BETWEEN_BATCHES
                },
                buildQueue = buildDefaultQueue,
                buildSender = buildDefaultSender,
    ) {
        this.url = url;
        this.batchSize = batchSize;
        this.maxSecondsBetweenBatches = maxSecondsBetweenBatches;

        this.__queue = buildQueue({maxItems: batchSize, onFlush: batch => this.__dispatchBatch(batch)});
        this.__sender = buildSender({url});
    }

    connect() {
        this.__listener = e => this.onLogMessage(e);

        document.addEventListener(EVENT_MESSAGE, this.__listener, false);

        this.__batchFlusher = window.setInterval(() => this.__forceFlush(), this.maxSecondsBetweenBatches * 1000);

        this.__unloadListener = () => this.__onUnload();

        window.addEventListener('unload', this.__unloadListener);
    }

    disconnect() {
        window.clearInterval(this.__batchFlusher);

        if (this.__listener) {
            document.removeEventListener(EVENT_MESSAGE, this.__listener, false);
            this.__listener = undefined;
        }
        if (this.__unloadListener) {
            window.removeEventListener('unload', this.__unloadListener);
            this.__unloadListener = undefined;
        }
    }

    onLogMessage(e) {
        this.__queue.enqueue(formatMessage(e.detail));
    }

    __dispatchBatch(messages) {
        this.__sender.sendAsync(messages);
    }

    __forceFlush() {
        this.__queue.flush();
    }

    __onUnload() {
        this.disconnect();
        const items = this.__queue.items;
        if (items.length !== 0) {
            this.__sender.sendBlocking(items);
        }
    }
}
