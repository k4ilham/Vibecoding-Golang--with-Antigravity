import { motion } from 'framer-motion';
import { Sparkles, Clock, Truck, Shield } from 'lucide-react';

export const Services = () => {
    const services = [
        {
            icon: Sparkles,
            title: 'Cuci Komplit',
            description: 'Cuci + Setrika + Wangi + Rapi',
            price: 'Rp 7.000/kg',
            features: ['Detergen Premium', 'Pewangi Tahan Lama', 'Setrika Rapi']
        },
        {
            icon: Clock,
            title: 'Cuci Kering',
            description: 'Cuci + Kering Tanpa Setrika',
            price: 'Rp 5.000/kg',
            features: ['Proses Cepat', 'Hemat Biaya', 'Kering Sempurna']
        },
        {
            icon: Truck,
            title: 'Cuci Satuan',
            description: 'Sprei, Selimut, Boneka',
            price: 'Mulai Rp 15.000',
            features: ['Bedcover Queen', 'Selimut Tebal', 'Boneka Besar']
        },
        {
            icon: Shield,
            title: 'Express 1 Hari',
            description: 'Selesai Dalam 24 Jam',
            price: '+Rp 3.000/kg',
            features: ['Prioritas Utama', 'Garansi Tepat Waktu', 'Kualitas Terjaga']
        }
    ];

    return (
        <section id="layanan" className="py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                        Layanan Kami
                    </h2>
                    <p className="text-xl text-blue-600 max-w-2xl mx-auto">
                        Berbagai pilihan layanan laundry untuk kebutuhan Anda
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-primary hover:shadow-2xl transition-all"
                        >
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <service.icon className="text-primary" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-2">{service.title}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="text-3xl font-bold text-primary mb-4">{service.price}</div>
                            <ul className="space-y-2">
                                {service.features.map((feature) => (
                                    <li key={feature} className="flex items-center text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
