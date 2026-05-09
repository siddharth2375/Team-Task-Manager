import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Trash2, Users, LayoutKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
} from '../api/projects.api.js';
import { listTasks, createTask } from '../api/tasks.api.js';
import { useAuth } from '../hooks/useAuth.js';
import TaskBoard from '../components/tasks/TaskBoard.jsx';
import MemberList from '../components/projects/MemberList.jsx';
import AddMemberForm from '../components/projects/AddMemberForm.jsx';
import ProjectForm from '../components/projects/ProjectForm.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import RoleGuard from '../components/layout/RoleGuard.jsx';
import { cn } from '../lib/utils.js';

const TABS = ['tasks', 'members'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProject = useCallback(() => {
    return getProject(id).then((res) => setProject(res.data.data.project));
  }, [id]);

  const fetchTasks = useCallback(() => {
    setTasksLoading(true);
    return listTasks(id)
      .then((res) => setTasks(res.data.data.tasks))
      .finally(() => setTasksLoading(false));
  }, [id]);

  useEffect(() => {
    Promise.all([fetchProject(), fetchTasks()]).finally(() => setLoading(false));
  }, [fetchProject, fetchTasks]);

  const projectRole = project?.members?.find(
    (m) => (m.user?._id || m.user) === user?._id
  )?.role || (user?.globalRole === 'ADMIN' ? 'ADMIN' : null);

  const isProjectAdmin = projectRole === 'ADMIN' || user?.globalRole === 'ADMIN';

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const res = await updateProject(id, data);
      setProject(res.data.data.project);
      setEditOpen(false);
      toast.success('Project updated!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      navigate('/projects', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (data) => {
    setSaving(true);
    try {
      const res = await addMember(id, data);
      setProject(res.data.data.project);
      toast.success('Member added!');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    setSaving(true);
    try {
      const res = await removeMember(id, userId);
      setProject(res.data.data.project);
      toast.success('Member removed');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setSaving(true);
    try {
      const res = await updateMemberRole(id, userId, { role });
      setProject(res.data.data.project);
      toast.success('Role updated');
    } finally {
      setSaving(false);
    }
  };

  const handleTaskCreated = async (data) => {
    const res = await createTask(id, data);
    setTasks((prev) => [...prev, res.data.data.task]);
    toast.success('Task created!');
  };

  const handleTaskUpdated = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="mt-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 truncate">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-slate-500 mt-1">{project.description}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {project.members?.length} member{project.members?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <RoleGuard allow={['ADMIN']} projectRole={projectRole} allowProject={['ADMIN']}>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Settings size={14} />
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </RoleGuard>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { id: 'tasks', label: 'Tasks', icon: LayoutKanban },
          { id: 'members', label: 'Members', icon: Users },
        ].map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              activeTab === tabId
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'tasks' && (
        <TaskBoard
          tasks={tasks}
          loading={tasksLoading}
          projectId={id}
          members={project.members}
          projectRole={projectRole}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {activeTab === 'members' && (
        <div className="space-y-4 max-w-2xl">
          <RoleGuard allow={['ADMIN']} projectRole={projectRole} allowProject={['ADMIN']}>
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-2">Add Member</h2>
              <AddMemberForm onSubmit={handleAddMember} loading={saving} />
            </div>
          </RoleGuard>
          <MemberList
            members={project.members}
            owner={project.owner?._id || project.owner}
            projectRole={projectRole}
            onRemove={handleRemoveMember}
            onRoleChange={handleRoleChange}
          />
        </div>
      )}

      {/* Edit project modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Project">
        <ProjectForm
          onSubmit={handleUpdate}
          loading={saving}
          defaultValues={{ name: project.name, description: project.description }}
        />
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Project" size="sm">
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete <strong>{project.name}</strong>? All tasks will also be
          deleted. This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={saving} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
