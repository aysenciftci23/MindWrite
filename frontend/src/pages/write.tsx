import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/LoggedInUserContext";

type Tag = {
    id: number;
    name: string;
};

export default function Write() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("published"); // 🔥 VARSAYILAN PUBLISHED
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/tags")
            .then(res => {
                if (!res.ok) throw new Error("Tag'ler yüklenemedi");
                return res.json();
            })
            .then(data => setTags(data))
            .catch(err => {
                console.error("Tag yükleme hatası:", err);
                setError("Tag'ler yüklenemedi");
            });
    }, []);

    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    status, // 🔥 Status'u gönder
                    tagIds: selectedTagIds,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Yazı oluşturulamadı");
            }

            const newPost = await res.json();
            alert("Yazı başarıyla yayınlandı! 🎉");
            navigate(`/posts/${newPost.id}`);
        } catch (err: any) {
            setError(err.message || "Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Yeni Yazı</h1>
                    <p className="text-gray-600">Düşüncelerinizi dünyanızla paylaşın.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input - Large and Prominent */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <input
                            type="text"
                            placeholder="Başlık..."
                            className="w-full text-3xl font-serif font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Content Textarea - Clean and Spacious */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <textarea
                            placeholder="Hikayenizi anlatın..."
                            className="w-full text-lg text-gray-800 placeholder-gray-300 focus:outline-none resize-none font-serif leading-relaxed"
                            rows={16}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                {content.length.toLocaleString()} karakter • {Math.ceil(content.length / 1000)} dk okuma
                            </p>
                        </div>
                    </div>

                    {/* Status Selection - Modern Toggle Style */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-4">
                            Yayınlama Durumu
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStatus("published")}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${status === "published"
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                ✅ Yayınla
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus("draft")}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${status === "draft"
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                📝 Taslak
                            </button>
                        </div>
                    </div>

                    {/* Tags Selection */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-4">
                            Etiketler (Opsiyonel)
                        </label>
                        {tags.length === 0 ? (
                            <p className="text-gray-500 text-sm">Etiketler yükleniyor...</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => {
                                            if (selectedTagIds.includes(tag.id)) {
                                                setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                                            } else {
                                                setSelectedTagIds([...selectedTagIds, tag.id]);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedTagIds.includes(tag.id)
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-gray-600 hover:text-gray-900 transition font-medium"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition disabled:opacity-50 font-medium"
                        >
                            {loading ? 'Kaydediliyor...' : status === 'published' ? '🚀 Yayınla' : '💾 Taslak Olarak Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}