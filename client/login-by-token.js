Accounts.loginByPhone = function(code, phoneNumber){
  console.log(Accounts);
  Meteor.call('loginByPhone', code, phoneNumber, function(err, token){
    if(err){ return; }
    Meteor.loginWithToken(token);
  });
};
