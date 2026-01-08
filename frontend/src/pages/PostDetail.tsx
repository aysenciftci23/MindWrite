import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";

type Post = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    status: string;
    author: {
        id: number;
        username: string;
    };
    tags: Array<{ id: number; name: string }>;
    comments: Array<{ id: number; content: string; authorName: string; createdAt: string }>;
};

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const { user, token } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const [commentAuthor, setCommentAuthor] = useState(user?.username || "");
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetch(`https://mindwrite-api.onrender.com/posts/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Post bulunamadı");
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    // Keep comment author in sync with logged-in user
    useEffect(() => {
        setCommentAuthor(user?.username || "");
    }, [user]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingComment(true);
        if (!token) {
            alert("Yorum yapabilmek için giriş yapmalısınız.");
            setSubmittingComment(false);
            return;
        }
        try {
            const res = await fetch("https://mindwrite-api.onrender.com/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    content: commentContent,
                    authorName: commentAuthor,
                    postId: Number(id),
                }),
            });

            if (!res.ok) throw new Error("Yorum eklenemedi");

            const updatedPost = await fetch(`https://mindwrite-api.onrender.com/posts/${id}`).then(r => r.json());
            setPost(updatedPost);
            setCommentContent("");
            alert("Yorumunuz eklendi! ✅");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmittingComment(false);
        }
    };

    const canEdit = user && (user.role === 'admin' || (user.role === 'editor' && post?.author && post.author.id === user.id));

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Yazı Bulunamadı</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/" className="text-gray-900 hover:text-gray-600 transition font-medium">
                        ← Ana sayfaya dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* Back Button & Edit */}
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 transition text-sm flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Geri
                        </Link>
                        {canEdit && (
                            <Link
                                to={`/edit/${post.id}`}
                                className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Düzenle
                            </Link>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Author Info */}
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {(post.author && post.author.username ? post.author.username.charAt(0).toUpperCase() : 'K')}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{post.author && post.author.username ? post.author.username : 'Kullanıcı silindi'}</p>
                            <div className="flex items-center text-sm text-gray-600 space-x-2">
                                <span>{new Date(post.createdAt).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}</span>
                                <span>•</span>
                                <span>{Math.ceil(post.content.length / 1000)} dk okuma</span>
                                {post.status === 'draft' && (
                                    <>
                                        <span>•</span>
                                        <span className="text-yellow-600 font-medium">Taslak</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            {post.tags.map(tag => (
                                <span
                                    key={tag.id}
                                    className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm hover:bg-gray-200 transition"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <article className="max-w-3xl mx-auto px-4 py-12">
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-serif">
                        {post.content}
                    </p>
                </div>
            </article>

            {/* Comments Section */}
            <div className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 py-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">
                        Yorumlar ({post.comments?.length || 0})
                    </h3>

                    {/* Comment Form */}
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-4">Yorum Yap</h4>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Adınız"
                                    value={commentAuthor}
                                    onChange={(e) => setCommentAuthor(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    required
                                    readOnly={!!user}
                                />
                                <textarea
                                    placeholder="Düşüncelerinizi paylaşın..."
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    rows={4}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submittingComment}
                                    className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition disabled:opacity-50 font-medium"
                                >
                                    {submittingComment ? 'Gönderiliyor...' : 'Yorum Yap'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-12 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <p className="text-gray-700">
                                Yorum yapmak için lütfen <Link to="/login" className="text-blue-600">giriş yapın</Link> veya <Link to="/register" className="text-blue-600">kayıt olun</Link>.
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-6">
                            {post.comments.map(comment => (
                                <div key={comment.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                                            {comment.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-gray-900">{comment.authorName}</p>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">💬</div>
                            <p className="text-gray-600">Henüz yorum yok. İlk yorumu siz yapın!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}