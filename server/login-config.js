Accounts.urls.login = function(token){
  return Meteor.absoluteUrl('#/login/' + token);
};

Accounts.emailTemplates.login = {
  subject: function(user){
    return 'Login to ' + Accounts.emailTemplates.siteName;
  },

  text: function(user, url){
    return "Click on the link below to login.\n" +
      "\n" + url;
  },
};
