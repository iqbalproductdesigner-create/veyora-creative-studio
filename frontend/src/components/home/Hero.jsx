import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, MessageSquare, Star } from 'lucide-react';
import { getWhatsAppLink } from '../../lib/whatsapp';
import { HOME_TEST_IDS } from '../../constants/testIds';

export default function Hero() {
  const { content } = useContent();
  const hero = content?.hero || {};

  const handleConsultation = () => {
    window.open(getWhatsAppLink(hero.cta_whatsapp_message || 'Halo Veyora, saya ingin konsultasi gratis'), '_blank');
  };

  const handlePortfolioClick = () => {
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section data-testid={HOME_TEST_IDS.HERO_SECTION} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <Badge 
              data-testid={HOME_TEST_IDS.HERO_BADGE}
              variant="outline" 
              className="px-4 py-1.5 text-xs font-medium tracking-wide uppercase border-border/60 bg-secondary/50 backdrop-blur-sm"
            >
              {hero.badge || 'Partner Kreatif Bisnis Anda'}
            </Badge>

            <h1 
              data-testid={HOME_TEST_IDS.HERO_TITLE}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            >
              {hero.title || 'Bantu Produkmu Terlihat Lebih Profesional'}
            </h1>

            <p 
              data-testid={HOME_TEST_IDS.HERO_DESCRIPTION}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
            >
              {hero.description || 'Veyora hadir sebagai partner kreatif jangka panjang. Kami bantu UMKM dan brand lokal tampil lebih meyakinkan lewat kemasan, logo, dan visual yang menumbuhkan kepercayaan pelanggan.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button 
                data-testid={HOME_TEST_IDS.HERO_CTA_PRIMARY}
                size="lg" 
                onClick={handleConsultation}
                className="rounded-full px-8 h-12 text-base font-semibold gap-2 shadow-lg hover:shadow-primary/25 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                {hero.cta_primary_text || 'Konsultasi Gratis'}
              </Button>

              <Button 
                data-testid={HOME_TEST_IDS.HERO_CTA_SECONDARY}
                variant="outline" 
                size="lg" 
                onClick={handlePortfolioClick}
                className="rounded-full px-8 h-12 text-base font-semibold gap-2 border-border/80 hover:bg-secondary/80 transition-all"
              >
                {hero.cta_secondary_text || 'Lihat Portfolio'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Social Proof (Hanya bagian bulatan ini yang diisi gambar avatar) */}
            <div className="pt-6 border-t border-border/40 flex items-center gap-6">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 1"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 2"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 3"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                  alt="Client Avatar 4"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {hero.social_proof_text || 'Dipercaya 180+ brand lokal'}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-border/60 bg-card p-3 shadow-2xl">
                <img 
                  data-testid={HOME_TEST_IDS.HERO_IMAGE}
                  src={hero.image_url || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop'} 
                  alt="Veyora Showcase"
                  className="w-full h-[420px] object-cover rounded-2xl"
                />
                
                {/* Floating Stat Card */}
                {hero.stat_number && (
                  <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-md border border-border/80 p-4 rounded-2xl shadow-xl space-y-0.5">
                    <p className="text-2xl font-bold text-foreground">{hero.stat_number}</p>
                    <p className="text-xs text-muted-foreground">{hero.stat_label || 'Klien merasa puas'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}