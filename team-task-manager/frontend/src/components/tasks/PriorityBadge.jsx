import Badge from '../ui/Badge.jsx';

const map = {
  HIGH: { label: 'High', variant: 'red' },
  MEDIUM: { label: 'Medium', variant: 'amber' },
  LOW: { label: 'Low', variant: 'default' },
};

export default function PriorityBadge({ priority }) {
  const { label, variant } = map[priority] || { label: priority, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}
