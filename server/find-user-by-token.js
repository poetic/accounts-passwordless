Meteor.methods({
  findUserByToken: function(token){
    var user = Meteor.users.findOne({
      'services.email.verificationTokens.token': token
    });

    return user._id;
  },
});
