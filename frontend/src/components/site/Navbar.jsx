import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "../../context/ContentContext";
import { waLink } from "../../lib/whatsapp";

const NAV = [
  { label: "Home", to: "/", hash: "#home" },
  { label: "Services", to: "/", hash: "#services" },
  { label: "Portfolio", to: "/", hash: "#portfolio" },
  { label: "FAQ", to: "/", hash: "#faq" },
  { label: "Contact", to: "/", hash: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { settings } = useContent();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (hash) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
      return;
    }
    const el = document.querySelector(hash);
    if (el) {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80 });
      else el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#080D10]/95 backdrop-blur-sm border-b border-[#23262B]" : "bg-transparent"
      }`}
    >
      <nav className="veyora-container flex items-center justify-between h-20">
        <Link to="/" data-testid="navbar-logo" className="flex flex-col leading-none">
          <span className="font-head font-bold text-lg tracking-[0.18em] text-white">VEYORA</span>
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-[#A3AAB4] mt-0.5">
            Creative Studio
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-9">
          {NAV.map((item) => (
            <button
              key={item.label}
              data-testid={`nav-${item.label.toLowerCase()}`}
              onClick={() => goTo(item.hash)}
              className="font-body text-sm text-[#A3AAB4] hover:text-white transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={waLink(settings?.whatsapp_number)}
            target="_blank"
            rel="noreferrer"
            data-testid="navbar-cta"
            className="btn-primary hidden sm:inline-flex"
          >
            <MessageCircle className="w-4 h-4" />
            Konsultasi Gratis
          </a>
          <button
            className="lg:hidden text-white p-2"
            data-testid="navbar-mobile-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-[#080D10] border-t border-[#23262B]"
          >
            <div className="veyora-container py-6 flex flex-col gap-4">
              {NAV.map((item) => (
                <button
                  key={item.label}
                  data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                  onClick={() => goTo(item.hash)}
                  className="text-left font-body text-base text-[#A3AAB4] hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={waLink(settings?.whatsapp_number)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-2"
              >
                <MessageCircle className="w-4 h-4" /> Konsultasi Gratis
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
