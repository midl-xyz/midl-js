;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a539ca45-9a01-418e-b0b7-5fbade419aef",e._sentryDebugIdIdentifier="sentry-dbid-a539ca45-9a01-418e-b0b7-5fbade419aef")}catch(e){}}();

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
(self["webpackChunk_leather_io_extension"] = self["webpackChunk_leather_io_extension"] || []).push([[826],{

/***/ 5826:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  RpcSignBip322MessageRoute: () => (/* binding */ RpcSignBip322MessageRoute)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(86070);
// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
var react = __webpack_require__(30758);
// EXTERNAL MODULE: ./node_modules/.pnpm/react-router@6.26.2_react@18.3.1/node_modules/react-router/dist/index.js
var dist = __webpack_require__(90543);
// EXTERNAL MODULE: ./node_modules/.pnpm/@leather.io+utils@0.16.6/node_modules/@leather.io/utils/dist/index.js
var utils_dist = __webpack_require__(62684);
// EXTERNAL MODULE: ./src/shared/utils.ts
var utils = __webpack_require__(45366);
// EXTERNAL MODULE: ./src/app/components/disclaimer.tsx
var disclaimer = __webpack_require__(71069);
// EXTERNAL MODULE: ./src/app/components/no-fees-warning-row.tsx
var no_fees_warning_row = __webpack_require__(84183);
// EXTERNAL MODULE: ./src/app/features/container/headers/popup.header.tsx + 5 modules
var popup_header = __webpack_require__(50102);
// EXTERNAL MODULE: ./src/app/features/message-signer/message-preview-box.tsx
var message_preview_box = __webpack_require__(52208);
// EXTERNAL MODULE: ./src/app/features/message-signer/message-signing-request.layout.tsx
var message_signing_request_layout = __webpack_require__(34905);
// EXTERNAL MODULE: ./src/app/routes/account-gate.tsx
var account_gate = __webpack_require__(56217);
// EXTERNAL MODULE: ./src/app/store/networks/networks.selectors.ts
var networks_selectors = __webpack_require__(13468);
// EXTERNAL MODULE: ./src/app/features/message-signer/message-signing-header.tsx
var message_signing_header = __webpack_require__(79939);
// EXTERNAL MODULE: ./src/app/features/message-signer/stacks-sign-message-action.tsx
var stacks_sign_message_action = __webpack_require__(8756);
// EXTERNAL MODULE: ./node_modules/.pnpm/@btckit+types@0.0.19/node_modules/@btckit/types/dist/index.mjs
var types_dist = __webpack_require__(75638);
// EXTERNAL MODULE: ./node_modules/.pnpm/@leather.io+bitcoin@0.14.2_encoding@0.1.13/node_modules/@leather.io/bitcoin/dist/index.js
var bitcoin_dist = __webpack_require__(94627);
// EXTERNAL MODULE: ./src/shared/logger.ts
var logger = __webpack_require__(41303);
// EXTERNAL MODULE: ./src/shared/rpc/rpc-methods.ts
var rpc_methods = __webpack_require__(41979);
// EXTERNAL MODULE: ./src/shared/utils/analytics.ts
var analytics = __webpack_require__(84137);
// EXTERNAL MODULE: ./src/app/common/hooks/use-default-request-search-params.ts
var use_default_request_search_params = __webpack_require__(62195);
// EXTERNAL MODULE: ./src/app/common/initial-search-params.ts
var initial_search_params = __webpack_require__(21975);
// EXTERNAL MODULE: ./src/app/features/toasts/use-toast.ts
var use_toast = __webpack_require__(7319);
// EXTERNAL MODULE: ./src/app/store/accounts/blockchain/bitcoin/bitcoin.hooks.ts + 4 modules
var bitcoin_hooks = __webpack_require__(98271);
// EXTERNAL MODULE: ./src/app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks.ts
var native_segwit_account_hooks = __webpack_require__(98775);
// EXTERNAL MODULE: ./src/app/store/accounts/blockchain/bitcoin/taproot-account.hooks.ts
var taproot_account_hooks = __webpack_require__(3559);
;// CONCATENATED MODULE: ./src/app/pages/rpc-sign-bip322-message/use-sign-bip322-message.ts
/* provided dependency */ var Buffer = __webpack_require__(84686)["Buffer"];















function useRpcSignBitcoinMessage() {
  const defaultParams = (0,use_default_request_search_params/* useDefaultRequestParams */.Y)();
  return (0,react.useMemo)(
    () => ({
      ...defaultParams,
      requestId: initial_search_params/* initialSearchParams */.VM.get("requestId") ?? "",
      message: initial_search_params/* initialSearchParams */.VM.get("message") ?? "",
      paymentType: initial_search_params/* initialSearchParams */.VM.get("paymentType") ?? "p2wpkh"
    }),
    [defaultParams]
  );
}
const shortPauseBeforeToast = (0,utils/* createDelay */.Ar)(250);
const allowTimeForUserToReadToast = (0,utils/* createDelay */.Ar)(1200);
function useSignBip322MessageFactory({ address, signPsbt }) {
  const network = (0,networks_selectors/* useCurrentNetwork */.Rm)();
  const [isLoading, setIsLoading] = (0,react.useState)(false);
  const toast = (0,use_toast/* useToast */.d)();
  const { tabId, origin, requestId, message } = useRpcSignBitcoinMessage();
  return {
    origin,
    message,
    isLoading,
    formattedOrigin: new URL(origin ?? "").host,
    address,
    onUserRejectBip322MessageSigningRequest() {
      if (!tabId) return;
      chrome.tabs.sendMessage(
        tabId,
        (0,rpc_methods/* makeRpcErrorResponse */.h)("signMessage", {
          id: requestId,
          error: {
            code: types_dist/* RpcErrorCode */.d.USER_REJECTION,
            message: "User rejected message signing request"
          }
        })
      );
      (0,utils/* closeWindow */.Do)();
    },
    async onUserApproveBip322MessageSigningRequest() {
      setIsLoading(true);
      if (!tabId || !origin) {
        logger/* logger */.v.error("Cannot give app accounts: missing tabId, origin");
        return;
      }
      const { signature } = await (0,bitcoin_dist/* signBip322MessageSimple */.p6)({
        message,
        address,
        signPsbt,
        network: network.chain.bitcoin.mode
      });
      await shortPauseBeforeToast();
      toast.success("Message signed successfully");
      chrome.tabs.sendMessage(
        tabId,
        (0,rpc_methods/* makeRpcSuccessResponse */.K)("signMessage", {
          id: requestId,
          result: { signature, address, message }
        })
      );
      void analytics/* analytics */.zS.track("user_approved_message_signing", { origin });
      await allowTimeForUserToReadToast();
      (0,utils/* closeWindow */.Do)();
    }
  };
}
function useSignBip322MessageTaproot() {
  const createTaprootSigner = (0,taproot_account_hooks/* useCurrentAccountTaprootSigner */.$w)();
  if (!createTaprootSigner) throw new Error("No taproot signer for current account");
  const currentTaprootAccount = (0,taproot_account_hooks/* useCurrentTaprootAccount */.R2)();
  if (!currentTaprootAccount) throw new Error("No keychain for current account");
  const sign = (0,bitcoin_hooks/* useSignBitcoinTx */.nn)();
  const signer = createTaprootSigner(0);
  async function signPsbt(psbt) {
    psbt.data.inputs.forEach(
      (input) => input.tapInternalKey = Buffer.from(signer.payment.tapInternalKey)
    );
    return sign(psbt.toBuffer());
  }
  return useSignBip322MessageFactory({ address: signer.payment.address ?? "", signPsbt });
}
function useSignBip322MessageNativeSegwit() {
  const createNativeSegwitSigner = (0,native_segwit_account_hooks/* useCurrentAccountNativeSegwitSigner */.GD)();
  if (!createNativeSegwitSigner) throw new Error("No native segwit signer for current account");
  const currentNativeSegwitAccount = (0,native_segwit_account_hooks/* useCurrentNativeSegwitAccount */.sP)();
  if (!currentNativeSegwitAccount) throw new Error("No keychain for current account");
  const sign = (0,bitcoin_hooks/* useSignBitcoinTx */.nn)();
  const signer = createNativeSegwitSigner(0);
  async function signPsbt(psbt) {
    return sign(psbt.toBuffer());
  }
  return useSignBip322MessageFactory({
    address: signer.payment.address ?? "",
    signPsbt
  });
}
function useSignBip322Message() {
  const { paymentType } = useRpcSignBitcoinMessage();
  const taprootMsgSigner = useSignBip322MessageTaproot();
  const nativeSegwitMsgSigner = useSignBip322MessageNativeSegwit();
  switch (paymentType) {
    case "p2tr":
      return taprootMsgSigner;
    case "p2wpkh":
      return nativeSegwitMsgSigner;
  }
}

;// CONCATENATED MODULE: ./src/app/pages/rpc-sign-bip322-message/rpc-sign-bip322-message.tsx
















function RpcSignBip322MessageRoute() {
  return /* @__PURE__ */ (0,jsx_runtime.jsx)(account_gate/* AccountGate */.z0, { children: /* @__PURE__ */ (0,jsx_runtime.jsx)(RpcSignBip322Message, {}) });
}
function RpcSignBip322Message() {
  const {
    origin,
    message,
    address,
    isLoading: signBip322MessageIsLoading,
    onUserApproveBip322MessageSigningRequest,
    onUserRejectBip322MessageSigningRequest
  } = useSignBip322Message();
  const location = (0,dist/* useLocation */.zy)();
  const { chain } = (0,networks_selectors/* useCurrentNetwork */.Rm)();
  const [isLoading, setIsLoading] = (0,react.useState)(false);
  (0,react.useEffect)(() => {
    if (location?.state?.wentBack) {
      setIsLoading(false);
    } else {
      setIsLoading(signBip322MessageIsLoading);
    }
  }, [location, signBip322MessageIsLoading, isLoading, setIsLoading]);
  if (origin === null) {
    (0,utils/* closeWindow */.Do)();
    throw new Error("Origin is null");
  }
  return /* @__PURE__ */ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0,jsx_runtime.jsx)(dist/* Outlet */.sv, {}),
    /* @__PURE__ */ (0,jsx_runtime.jsx)(popup_header/* PopupHeader */.s, { showSwitchAccount: true, balance: "all" }),
    /* @__PURE__ */ (0,jsx_runtime.jsxs)(message_signing_request_layout/* MessageSigningRequestLayout */.Q, { children: [
      /* @__PURE__ */ (0,jsx_runtime.jsx)(
        message_signing_header/* MessageSigningHeader */.K,
        {
          origin,
          additionalText: `. This message is signed by ${(0,utils_dist/* truncateMiddle */.kU)(address)}`
        }
      ),
      /* @__PURE__ */ (0,jsx_runtime.jsx)(message_preview_box/* MessagePreviewBox */.z, { message }),
      /* @__PURE__ */ (0,jsx_runtime.jsx)(no_fees_warning_row/* NoFeesWarningRow */.$, { chainId: chain.stacks.chainId }),
      /* @__PURE__ */ (0,jsx_runtime.jsx)(
        stacks_sign_message_action/* SignMessageActions */.y,
        {
          isLoading,
          onSignMessage: () => onUserApproveBip322MessageSigningRequest(),
          onSignMessageCancel: () => onUserRejectBip322MessageSigningRequest()
        }
      ),
      /* @__PURE__ */ (0,jsx_runtime.jsx)("hr", {}),
      /* @__PURE__ */ (0,jsx_runtime.jsx)(
        disclaimer/* Disclaimer */.M,
        {
          disclaimerText: "By signing this message, you prove that you own this address",
          mb: "space.05"
        }
      )
    ] })
  ] });
}


/***/ })

}]);
//# sourceMappingURL=826.1e61546d.chunk.js.map