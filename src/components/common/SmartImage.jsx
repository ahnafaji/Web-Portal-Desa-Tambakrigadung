import { useState } from "react";
import { ImageOff } from "lucide-react";

// <img> yang menampilkan placeholder rapi bila file gambar belum ada / gagal dimuat.
export default function SmartImage({ src, alt, className = "", ...rest }) {
  const [broken, setBroken] = useState(false);
  if (broken || !src) {
    return (
      <div className={`img-placeholder ${className}`} role="img" aria-label={alt}>
        <ImageOff size={28} aria-hidden="true" />
        <span>Foto belum tersedia</span>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} {...rest} />;
}