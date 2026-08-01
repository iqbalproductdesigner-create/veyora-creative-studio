import { Plus, Trash2 } from "lucide-react";

export function Field({ label, value, onChange, placeholder, type = "text", testid }) {
  return (
    <label className="block">
      <span className="font-body text-sm text-[#A3AAB4] mb-2 block">{label}</span>
      <input
        data-testid={testid}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#080D10] border border-[#23262B] rounded-xl px-4 py-2.5 text-white font-body text-sm focus:border-[#5C6773] outline-none transition-colors"
      />
    </label>
  );
}

export function Area({ label, value, onChange, placeholder, rows = 4, testid }) {
  return (
    <label className="block">
      <span className="font-body text-sm text-[#A3AAB4] mb-2 block">{label}</span>
      <textarea
        data-testid={testid}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#080D10] border border-[#23262B] rounded-xl px-4 py-2.5 text-white font-body text-sm focus:border-[#5C6773] outline-none transition-colors resize-y"
      />
    </label>
  );
}

// Editor for an array of strings.
export function StringList({ label, items, onChange, placeholder }) {
  const list = items || [];
  const update = (i, v) => onChange(list.map((x, idx) => (idx === i ? v : x)));
  const add = () => onChange([...list, ""]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-sm text-[#A3AAB4]">{label}</span>
        <button type="button" onClick={add} className="text-xs text-[#5C6773] hover:text-white flex items-center gap-1 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-[#080D10] border border-[#23262B] rounded-lg px-3 py-2 text-white font-body text-sm focus:border-[#5C6773] outline-none"
            />
            <button type="button" onClick={() => remove(i)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Editor for an array of objects (fields: [{key,label,placeholder}]).
export function ObjectList({ label, items, onChange, fields, template }) {
  const list = items || [];
  const update = (i, key, v) => onChange(list.map((x, idx) => (idx === i ? { ...x, [key]: v } : x)));
  const add = () => onChange([...list, { ...template }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-sm text-[#A3AAB4]">{label}</span>
        <button type="button" onClick={add} className="text-xs text-[#5C6773] hover:text-white flex items-center gap-1 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>
      <div className="space-y-3">
        {list.map((obj, i) => (
          <div key={i} className="border border-[#23262B] rounded-xl p-4 relative">
            <button type="button" onClick={() => remove(i)} className="absolute top-3 right-3 text-[#A3AAB4] hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 gap-3 pr-6">
              {fields.map((f) => (
                f.type === "list" ? (
                  <StringList key={f.key} label={f.label} items={obj[f.key]} onChange={(v) => update(i, f.key, v)} placeholder={f.placeholder} />
                ) : f.type === "area" ? (
                  <Area key={f.key} label={f.label} value={obj[f.key]} onChange={(v) => update(i, f.key, v)} placeholder={f.placeholder} rows={3} />
                ) : (
                  <Field key={f.key} label={f.label} value={obj[f.key]} onChange={(v) => update(i, f.key, v)} placeholder={f.placeholder} />
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
