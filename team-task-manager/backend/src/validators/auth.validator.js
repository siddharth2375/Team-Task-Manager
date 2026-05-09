const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

module.exports = { signupSchema, loginSchema };