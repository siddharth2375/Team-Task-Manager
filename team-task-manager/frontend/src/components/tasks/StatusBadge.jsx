import Badge from '../ui/Badge.jsx';

const map = {
  TODO: { label: 'To Do', variant: 'default' },
  IN_PROGRESS: { label: 'In Progress', variant: 'blue' },
  DONE: { label: 'Done', variant: 'green' },
};

export default function StatusBadge({ status }) {
  const { label, variant } = map[status] || { label: status, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}
