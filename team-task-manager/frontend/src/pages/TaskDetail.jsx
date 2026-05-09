import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTask, updateTask, deleteTask } from '../api/tasks.api.js';
import { useAuth } from '../hooks/useAuth.js';
import TaskForm from '../components/tasks/TaskForm.jsx';
import StatusBadge from '../components/tasks/StatusBadge.jsx';
import PriorityBadge from '../components/tasks/PriorityBadge.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import { formatDate, formatRelative, isOverdue } from '../lib/utils.js';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTask(id)
      .then((res) => setTask(res.data.data.task))
      .finally(() => setLoading(false));
  }, [id]);

  const projectRole = task?.project?.members?.find(
    (m) => (m.user?._id || m.user) === user?._id
  )?.role || (user?.globalRole === 'ADMIN' ? 'ADMIN' : null);

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const res = await updateTask(id, data);
      setTask(res.data.data.task);
      setEditOpen(false);
      toast.success('Task updated!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      if (task?.project?._id) {
        navigate(`/projects/${task.project._id}`, { replace: true });
      } else {
        navigate('/projects', { replace: true });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!task) return null;

  const overdue = isOverdue(task.dueDate, task.status);
  const isProjectAdmin = projectRole === 'ADMIN';
  const isCreator = task.createdBy?._id === user?._id;
  const canEdit = isProjectAdmin || task.assignee?._id === user?._id || isCreator;
  const canDelete = isProjectAdmin || isCreator;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        {task.project && (
          <Link
            to={`/projects/${task.project._id}`}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={16} />
            {task.project.name}
          </Link>
        )}
      </div>

      <Card className="space-y-5">
        {/* Title + actions */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{task.title}</h1>
          </div>
          {(canEdit || canDelete) && (
            <div className="flex gap-2 shrink-0">
              {canEdit && (
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <Edit size={14} />
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button variant="danger" size="sm" loading={saving} onClick={handleDelete}>
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {overdue && <Badge variant="red">Overdue</Badge>}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Assignee</p>
            <p className="text-sm text-slate-700">{task.assignee?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Created By</p>
            <p className="text-sm text-slate-700">{task.createdBy?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Due Date</p>
            <p className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
              {formatDate(task.dueDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Created</p>
            <p className="text-sm text-slate-700">{formatRelative(task.createdAt)}</p>
          </div>
        </div>
      </Card>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Task" size="lg">
        <TaskForm
          onSubmit={handleUpdate}
          loading={saving}
          isAdmin={isProjectAdmin}
          members={task.project?.members || []}
          defaultValues={{
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            assigneeId: task.assignee?._id || '',
          }}
        />
      </Modal>
    </div>
  );
}
