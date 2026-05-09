const GLOBAL_ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
});

const PROJECT_ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
});

const TASK_STATUS = Object.freeze({
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
});

const TASK_PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

module.exports = { GLOBAL_ROLES, PROJECT_ROLES, TASK_STATUS, TASK_PRIORITY };