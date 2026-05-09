import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

export default function AddMemberForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'MEMBER' },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <Input
          placeholder="member@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div className="w-36">
        <Select
          options={[
            { value: 'MEMBER', label: 'Member' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
          error={errors.role?.message}
          {...register('role')}
        />
      </div>
      <Button type="submit" loading={loading} className="shrink-0">
        Add
      </Button>
    </form>
  );
}
