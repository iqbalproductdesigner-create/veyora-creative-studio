import { useMemo, useState } from "react";
import { Check, X, Search } from "lucide-react";

// Searchable multi-select. options: [{value,label}], selected: string[]
export default function MultiSelect({ label, options, selected, onChange, placeholder = "Cari..." }) {
  const [q, setQ] = useState("");
  const sel = selected || [];
  const filtered = useMemo(
    () => (options || []).filter((o) => o.label.toLowerCase().includes(q.toLowerCase())),
    [options, q]
  );
  const toggle = (v) => onChange(sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]);
  const labelOf = (v) => (options || []).find((o) => o.value === v)?.label || v;

  return (
    <div>
      <span className="font-body text-sm text-[#A3AAB4] mb-2 block">{label}</span>
      {sel.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {sel.map((v) => (
            <span key={v} className="inline-flex items-center gap-1.5 bg-[#5C6773] text-white text-xs rounded-full px-3 py-1">
              {labelOf(v)}
              <button type="button" onClick={() => toggle(v)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
      <div className="relative mb-2">
        <Search className="w-4 h-4 text-[#A3AAB4] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#080D10] border border-[#23262B] rounded-lg pl-9 pr-3 py-2 text-white font-body text-sm focus:border-[#5C6773] outline-none"
        />
      </div>
      <div className="max-h-44 overflow-y-auto border border-[#23262B] rounded-lg divide-y divide-[#23262B]">
        {filtered.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className="w-full flex items-center justify-between px-3 py-2 text-left font-body text-sm text-[#D9DEE6] hover:bg-[#080D10] transition-colors"
          >
            {o.label}
            {sel.includes(o.value) && <Check className="w-4 h-4 text-[#5C6773]" />}
          </button>
        ))}
        {filtered.length === 0 && <p className="px-3 py-3 text-xs text-[#A3AAB4] font-body">Tidak ada hasil.</p>}
      </div>
    </div>
  );
}
