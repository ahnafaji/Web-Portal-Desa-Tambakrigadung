export const formatAngka = (n) => Number(n).toLocaleString("id-ID");
export const formatRupiah = (n) => `Rp. ${formatAngka(n)}`;
export const formatTanggal = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
