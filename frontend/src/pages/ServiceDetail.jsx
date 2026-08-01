import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Check, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/site/Navbar";
import Footer from "../components/site/Footer";
import WhatsAppFloat from "../components/site/WhatsAppFloat";
import ServiceCard from "../components/site/ServiceCard";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../components/ui/accordion";
import { useContent } from "../context/ContentContext";
import { waLink, serviceWaMessage } from "../lib/whatsapp";
import { fadeUp, stagger, viewport } from "../lib/motionVariants";
import Seo from "../components/site/Seo";
import DraftBanner from "../components/site/DraftBanner";

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
  const waMsg = serviceWaMessage(service.title);

  return (
    <div className="bg-[#080D10]">
      <Seo
        title={service.seo_title || `${service.title} — Veyora Creative Studio`}
        description={service.seo_description || service.short_description}
        image={service.og_image || service.hero_image || service.thumbnail}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <DraftBanner show={service.status === "draft"} />
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="veyora-container pt-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Link to="/#services" className="flex w-fit items-center gap-2 text-[#A3AAB4] hover:text-white transition-colors font-body text-sm mb-8">
                <ArrowLeft className="w-4 h-4" /> Semua Layanan
              </Link>
              <span className="eyebrow block">{service.category}</span>
              <h1 className="font-head font-bold text-white text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mt-4">
                {service.title}
              </h1>
              <p className="font-body text-[#A3AAB4] text-base md:text-lg leading-relaxed mt-6 max-w-lg">
                {service.full_description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <a href={waLink(settings?.whatsapp_number, waMsg)} target="_blank" rel="noreferrer" data-testid="service-hero-cta" className="btn-primary">
                  <MessageCircle className="w-4 h-4" /> Konsultasi Gratis
                </a>
                <div className="flex items-center gap-2 text-[#A3AAB4] font-body text-sm">
                  <Clock className="w-4 h-4" /> {service.estimated_time}
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden border border-[#23262B]">
              <img src={service.hero_image || service.thumbnail} alt={service.title} className="w-full h-[360px] md:h-[480px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] to-transparent opacity-60" />
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        {service.benefits?.length > 0 && (
          <section className="section-pad border-t border-[#23262B]">
            <div className="veyora-container">
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}
                className="font-head font-bold text-white text-3xl md:text-4xl tracking-tight mb-12">
                Kenapa layanan ini penting?
              </motion.h2>
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewport}
                className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {service.benefits.map((b, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="surface-card p-6 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#080D10] border border-[#23262B] grid place-items-center shrink-0">
                      <Check className="w-4 h-4 text-[#5C6773]" />
                    </div>
                    <p className="font-body text-[#D9DEE6] leading-relaxed">{b}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Related Portfolio */}
        {relatedPortfolio.length > 0 && (
          <section className="section-pad border-t border-[#23262B]">
            <div className="veyora-container">
              <h2 className="font-head font-bold text-white text-3xl md:text-4xl tracking-tight mb-12">Karya terkait</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPortfolio.map((p) => (
                  <Link key={p.id} to="/#portfolio" className="group">
                    <div className="relative overflow-hidden rounded-xl border border-[#23262B] aspect-[4/5]">
                      <img src={p.thumbnail} alt={p.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] to-transparent opacity-70" />
                      <div className="absolute bottom-0 p-5">
                        <h3 className="font-head text-white text-lg">{p.project_name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        {service.pricing?.length > 0 && (
          <section className="section-pad border-t border-[#23262B]">
            <div className="veyora-container">
              <h2 className="font-head font-bold text-white text-3xl md:text-4xl tracking-tight mb-3">Pilih paketmu</h2>
              <p className="font-body text-[#A3AAB4] mb-12">Harga transparan, tanpa biaya tersembunyi.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.pricing.map((pkg, i) => (
                  <div key={i} className={`surface-card p-8 flex flex-col ${i === 1 ? "border-[#5C6773]" : ""}`}>
                    {i === 1 && <span className="self-start text-[10px] uppercase tracking-widest bg-[#5C6773] text-white rounded-full px-3 py-1 mb-4">Paling Populer</span>}
                    <p className="font-body text-sm text-[#A3AAB4] uppercase tracking-wider">{pkg.name}</p>
                    <p className="font-head text-white text-3xl mt-2">{pkg.price}</p>
                    <ul className="mt-6 space-y-3 flex-1">
                      {(pkg.features || []).map((f, j) => (
                        <li key={j} className="flex items-start gap-3 font-body text-sm text-[#A3AAB4]">
                          <Check className="w-4 h-4 text-[#5C6773] mt-0.5 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <a href={waLink(settings?.whatsapp_number, `${waMsg} Saya tertarik paket ${pkg.name}.`)} target="_blank" rel="noreferrer"
                      className={`mt-8 ${i === 1 ? "btn-primary" : "btn-secondary"}`}>
                      Pilih Paket
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Add-ons */}
        {service.addons?.length > 0 && (
          <section className="section-pad border-t border-[#23262B]">
            <div className="veyora-container">
              <h2 className="font-head font-bold text-white text-3xl md:text-4xl tracking-tight mb-12">Layanan tambahan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.addons.map((a, i) => (
                  <div key={i} className="surface-card px-6 py-5 flex items-center justify-between">
                    <span className="font-body text-[#D9DEE6]">{a.name}</span>
                    <span className="font-head text-white">{a.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {service.faqs?.length > 0 && (
          <section className="section-pad border-t border-[#23262B]">
            <div className="veyora-container max-w-3xl">
              <h2 className="font-head font-bold text-white text-3xl md:text-4xl tracking-tight mb-10">
                Pertanyaan seputar {service.title}
              </h2>
              <Accordion type="single" collapsible>
                {service.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`f${i}`} className="border-b border-[#23262B]">
                    <AccordionTrigger className="font-head text-white text-left text-base md:text-lg hover:no-underline py-6">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-[#A3AAB4] text-sm md:text-base leading-relaxed pb-6">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

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

        {/* CTA */}
        <section className="section-pad border-t border-[#23262B]">
          <div className="veyora-container text-center">
            <h2 className="font-head font-bold text-white text-3xl md:text-5xl tracking-tight mb-6">
              Tertarik dengan {service.title}?
            </h2>
            <p className="font-body text-[#A3AAB4] max-w-lg mx-auto mb-8">
              Yuk ngobrol dulu. Konsultasi gratis dan tanpa komitmen.
            </p>
            <a href={waLink(settings?.whatsapp_number, waMsg)} target="_blank" rel="noreferrer" className="btn-primary">
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
