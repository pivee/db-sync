import { INestiaConfig } from '@nestia/sdk';

const config: INestiaConfig = {
  input: 'src/modules',
  swagger: {
    output: 'dist/swagger.json',
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
  },
};
export default config;
