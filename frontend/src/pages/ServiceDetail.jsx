import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Check, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/site/Navbar";
import Footer from "../components/site/Footer";
import ServiceCard from "../components/site/ServiceCard";
import ServiceOrderSummary from "../components/site/ServiceOrderSummary";
import Seo from "../components/site/Seo";
import DraftBanner from "../components/site/DraftBanner";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../components/ui/accordion";
import { useContent } from "../context/ContentContext";
import { fadeUp, stagger, viewport } from "../lib/motionVariants";

const PROCESS = [
  { no: "01", title: "Konsultasi", desc: "Kita diskusikan kebutuhan & tujuan produkmu." },
  { no: "02", title: "Riset", desc: "Kami pelajari brand dan kompetitormu." },
  { no: "03", title: "Desain", desc: "Tim mengerjakan konsep terbaik untukmu." },
  { no: "04", title: "Revisi & Kirim", desc: "Kami sempurnakan lalu kirim file final." },
];

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings, services, portfolio } = useContent();
  const [service, setService] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setService(null);
    setNotFound(false);
    api
      .get(`/services/${slug}`)
      .then((res) => {
        setService(res.data);
        document.title = res.data.seo_title || res.data.title;
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="bg-[#080D10] min-h-screen">
        <Navbar />
        <div className="min-h-screen grid place-items-center text-center px-6">
          <div>
            <h1 className="font-head text-white text-3xl mb-4">Layanan tidak ditemukan</h1>
            <button onClick={() => navigate("/")} className="btn-primary">Kembali ke Beranda</button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#080D10]">
        <span className="font-head font-bold text-2xl tracking-[0.18em] text-white animate-pulse">VEYORA</span>
      </div>
    );
  }

  const relatedServices = (services || []).filter((s) => s.slug !== slug).slice(0, 3);
  const relatedPortfolio = (portfolio || []).filter(
    (p) => (p.related_services || []).includes(slug) || p.category === service.category
  ).slice(0, 3);

  return (
    <div className="bg-[#080D10]">
      <Seo
        title={service.seo_title || `${service.title} — Veyora Creative Studio`}
        description={service.seo_description || service.short_description}
        image={service.og_image || service.hero_image || service.thumbnail}
        url={typeof window !== "undefined" ? window.location.href : ""}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.short_description,
          serviceType: service.category,
          provider: { "@type": "Organization", name: settings?.business_name || "Veyora Creative Studio" },
          areaServed: "ID",
          image: service.og_image || service.hero_image || service.thumbnail,
        }}
      />
      <DraftBanner show={service.status === "draft"} />
      <Navbar />
      <main className="pt-20 pb-24 lg:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#23262B]">
          <div className="veyora-container pt-14 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Link to="/#services" className="flex w-fit items-center gap-2 text-[#A3AAB4] hover:text-white transition-colors font-body text-sm mb-8">
                <ArrowLeft className="w-4 h-4" /> Semua Layanan
              </Link>
              <span className="eyebrow block">{service.category}</span>
              <h1 className="font-head font-bold text-white text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mt-4">
                {service.title}
              </h1>
              <p className="font-body text-[#A3AAB4] text-base md:text-lg leading-relaxed mt-6 max-w-lg">
                {service.short_description}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div>
                  <p className="font-body text-[11px] uppercase tracking-wider text-[#A3AAB4]">Mulai dari</p>
                  <p className="font-head text-white text-2xl">{service.starting_price}</p>
                </div>
                <div className="w-px h-10 bg-[#23262B]" />
                <div className="flex items-center gap-2 text-[#D9DEE6] font-body text-sm">
                  <Clock className="w-4 h-4" /> {service.estimated_time}
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden border border-[#23262B]">
              <img src={service.hero_image || service.thumbnail} alt={service.title} className="w-full h-[320px] md:h-[440px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] to-transparent opacity-60" />
            </motion.div>
          </div>
        </section>

        {/* Two-column: content + sticky order summary */}
        <section className="veyora-container py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
            {/* LEFT */}
            <div className="space-y-16 min-w-0">
              {service.full_description && (
                <div>
                  <h2 className="font-head font-bold text-white text-2xl md:text-3xl tracking-tight mb-4">Tentang Layanan</h2>
                  <p className="font-body text-[#A3AAB4] text-base leading-relaxed">{service.full_description}</p>
                </div>
              )}

              {service.benefits?.length > 0 && (
                <div>
                  <h2 className="font-head font-bold text-white text-2xl md:text-3xl tracking-tight mb-6">Kenapa ini penting?</h2>
                  <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewport} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.benefits.map((b, i) => (
                      <motion.div key={i} variants={fadeUp} custom={i} className="surface-card p-5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#080D10] border border-[#23262B] grid place-items-center shrink-0">
                          <Check className="w-4 h-4 text-[#5C6773]" />
                        </div>
                        <p className="font-body text-sm text-[#D9DEE6] leading-relaxed">{b}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Process */}
              <div>
                <h2 className="font-head font-bold text-white text-2xl md:text-3xl tracking-tight mb-6">Cara kerjanya</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {PROCESS.map((s, i) => (
                    <div key={i}>
                      <p className="font-editorial text-4xl text-[#23262B] leading-none">{s.no}</p>
                      <h3 className="font-head text-white text-base mt-3 mb-1.5">{s.title}</h3>
                      <p className="font-body text-xs text-[#A3AAB4] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related portfolio */}
              {relatedPortfolio.length > 0 && (
                <div>
                  <h2 className="font-head font-bold text-white text-2xl md:text-3xl tracking-tight mb-6">Karya terkait</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedPortfolio.map((p) => (
                      <Link key={p.id} to={`/portfolio/${p.slug}`} className="group">
                        <div className="relative overflow-hidden rounded-xl border border-[#23262B] aspect-[4/5]">
                          <img src={p.thumbnail} alt={p.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] to-transparent opacity-70" />
                          <div className="absolute bottom-0 p-4">
                            <h3 className="font-head text-white text-sm">{p.project_name}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {service.faqs?.length > 0 && (
                <div>
                  <h2 className="font-head font-bold text-white text-2xl md:text-3xl tracking-tight mb-6">
                    Pertanyaan seputar {service.title}
                  </h2>
                  <Accordion type="single" collapsible>
                    {service.faqs.map((f, i) => (
                      <AccordionItem key={i} value={`f${i}`} className="border-b border-[#23262B]">
                        <AccordionTrigger className="font-head text-white text-left text-base hover:no-underline py-5">
                          {f.question}
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-[#A3AAB4] text-sm leading-relaxed pb-5">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            {/* RIGHT — sticky order summary */}
            <div className="lg:min-w-0">
              <ServiceOrderSummary service={service} whatsappNumber={settings?.whatsapp_number} />
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="section-pad border-t border-[#23262B]">
            <div className="veyora-container">
              <h2 className="font-head font-bold text-white text-3xl md:text-4xl tracking-tight mb-12">Layanan lainnya</h2>
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewport}
                className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedServices.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
