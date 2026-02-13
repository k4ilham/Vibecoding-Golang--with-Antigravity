import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact = () => {
    const contactInfo = [
        {
            icon: MapPin,
            title: 'Alamat',
            content: 'Jl. Raya Bogor No. 123, Kota Bogor, Jawa Barat'
        },
        {
            icon: Phone,
            title: 'Telepon',
            content: '+62 813-1679-0080'
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'info@maulana-laundry.com'
        },
        {
            icon: Clock,
            title: 'Jam Operasional',
            content: 'Senin - Sabtu: 08:00 - 20:00'
        }
    ];

    return (
        <section id="kontak" className="py-20 bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                        Hubungi Kami
                    </h2>
                    <p className="text-xl text-blue-600 max-w-2xl mx-auto">
                        Siap melayani kebutuhan laundry Anda
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={info.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-shadow"
                        >
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <info.icon className="text-primary" size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-blue-900 mb-2">{info.title}</h3>
                            <p className="text-gray-600">{info.content}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open('https://wa.me/6281316790080', '_blank')}
                        className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-2"
                    >
                        <Phone size={24} />
                        <span>Chat WhatsApp Sekarang</span>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};
