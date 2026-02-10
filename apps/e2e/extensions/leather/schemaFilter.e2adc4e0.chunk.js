;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fd700ca7-b500-47b6-847b-17a24c46e8dd",e._sentryDebugIdIdentifier="sentry-dbid-fd700ca7-b500-47b6-847b-17a24c46e8dd")}catch(e){}}();

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
(self["webpackChunk_leather_io_extension"] = self["webpackChunk_leather_io_extension"] || []).push([[104],{

/***/ 86967:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ isPlanEventEnabled)
/* harmony export */ });
/**
 * Determines whether a track event is allowed to be sent based on the
 * user's tracking plan.
 * If the user does not have a tracking plan or the event is allowed based
 * on the tracking plan configuration, returns true.
 */
function isPlanEventEnabled(plan, planEvent) {
    var _a, _b;
    // Always prioritize the event's `enabled` status
    if (typeof (planEvent === null || planEvent === void 0 ? void 0 : planEvent.enabled) === 'boolean') {
        return planEvent.enabled;
    }
    // Assume absence of a tracking plan means events are enabled
    return (_b = (_a = plan === null || plan === void 0 ? void 0 : plan.__default) === null || _a === void 0 ? void 0 : _a.enabled) !== null && _b !== void 0 ? _b : true;
}
//# sourceMappingURL=is-plan-event-enabled.js.map

/***/ }),

/***/ 38350:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   schemaFilter: () => (/* binding */ schemaFilter)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3460);
/* harmony import */ var _lib_is_plan_event_enabled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86967);


function disabledActionDestinations(plan, settings) {
    var _a, _b;
    if (!plan || !Object.keys(plan)) {
        return {};
    }
    var disabledIntegrations = plan.integrations
        ? Object.keys(plan.integrations).filter(function (i) { return plan.integrations[i] === false; })
        : [];
    // This accounts for cases like Fullstory, where the settings.integrations
    // contains a "Fullstory" object but settings.remotePlugins contains "Fullstory (Actions)"
    var disabledRemotePlugins = [];
    ((_a = settings.remotePlugins) !== null && _a !== void 0 ? _a : []).forEach(function (p) {
        disabledIntegrations.forEach(function (int) {
            if (p.creationName == int) {
                disabledRemotePlugins.push(p.name);
            }
        });
    });
    return ((_b = settings.remotePlugins) !== null && _b !== void 0 ? _b : []).reduce(function (acc, p) {
        if (p.settings['subscriptions']) {
            if (disabledRemotePlugins.includes(p.name)) {
                // @ts-expect-error element implicitly has an 'any' type because p.settings is a JSONObject
                p.settings['subscriptions'].forEach(
                // @ts-expect-error parameter 'sub' implicitly has an 'any' type
                function (sub) { return (acc["".concat(p.name, " ").concat(sub.partnerAction)] = false); });
            }
        }
        return acc;
    }, {});
}
function schemaFilter(track, settings) {
    function filter(ctx) {
        var plan = track;
        var ev = ctx.event.event;
        if (plan && ev) {
            var planEvent = plan[ev];
            if (!(0,_lib_is_plan_event_enabled__WEBPACK_IMPORTED_MODULE_0__/* .isPlanEventEnabled */ .j)(plan, planEvent)) {
                ctx.updateEvent('integrations', (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, ctx.event.integrations), { All: false, 'Segment.io': true }));
                return ctx;
            }
            else {
                var disabledActions = disabledActionDestinations(planEvent, settings);
                ctx.updateEvent('integrations', (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, ctx.event.integrations), planEvent === null || planEvent === void 0 ? void 0 : planEvent.integrations), disabledActions));
            }
        }
        return ctx;
    }
    return {
        name: 'Schema Filter',
        version: '0.1.0',
        isLoaded: function () { return true; },
        load: function () { return Promise.resolve(); },
        type: 'before',
        page: filter,
        alias: filter,
        track: filter,
        identify: filter,
        group: filter,
    };
}
//# sourceMappingURL=index.js.map

/***/ })

}]);
//# sourceMappingURL=schemaFilter.e2adc4e0.chunk.js.map