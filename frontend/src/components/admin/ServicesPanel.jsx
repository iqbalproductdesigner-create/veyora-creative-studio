import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field, Area, StringList, ObjectList } from "./fields";
import { ImageUpload } from "./ImageUpload";
import SortableList from "./SortableList";

const empty = {
  title: "", slug: "", category: "Packaging", thumbnail: "", hero_image: "",
  short_description: "", full_description: "", starting_price: "", estimated_time: "",
  benefits: [], pricing: [], addons: [], faqs: [], related_portfolio: [],
  seo_title: "", seo_description: "", og_image: "", status: "published", order: 0,
};

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ServicesPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/admin/services").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const isNew = editing && !items.find((x) => x.id === editing.id);
  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v }));
  const setTitle = (v) => setEditing((e) => ({ ...e, title: v, slug: isNew ? slugify(v) : e.slug }));

  const handleReorder = (ids) => {
    setItems((prev) => ids.map((id) => prev.find((x) => x.id === id)));
    api.put("/admin/reorder/services", { ids }).then(() => toast.success("Urutan diperbarui")).catch(() => toast.error("Gagal mengurutkan"));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editing, slug: editing.slug || slugify(editing.title) };
      if (items.find((x) => x.id === editing.id)) {
        await api.put(`/admin/services/${editing.id}`, payload);
      } else {
        await api.post("/admin/services", payload);
      }
      toast.success("Layanan tersimpan");
      setEditing(null);
      await load();
    } catch {
      toast.error("Gagal menyimpan");
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus layanan ini?")) return;
    await api.delete(`/admin/services/${id}`);
    toast.success("Layanan dihapus");
    load();
  };

  return (
    <div data-testid="panel-services">
      {!editing ? (
        <>
          <button onClick={() => setEditing({ ...empty, order: items.length })} data-testid="service-add" className="btn-primary mb-6">
            <Plus className="w-4 h-4" /> Tambah Layanan
          </button>
          <p className="font-body text-xs text-[#A3AAB4] mb-3">Seret kartu untuk mengubah urutan tampil di website.</p>
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(s) => (
              <div className="surface-card overflow-hidden flex">
                <img src={s.thumbnail} alt={s.title} className="w-24 h-24 object-cover" />
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-head text-white truncate">{s.title}</p>
                      <span className={`text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5 shrink-0 ${s.status === "draft" ? "bg-[#23262B] text-[#A3AAB4]" : "bg-[#5C6773] text-white"}`}>
                        {s.status === "draft" ? "Draft" : "Publish"}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#A3AAB4] mt-1">{s.category} · {s.starting_price}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={`/services/${s.slug}${s.status === "draft" ? "?preview=1" : ""}`} target="_blank" rel="noreferrer" title="Pratinjau" data-testid={`service-preview-${s.slug}`} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => setEditing(s)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(s.id)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
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
            <h3 className="font-head text-white text-lg">{editing.title ? "Edit Layanan" : "Layanan Baru"}</h3>
            <button onClick={() => setEditing(null)} className="text-[#A3AAB4] hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Judul" value={editing.title} onChange={setTitle} testid="service-title" />
            <Field label="Slug" value={editing.slug} onChange={(v) => set("slug", v)} placeholder="otomatis dari judul" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori" value={editing.category} onChange={(v) => set("category", v)} />
            <label className="block">
              <span className="font-body text-sm text-[#A3AAB4] mb-2 block">Status</span>
              <select
                data-testid="service-status"
                value={editing.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full bg-[#080D10] border border-[#23262B] rounded-xl px-4 py-2.5 text-white font-body text-sm focus:border-[#5C6773] outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Harga Mulai" value={editing.starting_price} onChange={(v) => set("starting_price", v)} />
            <Field label="Estimasi Waktu" value={editing.estimated_time} onChange={(v) => set("estimated_time", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload label="Thumbnail" value={editing.thumbnail} onChange={(v) => set("thumbnail", v)} testid="service-thumb-upload" />
            <ImageUpload label="Hero Image" value={editing.hero_image} onChange={(v) => set("hero_image", v)} />
          </div>
          <Area label="Deskripsi Singkat" value={editing.short_description} onChange={(v) => set("short_description", v)} rows={2} />
          <Area label="Deskripsi Lengkap" value={editing.full_description} onChange={(v) => set("full_description", v)} />
          <StringList label="Manfaat" items={editing.benefits} onChange={(v) => set("benefits", v)} placeholder="Manfaat" />
          <ObjectList label="Paket Harga" items={editing.pricing} onChange={(v) => set("pricing", v)}
            fields={[{ key: "name", label: "Nama Paket" }, { key: "price", label: "Harga" }, { key: "features", label: "Fitur", type: "list" }]}
            template={{ name: "", price: "", features: [] }} />
          <ObjectList label="Layanan Tambahan" items={editing.addons} onChange={(v) => set("addons", v)}
            fields={[{ key: "name", label: "Nama" }, { key: "price", label: "Harga" }]}
            template={{ name: "", price: "" }} />
          <ObjectList label="FAQ Layanan" items={editing.faqs} onChange={(v) => set("faqs", v)}
            fields={[{ key: "question", label: "Pertanyaan" }, { key: "answer", label: "Jawaban", type: "area" }]}
            template={{ question: "", answer: "" }} />
          <div className="border-t border-[#23262B] pt-5 space-y-4">
            <p className="font-head text-white">SEO</p>
            <Field label="SEO Title" value={editing.seo_title} onChange={(v) => set("seo_title", v)} />
            <Area label="SEO Description" value={editing.seo_description} onChange={(v) => set("seo_description", v)} rows={2} />
            <ImageUpload label="Open Graph Image" value={editing.og_image} onChange={(v) => set("og_image", v)} />
          </div>
          <button onClick={save} disabled={saving} data-testid="service-save" className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </div>
      )}
    </div>
  );
}
