import { motion } from "framer-motion";
import { fadeUp, stagger, viewport } from "../../lib/motionVariants";

const STEPS = [
  { no: "01", title: "Konsultasi", desc: "Kita mulai dengan ngobrol santai lewat WhatsApp untuk memahami produk, tujuan, dan kebutuhan Anda." },
  { no: "02", title: "Riset", desc: "Kami pelajari brand dan kompetitor Anda agar arah desain benar-benar tepat sasaran." },
  { no: "03", title: "Desain", desc: "Tim kami mengerjakan desain dengan detail, lalu menyajikan konsep terbaik untuk Anda pilih." },
  { no: "04", title: "Revisi & Serah Terima", desc: "Kami sempurnakan sesuai masukan Anda, lalu kirim file final yang siap dipakai." },
];

export default function WorkingProcess() {
  return (
    <section data-testid="process-section" className="section-pad">
      <div className="veyora-container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="max-w-2xl mb-16">
          <span className="eyebrow">Cara Kerja Kami</span>
          <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight leading-tight mt-4">
            Prosesnya mudah & transparan
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STEPS.map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="relative">
              <p className="font-editorial text-6xl text-[#23262B] leading-none">{s.no}</p>
              <div className="mt-5 pt-5 border-t border-[#23262B]">
                <h3 className="font-head text-white text-xl mb-3">{s.title}</h3>
                <p className="font-body text-sm text-[#A3AAB4] leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
