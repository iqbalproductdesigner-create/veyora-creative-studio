import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field, Area, StringList, ObjectList } from "./fields";

const empty = {
  title: "", slug: "", category: "Packaging", thumbnail: "", hero_image: "",
  short_description: "", full_description: "", starting_price: "", estimated_time: "",
  benefits: [], pricing: [], addons: [], faqs: [], related_portfolio: [],
  seo_title: "", seo_description: "", order: 0,
};

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ServicesPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/services").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v }));

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((s) => (
              <div key={s.id} className="surface-card overflow-hidden flex">
                <img src={s.thumbnail} alt={s.title} className="w-24 h-24 object-cover" />
                <div className="flex-1 p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-head text-white truncate">{s.title}</p>
                    <p className="font-body text-xs text-[#A3AAB4] mt-1">{s.category} · {s.starting_price}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditing(s)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(s.id)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
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
            <h3 className="font-head text-white text-lg">{editing.title ? "Edit Layanan" : "Layanan Baru"}</h3>
            <button onClick={() => setEditing(null)} className="text-[#A3AAB4] hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Judul" value={editing.title} onChange={(v) => set("title", v)} testid="service-title" />
            <Field label="Slug (opsional)" value={editing.slug} onChange={(v) => set("slug", v)} placeholder="otomatis dari judul" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori" value={editing.category} onChange={(v) => set("category", v)} />
            <Field label="Urutan" type="number" value={editing.order} onChange={(v) => set("order", parseInt(v) || 0)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Harga Mulai" value={editing.starting_price} onChange={(v) => set("starting_price", v)} />
            <Field label="Estimasi Waktu" value={editing.estimated_time} onChange={(v) => set("estimated_time", v)} />
          </div>
          <Field label="Thumbnail (URL)" value={editing.thumbnail} onChange={(v) => set("thumbnail", v)} />
          <Field label="Hero Image (URL)" value={editing.hero_image} onChange={(v) => set("hero_image", v)} />
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
            <Field label="SEO Title" value={editing.seo_title} onChange={(v) => set("seo_title", v)} />
            <Area label="SEO Description" value={editing.seo_description} onChange={(v) => set("seo_description", v)} rows={2} />
          </div>
          <button onClick={save} disabled={saving} data-testid="service-save" className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </div>
      )}
    </div>
  );
}
