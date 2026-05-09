const Project = require('../models/Project');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const { GLOBAL_ROLES, TASK_STATUS } = require('../constants/roles');

const getDashboard = asyncHandler(async (req, res) => {
  const isGlobalAdmin = req.user.globalRole === GLOBAL_ROLES.ADMIN;
  const projectFilter = isGlobalAdmin ? {} : { 'members.user': req.user._id };
  const allProjects = await Project.find(projectFilter).select('_id');
  const projects = await Project.find(projectFilter)
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name description createdAt');
  const projectIds = allProjects.map((project) => project._id);
  const baseQuery = isGlobalAdmin
    ? {}
    : { project: { $in: projectIds }, $or: [{ assignee: req.user._id }, { createdBy: req.user._id }] };

  const [totalTasks, groupedStatus, overdueCount, upcoming] = await Promise.all([
    Task.countDocuments(baseQuery),
    Task.aggregate([
      { $match: baseQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } },
    ]),
    Task.countDocuments({
      ...baseQuery,
      status: { $ne: TASK_STATUS.DONE },
      dueDate: { $lt: new Date() },
    }),
    Task.find({
      ...baseQuery,
      status: { $ne: TASK_STATUS.DONE },
      dueDate: { $gte: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .populate('project', 'name')
      .populate('assignee', 'name email'),
  ]);

  const byStatus = Object.values(TASK_STATUS).reduce((acc, status) => {
    const entry = groupedStatus.find((item) => item.status === status);
    acc[status] = entry ? entry.count : 0;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalTasks,
      byStatus,
      overdueCount,
      upcoming,
      recentProjects: projects,
    },
  });
});

module.exports = { getDashboard };