Meteor.methods({
  loginByPhone: function(code, phone, propName){
    // user master code if it exist
    var phoneMasterCode = Accounts.phoneMasterCode;
    if (phoneMasterCode && phoneMasterCode === code) {
      Meteor.users.update(
        { _id: userId },
        { $set: {'services.phone.verificationTokens': phoneMasterCode } }
      );
    }

    var query = { 'services.phone.verificationTokens.code': code };
    query[propName ? propName : 'profile.phone'] = phone;
    var user = Meteor.users.findOne(query);

    if(!user){ throw new Error("User not found with that code and phone number"); }

    var when = user.services.phone.verificationTokens.when;
    var token = user.services.phone.verificationTokens.token;

    /* if the time is within 10 minutes */
    var tokenIsFresh = new Date().getTime() - when < 10 * 60 * 1000;
    return tokenIsFresh && token;
  }
});
