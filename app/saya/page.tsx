import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekskul Saya",
};

export default function HalamanSaya() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Ekskul Saya</h1>
      <p className="text-slate-600">Daftar ekstrakurikuler yang telah Anda ikuti akan muncul di sini.</p>
    </div>
  );
}