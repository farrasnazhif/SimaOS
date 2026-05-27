"use client";

import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Mail, Lock, Search } from "lucide-react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full max-w-sm space-y-4 text-center">
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function InputSandboxPage() {
  return (
    <main className="min-h-screen ideast-padding py-16 flex flex-col items-center gap-14 text-black bg-white">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-semibold bg-linear-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
          SimaOS Input Sandbox
        </h1>

        <p className="text-gray-400">
          Preview custom SimaOS input components and validation states.
        </p>
      </div>

      <Section title="Basic">
        <Input placeholder="Masukkan teks..." />
      </Section>

      <Section title="With Label">
        <Input label="Email" placeholder="email@example.com" />
      </Section>

      <Section title="With Label Required">
        <Input label="Email" placeholder="email@example.com" required />
      </Section>

      <Section title="With Icons">
        <Input label="Email" placeholder="email@example.com" leftIcon={Mail} />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
        />

        <Input placeholder="Cari tim..." leftIcon={Search} />
      </Section>

      <Section title="Error State">
        <Input
          label="Email"
          placeholder="email@example.com"
          error="Format email tidak valid"
        />
      </Section>

      <Section title="Helper Text">
        <Input
          label="Username"
          placeholder="username"
          helperText="Gunakan minimal 6 karakter"
        />
      </Section>

      <Section title="Disabled">
        <Input label="Disabled" placeholder="Tidak bisa diisi" disabled />
      </Section>

      <Section title="Select Input">
        <Select
          label="Jurusan"
          placeholder="Pilih jurusan"
          options={[
            {
              label: "Teknik Informatika",
              value: "Teknik Informatika",
            },
            {
              label: "Rekayasa Perangkat Lunak",
              value: "Rekayasa Perangkat Lunak",
            },
            {
              label: "Rekayasa Kecerdasan Artificial",
              value: "Rekayasa Kecerdasan Artificial",
            },
          ]}
        />

        <Select
          label="Jurusan Required"
          placeholder="Pilih jurusan"
          required
          options={[
            {
              label: "Teknik Informatika",
              value: "Teknik Informatika",
            },
            {
              label: "Rekayasa Perangkat Lunak",
              value: "Rekayasa Perangkat Lunak",
            },
            {
              label: "Rekayasa Kecerdasan Artificial",
              value: "Rekayasa Kecerdasan Artificial",
            },
          ]}
        />

        <Select
          label="Error State"
          placeholder="Pilih jurusan"
          error="Jurusan wajib dipilih"
          options={[
            {
              label: "Teknik Informatika",
              value: "Teknik Informatika",
            },
            {
              label: "Rekayasa Perangkat Lunak",
              value: "Rekayasa Perangkat Lunak",
            },
          ]}
        />

        <Select
          label="Helper Text"
          placeholder="Pilih jurusan"
          helperText="Pilih sesuai program studi Anda"
          options={[
            {
              label: "Teknik Informatika",
              value: "Teknik Informatika",
            },
            {
              label: "Rekayasa Perangkat Lunak",
              value: "Rekayasa Perangkat Lunak",
            },
          ]}
        />

        <Select
          label="Disabled"
          placeholder="Tidak tersedia"
          disabled
          options={[
            {
              label: "Teknik Informatika",
              value: "Teknik Informatika",
            },
          ]}
        />
      </Section>

      {/* <Section title="File Upload">
        <FileUpload
          label="Upload Proposal"
          required
          helperText="Format PDF, maksimal 5MB"
        />

        <FileUpload label="Upload CV" accept=".pdf" />

        <FileUpload label="Upload Gambar" accept="image/*" />

        <FileUpload label="Error State" error="File wajib diupload" />

        <FileUpload label="Disabled" disabled />
      </Section>

      <Section title="Dropzone Input">
        <DropzoneInput
          label="Upload Proposal"
          required
          helperText="Format PDF, max 5MB"
        />

        <DropzoneInput label="Upload CV" accept=".pdf" />

        <DropzoneInput label="Error State" error="File wajib diupload" />
      </Section> */}
    </main>
  );
}
