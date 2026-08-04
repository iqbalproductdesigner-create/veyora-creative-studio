import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { useEffect } from "react";
import { useContent } from "../../context/ContentContext";
import { waLink } from "../../lib/whatsapp";

export default function PortfolioDrawer({ item, onClose }) {
  const { settings, services } = useContent();
  const relatedSlugs = item?.related_services?.length
    ? item.related_services
    : (item?.related_service ? [item.related_service] : []);
  let related = (services || []).filter((s) => relatedSlugs.includes(s.slug));
  if (related.length === 0 && item) {
    const byCat = services?.find((s) => s.category === item.category);
    related = byCat ? [byCat] : [];
  }

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      if (window.__lenis) window.__lenis.stop();
    }
    return () => {
      document.body.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
    };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70"
            data-testid="portfolio-drawer-overlay"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[70] h-full w-full md:w-[620px] bg-[#121417] border-l border-[#23262B] overflow-y-auto"
            data-testid="portfolio-drawer"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-5 bg-[#121417] border-b border-[#23262B]">
              <span className="eyebrow">{item.category}</span>
              <button
                onClick={onClose}
                data-testid="portfolio-drawer-close"
                aria-label="Tutup"
                className="w-10 h-10 rounded-full border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white hover:border-[#3a3e45] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 md:px-10 py-8">
              <h2 className="font-head font-bold text-white text-3xl md:text-4xl tracking-tight">
                {item.project_name}
              </h2>

              <a
                href={`/portfolio/${item.slug}`}
                data-testid="portfolio-drawer-full-case"
                className="btn-secondary mt-5 w-full"
              >
                Lihat Studi Kasus Lengkap
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Gallery */}
              <div className="mt-8 space-y-4">
                {(item.gallery || []).map((g, i) => (
                  <img
                    key={i}
                    src={g}
                    alt={`${item.project_name} ${i + 1}`}
                    className="w-full rounded-xl border border-[#23262B] object-cover"
                    loading="lazy"
                  />
                ))}
              </div>

              <div className="mt-10 space-y-8">
                <div>
                  <h3 className="font-head text-white text-lg mb-2">Tentang Proyek</h3>
                  <p className="font-body text-sm text-[#A3AAB4] leading-relaxed">{item.overview}</p>
                </div>
                <div>
                  <h3 className="font-head text-white text-lg mb-2">Tantangan</h3>
                  <p className="font-body text-sm text-[#A3AAB4] leading-relaxed">{item.challenge}</p>
                </div>
                <div>
                  <h3 className="font-head text-white text-lg mb-2">Solusi Kami</h3>
                  <p className="font-body text-sm text-[#A3AAB4] leading-relaxed">{item.solution}</p>
                </div>
                <div>
                  <h3 className="font-head text-white text-lg mb-3">Yang Dikerjakan</h3>
                  <ul className="space-y-2">
                    {(item.deliverables || []).map((d, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-sm text-[#A3AAB4]">
                        <Check className="w-4 h-4 text-[#5C6773] mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {related.length > 0 && (
                  <div className="surface-card bg-[#080D10] p-6">
                    <p className="eyebrow mb-3">Layanan Terkait</p>
                    <div className="flex flex-col gap-3">
                      {related.map((r) => (
                        <a
                          key={r.slug}
                          href={`/services/${r.slug}`}
                          className="font-head text-white text-lg hover:text-[#D9DEE6] transition-colors inline-flex items-center gap-2"
                        >
                          {r.title} <ArrowRight className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={waLink(settings?.whatsapp_number, `Halo Veyora, saya tertarik dengan proyek seperti "${item.project_name}".`)}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="portfolio-drawer-cta"
                  className="btn-primary w-full"
                >
                  Buat Proyek Serupa
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
