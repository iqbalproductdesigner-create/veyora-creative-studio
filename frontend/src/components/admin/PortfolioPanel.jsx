import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field, Area, StringList } from "./fields";
import { ImageUpload, GalleryUpload } from "./ImageUpload";
import MultiSelect from "./MultiSelect";
import SortableList from "./SortableList";

const empty = {
  project_name: "", category: "Packaging", thumbnail: "", gallery: [],
  overview: "", challenge: "", solution: "", deliverables: [], related_service: "", related_services: [],
  seo_title: "", seo_description: "", og_image: "", status: "published", order: 0,
};

export default function PortfolioPanel() {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/admin/portfolio").then((r) => setItems(r.data));
  useEffect(() => {
    load();
    api.get("/admin/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);

  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v }));

  const handleReorder = (ids) => {
    setItems((prev) => ids.map((id) => prev.find((x) => x.id === id)));
    api.put("/admin/reorder/portfolio", { ids }).then(() => toast.success("Urutan diperbarui")).catch(() => toast.error("Gagal mengurutkan"));
  };

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
          <p className="font-body text-xs text-[#A3AAB4] mb-3">Seret kartu untuk mengubah urutan tampil di website.</p>
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(p) => (
              <div className="surface-card overflow-hidden flex">
                <img src={p.thumbnail} alt={p.project_name} className="w-24 h-24 object-cover" />
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-head text-white truncate">{p.project_name}</p>
                      <span className={`text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5 shrink-0 ${p.status === "draft" ? "bg-[#23262B] text-[#A3AAB4]" : "bg-[#5C6773] text-white"}`}>
                        {p.status === "draft" ? "Draft" : "Publish"}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#A3AAB4] mt-1">{p.category}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={`/portfolio/${p.slug}${p.status === "draft" ? "?preview=1" : ""}`} target="_blank" rel="noreferrer" title="Pratinjau" data-testid={`portfolio-preview-${p.slug}`} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => setEditing(p)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(p.id)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </>
      ) : (
        <div className="max-w-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-head text-white text-lg">{editing.project_name ? "Edit Portfolio" : "Portfolio Baru"}</h3>
            <button onClick={() => setEditing(null)} className="text-[#A3AAB4] hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Nama Proyek" value={editing.project_name} onChange={(v) => set("project_name", v)} testid="portfolio-name" />
            <Field label="Kategori" value={editing.category} onChange={(v) => set("category", v)} />
            <label className="block">
              <span className="font-body text-sm text-[#A3AAB4] mb-2 block">Status</span>
              <select
                data-testid="portfolio-status"
                value={editing.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full bg-[#080D10] border border-[#23262B] rounded-xl px-4 py-2.5 text-white font-body text-sm focus:border-[#5C6773] outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>
          <ImageUpload label="Thumbnail" value={editing.thumbnail} onChange={(v) => set("thumbnail", v)} testid="portfolio-thumb-upload" />
          <GalleryUpload label="Galeri" items={editing.gallery} onChange={(v) => set("gallery", v)} />
          <Area label="Overview" value={editing.overview} onChange={(v) => set("overview", v)} rows={2} />
          <Area label="Tantangan" value={editing.challenge} onChange={(v) => set("challenge", v)} rows={2} />
          <Area label="Solusi" value={editing.solution} onChange={(v) => set("solution", v)} rows={2} />
          <StringList label="Deliverables" items={editing.deliverables} onChange={(v) => set("deliverables", v)} placeholder="Item" />
          <MultiSelect
            label="Layanan Terkait"
            options={(services || []).map((s) => ({ value: s.slug, label: s.title }))}
            selected={editing.related_services}
            onChange={(v) => set("related_services", v)}
            placeholder="Cari layanan..."
          />
          <div className="border-t border-[#23262B] pt-5 space-y-4">
            <p className="font-head text-white">SEO</p>
            <Field label="SEO Title" value={editing.seo_title} onChange={(v) => set("seo_title", v)} />
            <Area label="SEO Description" value={editing.seo_description} onChange={(v) => set("seo_description", v)} rows={2} />
            <ImageUpload label="Open Graph Image" value={editing.og_image} onChange={(v) => set("og_image", v)} />
          </div>
          <button onClick={save} disabled={saving} data-testid="portfolio-save" className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </div>
      )}
    </div>
  );
}
