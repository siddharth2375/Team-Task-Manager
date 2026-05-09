import { useState, useCallback } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskCard from './TaskCard.jsx';
import TaskForm from './TaskForm.jsx';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { updateTask } from '../../api/tasks.api.js';
import { cn } from '../../lib/utils.js';

const COLUMNS = [
  { id: 'TODO', label: 'To Do', color: 'bg-slate-100 text-slate-600' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { id: 'DONE', label: 'Done', color: 'bg-green-100 text-green-700' },
];

export default function TaskBoard({
  tasks,
  loading,
  onTaskCreated,
  onTaskUpdated,
  projectId,
  members,
  projectRole,
}) {
  const [tasksByStatus, setTasksByStatus] = useState(() => buildMap(tasks));
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sync when parent tasks prop changes
  if (!saving) {
    const fresh = buildMap(tasks);
    const changed = JSON.stringify(fresh) !== JSON.stringify(tasksByStatus);
    if (changed) setTasksByStatus(fresh);
  }

  const onDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index)
        return;

      const newStatus = destination.droppableId;

      // Optimistic update
      setTasksByStatus((prev) => {
        const next = { TODO: [...prev.TODO], IN_PROGRESS: [...prev.IN_PROGRESS], DONE: [...prev.DONE] };
        const [moved] = next[source.droppableId].splice(source.index, 1);
        moved.status = newStatus;
        next[destination.droppableId].splice(destination.index, 0, moved);
        return next;
      });

      try {
        setSaving(true);
        const res = await updateTask(draggableId, { status: newStatus });
        onTaskUpdated(res.data.data.task);
        toast.success('Status updated');
      } catch {
        // revert
        setTasksByStatus(buildMap(tasks));
        // error toast already shown by interceptor
      } finally {
        setSaving(false);
      }
    },
    [tasks, onTaskUpdated]
  );

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await onTaskCreated(data);
      setCreateModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data) => {
    if (!editModal) return;
    setSaving(true);
    try {
      const res = await updateTask(editModal._id, data);
      onTaskUpdated(res.data.data.task);
      toast.success('Task updated');
      setEditModal(null);
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

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        <Button size="sm" onClick={() => setCreateModal(true)}>
          <Plus size={15} />
          New Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold mb-3 w-fit',
                  col.color
                )}
              >
                {col.label}
                <span className="bg-white/70 rounded-full px-1.5">
                  {tasksByStatus[col.id]?.length ?? 0}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'flex-1 space-y-2.5 rounded-xl p-2 min-h-[200px] transition-colors',
                      snapshot.isDraggingOver ? 'bg-brand-50/60' : 'bg-slate-100/50'
                    )}
                  >
                    {(tasksByStatus[col.id] || []).length === 0 && !snapshot.isDraggingOver && (
                      <EmptyState title="No tasks" />
                    )}
                    {(tasksByStatus[col.id] || []).map((task, index) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        index={index}
                        onClick={() => setEditModal(task)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Create task modal */}
      <Modal
        open={createModal}
        onClose={() => setCreateModal(false)}
        title="New Task"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreate}
          loading={saving}
          members={members}
          isAdmin={projectRole === 'ADMIN'}
        />
      </Modal>

      {/* Edit task modal */}
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Task"
        size="lg"
      >
        {editModal && (
          <TaskForm
            onSubmit={handleEdit}
            loading={saving}
            members={members}
            isAdmin={projectRole === 'ADMIN'}
            defaultValues={{
              title: editModal.title,
              description: editModal.description || '',
              status: editModal.status,
              priority: editModal.priority,
              dueDate: editModal.dueDate
                ? editModal.dueDate.split('T')[0]
                : '',
              assigneeId: editModal.assignee?._id || '',
            }}
          />
        )}
      </Modal>
    </>
  );
}

function buildMap(tasks = []) {
  return {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  };
}
