import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import TaskDetail from './pages/TaskDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'tasks/:id', element: <TaskDetail /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
