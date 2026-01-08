import { useAuth } from "./LoggedInUserContext";

// Custom hook: fetch wrapper with auto-logout on 401
export function useAuthFetch() {
    const { token, logout } = useAuth();

    return async (input: RequestInfo, init: RequestInit = {}) => {
        const headers = new Headers(init.headers || {});
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        try {
            const response = await fetch(input, { ...init, headers });
            if (response.status === 401) {
                logout();
            }
            return response;
        } catch (err) {
            // Ağ hatası vs.
            throw err;
        }
    };
}
