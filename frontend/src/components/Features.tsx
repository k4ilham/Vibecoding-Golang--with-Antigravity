import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const Features = () => {
    const features = [
        {
            title: 'Antar Jemput Gratis',
            description: 'Minimal 5kg dalam radius 3km dari toko'
        },
        {
            title: 'Detergen Berkualitas',
            description: 'Menggunakan detergen premium yang aman untuk kulit'
        },
        {
            title: 'Pewangi Tahan Lama',
            description: 'Pakaian wangi hingga 7 hari'
        },
        {
            title: 'Garansi Bersih',
            description: 'Jika tidak puas, kami cuci ulang gratis'
        },
        {
            title: 'Proses Cepat',
            description: 'Selesai 2-3 hari kerja, express 24 jam'
        },
        {
            title: 'Harga Terjangkau',
            description: 'Kualitas premium dengan harga bersahabat'
        }
    ];

    return (
        <section id="tentang" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                        Kenapa Pilih Kami?
                    </h2>
                    <p className="text-xl text-blue-600 max-w-2xl mx-auto">
                        Kepuasan pelanggan adalah prioritas utama kami
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-4 p-6 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="text-xl font-bold text-blue-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
