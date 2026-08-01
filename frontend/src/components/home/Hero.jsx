import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, ArrowRight, Star } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { waLink } from "../../lib/whatsapp";

export default function Hero() {
  const { homepage, settings } = useContent();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const headline = homepage?.headline || "Bantu Produkmu Terlihat Lebih Profesional";
  const words = headline.split(" ");

  return (
    <section
      id="home"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* soft accent glow */}
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute -top-40 right-0 w-[520px] h-[520px] rounded-full blur-[140px] opacity-20"
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-[#5C6773]" />
      </motion.div>

      <div className="veyora-container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#23262B] px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#5C6773]" />
            <span className="eyebrow">Partner Kreatif Bisnis Anda</span>
          </motion.div>

          <h1 className="font-head font-bold text-white text-[2.75rem] leading-[1.1] sm:text-6xl lg:text-[4.5rem] lg:leading-[1.05] tracking-tight">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "115%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + words.length * 0.09 }}
            className="font-body text-base md:text-lg text-[#A3AAB4] leading-relaxed max-w-xl mt-7"
          >
            {homepage?.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 + words.length * 0.09 }}
            className="flex flex-wrap items-center gap-4 mt-10"
          >
            <a href={waLink(settings?.whatsapp_number)} target="_blank" rel="noreferrer" data-testid="hero-primary-cta" className="btn-primary">
              <MessageCircle className="w-4 h-4" />
              {homepage?.primary_cta || "Konsultasi Gratis"}
            </a>
            <a href="#portfolio" data-testid="hero-secondary-cta" className="btn-secondary">
              {homepage?.secondary_cta || "Lihat Portfolio"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 + words.length * 0.09 }}
            className="flex items-center gap-4 mt-12"
          >
            <div className="flex -space-x-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#080D10] bg-[#23262B]" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#D9DEE6]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="font-body text-xs text-[#A3AAB4] mt-1">Dipercaya 180+ brand lokal</p>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#23262B] bg-[#121417]">
              <motion.img
                style={{ y: imgY, scale: imgScale }}
                src={homepage?.hero_image}
                alt="Veyora product mockup"
                className="w-full h-[420px] md:h-[560px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] via-transparent to-transparent" />
            </div>
            {/* floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="absolute -bottom-6 -left-6 surface-card px-6 py-4 hidden sm:block"
            >
              <p className="font-editorial text-3xl text-white leading-none">97%</p>
              <p className="font-body text-xs text-[#A3AAB4] mt-1">Klien merasa puas</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
