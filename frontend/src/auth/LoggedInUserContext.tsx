import { createContext, useContext, useState, useEffect } from "react";

type User = {
    id?: number;
    username: string;
    firstName?: string;
    lastName?: string;
    role?: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    loading: boolean; // 🔥 Loading state ekle
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // 🔥 İlk başta true

    // 🔥 Component mount olduğunda localStorage'dan token'ı kontrol et
    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        const storedUser = sessionStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error("User parse hatası:", error);
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
            }
        }
        setLoading(false); // Loading tamamlandı
    }, []);

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user)); // 🔥 User'ı da sakla
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user"); // 🔥 User'ı da temizle
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};