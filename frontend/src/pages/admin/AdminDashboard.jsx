import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, Image, HelpCircle, Settings, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import HomepagePanel from "../../components/admin/HomepagePanel";
import ServicesPanel from "../../components/admin/ServicesPanel";
import PortfolioPanel from "../../components/admin/PortfolioPanel";
import FaqPanel from "../../components/admin/FaqPanel";
import SettingsPanel from "../../components/admin/SettingsPanel";

const TABS = [
  { id: "homepage", label: "Homepage", icon: LayoutDashboard, Comp: HomepagePanel },
  { id: "services", label: "Layanan", icon: Briefcase, Comp: ServicesPanel },
  { id: "portfolio", label: "Portfolio", icon: Image, Comp: PortfolioPanel },
  { id: "faq", label: "FAQ", icon: HelpCircle, Comp: FaqPanel },
  { id: "settings", label: "Pengaturan", icon: Settings, Comp: SettingsPanel },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("homepage");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ActiveComp = TABS.find((t) => t.id === active).Comp;

  return (
    <div className="min-h-screen bg-[#080D10] flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121417] border-r border-[#23262B] flex flex-col fixed h-full">
        <div className="px-6 py-6 border-b border-[#23262B]">
          <span className="font-head font-bold text-lg tracking-[0.18em] text-white">VEYORA</span>
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#A3AAB4] mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              data-testid={`admin-tab-${t.id}`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-colors ${
                active === t.id ? "bg-[#5C6773] text-white" : "text-[#A3AAB4] hover:text-white hover:bg-[#080D10]"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[#23262B] space-y-1">
          <button onClick={() => window.open("/", "_blank")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-[#A3AAB4] hover:text-white hover:bg-[#080D10] transition-colors">
            <ExternalLink className="w-4 h-4" /> Lihat Website
          </button>
          <button onClick={() => { logout(); navigate("/admin/login"); }} data-testid="admin-logout" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-[#A3AAB4] hover:text-red-400 hover:bg-[#080D10] transition-colors">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        <h1 className="font-head font-bold text-white text-2xl md:text-3xl mb-8 capitalize">
          {TABS.find((t) => t.id === active).label}
        </h1>
        <ActiveComp />
      </main>
    </div>
  );
}
