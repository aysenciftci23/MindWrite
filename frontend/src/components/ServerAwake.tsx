import { useEffect, useRef } from 'react';
import { API_URL } from '../api';
import { toast } from 'sonner';

export default function ServerAwake() {
    const hasNotifiedRef = useRef(false);

    useEffect(() => {
        // Localhost'ta çalışmaya gerek yok
        if (window.location.hostname === 'localhost') return;

        const checkServer = async () => {
            try {
                // Sadece server'ı uyandırmak için istek atıyoruz
                await fetch(`${API_URL}`);

                // Eğer daha önce "bekleyin" mesajı gösterdiysek, şimdi "hazır" diyelim
                if (hasNotifiedRef.current) {
                    toast.dismiss('server-waking-up');
                    toast.success("Sunucu hazır! İyi çalışmalar.", { duration: 3000 });
                }
            } catch (error) {
                console.error("Server check failed", error);
                // Burada tekrar deneme mantığı eklenebilir ama şimdilik basit tutalım
            }
        };

        // 2 saniye içinde yanıt gelmezse kullanıcıyı bilgilendir
        const timer = setTimeout(() => {
            hasNotifiedRef.current = true;
            toast.loading("Sunucu başlatılıyor... (Render Free Tier)", {
                description: "Bu işlem ilk açılışta 30-60 saniye sürebilir. Lütfen bekleyin...",
                id: 'server-waking-up',
                duration: 60000, // 1 dakika ekranda kalsın
            });
        }, 2000);

        checkServer().finally(() => {
            // Server yanıt verirse (başarılı veya başarısız) timer'ı iptal et
            // Eğer timer çoktan çalıştıysa (hasNotifiedRef=true), yukarıdaki if bloğu "hazır" mesajını gösterecek
            clearTimeout(timer);
        });

        return () => clearTimeout(timer);
    }, []); // Sadece mount anında çalışsın

    return null;
}
