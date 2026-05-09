import { cn } from '../../lib/utils.js';

export default function Card({ children, className, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
}
