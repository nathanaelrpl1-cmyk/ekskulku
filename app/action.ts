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

// 1. Server Action untuk Pendaftaran Ekskul
export async function aksiDaftar(
  prevState: StateDaftar,
  formData: FormData
): Promise<StateDaftar> {
  const ekskulId = Number(formData.get("ekskulId"));
  const nama = String(formData.get("nama") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();

  // Validasi per kolom: nama minimal 3 huruf, kelas minimal 3 karakter
  const galatNama = nama.length < 3 ? "Nama minimal 3 huruf." : undefined;
  const galatKelas = kelas.length < 3 ? "Kelas minimal 3 karakter." : undefined;

  if (galatNama || galatKelas) {
    return { galatNama, galatKelas, nama, kelas };
  }

  // Validasi ID ekskul (cegah manipulasi lewat DevTools)
  const targetEkskul = ekskul.find((e) => e.id === ekskulId);
  if (!targetEkskul) {
    return { galatUmum: "Ekskul tidak ditemukan.", nama, kelas };
  }

  // Validasi sudah terdaftar (case-insensitive untuk nama dan kelas)
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

  // Validasi kuota penuh
  const terisi = pendaftar.filter((p) => p.ekskulId === ekskulId).length;
  if (terisi >= targetEkskul.kuota) {
    return {
      galatUmum: `Kuota ${targetEkskul.nama} sudah penuh (${targetEkskul.kuota} orang).`,
      nama,
      kelas,
    };
  }

  // Validasi jadwal bentrok (murid sudah mengikuti ekskul lain pada hari dan sesi yang sama)
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

  const jumlahEkskulDiikuti = pendaftar.filter(
    (p) =>
        p.nama.toLowerCase() === nama.toLowerCase() &&
    p.kelas.toLowerCase() === kelas.toLowerCase()
  ).length;

  if (jumlahEkskulDiikuti >= 2) {
    return {
        galatUmum: `Pendaftaran ditolak. sudah mengikuti maksimal 2 ekskul.`,
        nama,
        kelas,
    };
  }

  if (bentrok) {
    const ekskulBentrok = ekskul.find((e) => e.id === bentrok.ekskulId);
    return {
      galatUmum: `Jadwal bentrok dengan ${ekskulBentrok?.nama} (${targetEkskul.hari}, sesi ${targetEkskul.sesi}).`,
      nama,
      kelas,
    };
  }

  // Simpan data pendaftaran baru menggunakan fungsi tambahPendaftar
  const nomorBaru = tambahPendaftar({ ekskulId, nama, kelas });
  const jamSesi = JAM_SESI[targetEkskul.sesi] || "";

  // Simpan nama & kelas ke cookie agar otomatis terisi di halaman ekskul lain
  const cookieStore = await cookies();
  cookieStore.set("nama", nama, { path: "/" });
  cookieStore.set("kelas", kelas, { path: "/" });

  // Revalidate halaman terkait agar langsung diperbarui tanpa F5
  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/ekskul");
  revalidatePath("/saya");

  return {
    sukses: true,
    pesan: `Pendaftaran #${nomorBaru} berhasil: ${targetEkskul.nama}, ${targetEkskul.hari}, sesi ${targetEkskul.sesi} (${jamSesi}).`,
    nama,
    kelas,
  };
}

// 2. Server Action untuk Membatalkan Pendaftaran Ekskul
export async function aksiBatalkan(formData: FormData) {
  const nomorPendaftaran = Number(formData.get("nomor"));

  // Ambil cookie nama dan kelas untuk verifikasi kepemilikan
  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value;
  const kelasCookie = cookieStore.get("kelas")?.value;

  if (!namaCookie || !kelasCookie) return;

  // Cari data pendaftaran berdasarkan nomor
  const index = pendaftar.findIndex((p) => p.nomor === nomorPendaftaran);
  if (index === -1) return;

  const targetPendaftar = pendaftar[index];

  // Verifikasi ulang bahwa pendaftaran tersebut benar-benar milik murid di cookie
  const milikSendiri =
    targetPendaftar.nama.toLowerCase() === namaCookie.toLowerCase() &&
    targetPendaftar.kelas.toLowerCase() === kelasCookie.toLowerCase();

  if (!milikSendiri) return;

  // Hapus dari array pendaftar (memori server)
  pendaftar.splice(index, 1);

  // Revalidate halaman /saya, detail ekskul terkait, dan katalog /ekskul
  revalidatePath("/saya");
  revalidatePath(`/ekskul/${targetPendaftar.ekskulId}`);
  revalidatePath("/ekskul");
}