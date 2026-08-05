import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowUpRight } from "lucide-react";

export default function PortfolioDrawer({ item, open, onOpenChange }) {
  // Matikan scroll pada halaman utama saat drawer terbuka
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
      
      {/* Backdrop Hitam Transparan */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => onOpenChange(false)} 
      />

      {/* Side Drawer Container (Slide dari Kanan ke Kiri) */}
      <div className="relative z-10 w-full max-w-md md:max-w-lg h-full bg-background border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Floating Close Button */}
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-4 right-4 z-20 rounded-full h-9 w-9 bg-black/60 hover:bg-black/90 text-white backdrop-blur border border-white/10"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Scrollable Drawer Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Cover / Main Image */}
          <div className="relative aspect-video w-full bg-muted/30 overflow-hidden border-b border-border">
            <img
              src={item.image || item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body Detail Content */}
          <div className="p-6 space-y-6">
            
            {/* Category & Title */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {item.category || item.category_name || "Project Detail"}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {item.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description || item.shortDescription}
              </p>
            </div>

            {/* Tantangan Section */}
            {item.details?.challenge && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  TANTANGAN
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {item.details.challenge}
                </p>
              </div>
            )}

            {/* Solusi Section */}
            {item.details?.solution && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  SOLUSI
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {item.details.solution}
                </p>
              </div>
            )}

            {/* Deliverables / Scope Work */}
            {item.deliverables && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  DELIVERABLES
                </h4>
                <ul className="space-y-2 text-sm text-foreground/90">
                  {Array.isArray(item.deliverables) ? (
                    item.deliverables.map((deliv, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{deliv}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{item.deliverables}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Gallery / Extra Images */}
            {item.gallery && Array.isArray(item.gallery) && item.gallery.map((imgUrl, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-border">
                <img src={imgUrl} alt={`${item.title} ${idx + 1}`} className="w-full h-auto object-cover" />
              </div>
            ))}

          </div>
        </div>

        {/* Sticky CTA Bottom Bar */}
        <div className="p-4 border-t border-border bg-background/95 backdrop-blur shrink-0">
          <Button 
            className="w-full rounded-full py-6 text-base font-semibold gap-2 shadow-lg" 
            asChild
          >
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Halo Veyora, saya tertarik membuat proyek serupa seperti: ${item.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Pesan Proyek Serupa</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </Button>
        </div>

      </div>
    </div>
  );
}