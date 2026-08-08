import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function PortfolioSection() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  const categories = ['Semua', 'Packaging', 'Marketplace', 'Logo', 'Sticker', 'Social Media'];

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const res = await api.get('/portfolios');
      setPortfolios(res.data || []);
    } catch (err) {
      console.error('Failed to fetch portfolios from CMS:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios = selectedCategory === 'Semua'
    ? portfolios
    : portfolios.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="portfolio" className="py-24 bg-[#080D10] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-semibold tracking-wider text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/10 uppercase">
            Hasil Karya Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Portofolio Terpilih
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Kumpulan proyek desain terbaik yang telah kami kerjakan untuk membantu perkembangan brand klien.
          </p>
        </div>

        {/* Filter Tab Kategori */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-[#0D0E12] text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Portfolio dari Database CMS */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat karya dari database...</div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada karya untuk kategori ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((item) => (
              <div
                key={item.id || item._id}
                className="group rounded-2xl bg-[#0D0E12] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-black/40">
                  <img
                    src={item.image || item.cover_image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-black/80 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  {item.client && (
                    <div className="pt-3 border-t border-white/5 text-[11px] text-gray-500">
                      Klien: <span className="text-gray-300">{item.client}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
