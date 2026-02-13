import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FloatingWA = () => {
    return (
        <motion.a
            href="https://wa.me/6281316790080"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Chat WhatsApp"
        >
            <MessageCircle size={28} />
        </motion.a>
    );
};
