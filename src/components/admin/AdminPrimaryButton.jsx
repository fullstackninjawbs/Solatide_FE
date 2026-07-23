import { Link } from "react-router-dom";

export function AdminPrimaryButton({ to, href, onClick, children, className, disabled, type = "button" }) {
  const base =
    "bg-cta-gradient hover:bg-cta-gradient-hover text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-cta hover:shadow-cta-hover flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

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
