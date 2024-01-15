export const environment = {
  production: true,
  apiUrl: 'http://127.0.0.1:8080',
  tokenWhitelistedDomains: [new RegExp('127.0.0.1:8080')],
  tokenBlacklistedRoutes: [new RegExp('/oauth2/token'),],
  oauthCallbackUrl: `http://127.0.0.1:4200/authorized`,
  appUrl: 'http://127.0.0.1:4200',
  clientSecret: 'YW5ndWxhcjpwYXNzd29yZA==',
  fileServiceUrl: "http://192.168.1.112:9000/"
};
