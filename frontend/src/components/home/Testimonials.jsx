import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { fadeUp, stagger, viewport } from "../../lib/motionVariants";

const TESTIMONIALS = [
  { name: "Sari Dewi", role: "Owner, Kopi Nusantara", text: "Setelah packaging kopi saya didesain ulang Veyora, penjualan di marketplace naik hampir 40% dalam sebulan. Tampilannya benar-benar beda dari kompetitor." },
  { name: "Rian Pratama", role: "Founder, Snack Ceria", text: "Prosesnya cepat dan komunikatif. Timnya sabar dengerin masukan saya yang awam desain. Hasil labelnya bikin produk terlihat jauh lebih meyakinkan." },
  { name: "Maya Anggraini", role: "Owner, Glow Skincare", text: "Toko marketplace saya jadi rapi dan profesional. Banyak pembeli bilang produk saya kelihatan lebih 'brand'. Recommended banget buat UMKM." },
];

export default function Testimonials() {
  return (
    <section data-testid="testimonials-section" className="section-pad bg-[#0a0f13] border-y border-[#23262B]">
      <div className="veyora-container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="max-w-2xl mb-16">
          <span className="eyebrow">Kata Klien Kami</span>
          <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight leading-tight mt-4">
            Cerita di balik brand yang bertumbuh
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="surface-card p-8 flex flex-col">
              <Quote className="w-8 h-8 text-[#5C6773] mb-5" />
              <div className="flex items-center gap-1 text-[#D9DEE6] mb-5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="font-body text-[#D9DEE6] leading-relaxed flex-1">“{t.text}”</p>
              <div className="mt-8 pt-6 border-t border-[#23262B] flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#23262B] grid place-items-center font-head text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-head text-white text-sm">{t.name}</p>
                  <p className="font-body text-xs text-[#A3AAB4]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
