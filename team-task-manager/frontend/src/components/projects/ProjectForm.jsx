import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Button from '../ui/Button.jsx';

const schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  description: z.string().trim().max(1000).optional().default(''),
});

export default function ProjectForm({ onSubmit, defaultValues, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { name: '', description: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Name"
        placeholder="e.g. Website Redesign"
        error={errors.name?.message}
        {...register('name')}
      />
      <Textarea
        label="Description"
        placeholder="What is this project about?"
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={loading}>
          {defaultValues ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
