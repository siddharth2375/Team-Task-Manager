import { Crown, User } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function MemberList({ members, owner, projectRole, onRemove, onRoleChange }) {
  const isAdmin = projectRole === 'ADMIN';

  return (
    <ul className="space-y-3">
      {members.map((entry) => {
        const member = entry.user || entry;
        const isOwner = owner && (owner._id || owner) === (member._id || member);

        return (
          <li
            key={member._id || member}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <User size={16} className="text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
              <p className="text-xs text-slate-500 truncate">{member.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isOwner && <Crown size={14} className="text-amber-500" />}
              <Badge variant={entry.role === 'ADMIN' ? 'blue' : 'default'}>
                {entry.role}
              </Badge>
              {isAdmin && !isOwner && (
                <div className="flex items-center gap-1">
                  <select
                    value={entry.role}
                    onChange={(e) => onRoleChange(member._id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    onClick={() => onRemove(member._id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
