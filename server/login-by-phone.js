Meteor.methods({
  loginByPhone: function(code, phone){
    user = Meteor.users.findOne({'services.phone.verificationTokens.code': code, 'profile.phone': phone});

    if(!user){ throw new Error("User not found with that code and phone number"); }

    var token = user.services.phone.verificationTokens;
    var time = token.when,
        returnToken = token.token;

    /* if the phone number matches the code sent, the user, and time is within 10 minutes */
    if(user.profile.phone === phone && new Date().getTime() - token.when < 600000){
      return returnToken;
    }

    return false;
  }
});
