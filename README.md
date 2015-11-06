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

## SMS Phone Login

SMS Phone login is now supported with accounts passwordless.  To use this option you need to have a twilio account and a valid SID, AUTH, and FROM number.  Once these are setup you can make a serverside method that will send the message.  A simple example would be: 

```
Meteor.methods({
  phoneLogin: function(phone){
    let user = Meteor.users.findOne({'profile.phone': phone});

    let twilio = {
      sid: 'your-twilio-side',
      auth: 'your-twilio-auth-token',
      from: 'your-twilio-from-phone-number'
    };

    let customMessage = "Welcome back to my app your invite code is : [code]";
    Accounts.sendLoginSms(user._id, phone, twilio, customMessage);
  },
});
```

`Accounts.sendLoginSms` is the function that will use twilio with your credentials to send a message to the phone (number) passed. This also expects a `user._id` so that the newly generated auth token can be set on that user.  

The customMessage should contain one place in the string where `"[code]"` will be replaced by the value of the actual code generated internally.  The placement of this does not matter but the string must contain that in order for the code to be replaced.

If no custom string is passed then a default message will be sent with the code.

Once that Method has ran a user will be sent the text message to the phone number provided.  Afterwards you can now log the user in with the code that was sent with a bit of clientside event code.  Another example of this would look like:

```
Template.login.events({
  'click .send-auth': function(){
    let phoneNumber = $('.login').val();
    Meteor.call('phoneLogin', phoneNumber);
  },

  'click .submit-code': function(){
    let phoneNumber = $('.login').val();
    let code = $('.code').val();
    Accounts.loginByPhone(code, phoneNumber);
  }
});
```

Notice the first event calls the serverside Method you created from the client.  The second event takes the code and the phoneNumber as arguments and will login the user if they Match.
