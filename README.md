# accounts-passwordless

## Installation

`meteor add poetic:accounts-passwordless`

## Usage

This package allows you to login users without asking for a password. Authentication is handled using tokens distributed via email. The package exposes an additional `login` object within the `Accounts.emailTemplates` config for customization. The config options can be found in [Meteor's email templates docs](http://docs.meteor.com/#/full/accounts_emailtemplates).

In addition, this package exposes the core `accounts-base`, `accounts-ui`, and `accounts-password` packages.

First, from your server call `Accounts.sendLoginEmail(userId, email);`. This will send an email to your user with a login link in the form of http://localhost:3000/#/login/{token}.

After login is resolved the `Accounts.onLoginFromLink` handler will be called. As with Meteor's other redirect handlers, this function should be defined in top level code and not wrapped in `Meteor.startup`. The handler should be defined in client code and takes the following form:

```
Accounts.onLoginFromLink(function(err, response){
  // err is a Meteor.Error object
  // response is a success object in the form of { userId: docId }
});
```

If `onLoginFromLink` is called without error the user is authenticated and attached to `Meteor.userId()` and `Meteor.user()`, as well as `this.userId` on the server.
