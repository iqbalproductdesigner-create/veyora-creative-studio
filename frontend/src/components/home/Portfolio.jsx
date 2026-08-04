import React, { useState } from 'react';
import PortfolioDrawer from '../site/PortfolioDrawer';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";

export default function Portfolio({ portfolioItems = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Data dummy fallback jika data dari API/Context belum dimuat
  const defaultItems = [
    {
      id: 1,
      title: "Brand & Packaging Stiker UMKM Kopi",
      category: "Branding & Graphics",
      description: "Pengembangan desain kemasan stiker dan identitas visual yang siap cetak untuk produk kopi lokal agar lebih menarik di pasaran.",
      client: "Kopi Lokal UMKM",
      deliverables: ["Desain Stiker", "Logo Refresh", "Social Media Template"],
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop",
      details: {
        challenge: "Kemasan lama kurang menonjol di rak toko dan belum memiliki identitas merek yang kuat.",
        solution: "Membuat desain stiker modern dengan kontras tinggi dan informasi produk yang ringkas serta mudah dibaca."
      }
    },
    {
      id: 2,
      title: "Landing Page Elevate Bisnis F&B",
      category: "Website & Digital Ads",
      description: "Pembuatan website landing page 1 halaman yang cepat, responsif, dan siap dihubungkan ke Meta Ads untuk meningkatkan penjualan.",
      client: "Resto & Catering Kit",
      deliverables: ["Landing Page UI/UX", "Responsive Web", "WhatsApp Order Direct"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      details: {
        challenge: "Pelanggan sering bingung melihat menu di pesan terpisah dan proses pemesanan lambat.",
        solution: "Mendesain katalog interaktif ringkas yang langsung menghubungkan pilihan pesanan ke WhatsApp admin."
      }
    }
  ];

  const itemsToDisplay = portfolioItems && portfolioItems.length > 0 ? portfolioItems : defaultItems;

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-wider">
            Portofolio & Hasil Karya
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Project yang Pernah Kami Bantu
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Dari desain kebutuhan dasar bisnis hingga website yang siap menaikkan kelas usaha kamu.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {itemsToDisplay.map((item) => (
            <div
              key={item.id || item.title}
              onClick={() => handleOpenDetail(item)}
              className="group cursor-pointer rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={item.image || item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                      <Eye className="w-4 h-4" />
                      <span>Lihat Detail</span>
                    </Button>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-5 space-y-2">
                  <Badge variant="outline" className="text-[11px] font-medium">
                    {item.category || item.category_name || "Project"}
                  </Badge>
                  <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
                    {item.description || item.shortDescription}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-2 border-t mt-auto flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.client || "Veyora Client"}</span>
                <span className="font-semibold text-primary flex items-center gap-1 group-hover:underline">
                  Detail <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Pop-up Drawer */}
      <PortfolioDrawer
        item={selectedItem}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </section>
  );
}