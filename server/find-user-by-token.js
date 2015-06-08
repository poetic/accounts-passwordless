Meteor.methods({
  findUserByToken: function(token){
    return Meteor.users.findOne({
      'services.email.verificationTokens.token': token
    });
  },
});
