export const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Maulana Laundry</h3>
                        <p className="text-blue-200">
                            Solusi laundry terpercaya di Bogor dengan layanan berkualitas dan harga terjangkau.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Menu</h4>
                        <ul className="space-y-2 text-blue-200">
                            <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
                            <li><a href="#layanan" className="hover:text-white transition-colors">Layanan</a></li>
                            <li><a href="#tentang" className="hover:text-white transition-colors">Tentang</a></li>
                            <li><a href="#kontak" className="hover:text-white transition-colors">Kontak</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Jam Operasional</h4>
                        <ul className="space-y-2 text-blue-200">
                            <li>Senin - Jumat: 08:00 - 20:00</li>
                            <li>Sabtu: 08:00 - 18:00</li>
                            <li>Minggu: Tutup</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-blue-800 pt-8 text-center text-blue-200">
                    <p>&copy; 2024 Maulana Laundry. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
