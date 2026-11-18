import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SectionHead({ title, subtitle, to, cta }) {
  return (
    <div className="section-head">
      <div className="section-head__text">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {to && (
        <Link to={to} className="btn">
          {cta} <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
