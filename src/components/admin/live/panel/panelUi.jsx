// Small building blocks shared by the visitor panel tabs.

export function Pill({ meta, children }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${meta?.pill || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {children || meta?.label}
    </span>
  );
}

export function SectionCard({ title, icon: Icon, children, right }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          {Icon && <span className="p-1.5 rounded-lg bg-blue-50 text-brand-blue"><Icon className="w-4 h-4" /></span>}
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-[13px]">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="font-semibold text-slate-800 text-right min-w-0 break-words">{children}</span>
    </div>
  );
}
