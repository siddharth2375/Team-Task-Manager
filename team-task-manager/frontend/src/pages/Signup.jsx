import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { signup } from '../api/auth.api.js';
import { useAuth } from '../hooks/useAuth.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function Signup() {
  const { setAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await signup(data);
      setAuth(res.data.data.token, res.data.data.user);
      toast.success(`Account created! Welcome, ${res.data.data.user.name}!`);
      navigate('/dashboard', { replace: true });
    } catch {
      // Error toast shown by axios interceptor
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm">Start managing tasks with your team</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full justify-center mt-2" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
