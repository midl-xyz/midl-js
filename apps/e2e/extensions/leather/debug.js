;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="275ba2bb-c346-4f5e-9ed0-41f3c63edd04",e._sentryDebugIdIdentifier="sentry-dbid-275ba2bb-c346-4f5e-9ed0-41f3c63edd04")}catch(e){}}();

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
const mnemonicCrypto = require('../src/shared/crypto/mnemonic-encryption');

function main() {
  const mnemonicForm = document.querySelector('.decrypt-mnemonic-form');
  const submitButton = document.querySelector('.decrypt-mnemonic-form button');

  const originalBtnText = submitButton.textContent;

  function setPending() {
    submitButton.disabled = true;
    submitButton.textContent = 'Wait';
  }
  function setComplete() {
    submitButton.disabled = false;
    submitButton.textContent = originalBtnText;
  }

  mnemonicForm.addEventListener('submit', async event => {
    event.preventDefault();

    setPending();

    const formData = Object.fromEntries(new FormData(event.target).entries());

    try {
      const result = await mnemonicCrypto.decryptMnemonic(formData);
      console.log(result);
      alert(result.secretKey);
    } finally {
      setComplete();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => main());

/******/ })()
;
//# sourceMappingURL=debug.js.map