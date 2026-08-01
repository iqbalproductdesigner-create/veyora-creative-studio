// Build a WhatsApp consultation link from settings number.
export function waLink(number, message) {
  const clean = (number || "6285177881357").replace(/[^0-9]/g, "");
  const text = encodeURIComponent(
    message || "Halo Veyora, saya ingin konsultasi gratis untuk kebutuhan desain bisnis saya."
  );
  return `https://wa.me/${clean}?text=${text}`;
}
