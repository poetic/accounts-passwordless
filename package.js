Package.describe({
  name: 'poetic:accounts-passwordless',
  version: '0.0.7',
  summary: 'create and login users without requiring a password',
  git: 'https://github.com/poetic/accounts-passwordless',
  documentation: 'README.md'
});

Npm.depends({
  'twilio': '2.5.2',
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'random',
    'accounts-base',
    'accounts-ui',
    'accounts-password'
  ], [
    'client', 'server'
  ]);

  api.addFiles([
    'server/login-config.js',
    'server/send-login-email.js',
    'server/send-login-sms.js',
    'server/find-user-by-token.js',
    'server/login-by-phone.js',
  ], 'server');


  api.addFiles('client/login-by-token.js', 'client');
  api.addFiles('client/init-url-matching.js', 'client');

  api.imply([
    'accounts-base', 'accounts-ui', 'accounts-password'
  ]);
});

Package.onTest(function(api){});
