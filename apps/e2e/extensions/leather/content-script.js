;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a43bcc8c-9098-4509-9ab0-f36c7b89b3f0",e._sentryDebugIdIdentifier="sentry-dbid-a43bcc8c-9098-4509-9ab0-f36c7b89b3f0")}catch(e){}}();

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

;// CONCATENATED MODULE: ./src/shared/route-urls.ts

var RouteUrls = /* @__PURE__ */ ((RouteUrls2) => {
  RouteUrls2["Onboarding"] = "/get-started";
  RouteUrls2["BackUpSecretKey"] = "/back-up-secret-key";
  RouteUrls2["SetPassword"] = "/set-password";
  RouteUrls2["SignIn"] = "/sign-in";
  RouteUrls2["ConnectLedger"] = "connect-your-ledger";
  RouteUrls2["ConnectLedgerError"] = "ledger-connection-error";
  RouteUrls2["ConnectLedgerSuccess"] = "successfully-connected-your-ledger";
  RouteUrls2["DeviceBusy"] = "please-wait";
  RouteUrls2["AwaitingDeviceUserAction"] = "awaiting-approval";
  RouteUrls2["LedgerDisconnected"] = "your-ledger-disconnected";
  RouteUrls2["LedgerOperationRejected"] = "action-rejected";
  RouteUrls2["LedgerPublicKeyMismatch"] = "wrong-ledger-device";
  RouteUrls2["LedgerDevicePayloadInvalid"] = "ledger-payload-invalid";
  RouteUrls2["LedgerUnsupportedBrowser"] = "unsupported-browser";
  RouteUrls2["LedgerOutdatedAppWarning"] = "outdated-app-warning";
  RouteUrls2["LedgerBroadcastError"] = "transaction-broadcast-error";
  RouteUrls2["ConnectLedgerStart"] = "connect-ledger";
  RouteUrls2["Home"] = "/";
  RouteUrls2["AddNetwork"] = "/add-network";
  RouteUrls2["EditNetwork"] = "/edit-network";
  RouteUrls2["Fund"] = "/fund/:currency";
  RouteUrls2["FundChooseCurrency"] = "/fund-choose-currency";
  RouteUrls2["IncreaseStxFee"] = "/increase-fee/stx/:txid";
  RouteUrls2["IncreaseBtcFee"] = "/increase-fee/btc";
  RouteUrls2["Send"] = "/send-transaction";
  RouteUrls2["ViewSecretKey"] = "/view-secret-key";
  RouteUrls2["Activity"] = "/activity";
  RouteUrls2["Receive"] = "receive";
  RouteUrls2["ReceiveStx"] = "receive/stx";
  RouteUrls2["ReceiveBtc"] = "receive/btc";
  RouteUrls2["ReceiveBtcStamp"] = "receive/btc-stamp";
  RouteUrls2["ReceiveCollectible"] = "receive/collectible";
  RouteUrls2["ReceiveCollectibleOrdinal"] = "receive/collectible/ordinal";
  RouteUrls2["Unlock"] = "/unlock";
  RouteUrls2["EditNonce"] = "edit-nonce";
  RouteUrls2["SignOutConfirm"] = "sign-out";
  RouteUrls2["RetrieveTaprootFunds"] = "retrieve-taproot-funds";
  RouteUrls2["SendCryptoAsset"] = "/send";
  RouteUrls2["SendCryptoAssetForm"] = "/send/:symbol";
  RouteUrls2["SendSip10Form"] = "/send/:symbol/:contractId";
  RouteUrls2["SendCryptoAssetFormRecipientAccounts"] = "recipient-accounts";
  RouteUrls2["SendCryptoAssetFormRecipientBns"] = "recipient-bns";
  RouteUrls2["SendBtcChooseFee"] = "/send/btc/choose-fee";
  RouteUrls2["SendBtcError"] = "/send/btc/error";
  RouteUrls2["SendBtcConfirmation"] = "/send/btc/confirm";
  RouteUrls2["SendBtcDisabled"] = "/send/btc/disabled";
  RouteUrls2["SendStxConfirmation"] = "/send/stx/confirm";
  RouteUrls2["SendStacksSip10Confirmation"] = "/send/:symbol/confirm";
  RouteUrls2["SentBtcTxSummary"] = "/sent/btc/:txId";
  RouteUrls2["SentStxTxSummary"] = "/sent/stx/:txId";
  RouteUrls2["SendOrdinalInscription"] = "send/ordinal-inscription";
  RouteUrls2["SendOrdinalInscriptionChooseFee"] = "choose-fee";
  RouteUrls2["SendOrdinalInscriptionReview"] = "review";
  RouteUrls2["SendOrdinalInscriptionSent"] = "sent";
  RouteUrls2["SendOrdinalInscriptionError"] = "error";
  RouteUrls2["Swap"] = "/swap/:base/:quote?";
  RouteUrls2["SwapAssetSelectBase"] = "select-base";
  RouteUrls2["SwapAssetSelectQuote"] = "select-quote";
  RouteUrls2["SwapError"] = "/swap/error";
  RouteUrls2["SwapReview"] = "/swap/:base/:quote/review";
  RouteUrls2["ProfileUpdateRequest"] = "/update-profile";
  RouteUrls2["PsbtRequest"] = "/psbt";
  RouteUrls2["SignatureRequest"] = "/signature";
  RouteUrls2["TransactionRequest"] = "/transaction";
  RouteUrls2["TransactionBroadcastError"] = "broadcast-error";
  RouteUrls2["RpcGetAddresses"] = "/get-addresses";
  RouteUrls2["RpcSignPsbt"] = "/sign-psbt";
  RouteUrls2["RpcSignPsbtSummary"] = "/sign-psbt/summary";
  RouteUrls2["RpcSendTransfer"] = "/send-transfer";
  RouteUrls2["RpcSendTransferChooseFee"] = "/send-transfer/choose-fee";
  RouteUrls2["RpcSendTransferConfirmation"] = "/send-transfer/confirm";
  RouteUrls2["RpcSendTransferSummary"] = "/send-transfer/summary";
  RouteUrls2["RpcSignBip322Message"] = "/sign-bip322-message";
  RouteUrls2["RpcStacksSignature"] = "/sign-stacks-message";
  RouteUrls2["ChooseAccount"] = "/choose-account";
  RouteUrls2["RequestError"] = "/request-error";
  RouteUrls2["UnauthorizedRequest"] = "/unauthorized-request";
  RouteUrls2["RpcSignStacksTransaction"] = "/sign-stacks-transaction";
  return RouteUrls2;
})(RouteUrls || {});

;// CONCATENATED MODULE: ./src/content-scripts/content-script.ts




let backgroundPort;
function connect() {
  backgroundPort = chrome.runtime.connect({ name: CONTENT_SCRIPT_PORT });
  backgroundPort.onDisconnect.addListener(connect);
}
connect();
function sendMessageToBackground(message) {
  backgroundPort.postMessage(message);
}
chrome.runtime.onMessage.addListener((message) => {
  if (message.source === MESSAGE_SOURCE || message.jsonrpc === "2.0") {
    window.postMessage(message, window.location.origin);
  }
});
function forwardDomEventToBackground({ payload, method }) {
  sendMessageToBackground({
    method,
    payload,
    source: MESSAGE_SOURCE
  });
}
document.addEventListener(DomEventName.request, (event) => {
  sendMessageToBackground({ source: MESSAGE_SOURCE, ...event.detail });
});
document.addEventListener(DomEventName.authenticationRequest, (event) => {
  forwardDomEventToBackground({
    path: RouteUrls.Onboarding,
    payload: event.detail.authenticationRequest,
    urlParam: "authRequest",
    method: ExternalMethods.authenticationRequest
  });
});
document.addEventListener(DomEventName.transactionRequest, (event) => {
  forwardDomEventToBackground({
    path: RouteUrls.TransactionRequest,
    payload: event.detail.transactionRequest,
    urlParam: "request",
    method: ExternalMethods.transactionRequest
  });
});
document.addEventListener(DomEventName.signatureRequest, (event) => {
  forwardDomEventToBackground({
    path: RouteUrls.SignatureRequest,
    payload: event.detail.signatureRequest,
    urlParam: "request",
    method: ExternalMethods.signatureRequest
  });
});
document.addEventListener(DomEventName.structuredDataSignatureRequest, (event) => {
  forwardDomEventToBackground({
    path: RouteUrls.SignatureRequest,
    payload: event.detail.signatureRequest,
    urlParam: "request",
    method: ExternalMethods.structuredDataSignatureRequest
  });
});
document.addEventListener(DomEventName.profileUpdateRequest, (event) => {
  forwardDomEventToBackground({
    path: RouteUrls.ProfileUpdateRequest,
    payload: event.detail.profileUpdateRequest,
    urlParam: "request",
    method: ExternalMethods.profileUpdateRequest
  });
});
document.addEventListener(DomEventName.psbtRequest, (event) => {
  forwardDomEventToBackground({
    path: RouteUrls.PsbtRequest,
    payload: event.detail.psbtRequest,
    urlParam: "request",
    method: ExternalMethods.psbtRequest
  });
});
function addLeatherToPage() {
  const inpage = document.createElement("script");
  inpage.src = chrome.runtime.getURL("inpage.js");
  inpage.id = "leather-provider";
  document.body.appendChild(inpage);
}
requestAnimationFrame(() => addLeatherToPage());

/******/ })()
;