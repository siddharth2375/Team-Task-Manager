import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d, yyyy');
  } catch {
    return '—';
  }
};

export const formatRelative = (date) => {
  if (!date) return '—';
  try {
    return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, {
      addSuffix: true,
    });
  } catch {
    return '—';
  }
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'DONE') return false;
  try {
    return isPast(typeof dueDate === 'string' ? parseISO(dueDate) : dueDate);
  } catch {
    return false;
  }
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');
