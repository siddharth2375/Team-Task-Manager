import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  FolderKanban,
  Calendar,
} from 'lucide-react';
import { getDashboard } from '../api/dashboard.api.js';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import { formatDate, isOverdue } from '../lib/utils.js';

const statCards = (data) => [
  {
    label: 'Total Tasks',
    value: data.totalTasks,
    icon: CheckSquare,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
  },
  {
    label: 'To Do',
    value: data.byStatus?.TODO ?? 0,
    icon: ListTodo,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  {
    label: 'In Progress',
    value: data.byStatus?.IN_PROGRESS ?? 0,
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Done',
    value: data.byStatus?.DONE ?? 0,
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'Overdue',
    value: data.overdueCount ?? 0,
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Your team&apos;s activity at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards(data || {}).map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming tasks */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Upcoming Tasks</h2>
          {!data?.upcoming?.length ? (
            <Card>
              <p className="text-sm text-slate-500 text-center py-6">No upcoming tasks</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {data.upcoming.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <Link key={task._id} to={`/tasks/${task._id}`}>
                    <Card className="flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                        <p className="text-xs text-slate-500 truncate">{task.project?.name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {overdue && <Badge variant="red">Overdue</Badge>}
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={11} />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent projects */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Recent Projects</h2>
          {!data?.recentProjects?.length ? (
            <Card>
              <p className="text-sm text-slate-500 text-center py-6">No projects yet</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {data.recentProjects.map((project) => (
                <Link key={project._id} to={`/projects/${project._id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FolderKanban size={16} className="text-brand-500 shrink-0" />
                      <p className="text-sm font-medium text-slate-900 truncate">{project.name}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
