const WORDS = [
  "Creative Partner",
  "Brand Identity",
  "Visual Design",
  "Packaging",
  "Motion",
  "Trust",
];

// Slow editorial outline marquee.
export default function Marquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-[#23262B] py-8 md:py-10 select-none" data-testid="marquee">
      <div className="marquee-track">
        {items.map((w, i) => (
          <span key={i} className="flex items-center">
            <span
              className="font-editorial text-4xl md:text-6xl px-8 whitespace-nowrap"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px #23262B",
              }}
            >
              {w}
            </span>
            <span className="text-[#5C6773] text-2xl px-2">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
