// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";
import { useAuthFetch } from "../auth/useAuthFetch";
import { API_URL } from "../api";

type User = {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    role: string;
    createdAt: string;
    postCount: number;
};

type Post = {
    id: number;
    title: string;
    excerpt: string;
    createdAt: string;
    tags: { id: number; name: string }[];
};

export default function Profile() {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser } = useAuth();
    const authFetch = useAuthFetch();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [draftPosts, setDraftPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        password: ""
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState(false);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                let userData: User | null = null;
                if (username) {
                    const userRes = await authFetch(`${API_URL}/auth/users/${username}`);
                    if (!userRes.ok) throw new Error("Kullanıcı bulunamadı");
                    userData = await userRes.json();
                    setProfileUser(userData);
                }

                const postsRes = await authFetch(`${API_URL}/posts`);
                const allPosts = await postsRes.json();
                const userPostsAll = allPosts.filter((post: any) =>
                    post.author?.username === username
                );
                const publishedPosts = userPostsAll.filter((post: any) => post.status === 'published');
                const draftPosts = userPostsAll.filter((post: any) => post.status === 'draft');
                setUserPosts(publishedPosts);
                setDraftPosts(draftPosts);

               
                if (!userData) {
                    if (userPostsAll.length > 0) {
                        userData = userPostsAll[0].author;
                    } else {
                        userData = {
                            id: 0,
                            username: username || '',
                            firstName: '',
                            lastName: '',
                            role: 'editor',
                            createdAt: new Date().toISOString(),
                            postCount: 0
                        };
                    }
                }
                setProfileUser(userData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);




    useEffect(() => {
        if (profileUser && currentUser?.username === profileUser.username) {
            setForm({
                firstName: profileUser.firstName || "",
                lastName: profileUser.lastName || "",
                password: ""
            });
        }
    }, [profileUser, currentUser]);

    const goToMyProfile = () => {
        if (currentUser) {
            navigate(`/profile/${currentUser.username}`);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Profil yükleniyor...</p>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Hata!</p>
                    <p>{error || "Kullanıcı bulunamadı"}</p>
                </div>
                <Link to="/" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">
                    ← Ana sayfaya dön
                </Link>
            </div>
        );
    }

    const isMyProfile = currentUser && profileUser && currentUser.username === profileUser.username;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="mb-8">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
                    ← Ana sayfaya dön
                </Link>

                {}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {((profileUser.firstName && profileUser.firstName.length > 0)
                                    ? profileUser.firstName.charAt(0)
                                    : (profileUser.username ? profileUser.username.charAt(0) : '?')).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {(() => {
                                        const first = (profileUser.firstName ?? '').trim();
                                        const last = (profileUser.lastName ?? '').trim();
                                       
                                        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                                        return `${capitalize(first)}${first && last ? ' ' : ''}${capitalize(last)}`.trim();
                                    })()}
                                    {isMyProfile && (
                                        <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                            Siz
                                        </span>
                                    )}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {profileUser.role === 'admin' ? '👑 Admin' : '✍️ Editör'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">@{profileUser.username}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    📅 {new Date(profileUser.createdAt).toLocaleDateString('tr-TR')} tarihinden beri üye
                                </p>

                                {}
                                {!isMyProfile && currentUser && (
                                    <button
                                        onClick={goToMyProfile}
                                        className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Kendi profilime git
                                    </button>
                                )}
                            </div>
                        </div>

                        {isMyProfile ? (
                            <button
                                onClick={() => navigate("/write")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                ✍️ Yeni Yazı
                            </button>
                        ) : currentUser?.role === 'admin' && (
                            <button
                                onClick={() => navigate(`/admin`)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                👑 Admin'de Gör
                            </button>
                        )}
                    </div>

                    {}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{profileUser.postCount}</p>
                            <p className="text-sm text-gray-600">Yazı</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {userPosts.reduce((acc, post) => acc + (post.tags?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600">Etiket</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.floor(Math.random() * 50)}
                            </p>
                            <p className="text-sm text-gray-600">Takipçi</p>
                        </div>
                    </div>
                </div>
            </div>

            {}
            {isMyProfile && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-8">
                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Profili Düzenle
                        </button>
                    ) : (
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setUpdateLoading(true);
                                setUpdateError("");
                                setUpdateSuccess(false);
                                try {
                                    const res = await fetch(`${API_URL}/auth/me`, {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                                        },
                                        body: JSON.stringify({
                                            firstName: form.firstName,
                                            lastName: form.lastName,
                                            password: form.password || undefined
                                        })
                                    });
                                    if (!res.ok) throw new Error("Profil güncellenemedi");
                                    setUpdateSuccess(true);
                                    setEditMode(false);
                                    setProfileUser(prev => prev ? { ...prev, firstName: form.firstName, lastName: form.lastName } : null);
                                } catch (err: any) {
                                    setUpdateError(err.message);
                                } finally {
                                    setUpdateLoading(false);
                                }
                            }}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ad</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                    value={form.firstName}
                                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Soyad</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                    value={form.lastName}
                                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Yeni Şifre (isteğe bağlı)</label>
                                <input
                                    type="password"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                />
                            </div>
                            {updateError && <div className="text-red-600 text-sm">{updateError}</div>}
                            {updateSuccess && <div className="text-green-600 text-sm">Profil başarıyla güncellendi.</div>}
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    disabled={updateLoading}
                                >
                                    Kaydet
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                                    onClick={() => setEditMode(false)}
                                    disabled={updateLoading}
                                >
                                    Vazgeç
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    📝 {isMyProfile ? 'Yayınlanan Yazılarım' : 'Yayınlanan Yazıları'}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({userPosts.length} yazı)
                    </span>
                </h2>
                {userPosts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">
                            {isMyProfile
                                ? 'Henüz yayınlanmış yazınız yok.'
                                : `${profileUser.username} henüz yayınlanmış yazı yazmamış.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {userPosts.map(post => (
                            <article key={post.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold mb-3">
                                    <Link to={`/posts/${post.id}`} className="text-gray-900 hover:text-indigo-600">
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {post.excerpt}...
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags?.map(tag => (
                                            <Link
                                                key={tag.id}
                                                to={`/?tag=${encodeURIComponent(tag.name)}`}
                                                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        📅 {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    📝 {isMyProfile ? 'Taslaklarım' : 'Taslakları'}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({draftPosts.length} taslak)
                    </span>
                </h2>
                {draftPosts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">
                            {isMyProfile
                                ? 'Henüz taslak yazınız yok.'
                                : `${profileUser.username} henüz taslak yazı yazmamış.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {draftPosts.map(post => (
                            <article key={post.id} className="bg-gray-50 rounded-lg border p-6 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold mb-3">
                                    <Link to={`/posts/${post.id}`} className="text-gray-900 hover:text-indigo-600">
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {post.excerpt}...
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags?.map(tag => (
                                            <Link
                                                key={tag.id}
                                                to={`/?tag=${encodeURIComponent(tag.name)}`}
                                                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        📅 {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {currentUser?.role === 'admin' && !isMyProfile && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">👑 Admin Kontrolleri</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(`/admin`)}
                            className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded transition-colors"
                        >
                            Admin Panel'de Görüntüle
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm(`${profileUser.username} kullanıcısını admin yapmak istediğinize emin misiniz?`)) {
                                    fetch(`${API_URL}/admin/users/${profileUser.id}/role`, {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                                        },
                                        body: JSON.stringify({ role: 'admin' }),
                                    })
                                        .then(res => {
                                            if (!res.ok) throw new Error('Admin yapılamadı');
                                            return res.json();
                                        })
                                        .then(() => {
                                            alert(`${profileUser.username} artık admin!`);
                                            setProfileUser(prev => prev ? { ...prev, role: 'admin' } : null);
                                        })
                                        .catch(err => {
                                            console.error('Admin yapma hatası:', err);
                                            alert('Admin yapılamadı: ' + err.message);
                                        });
                                }
                            }}
                            className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded transition-colors"
                        >
                            Admin Yap
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}