import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field, Area, StringList } from "./fields";

const empty = {
  project_name: "", category: "Packaging", thumbnail: "", gallery: [],
  overview: "", challenge: "", solution: "", deliverables: [], related_service: "",
  seo_title: "", seo_description: "", order: 0,
};

export default function PortfolioPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/portfolio").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (items.find((x) => x.id === editing.id)) {
        await api.put(`/admin/portfolio/${editing.id}`, editing);
      } else {
        await api.post("/admin/portfolio", editing);
      }
      toast.success("Portfolio tersimpan");
      setEditing(null);
      await load();
    } catch {
      toast.error("Gagal menyimpan");
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus portfolio ini?")) return;
    await api.delete(`/admin/portfolio/${id}`);
    toast.success("Portfolio dihapus");
    load();
  };

  return (
    <div data-testid="panel-portfolio">
      {!editing ? (
        <>
          <button onClick={() => setEditing({ ...empty, order: items.length })} data-testid="portfolio-add" className="btn-primary mb-6">
            <Plus className="w-4 h-4" /> Tambah Portfolio
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((p) => (
              <div key={p.id} className="surface-card overflow-hidden flex">
                <img src={p.thumbnail} alt={p.project_name} className="w-24 h-24 object-cover" />
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-head text-white truncate">{p.project_name}</p>
                    <p className="font-body text-xs text-[#A3AAB4] mt-1">{p.category}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditing(p)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(p.id)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-head text-white text-lg">{editing.project_name ? "Edit Portfolio" : "Portfolio Baru"}</h3>
            <button onClick={() => setEditing(null)} className="text-[#A3AAB4] hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Proyek" value={editing.project_name} onChange={(v) => set("project_name", v)} testid="portfolio-name" />
            <Field label="Kategori" value={editing.category} onChange={(v) => set("category", v)} />
          </div>
          <Field label="Thumbnail (URL)" value={editing.thumbnail} onChange={(v) => set("thumbnail", v)} />
          <StringList label="Galeri (URL gambar)" items={editing.gallery} onChange={(v) => set("gallery", v)} placeholder="https://..." />
          <Area label="Overview" value={editing.overview} onChange={(v) => set("overview", v)} rows={2} />
          <Area label="Tantangan" value={editing.challenge} onChange={(v) => set("challenge", v)} rows={2} />
          <Area label="Solusi" value={editing.solution} onChange={(v) => set("solution", v)} rows={2} />
          <StringList label="Deliverables" items={editing.deliverables} onChange={(v) => set("deliverables", v)} placeholder="Item" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Layanan Terkait (slug)" value={editing.related_service} onChange={(v) => set("related_service", v)} />
            <Field label="Urutan" type="number" value={editing.order} onChange={(v) => set("order", parseInt(v) || 0)} />
          </div>
          <div className="border-t border-[#23262B] pt-5 space-y-4">
            <Field label="SEO Title" value={editing.seo_title} onChange={(v) => set("seo_title", v)} />
            <Area label="SEO Description" value={editing.seo_description} onChange={(v) => set("seo_description", v)} rows={2} />
          </div>
          <button onClick={save} disabled={saving} data-testid="portfolio-save" className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </div>
      )}
    </div>
  );
}
