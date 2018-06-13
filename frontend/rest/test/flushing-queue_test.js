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

import {FlushingQueue} from "../flushing-queue.js";

describe('Flushing Queue', function () {
    describe('enqueue', function () {
        it('calls the provided onFlush whenever the queue reaches a certain size', function () {
            let called = false;
            const onFlush = () => called = true;
            const q = new FlushingQueue({maxItems: 1, onFlush});

            expect(called).to.be.false;

            q.enqueue({});

            expect(called).to.be.true;
        });
    });
    describe('flush', function() {
        it('calls onFlush regardless of how much we have enqueued', function() {
            let callArgs = null;
            const onFlush = items => callArgs = items;
            const q = new FlushingQueue({maxItems: 2, onFlush});

            const expected = {};

            q.enqueue(expected);

            expect(callArgs).to.be.null;

            const result = q.flush();

            expect(result).to.be.true;
            expect(callArgs).to.have.lengthOf(1);
            expect(callArgs).to.include(expected);

        });
    });
});
