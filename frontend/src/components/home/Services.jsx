import React from 'react';
import { useContent } from '../../context/ContentContext';
import ServiceCard from '../site/ServiceCard';

export default function Services() {
  const { services, loading } = useContent();

  // Fallback data bawaan jika API backend belum mereturn data (murni untuk keselamatan render UI)
  const defaultServices = [
    {
      id: 's1',
      title: 'Brand Identity & Logo',
      description: 'Membangun identitas visual yang kuat, unik, dan berkesan untuk membedakan brand kamu dari kompetitor.',
      tags: ['Logo Design', 'Brand Guidelines', 'Typography', 'Color Palette'],
      icon: '✦'
    },
    {
      id: 's2',
      title: 'Packaging Design',
      description: 'Desain kemasan produk yang memikat mata di rak jualan dan meningkatkan nilai jual serta kepercayaan konsumen.',
      tags: ['Box Design', 'Pouch & Label', '3D Mockup', 'Print Ready'],
      icon: '📦'
    },
    {
      id: 's3',
      title: 'Visual & Social Content',
      description: 'Visual promosi yang konsisten dan profesional untuk kebutuhan media sosial, marketplace, dan pemasaran digital.',
      tags: ['Social Media Feed', 'Banner Ads', 'Marketing Kit', 'IG Story Template'],
      icon: '✨'
    }
  ];

  // Gunakan data dari backend jika ada, jika tidak ada/kosong gunakan fallback agar UI tidak pernah hilang
  const displayServices = (services && services.length > 0) ? services : defaultServices;

  return (
    <section id="services" className="py-24 bg-[#080D10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full bg-emerald-500/5 backdrop-blur-md">
              LAYANAN KAMI
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Semua yang dibutuhkan brand Anda
            </h2>
          </div>
          <p className="text-[#A3AAB4] text-base max-w-md">
            Dari kemasan hingga konten digital, kami siapkan semuanya dalam satu tempat yang rapi dan terjangkau.
          </p>
        </div>

        {loading && (!services || services.length === 0) ? (
          <div className="text-center text-gray-500 py-12">
            Memuat layanan...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service) => (
              <ServiceCard key={service.id || service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
