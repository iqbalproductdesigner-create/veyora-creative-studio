import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field, Area, ObjectList } from "./fields";

export default function HomepagePanel() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/homepage").then((r) => setData(r.data));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/homepage", data);
      toast.success("Homepage tersimpan");
    } catch {
      toast.error("Gagal menyimpan");
    }
    setSaving(false);
  };

  if (!data) return <div className="text-[#A3AAB4] font-body">Memuat...</div>;

  return (
    <div className="max-w-3xl space-y-6" data-testid="panel-homepage">
      <Field label="Headline" value={data.headline} onChange={(v) => set("headline", v)} testid="hp-headline" />
      <Area label="Deskripsi" value={data.description} onChange={(v) => set("description", v)} testid="hp-desc" />
      <Field label="Hero Image (URL)" value={data.hero_image} onChange={(v) => set("hero_image", v)} />
      {data.hero_image && <img src={data.hero_image} alt="preview" className="w-48 rounded-lg border border-[#23262B]" />}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tombol Utama" value={data.primary_cta} onChange={(v) => set("primary_cta", v)} />
        <Field label="Tombol Sekunder" value={data.secondary_cta} onChange={(v) => set("secondary_cta", v)} />
      </div>
      <ObjectList
        label="Statistik"
        items={data.statistics}
        onChange={(v) => set("statistics", v)}
        fields={[{ key: "value", label: "Angka" }, { key: "label", label: "Keterangan" }]}
        template={{ value: "", label: "" }}
      />
      <button onClick={save} disabled={saving} data-testid="hp-save" className="btn-primary">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
      </button>
    </div>
  );
}
