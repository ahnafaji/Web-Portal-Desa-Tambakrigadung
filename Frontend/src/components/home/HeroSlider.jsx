import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";

export default function HeroSlider() {
  const { data: slides = [] } = useFetch(api.getSlider);
  const [index, setIndex] = useState(0);
  const total = slides?.length || 0;

  // Geser otomatis tiap 5 detik
  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  const go = (dir) => setIndex((i) => (i + dir + total) % total);
  const current = slides?.[index];

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Sorotan desa">
      {slides?.map((s, i) => (
        <div key={s.id} className={`hero__slide${i === index ? " is-active" : ""}`} style={{ backgroundImage: `url(${s.image})` }} aria-hidden={i !== index} />
      ))}
      <div className="hero__text" aria-live="polite">
        <h1 className="hero__title">{current?.title || "Desa Tambakrigadung"}</h1>
        <p className="hero__sub">{current?.subtitle || "Kec. Tikung, Kab. Lamongan, Prov. Jawa Timur"}</p>
      </div>
      {total > 1 && (
        <>
          <button className="hero__arrow hero__arrow--prev" onClick={() => go(-1)} aria-label="Slide sebelumnya"><ChevronLeft size={20} /></button>
          <button className="hero__arrow hero__arrow--next" onClick={() => go(1)} aria-label="Slide berikutnya"><ChevronRight size={20} /></button>
          <div className="hero__dots">
            {slides.map((s, i) => (
              <button key={s.id} className={`hero__dot${i === index ? " is-active" : ""}`} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
