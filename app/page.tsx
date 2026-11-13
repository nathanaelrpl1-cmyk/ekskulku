import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <h1 className="text-4xl font-bold">Selamat Datang di EkskulKu</h1>
      <p className="text-slate-600 max-w-md">
        Sistem pendaftaran ekstrakurikuler sekolah secara online, cepat, dan terintegrasi.
      </p>
      <div className="pt-4">
        <Link
          href="/ekskul"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Lihat Daftar Ekskul
        </Link>
      </div>
    </div>
  );
}