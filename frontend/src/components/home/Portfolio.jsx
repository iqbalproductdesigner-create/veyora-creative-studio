import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';

export default function Portfolio() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Carousel Main Section
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  // State untuk Drawer Detail
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop'
  ];

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.get('/portfolio');
      } catch (e) {
        res = await api.get('/portfolios');
      }

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPortfolios(res.data);
        return;
      }

      const raw = await fetch('http://localhost:8000/api/portfolio');
      if (raw.ok) {
        const rawData = await raw.json();
        setPortfolios(rawData);
      }
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigasi Slider Carousel Utama
  const handleNextSlide = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  const handlePrevSlide = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const totalSlides = portfolios.length;
      const index = Math.round((scrollLeft / (scrollWidth - clientWidth)) * (totalSlides - 1));
      setActiveSlide(isNaN(index) ? 0 : index);
    }
  };

  const openDrawer = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  const getItemImages = (item) => {
    if (!item) return fallbackImages;
    let imgs = [];
    if (Array.isArray(item.images) && item.images.length > 0) {
      imgs = item.images;
    } else {
      const cover = item.cover_image || item.image || item.thumbnail;
      if (cover) imgs.push(cover);
    }
    return imgs.length > 0 ? imgs : fallbackImages;
  };

  const handlePesanProyek = () => {
    if (!selectedItem) return;
    
    let targetServiceSlug = selectedItem.related_service;
    if (Array.isArray(selectedItem.related_services) && selectedItem.related_services.length > 0) {
      targetServiceSlug = selectedItem.related_services[0];
    }

    closeDrawer();

    if (targetServiceSlug) {
      navigate(`/services/${targetServiceSlug}`);
    } else {
      const cat = (selectedItem.category || '').toLowerCase();
      if (cat.includes('packaging')) navigate('/services/packaging-design');
      else if (cat.includes('logo')) navigate('/services/logo-design');
      else if (cat.includes('sticker')) navigate('/services/sticker-label-design');
      else if (cat.includes('landing') || cat.includes('website')) navigate('/services/landing-page-design');
      else if (cat.includes('marketplace')) navigate('/services/marketplace-design');
      else navigate('/#services');
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-[#080D10] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section dengan Control Trigger Arrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4 max-w-2xl">
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

          {/* Navigasi Arrow Button */}
          {!loading && portfolios.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevSlide}
                className="p-3 rounded-full bg-[#14181D] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500 hover:text-black transition-all duration-300 text-white shadow-lg"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="p-3 rounded-full bg-[#14181D] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500 hover:text-black transition-all duration-300 text-white shadow-lg"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Carousel Container */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Memuat karya dari database...</div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Belum ada data karya di database.</div>
        ) : (
          <div className="space-y-8">
            {/* Horizontal Scrollable Slider */}
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {portfolios.map((item, idx) => {
                const images = getItemImages(item);
                const coverImg = images[0];

                return (
                  <div
                    key={item.id || item._id || idx}
                    onClick={() => openDrawer(item)}
                    className="min-w-[300px] sm:min-w-[380px] lg:min-w-[420px] snap-start group relative rounded-2xl bg-[#0D0E12] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Image & Overlay */}
                    <div className="aspect-[4/3] overflow-hidden relative bg-black/40">
                      <img
                        src={coverImg}
                        alt={item.project_name || item.title}
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
                        <span className="inline-block text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                          {item.category || 'Branding & Graphics'}
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {item.project_name || item.title || 'Proyek Veyora'}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {item.description || item.overview || 'Deskripsi hasil karya proyek Veyora Creative Studio.'}
                        </p>
                      </div>

                      {/* Footer Card */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                        <span>{item.client_name || item.client || 'Klien Veyora'}</span>
                        <span className="inline-flex items-center gap-1 font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">
                          Detail <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stepper / Progress Dot Indicator Main Carousel */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {portfolios.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (sliderRef.current) {
                      const total = portfolios.length;
                      const scrollTarget = (sliderRef.current.scrollWidth / total) * i;
                      sliderRef.current.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeSlide
                      ? 'w-8 bg-emerald-400 shadow-lg shadow-emerald-500/30'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Slide-over Drawer Modal Detail Portfolio */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay Blur */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-[#0F1115] border-l border-white/10 text-white flex flex-col justify-between shadow-2xl relative z-10">
              
              {/* Tombol Close Top Right */}
              <button
                onClick={closeDrawer}
                className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black p-2 rounded-full text-gray-300 hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Container Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Image Gallery Slider Drawer */}
                {(() => {
                  const imgs = getItemImages(selectedItem);
                  return (
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/10 group">
                      <img
                        src={imgs[currentImageIndex]}
                        alt="Portfolio Gallery"
                        className="w-full h-full object-cover transition-all duration-300"
                      />

                      {/* Tombol Panah Prev & Next (Gaya Lingkaran Gelap Sesuai Screenshot) */}
                      {imgs.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? imgs.length - 1 : prev - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 transition-all"
                            aria-label="Previous Image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev === imgs.length - 1 ? 0 : prev + 1))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 transition-all"
                            aria-label="Next Image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Pill Progress Bar Capsule Melayang (Sama Persis dengan Screenshot) */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            {imgs.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  i === currentImageIndex 
                                    ? 'w-6 bg-white' 
                                    : 'w-2 bg-white/40 hover:bg-white/60'
                                }`}
                                aria-label={`View image ${i + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

                {/* Body Details */}
                <div className="space-y-5">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      {selectedItem.category || 'WEBSITE & DIGITAL ADS'}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {selectedItem.project_name || selectedItem.title}
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">
                      {selectedItem.description || selectedItem.overview}
                    </p>
                  </div>

                  {/* Tantangan */}
                  {selectedItem.challenge && (
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        TANTANGAN
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {selectedItem.challenge}
                      </p>
                    </div>
                  )}

                  {/* Solusi */}
                  {selectedItem.solution && (
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        SOLUSI
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {selectedItem.solution}
                      </p>
                    </div>
                  )}

                  {/* Deliverables */}
                  {Array.isArray(selectedItem.deliverables) && selectedItem.deliverables.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        DELIVERABLES
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedItem.deliverables.map((item, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>

              {/* Sticky CTA Bottom Drawer (Gaya Tombol Sesuai Screenshot) */}
              <div className="p-4 border-t border-white/10 bg-[#0F1115]">
                <button
                  onClick={handlePesanProyek}
                  className="w-full bg-[#272B33] hover:bg-emerald-500 hover:text-black text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
                >
                  Pesan Proyek Serupa <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
