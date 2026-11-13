"use client";

import { useRouter, useSearchParams } from "next/navigation";

const KATEGORI_LIST = ["Semua", "Olahraga", "Seni", "Teknologi", "Akademik"];
const HARI_LIST = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export default function KontrolEkskul() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const kategoriAktif = searchParams.get("kategori") ?? "Semua";
  const hariAktif = searchParams.get("hari") ?? "Semua";

  function ubahFilter(kunci: string, nilai: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nilai === "Semua") {
      params.delete(kunci);
    } else {
      params.set(kunci, nilai);
    }
    router.push(`/ekskul?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 rounded-xl border bg-white p-4 shadow-sm">
      {/* Filter Kategori */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">KATEGORI</label>
        <select
          value={kategoriAktif}
          onChange={(e) => ubahFilter("kategori", e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-sm bg-white"
        >
          {KATEGORI_LIST.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Hari */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">HARI</label>
        <select
          value={hariAktif}
          onChange={(e) => ubahFilter("hari", e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-sm bg-white"
        >
          {HARI_LIST.map((hari) => (
            <option key={hari} value={hari}>
              {hari}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}