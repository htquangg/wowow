import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    type: 'mysql',
    host: process.env?.DATABASE_HOST ?? '0.0.0.0',
    port: process.env?.DATABASE_PORT ?? '3306',
    name: process.env?.DATABASE_NAME ?? 'db-local-wow-001',
    user: process.env?.DATABASE_USER ?? 'root',
    password: process?.env.DATABASE_PASSWORD ?? '1',
  }),
);
