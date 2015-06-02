// taken mostly from https://github.com/meteor/meteor/blob/21bdac87347e0c80bbdf4fdbca132ff80033b3f3/packages/accounts-password/password_server.js

Meteor.methods({
  loginFromLink: function(token){
    check(token, String);

    var user = Meteor.users.findOne({
      'services.email.verificationTokens.token': token
    });

    if (! user) {
      throw new Meteor.Error(403, 'Login link expired');
    }

    var tokenRecord = _.find(user.services.email.verificationTokens, function(t){
      return t.token === token;
    });

    if (! tokenRecord) {
      return {
        userId: user._id,
        error: new Meteor.Error(403, 'Login link expired')
      };
    }

    var emailsRecord = _.find(user.emails, function(e){
      return e.address === tokenRecord.address;
    });

    if (! emailsRecord) {
      return {
        userId: user._id,
        error: new Meteor.Error(403, 'Login link is for unknown address')
      };
    }

    Meteor.users.update({ _id: user._id, 'emails.address': tokenRecord.address }, {
      $set: { 'emails.$.verified': true },
      $pull: { 'services.email.verificationTokens': { token: token } }
    });

    this.setUserId(user._id);

    return { userId: user._id };
  },
});
