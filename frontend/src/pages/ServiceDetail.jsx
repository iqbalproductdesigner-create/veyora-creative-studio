import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import Navbar from '../components/site/Navbar';
import Footer from '../components/site/Footer';
import ServiceOrderSummary from '../components/site/ServiceOrderSummary';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { services, loading } = useContent();

  const defaultServices = [
    {
      id: 's1',
      slug: 'brand-identity-logo',
      title: 'Brand Identity & Logo',
      description: 'Membangun identitas visual yang kuat, unik, dan berkesan untuk membedakan brand kamu dari kompetitor.',
      cover_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
      starting_price: 1500000,
      delivery_days: '3-5 hari',
      features: ['2 Opsi Konsep Logo', 'Master File (AI, EPS, PNG, SVG)', 'Brand Color & Typography Guidelines'],
      category: 'Branding'
    },
    {
      id: 's2',
      slug: 'packaging-design',
      title: 'Packaging Design',
      description: 'Desain kemasan produk yang memikat mata di rak jualan dan meningkatkan nilai jual serta kepercayaan konsumen.',
      cover_image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
      starting_price: 2000000,
      delivery_days: '4-7 hari',
      features: ['Desain Dieline/Pola Cetak', 'Visualisai 3D Mockup Realistis', 'File Siap Cetak (CMYK)'],
      category: 'Packaging'
    },
    {
      id: 's3',
      slug: 'visual-social-content',
      title: 'Visual & Social Content',
      description: 'Visual promosi yang konsisten dan profesional untuk kebutuhan media sosial, marketplace, dan pemasaran digital.',
      cover_image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
      starting_price: 1000000,
      delivery_days: '2-4 hari',
      features: ['9 Feeds Instagram Grid Design', 'Template Feed Canva & PSD', 'Cover Highlight & Story Kit'],
      category: 'Digital Content'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const allServices = (services && services.length > 0) ? services : defaultServices;
  
  // Logika pencarian cerdas berdasarkan slug, id, atau title match
  const service = allServices.find((s) => {
    const itemSlug = s.slug || s.id || s._id || (s.title && s.title.toLowerCase().replace(/[^a-z0-0]+/g, '-'));
    return itemSlug === slug || s.id === slug || s._id === slug;
  }) || defaultServices.find((ds) => ds.slug === slug || ds.id === slug) || defaultServices[0];

  if (loading && !service) {
    return (
      <div className="min-h-screen bg-[#080D10] text-white flex items-center justify-center">
        <p className="text-gray-400">Memuat detail layanan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D10] text-white selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <span>/</span>
            <Link to="/#services" className="hover:text-white transition-colors">Layanan</Link>
            <span>/</span>
            <span className="text-emerald-400 font-medium">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <span className="inline-block text-xs font-semibold tracking-wider text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/10">
                  {service.category || 'Layanan Studio'}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  {service.title}
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {(service.cover_image || service.image) && (
                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative">
                  <img
                    src={service.cover_image || service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Scope of Work / Features List */}
              {service.features && service.features.length > 0 && (
                <div className="bg-[#0D0E12] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl font-bold text-white">Apa yang Anda Dapatkan:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar / Order Summary Widget */}
            <div className="lg:col-span-1 sticky top-28">
              <ServiceOrderSummary service={service} />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
