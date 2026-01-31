import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    const checkUsername = async (value: string) => {
        if (value.length < 3) {
            setUsernameAvailable(null);
            setCheckingUsername(false);
            return;
        }
        setCheckingUsername(true);
        try {
            const res = await fetch(`${API_URL}/auth/check-username?username=${encodeURIComponent(value)}`);
            const data = await res.json();
            setUsernameAvailable(data.available);
        } catch (err) {
            console.error("Username check failed", err);
            setUsernameAvailable(null);
        } finally {
            setCheckingUsername(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "username") {
            setUsernameAvailable(null);
            
        }
    };

    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.username.length >= 3) {
                checkUsername(formData.username);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.username]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError("İsim ve soyisim alanları zorunludur.");
            setLoading(false);
            return;
        }

        const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!policy.test(formData.password)) {
            setError("Şifre: en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 sayı ve 1 sembol içermelidir.");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            setLoading(false);
            return;
        }

        if (usernameAvailable === false) {
            setError("Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || "Kayıt başarısız");
                setLoading(false);
                return;
            }

            
            alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            navigate("/login");
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            setLoading(false);
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
                            name="username"
                            placeholder="kullanıcı adınız"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.username}
                            onChange={handleChange}
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
                            name="firstName"
                            placeholder="Adınız"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Soyadınız"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ornek@email.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.password}
                            onChange={handleChange}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre Tekrar
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />
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

                {}
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-700">
                        ✍️ Kayıt olduğunuzda otomatik olarak <strong>yazı yazma</strong> yetkisi alacaksınız.
                    </p>
                </div>
            </form>
        </div>
    );
}