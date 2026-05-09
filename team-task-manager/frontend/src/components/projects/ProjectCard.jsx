import { Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import { formatDate } from '../../lib/utils.js';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate mb-1">
        {project.name}
      </h3>
      {project.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto">
        <span className="flex items-center gap-1">
          <Users size={13} />
          {project.members?.length ?? 0} member{project.members?.length !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={13} />
          {formatDate(project.createdAt)}
        </span>
      </div>
    </Card>
  );
}
