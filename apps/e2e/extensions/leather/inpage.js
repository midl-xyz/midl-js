;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0445f6d2-e3f5-4738-abf8-0fbd5988b789",e._sentryDebugIdIdentifier="sentry-dbid-0445f6d2-e3f5-4738-abf8-0fbd5988b789")}catch(e){}}();

    var _global =
      typeof window !== 'undefined' ?
        window :
        typeof global !== 'undefined' ?
          global :
          typeof self !== 'undefined' ?
            self :
            {};

    _global.SENTRY_RELEASE={id:"6.51.1"};
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/shared/environment.ts

const BRANCH = "refs/tags/v6.51.1";
const BRANCH_NAME = (/* unused pure expression or super */ null && ("" ?? 0));
const PR_NUMBER = "MISSING_ENV_VAR".PR_NUMBER;
const COINBASE_APP_ID = (/* unused pure expression or super */ null && ("ca72edbc-0a08-468c-952d-6cde50b1dce6" ?? 0));
const COMMIT_SHA = "7605748617e8e2b75bbf419b1f5e9a5e6ba4300b";
const IS_DEV_ENV = (/* unused pure expression or super */ null && ("production" === "development"));
const IS_TEST_ENV = (/* unused pure expression or super */ null && ("production" === "testing"));
const MOONPAY_API_KEY = (/* unused pure expression or super */ null && ("pk_live_Bctok4Wp6KZHX0YfS4Ie7dFOYnNw8lqv" ?? 0));
const SEGMENT_WRITE_KEY = (/* unused pure expression or super */ null && ("6EdfMbYvR0W1lACBylV9qTFjvXUUXurM" ?? 0));
const SENTRY_DSN = (/* unused pure expression or super */ null && ("https://21db7427cf1f4681885f4e20451abf8e@o4504203991318528.ingest.sentry.io/4504204000952320" ?? 0));
const TRANSAK_API_KEY = (/* unused pure expression or super */ null && ("b597d169-3b24-486d-90e9-f378e96fe13b" ?? 0));
const WALLET_ENVIRONMENT = (/* unused pure expression or super */ null && ("production" ?? 0));
const SWAP_ENABLED = "MISSING_ENV_VAR".SWAP_ENABLED === "true";
const BITFLOW_API_HOST = (/* unused pure expression or super */ null && ("https://bitflow-sdk-api-gateway-7owjsmt8.uc.gateway.dev" ?? 0));
const BITFLOW_API_KEY = (/* unused pure expression or super */ null && ("AIzaSyAA0NiCXtyAJgfnsudad4-GZyeNbTKBrAA" ?? 0));
const BITFLOW_STACKS_API_HOST = (/* unused pure expression or super */ null && ("https://api.hiro.so" ?? 0));
const BITFLOW_READONLY_CALL_API_HOST = (/* unused pure expression or super */ null && ("https://wvzrnmxqmi.execute-api.us-east-2.amazonaws.com/mainnet" ?? 0));

;// CONCATENATED MODULE: ./src/shared/inpage-types.ts

var DomEventName = /* @__PURE__ */ ((DomEventName2) => {
  DomEventName2["request"] = "request";
  DomEventName2["authenticationRequest"] = "hiroWalletStacksAuthenticationRequest";
  DomEventName2["signatureRequest"] = "hiroWalletSignatureRequest";
  DomEventName2["structuredDataSignatureRequest"] = "hiroWalletStructuredDataSignatureRequest";
  DomEventName2["transactionRequest"] = "hiroWalletStacksTransactionRequest";
  DomEventName2["profileUpdateRequest"] = "hiroWalletProfileUpdateRequest";
  DomEventName2["psbtRequest"] = "hiroWalletPsbtRequest";
  return DomEventName2;
})(DomEventName || {});

;// CONCATENATED MODULE: ./src/shared/message-types.ts

const MESSAGE_SOURCE = "stacks-wallet";
const CONTENT_SCRIPT_PORT = "content-script";
var ExternalMethods = /* @__PURE__ */ ((ExternalMethods2) => {
  ExternalMethods2["transactionRequest"] = "hiroWalletTransactionRequest";
  ExternalMethods2["transactionResponse"] = "hiroWalletTransactionResponse";
  ExternalMethods2["authenticationRequest"] = "hiroWalletAuthenticationRequest";
  ExternalMethods2["authenticationResponse"] = "hiroWalletAuthenticationResponse";
  ExternalMethods2["signatureRequest"] = "hiroWalletSignatureRequest";
  ExternalMethods2["signatureResponse"] = "hiroWalletSignatureResponse";
  ExternalMethods2["structuredDataSignatureRequest"] = "hiroWalletStructuredDataSignatureRequest";
  ExternalMethods2["structuredDataSignatureResponse"] = "hiroWalletStructuredDataSignatureResponse";
  ExternalMethods2["profileUpdateRequest"] = "hiroWalletProfileUpdateRequest";
  ExternalMethods2["profileUpdateResponse"] = "hiroWalletProfileUpdateResponse";
  ExternalMethods2["psbtRequest"] = "hiroWalletPsbtRequest";
  ExternalMethods2["psbtResponse"] = "hiroWalletPsbtResponse";
  return ExternalMethods2;
})(ExternalMethods || {});
var InternalMethods = /* @__PURE__ */ ((InternalMethods2) => {
  InternalMethods2["RequestDerivedStxAccounts"] = "RequestDerivedStxAccounts";
  InternalMethods2["OriginatingTabClosed"] = "OriginatingTabClosed";
  InternalMethods2["AccountChanged"] = "AccountChanged";
  return InternalMethods2;
})(InternalMethods || {});

;// CONCATENATED MODULE: ./src/inpage/add-leather-to-providers.ts

function addLeatherToProviders() {
  const win = window;
  if (!win.btc_providers) win.btc_providers = [];
  win.btc_providers.push({
    id: "LeatherProvider",
    name: "Leather",
    icon: "data:image/svg;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ4QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjdGNUYzIi8+Cjwvc3ZnPgo=",
    webUrl: "https://leather.io",
    chromeWebStoreUrl: "https://chromewebstore.google.com/detail/leather/ldinpeekobnhjjdofggfgjlcehhmanlj",
    methods: [
      "getAddresses",
      "signMessage",
      "sendTransfer",
      "signPsbt",
      "stx_signMessage",
      "stx_signTransaction"
    ]
  });
}

;// CONCATENATED MODULE: ./src/inpage/inpage.ts





addLeatherToProviders();
async function callAndReceive(methodName, opts = {}) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Unable to get response from Blockstack extension");
    }, 1e3);
    const waitForResponse = (event) => {
      if (event.data.source === "blockstack-extension" && event.data.method === `${methodName}Response`) {
        clearTimeout(timeout);
        window.removeEventListener("message", waitForResponse);
        resolve(event.data);
      }
    };
    window.addEventListener("message", waitForResponse);
    window.postMessage(
      {
        method: methodName,
        source: "blockstack-app",
        ...opts
      },
      window.location.origin
    );
  });
}
function isValidEvent(event, method) {
  const { data } = event;
  const correctSource = data.source === MESSAGE_SOURCE;
  const correctMethod = data.method === method;
  return correctSource && correctMethod && !!data.payload;
}
const provider = {
  isLeather: true,
  getURL: async () => {
    const { url } = await callAndReceive("getURL");
    return url;
  },
  structuredDataSignatureRequest: async (signatureRequest) => {
    const event = new CustomEvent(
      DomEventName.structuredDataSignatureRequest,
      {
        detail: { signatureRequest }
      }
    );
    document.dispatchEvent(event);
    return new Promise((resolve, reject) => {
      const handleMessage = (event2) => {
        if (!isValidEvent(event2, ExternalMethods.signatureResponse)) return;
        if (event2.data.payload?.signatureRequest !== signatureRequest) return;
        window.removeEventListener("message", handleMessage);
        if (event2.data.payload.signatureResponse === "cancel") {
          reject(event2.data.payload.signatureResponse);
          return;
        }
        if (typeof event2.data.payload.signatureResponse !== "string") {
          resolve(event2.data.payload.signatureResponse);
        }
      };
      window.addEventListener("message", handleMessage);
    });
  },
  signatureRequest: async (signatureRequest) => {
    const event = new CustomEvent(DomEventName.signatureRequest, {
      detail: { signatureRequest }
    });
    document.dispatchEvent(event);
    return new Promise((resolve, reject) => {
      const handleMessage = (event2) => {
        if (!isValidEvent(event2, ExternalMethods.signatureResponse)) return;
        if (event2.data.payload?.signatureRequest !== signatureRequest) return;
        window.removeEventListener("message", handleMessage);
        if (event2.data.payload.signatureResponse === "cancel") {
          reject(event2.data.payload.signatureResponse);
          return;
        }
        if (typeof event2.data.payload.signatureResponse !== "string") {
          resolve(event2.data.payload.signatureResponse);
        }
      };
      window.addEventListener("message", handleMessage);
    });
  },
  authenticationRequest: async (authenticationRequest) => {
    console.warn(`
        WARNING: Legacy Leather request detected

        Leather now uses an RPC-style API, that can be used directly, 
        rather than through libraries such as Stacks Connect. For example,
        to get a user's addresses, you should use the 
        LeatherProvider.request('getAddresses') method.

        See our docs for more information https://leather.gitbook.io/
      `);
    const event = new CustomEvent(
      DomEventName.authenticationRequest,
      {
        detail: { authenticationRequest }
      }
    );
    document.dispatchEvent(event);
    return new Promise((resolve, reject) => {
      const handleMessage = (event2) => {
        if (!isValidEvent(event2, ExternalMethods.authenticationResponse)) return;
        if (event2.data.payload?.authenticationRequest !== authenticationRequest) return;
        window.removeEventListener("message", handleMessage);
        if (event2.data.payload.authenticationResponse === "cancel") {
          reject(event2.data.payload.authenticationResponse);
          return;
        }
        resolve(event2.data.payload.authenticationResponse);
      };
      window.addEventListener("message", handleMessage);
    });
  },
  transactionRequest: async (transactionRequest) => {
    const event = new CustomEvent(DomEventName.transactionRequest, {
      detail: { transactionRequest }
    });
    document.dispatchEvent(event);
    return new Promise((resolve, reject) => {
      const handleMessage = (event2) => {
        if (!isValidEvent(event2, ExternalMethods.transactionResponse)) return;
        if (event2.data.payload?.transactionRequest !== transactionRequest) return;
        window.removeEventListener("message", handleMessage);
        if (event2.data.payload.transactionResponse === "cancel") {
          reject(event2.data.payload.transactionResponse);
          return;
        }
        if (typeof event2.data.payload.transactionResponse !== "string") {
          resolve(event2.data.payload.transactionResponse);
        }
      };
      window.addEventListener("message", handleMessage);
    });
  },
  psbtRequest: async (psbtRequest) => {
    const event = new CustomEvent(DomEventName.psbtRequest, {
      detail: { psbtRequest }
    });
    document.dispatchEvent(event);
    return new Promise((resolve, reject) => {
      const handleMessage = (event2) => {
        if (!isValidEvent(event2, ExternalMethods.psbtResponse)) return;
        if (event2.data.payload?.psbtRequest !== psbtRequest) return;
        window.removeEventListener("message", handleMessage);
        if (event2.data.payload.psbtResponse === "cancel") {
          reject(event2.data.payload.psbtResponse);
          return;
        }
        if (typeof event2.data.payload.psbtResponse !== "string") {
          resolve(event2.data.payload.psbtResponse);
        }
      };
      window.addEventListener("message", handleMessage);
    });
  },
  profileUpdateRequest: async (profileUpdateRequest) => {
    const event = new CustomEvent(
      DomEventName.profileUpdateRequest,
      {
        detail: { profileUpdateRequest }
      }
    );
    document.dispatchEvent(event);
    return new Promise((resolve, reject) => {
      const handleMessage = (event2) => {
        if (!isValidEvent(event2, ExternalMethods.profileUpdateResponse)) return;
        if (event2.data.payload?.profileUpdateRequest !== profileUpdateRequest) return;
        window.removeEventListener("message", handleMessage);
        if (event2.data.payload.profileUpdateResponse === "cancel") {
          reject(event2.data.payload.profileUpdateResponse);
          return;
        }
        if (typeof event2.data.payload.profileUpdateResponse !== "string") {
          resolve(event2.data.payload.profileUpdateResponse);
        }
      };
      window.addEventListener("message", handleMessage);
    });
  },
  getProductInfo() {
    return {
      version: "6.51.1",
      name: "Leather",
      meta: {
        tag: BRANCH,
        commit: COMMIT_SHA
      }
    };
  },
  request(method, params) {
    const id = crypto.randomUUID();
    const rpcRequest = {
      jsonrpc: "2.0",
      id,
      method,
      params
    };
    document.dispatchEvent(new CustomEvent(DomEventName.request, { detail: rpcRequest }));
    return new Promise((resolve, reject) => {
      function handleMessage(event) {
        const response = event.data;
        if (response.id !== id) return;
        window.removeEventListener("message", handleMessage);
        if ("error" in response) return reject(response);
        return resolve(response);
      }
      window.addEventListener("message", handleMessage);
    });
  }
};
function consoleDeprecationNotice(text) {
  console.warn(`Deprecation warning: ${text}`);
}
function warnAboutDeprecatedProvider(legacyProvider) {
  return Object.fromEntries(
    Object.entries(legacyProvider).map(([key, value]) => {
      if (typeof value === "function") {
        return [
          key,
          (...args) => {
            switch (key) {
              case "authenticationRequest":
                consoleDeprecationNotice(
                  `Use LeatherProvider.request('getAddresses') instead, see docs https://leather.gitbook.io/developers/bitcoin/connect-users/get-addresses`
                );
                break;
              case "psbtRequest":
                consoleDeprecationNotice(
                  `Use LeatherProvider.request('signPsbt') instead, see docs https://leather.gitbook.io/developers/bitcoin/sign-transactions/partially-signed-bitcoin-transactions-psbts`
                );
                break;
              case "structuredDataSignatureRequest":
              case "signatureRequest":
                consoleDeprecationNotice(`Use LeatherProvider.request('stx_signMessage') instead`);
                break;
              default:
                consoleDeprecationNotice(
                  "The provider object is deprecated. Use `LeatherProvider` instead"
                );
            }
            return value(...args);
          }
        ];
      }
      return [key, value];
    })
  );
}
try {
  Object.defineProperty(window, "StacksProvider", {
    get: () => warnAboutDeprecatedProvider(provider),
    set: () => {
    }
  });
} catch (e) {
}
try {
  Object.defineProperty(window, "HiroWalletProvider", {
    get: () => warnAboutDeprecatedProvider(provider),
    set: () => {
    }
  });
} catch (e) {
}
try {
  Object.defineProperty(window, "LeatherProvider", { get: () => provider, set: () => {
  } });
} catch (e) {
  console.warn("Unable to set LeatherProvider");
}
if (typeof window.btc === "undefined") {
  window.btc = warnAboutDeprecatedProvider(provider);
}

/******/ })()
;