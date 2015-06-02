Accounts.loginFromLink = function(token, callback){
  if (! token) {
    throw new Error('need to pass token');
  }

  Meteor.call('loginFromLink', token, function(err, response){
    if (response.userId && ! response.error) {
      Meteor.connection.setUserId(response.userId);
    }

    Meteor.call('onLoginFromLink', err, response);
  });
};
