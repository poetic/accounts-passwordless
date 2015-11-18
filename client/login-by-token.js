Accounts.loginByPhone = function(code, phoneNumber,callback){
  Meteor.call('loginByPhone', code, phoneNumber, function(err, token){
    if(err){
      if(_.isFunction(callback)){
        callback(err);
      }
    } else {
      Meteor.loginWithToken(token, callback); //Really our callback should be called after Meteor.loginWithToken executed and returns a result
    }
  });
};
