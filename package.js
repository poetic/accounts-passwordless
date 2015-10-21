Package.describe({
  name: 'poetic:accounts-passwordless',
  version: '0.0.5',
  summary: 'create and login users without requiring a password',
  git: 'https://github.com/poetic/accounts-passwordless',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'accounts-base',
    'accounts-ui',
    'accounts-password'
    'poetic:tokenizer'
  ], ['client', 'server']);

  api.use('email@1.0.7','server')

  api.addFiles([
    'server/login-config.js',
    'server/send-login-email.js',
  ], 'server');

  api.addFiles('client/init-url-matching.js', 'client');

  api.imply([
    'accounts-base', 'accounts-ui', 'accounts-password'
  ]);
});

Package.onTest(function(api){});
