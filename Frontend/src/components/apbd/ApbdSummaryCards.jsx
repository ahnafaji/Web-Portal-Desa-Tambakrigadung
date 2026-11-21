import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { formatRupiah } from "../../utils/format.js";

const SUMMARY_ICONS = {
  arrowDown: ArrowDownLeft,
  arrowUp: ArrowUpRight,
  wallet: Wallet,
};

export default function ApbdSummaryCards({ items }) {
  return (
    <section className="apbd-summary-grid" aria-label="Ringkasan Anggaran Desa">
      {items.map((item) => {
        const Icon = SUMMARY_ICONS[item.ikon] || Wallet;
        return (
          <article className={`apbd-summary-card apbd-summary-card--${item.key}`} key={item.key}>
            <div className="apbd-summary-card__top">
              <span className="apbd-summary-card__icon">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="apbd-summary-card__label">{item.label}</span>
            </div>

            <strong className="apbd-summary-card__amount">
              {formatRupiah(item.nominal)}
            </strong>
            <p className="apbd-summary-card__note">{item.keterangan}</p>
          </article>
        );
      })}
    </section>
  );
}