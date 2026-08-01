import { useRef, useState } from "react";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "../../lib/api";

async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/admin/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

// Single image field: preview + upload + optional URL paste.
export function ImageUpload({ label, value, onChange, testid }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success("Gambar terunggah");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Gagal mengunggah");
    }
    setLoading(false);
    e.target.value = "";
  };

  return (
    <div>
      <span className="font-body text-sm text-[#A3AAB4] mb-2 block">{label}</span>
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 rounded-xl border border-[#23262B] bg-[#080D10] overflow-hidden grid place-items-center shrink-0">
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#3a3e45]" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              data-testid={testid}
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="btn-secondary !py-2 !px-4 text-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Unggah
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="atau tempel URL gambar"
            className="w-full bg-[#080D10] border border-[#23262B] rounded-lg px-3 py-2 text-white font-body text-xs focus:border-[#5C6773] outline-none"
          />
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

// Multiple images (gallery).
export function GalleryUpload({ label, items, onChange }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const list = items || [];

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setLoading(true);
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadFile(f));
      onChange([...list, ...urls]);
      toast.success(`${urls.length} gambar terunggah`);
    } catch (err) {
      toast.error("Gagal mengunggah sebagian gambar");
    }
    setLoading(false);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-sm text-[#A3AAB4]">{label}</span>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={loading} className="text-xs text-[#5C6773] hover:text-white flex items-center gap-1 transition-colors">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} Unggah gambar
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {list.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#23262B] group">
            <img src={url} alt={`g${i}`} className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange(list.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-md bg-black/70 grid place-items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}
