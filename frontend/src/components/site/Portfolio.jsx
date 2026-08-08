import React, { useEffect, useState } from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';
import api from '../../lib/api';

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop'
  ];

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

  const getValidImage = (item, idx) => {
    const img = item?.image || item?.cover_image || item?.thumbnail;
    if (img && typeof img === 'string' && img.trim() !== '') return img;
    return fallbackImages[idx % fallbackImages.length];
  };

  return (
    <section id="portfolio" className="py-24 bg-[#080D10] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold tracking-wider text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/10 uppercase">
            PORTOFOLIO & HASIL KARYA
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Project yang Pernah Kami Bantu
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Dari desain kebutuhan dasar bisnis hingga website yang siap menaikkan kelas usaha kamu.
          </p>
        </div>

        {/* Dynamic Grid dari Database CMS */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat karya dari database...</div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada data karya di database.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((item, idx) => (
              <div
                key={item.id || item._id || idx}
                className="group relative rounded-2xl bg-[#0D0E12] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Overlay */}
                <div className="aspect-[4/3] overflow-hidden relative bg-black/40">
                  <img
                    src={getValidImage(item, idx)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = fallbackImages[idx % fallbackImages.length]; }}
                  />
                  
                  {/* Hover Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-4 h-4" /> Lihat Detail
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] font-semibold tracking-wider text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                      {item.category || 'Branding & Graphics'}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Card */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>{item.client || 'Klien Veyora'}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">
                      Detail <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
