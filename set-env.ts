import { writeFile } from 'fs'; // Configure Angular `environment.ts` file path
import 'dotenv/config';
const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts'; // Load node modules
const colors = require('colors');

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL}',
  tokenWhitelistedDomains: [new RegExp('${process.env.TOKEN_DOMAIN}')],
  tokenBlacklistedRoutes: [new RegExp(${
    process.env.TOKEN_BLACK_LIST || "'/oauth/token'"
  })],
};
`;
console.log(
  colors.magenta(
    'The file `environment.prod.ts` will be written with the following content: \n'
  )
);
console.log(colors.grey(envConfigFile));
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      colors.magenta(
        `Angular environment.ts file generated correctly at ${targetPath} \n`
      )
    );
  }
});
