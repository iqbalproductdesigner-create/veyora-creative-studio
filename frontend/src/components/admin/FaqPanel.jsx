import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field, Area } from "./fields";
import SortableList from "./SortableList";

const empty = { question: "", answer: "", category: "Umum", order: 0 };

export default function FaqPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/faqs").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleReorder = (ids) => {
    setItems((prev) => ids.map((id) => prev.find((x) => x.id === id)));
    api.put("/admin/reorder/faqs", { ids }).then(() => toast.success("Urutan diperbarui")).catch(() => toast.error("Gagal mengurutkan"));
  };

  const save = async () => {
    setSaving(true);
    try {
      if (items.find((x) => x.id === editing.id)) {
        await api.put(`/admin/faqs/${editing.id}`, editing);
      } else {
        await api.post("/admin/faqs", editing);
      }
      toast.success("FAQ tersimpan");
      setEditing(null);
      await load();
    } catch {
      toast.error("Gagal menyimpan");
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus FAQ ini?")) return;
    await api.delete(`/admin/faqs/${id}`);
    toast.success("FAQ dihapus");
    load();
  };

  return (
    <div data-testid="panel-faq">
      {!editing ? (
        <>
          <button onClick={() => setEditing({ ...empty, order: items.length })} data-testid="faq-add" className="btn-primary mb-6">
            <Plus className="w-4 h-4" /> Tambah FAQ
          </button>
          <p className="font-body text-xs text-[#A3AAB4] mb-3">Seret kartu untuk mengubah urutan tampil di website.</p>
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(f) => (
              <div className="surface-card px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-head text-white truncate">{f.question}</p>
                  <p className="font-body text-xs text-[#A3AAB4] mt-1">{f.category}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(f)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-white transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(f.id)} className="w-9 h-9 rounded-lg border border-[#23262B] grid place-items-center text-[#A3AAB4] hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          />
        </>
      ) : (
        <div className="max-w-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-head text-white text-lg">{editing.question ? "Edit FAQ" : "FAQ Baru"}</h3>
            <button onClick={() => setEditing(null)} className="text-[#A3AAB4] hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <Field label="Pertanyaan" value={editing.question} onChange={(v) => setEditing({ ...editing, question: v })} testid="faq-question" />
          <Area label="Jawaban" value={editing.answer} onChange={(v) => setEditing({ ...editing, answer: v })} testid="faq-answer" />
          <Field label="Kategori" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
          <button onClick={save} disabled={saving} data-testid="faq-save" className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </div>
      )}
    </div>
  );
}
