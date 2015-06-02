# accounts-passwordless

## Installation

`meteor add poeticsystems:accounts-passwordless`

## Usage

This package allows you to login users without asking for a password. Authentication is handled using tokens distributed via email. The package exposes an additional `login` object within the `Accounts.emailTemplates` config for customization. The config options can be found in [Meteor's email templates docs](http://docs.meteor.com/#/full/accounts_emailtemplates).

First, from your server call `Accounts.sendLoginEmail(userId, email);`. This will send an email to your user with a login link in the form of http://localhost:3000/#/login/{token}.

After login is resolved `onLoginFromLink` will be called. This is a login handler that should be defined in `Meteor.methods`.

```
Meteor.methods({
  onLoginFromLink: function(err, response){
    // err is a Meteor.Error object
    // response is an object in the form of { userId: userId }
  }
});
```

If `onLoginFromLink` is called without error the user is authenticated and attached to `Meteor.userId()` and `Meteor.user()`.
