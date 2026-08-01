import { MessageCircle } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { waLink } from "../../lib/whatsapp";
import { trackWhatsApp } from "./Analytics";

export default function WhatsAppFloat() {
  const { settings } = useContent();
  return (
    <a
      href={waLink(settings?.whatsapp_number)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackWhatsApp("float")}
      data-analytics="whatsapp"
      data-testid="whatsapp-float"
      aria-label="Konsultasi via WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#5C6773] grid place-items-center shadow-[0_0_24px_rgba(92,103,115,0.4)] hover:brightness-110 active:scale-95 transition-all"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  );
}
