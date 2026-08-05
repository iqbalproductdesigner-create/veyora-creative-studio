import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0B0F17] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Kolom Kiri: Header & Headline Text */}
          <div className="space-y-6 max-w-xl">
            {/* Tag Badge */}
            <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider border-zinc-800 bg-zinc-900/60 text-zinc-400 gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
              PARTNER KREATIF BISNIS ANDA
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Bantu Produkmu Terlihat Lebih Profesional
            </h1>

            {/* Paragraph Sub-headline */}
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Veyora hadir sebagai partner kreatif jangka panjang. Kami bantu UMKM dan brand lokal tampil lebih meyakinkan lewat kemasan, logo, dan visual yang menumbuhkan kepercayaan pelanggan.
            </p>

            {/* Tombol CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button 
                size="lg" 
                className="rounded-full px-6 py-6 bg-[#3b434e] hover:bg-[#4a5462] text-white gap-2 font-medium shadow-lg border border-white/10"
                asChild
              >
                <a 
                  href="https://wa.me/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konsultasi Gratis</span>
                </a>
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-6 py-6 border-zinc-800 bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900 gap-2 font-medium"
                asChild
              >
                <a href="#portfolio">
                  <span>Lihat Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            {/* Social Proof Avatar Section */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0B0F17] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 1"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0B0F17] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 2"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0B0F17] object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 3"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0B0F17] object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 4"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  Dipercaya 180+ brand lokal
                </p>
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Visual Card Showcase */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
              
              <div className="w-full h-full rounded-2xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden flex items-center justify-center relative group">
                <img
                  src="https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80"
                  alt="Box Showcase Packaging"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute bottom-10 left-10 bg-zinc-950/90 border border-zinc-800 backdrop-blur-md p-4 rounded-2xl shadow-xl space-y-0.5">
                <span className="text-2xl font-bold text-white tracking-tight">97%</span>
                <p className="text-xs text-zinc-400">Klien merasa puas</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}