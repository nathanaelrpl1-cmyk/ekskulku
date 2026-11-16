import { Metadata } from "next";
import { ambilSemuaEkskul } from "@/data/ambil";
import KontrolEkskul from "@/components/KontrolEkskul";
import KartuEkskul from "@/components/KartuEkskul";
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
            const jumlahPendaftar = pendaftar.filter((p) => p.ekskulId === item.id).length;

            return (
              <KartuEkskul
                key={item.id}
                ekskul={item}
                jumlahPendaftar={jumlahPendaftar}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}