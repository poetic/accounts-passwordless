// taken mostly from https://github.com/meteor/meteor/blob/master/packages/accounts-password/password_server.js#L573

Accounts.sendLoginEmail = function(address){

  if (! address) {
    throw new Meteor.Error("No email provided")
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(address)) {
    throw new Meteor.Error("Provided string is not an email")
  }

  var user = Accounts.findUserByEmail(address)

  if (! user) {
    Accounts.createUser({email: address})
    user = Accounts.findUserByEmail(address)
  }

  var tokenRecord = {
    token: Random.secret(),
    address: address,
    when: new Date()
  };

  Meteor.users.update(
    { _id: user._id },
    { $push: {'services.email.verificationTokens': tokenRecord } }
  );

  Meteor._ensure(user, 'services', 'email');

  if (!user.services.email.verificationTokens) {
    user.services.email.verificationTokens = [];
  }

  user.services.email.verificationTokens.push(tokenRecord);

  var loginUrl = Accounts.urls.login(tokenRecord.token);

  var options = {
    to: address,
    from: Accounts.emailTemplates.login.from
      ? Accounts.emailTemplates.login.from(user)
      : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.login.subject(user),
    text: Accounts.emailTemplates.login.text(user, loginUrl)
  };

  if (typeof Accounts.emailTemplates.login.html === 'function') {
    options.html = Accounts.emailTemplates.login.html(user, loginUrl);
  }

  if (typeof Accounts.emailTemplates.headers === 'object') {
    options.headers = Accounts.emailTemplates.headers;
  }

  Email.send(options);
};
