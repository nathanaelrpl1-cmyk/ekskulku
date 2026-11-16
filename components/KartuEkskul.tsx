import Link from "next/link";
import { Ekskul } from "@/data/ekskul";

type KartuEkskulProps = {
  ekskul: Ekskul;
  jumlahPendaftar: number;
};

export default function KartuEkskul({ ekskul, jumlahPendaftar }: KartuEkskulProps) {
  const sisa = ekskul.kuota - jumlahPendaftar;
  const isPenuh = sisa <= 0;

  return (
    <Link
      href={`/ekskul/${ekskul.id}`}
      className="rounded-xl border bg-white p-5 shadow-sm space-y-2 hover:border-blue-400 transition block"
    >
      <div className="flex justify-between items-start">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium">
          {ekskul.kategori}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${
            isPenuh ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
          }`}
        >
          {isPenuh ? "Penuh" : `Sisa ${sisa} dari ${ekskul.kuota} tempat`}
        </span>
      </div>

      <h2 className="text-xl font-semibold">{ekskul.nama}</h2>
      <p className="text-sm text-slate-500">
        {ekskul.hari} — Sesi {ekskul.sesi}
      </p>
      <p className="text-sm text-slate-600">Pembina: {ekskul.pembina}</p>
    </Link>
  );
}