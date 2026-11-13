import { Metadata } from "next";
import { ambilSemuaEkskul } from "@/data/ambil";
import Link from "next/link";
import KontrolEkskul from "@/components/KontrolEkskul";
import { pendaftar } from "@/data/ekskul";

export const metadata: Metadata = {
  title: "Daftar Ekskul",
};

type Props = {
    searchParams: Promise<{ kategori?: string; hari?: string }>;
};

export default async function HalamanEkskul({ searchParams }: Props) {
  const params = await searchParams;
  const listEkskul = await ambilSemuaEkskul();

  const hasilFilter = listEkskul.filter((item) => {
    const cocokKategori =
      !params.kategori || params.kategori === "Semua" || item.kategori.toLowerCase() === params.kategori.toLowerCase();
    const cocokHari =
      !params.hari || params.hari === "Semua" || item.hari.toLowerCase() === params.hari.toLowerCase();
    return cocokKategori && cocokHari;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Daftar Ekstrakurikuler</h1>

      {/* Komponen Saringan / Filter */}
      <KontrolEkskul />

      {/* Daftar Kartu Ekskul */}
      {hasilFilter.length === 0 ? (
        <p className="py-12 text-center text-slate-500">Tidak ada ekskul yang cocok.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasilFilter.map((item) => {
            // Hitung jumlah pendaftar untuk ekskul ini
            const jumlahPendaftar = pendaftar.filter((p) => p.ekskulId === item.id).length;
            const sisa = item.kuota - jumlahPendaftar;
            const isPenuh = sisa <= 0;

            return (
              <Link
                key={item.id}
                href={`/ekskul/${item.id}`}
                className="rounded-xl border bg-white p-5 shadow-sm space-y-2 hover:border-blue-400 transition block"
              >
                <div className="flex justify-between items-start">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium">
                    {item.kategori}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isPenuh ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isPenuh ? "Penuh" : `Sisa ${sisa} dari ${item.kuota} tempat`}
                  </span>
                </div>

                <h2 className="text-xl font-semibold">{item.nama}</h2>
                <p className="text-sm text-slate-500">
                  {item.hari} — Sesi {item.sesi}
                </p>
                <p className="text-sm text-slate-600">Pembina: {item.pembina}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}