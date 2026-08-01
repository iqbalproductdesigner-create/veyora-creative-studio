import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Check, ArrowRight, ArrowLeft } from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/site/Navbar";
import Footer from "../components/site/Footer";
import WhatsAppFloat from "../components/site/WhatsAppFloat";
import Seo from "../components/site/Seo";
import DraftBanner from "../components/site/DraftBanner";
import { useContent } from "../context/ContentContext";
import { waLink } from "../lib/whatsapp";
import { fadeUp, stagger, viewport } from "../lib/motionVariants";

export default function PortfolioDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings, services } = useContent();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setItem(null);
    setNotFound(false);
    api
      .get(`/portfolio/${slug}`)
      .then((res) => {
        setItem(res.data);
        document.title = res.data.seo_title || res.data.project_name;
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="bg-[#080D10] min-h-screen">
        <Navbar />
        <div className="min-h-screen grid place-items-center text-center px-6">
          <div>
            <h1 className="font-head text-white text-3xl mb-4">Portfolio tidak ditemukan</h1>
            <button onClick={() => navigate("/")} className="btn-primary">Kembali ke Beranda</button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#080D10]">
        <span className="font-head font-bold text-2xl tracking-[0.18em] text-white animate-pulse">VEYORA</span>
      </div>
    );
  }

  const relatedSlugs = item.related_services?.length ? item.related_services : (item.related_service ? [item.related_service] : []);
  const related = (services || []).filter((s) => relatedSlugs.includes(s.slug));
  const waMsg = `Halo Veyora Creative Studio,\n\nSaya tertarik dengan proyek seperti *${item.project_name}* dan ingin mendiskusikan kebutuhan bisnis saya.\n\nTerima kasih.`;

  return (
    <div className="bg-[#080D10]">
      <Seo
        title={item.seo_title || `${item.project_name} — Portfolio Veyora`}
        description={item.seo_description || item.overview}
        image={item.og_image || item.thumbnail || item.gallery?.[0]}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <DraftBanner show={item.status === "draft"} />
      <Navbar />
      <main className="pt-20">
        <section className="veyora-container pt-14 pb-10">
          <Link to="/#portfolio" className="flex w-fit items-center gap-2 text-[#A3AAB4] hover:text-white transition-colors font-body text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Semua Portfolio
          </Link>
          <span className="eyebrow block">{item.category}</span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="font-head font-bold text-white text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mt-4 max-w-3xl">
            {item.project_name}
          </motion.h1>
          {item.overview && (
            <p className="font-body text-[#A3AAB4] text-base md:text-lg leading-relaxed mt-6 max-w-2xl">{item.overview}</p>
          )}
        </section>

        {/* Gallery */}
        {item.gallery?.length > 0 && (
          <section className="veyora-container pb-8">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.gallery.map((g, i) => (
                <motion.img
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  src={g}
                  alt={`${item.project_name} ${i + 1}`}
                  loading="lazy"
                  className={`w-full rounded-2xl border border-[#23262B] object-cover ${i === 0 ? "md:col-span-2 max-h-[560px]" : "max-h-[420px]"}`}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* Details */}
        <section className="section-pad border-t border-[#23262B]">
          <div className="veyora-container grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {item.challenge && (
                <div>
                  <h2 className="font-head text-white text-2xl mb-3">Tantangan</h2>
                  <p className="font-body text-[#A3AAB4] leading-relaxed">{item.challenge}</p>
                </div>
              )}
              {item.solution && (
                <div>
                  <h2 className="font-head text-white text-2xl mb-3">Solusi Kami</h2>
                  <p className="font-body text-[#A3AAB4] leading-relaxed">{item.solution}</p>
                </div>
              )}
            </div>
            <div className="space-y-8">
              {item.deliverables?.length > 0 && (
                <div className="surface-card p-6">
                  <h3 className="font-head text-white text-lg mb-4">Yang Dikerjakan</h3>
                  <ul className="space-y-3">
                    {item.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-sm text-[#A3AAB4]">
                        <Check className="w-4 h-4 text-[#5C6773] mt-0.5 shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {related.length > 0 && (
                <div className="surface-card p-6">
                  <p className="eyebrow mb-3">Layanan Terkait</p>
                  <div className="flex flex-col gap-3">
                    {related.map((r) => (
                      <Link key={r.slug} to={`/services/${r.slug}`} className="font-head text-white text-lg hover:text-[#D9DEE6] transition-colors inline-flex items-center gap-2">
                        {r.title} <ArrowRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad border-t border-[#23262B]">
          <div className="veyora-container text-center">
            <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight mb-6">Punya proyek serupa?</h2>
            <p className="font-body text-[#A3AAB4] max-w-lg mx-auto mb-8">Ceritakan kebutuhan Anda. Konsultasi gratis dan tanpa komitmen.</p>
            <a href={waLink(settings?.whatsapp_number, waMsg)} target="_blank" rel="noreferrer" data-testid="portfolio-detail-cta" className="btn-primary">
              <MessageCircle className="w-4 h-4" /> Konsultasi Gratis <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
