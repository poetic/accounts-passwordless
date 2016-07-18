Meteor.methods({
  loginByPhone: function(code, phone, propName){
    var phoneKey = propName ? propName : 'profile.phone';

    // user master code if it exist
    var phoneMasterCode = Accounts.phoneMasterCode;
    if (phoneMasterCode && phoneMasterCode === code) {
      var phoneQuery = {};
      phoneQuery[phoneKey] = phone;
      var userByPhone = Meteor.users.findOne(phoneQuery);

      if(!userByPhone){
        throw new Error("User not found with that phone number");
      }

      var tokenRecord = {
        token: Random.secret(),
        phone: phone,
        when: new Date().getTime(),
        code: phoneMasterCode
      };

      Accounts._insertLoginToken(userByPhone._id, tokenRecord);
      return tokenRecord.token;
    }

    var query = { 'services.phone.verificationTokens.code': code };
    query[phoneKey] = phone;
    var user = Meteor.users.findOne(query);

    if(!user){ throw new Error("User not found with that code and phone number"); }

    var when = user.services.phone.verificationTokens.when;
    var token = user.services.phone.verificationTokens.token;

    /* if the time is within 10 minutes */
    var tokenIsFresh = new Date().getTime() - when < 10 * 60 * 1000;
    return tokenIsFresh && token;
  }
});
