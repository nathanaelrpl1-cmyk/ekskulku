import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { ambilEkskul, ambilAnggota } from "@/data/ambil";
import { pendaftar } from "@/data/ekskul";

type Props = {
  params: Promise<{ id: string }>;
};

// 1. Generate Metadata judul tab sesuai nama ekskul
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await ambilEkskul(Number(id));

  if (!item) {
    return { title: "Ekskul tidak ditemukan" };
  }

  return { title: item.nama };
}

// Komponen Asinkron Terpisah untuk Daftar Anggota (dengan jeda 1,5 detik)
async function DaftarAnggotaEkskul({ ekskulId }: { ekskulId: number }) {
  const anggotaList = await ambilAnggota(ekskulId);
  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value;

  if (anggotaList.length === 0) {
    return <p className="text-sm text-slate-500 italic">Belum ada anggota.</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-700">
        Anggota Terdaftar ({anggotaList.length} tempat terisi)
      </h3>
      <ul className="divide-y divide-slate-100 rounded-lg border bg-white shadow-sm">
        {anggotaList.map((m) => {
          const isKamu = namaCookie && m.nama.toLowerCase() === namaCookie.toLowerCase();
          return (
            <li key={m.nomor} className="flex items-center justify-between p-3 text-sm">
              <div>
                <span className="font-medium text-slate-900">{m.nama}</span>
                <span className="ml-2 text-xs text-slate-500">({m.kelas})</span>
              </div>
              {isKamu && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  Kamu
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Halaman Utama Detail Ekskul
export default async function HalamanDetailEkskul({ params }: Props) {
  const { id } = await params;
  const item = await ambilEkskul(Number(id));

  if (!item) {
    notFound();
  }

  // Hitung jumlah pendaftar untuk informasi kuota
  const jumlahTerisi = pendaftar.filter((p) => p.ekskulId === item.id).length;

  return (
    <div className="space-y-6">
      {/* Informasi Utama Ekskul (Tampil Cepat) */}
      <article className="rounded-xl border bg-white p-6 space-y-4 shadow-sm">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium">
          {item.kategori}
        </span>
        <h1 className="text-3xl font-bold">{item.nama}</h1>
        <div className="text-sm text-slate-600 space-y-1">
          <p>Hari: <span className="font-medium text-slate-900">{item.hari}</span> (Sesi {item.sesi})</p>
          <p>Pembina: <span className="font-medium text-slate-900">{item.pembina}</span></p>
          <p>Kuota: <span className="font-medium text-slate-900">{jumlahTerisi} dari {item.kuota} tempat terisi</span></p>
        </div>
      </article>

      {/* Bagian Anggota dengan Suspense karena data lambat */}
      <Suspense fallback={<p className="text-sm text-slate-500 animate-pulse">Memuat anggota...</p>}>
        <DaftarAnggotaEkskul ekskulId={item.id} />
      </Suspense>
    </div>
  );
}