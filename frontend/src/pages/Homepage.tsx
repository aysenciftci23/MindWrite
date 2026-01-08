// src/pages/Homepage.tsx (MODERN)
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";
import { FiHome, FiTrendingUp, FiClock, FiUser, FiTag, FiEdit } from "react-icons/fi";
import { API_URL } from "../api";

type Post = {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    createdAt: string;
    author: {
        id: number;
        username: string;
        role: string;
    };
    tags: { id: number; name: string }[];
    comments: any[];
};

export default function Homepage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const selectedTag = searchParams.get("tag");

    useEffect(() => {
        fetch(`${API_URL}/posts`)
            .then(res => res.json())
            .then(data => {
                // Sadece published olanları al
                const publishedPosts = data.filter((post: any) => post.status === 'published');
                setPosts(publishedPosts);
                setFilteredPosts(publishedPosts);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedTag) {
            const filtered = posts.filter(post =>
                post.tags?.some(tag => tag.name.toLowerCase() === selectedTag.toLowerCase())
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(posts);
        }
    }, [selectedTag, posts]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} dakika önce`;
        if (diffHours < 24) return `${diffHours} saat önce`;
        if (diffDays < 7) return `${diffDays} gün önce`;
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    };

    // Popüler tag'leri bul
    const popularTags = posts
        .flatMap(post => post.tags || [])
        .reduce((acc: any[], tag) => {
            const existing = acc.find(t => t.id === tag.id);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ ...tag, count: 1 });
            }
            return acc;
        }, [])
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="mb-6 p-6 bg-white rounded-2xl shadow-sm">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-2/3 mb-8 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                🧠 MindWrite
                                <span className="block text-2xl md:text-3xl font-normal mt-2 opacity-90">
                                    Düşüncelerinizi paylaşın, fikirlerinizi yayın
                                </span>
                            </h1>
                            <p className="text-lg opacity-90 mb-6">
                                Teknoloji, programlama ve kişisel gelişim üzerine yazılar. Topluluk tarafından, topluluk için.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {user ? (
                                    <>
                                        <Link
                                            to="/write"
                                            className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center transition-all hover:shadow-lg"
                                        >
                                            <FiEdit className="mr-2" /> Yeni Yazı Oluştur
                                        </Link>
                                        <Link
                                            to={`/profile/${user.username}`}
                                            className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-all"
                                        >
                                            <FiUser className="mr-2" /> Profilim
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/register"
                                            className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                                        >
                                            Hemen Katıl
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-all"
                                        >
                                            Giriş Yap
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FiTrendingUp className="text-2xl mr-3" />
                                        <h3 className="text-xl font-bold">İstatistikler</h3>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-90">Toplam Yazı</span>
                                        <span className="text-2xl font-bold">{posts.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-90">Toplam Yorum</span>
                                        <span className="text-2xl font-bold">
                                            {posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-90">Aktif Yazar</span>
                                        <span className="text-2xl font-bold">
                                            {new Set(posts.map(p => p.author?.id).filter(Boolean)).size}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Posts */}
                    <div className="lg:w-2/3">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <FiHome className="text-2xl text-gray-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedTag ? `"${selectedTag}" Etiketli Yazılar` : "Son Yazılar"}
                                    </h2>
                                    {selectedTag && (
                                        <Link
                                            to="/"
                                            className="ml-4 text-sm text-primary-600 hover:text-primary-800 flex items-center"
                                        >
                                            ✕ Filtreyi Temizle
                                        </Link>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {filteredPosts.length} yazı
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <FiTag className="mr-2" /> Popüler Etiketler
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to="/"
                                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${!selectedTag
                                            ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Tümü
                                    </Link>
                                    {popularTags.map(tag => (
                                        <Link
                                            key={tag.id}
                                            to={`/?tag=${encodeURIComponent(tag.name)}`}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${selectedTag === tag.name
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            #{tag.name} <span className="text-xs opacity-75 ml-1">({tag.count})</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Posts List */}
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {selectedTag ? `"${selectedTag}" etiketine ait yazı bulunamadı` : "Henüz yazı yok"}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {selectedTag
                                        ? "Bu etiketle ilgili ilk yazıyı sen oluşturabilirsin!"
                                        : "İlk yazıyı oluşturmak için 'Yeni Yazı Oluştur' butonuna tıkla!"
                                    }
                                </p>
                                {user && (
                                    <Link
                                        to="/write"
                                        className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        <FiEdit className="mr-2" /> Yeni Yazı Oluştur
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                {filteredPosts.map(post => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                                                        <Link to={`/posts/${post.id}`}>
                                                            {post.title}
                                                        </Link>
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-600 mb-4">
                                                        {post.author ? (
                                                            <Link
                                                                to={`/profile/${post.author.username}`}
                                                                className="flex items-center hover:text-primary-600 transition-colors"
                                                            >
                                                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold mr-2">
                                                                    {post.author.username.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="font-medium">{post.author.username}</span>
                                                                {post.author.role === 'admin' && (
                                                                    <span className="ml-2 bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                                                                        Admin
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        ) : (
                                                            <div className="flex items-center text-gray-600">
                                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold mr-2">
                                                                    K
                                                                </div>
                                                                <span className="font-medium">Kullanıcı silindi</span>
                                                            </div>
                                                        )}
                                                        <span className="mx-2">•</span>
                                                        <div className="flex items-center">
                                                            <FiClock className="mr-1" />
                                                            {formatDate(post.createdAt)}
                                                        </div>
                                                        <span className="mx-2">•</span>
                                                        <div className="flex items-center">
                                                            <FiTrendingUp className="mr-1" />
                                                            {post.comments?.length || 0} yorum
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-6 line-clamp-3 leading-relaxed">
                                                {post.excerpt || post.content.substring(0, 200)}...
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-2">
                                                    {post.tags?.slice(0, 3).map(tag => (
                                                        <Link
                                                            key={tag.id}
                                                            to={`/?tag=${encodeURIComponent(tag.name)}`}
                                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                                                        >
                                                            #{tag.name}
                                                        </Link>
                                                    ))}
                                                    {post.tags && post.tags.length > 3 && (
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                                                            +{post.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <Link
                                                    to={`/posts/${post.id}`}
                                                    className="flex items-center text-primary-600 hover:text-primary-800 font-semibold transition-colors"
                                                >
                                                    Devamını oku
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:w-1/3">
                        {/* About Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">ℹ️ MindWrite Hakkında</h3>
                            <p className="text-gray-700 mb-4">
                                Açık kaynaklı bir blog platformu. Teknoloji, yazılım geliştirme ve kişisel gelişim üzerine içerikler.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                                    <span className="text-sm text-gray-600">Tamamen ücretsiz</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                                    <span className="text-sm text-gray-600">Açık kaynak kodlu</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                                    <span className="text-sm text-gray-600">Topluluk odaklı</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 mb-6 border border-primary-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Canlı İstatistikler</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Yazı Sayısı</span>
                                        <span className="text-sm font-bold text-primary-700">{posts.length}</span>
                                    </div>
                                    <div className="w-full bg-primary-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(posts.length * 10, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Toplam Yorum</span>
                                        <span className="text-sm font-bold text-primary-700">
                                            {posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-primary-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0) * 5, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {user && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Hızlı Erişim</h3>
                                <div className="space-y-3">
                                    <Link
                                        to="/write"
                                        className="flex items-center justify-between p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                                                <FiEdit className="text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Yazı Oluştur</p>
                                                <p className="text-sm text-gray-600">Yeni bir yazı başlat</p>
                                            </div>
                                        </div>
                                        <div className="text-primary-600">→</div>
                                    </Link>
                                    <Link
                                        to={`/profile/${user.username}`}
                                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                                                <FiUser className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Profilim</p>
                                                <p className="text-sm text-gray-600">Yazılarımı ve istatistiklerimi gör</p>
                                            </div>
                                        </div>
                                        <div className="text-gray-600">→</div>
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                                                    <FiTrendingUp className="text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Admin Paneli</p>
                                                    <p className="text-sm text-gray-600">Kullanıcıları yönet</p>
                                                </div>
                                            </div>
                                            <div className="text-yellow-600">→</div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <div className="flex items-center mb-4">
                                <span className="text-3xl mr-2">🧠</span>
                                <span className="text-2xl font-bold">MindWrite</span>
                            </div>
                            <p className="text-gray-400">Açık kaynaklı blog platformu • 2025</p>
                        </div>

                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                        <p>Made with ❤️ for CENG 307 Project</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}