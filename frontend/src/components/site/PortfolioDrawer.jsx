import React from 'react';
import {
  Drawer,
  DrawerContent,
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
      {/* Drawer content dengan max-height & overflow aman */}
      <DrawerContent className="max-h-[85vh] md:max-h-[90vh] flex flex-col focus:outline-none bg-background border-t">
        
        {/* Header Fixed atas */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b shrink-0">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">
            {item.category || item.category_name || "Portfolio Detail"}
          </Badge>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
        </div>

        {/* Scrollable Area - Tempat seluruh isi drawer di-scroll */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6">
          
          {/* Judul & Deskripsi */}
          <div className="space-y-1.5">
            <DrawerTitle className="text-xl md:text-3xl font-bold">
              {item.title}
            </DrawerTitle>
            <DrawerDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {item.description || item.shortDescription || "Detail pengerjaan projek Veyora Creative Studio."}
            </DrawerDescription>
          </div>

          {/* Grid Layout Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Sisi Kiri (Gambar Utama & Galeri) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl overflow-hidden border bg-muted/20">
                <img
                  src={item.image || item.image_url}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {item.gallery && Array.isArray(item.gallery) && item.gallery.map((imgUrl, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border bg-muted/20">
                  <img src={imgUrl} alt={`${item.title} preview ${idx + 1}`} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>

            {/* Sisi Kanan (Detail Sidebar Info & CTA) */}
            <div className="space-y-6">
              <div className="bg-muted/40 p-4 md:p-5 rounded-xl border space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Klien / Kategori
                  </h4>
                  <p className="font-medium text-sm">
                    {item.client || "UMKM / Partner Bisnis"}
                  </p>
                </div>
                
                {item.deliverables && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                      Layanan Dikerjakan
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(item.deliverables) ? (
                        item.deliverables.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="text-xs">{item.deliverables}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Rincian Tantangan & Solusi jika ada */}
              {item.details && (
                <div className="space-y-3 text-sm">
                  {item.details.challenge && (
                    <div>
                      <h4 className="font-semibold mb-1">Tantangan</h4>
                      <p className="text-muted-foreground">{item.details.challenge}</p>
                    </div>
                  )}
                  {item.details.solution && (
                    <div>
                      <h4 className="font-semibold mb-1">Solusi Veyora</h4>
                      <p className="text-muted-foreground">{item.details.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tombol Preview Link */}
              {(item.link || item.project_url) && (
                <Button className="w-full flex items-center justify-center gap-2" asChild>
                  <a href={item.link || item.project_url} target="_blank" rel="noopener noreferrer">
                    <span>Lihat Live Preview</span>
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