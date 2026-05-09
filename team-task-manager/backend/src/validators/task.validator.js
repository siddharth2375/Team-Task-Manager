const { z } = require('zod');
const { TASK_PRIORITY, TASK_STATUS } = require('../constants/roles');

const idParam = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id.');
const nullableId = z.union([idParam, z.null()]).optional();

const createTaskSchema = z.object({
  params: z.object({ projectId: idParam }),
  body: z.object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(2000).optional().default(''),
    assignee: nullableId,
    status: z.enum(Object.values(TASK_STATUS)).optional().default(TASK_STATUS.TODO),
    priority: z.enum(Object.values(TASK_PRIORITY)).optional().default(TASK_PRIORITY.MEDIUM),
    dueDate: z.coerce.date().nullable().optional(),
  }),
});

const listTasksSchema = z.object({
  params: z.object({ projectId: idParam }),
  query: z.object({
    status: z.enum(Object.values(TASK_STATUS)).optional(),
    assignee: idParam.optional(),
    overdue: z.enum(['true', 'false']).optional(),
  }),
});

const taskIdSchema = z.object({
  params: z.object({ id: idParam }),
});

const updateTaskSchema = z.object({
  params: z.object({ id: idParam }),
  body: z
    .object({
      title: z.string().trim().min(2).max(160).optional(),
      description: z.string().trim().max(2000).optional(),
      assignee: nullableId,
      status: z.enum(Object.values(TASK_STATUS)).optional(),
      priority: z.enum(Object.values(TASK_PRIORITY)).optional(),
      dueDate: z.coerce.date().nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
});

module.exports = { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema };