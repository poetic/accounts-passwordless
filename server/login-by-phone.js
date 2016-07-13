Meteor.methods({
  loginByPhone: function(code, phone, propName){
    const query = { 'services.phone.verificationTokens.code': code };
    query[propName ? propName : 'profile.phone'] = phone;
    const user = Meteor.users.findOne(query);

    if(!user){ throw new Error("User not found with that code and phone number"); }

    var token = user.services.phone.verificationTokens;
    var time = token.when,
        returnToken = token.token;

    /* if the time is within 10 minutes */
    if(new Date().getTime() - token.when < 600000){
      return returnToken;
    }

    return false;
  }
});
