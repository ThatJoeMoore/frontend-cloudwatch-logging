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


export function formatMessage({timestamp, level, parts}) {
    return {
        timestamp: timestamp.toISOString(),
        level,
        parts: parts.map(formatMessagePart)
    }
}

export function formatMessagePart(part) {
    if (typeof part === 'string') {
        return {string: part};
    }
    if (part instanceof Error) {
        return {error: formatError(part)};
    }
    if (part instanceof Event) {
        return {event: formatEvent(part)};
    }
    if (part instanceof HTMLElement) {
        return {element: formatElement(part)};
    }
    return {object: part};
}

export function formatError(error) {
    return {
        type: error.type,
        message: error.message,
        stack: error.stack
    };
}

export function formatEvent(event) {
    if (window.CustomEvent && event instanceof CustomEvent) {
        return formatCustomEvent(event);
    } else {
        return maybeFormatBuiltinEvent(event);
    }
}

export function formatElement(element) {
    if (!element) return undefined;
    let result = '<' + element.localName;
    if (element.id) {
        result += ` id="${element.id}"`
    }
    if (element.classList.length > 0) {
        result += ` class="${element.classList.toString()}"`;
    }

    return result + '>';
}

function formatCustomEvent(event) {
    return {
        type: event.type,
        srcElement: formatElement(event.srcElement),
        detail: event.detail
    };
}

function maybeFormatBuiltinEvent(event) {
    const type = event.type;
    if (event instanceof KeyboardEvent) {
        warn('Not sending keyboard events; sending it could open up security holes');
        return null;
    }
    if (type === 'input') {
        warn('Not sending input event; sending it could open up security holes');
        return null;
    }
    return {
        type,
        srcElement: formatElement(event.srcElement)
    }
}

function warn(text) {
    if (!console) return;
    if (console.warn) console.warn(text);
    console.log('[WARN]', text);
}

