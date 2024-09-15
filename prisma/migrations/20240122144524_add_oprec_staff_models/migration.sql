-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Divisi" (
    "id" SERIAL NOT NULL,
    "nama_divisi" TEXT NOT NULL,

    CONSTRAINT "Divisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendaftaranStaff" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nrp" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "no_telp" TEXT NOT NULL,
    "id_line" TEXT NOT NULL,
    "asal_kota" TEXT NOT NULL,
    "domisili_sby" TEXT NOT NULL,
    "pengetahuan" TEXT NOT NULL,
    "motivasi" TEXT NOT NULL,
    "inovasi" TEXT NOT NULL,
    "kelebihan_kekurangan" TEXT NOT NULL,
    "harapan" TEXT NOT NULL,
    "kontak_sponsor" TEXT,
    "kesibukan" TEXT NOT NULL,
    "skala_sch" INTEGER NOT NULL,
    "bukti_linkedin" TEXT NOT NULL,
    "bukti_instagram" TEXT NOT NULL,
    "bukti_tiktok" TEXT NOT NULL,
    "bukti_twitter" TEXT,
    "link_portofolio" TEXT NOT NULL,
    "pilihan" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendaftaranStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilihanStaff" (
    "id" SERIAL NOT NULL,
    "pendaftaran_staff_id" INTEGER NOT NULL,
    "divisi_id" INTEGER NOT NULL,
    "alasan_divisi" TEXT,
    "prioritas_divisi" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PilihanStaff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendaftaranStaff_nrp_key" ON "PendaftaranStaff"("nrp");

-- AddForeignKey
ALTER TABLE "PilihanStaff" ADD CONSTRAINT "PilihanStaff_pendaftaran_staff_id_fkey" FOREIGN KEY ("pendaftaran_staff_id") REFERENCES "PendaftaranStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanStaff" ADD CONSTRAINT "PilihanStaff_divisi_id_fkey" FOREIGN KEY ("divisi_id") REFERENCES "Divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
