// taken mostly from https://github.com/meteor/meteor/blob/master/packages/accounts-password/password_server.js#L573

Accounts.sendLoginEmail = function(userId, address){
  var user = Meteor.users.findOne(userId);

  if (! user) {
    throw new Error("Can't find user");
  }

  if (! address) {
    var email = _.find(user.emails || [], function (e) {
      return !e.verified;
    });

    address = (email || {}).address;
  }

  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address)) {
    throw new Error("No such email address for user.");
  }

  var tokenRecord = {
    token: Random.secret(),
    address: address,
    when: new Date()
  };

  Meteor.users.update(
    { _id: userId },
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
