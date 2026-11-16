import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { ekskul, pendaftar, JAM_SESI } from "@/data/ekskul";
import { aksiBatalkan } from "@/app/action";

export const metadata = { title: "Ekskul Saya" };

async function KontenEkskulSaya() {
  const cookieStore = await cookies();
  const nama = cookieStore.get("nama")?.value;
  const kelas = cookieStore.get("kelas")?.value;

  if (!nama || !kelas) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm space-y-4">
        <h1 className="text-2xl font-bold">Ekskul Saya</h1>
        <p className="text-slate-600">Kamu belum mendaftar apa pun.</p>
        <div>
          <Link
            href="/ekskul"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Lihat Katalog Ekskul
          </Link>
        </div>
      </div>
    );
  }

  // Ambil daftar pendaftaran milik murid tersebut
  const daftarKu = pendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase()
  );

  // 2. Kondisi Ada Cookie tetapi Belum Ada Pendaftaran
  if (daftarKu.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm space-y-4">
        <h1 className="text-2xl font-bold">Ekskul Saya</h1>
        <p className="text-slate-700 font-medium">
          {nama} · {kelas}
        </p>
        <p className="text-slate-500">Belum ada ekskul yang diikuti.</p>
        <div>
          <Link
            href="/ekskul"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Cari Ekskul
          </Link>
        </div>
      </div>
    );
  }

  // 3. Kondisi Ada Cookie dan Ada Pendaftaran
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-1">
        <h1 className="text-2xl font-bold">Ekskul Saya</h1>
        <p className="text-sm font-medium text-slate-700">
          {nama} · {kelas} · {daftarKu.length} ekskul diikuti
        </p>
      </div>

      <div className="space-y-4">
        {daftarKu.map((p) => {
          const item = ekskul.find((e) => e.id === p.ekskulId);
          if (!item) return null;
          const jam = JAM_SESI[item.sesi] || "";

          return (
            <div
              key={p.nomor}
              className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="space-y-1">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {item.kategori}
                </span>
                <h3 className="text-lg font-bold">
                  <Link
                    href={`/ekskul/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item.nama}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600">
                  {item.hari}, sesi {item.sesi} ({jam}) · Pembina: {item.pembina}
                </p>
              </div>

              {/* Tombol Batalkan */}
              <form action={aksiBatalkan}>
                <input type="hidden" name="nomor" value={p.nomor} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Batalkan
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Halaman Utama yang membungkus bagian dinamis dengan Suspense
export default function HalamanEkskulSaya() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-slate-500 animate-pulse py-10">Memuat ekskul saya...</p>}>
      <KontenEkskulSaya />
    </Suspense>
  );
}