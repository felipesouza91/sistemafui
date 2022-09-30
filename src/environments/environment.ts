export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  tokenWhitelistedDomains: [new RegExp('localhost:8080')],
  tokenBlacklistedRoutes: [new RegExp('/oauth2/token')],
  oauthCallbackUrl: `http://127.0.0.1:4200/authorized`,
  appUrl: 'http://127.0.0.1:4200',
};
