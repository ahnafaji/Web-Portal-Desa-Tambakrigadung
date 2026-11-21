import { Users, User, UserRound, ShoppingCart, Trophy, Landmark, UsersRound } from "lucide-react";
import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";
import { formatAngka } from "../../utils/format.js";

const ICONS = { users: Users, user: User, male: UserRound, female: UserRound, cart: ShoppingCart, trophy: Trophy, building: Landmark, group: UsersRound };

export default function StatsSection() {
  const state = useFetch(api.getStatistik);
  return (
    <section className="section container" aria-labelledby="judul-statistik">
      <div className="line-title"><h2 id="judul-statistik">Data Kependudukan</h2></div>
      <AsyncBlock state={state}>
        {(items) => (
          <div className="stats">
            {items.map((s) => {
              const Icon = ICONS[s.icon] || Users;
              return (
                <div className="stat" key={s.key}>
                  <span className="stat__icon" style={{ background: s.color }}><Icon size={20} /></span>
                  <div>
                    <p className="stat__value" style={{ color: s.color }}>{formatAngka(s.value)}</p>
                    <p className="stat__label">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AsyncBlock>
    </section>
  );
}
