import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroImg from '../assets/hero.png';

export const Hero = () => {
    return (
        <section id="beranda" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img src={heroImg} alt="Laundry background" className="w-full h-full object-cover opacity-15" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/50 to-blue-100/90" />
            </div>

            <div className="container mx-auto px-4 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <span className="inline-block bg-blue-100 text-primary px-6 py-2 rounded-full text-sm font-semibold mb-6">
                        ✨ Laundry Terpercaya di Bogor
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-blue-900 mb-6 leading-tight"
                >
                    Maulana <span className="text-primary">Laundry</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-blue-600 mb-4 max-w-3xl mx-auto"
                >
                    Layanan Laundry Premium di Bogor
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
                >
                    Bersih, Wangi, Rapi. Antar Jemput Gratis. Garansi Kepuasan 100%
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open('https://wa.me/6281316790080', '_blank')}
                        className="bg-primary text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all inline-flex items-center space-x-2 group"
                    >
                        <span>Pesan Sekarang</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </motion.button>

                    <motion.a
                        href="#layanan"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border-2 border-primary text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-primary hover:text-white transition-all"
                    >
                        Lihat Layanan
                    </motion.a>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20"
                >
                    {[
                        { number: '1000+', label: 'Pelanggan Puas' },
                        { number: '5000+', label: 'Kg Terlayani' },
                        { number: '4.9/5', label: 'Rating' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.number}</div>
                            <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                />
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        x: [0, 15, 0]
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute top-1/2 left-1/2 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                />
            </div>
        </section>
    );
};
