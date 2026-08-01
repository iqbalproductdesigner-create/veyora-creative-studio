import { Link } from "react-router-dom";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { waLink } from "../../lib/whatsapp";

export default function Footer() {
  const { settings, services } = useContent();
  const social = settings?.social_links || {};

  return (
    <footer id="contact" data-testid="footer" className="border-t border-[#23262B] bg-[#080D10]">
      <div className="veyora-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex flex-col leading-none mb-5">
              <span className="font-head font-bold text-xl tracking-[0.18em] text-white">VEYORA</span>
              <span className="font-body text-[10px] uppercase tracking-[0.35em] text-[#A3AAB4] mt-1">
                Creative Studio
              </span>
            </div>
            <p className="font-body text-sm text-[#A3AAB4] leading-relaxed max-w-xs">
              {settings?.footer_info}
            </p>
          </div>

          <div>
            <h4 className="font-head text-white text-sm mb-5 uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-3 font-body text-sm text-[#A3AAB4]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/#services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/#portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-head text-white text-sm mb-5 uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-3 font-body text-sm text-[#A3AAB4]">
              {(services || []).slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.slug}`} className="hover:text-white transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-head text-white text-sm mb-5 uppercase tracking-wider">Hubungi Kami</h4>
            <a
              href={waLink(settings?.whatsapp_number)}
              target="_blank"
              rel="noreferrer"
              data-testid="footer-whatsapp"
              className="inline-flex items-center gap-2 font-body text-sm text-white hover:text-[#D9DEE6] transition-colors mb-5"
            >
              <MessageCircle className="w-4 h-4" /> +{settings?.whatsapp_number}
            </a>
            <div className="flex items-center gap-3 mt-2">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                   className="w-10 h-10 rounded-full border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white hover:border-[#3a3e45] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                   className="w-10 h-10 rounded-full border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white hover:border-[#3a3e45] transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#23262B] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-[#A3AAB4]">
            © {new Date().getFullYear()} {settings?.business_name}. Semua hak dilindungi.
          </p>
          <p className="font-body text-xs text-[#A3AAB4]">
            Dibuat dengan sepenuh hati untuk brand lokal.
          </p>
        </div>
      </div>
    </footer>
  );
}
