import { Link } from "react-router-dom";

export function AdminSecondaryButton({ to, href, onClick, children, className, disabled, type = "button" }) {
  const base =
    "bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  if (to) {
    return (
      <Link to={to} className={`${base} ${className ?? ""}`}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${className ?? ""}`}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${className ?? ""}`}>
      {children}
    </button>
  );
}
