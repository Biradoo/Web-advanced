import {writable} from 'svelte/store';

const initialAuthState = { //Initial state for authentication
    user: null,
    token: null,
    isAuthenticated: false
};
export const authStore = writable(initialAuthState);

export const setAuth = (user, token) => { //Set authentication data
    if (!user.id || !user.username || !user.roles) {
        return;
    }

    authStore.set({
        user,
        token,
        isAuthenticated: !!user && !!token
    });

    //Store in localStorage
    localStorage.setItem('user', JSON.stringify({
        id: user.id,
        username: user.username,
        roles: user.roles
    }));
    localStorage.setItem('token', token);

};

export const clearAuth = () => { //Clear authentication when logging out
    authStore.set({
        user: null,
        token: null,
        isAuthenticated: false
    });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

export const initializeAuth = () => { //Initialize authStore from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
        try {
            const user = JSON.parse(storedUser);

            if (user.id && user.username && user.roles) {
                setAuth(user, storedToken);
            }
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
        }
    }
};