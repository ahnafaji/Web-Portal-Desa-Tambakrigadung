import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";

export default function SambutanSection() {
  const state = useFetch(api.getSambutan);
  return (
    <section className="section section--white">
      <div className="container">
        <AsyncBlock state={state} minHeight={240}>
          {(s) => (
            <div className="sambutan">
              <div className="sambutan__photo"><img src={s.foto} alt={`Foto ${s.jabatan} ${s.nama}`} /></div>
              <div className="sambutan__body">
                <p className="sambutan__kicker">Sambutan {s.jabatan}</p>
                <h2 className="sambutan__name">{s.nama}</h2>
                <p className="sambutan__text">“{s.teks}”</p>
              </div>
            </div>
          )}
        </AsyncBlock>
      </div>
    </section>
  );
}
