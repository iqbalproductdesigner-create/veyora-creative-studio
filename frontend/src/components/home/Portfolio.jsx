import React, { useState } from 'react';
import PortfolioDrawer from '../site/PortfolioDrawer';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Eye } from "lucide-react";

export default function Portfolio({ portfolioItems = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const defaultItems = [
    {
      id: 1,
      title: "Brand & Packaging Stiker UMKM Kopi",
      category: "Branding & Graphics",
      serviceSlug: "branding-graphics",
      description: "Pengembangan desain kemasan stiker dan identitas visual yang siap cetak untuk produk kopi lokal agar lebih menarik di pasaran.",
      client: "Kopi Lokal UMKM",
      deliverables: ["Desain Stiker", "Logo Refresh", "Social Media Template"],
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop"
      ],
      details: {
        challenge: "Kemasan lama kurang menonjol di rak toko dan belum memiliki identitas merek yang kuat.",
        solution: "Membuat desain stiker modern dengan kontras tinggi dan informasi produk yang ringkas serta mudah dibaca."
      }
    },
    {
      id: 2,
      title: "Landing Page Elevate Bisnis F&B",
      category: "Website & Digital Ads",
      serviceSlug: "website-digital-ads",
      description: "Pembuatan website landing page 1 halaman yang cepat, responsif, dan siap dihubungkan ke Meta Ads untuk meningkatkan penjualan.",
      client: "Resto & Catering Kit",
      deliverables: ["Landing Page UI/UX", "Responsive Web", "WhatsApp Order Direct"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
      ],
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
    <section id="portfolio" className="py-16 md:py-24 bg-[#0B0F17] text-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider border-zinc-700 bg-zinc-900/80 text-zinc-300">
            Portofolio & Hasil Karya
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Project yang Pernah Kami Bantu
          </h2>
          <p className="text-zinc-400 text-sm md:text-base">
            Dari desain kebutuhan dasar bisnis hingga website yang siap menaikkan kelas usaha kamu.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {itemsToDisplay.map((item) => (
            <div
              key={item.id || item.title}
              onClick={() => handleOpenDetail(item)}
              className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative aspect-video overflow-hidden bg-zinc-950">
                  <img
                    src={item.image || item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Button size="sm" className="gap-2 rounded-full font-medium shadow-lg bg-white text-zinc-950 hover:bg-zinc-200">
                      <Eye className="w-4 h-4" />
                      <span>Lihat Detail</span>
                    </Button>
                  </div>
                </div>

                {/* Card Content - Fixed Text Color on Hover */}
                <div className="p-5 space-y-3">
                  <Badge variant="outline" className="text-[11px] font-medium border-zinc-700 bg-zinc-800/60 text-zinc-300">
                    {item.category || item.category_name || "Project"}
                  </Badge>
                  <h3 className="font-bold text-lg text-white group-hover:text-white transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm line-clamp-2 leading-relaxed">
                    {item.description || item.shortDescription}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-zinc-800/80 mt-auto flex items-center justify-between text-xs text-zinc-400">
                <span className="truncate max-w-[150px]">{item.client || "Veyora Client"}</span>
                <span className="font-semibold text-zinc-300 group-hover:text-white flex items-center gap-1">
                  Detail <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Pop-up Drawer Modal Dark */}
      <PortfolioDrawer
        item={selectedItem}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </section>
  );
}