import { motion } from "framer-motion";
import { useContent } from "../../context/ContentContext";
import { fadeUp, stagger, viewport } from "../../lib/motionVariants";

export default function Statistics() {
  const { homepage } = useContent();
  const stats = homepage?.statistics || [];

  return (
    <section data-testid="statistics-section" className="border-y border-[#23262B]">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="veyora-container py-16 md:py-20 grid grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeUp} custom={i} className="text-center lg:text-left">
            <p className="font-editorial text-5xl md:text-6xl text-white leading-none">{s.value}</p>
            <p className="font-body text-sm text-[#A3AAB4] mt-3 uppercase tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
