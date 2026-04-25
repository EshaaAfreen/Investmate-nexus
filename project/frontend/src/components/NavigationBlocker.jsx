import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NavigationBlocker = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        // Push a dummy state so there's always something to "go back" from
        window.history.pushState(null, null, window.location.pathname);

        const handlePopState = (event) => {
            // Prevent the default browser back behavior
            // By pushing state back again immediately if cancelled
            if (window.confirm("You are about to go back. Would you like to logout?")) {
                logout();
                navigate('/');
            } else {
                window.history.pushState(null, null, window.location.pathname);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [logout, navigate]);

    return null;
};
