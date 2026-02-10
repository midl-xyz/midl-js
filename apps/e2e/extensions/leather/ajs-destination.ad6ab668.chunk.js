;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="05124d3f-7929-4f73-ba20-27d69f84a283",e._sentryDebugIdIdentifier="sentry-dbid-05124d3f-7929-4f73-ba20-27d69f84a283")}catch(e){}}();

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
(self["webpackChunk_leather_io_extension"] = self["webpackChunk_leather_io_extension"] || []).push([[50],{

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

/***/ 48012:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  LegacyDestination: () => (/* binding */ LegacyDestination),
  ajsDestinations: () => (/* binding */ ajsDestinations)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/tslib@2.7.0/node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(3460);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+facade@3.4.10/node_modules/@segment/facade/dist/index.js
var dist = __webpack_require__(94650);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/core/connection/index.js
var connection = __webpack_require__(9273);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/core/context/index.js
var context = __webpack_require__(64636);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-core@1.6.0/node_modules/@segment/analytics-core/dist/esm/context/index.js + 1 modules
var esm_context = __webpack_require__(56135);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/core/environment/index.js
var environment = __webpack_require__(97750);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-core@1.6.0/node_modules/@segment/analytics-core/dist/esm/queue/delivery.js
var delivery = __webpack_require__(35463);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/lib/is-plan-event-enabled.js
var is_plan_event_enabled = __webpack_require__(86967);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/lib/merged-options.js
var merged_options = __webpack_require__(54475);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/lib/p-while.js
var p_while = __webpack_require__(56030);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-core@1.6.0/node_modules/@segment/analytics-core/dist/esm/priority-queue/index.js + 1 modules
var priority_queue = __webpack_require__(40642);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/lib/priority-queue/persisted.js
var persisted = __webpack_require__(15568);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/plugins/middleware/index.js
var middleware = __webpack_require__(40326);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/lib/parse-cdn.js
var parse_cdn = __webpack_require__(21131);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/lib/load-script.js
var load_script = __webpack_require__(41214);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/plugins/ajs-destination/loader.js



function normalizeName(name) {
    return name.toLowerCase().replace('.', '').replace(/\s+/g, '-');
}
function obfuscatePathName(pathName, obfuscate) {
    if (obfuscate === void 0) { obfuscate = false; }
    return obfuscate ? btoa(pathName).replace(/=/g, '') : undefined;
}
function resolveIntegrationNameFromSource(integrationSource) {
    return ('Integration' in integrationSource
        ? integrationSource.Integration
        : integrationSource).prototype.name;
}
function recordLoadMetrics(fullPath, ctx, name) {
    var _a, _b;
    try {
        var metric = ((_b = (_a = window === null || window === void 0 ? void 0 : window.performance) === null || _a === void 0 ? void 0 : _a.getEntriesByName(fullPath, 'resource')) !== null && _b !== void 0 ? _b : [])[0];
        // we assume everything that took under 100ms is cached
        metric &&
            ctx.stats.gauge('legacy_destination_time', Math.round(metric.duration), (0,tslib_es6.__spreadArray)([
                name
            ], (metric.duration < 100 ? ['cached'] : []), true));
    }
    catch (_) {
        // not available
    }
}
function buildIntegration(integrationSource, integrationSettings, analyticsInstance) {
    var integrationCtr;
    // GA and Appcues use a different interface to instantiating integrations
    if ('Integration' in integrationSource) {
        var analyticsStub = {
            user: function () { return analyticsInstance.user(); },
            addIntegration: function () { },
        };
        integrationSource(analyticsStub);
        integrationCtr = integrationSource.Integration;
    }
    else {
        integrationCtr = integrationSource;
    }
    var integration = new integrationCtr(integrationSettings);
    integration.analytics = analyticsInstance;
    return integration;
}
function loadIntegration(ctx, name, version, obfuscate) {
    return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
        var pathName, obfuscatedPathName, path, fullPath, err_1, deps;
        return (0,tslib_es6.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pathName = normalizeName(name);
                    obfuscatedPathName = obfuscatePathName(pathName, obfuscate);
                    path = (0,parse_cdn/* getNextIntegrationsURL */.YM)();
                    fullPath = "".concat(path, "/integrations/").concat(obfuscatedPathName !== null && obfuscatedPathName !== void 0 ? obfuscatedPathName : pathName, "/").concat(version, "/").concat(obfuscatedPathName !== null && obfuscatedPathName !== void 0 ? obfuscatedPathName : pathName, ".dynamic.js.gz");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0,load_script/* loadScript */.k)(fullPath)];
                case 2:
                    _a.sent();
                    recordLoadMetrics(fullPath, ctx, name);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    ctx.stats.gauge('legacy_destination_time', -1, ["plugin:".concat(name), "failed"]);
                    throw err_1;
                case 4:
                    deps = window["".concat(pathName, "Deps")];
                    return [4 /*yield*/, Promise.all(deps.map(function (dep) { return (0,load_script/* loadScript */.k)(path + dep + '.gz'); }))
                        // @ts-ignore
                    ];
                case 5:
                    _a.sent();
                    // @ts-ignore
                    window["".concat(pathName, "Loader")]();
                    return [2 /*return*/, window[
                        // @ts-ignore
                        "".concat(pathName, "Integration")]];
            }
        });
    });
}
function unloadIntegration(name, version, obfuscate) {
    return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
        var path, pathName, obfuscatedPathName, fullPath;
        return (0,tslib_es6.__generator)(this, function (_a) {
            path = (0,parse_cdn/* getNextIntegrationsURL */.YM)();
            pathName = normalizeName(name);
            obfuscatedPathName = obfuscatePathName(name, obfuscate);
            fullPath = "".concat(path, "/integrations/").concat(obfuscatedPathName !== null && obfuscatedPathName !== void 0 ? obfuscatedPathName : pathName, "/").concat(version, "/").concat(obfuscatedPathName !== null && obfuscatedPathName !== void 0 ? obfuscatedPathName : pathName, ".dynamic.js.gz");
            return [2 /*return*/, (0,load_script/* unloadScript */.d)(fullPath)];
        });
    });
}
function resolveVersion(integrationConfig) {
    var _a, _b, _c, _d;
    return ((_d = (_b = (_a = integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.versionSettings) === null || _a === void 0 ? void 0 : _a.override) !== null && _b !== void 0 ? _b : (_c = integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.versionSettings) === null || _c === void 0 ? void 0 : _c.version) !== null && _d !== void 0 ? _d : 'latest');
}
//# sourceMappingURL=loader.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-core@1.6.0/node_modules/@segment/analytics-core/dist/esm/validation/helpers.js
var helpers = __webpack_require__(68606);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/plugins/ajs-destination/utils.js
var isInstallableIntegration = function (name, integrationSettings) {
    var _a;
    var type = integrationSettings.type, bundlingStatus = integrationSettings.bundlingStatus, versionSettings = integrationSettings.versionSettings;
    // We use `!== 'unbundled'` (versus `=== 'bundled'`) to be inclusive of
    // destinations without a defined value for `bundlingStatus`
    var deviceMode = bundlingStatus !== 'unbundled' &&
        (type === 'browser' || ((_a = versionSettings === null || versionSettings === void 0 ? void 0 : versionSettings.componentTypes) === null || _a === void 0 ? void 0 : _a.includes('browser')));
    // checking for iterable is a quick fix we need in place to prevent
    // errors showing Iterable as a failed destiantion. Ideally, we should
    // fix the Iterable metadata instead, but that's a longer process.
    return !name.startsWith('Segment') && name !== 'Iterable' && deviceMode;
};
var isDisabledIntegration = function (integrationName, globalIntegrations) {
    var allDisableAndNotDefined = globalIntegrations.All === false &&
        globalIntegrations[integrationName] === undefined;
    return (globalIntegrations[integrationName] === false || allDisableAndNotDefined);
};
//# sourceMappingURL=utils.js.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/core/stats/metric-helpers.js
var metric_helpers = __webpack_require__(21170);
// EXTERNAL MODULE: ./node_modules/.pnpm/@segment+analytics-generic-utils@1.2.0/node_modules/@segment/analytics-generic-utils/dist/esm/create-deferred/create-deferred.js
var create_deferred = __webpack_require__(59258);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@segment+analytics-next@1.70.0_encoding@0.1.13/node_modules/@segment/analytics-next/dist/pkg/plugins/ajs-destination/index.js

















function flushQueue(xt, queue) {
    return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
        var failedQueue;
        var _this = this;
        return (0,tslib_es6.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    failedQueue = [];
                    if ((0,connection/* isOffline */.a)()) {
                        return [2 /*return*/, queue];
                    }
                    return [4 /*yield*/, (0,p_while/* pWhile */._)(function () { return queue.length > 0 && (0,connection/* isOnline */.s)(); }, function () { return (0,tslib_es6.__awaiter)(_this, void 0, void 0, function () {
                            var ctx, result, success;
                            return (0,tslib_es6.__generator)(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        ctx = queue.pop();
                                        if (!ctx) {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, (0,delivery/* attempt */.C)(ctx, xt)];
                                    case 1:
                                        result = _a.sent();
                                        success = result instanceof context/* Context */.o;
                                        if (!success) {
                                            failedQueue.push(ctx);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                        // re-add failed tasks
                    ];
                case 1:
                    _a.sent();
                    // re-add failed tasks
                    failedQueue.map(function (failed) { return queue.pushWithBackoff(failed); });
                    return [2 /*return*/, queue];
            }
        });
    });
}
var LegacyDestination = /** @class */ (function () {
    function LegacyDestination(name, version, writeKey, settings, options, integrationSource) {
        if (settings === void 0) { settings = {}; }
        var _this = this;
        this.options = {};
        this.type = 'destination';
        this.middleware = [];
        this.initializePromise = (0,create_deferred/* createDeferred */.u)();
        this.flushing = false;
        this.name = name;
        this.version = version;
        this.settings = (0,tslib_es6.__assign)({}, settings);
        this.disableAutoISOConversion = options.disableAutoISOConversion || false;
        this.integrationSource = integrationSource;
        // AJS-Renderer sets an extraneous `type` setting that clobbers
        // existing type defaults. We need to remove it if it's present
        if (this.settings['type'] && this.settings['type'] === 'browser') {
            delete this.settings['type'];
        }
        this.initializePromise.promise.then(function (isInitialized) { return (_this._initialized = isInitialized); }, function () { });
        this.options = options;
        this.buffer = options.disableClientPersistence
            ? new priority_queue/* PriorityQueue */.M(4, [])
            : new persisted/* PersistedPriorityQueue */.x(4, "".concat(writeKey, ":dest-").concat(name));
        this.scheduleFlush();
    }
    LegacyDestination.prototype.isLoaded = function () {
        return !!this._ready;
    };
    LegacyDestination.prototype.ready = function () {
        var _this = this;
        return this.initializePromise.promise.then(function () { var _a; return (_a = _this.onReady) !== null && _a !== void 0 ? _a : Promise.resolve(); });
    };
    LegacyDestination.prototype.load = function (ctx, analyticsInstance) {
        var _a;
        return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
            var integrationSource, _b;
            var _this = this;
            return (0,tslib_es6.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this._ready || this.onReady !== undefined) {
                            return [2 /*return*/];
                        }
                        if (!((_a = this.integrationSource) !== null && _a !== void 0)) return [3 /*break*/, 1];
                        _b = _a;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, loadIntegration(ctx, this.name, this.version, this.options.obfuscate)];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        integrationSource = _b;
                        this.integration = buildIntegration(integrationSource, this.settings, analyticsInstance);
                        this.onReady = new Promise(function (resolve) {
                            var onReadyFn = function () {
                                _this._ready = true;
                                resolve(true);
                            };
                            _this.integration.once('ready', onReadyFn);
                        });
                        this.integration.on('initialize', function () {
                            _this.initializePromise.resolve(true);
                        });
                        try {
                            (0,metric_helpers/* recordIntegrationMetric */.y)(ctx, {
                                integrationName: this.name,
                                methodName: 'initialize',
                                type: 'classic',
                            });
                            this.integration.initialize();
                        }
                        catch (error) {
                            (0,metric_helpers/* recordIntegrationMetric */.y)(ctx, {
                                integrationName: this.name,
                                methodName: 'initialize',
                                type: 'classic',
                                didError: true,
                            });
                            this.initializePromise.resolve(false);
                            throw error;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LegacyDestination.prototype.unload = function (_ctx, _analyticsInstance) {
        return unloadIntegration(this.name, this.version, this.options.obfuscate);
    };
    LegacyDestination.prototype.addMiddleware = function () {
        var _a;
        var fn = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fn[_i] = arguments[_i];
        }
        this.middleware = (_a = this.middleware).concat.apply(_a, fn);
    };
    LegacyDestination.prototype.shouldBuffer = function (ctx) {
        return (
        // page events can't be buffered because of destinations that automatically add page views
        ctx.event.type !== 'page' &&
            ((0,connection/* isOffline */.a)() || this._ready !== true || this._initialized !== true));
    };
    LegacyDestination.prototype.send = function (ctx, clz, eventType) {
        var _a, _b;
        return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
            var plan, ev, planEvent, afterMiddleware, event, err_1;
            return (0,tslib_es6.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.shouldBuffer(ctx)) {
                            this.buffer.push(ctx);
                            this.scheduleFlush();
                            return [2 /*return*/, ctx];
                        }
                        plan = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.plan) === null || _b === void 0 ? void 0 : _b.track;
                        ev = ctx.event.event;
                        if (plan && ev && this.name !== 'Segment.io') {
                            planEvent = plan[ev];
                            if (!(0,is_plan_event_enabled/* isPlanEventEnabled */.j)(plan, planEvent)) {
                                ctx.updateEvent('integrations', (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, ctx.event.integrations), { All: false, 'Segment.io': true }));
                                ctx.cancel(new esm_context/* ContextCancelation */.d({
                                    retry: false,
                                    reason: "Event ".concat(ev, " disabled for integration ").concat(this.name, " in tracking plan"),
                                    type: 'Dropped by plan',
                                }));
                            }
                            else {
                                ctx.updateEvent('integrations', (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, ctx.event.integrations), planEvent === null || planEvent === void 0 ? void 0 : planEvent.integrations));
                            }
                            if ((planEvent === null || planEvent === void 0 ? void 0 : planEvent.enabled) && (planEvent === null || planEvent === void 0 ? void 0 : planEvent.integrations[this.name]) === false) {
                                ctx.cancel(new esm_context/* ContextCancelation */.d({
                                    retry: false,
                                    reason: "Event ".concat(ev, " disabled for integration ").concat(this.name, " in tracking plan"),
                                    type: 'Dropped by plan',
                                }));
                            }
                        }
                        return [4 /*yield*/, (0,middleware.applyDestinationMiddleware)(this.name, ctx.event, this.middleware)];
                    case 1:
                        afterMiddleware = _c.sent();
                        if (afterMiddleware === null) {
                            return [2 /*return*/, ctx];
                        }
                        event = new clz(afterMiddleware, {
                            traverse: !this.disableAutoISOConversion,
                        });
                        (0,metric_helpers/* recordIntegrationMetric */.y)(ctx, {
                            integrationName: this.name,
                            methodName: eventType,
                            type: 'classic',
                        });
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 5, , 6]);
                        if (!this.integration) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.integration.invoke.call(this.integration, eventType, event)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _c.sent();
                        (0,metric_helpers/* recordIntegrationMetric */.y)(ctx, {
                            integrationName: this.name,
                            methodName: eventType,
                            type: 'classic',
                            didError: true,
                        });
                        throw err_1;
                    case 6: return [2 /*return*/, ctx];
                }
            });
        });
    };
    LegacyDestination.prototype.track = function (ctx) {
        return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
            return (0,tslib_es6.__generator)(this, function (_a) {
                return [2 /*return*/, this.send(ctx, dist.Track, 'track')];
            });
        });
    };
    LegacyDestination.prototype.page = function (ctx) {
        var _a;
        return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
            return (0,tslib_es6.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (((_a = this.integration) === null || _a === void 0 ? void 0 : _a._assumesPageview) && !this._initialized) {
                            this.integration.initialize();
                        }
                        return [4 /*yield*/, this.initializePromise.promise];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, this.send(ctx, dist.Page, 'page')];
                }
            });
        });
    };
    LegacyDestination.prototype.identify = function (ctx) {
        return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
            return (0,tslib_es6.__generator)(this, function (_a) {
                return [2 /*return*/, this.send(ctx, dist.Identify, 'identify')];
            });
        });
    };
    LegacyDestination.prototype.alias = function (ctx) {
        return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
            return (0,tslib_es6.__generator)(this, function (_a) {
                return [2 /*return*/, this.send(ctx, dist.Alias, 'alias')];
            });
        });
    };
    LegacyDestination.prototype.group = function (ctx) {
        return (0,tslib_es6.__awaiter)(this, void 0, void 0, function () {
            return (0,tslib_es6.__generator)(this, function (_a) {
                return [2 /*return*/, this.send(ctx, dist.Group, 'group')];
            });
        });
    };
    LegacyDestination.prototype.scheduleFlush = function () {
        var _this = this;
        if (this.flushing) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(function () { return (0,tslib_es6.__awaiter)(_this, void 0, void 0, function () {
            var _a;
            return (0,tslib_es6.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if ((0,connection/* isOffline */.a)() || this._ready !== true || this._initialized !== true) {
                            this.scheduleFlush();
                            return [2 /*return*/];
                        }
                        this.flushing = true;
                        _a = this;
                        return [4 /*yield*/, flushQueue(this, this.buffer)];
                    case 1:
                        _a.buffer = _b.sent();
                        this.flushing = false;
                        if (this.buffer.todo > 0) {
                            this.scheduleFlush();
                        }
                        return [2 /*return*/];
                }
            });
        }); }, Math.random() * 5000);
    };
    return LegacyDestination;
}());

function ajsDestinations(writeKey, settings, globalIntegrations, options, routingMiddleware, legacyIntegrationSources) {
    var _a, _b;
    if (globalIntegrations === void 0) { globalIntegrations = {}; }
    if (options === void 0) { options = {}; }
    if ((0,environment/* isServer */.S)()) {
        return [];
    }
    if (settings.plan) {
        options = options !== null && options !== void 0 ? options : {};
        options.plan = settings.plan;
    }
    var routingRules = (_b = (_a = settings.middlewareSettings) === null || _a === void 0 ? void 0 : _a.routingRules) !== null && _b !== void 0 ? _b : [];
    var remoteIntegrationsConfig = settings.integrations;
    var localIntegrationsConfig = options.integrations;
    // merged remote CDN settings with user provided options
    var integrationOptions = (0,merged_options/* mergedOptions */.J)(settings, options !== null && options !== void 0 ? options : {});
    var adhocIntegrationSources = legacyIntegrationSources === null || legacyIntegrationSources === void 0 ? void 0 : legacyIntegrationSources.reduce(function (acc, integrationSource) {
        var _a;
        return ((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, acc), (_a = {}, _a[resolveIntegrationNameFromSource(integrationSource)] = integrationSource, _a)));
    }, {});
    var installableIntegrations = new Set((0,tslib_es6.__spreadArray)((0,tslib_es6.__spreadArray)([], Object.keys(remoteIntegrationsConfig).filter(function (name) {
        return isInstallableIntegration(name, remoteIntegrationsConfig[name]);
    }), true), Object.keys(adhocIntegrationSources || {}).filter(function (name) {
        return (0,helpers/* isPlainObject */.Qd)(remoteIntegrationsConfig[name]) ||
            (0,helpers/* isPlainObject */.Qd)(localIntegrationsConfig === null || localIntegrationsConfig === void 0 ? void 0 : localIntegrationsConfig[name]);
    }), true));
    return Array.from(installableIntegrations)
        .filter(function (name) { return !isDisabledIntegration(name, globalIntegrations); })
        .map(function (name) {
        var integrationSettings = remoteIntegrationsConfig[name];
        var version = resolveVersion(integrationSettings);
        var destination = new LegacyDestination(name, version, writeKey, integrationOptions[name], options, adhocIntegrationSources === null || adhocIntegrationSources === void 0 ? void 0 : adhocIntegrationSources[name]);
        var routing = routingRules.filter(function (rule) { return rule.destinationName === name; });
        if (routing.length > 0 && routingMiddleware) {
            destination.addMiddleware(routingMiddleware);
        }
        return destination;
    });
}
//# sourceMappingURL=index.js.map

/***/ })

}]);
//# sourceMappingURL=ajs-destination.ad6ab668.chunk.js.map