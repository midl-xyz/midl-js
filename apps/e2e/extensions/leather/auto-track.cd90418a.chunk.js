;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="93c448c4-9694-48fb-9009-5a0bac4a7f53",e._sentryDebugIdIdentifier="sentry-dbid-93c448c4-9694-48fb-9009-5a0bac4a7f53")}catch(e){}}();

    var _global =
      typeof window !== 'undefined' ?
        window :
        typeof global !== 'undefined' ?
          global :
          typeof self !== 'undefined' ?
            self :
            {};

    _global.SENTRY_RELEASE={id:"6.51.1"};
"use strict";
(self["webpackChunk_leather_io_extension"] = self["webpackChunk_leather_io_extension"] || []).push([[248],{

/***/ 20127:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   form: () => (/* binding */ form),
/* harmony export */   link: () => (/* binding */ link)
/* harmony export */ });
/* harmony import */ var _callback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93271);

// Check if a user is opening the link in a new tab
function userNewTab(event) {
    var typedEvent = event;
    if (typedEvent.ctrlKey ||
        typedEvent.shiftKey ||
        typedEvent.metaKey ||
        (typedEvent.button && typedEvent.button == 1)) {
        return true;
    }
    return false;
}
// Check if the link opens in new tab
function linkNewTab(element, href) {
    if (element.target === '_blank' && href) {
        return true;
    }
    return false;
}
function link(links, event, properties, options) {
    var _this = this;
    var elements = [];
    // always arrays, handles jquery
    if (!links) {
        return this;
    }
    if (links instanceof Element) {
        elements = [links];
    }
    else if ('toArray' in links) {
        elements = links.toArray();
    }
    else {
        elements = links;
    }
    elements.forEach(function (el) {
        el.addEventListener('click', function (elementEvent) {
            var _a, _b;
            var ev = event instanceof Function ? event(el) : event;
            var props = properties instanceof Function ? properties(el) : properties;
            var href = el.getAttribute('href') ||
                el.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
                el.getAttribute('xlink:href') ||
                ((_a = el.getElementsByTagName('a')[0]) === null || _a === void 0 ? void 0 : _a.getAttribute('href'));
            var trackEvent = (0,_callback__WEBPACK_IMPORTED_MODULE_0__/* .pTimeout */ .s2)(_this.track(ev, props, options !== null && options !== void 0 ? options : {}), (_b = _this.settings.timeout) !== null && _b !== void 0 ? _b : 500);
            if (!linkNewTab(el, href) &&
                !userNewTab(elementEvent)) {
                if (href) {
                    elementEvent.preventDefault
                        ? elementEvent.preventDefault()
                        : (elementEvent.returnValue = false);
                    trackEvent
                        .catch(console.error)
                        .then(function () {
                        window.location.href = href;
                    })
                        .catch(console.error);
                }
            }
        }, false);
    });
    return this;
}
function form(forms, event, properties, options) {
    var _this = this;
    // always arrays, handles jquery
    if (!forms)
        return this;
    if (forms instanceof HTMLFormElement)
        forms = [forms];
    var elements = forms;
    elements.forEach(function (el) {
        if (!(el instanceof Element))
            throw new TypeError('Must pass HTMLElement to trackForm/trackSubmit.');
        var handler = function (elementEvent) {
            var _a;
            elementEvent.preventDefault
                ? elementEvent.preventDefault()
                : (elementEvent.returnValue = false);
            var ev = event instanceof Function ? event(el) : event;
            var props = properties instanceof Function ? properties(el) : properties;
            var trackEvent = (0,_callback__WEBPACK_IMPORTED_MODULE_0__/* .pTimeout */ .s2)(_this.track(ev, props, options !== null && options !== void 0 ? options : {}), (_a = _this.settings.timeout) !== null && _a !== void 0 ? _a : 500);
            trackEvent
                .catch(console.error)
                .then(function () {
                el.submit();
            })
                .catch(console.error);
        };
        // Support the events happening through jQuery or Zepto instead of through
        // the normal DOM API, because `el.submit` doesn't bubble up events...
        var $ = window.jQuery || window.Zepto;
        if ($) {
            $(el).submit(handler);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            el.addEventListener('submit', handler, false);
        }
    });
    return this;
}
//# sourceMappingURL=auto-track.js.map

/***/ })

}]);
//# sourceMappingURL=auto-track.cd90418a.chunk.js.map