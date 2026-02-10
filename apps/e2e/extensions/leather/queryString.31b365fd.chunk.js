;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="aea67c92-bbd8-4846-8b13-0e2599d15800",e._sentryDebugIdIdentifier="sentry-dbid-aea67c92-bbd8-4846-8b13-0e2599d15800")}catch(e){}}();

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
(self["webpackChunk_leather_io_extension"] = self["webpackChunk_leather_io_extension"] || []).push([[538],{

/***/ 5509:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  queryString: () => (/* binding */ queryString)
});

;// CONCATENATED MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/core/query-string/pickPrefix.js
/**
 * Returns an object containing only the properties prefixed by the input
 * string.
 * Ex: prefix('ajs_traits_', { ajs_traits_address: '123 St' })
 * will return { address: '123 St' }
 **/
function pickPrefix(prefix, object) {
    return Object.keys(object).reduce(function (acc, key) {
        if (key.startsWith(prefix)) {
            var field = key.substr(prefix.length);
            acc[field] = object[key];
        }
        return acc;
    }, {});
}
//# sourceMappingURL=pickPrefix.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/core/query-string/gracefulDecodeURIComponent.js
var gracefulDecodeURIComponent = __webpack_require__(64035);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-core@1.6.0/node_modules/@segment/analytics-core/dist/esm/validation/helpers.js
var helpers = __webpack_require__(68606);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/core/query-string/index.js



function queryString(analytics, query) {
    var a = document.createElement('a');
    a.href = query;
    var parsed = a.search.slice(1);
    var params = parsed.split('&').reduce(function (acc, str) {
        var _a = str.split('='), k = _a[0], v = _a[1];
        acc[k] = (0,gracefulDecodeURIComponent/* gracefulDecodeURIComponent */.p)(v);
        return acc;
    }, {});
    var calls = [];
    var ajs_uid = params.ajs_uid, ajs_event = params.ajs_event, ajs_aid = params.ajs_aid;
    var _a = (0,helpers/* isPlainObject */.Qd)(analytics.options.useQueryString)
        ? analytics.options.useQueryString
        : {}, _b = _a.aid, aidPattern = _b === void 0 ? /.+/ : _b, _c = _a.uid, uidPattern = _c === void 0 ? /.+/ : _c;
    if (ajs_aid) {
        var anonId = Array.isArray(params.ajs_aid)
            ? params.ajs_aid[0]
            : params.ajs_aid;
        if (aidPattern.test(anonId)) {
            analytics.setAnonymousId(anonId);
        }
    }
    if (ajs_uid) {
        var uid = Array.isArray(params.ajs_uid)
            ? params.ajs_uid[0]
            : params.ajs_uid;
        if (uidPattern.test(uid)) {
            var traits = pickPrefix('ajs_trait_', params);
            calls.push(analytics.identify(uid, traits));
        }
    }
    if (ajs_event) {
        var event_1 = Array.isArray(params.ajs_event)
            ? params.ajs_event[0]
            : params.ajs_event;
        var props = pickPrefix('ajs_prop_', params);
        calls.push(analytics.track(event_1, props));
    }
    return Promise.all(calls);
}
//# sourceMappingURL=index.js.map

/***/ })

}]);
//# sourceMappingURL=queryString.31b365fd.chunk.js.map