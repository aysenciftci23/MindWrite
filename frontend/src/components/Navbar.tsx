// src/components/Navbar.tsx (GÜNCELLENMİŞ)
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <span className="text-3xl">🧠</span>
                        <span className="text-2xl font-serif font-extrabold text-gray-900 group-hover:text-primary-700 transition-colors">
                            MindWrite
                        </span>
                    </Link>

                    {/* Center Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className={`text-sm px-3 py-2 rounded-md transition ${isActive('/') ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                            Ana Sayfa
                        </Link>

                        {/* 🔥 YENİ: Tüm Kullanıcılar Butonu (Sadece admin görsün) */}
                        {user && user.role === "admin" && (
                            <Link to="/admin" className={`text-sm px-3 py-2 rounded-md transition ${isActive('/admin') ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                👥 Kullanıcılar
                            </Link>
                        )}

                        {/* 🔥 YENİ: Profilim Butonu (Tüm kullanıcılar görsün) */}
                        {user && (
                            <Link to={`/profile/${user.username}`} className={`text-sm px-3 py-2 rounded-md transition ${location.pathname.startsWith('/profile/') ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                👤 Profilim
                            </Link>
                        )}

                        {/* 🔥 YENİ: Yaz Butonu (admin/editor görsün) */}
                        {user && (user.role === "admin" || user.role === "editor") && (
                            <Link to="/write" className={`text-sm px-3 py-2 rounded-md transition ${isActive('/write') ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                ✍️ Yaz
                            </Link>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* User Menu */}
                                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.username}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.role === 'admin' ? '👑 Admin' : '✍️ Editör'}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900 transition px-3 py-2 rounded-md hover:bg-gray-50">Çıkış</button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition px-3 py-2 rounded-md">Giriş Yap</Link>
                                <Link to="/register" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-sm hover:opacity-95 transition">Kayıt Ol</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 🔥 MOBILE NAVIGATION (Küçük ekranlar için) */}
                <div className="md:hidden flex items-center justify-center space-x-6 py-3 border-t mt-2">
                    <Link to="/" className={`text-sm px-3 py-2 rounded-md ${isActive('/') ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-600'}`}>🏠</Link>

                    {user && user.role === "admin" && (
                        <Link
                            to="/admin"
                            className={`text-sm ${isActive('/admin') ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                        >
                            👥
                        </Link>
                    )}

                    {user && (
                        <Link
                            to={`/profile/${user.username}`}
                            className={`text-sm ${location.pathname.startsWith('/profile/') ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                        >
                            👤
                        </Link>
                    )}

                    {user && (user.role === "admin" || user.role === "editor") && (
                        <Link to="/write" className={`text-sm px-3 py-2 rounded-md ${isActive('/write') ? 'text-gray-900 font-medium bg-gray-100' : 'text-gray-600'}`}>✍️</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}