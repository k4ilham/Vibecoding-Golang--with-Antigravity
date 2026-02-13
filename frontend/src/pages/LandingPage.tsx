import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Features } from '@/components/Features';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { FloatingWA } from '@/components/FloatingWA';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-foreground">
            <Helmet>
                <title>Maulana Laundry | Jasa Laundry Premium Bogor - Antar Jemput Gratis</title>
                <meta name="description" content="Jasa laundry kiloan dan satuan terbaik di Bogor. Cuci komplit mulai Rp 7.000/kg. Antar jemput gratis, garansi bersih, proses cepat. Hubungi 081316790080." />
                <meta name="keywords" content="laundry bogor, laundry kiloan, cuci setrika, antar jemput laundry, laundry murah bogor" />
                <meta name="theme-color" content="#0ea5e9" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" type="image/png" href="/favicon.png" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Maulana Laundry | Jasa Laundry Premium Bogor" />
                <meta property="og:description" content="Layanan laundry terpercaya di Bogor. Antar jemput gratis, harga terjangkau, kualitas premium." />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
            </Helmet>

            <Navbar />
            <Hero />
            <Services />
            <Features />
            <Contact />
            <Footer />
            <FloatingWA />
        </div>
    );
};

export default LandingPage;
