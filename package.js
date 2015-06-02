Package.describe({
  name: 'poeticsystems:accounts-passwordless',
  version: '0.0.1',
  summary: 'create and login users without requiring a password',
  git: 'https://github.com/poetic/accounts-passwordless',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('accounts-base', ['client', 'server']);

  api.addFiles('server/login-config.js', 'server');
  api.addFiles('server/send-login-email.js', 'server');
  api.addFiles('client/login-from-link.js', 'client');
  api.addFiles('server/login-method.js', 'server');
  api.addFiles('client/init-url-matching.js', 'client');
  //api.addFiles('client/on-login-link.js', 'client');
});

Package.onTest(function(api) {
  //api.use('tinytest');
  //api.use('poeticsystems:accounts-passwordless');
  //api.addFiles('accounts-passwordless-tests.js');
});
