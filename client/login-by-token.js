Accounts.loginByPhone = function(code, phoneNumber){
  Meteor.call('loginByPhone', code, phoneNumber, function(err, token){
    if(err){ return; }
    Accounts.loginWithToken(token);
  });
};
