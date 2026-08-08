import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronDown, Clock } from 'lucide-react';
import Navbar from '../components/site/Navbar';
import Footer from '../components/site/Footer';
import ServiceOrderSummary from '../components/site/ServiceOrderSummary';
import api from '../lib/api';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [relatedPortfolios, setRelatedPortfolios] = useState([]);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop'
  ];

  // Paksa layar kembali ke paling atas secara instant setiap kali slug atau halaman berubah
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    fetchServiceAndData();
  }, [slug]);

  const fetchServiceAndData = async () => {
    setLoading(true);
    try {
      const resServices = await api.get('/services');
      const allServices = resServices.data || [];

      const currentService = allServices.find(
        (s) => (s.slug || s.id || s._id) === slug || (s.title && s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
      ) || allServices[0];

      setService(currentService);

      if (currentService) {
        setRelatedServices(
          allServices.filter((s) => (s.id || s._id || s.slug) !== (currentService.id || currentService._id || currentService.slug)).slice(0, 3)
        );
      }

      const resPortfolios = await api.get('/portfolios');
      const allPortfolios = resPortfolios.data || [];

      if (currentService?.category) {
        const filtered = allPortfolios.filter(
          (p) => p.category?.toLowerCase() === currentService.category?.toLowerCase()
        );
        setRelatedPortfolios(filtered.length > 0 ? filtered : allPortfolios.slice(0, 2));
      } else {
        setRelatedPortfolios(allPortfolios.slice(0, 2));
      }

    } catch (err) {
      console.error('Failed to fetch data from CMS:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D10] text-white flex items-center justify-center">
        <p className="text-gray-400">Memuat data dari CMS database...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#080D10] text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Layanan tidak ditemukan</h2>
        <Link to="/" className="text-emerald-400 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const getStartingPrice = (item) => {
    if (item.starting_price && item.starting_price > 0) return item.starting_price;
    if (item.price && item.price > 0) return item.price;
    
    if (item.packages) {
      if (typeof item.packages === 'object' && !Array.isArray(item.packages)) {
        if (item.packages.starter?.price) return item.packages.starter.price;
        if (item.packages.basic?.price) return item.packages.basic.price;
      }
      if (Array.isArray(item.packages) && item.packages.length > 0) {
        const prices = item.packages.map(p => p.price).filter(p => p > 0);
        if (prices.length > 0) return Math.min(...prices);
      }
    }
    return 75000;
  };

  const getValidImage = (item, index = 0) => {
    const imgUrl = item?.cover_image || item?.image || item?.thumbnail || item?.cover;
    if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() !== '' && !imgUrl.includes('Netflix') && !imgUrl.startsWith('/Logo')) {
      return imgUrl;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const priceValue = getStartingPrice(service);
  const coverImage = getValidImage(service, 0);
  const deliveryTime = service.delivery_days || service.duration || service.packages?.starter?.delivery_time || '2-4 hari';

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#080D10] text-white selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7 space-y-6">
              <Link to="/#services" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Semua Layanan
              </Link>
              
              <div className="space-y-3">
                <span className="inline-block text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                  {service.category || 'LOGO'}
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                  {service.title}
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-8 pt-2 border-t border-white/10">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">MULAI DARI</p>
                  <p className="text-2xl font-bold text-white">{formatRupiah(priceValue)}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Image */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0D0E12] aspect-[4/3] relative">
                <img
                  src={coverImage}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = fallbackImages[0]; }}
                />
              </div>
            </div>
          </div>

          {/* Details & Order Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-16">
              
              {/* Tentang Layanan */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Tentang Layanan</h2>
                <p className="text-gray-400 leading-relaxed">
                  {service.full_description || service.description}
                </p>
              </div>

              {/* Kenapa ini penting */}
              {service.benefits && service.benefits.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Kenapa ini penting?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0D0E12] border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cara Kerjanya */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Cara kerjanya</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(service.process_steps || [
                    { step: '01', title: 'Konsultasi', desc: 'Kita diskusikan kebutuhan & tujuan produkmu.' },
                    { step: '02', title: 'Riset', desc: 'Kami pelajari brand dan kompetitormu.' },
                    { step: '03', title: 'Desain', desc: 'Tim mengerjakan konsep terbaik untukmu.' },
                    { step: '04', title: 'Revisi & Kirim', desc: 'Kami sempurnakan lalu kirim file final.' }
                  ]).map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <span className="text-2xl font-serif text-gray-600 font-bold">{item.step || `0${idx + 1}`}</span>
                      <h4 className="font-bold text-white text-base">{item.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION KARYA TERKAIT */}
              {relatedPortfolios.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Karya terkait</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPortfolios.map((item, idx) => (
                      <div key={item.id || item._id} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-[#0D0E12]">
                        <img 
                          src={getValidImage(item, idx)} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          onError={(e) => { e.target.src = fallbackImages[idx % fallbackImages.length]; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                          <div>
                            <span className="text-[10px] text-emerald-400 font-semibold uppercase block">{item.category}</span>
                            <span className="font-medium text-white text-sm">{item.title}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Pertanyaan seputar {service.title}</h2>
                  <div className="space-y-3">
                    {service.faqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-white/10 pb-3">
                        <button
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="w-full flex justify-between items-center text-left py-2 font-medium text-gray-200 hover:text-white"
                        >
                          <span>{faq.q || faq.question}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === idx && (
                          <p className="text-sm text-gray-400 pt-2 pb-1 leading-relaxed">{faq.a || faq.answer}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar Sticky */}
            <div className="lg:col-span-5 sticky top-28">
              <ServiceOrderSummary service={service} />
            </div>
          </div>

          {/* Layanan Lainnya */}
          {relatedServices.length > 0 && (
            <div className="mt-24 pt-16 border-t border-white/10 space-y-8">
              <h2 className="text-3xl font-bold text-white">Layanan lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedServices.map((rel, idx) => (
                  <Link 
                    key={rel.id || rel._id || rel.slug} 
                    to={`/services/${rel.slug || rel.id}`} 
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                    className="group p-5 rounded-2xl bg-[#0D0E12] border border-white/10 hover:border-emerald-500/50 transition-all"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black/40">
                      <img 
                        src={getValidImage(rel, idx)} 
                        alt={rel.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = fallbackImages[idx % fallbackImages.length]; }}
                      />
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold uppercase">{rel.category}</span>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">{rel.title}</h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{rel.description}</p>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                      <span>MULAI DARI <strong className="text-white block text-sm">{formatRupiah(getStartingPrice(rel))}</strong></span>
                      <span>{rel.delivery_days || rel.duration || '2-4 hari'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
