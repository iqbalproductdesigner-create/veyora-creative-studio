import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, MessageCircle, Clock } from "lucide-react";
import { waLink } from "../../lib/whatsapp";
import { trackWhatsApp } from "../site/Analytics";

const parsePrice = (s) => Number(String(s || "").replace(/[^0-9]/g, "")) || 0;
const formatRupiah = (n) => "Rp" + n.toLocaleString("id-ID");

export default function ServiceOrderSummary({ service, whatsappNumber }) {
  const packages = useMemo(() => service.pricing || [], [service.pricing]);
  const addons = useMemo(() => service.addons || [], [service.addons]);
  const [pkgIndex, setPkgIndex] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]); // indices

  const toggleAddon = (i) =>
    setSelectedAddons((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const pkg = packages[pkgIndex];
  const addonsTotal = selectedAddons.reduce((sum, i) => sum + parsePrice(addons[i]?.price), 0);
  const total = parsePrice(pkg?.price) + addonsTotal;

  const message = useMemo(() => {
    const lines = [
      "Halo Veyora Creative Studio,",
      "",
      `Saya ingin memesan layanan *${service.title}* dengan konfigurasi berikut:`,
      "",
    ];
    if (pkg) lines.push(`• Paket: ${pkg.name} (${pkg.price})`);
    if (selectedAddons.length) {
      lines.push("• Add-ons:");
      selectedAddons.forEach((i) => lines.push(`   - ${addons[i].name} (${addons[i].price})`));
    } else {
      lines.push("• Add-ons: -");
    }
    lines.push("", `*Estimasi Total: ${formatRupiah(total)}*`, "");
    lines.push("Mohon dibantu info mengenai proses dan langkah selanjutnya. Terima kasih.");
    return lines.join("\n");
  }, [service.title, pkg, selectedAddons, addons, total]);

  const href = waLink(whatsappNumber, message);

  const Card = (
    <div className="surface-card p-6" data-testid="order-summary-card">
      <p className="eyebrow mb-4">Susun Pesananmu</p>

      {/* Package tabs */}
      {packages.length > 0 && (
        <div className="flex gap-2 p-1 rounded-xl bg-[#080D10] border border-[#23262B] mb-5">
          {packages.map((p, i) => (
            <button
              key={i}
              data-testid={`pkg-tab-${i}`}
              onClick={() => setPkgIndex(i)}
              className={`flex-1 rounded-lg py-2 text-xs font-body font-medium transition-colors ${
                pkgIndex === i ? "bg-[#5C6773] text-white" : "text-[#A3AAB4] hover:text-white"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {pkg && (
        <motion.div key={pkgIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="flex items-baseline justify-between">
            <span className="font-head text-white text-lg">{pkg.name}</span>
            <span className="font-head text-white text-2xl">{pkg.price}</span>
          </div>
          {pkg.description && <p className="font-body text-sm text-[#A3AAB4] mt-2">{pkg.description}</p>}
          {service.estimated_time && (
            <p className="flex items-center gap-1.5 font-body text-xs text-[#A3AAB4] mt-3">
              <Clock className="w-3.5 h-3.5" /> Estimasi {service.estimated_time}
            </p>
          )}
          <ul className="mt-4 space-y-2.5">
            {(pkg.features || []).map((f, j) => (
              <li key={j} className="flex items-start gap-2.5 font-body text-sm text-[#D9DEE6]">
                <Check className="w-4 h-4 text-[#5C6773] mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Add-ons */}
      {addons.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#23262B]">
          <p className="font-body text-sm text-white mb-3">Tambahan opsional</p>
          <div className="space-y-2">
            {addons.map((a, i) => {
              const checked = selectedAddons.includes(i);
              return (
                <button
                  key={i}
                  data-testid={`addon-${i}`}
                  onClick={() => toggleAddon(i)}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    checked ? "border-[#5C6773] bg-[#5C6773]/10" : "border-[#23262B] hover:border-[#3a3e45]"
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className={`w-5 h-5 rounded-md border grid place-items-center shrink-0 ${checked ? "bg-[#5C6773] border-[#5C6773]" : "border-[#3a3e45]"}`}>
                      {checked && <Check className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <span className="font-body text-sm text-[#D9DEE6] truncate">{a.name}</span>
                  </span>
                  <span className="font-body text-sm text-white shrink-0">{a.price}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-[#23262B] flex items-center justify-between">
        <span className="font-body text-sm text-[#A3AAB4]">Estimasi Total</span>
        <span data-testid="order-total" className="font-head text-white text-2xl">{formatRupiah(total)}</span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsApp(`service-config:${service.slug}`)}
        data-analytics="whatsapp"
        data-testid="continue-whatsapp"
        className="btn-primary w-full mt-5"
      >
        <MessageCircle className="w-4 h-4" /> Lanjutkan via WhatsApp
      </a>
      <p className="font-body text-xs text-[#A3AAB4] text-center mt-3">
        Gratis konsultasi · Tanpa komitmen · Balasan cepat
      </p>
    </div>
  );

  return (
    <>
      <div className="lg:sticky lg:top-28">{Card}</div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#121417]/95 backdrop-blur-sm border-t border-[#23262B] px-4 py-3" data-testid="mobile-order-bar">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-[#A3AAB4]">Estimasi Total</p>
            <p className="font-head text-white text-lg leading-none mt-0.5">{formatRupiah(total)}</p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp(`service-config-mobile:${service.slug}`)}
            data-analytics="whatsapp"
            data-testid="continue-whatsapp-mobile"
            className="btn-primary flex-1 max-w-[220px] justify-center"
          >
            <MessageCircle className="w-4 h-4" /> Lanjutkan
          </a>
        </div>
      </div>
    </>
  );
}
