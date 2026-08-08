import React from 'react';
import Lanyard from '../3d/Lanyard';
import { waLink } from '../../lib/whatsapp';

export default function Hero() {
  return (
    <section className="relative bg-[#080D10] text-white overflow-hidden min-h-screen flex items-center pt-24 pb-16">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* 3D Canvas Layer */}
      <Lanyard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 pointer-events-none">
        {/* Layout Reordered: Di Mobile Kartu di Atas (order-2 untuk teks, order-1 untuk area 3D) */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[600px]">
          
          {/* Teks Content (Mobile: Order 2 di Bawah, Desktop: Order 1 di Kiri) */}
          <div className="w-full lg:w-1/2 space-y-6 text-left order-2 lg:order-1 pointer-events-auto pt-6 lg:pt-0">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-300 border border-white/10 px-3.5 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-md w-fit">
              <span className="text-emerald-400">✦</span> PARTNER KREATIF BISNIS ANDA
            </div>

            <h1 className="font-bold text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
              Bantu Produkmu Terlihat Lebih Profesional
            </h1>

            <p className="text-[#A3AAB4] text-base md:text-lg leading-relaxed max-w-lg">
              Veyora hadir sebagai partner kreatif jangka panjang. Kami bantu UMKM dan brand lokal tampil lebih meyakinkan lewat kemasan, logo, dan visual.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all text-sm shadow-lg active:scale-95 flex items-center gap-2"
              >
                <span>💬</span> Konsultasi Gratis
              </a>
              <a
                href="#portfolio"
                className="px-6 py-3.5 rounded-full border border-white/20 text-white hover:border-white transition-all text-sm font-medium active:scale-95"
              >
                Lihat Portfolio &rarr;
              </a>
            </div>
          </div>

          {/* Spacer Area 3D (Mobile: Order 1 di Atas, Desktop: Order 2 di Kanan) */}
          <div className="w-full lg:w-1/2 h-[320px] sm:h-[400px] lg:h-[550px] order-1 lg:order-2 pointer-events-none" />

        </div>
      </div>
    </section>
  );
}
