// src/pages/AdminPanel.tsx (TAM HALİ - DEBUG EKLİ)
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { API_URL } from "../api";

type User = {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    role: 'admin' | 'editor';
    createdAt: string;
};

type Post = {
    id: number;
    title: string;
    status: string;
    createdAt: string;
    author: {
        id: number;
        username: string;
    };
    commentsCount: number;
};

export default function AdminPanel() {
    const { user: currentUser, token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState({ users: true, posts: true });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

   
    const fetchUsers = async () => {
        try {
            console.log('🚀 [ADMINPANEL] Fetching /admin/users...');

            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log('📡 [ADMINPANEL] Response status:', res.status, res.statusText);
            console.log('📡 [ADMINPANEL] Response ok?', res.ok);

           
            const responseText = await res.text();
            console.log('📄 [ADMINPANEL] Response text (first 500 chars):', responseText.substring(0, 500));

            if (!res.ok) {
                console.error(`❌ [ADMINPANEL] HTTP Error ${res.status}:`, responseText);

                if (res.status === 403) {
                    setError("403 Forbidden: Admin erişiminiz yok. Token'ınız admin değil veya geçersiz.");
                } else if (res.status === 401) {
                    setError("401 Unauthorized: Token geçersiz veya süresi dolmuş.");
                } else if (res.status === 404) {
                    setError("404 Not Found: /admin/users endpoint'i bulunamadı.");
                } else {
                    setError(`HTTP ${res.status}: ${responseText}`);
                }
                return;
            }

         
            try {
                const data = JSON.parse(responseText);
                console.log('✅ [ADMINPANEL] Users data received:', data);
                console.log(`👥 [ADMINPANEL] Found ${data.length} users`);

                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('❌ [ADMINPANEL] Data is not an array:', data);
                    setError("Geçersiz veri formatı: Array bekleniyordu");
                }
            } catch (parseError) {
                console.error('❌ [ADMINPANEL] JSON parse error:', parseError);
                
                setError(`JSON parse hatası: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
            }
        } catch (err: any) {
            console.error('🔥 [ADMINPANEL] Network error:', err);
            setError(`Network hatası: ${err.message}`);
        } finally {
            console.log('🏁 [ADMINPANEL] fetchUsers completed');
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    useEffect(() => {
        console.log('🔍 [ADMINPANEL] useEffect triggered, token:', token ? 'Var' : 'Yok');
        if (token) {
            fetchUsers();
        } else {
            console.error('❌ [ADMINPANEL] No token available');
            setError("Token bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(prev => ({ ...prev, users: false }));
        }
    }, [token]);

   
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("https://mindwrite-api.onrender.com/posts");
                if (!res.ok) throw new Error("Yazılar yüklenemedi");

                const data = await res.json();
                const postsWithCount = data.map((post: any) => ({
                    ...post,
                    commentsCount: post.comments?.length || 0
                }));
                setPosts(postsWithCount);
            } catch (err: any) {
                console.error('Post fetch error:', err);
            } finally {
                setLoading(prev => ({ ...prev, posts: false }));
            }
        };

        fetchPosts();
    }, []);

    const updateUserRole = async (userId: number, newRole: 'admin' | 'editor') => {
        try {


            const res = await fetch(`https://mindwrite-api.onrender.com/admin/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Role update failed:', errorText);
                throw new Error(`Rol güncellenemedi: ${errorText}`);
            }

            
            setUsers(users.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));

            const username = users.find(u => u.id === userId)?.username;
            setSuccess(`${username} kullanıcısı artık ${newRole === 'admin' ? 'admin' : 'editör'} oldu`);

            
            setTimeout(() => setSuccess(""), 3000);

        } catch (err: any) {
            console.error('Role update error:', err);
            setError(err.message);
        }
    };

    const deleteUser = async (userId: number, username: string) => {
        if (!window.confirm(`${username} kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) {
            return;
        }

        try {
            console.log(`🗑️ [ADMINPANEL] Deleting user ${userId} (${username})`);

            const res = await fetch(`https://mindwrite-api.onrender.com/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ User delete failed:', errorText);
                throw new Error(`Kullanıcı silinemedi: ${errorText}`);
            }

            
            setUsers(users.filter(u => u.id !== userId));
            setSuccess(`${username} kullanıcısı silindi`);

            setTimeout(() => setSuccess(""), 3000);

        } catch (err: any) {
            console.error('User delete error:', err);
            setError(err.message);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("tr-TR", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const isLoading = loading.users || loading.posts;

   
    console.log('📊 [ADMINPANEL] Current state:', {
        usersCount: users.length,
        postsCount: posts.length,
        isLoading,
        error,
        success,
        currentUser: currentUser?.username
    });

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👑 Admin Paneli
                    </h1>
                    <p className="text-gray-600">
                        Hoş geldin, {currentUser?.username}! Sistem yönetimi.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Token: {token ? '✓ Var' : '✗ Yok'} |
                        Kullanıcılar: {users.length} |
                        Yazılar: {posts.length}
                    </p>
                </div>

                {}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p className="font-bold">Hata!</p>
                        <p>{error}</p>
                        <button
                            onClick={() => setError("")}
                            className="text-sm text-red-800 hover:text-red-900 mt-2"
                        >
                            ✕ Kapat
                        </button>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        <p className="font-bold">Başarılı!</p>
                        <p>{success}</p>
                    </div>
                )}

                {}
                <section className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Toplam {users.length} kullanıcı • {users.filter(u => u.role === 'admin').length} admin
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                    Admin Only
                                </span>
                                <button
                                    onClick={fetchUsers}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                    title="Yenile"
                                >
                                    🔄
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading.users ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Kullanıcılar yükleniyor...</p>
                            <p className="text-xs text-gray-400 mt-1">Endpoint: /admin/users</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">Henüz kullanıcı bulunmuyor.</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Backend'den kullanıcı listesi boş geliyor.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                            >
                                ↻ Yeniden dene
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kullanıcı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kayıt Tarihi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow">
                                                        <span className="text-white font-bold text-lg">
                                                            {u.username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            <Link to={`/profile/${u.username}`} className="hover:underline">
                                                                {(() => {
                                                                    const first = (u.firstName ?? '').trim();
                                                                    const last = (u.lastName ?? '').trim();
                                                                   
                                                                    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                                                                    return `${capitalize(first)}${first && last ? ' ' : ''}${capitalize(last)}`.trim();
                                                                })()}
                                                            </Link>
                                                            {u.id === currentUser?.id && (
                                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                    Siz
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            @{u.username} • ID: #{u.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {u.role === 'admin' ? '👑 Admin' : '✍️ Editör'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(u.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {}
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => updateUserRole(u.id, e.target.value as 'admin' | 'editor')}
                                                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        disabled={u.id === currentUser?.id}
                                                    >
                                                        <option value="editor">✍️ Editör</option>
                                                        <option value="admin">👑 Admin</option>
                                                    </select>

                                                    {}
                                                    {u.id !== currentUser?.id && (
                                                        <button
                                                            onClick={() => deleteUser(u.id, u.username)}
                                                            className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition-colors"
                                                            title="Kullanıcıyı sil"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {}
                <section className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Yazı İstatistikleri</h2>

                    {loading.posts ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Yazılar yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Toplam Yazı</p>
                                        <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                                        <span className="text-2xl">💬</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Toplam Yorum</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {posts.reduce((acc, post) => acc + post.commentsCount, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                                <div className="flex items-center">
                                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Aktif Editörler</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {users.filter(u => u.role === 'editor').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {}
                    <div className="mt-8">
                        <h3 className="font-semibold text-gray-900 mb-4">📌 Son Yazılar</h3>
                        <div className="space-y-3">
                            {posts.slice(0, 5).map(post => (
                                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">{post.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {(post.author?.username) || 'Kullanıcı silindi'} • {formatDate(post.createdAt)}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'published'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </ProtectedRoute>
    );
}