"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ekskul, pendaftar, tambahPendaftar, JAM_SESI } from "@/data/ekskul";

export type StateDaftar = {
  sukses?: boolean;
  pesan?: string;
  galatNama?: string;
  galatKelas?: string;
  galatUmum?: string;
  nama?: string;
  kelas?: string;
};

export async function aksiDaftar(
  prevState: StateDaftar,
  formData: FormData
): Promise<StateDaftar> {
  const ekskulId = Number(formData.get("ekskulId"));
  const nama = String(formData.get("nama") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();

  // 1. Validasi per kolom: nama minimal 3 huruf, kelas minimal 3 karakter
  const galatNama = nama.length < 3 ? "Nama minimal 3 huruf." : undefined;
  const galatKelas = kelas.length < 3 ? "Kelas minimal 3 karakter." : undefined;

  if (galatNama || galatKelas) {
    return { galatNama, galatKelas, nama, kelas };
  }

  // 2. Validasi ID ekskul (cegah manipulasi lewat DevTools)
  const targetEkskul = ekskul.find((e) => e.id === ekskulId);
  if (!targetEkskul) {
    return { galatUmum: "Ekskul tidak ditemukan.", nama, kelas };
  }

  // 3. Validasi sudah terdaftar (case-insensitive untuk nama dan kelas)
  const sudahAda = pendaftar.some(
    (p) =>
      p.ekskulId === ekskulId &&
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase()
  );
  if (sudahAda) {
    return {
      galatUmum: `${nama} (${kelas}) sudah terdaftar di ${targetEkskul.nama}.`,
      nama,
      kelas,
    };
  }

  // 4. Validasi kuota penuh
  const terisi = pendaftar.filter((p) => p.ekskulId === ekskulId).length;
  if (terisi >= targetEkskul.kuota) {
    return {
      galatUmum: `Kuota ${targetEkskul.nama} sudah penuh (${targetEkskul.kuota} orang).`,
      nama,
      kelas,
    };
  }

  // 5. Validasi jadwal bentrok (murid sudah mengikuti ekskul lain pada hari dan sesi yang sama)
  const bentrok = pendaftar.find((p) => {
    const samaMurid =
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase();
    if (!samaMurid) return false;

    const ekskulLain = ekskul.find((e) => e.id === p.ekskulId);
    return (
      ekskulLain &&
      ekskulLain.hari === targetEkskul.hari &&
      ekskulLain.sesi === targetEkskul.sesi
    );
  });

  if (bentrok) {
    const ekskulBentrok = ekskul.find((e) => e.id === bentrok.ekskulId);
    return {
      galatUmum: `Jadwal bentrok dengan ${ekskulBentrok?.nama} (${targetEkskul.hari}, sesi ${targetEkskul.sesi}).`,
      nama,
      kelas,
    };
  }

  // 6. Simpan data pendaftaran baru menggunakan fungsi tambahPendaftar
  const nomorBaru = tambahPendaftar({ ekskulId, nama, kelas });
  const jamSesi = JAM_SESI[targetEkskul.sesi] || "";

  // 7. Simpan nama & kelas ke cookie agar otomatis terisi di halaman ekskul lain
  const cookieStore = await cookies();
  cookieStore.set("nama", nama, { path: "/" });
  cookieStore.set("kelas", kelas, { path: "/" });

  // 8. Revalidate halaman detail dan halaman katalog ekskul agar langsung diperbarui
  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/ekskul");

  return {
    sukses: true,
    pesan: `Pendaftaran #${nomorBaru} berhasil: ${targetEkskul.nama}, ${targetEkskul.hari}, sesi ${targetEkskul.sesi} (${jamSesi}).`,
    nama,
    kelas,
  };
}