import { useState, useEffect } from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { listProjects, createProject } from '../api/projects.api.js';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import ProjectForm from '../components/projects/ProjectForm.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    listProjects()
      .then((res) => setProjects(res.data.data.projects))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data) => {
    setCreating(true);
    try {
      const res = await createProject(data);
      setProjects((prev) => [res.data.data.project, ...prev]);
      setCreateOpen(false);
      toast.success('Project created!');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Projects</h1>
          <p className="text-slate-500 text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start collaborating."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} />
              Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Project">
        <ProjectForm onSubmit={handleCreate} loading={creating} />
      </Modal>
    </div>
  );
}
