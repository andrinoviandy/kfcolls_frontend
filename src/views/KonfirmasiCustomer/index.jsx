import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaFileInvoice,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
  FaBuilding,
  FaSearch,
  FaCheck,
  FaTruck,
  FaClock,
  FaExclamationTriangle,
  FaPaperPlane,
  FaReceipt,
  FaBoxes,
  FaTimes,
  FaInfoCircle,
  FaDownload,
  FaUpload,
} from "react-icons/fa";

import { HiOutlineTicket } from "react-icons/hi";

import storeSchema from "global/store";
import { swal } from "global/helper/swal";
import { useSearchParams } from "react-router-dom";

import { MdVerified } from "react-icons/md";
import formatKonfirmasiPiutang from "assets/format-konfirmasi-piutang.docx";


// ======================================================
// FORMAT RUPIAH
// ======================================================

const formatRupiah = (angka) => {
  const value = Number(angka || 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};


// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (date) => {
  if (!date) return "-";

  try {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return date;
  }
};


// ======================================================
// STATUS KONFIRMASI CUSTOMER
// ======================================================

const getConfirmationStatus = (status) => {
  const value = String(status ?? "").trim().toUpperCase();

  if (value === "S") {
    return {
      label: "Disetujui",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: <FaCheckCircle />,
    };
  }

  if (value === "T") {
    return {
      label: "Ditolak",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: <FaTimesCircle />,
    };
  }

  if (value === "O") {
    return {
      label: "Otomatis 14 Hari",
      className: "bg-purple-100 text-purple-700 border-purple-200",
      icon: <FaClock />,
    };
  }

  return {
    label: "Menunggu Konfirmasi",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <FaClock />,
  };
};


// ======================================================
// STATUS PENGANTARAN
// ======================================================

const getDeliveryStatus = (status) => {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("terima") ||
    value.includes("diterima") ||
    value.includes("success") ||
    value.includes("selesai")
  ) {
    return {
      label: "Diterima",
      className:
        "bg-green-100 text-green-700 border-green-200",
      icon: <FaCheckCircle />,
    };
  }

  if (
    value.includes("kirim") ||
    value.includes("antar") ||
    value.includes("delivery") ||
    value.includes("dikirim")
  ) {
    return {
      label: "Dikirim",
      className:
        "bg-blue-100 text-blue-700 border-blue-200",
      icon: <FaTruck />,
    };
  }

  if (
    value.includes("tunggu") ||
    value.includes("pending") ||
    value.includes("proses")
  ) {
    return {
      label: "Menunggu",
      className:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <FaClock />,
    };
  }

  if (
    value.includes("tolak") ||
    value.includes("batal") ||
    value.includes("gagal")
  ) {
    return {
      label: status || "Tidak Berhasil",
      className:
        "bg-red-100 text-red-700 border-red-200",
      icon: <FaTimesCircle />,
    };
  }

  return {
    label: status || "Belum Diproses",
    className:
      "bg-gray-100 text-gray-600 border-gray-200",
    icon: <FaClock />,
  };
};


// ======================================================
// COMPONENT
// ======================================================

export default function KonfirmasiCustomer() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");

  const [data, setData] = useState(null);

  const [isValid, setIsValid] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  const [search, setSearch] = useState("");

  const [isConfirming, setIsConfirming] = useState(false);

  // ====================================================
  // POPUP KONFIRMASI
  // ====================================================

  const [showConfirmationModal, setShowConfirmationModal] =
    useState(false);

  const [confirmationType, setConfirmationType] =
    useState("approve");

  const [confirmationNote, setConfirmationNote] =
    useState("");

  const [paymentPlanDate, setPaymentPlanDate] =
    useState("");

  // Surat jawaban customer wajib dilampirkan sebelum konfirmasi.
  const [suratJawabanFile, setSuratJawabanFile] = useState(null);

  // ====================================================
  // GET DETAIL
  // ====================================================

  const getDetailStatus = async (showLoading = true) => {
    try {
      if (showLoading) swal.loading();

      const res =
        await storeSchema.actions.getDataKonfirmasiCustomer({
          status,
        });

      swal.close();

      if (res?.status !== true) {
        setData(null);
        setIsValid(false);

        swal.warning(
          res?.message ||
          "Data konfirmasi customer tidak ditemukan."
        );

        return;
      }

      const responseData =
        res?.data?.data ??
        res?.data?.result ??
        res?.data ??
        res?.result ??
        null;

      if (
        !responseData ||
        typeof responseData !== "object" ||
        Array.isArray(responseData)
      ) {
        setData(null);
        setIsValid(false);
        return;
      }

      // Pertahankan objek customer sebagai header dan gunakan
      // detail_billing sebagai sumber utama daftar billing.
      setData({
        ...responseData,

        nama_customer:
          responseData?.nama_customer ??
          responseData?.customer_name ??
          responseData?.customer ??
          "-",

        customer_name:
          responseData?.customer_name ??
          responseData?.nama_customer ??
          responseData?.customer ??
          "-",

        tanggal_kirim_konfirmasi:
          responseData?.tanggal_kirim_konfirmasi ??
          responseData?.tgl_kirim_konfirmasi ??
          null,

        detail_billing: Array.isArray(
          responseData?.detail_billing
        )
          ? responseData.detail_billing.map((item) => ({
            ...item,

            id:
              item?.piutang_id ??
              item?.detail_piutang_id ??
              item?.k_piutang_id ??
              item?.no_billing,

            no_billing:
              item?.no_billing ??
              item?.billing_id ??
              item?.nomor_billing ??
              "",

            dpp: Number(item?.dpp ?? item?.DPP ?? 0),

            ppn: Number(item?.ppn ?? item?.PPN ?? 0),

            total_piutang: Number(
              item?.total_piutang ??
              item?.total_invoice ??
              (
                Number(item?.dpp ?? item?.DPP ?? 0) +
                Number(item?.ppn ?? item?.PPN ?? 0)
              )
            ),
          }))
          : [],
      });

      setSelectedIds([]);
      setIsValid(true);
    } catch (error) {
      swal.close();

      console.error(
        "Error fetching detail konfirmasi piutang:",
        error
      );

      setIsValid(false);
    }
  };


  // ====================================================
  // USE EFFECT
  // ====================================================

  useEffect(() => {
    if (status) {
      getDetailStatus();
    }
  }, [status]);


  // ====================================================
  // NORMALIZE DATA
  // ====================================================

  const invoiceList = useMemo(() => {
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    // Struktur response service getDataKonfirmasiCustomer:
    // { ...dataCustomer, detail_billing: [...] }
    if (Array.isArray(data?.detail_billing)) {
      return data.detail_billing;
    }

    // Fallback untuk response versi sebelumnya.
    if (Array.isArray(data?.detail)) {
      return data.detail;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.faktur)) {
      return data.faktur;
    }

    if (Array.isArray(data?.billing)) {
      return data.billing;
    }

    if (Array.isArray(data?.list)) {
      return data.list;
    }

    return [];
  }, [data]);


  // ====================================================
  // FILTER SEARCH
  // ====================================================

  const filteredInvoices = useMemo(() => {
    if (!search) {
      return invoiceList;
    }

    const keyword = search.toLowerCase();

    return invoiceList.filter((item) => {
      return (
        String(
          item?.no_faktur ||
          item?.no_faktur_pajak ||
          item?.nomor_faktur ||
          ""
        )
          .toLowerCase()
          .includes(keyword) ||

        String(
          item?.no_billing ||
          item?.billing_id ||
          item?.nomor_billing ||
          ""
        )
          .toLowerCase()
          .includes(keyword) ||

        String(
          item?.nama_sales ||
          item?.nama_pengantar ||
          ""
        )
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [invoiceList, search]);


  // ====================================================
  // GET ITEM ID
  // ====================================================

  const getItemId = (item, index) => {
    return String(
      item?.id ||
      item?.billing_id ||
      item?.no_billing ||
      item?.no_faktur ||
      index
    );
  };
  // ====================================================
  // SELECTED INVOICES
  // ====================================================

  const selectedInvoices = useMemo(() => {
    return invoiceList.filter((item, index) => {
      const id = getItemId(item, index);

      return selectedIds.includes(id);
    });
  }, [invoiceList, selectedIds]);


  // ====================================================
  // TOTAL SELECTED
  // ====================================================

  const totalSelected = useMemo(() => {
    return selectedInvoices.reduce((total, item) => {
      return (
        total +
        Number(
          item?.total_piutang ??
          item?.nominal_piutang ??
          item?.total ??
          (
            Number(
              item?.dpp ??
              item?.nominal_dpp ??
              item?.nilai_dpp ??
              0
            ) +
            Number(
              item?.ppn ??
              item?.nominal_ppn ??
              item?.nilai_ppn ??
              0
            )
          )
        )
      );
    }, 0);
  }, [selectedInvoices]);


  // ====================================================
  // CHECK SINGLE ITEM
  // ====================================================

  const handleCheckItem = (item, index) => {
    const id = getItemId(item, index);

    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }

      return [...prev, id];
    });
  };


  // ====================================================
  // CHECK ALL
  // ====================================================

  const handleCheckAll = () => {
    const visibleIds = filteredInvoices.map(
      (item, index) => getItemId(item, index)
    );

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...visibleIds]),
      ]);
    }
  };


  // ====================================================
  // OPEN CONFIRMATION POPUP
  // ====================================================

  const openConfirmationModal = () => {
    if (selectedInvoices.length === 0) {
      swal.warning(
        "Silakan pilih minimal satu faktur/billing yang ingin dikonfirmasi."
      );

      return;
    }

    setConfirmationType("approve");
    setConfirmationNote("");
    setPaymentPlanDate("");
    setSuratJawabanFile(null);
    setShowConfirmationModal(true);
  };


  // ====================================================
  // CLOSE CONFIRMATION POPUP
  // ====================================================

  const closeConfirmationModal = () => {
    if (isConfirming) {
      return;
    }

    setShowConfirmationModal(false);
    setConfirmationNote("");
    setPaymentPlanDate("");
    setConfirmationType("approve");
    setSuratJawabanFile(null);
  };


  // ====================================================
  // HANDLE UPLOAD SURAT JAWABAN
  // ====================================================

  const handleSuratJawabanChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSuratJawabanFile(null);
      return;
    }

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "jpg",
      "jpeg",
      "png",
    ];

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      swal.warning(
        "Format surat jawaban harus PDF, DOC, DOCX, JPG, JPEG, atau PNG."
      );

      event.target.value = "";
      setSuratJawabanFile(null);
      return;
    }

    // Batas ukuran file 10 MB.
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      swal.warning(
        "Ukuran surat jawaban maksimal 10 MB."
      );

      event.target.value = "";
      setSuratJawabanFile(null);
      return;
    }

    setSuratJawabanFile(file);
  };


  // ====================================================
  // PROCESS CONFIRMATION
  // ====================================================

  const processConfirmation = async () => {
    if (selectedInvoices.length === 0) {
      swal.warning("Tidak ada faktur yang dipilih.");
      return;
    }

    // Surat jawaban wajib diupload.
    if (!suratJawabanFile) {
      swal.warning(
        "Surat jawaban wajib diupload sebelum melakukan konfirmasi."
      );

      return;
    }

    // Tolak wajib catatan.
    if (
      confirmationType === "reject" &&
      !confirmationNote.trim()
    ) {
      swal.warning(
        "Catatan wajib diisi jika konfirmasi ditolak."
      );

      return;
    }

    // Tanggal rencana pembayaran wajib saat disetujui.
    if (
      confirmationType === "approve" &&
      !paymentPlanDate
    ) {
      swal.warning(
        "Tanggal rencana pembayaran wajib diisi."
      );

      return;
    }

    try {
      setIsConfirming(true);
      swal.loading();

      // Ambil k_piutang_id dari billing yang dipilih.
      const kPiutangIds = selectedInvoices
        .map((item) => item?.k_piutang_id)
        .filter(
          (id) =>
            id !== undefined &&
            id !== null &&
            String(id).trim() !== ""
        );

      if (kPiutangIds.length === 0) {
        swal.close();
        setIsConfirming(false);

        swal.warning(
          "k_piutang_id tidak ditemukan pada data yang dipilih."
        );

        return;
      }

      const selectedCustomer = selectedInvoices.find(
        (item) =>
          item?.nama_customer ||
          item?.customer_name ||
          item?.customer
      );

      const namaCustomer =
        data?.nama_customer ||
        data?.customer_name ||
        data?.customer ||
        selectedCustomer?.nama_customer ||
        selectedCustomer?.customer_name ||
        selectedCustomer?.customer ||
        "";

      if (!String(namaCustomer).trim()) {
        swal.close();
        setIsConfirming(false);

        swal.warning("Nama customer tidak ditemukan.");
        return;
      }

      // ==================================================
      // FORMDATA
      // ==================================================
      // FormData digunakan agar file ikut dikirim ke backend.
      // Nama field file: surat_jawaban.

      const formData = new FormData();

      formData.append(
        "k_piutang_id",
        JSON.stringify([...new Set(kPiutangIds)])
      );

      formData.append(
        "nama_customer",
        String(namaCustomer).trim()
      );

      formData.append(
        "keputusan",
        confirmationType === "approve"
          ? "DISETUJUI"
          : "DITOLAK"
      );

      formData.append(
        "catatan",
        confirmationNote.trim()
      );

      formData.append(
        "tanggal_rencana_pembayaran",
        confirmationType === "approve"
          ? paymentPlanDate
          : ""
      );

      formData.append(
        "surat_jawaban",
        suratJawabanFile,
        suratJawabanFile.name
      );

      // Kirim FormData melalui action yang sudah ada.
      const res =
        await storeSchema.actions.konfirmasiCustomer(
          formData
        );

      swal.close();

      if (res?.status !== true) {
        setIsConfirming(false);

        swal.warning(
          res?.message ||
          "Konfirmasi piutang gagal diproses."
        );

        return;
      }

      // Tutup modal dan reset input setelah API berhasil.
      setShowConfirmationModal(false);
      setConfirmationNote("");
      setPaymentPlanDate("");
      setConfirmationType("approve");
      setSuratJawabanFile(null);
      setSelectedIds([]);

      // Ambil ulang data agar status mengikuti backend.
      await getDetailStatus(false);

      setIsConfirming(false);

      swal.success(
        confirmationType === "approve"
          ? "Konfirmasi piutang berhasil disetujui."
          : "Konfirmasi piutang berhasil ditolak."
      );
    } catch (error) {
      swal.close();
      setIsConfirming(false);

      console.error(
        "Error konfirmasi piutang:",
        error
      );

      swal.warning(
        error?.response?.data?.message ||
        error?.message ||
        "Terjadi kesalahan saat melakukan konfirmasi."
      );
    }
  };


  // ====================================================
  // SELECT ALL STATUS
  // ====================================================

  const visibleIds = filteredInvoices.map(
    (item, index) => getItemId(item, index)
  );

  const isAllSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIds.includes(id));
  // ====================================================
  // LOADING
  // ====================================================

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-10 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <FaReceipt className="text-blue-600 text-2xl" />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Memuat Data Konfirmasi
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    );
  }


  // ====================================================
  // INVALID
  // ====================================================

  if (isValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

            <div className="bg-blue-900 px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <FaReceipt className="text-white text-xl" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    Konfirmasi Piutang
                  </h1>

                  <p className="text-sm text-blue-200">
                    Konfirmasi faktur dan billing customer
                  </p>
                </div>

              </div>
            </div>

            <div className="px-6 py-12 text-center">

              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <FaTimesCircle className="text-red-500 text-4xl" />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                Data Tidak Ditemukan
              </h2>

              <p className="text-sm text-gray-500 max-w-md mx-auto mt-3 leading-relaxed">
                Link konfirmasi piutang tidak valid atau data
                konfirmasi sudah tidak tersedia. Silakan hubungi
                sales atau administrator untuk mendapatkan link
                konfirmasi yang baru.
              </p>

            </div>

            <div className="border-t px-6 py-4 text-center text-xs text-gray-400">
              Sistem Konfirmasi Piutang
            </div>

          </div>
        </div>
      </div>
    );
  }


  // ====================================================
  // VALID
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1500px] mx-auto px-5 lg:px-8">

          <div className="h-[74px] flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaReceipt className="text-blue-700 text-xl" />
              </div>

              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-800">
                  Konfirmasi Piutang
                </h1>

                <p className="text-xs md:text-sm text-gray-400">
                  Konfirmasi faktur dan billing customer
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2">

              <a
                href={formatKonfirmasiPiutang}
                download="format-konfirmasi-piutang.docx"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 hover:bg-blue-800 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                title="Download surat jawaban"
              >
                <FaDownload className="shrink-0" />
                <span>Download Surat Jawaban</span>
              </a>

              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                <MdVerified className="text-blue-600 text-lg" />
                <span className="text-xs font-semibold text-blue-700">
                  Verifikasi Customer
                </span>
              </div>

            </div>

          </div>

        </div>
      </header>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 py-6">

        {/* ==================================================
            CUSTOMER INFORMATION
        ================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>

              <div>

                <p className="text-xs text-gray-400 mb-1">
                  Customer
                </p>

                <h2 className="text-lg font-bold text-gray-800">
                  {
                    data?.customer ||
                    data?.nama_customer ||
                    data?.customer_name ||
                    "-"
                  }
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {
                    data?.alamat_customer ||
                    data?.alamat ||
                    "Data customer"
                  }
                </p>

              </div>

            </div>


            {/* INFORMATION */}

            <div className="grid grid-cols-2 md:grid-cols-2 gap-5">

              <div>

                <p className="text-xs text-gray-400">
                  Tanggal Kirim Konfirmasi
                </p>

                <div className="flex items-center gap-2 mt-1">

                  <FaCalendarAlt className="text-blue-500" />

                  <span className="text-sm font-semibold text-gray-700">
                    {
                      formatDate(
                        data?.tanggal_kirim_konfirmasi ||
                        data?.tgl_kirim_konfirmasi ||
                        data?.tanggal_kirim ||
                        data?.tanggal_pengantaran ||
                        data?.tgl_pengantaran ||
                        data?.tanggal
                      )
                    }
                  </span>

                </div>

              </div>


              <div>

                <p className="text-xs text-gray-400">
                  Total Faktur
                </p>

                <div className="flex items-center gap-2 mt-1">

                  <FaBoxes className="text-blue-500" />

                  <span className="text-sm font-semibold text-gray-700">
                    {invoiceList.length} Faktur
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            INFORMATION BOX
        ================================================== */}

        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl px-5 py-4 mb-5">

          <div className="flex gap-3">

            <div className="w-9 h-9 shrink-0 rounded-lg bg-yellow-100 flex items-center justify-center">
              <FaExclamationTriangle className="text-yellow-600" />
            </div>

            <div>

              <h3 className="font-bold text-yellow-900 text-sm">
                Konfirmasi Piutang
              </h3>

              <p className="text-xs md:text-sm text-yellow-800 mt-1 leading-relaxed">
                Silakan periksa daftar faktur dan billing yang
                dikirimkan oleh sales pada tanggal tersebut.
                Pilih faktur yang telah Anda terima kemudian
                klik tombol <b>Konfirmasi</b>.
              </p>

            </div>

          </div>

        </div>


        {/* ==================================================
            KETENTUAN KONFIRMASI PIUTANG
        ================================================== */}

        <div className="
          bg-yellow-50
          border
          border-yellow-300
          rounded-2xl
          px-5
          py-4
          mb-5
        ">

          <div className="flex items-start gap-3">

            <div className="
              w-10
              h-10
              shrink-0
              rounded-xl
              bg-yellow-100
              text-yellow-600
              flex
              items-center
              justify-center
            ">
              <FaInfoCircle className="text-lg" />
            </div>

            <div className="flex-1">

              <h3 className="
                text-sm
                md:text-base
                font-bold
                text-yellow-900
              ">
                Ketentuan Konfirmasi Piutang
              </h3>

              <p className="
                text-xs
                md:text-sm
                text-yellow-800
                mt-1
                leading-relaxed
              ">
                Customer menerima permintaan konfirmasi melalui email.
                Apabila tidak memberikan tanggapan dalam waktu
                <span className="font-bold">
                  {" "}14 hari kalender{" "}
                </span>
                sejak konfirmasi dikirim, faktur akan dianggap telah
                disetujui sebagai piutang.
              </p>

            </div>

          </div>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          {/* TOTAL */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-gray-400">
                  Total Faktur
                </p>

                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {invoiceList.length}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <FaFileInvoice className="text-blue-600" />
              </div>

            </div>

          </div>


          {/* SELECTED */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-gray-400">
                  Dipilih
                </p>

                <p className="text-2xl font-bold text-indigo-700 mt-1">
                  {selectedInvoices.length}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <FaCheck className="text-indigo-600" />
              </div>

            </div>

          </div>


          {/* TOTAL NOMINAL */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-gray-400">
                  Total Piutang Dipilih
                </p>

                <p className="text-lg font-bold text-green-700 mt-1">
                  {formatRupiah(totalSelected)}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <FaMoneyBillWave className="text-green-600" />
              </div>

            </div>

          </div>


          {/* STATUS */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-gray-400">
                  Status
                </p>

                <p className="text-lg font-bold text-orange-600 mt-1">
                  Menunggu Konfirmasi
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                <FaClock className="text-orange-600" />
              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            TABLE CARD
        ================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* TABLE HEADER */}

          <div className="p-5 border-b border-gray-200">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h2 className="text-base md:text-lg font-bold text-gray-800">
                  Daftar Faktur & Billing
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Pilih faktur yang telah diterima customer
                </p>

              </div>


              <div className="flex flex-col sm:flex-row gap-3">

                {/* SEARCH */}

                <div className="relative">

                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Cari faktur / billing / sales..."
                    className="
                      w-full
                      sm:w-72
                      h-10
                      pl-9
                      pr-3
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                      text-sm
                      text-gray-700
                      outline-none
                      focus:bg-white
                      focus:border-blue-400
                      transition
                    "
                  />

                </div>


                {/* KONFIRMASI */}

                <button
                  type="button"
                  onClick={openConfirmationModal}
                  disabled={
                    selectedInvoices.length === 0 ||
                    isConfirming
                  }
                  className="
                    h-10
                    px-5
                    rounded-lg
                    bg-primary
                    hover:bg-primary
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                    text-white
                    text-sm
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-sm
                    transition
                  "
                >

                  <FaCheck />
                  Konfirmasi

                </button>

              </div>

            </div>


            {/* SELECTED INFO */}

            {selectedInvoices.length > 0 && (

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">

                <div className="flex items-center gap-2">

                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FaCheck className="text-blue-600 text-xs" />
                  </div>

                  <span className="text-sm text-blue-800">
                    <b>{selectedInvoices.length}</b>{" "}
                    faktur dipilih
                  </span>

                </div>

                <div className="text-sm font-bold text-blue-800">
                  Total: {formatRupiah(totalSelected)}
                </div>

              </div>

            )}

          </div>


          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-sm">

              <thead>
                <tr className="bg-primary text-white">

                  <th className="px-4 py-4 text-center w-14">
                    <label
                      className={`mx-auto flex items-center justify-center w-9 h-9 rounded-full border transition cursor-pointer ${isAllSelected
                          ? "bg-blue-50 border-white text-primary"
                          : "bg-white/10 border-white/70 text-white hover:bg-white/20"
                        } ${filteredInvoices.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                      title={
                        isAllSelected
                          ? "Batalkan semua pilihan"
                          : "Pilih semua faktur"
                      }
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isAllSelected}
                        disabled={filteredInvoices.length === 0}
                        onChange={handleCheckAll}
                      />

                      {isAllSelected ? (
                        <FaCheckCircle />
                      ) : (
                        <span className="w-4 h-4 rounded border border-current" />
                      )}
                    </label>
                  </th>

                  <th className="px-4 py-4 text-left">Status</th>

                  <th className="px-4 py-4 text-left whitespace-nowrap">
                    Tgl Rencana Pembayaran
                  </th>

                  <th className="px-4 py-4 text-left">Catatan</th>

                  <th className="px-4 py-4 text-center">Jawaban</th>

                  <th className="px-4 py-4 text-left">No. Billing</th>

                  <th className="px-4 py-4 text-left">Customer</th>

                  <th className="px-4 py-4 text-right">DPP</th>

                  <th className="px-4 py-4 text-right">PPN</th>

                  <th className="px-4 py-4 text-right">
                    Total Piutang
                  </th>

                  <th className="px-4 py-4 text-left">Sales</th>

                </tr>
              </thead>


              <tbody>

                {filteredInvoices.length === 0 ? (

                  <tr>
                    <td colSpan={11} className="px-5 py-16 text-center">

                      <div className="flex flex-col items-center">

                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <FaFileInvoice className="text-gray-400 text-xl" />
                        </div>

                        <p className="font-semibold text-gray-600">
                          Data faktur tidak ditemukan
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Tidak ada data yang sesuai dengan pencarian.
                        </p>

                      </div>

                    </td>
                  </tr>

                ) : (

                  filteredInvoices.map((item, index) => {

                    const originalIndex = invoiceList.indexOf(item);

                    const id = getItemId(item, originalIndex);

                    const checked = selectedIds.includes(id);

                    const dpp =
                      item?.dpp ??
                      item?.nominal_dpp ??
                      item?.nilai_dpp ??
                      0;

                    const ppn =
                      item?.ppn ??
                      item?.nominal_ppn ??
                      item?.nilai_ppn ??
                      0;

                    const totalPiutang =
                      item?.total_piutang ??
                      item?.nominal_piutang ??
                      item?.total ??
                      (Number(dpp || 0) + Number(ppn || 0));

                    const noBilling =
                      item?.no_billing ||
                      item?.billing_id ||
                      item?.nomor_billing ||
                      "-";

                    const sales =
                      item?.nama_sales ||
                      item?.sales_name ||
                      item?.nama_pengantar ||
                      "-";

                    const confirmationStatus =
                      getConfirmationStatus(item?.kd_status);

                    return (

                      <tr
                        key={id}
                        className={`border-b border-gray-100 transition ${checked
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                          }`}
                      >

                        {/* CHECKBOX */}

                        <td className="px-4 py-4 text-center">

                          <label
                            className={`mx-auto flex items-center justify-center w-9 h-9 rounded-full border transition ${checked
                                ? "bg-blue-50 border-primary text-primary cursor-pointer"
                                : "bg-white border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-primary cursor-pointer"
                              }`}
                            title={
                              checked
                                ? "Batalkan pilihan"
                                : "Pilih faktur"
                            }
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={checked}
                              onChange={() =>
                                handleCheckItem(item, originalIndex)
                              }
                            />

                            {checked ? (
                              <FaCheck />
                            ) : (
                              <span className="w-4 h-4 rounded border border-current" />
                            )}

                          </label>

                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4 whitespace-nowrap">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${confirmationStatus.className}`}
                            title={
                              item?.tanggal_konfirmasi
                                ? `Tanggal konfirmasi: ${formatDate(
                                  item.tanggal_konfirmasi
                                )}`
                                : confirmationStatus.label
                            }
                          >
                            {confirmationStatus.icon}
                            {confirmationStatus.label}
                          </span>

                        </td>


                        {/* TANGGAL RENCANA PEMBAYARAN */}

                        <td className="px-4 py-4 whitespace-nowrap">

                          <div className="flex items-center gap-2 text-gray-700">

                            <FaCalendarAlt className="text-blue-500 shrink-0" />

                            <span className="font-medium">
                              {formatDate(item?.tgl_rencana_pembayaran)}
                            </span>

                          </div>

                        </td>


                        {/* CATATAN */}

                        <td className="px-4 py-4 min-w-[220px]">

                          <span className="text-gray-700 whitespace-pre-wrap break-words">
                            {item?.keterangan_konfirmasi || "-"}
                          </span>

                        </td>


                        {/* JAWABAN */}

                        <td className="px-4 py-4 text-center">
                          {(() => {
                            const jawabanUrl =
                              typeof item?.jawaban === "string"
                                ? item.jawaban
                                : item?.jawaban?.url ||
                                  item?.jawaban?.path ||
                                  item?.jawaban?.href ||
                                  "";

                            if (!jawabanUrl) {
                              return (
                                <span className="text-gray-400">-</span>
                              );
                            }

                            return (
                              <a
                                href={jawabanUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-nowrap gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                title="Buka surat jawaban di tab baru"
                              >
                                <FaFileInvoice />
                                Lihat Jawaban
                              </a>
                            );
                          })()}
                        </td>


                        {/* NOMOR BILLING */}

                        <td className="px-4 py-4 text-nowrap">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                              <HiOutlineTicket className="text-orange-600 text-lg" />
                            </div>

                            <div>

                              <p className="font-semibold text-gray-700">
                                {noBilling}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* CUSTOMER */}

                        <td className="px-4 py-4 text-nowrap">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <FaBuilding className="text-blue-600 text-sm" />
                            </div>

                            <p className="font-semibold text-gray-700">
                              {
                                item?.customer ||
                                item?.nama_customer ||
                                data?.customer ||
                                data?.nama_customer ||
                                "-"
                              }
                            </p>

                          </div>

                        </td>


                        {/* DPP */}

                        <td className="px-4 py-4 text-right whitespace-nowrap">

                          <p className="font-semibold text-gray-700">
                            {formatRupiah(dpp)}
                          </p>

                        </td>


                        {/* PPN */}

                        <td className="px-4 py-4 text-right whitespace-nowrap">

                          <p className="font-semibold text-gray-700">
                            {formatRupiah(ppn)}
                          </p>

                        </td>


                        {/* TOTAL PIUTANG */}

                        <td className="px-4 py-4 text-right whitespace-nowrap">

                          <p className="font-bold text-gray-800">
                            {formatRupiah(totalPiutang)}
                          </p>

                        </td>


                        {/* SALES */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <FaUser className="text-blue-600 text-sm" />
                            </div>

                            <span className="font-semibold text-gray-700">
                              {sales}
                            </span>

                          </div>

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>
          </div>


          {/* TABLE FOOTER */}

          <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <p className="text-xs text-gray-500">

                Menampilkan{" "}

                <b className="text-gray-700">
                  {filteredInvoices.length}
                </b>{" "}

                dari{" "}

                <b className="text-gray-700">
                  {invoiceList.length}
                </b>{" "}

                faktur/billing

              </p>

              <div className="flex items-center gap-2">

                <FaCheckCircle className="text-green-500 text-xs" />

                <span className="text-xs text-gray-500">
                  Pilih faktur yang telah diterima customer
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            BOTTOM CONFIRMATION
        ================================================== */}

        {selectedInvoices.length > 0 && (

          <div className="mt-5 bg-white rounded-2xl border border-blue-200 shadow-lg p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>

                <div>

                  <h3 className="font-bold text-gray-800">
                    Siap untuk dikonfirmasi
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Anda memilih{" "}

                    <b className="text-gray-700">
                      {selectedInvoices.length} faktur
                    </b>{" "}

                    dengan total piutang{" "}

                    <b className="text-blue-700">
                      {formatRupiah(totalSelected)}
                    </b>

                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={openConfirmationModal}
                disabled={isConfirming}
                className="
                  w-full
                  md:w-auto
                  px-7
                  py-3
                  rounded-xl
                  bg-primary
                  hover:bg-primary
                  disabled:bg-gray-300
                  text-white
                  font-bold
                  text-sm
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-md
                  transition
                "
              >
                <FaPaperPlane />
                Konfirmasi Piutang
              </button>

            </div>

          </div>

        )}


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="text-center py-8">

          <div className="flex items-center justify-center gap-2 text-gray-400">
            <FaReceipt />

            <span className="text-xs">
              Sistem Konfirmasi Piutang
            </span>
          </div>

          <p className="text-[11px] text-gray-400 mt-1">
            Silakan pastikan seluruh data faktur telah sesuai
            sebelum melakukan konfirmasi.
          </p>

        </div>

      </main>


      {/* ==================================================
          MODAL KONFIRMASI
      ================================================== */}

      {showConfirmationModal && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/50
            flex
            items-center
            justify-center
            p-4
            overflow-hidden
          "
          onClick={closeConfirmationModal}
        >

          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              w-full
              max-w-2xl
              max-h-[calc(100vh-2rem)]
              flex
              flex-col
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div
              className={`
                px-6
                py-5
                text-white
                shrink-0
                ${confirmationType === "approve"
                  ? "bg-primary"
                  : "bg-red-600"
                }
              `}
            >

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                    {confirmationType === "approve" ? (
                      <FaCheck className="text-lg" />
                    ) : (
                      <FaTimes className="text-lg" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      Konfirmasi Piutang
                    </h3>

                    <p className="text-xs text-white/80 mt-0.5">
                      Periksa faktur sebelum memberikan keputusan
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeConfirmationModal}
                  disabled={isConfirming}
                  className="
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    hover:bg-white/10
                    disabled:opacity-50
                    shrink-0
                  "
                >
                  <FaTimes />
                </button>

              </div>

            </div>


            {/* MODAL BODY */}

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                p-6
                space-y-5
              "
            >

              {/* CUSTOMER */}

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <FaBuilding className="text-blue-600" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-bold text-gray-800">
                      {
                        data?.customer ||
                        data?.nama_customer ||
                        data?.customer_name ||
                        "-"
                      }
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {
                        data?.alamat_customer ||
                        data?.alamat ||
                        "-"
                      }
                    </p>

                  </div>

                </div>

              </div>


              {/* SUMMARY */}

              <div className="grid grid-cols-2 gap-3">

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                  <p className="text-[11px] text-gray-500">
                    Faktur Dipilih
                  </p>

                  <p className="text-xl font-bold text-blue-700 mt-1">
                    {selectedInvoices.length}
                  </p>

                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                  <p className="text-[11px] text-gray-500">
                    Total Piutang
                  </p>

                  <p className="text-base font-bold text-green-700 mt-1">
                    {formatRupiah(totalSelected)}
                  </p>

                </div>

              </div>


              {/* LIST FAKTUR */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      Faktur yang Akan Dikonfirmasi
                    </h4>

                    <p className="text-xs text-gray-400 mt-0.5">
                      Pastikan seluruh data sudah sesuai
                    </p>
                  </div>

                  <span className="
                    px-3
                    py-1
                    rounded-full
                    bg-blue-50
                    text-blue-700
                    border
                    border-blue-100
                    text-xs
                    font-semibold
                  ">
                    {selectedInvoices.length} Faktur
                  </span>

                </div>


                <div className="border border-gray-200 rounded-xl overflow-hidden">

                  <div className="max-h-[300px] overflow-y-auto">

                    {selectedInvoices.map((item, index) => {

                      const nominal =
                        item?.total_piutang ??
                        item?.nominal_piutang ??
                        item?.total ??
                        (
                          Number(
                            item?.dpp ??
                            item?.nominal_dpp ??
                            item?.nilai_dpp ??
                            0
                          ) +
                          Number(
                            item?.ppn ??
                            item?.nominal_ppn ??
                            item?.nilai_ppn ??
                            0
                          )
                        );

                      const noFaktur =
                        item?.no_faktur ||
                        item?.no_faktur_pajak ||
                        item?.nomor_faktur ||
                        "-";

                      const noBilling =
                        item?.no_billing ||
                        item?.billing_id ||
                        item?.nomor_billing ||
                        "-";

                      const sales =
                        item?.nama_sales ||
                        item?.sales_name ||
                        item?.nama_pengantar ||
                        "-";

                      return (

                        <div
                          key={getItemId(item, invoiceList.indexOf(item))}
                          className={`
                            p-4
                            ${index !== selectedInvoices.length - 1
                              ? "border-b border-gray-100"
                              : ""
                            }
                            hover:bg-gray-50
                          `}
                        >

                          <div className="flex items-start gap-3">

                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <FaFileInvoice className="text-blue-600 text-sm" />
                            </div>

                            <div className="flex-1 min-w-0">

                              <div className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-2
                              ">

                                <div>

                                  <p className="text-sm font-bold text-blue-700">
                                    {noFaktur}
                                  </p>

                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    Billing: {noBilling}
                                  </p>

                                </div>

                                <p className="text-sm font-bold text-gray-800">
                                  {formatRupiah(nominal)}
                                </p>

                              </div>


                              <div className="flex items-center gap-2 mt-2">

                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                  <FaUser className="text-gray-500 text-[10px]" />
                                </div>

                                <span className="text-xs text-gray-600 font-medium">
                                  Sales: {sales}
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      );

                    })}

                  </div>

                </div>

              </div>


              {/* KETENTUAN KONFIRMASI PIUTANG */}

              <div className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4">

                <div className="w-9 h-9 shrink-0 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <FaInfoCircle className="text-base" />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-bold text-yellow-900 mb-1">
                    Ketentuan Konfirmasi Piutang
                  </p>

                  <p className="text-xs leading-relaxed text-yellow-800">
                    Customer menerima permintaan konfirmasi melalui email.
                    Apabila tidak memberikan tanggapan dalam waktu
                    <span className="font-bold">
                      {" "}14 hari kalender{" "}
                    </span>
                    sejak konfirmasi dikirim, faktur akan dianggap telah
                    disetujui sebagai piutang.
                  </p>

                </div>

              </div>


              {/* UPLOAD SURAT JAWABAN — WAJIB */}

              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">

                <div className="mb-3 flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <FaUpload />
                  </div>

                  <div className="min-w-0 flex-1">

                    <label
                      htmlFor="surat-jawaban"
                      className="block text-sm font-bold text-gray-800"
                    >
                      Upload Surat Jawaban{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      Unduh template melalui tombol “Download Surat Jawaban”,
                      lengkapi suratnya, lalu unggah dokumen yang sudah diisi.
                    </p>

                  </div>

                </div>


                <input
                  id="surat-jawaban"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  disabled={isConfirming}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSuratJawabanFile(file);
                  }}
                  className="block w-full cursor-pointer rounded-lg border border-gray-200 bg-white text-sm text-gray-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-blue-100 file:px-4 file:py-3 file:font-semibold file:text-blue-800 hover:file:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                />


                {suratJawabanFile ? (

                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">

                    <FaCheckCircle className="shrink-0" />

                    <span className="break-all">
                      File dipilih: <b>{suratJawabanFile.name}</b>
                    </span>

                    <button
                      type="button"
                      disabled={isConfirming}
                      onClick={() => setSuratJawabanFile(null)}
                      className="ml-auto shrink-0 font-semibold text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </button>

                  </div>

                ) : (

                  <p className="mt-2 text-xs font-medium text-red-600">
                    Surat jawaban wajib diunggah sebelum melakukan konfirmasi.
                  </p>

                )}

              </div>


              {/* DECISION */}

              <div>

                <p className="text-sm font-bold text-gray-700 mb-3">
                  Keputusan
                </p>

                <div className="grid grid-cols-2 gap-3">

                  {/* APPROVE */}

                  <button
                    type="button"
                    disabled={isConfirming}
                    onClick={() => setConfirmationType("approve")}
                    className={`
                      p-4
                      rounded-xl
                      border
                      text-left
                      transition
                      ${confirmationType === "approve"
                        ? "border-green-300 bg-green-50 ring-1 ring-green-200"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }
                    `}
                  >

                    <div className="flex items-center gap-3">

                      <div className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${confirmationType === "approve"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                        }
                      `}>
                        <FaCheckCircle />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Setujui
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          Faktur sesuai dan diterima
                        </p>
                      </div>

                    </div>

                  </button>


                  {/* REJECT */}

                  <button
                    type="button"
                    disabled={isConfirming}
                    onClick={() => setConfirmationType("reject")}
                    className={`
                      p-4
                      rounded-xl
                      border
                      text-left
                      transition
                      ${confirmationType === "reject"
                        ? "border-red-300 bg-red-50 ring-1 ring-red-200"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }
                    `}
                  >

                    <div className="flex items-center gap-3">

                      <div className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${confirmationType === "reject"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                        }
                      `}>
                        <FaTimesCircle />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Tolak
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          Ada data yang tidak sesuai
                        </p>
                      </div>

                    </div>

                  </button>

                </div>

              </div>


              {/* TANGGAL RENCANA PEMBAYARAN */}

              {confirmationType === "approve" && (

                <div>

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-bold text-gray-700">
                      Tanggal Rencana Pembayaran
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <span className="text-[11px] text-gray-400">
                      Wajib diisi
                    </span>

                  </div>

                  <div className="relative">

                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />

                    <input
                      type="date"
                      value={paymentPlanDate}
                      onChange={(e) => setPaymentPlanDate(e.target.value)}
                      disabled={isConfirming}
                      min={new Date().toISOString().split("T")[0]}
                      className="
                        w-full
                        h-11
                        pl-11
                        pr-4
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        text-sm
                        text-gray-700
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-gray-100
                        disabled:cursor-not-allowed
                      "
                    />

                  </div>

                  <p className="text-[11px] text-gray-400 mt-1.5">
                    Tentukan tanggal rencana customer melakukan
                    pembayaran piutang.
                  </p>

                </div>

              )}


              {/* CATATAN */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-bold text-gray-700">
                    Catatan

                    {confirmationType === "reject" && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {confirmationType === "reject" && (
                    <span className="text-[11px] text-red-500">
                      Wajib diisi
                    </span>
                  )}

                </div>

                <textarea
                  value={confirmationNote}
                  onChange={(e) => setConfirmationNote(e.target.value)}
                  disabled={isConfirming}
                  rows={4}
                  placeholder={
                    confirmationType === "reject"
                      ? "Tuliskan alasan penolakan..."
                      : "Tambahkan catatan jika diperlukan..."
                  }
                  className={`
                    w-full
                    resize-none
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    ${confirmationType === "reject"
                      ? "border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    }
                  `}
                />

                <p className="text-[11px] text-gray-400 mt-1.5">
                  {confirmationType === "reject"
                    ? "Berikan alasan yang jelas agar customer memahami alasan penolakan."
                    : "Catatan bersifat opsional jika konfirmasi disetujui."}
                </p>

              </div>
              {/* ==================================================
                  INFO
              ================================================== */}

              <div className="
                flex
                items-start
                gap-3
                bg-amber-50
                border
                border-amber-200
                rounded-xl
                p-3
              ">

                <FaInfoCircle className="
                  text-amber-500
                  mt-0.5
                  shrink-0
                " />

                <p className="
                  text-xs
                  text-amber-700
                  leading-relaxed
                ">
                  Pastikan faktur yang dipilih sudah benar.
                  Setelah keputusan dikirim, status faktur akan
                  diperbarui sesuai keputusan Anda.
                </p>

              </div>

            </div>


            {/* ==================================================
                MODAL FOOTER
            ================================================== */}

            <div className="
              border-t
              bg-gray-50
              px-6
              py-4
              flex
              flex-col-reverse
              sm:flex-row
              sm:items-center
              sm:justify-end
              gap-3
              shrink-0
            ">

              {/* BATAL */}

              <button
                type="button"
                onClick={closeConfirmationModal}
                disabled={isConfirming}
                className="
                  w-full
                  sm:w-auto
                  px-5
                  py-2.5
                  rounded-full
                  border
                  border-gray-300
                  bg-white
                  text-gray-600
                  text-sm
                  font-semibold
                  hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                Batal
              </button>


              {/* TOMBOL SETUJUI / TOLAK */}

              <button
                type="button"
                onClick={processConfirmation}
                disabled={
                  isConfirming ||
                  !suratJawabanFile ||
                  (
                    confirmationType === "reject" &&
                    !confirmationNote.trim()
                  ) ||
                  (
                    confirmationType === "approve" &&
                    !paymentPlanDate
                  )
                }
                className={`
                  w-full
                  sm:w-auto
                  px-6
                  py-2.5
                  rounded-full
                  text-white
                  text-sm
                  font-semibold
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  ${confirmationType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  }
                `}
              >

                {isConfirming ? (

                  <>
                    <span className="
                      w-4
                      h-4
                      border-2
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    " />

                    Memproses...
                  </>

                ) : confirmationType === "approve" ? (

                  <>
                    <FaCheck />
                    Setujui Konfirmasi
                  </>

                ) : (

                  <>
                    <FaTimes />
                    Tolak Konfirmasi
                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}