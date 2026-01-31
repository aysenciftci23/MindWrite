import { useAuth } from "./LoggedInUserContext";
import { API_URL } from "../api";


export function useAuthFetch() {
    const { token, logout } = useAuth();

    return async (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        const url = input.toString().startsWith("http") ? input : `${API_URL}${input}`;

        try {
            const response = await fetch(url, { ...init, headers });

            if (response.status === 401) {
                logout();
            }

            return response;
        } catch (error) {
            throw error;
        }
    };
}
