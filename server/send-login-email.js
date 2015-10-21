// taken mostly from https://github.com/meteor/meteor/blob/master/packages/accounts-password/password_server.js#L573
//need process.env.MAIL_URL for email to work

Accounts.sendLoginEmail = function(userId, address){
  var user = Meteor.users.findOne(userId);

  if (! user) {
    throw new Error("Can't find user");
  }

  var token;
  Tokenizer.generate({user: user, expires: { week: 1 }}, function(userToken){
    if(userToken){
      token = userToken; 
    }
    else{
      throw new Error("no token returned");
    }
  });

  var tokenRecord = {
    token: token,
  };

  Meteor._ensure(user, 'services', 'email');

  if (!user.services.email.verificationTokens) {
      user.services.email.verificationTokens = [];
    }
    
  user.services.email.verificationTokens.push(tokenRecord);

  var loginUrl = Accounts.urls.login(token);

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
