import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'wowow',

    http: {
      enable: process.env.HTTP_ENABLE === 'true' ?? false,
      host: process.env.HTTP_HOST ?? '0.0.0.0',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 40000,
      globalPrefix: '/api',
      versioning: {
        enable: process.env.HTTP_VERSIONING_ENABLE === 'true' ?? false,
        prefix: 'v',
        version: process.env.HTTP_VERSION ?? '1',
      },
    },
    grpc: {
      enable: process.env.GRPC_ENABLE === 'true' ?? false,
      host: process.env.GRPC_HOST ?? 'localhost',
      port: process.env.GRPC_PORT
        ? Number.parseInt(process.env.GRPC_PORT)
        : 50000,
    },
  }),
);
