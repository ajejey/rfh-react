import { useState, useEffect, useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const TOKEN_KEY = 'rfh_admin_token';
const USER_KEY  = 'rfh_admin_user';

function readUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); }
    catch { return null; }
}

export default function useAdminAuth() {
    const [user, setUser]               = useState(readUser);
    const [loading, setLoading]         = useState(true);
    const [permissions, setPermissions] = useState(null);

    const token = localStorage.getItem(TOKEN_KEY);

    const isAuthenticated = !!user && !!token;
    const isSuperAdmin    = user?.role === 'superAdmin';

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setPermissions(null);
        window.location.replace('/admin/login');
    }, []);

    const login = useCallback((newToken, userData) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
    }, []);

    // Verify token with backend on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (!storedToken) { setLoading(false); return; }

        fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
        })
            .then(r => (r.ok ? r.json() : null))
            .then(data => {
                if (data) {
                    setUser(data);
                    localStorage.setItem(USER_KEY, JSON.stringify(data));
                } else {
                    logout();
                }
            })
            .catch(() => logout())
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch global permissions once authenticated
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (!isAuthenticated || !storedToken) return;

        fetch(`${BASE_URL}/api/admin/permissions`, {
            headers: { Authorization: `Bearer ${storedToken}` },
        })
            .then(r => r.json())
            .then(setPermissions)
            .catch(() => {});
    }, [isAuthenticated]);

    // Helper: can this user access a permission key?
    const can = useCallback((permKey) => {
        if (isSuperAdmin) return true;
        return permissions?.[permKey] === true;
    }, [isSuperAdmin, permissions]);

    return { user, loading, isAuthenticated, isSuperAdmin, permissions, token, login, logout, can };
}
