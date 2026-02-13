import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export const AuthGuard = () => {
    const token = localStorage.getItem('token');
    const user = useAppStore(state => state.user);

    if (!token || !user) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};
