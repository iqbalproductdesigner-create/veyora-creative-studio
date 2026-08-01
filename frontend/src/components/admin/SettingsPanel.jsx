import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Field, Area } from "./fields";

export default function SettingsPanel() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setData({ social_links: {}, ...r.data }));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setSocial = (k, v) => setData((d) => ({ ...d, social_links: { ...d.social_links, [k]: v } }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", data);
      toast.success("Pengaturan tersimpan");
    } catch {
      toast.error("Gagal menyimpan");
    }
    setSaving(false);
  };

  if (!data) return <div className="text-[#A3AAB4] font-body">Memuat...</div>;
  const s = data.social_links || {};

  return (
    <div className="max-w-3xl space-y-6" data-testid="panel-settings">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nama Bisnis" value={data.business_name} onChange={(v) => set("business_name", v)} testid="st-name" />
        <Field label="Tagline" value={data.tagline} onChange={(v) => set("tagline", v)} />
      </div>
      <Field label="Nomor WhatsApp (cth: 6285xxx)" value={data.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} testid="st-wa" />
      <Area label="Info Footer" value={data.footer_info} onChange={(v) => set("footer_info", v)} />
      <div className="border-t border-[#23262B] pt-6">
        <p className="font-head text-white mb-4">Media Sosial</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Instagram" value={s.instagram} onChange={(v) => setSocial("instagram", v)} />
          <Field label="TikTok" value={s.tiktok} onChange={(v) => setSocial("tiktok", v)} />
          <Field label="Behance" value={s.behance} onChange={(v) => setSocial("behance", v)} />
          <Field label="LinkedIn" value={s.linkedin} onChange={(v) => setSocial("linkedin", v)} />
        </div>
      </div>
      <div className="border-t border-[#23262B] pt-6 space-y-4">
        <p className="font-head text-white">SEO Default</p>
        <Field label="Meta Title" value={data.default_seo_title} onChange={(v) => set("default_seo_title", v)} />
        <Area label="Meta Description" value={data.default_seo_description} onChange={(v) => set("default_seo_description", v)} rows={3} />
      </div>
      <button onClick={save} disabled={saving} data-testid="st-save" className="btn-primary">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
      </button>
    </div>
  );
}
