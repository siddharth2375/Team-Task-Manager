import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-7xl font-bold text-brand-200 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Page not found</h2>
      <p className="text-slate-500 text-sm mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
