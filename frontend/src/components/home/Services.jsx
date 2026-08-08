import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import api from '../../lib/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      if (res.data && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLowestPrice = (service) => {
    if (service.starting_price) return service.starting_price;
    if (Array.isArray(service.pricing) && service.pricing.length > 0) {
      const prices = service.pricing.map(p => typeof p.price === 'number' ? p.price : parseInt(String(p.price).replace(/\D/g, '')) || 0);
      const min = Math.min(...prices.filter(p => p > 0));
      if (min && min !== Infinity) return `Rp ${min.toLocaleString('id-ID')}`;
    }
    return 'Hubungi Kami';
  };

  return (
    <section id="services" className="py-24 bg-[#080D10] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-wider text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/10 uppercase">
              LAYANAN KAMI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Semua yang dibutuhkan brand Anda
            </h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">
            Dari kemasan hingga konten digital, kami siapkan semuanya dalam satu tempat yang rapi dan terjangkau.
          </p>
        </div>

        {/* Dynamic Grid Services */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat layanan dari database...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada data layanan di database.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Link
                key={service.id || service._id || idx}
                to={`/services/${service.slug}`}
                className="group relative rounded-2xl bg-[#0D0E12] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between p-6"
              >
                {/* Image / Banner Thumbnail */}
                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-black/40 relative">
                  {service.cover_image || service.image || service.og_image ? (
                    <img
                      src={service.cover_image || service.image || service.og_image}
                      alt={service.title || service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-950/40 to-black flex items-center justify-center p-4">
                      <span className="text-xs font-semibold text-emerald-400/60 uppercase tracking-widest">
                        VEYORA STUDIO
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Title */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {service.title || service.name}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2 line-clamp-2">
                      {service.short_description || service.description || 'Layanan profesional dari Veyora Creative Studio.'}
                    </p>
                  </div>

                  {/* Pricing Footer */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 mt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 block">MULAI DARI</span>
                      <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {getLowestPrice(service)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{service.duration || '3 - 7 Hari'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
