Accounts.sendLoginSms = function(userId, phoneNumber, twilioOptions, customMessage){
  var twilio = Npm.require('twilio')(twilioOptions.sid, twilioOptions.auth);
  var from = twilioOptions.from;
  var user = Meteor.users.findOne(userId);

  if (! user) { throw new Error("Can't find user"); }
  if (! phoneNumber) { throw new Error("Requires a valid phone number for SMS"); }
  if (! twilio || ! from) { throw new Error("Requires valid twilio credentials for SMS sending"); }

  var tokenRecord = {
    token: Random.secret(),
    phone: phoneNumber,
    when: new Date().getTime(),
    code: getCode()
  };

  Meteor.users.update(
    { _id: userId },
    { $set: {'services.phone.verificationTokens': tokenRecord , 'services.resume.loginTokens': [] } }
  );

  Accounts._insertLoginToken(user._id, tokenRecord);
  sendCode(tokenRecord.code, phoneNumber, twilio, from, customMessage);
};

function sendCode(code, phoneNumber, twilio, from, customMessage){
   var body;
  if(typeof(customMessage) === 'string' && customMessage.length > 0){
    body = customMessage.replace('[code]', code);
  } else {
    body = 'Your verification code is: ' + code;
  }

  twilio.sendMessage({
    to: phoneNumber,
    from: from,
    body: body
  }, function(err, responseData) {
  });
}

function getCode(){
  var code = '';
  for(var i = 0; i < 4; i++){
    code += String(Math.floor(Math.random()*10));
  }
  return code;
}
