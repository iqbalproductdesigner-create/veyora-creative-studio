import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export default function PortfolioDrawer({ item, open, onOpenChange }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Kumpulkan list gambar (Image utama + gallery)
  const images = React.useMemo(() => {
    if (!item) return [];
    if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
      return item.gallery;
    }
    return [item.image || item.image_url].filter(Boolean);
  }, [item]);

  // Reset index gambar ketika item berubah
  useEffect(() => {
    setActiveImageIndex(0);
  }, [item]);

  // Lock Body Scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open || !item) return null;

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Tentukan link halaman detail service sesuai kategori
  const serviceDetailLink = item.serviceSlug 
    ? `/services/${item.serviceSlug}` 
    : `/services#${(item.category || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
      
      {/* Backdrop Dark Transparan */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => onOpenChange(false)} 
      />

      {/* Side Drawer Container - Full Dark Theme */}
      <div className="relative z-10 w-full max-w-md md:max-w-lg h-full bg-[#0D1117] text-white border-l border-zinc-800/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Top Close Button */}
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-4 right-4 z-30 rounded-full h-8 w-8 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 backdrop-blur"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          
          {/* Image Slider / Carousel Section */}
          <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
            {images.length > 0 && (
              <img
                src={images[activeImageIndex]}
                alt={`${item.title} slide ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}

            {/* Toggle Panah (Kiri & Kanan) jika ada lebih dari 1 gambar */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur border border-white/10 transition-all"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur border border-white/10 transition-all"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIndex === idx ? "w-5 bg-white" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content Description & Meta */}
          <div className="p-6 space-y-6">
            
            {/* Category & Title */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {item.category || item.category_name || "Project Detail"}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                {item.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {item.description || item.shortDescription}
              </p>
            </div>

            {/* Tantangan */}
            {item.details?.challenge && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  TANTANGAN
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {item.details.challenge}
                </p>
              </div>
            )}

            {/* Solusi */}
            {item.details?.solution && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  SOLUSI
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {item.details.solution}
                </p>
              </div>
            )}

            {/* Deliverables */}
            {item.deliverables && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  DELIVERABLES
                </h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {Array.isArray(item.deliverables) ? (
                    item.deliverables.map((deliv, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{deliv}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item.deliverables}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Sticky CTA Bottom Bar -> Redirects to Detail Service Page */}
        <div className="p-4 border-t border-zinc-800 bg-[#0D1117] shrink-0">
          <Button 
            className="w-full rounded-full py-6 text-sm md:text-base font-semibold gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-all shadow-lg" 
            asChild
          >
            <a href={serviceDetailLink}>
              <span>Pesan Proyek Serupa</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </div>

      </div>
    </div>
  );
}