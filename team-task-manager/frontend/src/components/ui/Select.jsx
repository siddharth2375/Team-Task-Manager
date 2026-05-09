import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

const Select = forwardRef(function Select({ label, error, options = [], className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          'input-base bg-white',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Select;
