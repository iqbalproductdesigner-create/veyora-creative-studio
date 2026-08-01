import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field } from "./fields";
import SortableList from "./SortableList";

const empty = { name: "", slug: "", visible: true, order: 0 };

export default function CategoriesPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/admin/categories").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleReorder = (ids) => {
    setItems((prev) => ids.map((id) => prev.find((x) => x.id === id)));
    api.put("/admin/reorder/categories", { ids }).then(() => toast.success("Urutan diperbarui")).catch(() => toast.error("Gagal mengurutkan"));
  };

  const toggleVisible = async (cat) => {
    const next = { ...cat, visible: !cat.visible };
    setItems((prev) => prev.map((x) => (x.id === cat.id ? next : x)));
    try {
      await api.put(`/admin/categories/${cat.id}`, next);
    } catch {
      toast.error("Gagal memperbarui");
      load();
    }
  };

  const save = async () => {
    if (!editing.name.trim()) { toast.error("Nama kategori wajib diisi"); return; }
    setSaving(true);
    try {
      if (items.find((x) => x.id === editing.id)) {
        await api.put(`/admin/categories/${editing.id}`, editing);
      } else {
        await api.post("/admin/categories", editing);
      }
      toast.success("Kategori tersimpan");
      setEditing(null);
      await load();
    } catch {
      toast.error("Gagal menyimpan");
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus kategori ini? Portfolio dengan kategori ini tidak akan terhapus.")) return;
    await api.delete(`/admin/categories/${id}`);
    toast.success("Kategori dihapus");
    load();
  };

  return (
    <div data-testid="panel-categories">
      {!editing ? (
        <>
          <button onClick={() => setEditing({ ...empty, order: items.length })} data-testid="category-add" className="btn-primary mb-6">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
          <p className="font-body text-xs text-[#A3AAB4] mb-3">Seret untuk mengurutkan filter di beranda. Kategori tersembunyi tidak tampil di website.</p>
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(c) => (
              <div className={`surface-card px-5 py-4 flex items-center justify-between gap-4 ${!c.visible ? "opacity-60" : ""}`}>
                <div className="min-w-0 flex items-center gap-3">
                  <p className="font-head text-white truncate">{c.name}</p>
                  {!c.visible && <span className="text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-[#23262B] text-[#A3AAB4]">Tersembunyi</span>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleVisible(c)} title={c.visible ? "Sembunyikan" : "Tampilkan"} data-testid={`category-toggle-${c.slug}`} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                    {c.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditing(c)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(c.id)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          />
        </>
      ) : (
        <div className="max-w-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-head text-white text-lg">{editing.name ? "Edit Kategori" : "Kategori Baru"}</h3>
            <button onClick={() => setEditing(null)} className="text-[#A3AAB4] hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <Field label="Nama Kategori" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} testid="category-name" />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={editing.visible} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} className="w-4 h-4 accent-[#5C6773]" />
            <span className="font-body text-sm text-[#D9DEE6]">Tampilkan di filter beranda</span>
          </label>
          <button onClick={save} disabled={saving} data-testid="category-save" className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </div>
      )}
    </div>
  );
}
