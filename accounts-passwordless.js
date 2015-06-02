if (Meteor.isServer) {
  Accounts.urls.login = function(token){
    return Meteor.absoluteUrl('#/login/' + token);
  };

  Accounts.emailTemplates.login = {
    subject: function(user){
      return 'Login to ' + Accounts.emailTemplates.siteName;
    },

    text: function(user, url){
      return "Click on the link below to login.\n" +
        "\n" +
        url;
    }
  };

  Accounts.sendLoginEmail = function(userId, address){
    // Make sure the user exists, and address is one of their addresses.
    var user = Meteor.users.findOne(userId);

    if (!user)
      throw new Error("Can't find user");
    // pick the first unverified address if we weren't passed an address.
    if (!address) {
      var email = _.find(user.emails || [],
                         function (e) { return !e.verified; });
      address = (email || {}).address;
    }
    // make sure we have a valid address
    if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address))
      throw new Error("No such email address for user.");

    var tokenRecord = {
      token: Random.secret(),
      address: address,
      when: new Date()};
    Meteor.users.update(
      {_id: userId},
      {$push: {'services.email.verificationTokens': tokenRecord}});

    // before passing to template, update user object with new token
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

    if (typeof Accounts.emailTemplates.login.html === 'function')
      options.html =
        Accounts.emailTemplates.login.html(user, loginUrl);

    if (typeof Accounts.emailTemplates.headers === 'object') {
      options.headers = Accounts.emailTemplates.headers;
    }

    Email.send(options);
  };
}
