import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "EkskulKu", template: "%s • EkskulKu" },
  description: "Sistem Pendaftaran Ekstrakurikuler Sekolah",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="id" className="antialiased">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        {/* Bungkus Navbar dengan Suspense agar aman saat prerendering */}
        <Suspense fallback={<div className="h-14 border-b bg-white" />}>
          <Navbar />
        </Suspense>

        <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
        
        <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">
          EkskulKu • dibuat di kelas Junior Web Developer
        </footer>
      </body>
    </html>
  );
}