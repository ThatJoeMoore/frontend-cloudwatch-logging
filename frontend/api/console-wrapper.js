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

"use strict";

export function wrapConsole() {
    if (!window.console || !('log' in window.console)) {
        return new NoOpConsole();
    }
    if (hasAllMethods(window.console)) {
        return window.console;
    }
    return new PartialPassthruConsole(window.console);
}

function hasAllMethods(obj) {
    return 'debug' in obj &&
        'log' in obj &&
        'info' in obj &&
        'warn' in obj &&
        'error' in obj;
}

export class NoOpConsole {
    debug() {
    }

    log() {
    }

    info() {
    }

    warn() {
    }

    error() {
    }
}

export class PartialPassthruConsole {
    constructor(delegate) {
        this.delegate = delegate;

        this._debug = 'debug' in this.delegate ? args => this.delegate.debug(...args) : args => this.delegate.log('DEBUG', ...args);
        this._info = 'info' in this.delegate ? args => this.delegate.info(...args) : args => this.delegate.log('INFO', ...args);
        this._warn = 'warn' in this.delegate ? args => this.delegate.warn(...args) : args => this.delegate.log('WARN', ...args);
        this._error = 'error' in this.delegate ? args => this.delegate.error(...args) : args => this.delegate.log('ERROR', ...args);

    }

    debug(...args) {
        this._debug(args)
    }

    log(...args) {
        this.delegate.log(...args);
    }

    info(...args) {
        this._info(args);
    }

    warn(...args) {
        this._warn(args);
    }

    error(...args) {
        this._error(args);
    }
}


