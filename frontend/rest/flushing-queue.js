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

export class FlushingQueue {
    constructor({maxItems, onFlush}) {
        this.maxItems = maxItems;
        this.__onFlush = onFlush;
        this.__queue = [];
    }

    get items() {
        return this.__queue;
    }

    enqueue(item) {
        this.__queue.push(item);
        if (this.__queue.length >= this.maxItems) {
            this.flush();
        }
    }

    flush() {
        if (this.__queue.length === 0) {
            return false;
        }
        const copy = [].concat(this.__queue);
        this.__queue.length = 0;
        this.__onFlush(copy);
        return true;
    }
}
