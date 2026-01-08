import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // İsim ve soyisim zorunlu
        if (!name.trim() || !surname.trim()) {
            setError("İsim ve soyisim alanları zorunludur.");
            setLoading(false);
            return;
        }

        // Password policy: minimum 8 chars, at least one lowercase, one uppercase, one digit, one special
        const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!policy.test(password)) {
            setError("Şifre: en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 sayı ve 1 sembol içermelidir.");
            setLoading(false);
            return;
        }

        try {
            // final availability check before submit
            if (usernameAvailable === false) {
                setError("Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.");
                setLoading(false);
                return;
            }

            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, firstName: name, lastName: surname }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || "Kayıt başarısız");
                setLoading(false);
                return;
            }

            // Başarılı kayıt
            alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            navigate("/login");
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            setLoading(false);
        }
    };

    const checkUsername = async (value: string) => {
        if (!value) {
            setUsernameAvailable(null);
            return;
        }
        setCheckingUsername(true);
        try {
            const res = await fetch(`http://localhost:3000/auth/check-username?username=${encodeURIComponent(value)}`);
            if (!res.ok) {
                setUsernameAvailable(null);
            } else {
                const data = await res.json();
                setUsernameAvailable(Boolean(data.available));
            }
        } catch (err) {
            setUsernameAvailable(null);
        } finally {
            setCheckingUsername(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🧠 MindWrite
                    </h1>
                    <p className="text-gray-600">Yeni hesap oluştur</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            placeholder="kullanıcı adınız"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setUsernameAvailable(null); }}
                            onBlur={(e) => checkUsername(e.target.value)}
                            required
                        />
                        <p className="text-xs mt-1">
                            {checkingUsername ? (
                                <span className="text-gray-500">Kullanıcı adı kontrol ediliyor...</span>
                            ) : usernameAvailable === false ? (
                                <span className="text-red-600">Bu kullanıcı adı alınmış.</span>
                            ) : usernameAvailable === true ? (
                                <span className="text-green-600">Kullanıcı adı uygun.</span>
                            ) : (
                                <span className="text-gray-500">Kullanıcı adı benzersiz olmalıdır.</span>
                            )}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                        <input
                            type="text"
                            placeholder="Adınız"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                        <input
                            type="text"
                            placeholder="Soyadınız"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                            <p>Şifre kuralları:</p>
                            <ul className="list-disc list-inside">
                                <li>En az 8 karakter</li>
                                <li>En az 1 büyük harf (A-Z)</li>
                                <li>En az 1 küçük harf (a-z)</li>
                                <li>En az 1 sayı (0-9)</li>
                                <li>En az 1 sembol (örn. !@#$%)</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                    >
                        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Zaten hesabın var mı?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Giriş Yap
                    </Link>
                </p>

                {/* Bilgi Notu */}
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-700">
                        ✍️ Kayıt olduğunuzda otomatik olarak <strong>yazı yazma</strong> yetkisi alacaksınız.
                    </p>
                </div>
            </form>
        </div>
    );
}