import { motion } from "framer-motion";
import { useContent } from "../../context/ContentContext";
import ServiceCard from "../site/ServiceCard";
import { fadeUp, stagger, viewport } from "../../lib/motionVariants";

export default function Services() {
  const { services } = useContent();

  return (
    <section id="services" data-testid="services-section" className="section-pad">
      <div className="veyora-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <span className="eyebrow">Layanan Kami</span>
            <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight leading-tight mt-4">
              Semua yang dibutuhkan brand Anda
            </h2>
          </div>
          <p className="font-body text-[#A3AAB4] text-base max-w-sm">
            Dari kemasan hingga konten digital, kami siapkan semuanya dalam satu tempat yang rapi dan terjangkau.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(services || []).map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
