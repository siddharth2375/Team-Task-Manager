const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1).default('mongodb://localhost:27017/team-task-manager'),
  JWT_SECRET: z
    .string()
    .min(16)
    .default('development_jwt_secret_change_me_minimum_32_chars'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = { env: parsed.data };