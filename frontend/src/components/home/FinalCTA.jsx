import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { waLink } from "../../lib/whatsapp";
import { trackWhatsApp } from "../site/Analytics";
import { fadeUp, viewport } from "../../lib/motionVariants";

export default function FinalCTA() {
  const { settings } = useContent();

  return (
    <section data-testid="final-cta-section" className="section-pad">
      <div className="veyora-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="relative surface-card overflow-hidden px-8 py-16 md:px-16 md:py-24 text-center"
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#5C6773] blur-[150px] opacity-15" aria-hidden />
          <div className="relative">
            <span className="eyebrow">Mulai Sekarang</span>
            <h2 className="font-head font-bold text-white text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mt-5 max-w-3xl mx-auto">
              Siap membuat produkmu tampil beda?
            </h2>
            <p className="font-body text-[#A3AAB4] text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
              Mulai dari konsultasi gratis hari ini. Tanpa komitmen, tanpa biaya tersembunyi.
              Ceritakan produk Anda, biar kami bantu selebihnya.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <a href={waLink(settings?.whatsapp_number)} target="_blank" rel="noreferrer" onClick={() => trackWhatsApp("final-cta")} data-analytics="whatsapp" data-testid="final-cta-primary" className="btn-primary">
                <MessageCircle className="w-4 h-4" /> Konsultasi Gratis
              </a>
              <a href="#portfolio" data-testid="final-cta-secondary" className="btn-secondary">
                Lihat Portfolio <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
