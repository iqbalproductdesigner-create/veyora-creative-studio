// Build a WhatsApp consultation link from settings number.
export function waLink(number, message) {
  const clean = (number || "6285177881357").replace(/[^0-9]/g, "");
  const text = encodeURIComponent(
    message || "Halo Veyora Creative Studio, saya ingin konsultasi gratis untuk kebutuhan desain bisnis saya."
  );
  return `https://wa.me/${clean}?text=${text}`;
}

// Dynamic, pre-filled message tailored to a selected service.
export function serviceWaMessage(serviceTitle) {
  return (
    `Halo Veyora Creative Studio,\n\n` +
    `Saya tertarik dengan layanan *${serviceTitle}* dan ingin mendiskusikan kebutuhan bisnis saya.\n\n` +
    `Boleh dibantu informasi mengenai proses, harga, dan estimasi waktu pengerjaannya?\n\n` +
    `Terima kasih.`
  );
}
