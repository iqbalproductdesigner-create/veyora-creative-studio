import { AlertTriangle } from "lucide-react";

export default function DraftBanner({ show }) {
  if (!show) return null;
  return (
    <div data-testid="draft-banner" className="fixed top-20 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 bg-[#5C6773] text-white text-sm font-body rounded-full px-5 py-2 shadow-lg">
        <AlertTriangle className="w-4 h-4" />
        Mode Pratinjau — konten ini masih berstatus Draft dan belum tayang untuk publik.
      </div>
    </div>
  );
}
