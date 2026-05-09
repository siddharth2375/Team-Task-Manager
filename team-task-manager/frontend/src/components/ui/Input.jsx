import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          'input-base',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
