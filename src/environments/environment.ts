export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  tokenWhitelistedDomains: [new RegExp('localhost:8080')],
  tokenBlacklistedRoutes: [new RegExp('/oauth2/token')],
  oauthCallbackUrl: 'https://iodcdebugger.com/debug',
};
