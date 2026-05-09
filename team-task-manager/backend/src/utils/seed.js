const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { env } = require('../config/env');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { GLOBAL_ROLES, PROJECT_ROLES, TASK_PRIORITY, TASK_STATUS } = require('../constants/roles');

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);

  await Promise.all([Task.deleteMany({}), Project.deleteMany({}), User.deleteMany({})]);

  const [adminPasswordHash, memberPasswordHash] = await Promise.all([
    bcrypt.hash('Admin@123', 10),
    bcrypt.hash('Member@123', 10),
  ]);

  const [admin, member] = await User.create([
    {
      name: 'Demo Admin',
      email: 'admin@demo.com',
      passwordHash: adminPasswordHash,
      globalRole: GLOBAL_ROLES.ADMIN,
    },
    {
      name: 'Demo Member',
      email: 'member@demo.com',
      passwordHash: memberPasswordHash,
      globalRole: GLOBAL_ROLES.MEMBER,
    },
  ]);

  const project = await Project.create({
    name: 'Demo Launch Project',
    description: 'Seeded project for API testing.',
    owner: admin._id,
    members: [
      { user: admin._id, role: PROJECT_ROLES.ADMIN },
      { user: member._id, role: PROJECT_ROLES.MEMBER },
    ],
  });

  await Task.create([
    {
      title: 'Draft project brief',
      description: 'Outline goals, scope, and risks.',
      project: project._id,
      assignee: admin._id,
      createdBy: admin._id,
      status: TASK_STATUS.DONE,
      priority: TASK_PRIORITY.HIGH,
      dueDate: daysFromNow(-5),
    },
    {
      title: 'Prepare backlog',
      description: 'Create initial task list and priorities.',
      project: project._id,
      assignee: member._id,
      createdBy: admin._id,
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.HIGH,
      dueDate: daysFromNow(-1),
    },
    {
      title: 'Review access rules',
      description: 'Validate project membership permissions.',
      project: project._id,
      assignee: member._id,
      createdBy: admin._id,
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      dueDate: daysFromNow(2),
    },
    {
      title: 'Create API smoke tests',
      description: 'Exercise auth, projects, tasks, and dashboard routes.',
      project: project._id,
      assignee: admin._id,
      createdBy: admin._id,
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      dueDate: daysFromNow(5),
    },
    {
      title: 'Polish demo notes',
      description: 'Write short notes for the demo walkthrough.',
      project: project._id,
      assignee: null,
      createdBy: admin._id,
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.LOW,
      dueDate: daysFromNow(7),
    },
  ]);

  console.log('Seed complete');
  console.log('Admin: admin@demo.com / Admin@123');
  console.log('Member: member@demo.com / Member@123');
};

seed()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });