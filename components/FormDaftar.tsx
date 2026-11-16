"use client";

import { useActionState } from "react";
import { aksiDaftar, StateDaftar } from "@/app/action";

type Props = {
  ekskulId: number;
  namaAwal: string;
  kelasAwal: string;
};

export default function FormDaftar({ ekskulId, namaAwal, kelasAwal }: Props) {
  const initialState: StateDaftar = {
    nama: namaAwal,
    kelas: kelasAwal,
  };

  const [state, formAction, isPending] = useActionState(aksiDaftar, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4 rounded-xl border bg-white p-5">
      <h2 className="text-lg font-bold">Daftar ekskul ini</h2>

      <input type="hidden" name="ekskulId" value={ekskulId} />

      <div>
        <label className="mb-1 block text-sm font-medium">Nama Lengkap</label>
        <input
          type="text"
          name="nama"
          defaultValue={state.nama ?? namaAwal}
          placeholder="Contoh: Rudi"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        {state.galatNama && (
          <p className="mt-1 text-xs text-red-600">{state.galatNama}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Kelas</label>
        <input
          type="text"
          name="kelas"
          defaultValue={state.kelas ?? kelasAwal}
          placeholder="Contoh: XI TKJ 1"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        {state.galatKelas && (
          <p className="mt-1 text-xs text-red-600">{state.galatKelas}</p>
        )}
      </div>

      {/* Galat aturan lainnya tampil sebagai satu pesan di atas tombol */}
      {state.galatUmum && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state.galatUmum}
        </p>
      )}

      {/* Pesan berhasil */}
      {state.sukses && state.pesan && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {state.pesan}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {isPending ? "Memproses..." : "Daftar Sekarang"}
      </button>
    </form>
  );
}