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

import {wrapConsole} from "./console-wrapper.js";
import {EVENT_MESSAGE} from "./constants.js";

const consoleLog = wrapConsole();

export function event(event) {
    const message = {timestamp: new Date(), level: 'event', parts: [event]};
    consoleLog.log(message.timestamp.toISOString(), 'Event', event);
    dispatchLog(message);
}

export function log(...args) {
    const message = {timestamp: new Date(), level: 'default', parts: args};
    consoleLog.log(message.timestamp.toISOString(), ...args);
    dispatchLog(message);
}

export function debug(...args) {
    const message = {timestamp: new Date(), level: 'debug', parts: args};
    consoleLog.debug(message.timestamp.toISOString(), ...args);
    dispatchLog(message);
}

export function info(...args) {
    const message = {timestamp: new Date(), level: 'info', parts: args};
    consoleLog.info(message.timestamp.toISOString(), ...args);
    dispatchLog(message);
}

export function warn(...args) {
    const message = {timestamp: new Date(), level: 'warn', parts: args};
    consoleLog.warn(message.timestamp.toISOString(), ...args);
    dispatchLog(message);
}

export function error(...args) {
    const message = {timestamp: new Date(), level: 'error', parts: args};
    consoleLog.error(message.timestamp.toISOString(), ...args);
    dispatchLog(message);
}

// TODO( Handle the case where an instance of the log API loads before the provider does )

function dispatchLog(message) {
    let event;
    if (typeof window.CustomEvent === 'function') {
        event = new CustomEvent(EVENT_MESSAGE, {detail: message});
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(EVENT_MESSAGE, true, false, message);
    }
    document.dispatchEvent(event);
}