// src/pages/EditPost.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";

type Tag = {
    id: number;
    name: string;
};

type Post = {
    id: number;
    title: string;
    content: string;
    status: string;
    author: {
        id: number;
        username: string;
    };
    tags: Tag[];
};

export default function EditPost() {
    const { id } = useParams<{ id: string }>();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [post, setPost] = useState<Post | null>(null);

    // Post verilerini ve tag'leri yükle
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Post verisini çek
                const postRes = await fetch(`http://localhost:3000/posts/${id}`);
                if (!postRes.ok) throw new Error("Yazı bulunamadı");

                const postData: Post = await postRes.json();
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content);
                setStatus(postData.status || "draft");
                setSelectedTagIds(postData.tags.map(t => t.id));

                // Yetki kontrolü
                if (user?.role !== "admin" && user?.id !== postData.author.id) {
                    setError("Bu yazıyı düzenleme yetkiniz yok");
                    return;
                }

                // Tag'leri çek
                const tagsRes = await fetch("http://localhost:3000/tags");
                if (tagsRes.ok) {
                    const tagsData = await tagsRes.json();
                    setTags(tagsData);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchData();
        }
    }, [id, token, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`http://localhost:3000/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    status,
                    tagIds: selectedTagIds,
                }),
            });

            if (!res.ok) {
                throw new Error("Güncelleme başarısız");
            }

            navigate(`/posts/${id}`);
        } catch (err: any) {
            setError(err.message || "Bir hata oluştu");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                navigate("/");
            } else {
                throw new Error("Silme işlemi başarısız");
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    if (error && !post) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <Link
                    to="/"
                    className="inline-block mt-4 text-indigo-600 hover:text-indigo-800"
                >
                    ← Ana sayfaya dön
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <div className="mb-6">
                <Link
                    to={`/posts/${id}`}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Yazıya geri dön
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6">✏️ Yazıyı Düzenle</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">Başlık:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">İçerik:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={10}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Durum:</label>
                    <div className="flex gap-6">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="draft"
                                checked={status === "draft"}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mr-2 h-4 w-4 text-indigo-600"
                            />
                            <span className="text-gray-700">Taslak</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="published"
                                checked={status === "published"}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mr-2 h-4 w-4 text-indigo-600"
                            />
                            <span className="text-gray-700">Yayında</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Etiketler:</label>
                    {tags.length === 0 ? (
                        <p className="text-gray-500">Etiket yükleniyor...</p>
                    ) : (
                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                            {tags.map(tag => (
                                <label
                                    key={tag.id}
                                    className="flex items-center bg-white hover:bg-gray-100 border px-3 py-2 rounded cursor-pointer transition-all"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTagIds.includes(tag.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTagIds([...selectedTagIds, tag.id]);
                                            } else {
                                                setSelectedTagIds(selectedTagIds.filter(tagId => tagId !== tag.id));
                                            }
                                        }}
                                        className="mr-2 h-4 w-4 text-indigo-600"
                                    />
                                    <span className="text-gray-700">{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-6 border-t">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Güncelle
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/posts/${id}`)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors ml-auto"
                    >
                        Sil
                    </button>
                </div>
            </form>
        </div>
    );
}