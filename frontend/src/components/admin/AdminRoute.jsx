import { Navigate } from 'react-router-dom';
import { getRole } from '../../utils/admintoken';

export default function AdminRoute({ children }) {
    const token = localStorage.getItem('accessToken');

    if (!token) return <Navigate to="/login" replace />;

    const role = getRole();
    const isAdmin = typeof role === 'string'
        ? role.includes('ADMIN')
        : Array.isArray(role) && role.some(r => String(r).includes('ADMIN'));

    return isAdmin ? children : <Navigate to="/" replace />;
}