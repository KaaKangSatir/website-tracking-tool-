# Website Tracking Tool

Website Tracking Tool adalah aplikasi web untuk melacak aktivitas pengguna secara real-time.

🔗 **Live Website**  
[https://KaaKangSatir.vercel.app](https://KaaKangSatir.vercel.app)

## 🚀 Cara Menjalankan (menggunakan Node.js)

1. Pastikan Node.js sudah terinstall.  
   Download: https://nodejs.org

2. Clone repository dan install dependensi:
   ```bash
   git clone https://github.com/KaaKangSatir/website-tracking-tool.git
   cd website-tracking-tool
   npm install
   ```

3. Jalankan server:
   ```bash
   npm run dev
   ```

4. Buka browser dan akses:
   [http://localhost:3000](http://localhost:3000)

## 🔐 Cara Mengganti API Key Supabase

1. Buka file:
   ```
   src/interagion/supabase/client.ts
   ```

2. Temukan baris berikut:
   ```ts
   const SUPABASE_URL = "YOUR_URL";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_KEY";
   ```

3. Ganti `YOUR_URL` dan `YOUR_KEY` dengan informasi dari Supabase milikmu.

Selesai.
