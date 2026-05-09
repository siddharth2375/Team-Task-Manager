const { z } = require('zod');
const { PROJECT_ROLES } = require('../constants/roles');

const idParam = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id.');

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(1000).optional().default(''),
  }),
});

const projectIdSchema = z.object({
  params: z.object({ id: idParam }),
});

const updateProjectSchema = z.object({
  params: z.object({ id: idParam }),
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      description: z.string().trim().max(1000).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});

const addProjectMemberSchema = z.object({
  params: z.object({ id: idParam }),
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    role: z.enum(Object.values(PROJECT_ROLES)).default(PROJECT_ROLES.MEMBER),
  }),
});

const memberParamsSchema = z.object({
  params: z.object({ id: idParam, userId: idParam }),
});

const updateMemberRoleSchema = z.object({
  params: z.object({ id: idParam, userId: idParam }),
  body: z.object({ role: z.enum(Object.values(PROJECT_ROLES)) }),
});

module.exports = {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  memberParamsSchema,
  updateMemberRoleSchema,
};