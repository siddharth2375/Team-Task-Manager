import { Calendar, User } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import Badge from '../ui/Badge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import { formatDate, isOverdue, cn } from '../../lib/utils.js';

export default function TaskCard({ task, index, onClick }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={cn(
            'bg-white rounded-xl border p-3.5 cursor-pointer shadow-sm',
            'hover:shadow-md transition-all',
            overdue ? 'border-red-300 hover:border-red-400' : 'border-slate-200 hover:border-brand-300',
            snapshot.isDragging && 'shadow-lg rotate-1 opacity-90'
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium text-slate-900 leading-snug">{task.title}</p>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {overdue && <Badge variant="red">Overdue</Badge>}

            {task.dueDate && (
              <span
                className={cn(
                  'flex items-center gap-1 text-xs',
                  overdue ? 'text-red-500' : 'text-slate-400'
                )}
              >
                <Calendar size={11} />
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.assignee && (
              <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                <User size={11} />
                {task.assignee.name}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
