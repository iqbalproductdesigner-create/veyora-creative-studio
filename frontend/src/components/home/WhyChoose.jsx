import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Fingerprint, Layout, Printer } from "lucide-react";
import { fadeUp, stagger, viewport } from "../../lib/motionVariants";

const REASONS = [
  { icon: ShieldCheck, title: "Menumbuhkan Kepercayaan", desc: "Tampilan yang rapi membuat calon pembeli merasa yakin dan aman untuk bertransaksi dengan Anda." },
  { icon: Sparkles, title: "Persepsi Lebih Premium", desc: "Desain yang matang membuat produk Anda terlihat lebih bernilai, sehingga lebih mudah dihargai." },
  { icon: Fingerprint, title: "Identitas yang Kuat", desc: "Kami bantu bangun ciri khas visual agar brand Anda mudah dikenali dan diingat pelanggan." },
  { icon: Layout, title: "Presentasi Profesional", desc: "Dari kemasan hingga sosial media, semua tampil konsisten dan meyakinkan di mata pelanggan." },
  { icon: Printer, title: "Siap Cetak & Digital", desc: "Setiap file kami siapkan sesuai standar, siap dipakai untuk percetakan maupun kebutuhan online." },
];

export default function WhyChoose() {
  return (
    <section data-testid="why-choose-section" className="section-pad">
      <div className="veyora-container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="max-w-2xl mb-16">
          <span className="eyebrow">Kenapa Veyora</span>
          <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight leading-tight mt-4">
            Desain yang baik bukan biaya, tapi investasi
          </h2>
          <p className="font-body text-[#A3AAB4] text-base md:text-lg leading-relaxed mt-5">
            Kami tidak sekadar membuat desain yang indah. Kami bantu bisnis Anda tampil lebih meyakinkan
            agar pelanggan lebih percaya dan produk lebih mudah dijual.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {REASONS.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="surface-card p-8 hover:border-[#3a3e45] transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#080D10] border border-[#23262B] grid place-items-center mb-6">
                <r.icon className="w-5 h-5 text-[#D9DEE6]" />
              </div>
              <h3 className="font-head text-white text-xl mb-3">{r.title}</h3>
              <p className="font-body text-sm text-[#A3AAB4] leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
          <motion.div variants={fadeUp} custom={5} className="rounded-2xl p-8 bg-[#5C6773] flex flex-col justify-center">
            <p className="font-head text-white text-2xl leading-snug">Siap membuat brand Anda tampil beda?</p>
            <p className="font-body text-white/80 text-sm mt-3">Mulai dari konsultasi gratis tanpa komitmen.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
