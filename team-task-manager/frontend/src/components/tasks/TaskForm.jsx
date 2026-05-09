import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const schema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(160),
  description: z.string().trim().max(2000).optional().default(''),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export default function TaskForm({ onSubmit, defaultValues, loading, members = [], isAdmin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      assigneeId: '',
    },
  });

  const handleFormSubmit = (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
    };
    if (data.dueDate) payload.dueDate = data.dueDate;
    if (data.assigneeId) payload.assignee = data.assigneeId;
    onSubmit(payload);
  };

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((entry) => {
      const u = entry.user || entry;
      return { value: u._id, label: u.name };
    }),
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Task title"
        error={errors.title?.message}
        {...register('title')}
      />
      <Textarea
        label="Description"
        placeholder="Optional details…"
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          label="Priority"
          options={PRIORITY_OPTIONS}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
        <Select
          label="Assignee"
          options={memberOptions}
          error={errors.assigneeId?.message}
          {...register('assigneeId')}
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>
          {defaultValues?.title ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
