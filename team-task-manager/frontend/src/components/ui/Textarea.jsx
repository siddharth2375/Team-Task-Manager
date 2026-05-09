import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

const Textarea = forwardRef(function Textarea({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={3}
        className={cn(
          'input-base resize-y min-h-[80px]',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Textarea;
