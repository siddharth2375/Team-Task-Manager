import { useAuth } from '../../hooks/useAuth.js';

/**
 * RoleGuard hides children when the user lacks the required role.
 *
 * Props:
 *  allow       — array of global roles e.g. ['ADMIN']
 *  projectRole — current user's project-level role string (optional)
 *  allowProject— array of project roles that also unlock access
 */
export default function RoleGuard({ children, allow = [], projectRole, allowProject = [] }) {
  const { user } = useAuth();
  if (!user) return null;

  const hasGlobal = allow.includes(user.globalRole);
  const hasProject = projectRole && allowProject.includes(projectRole);

  if (!hasGlobal && !hasProject) return null;
  return children;
}
