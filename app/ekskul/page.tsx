import { Metadata } from "next";
import { ambilSemuaEkskul } from "@/data/ambil";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daftar Ekskul",
};

export default async function HalamanEkskul() {
  const listEkskul = await ambilSemuaEkskul();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Daftar Ekstrakurikuler</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listEkskul.map((item) => (
          <div key={item.id} className="rounded-xl border bg-white p-5 shadow-sm space-y-2">
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium">
              {item.kategori}
            </span>
            <h2 className="text-xl font-semibold">{item.nama}</h2>
            <p className="text-sm text-slate-500">Hari: {item.hari} (Sesi {item.sesi})</p>
            <p className="text-sm text-slate-600">Pembina: {item.pembina}</p>
            <div className="pt-2">
              <Link
                href={`/ekskul/${item.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Lihat Detail &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}