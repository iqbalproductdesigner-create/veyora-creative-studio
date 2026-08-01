import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import PortfolioDrawer from "../site/PortfolioDrawer";
import { fadeUp, viewport } from "../../lib/motionVariants";

export default function Portfolio() {
  const { portfolio, categories } = useContent();
  const [active, setActive] = useState("Semua");
  const [selected, setSelected] = useState(null);

  const filters = useMemo(
    () => ["Semua", ...((categories || []).map((c) => c.name))],
    [categories]
  );

  const filtered = useMemo(() => {
    if (active === "Semua") return portfolio || [];
    return (portfolio || []).filter((p) => p.category === active);
  }, [active, portfolio]);

  return (
    <section id="portfolio" data-testid="portfolio-section" className="section-pad bg-[#0a0f13]">
      <div className="veyora-container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="max-w-2xl mb-12">
          <span className="eyebrow">Hasil Karya Kami</span>
          <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight leading-tight mt-4">
            Karya yang berbicara sendiri
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((c) => (
            <button
              key={c}
              data-testid={`portfolio-filter-${c.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setActive(c)}
              className={`font-body text-sm rounded-full px-5 py-2 border transition-all duration-200 ${
                active === c
                  ? "bg-[#D9DEE6] text-[#080D10] border-[#D9DEE6]"
                  : "bg-transparent text-[#A3AAB4] border-[#23262B] hover:text-white hover:border-[#3a3e45]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.button
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelected(p)}
                data-testid={`portfolio-item-${p.id}`}
                className="group text-left"
              >
                <div className="relative overflow-hidden rounded-xl border border-[#23262B] aspect-[4/5]">
                  <img
                    src={p.thumbnail}
                    alt={p.project_name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] via-[#080D10]/20 to-transparent opacity-80" />
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#080D10]/70 border border-[#23262B] grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <p className="text-[10px] uppercase tracking-widest text-[#D9DEE6] font-body">{p.category}</p>
                    <h3 className="font-head text-white text-xl mt-1">{p.project_name}</h3>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <PortfolioDrawer item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
