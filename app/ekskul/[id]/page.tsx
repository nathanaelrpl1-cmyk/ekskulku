import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ambilEkskul } from "@/data/ambil";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ekskul = await ambilEkskul(Number(id));

  if (!ekskul) {
    return { title: "Ekskul tidak ditemukan" };
  }

  return { title: ekskul.nama };
}

export default async function DetailEkskul({ params }: Props) {
  const { id } = await params;
  const ekskul = await ambilEkskul(Number(id));

  if (!ekskul) notFound();

  return (
    <article className="rounded-xl border bg-white p-6 space-y-4 shadow-sm">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium">
        {ekskul.kategori}
      </span>
      <h1 className="text-3xl font-bold">{ekskul.nama}</h1>
      <p className="text-slate-500">Jadwal: {ekskul.hari} - Sesi {ekskul.sesi}</p>
      <p className="text-slate-600">Pembina: {ekskul.pembina}</p>
      <p className="text-slate-600">Kuota Maksimal: {ekskul.kuota} siswa</p>
    </article>
  );
}