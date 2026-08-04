import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink } from "lucide-react";

export default function PortfolioDrawer({ item, open, onOpenChange }) {
  if (!item) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {/* Container utama Drawer dengan batas tinggi dan scroll independen */}
      <DrawerContent className="max-h-[85vh] md:max-h-[90vh] flex flex-col focus:outline-none">
        
        {/* Top Header Fixed (Tombol Close & Kategori) */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b shrink-0">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">
            {item.category || "Portfolio Detail"}
          </Badge>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
        </div>

        {/* Scrollable Area: Bagian ini yang membuat konten bisa di-scroll */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6">
          
          {/* Judul & Deskripsi Singkat */}
          <div className="space-y-1.5">
            <DrawerTitle className="text-xl md:text-3xl font-bold">
              {item.title}
            </DrawerTitle>
            <DrawerDescription className="text-sm md:text-base text-muted-foreground">
              {item.shortDescription || item.description}
            </DrawerDescription>
          </div>

          {/* Layout Split: Media di Kiri, Informasi Detail di Kanan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Sisi Kiri (Gambar Utama & Gambar Tambahan) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl overflow-hidden border bg-muted/20">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Jika ada gambar galeri tambahan */}
              {item.gallery && item.gallery.map((imgUrl, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border bg-muted/20">
                  <img 
                    src={imgUrl} 
                    alt={`${item.title} preview ${idx + 1}`} 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              ))}
            </div>

            {/* Sisi Kanan (Informasi Layanan & Detail Project) */}
            <div className="space-y-6">
              
              {/* Card Meta Klien & Scope Work */}
              <div className="bg-muted/40 p-4 md:p-5 rounded-xl border space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Klien / Kategori
                  </h4>
                  <p className="font-medium text-sm">
                    {item.client || "UMKM & Business Partner"}
                  </p>
                </div>
                
                {item.deliverables && item.deliverables.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                      Layanan yang Dikerjakan
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.deliverables.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tantangan & Solusi */}
              {item.details && (
                <div className="space-y-4">
                  {item.details.challenge && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Tantangan Klien</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.details.challenge}
                      </p>
                    </div>
                  )}
                  {item.details.solution && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Solusi Kreatif Veyora</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.details.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tombol Aksi / Preview Website */}
              {item.link && (
                <Button className="w-full flex items-center justify-center gap-2" asChild>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <span>Lihat Hasil / Live Preview</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}

            </div>

          </div>
        </div>

      </DrawerContent>
    </Drawer>
  );
}