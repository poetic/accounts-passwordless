// This code mostly taken from https://github.com/meteor/meteor/blob/676a9fa0fddb6a823c11cb1bfecfc533dd797373/packages/accounts-base/url_client.js

var Ap = {};

// All of the special hash URLs we support for accounts interactions
var accountsPaths = ["reset-password", "verify-email", "enroll-account", "login"];

var savedHash = window.location.hash;

Ap._initUrlMatching = function () {
  // By default, allow the autologin process to happen.
  this._autoLoginEnabled = true;

  // We only support one callback per URL.
  this._accountsCallbacks = {};

  // Try to match the saved value of window.location.hash.
  this._attemptToMatchHash();
};

// Separate out this functionality for testing

Ap._attemptToMatchHash = function () {
  attemptToMatchHash(this, savedHash, defaultSuccessHandler);
};

// Note that both arguments are optional and are currently only passed by
// accounts_url_tests.js.
function attemptToMatchHash(accounts, hash, success) {
  accountsPaths.forEach(function(urlPart){
    var token;

    var tokenRegex = new RegExp("^\\#\\/" + urlPart + "\\/(.*)$");
    var match = hash.match(tokenRegex);

    if (match) {
      token = match[1];

      // XXX COMPAT WITH 0.9.3
      if (urlPart === "login") {
        accounts._loginToken = token;
      }
    } else {
      return;
    }

    // If no handlers match the hash, then maybe it's meant to be consumed
    // by some entirely different code, so we only clear it the first time
    // a handler successfully matches. Note that later handlers reuse the
    // savedHash, so clearing window.location.hash here will not interfere
    // with their needs.
    window.location.hash = "";

    // Do some stuff with the token we matched
    success.call(accounts, token, urlPart);
  });
}

function defaultSuccessHandler(token, urlPart) {
  Accounts.loginFromLink(token, function(){});

  var self = this;

  // put login in a suspended state to wait for the interaction to finish
  self._autoLoginEnabled = false;

  // wait for other packages to register callbacks
  Meteor.startup(function () {
    // if a callback has been registered for this kind of token, call it
    if (self._accountsCallbacks[urlPart]) {
      self._accountsCallbacks[urlPart](token, function () {
        self._enableAutoLogin();
      });
    }
  });
}

// Export for testing
AccountsTest = {
  attemptToMatchHash: function (hash, success) {
    return attemptToMatchHash(Accounts, hash, success);
  }
};

Ap.onLoginLink = function(callback){
  if (this._accountsCallbacks["loginLink"]) {
    Meteor._debug("Accounts.onLoginLink was called more than once. " +
      "Only one callback added will be executed.");
  }

  this._accountsCallbacks["loginLink"] = callback;
};

Ap._initUrlMatching();
