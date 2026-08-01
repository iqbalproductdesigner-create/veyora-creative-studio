import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/site/Navbar";
import Footer from "../components/site/Footer";
import Marquee from "../components/site/Marquee";
import WhatsAppFloat from "../components/site/WhatsAppFloat";
import Hero from "../components/home/Hero";
import Statistics from "../components/home/Statistics";
import WhyChoose from "../components/home/WhyChoose";
import Services from "../components/home/Services";
import Portfolio from "../components/home/Portfolio";
import WorkingProcess from "../components/home/WorkingProcess";
import Testimonials from "../components/home/Testimonials";
import Faq from "../components/home/Faq";
import FinalCTA from "../components/home/FinalCTA";
import { useContent } from "../context/ContentContext";
import Seo from "../components/site/Seo";

export default function Home() {
  const { loading, settings, homepage } = useContent();
  const location = useLocation();

  useEffect(() => {
    if (settings?.default_seo_title) document.title = settings.default_seo_title;
  }, [settings]);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#080D10]">
        <div className="flex flex-col items-center gap-4">
          <span className="font-head font-bold text-2xl tracking-[0.18em] text-white animate-pulse">VEYORA</span>
          <span className="font-body text-xs uppercase tracking-[0.35em] text-[#A3AAB4]">Creative Studio</span>
        </div>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const socials = settings?.social_links || {};
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.business_name || "Veyora Creative Studio",
    url: origin,
    description: settings?.default_seo_description,
    logo: homepage?.hero_image,
    sameAs: Object.values(socials).filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: `+${(settings?.whatsapp_number || "").replace(/[^0-9]/g, "")}`,
    },
  };

  return (
    <div className="bg-[#080D10]">
      <Seo
        title={settings?.default_seo_title}
        description={settings?.default_seo_description}
        image={homepage?.hero_image}
        url={origin}
        jsonLd={orgJsonLd}
      />
      <Navbar />
      <main>
        <Hero />
        <Statistics />
        <Marquee />
        <WhyChoose />
        <Services />
        <Portfolio />
        <WorkingProcess />
        <Testimonials />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
