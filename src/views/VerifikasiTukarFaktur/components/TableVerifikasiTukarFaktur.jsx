import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaHashtag,
  FaFileInvoiceDollar,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExchangeAlt,
  FaEye,
  FaTimes,
  FaClipboardList,
  FaCheck,
  FaTimesCircle,
  FaInfoCircle,
  FaFileAlt,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {

  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

};


// =====================================================
// FORMAT CURRENCY
// =====================================================

const formatCurrency = (value) => {

  const number = Number(value || 0);

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  ).format(number);

};


// =====================================================
// DUMMY DATA VERIFIKASI TUKAR FAKTUR
//
// Data utama tetap mengikuti struktur TableTukarFaktur:
// - no_faktur
// - nama_customer
// - alamat
// - jatuh_tempo
// - nominal
// - dokumen_tukar
// - nama_dokumen_tukar
// - tanggal_tukar
//
// Ditambahkan field:
// - status_verifikasi_tukar
// - create_document_number
// - tanggal_verifikasi_tukar
// - keterangan_verifikasi_tukar
// =====================================================

const dummyData = [
  {
    id: 1,
    no_faktur: "INV-2026-00001",
    nama_customer: "Dinas Kesehatan Kota Medan",
    alamat: "Jl. Gatot Subroto No. 125, Medan",
    jatuh_tempo: "2026-08-22",
    nominal: 140000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00001_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-02",

    status_verifikasi_tukar: "MENUNGGU_VERIFIKASI",
    create_document_number: "",
    tanggal_verifikasi_tukar: null,
    keterangan_verifikasi_tukar: "",
  },

  {
    id: 2,
    no_faktur: "INV-2026-00002",
    nama_customer: "Apotek Maju Djaya",
    alamat: "Jl. Sisingamangaraja No. 88, Medan",
    jatuh_tempo: "2026-08-25",
    nominal: 85000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00002_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-03",

    status_verifikasi_tukar: "MENUNGGU_VERIFIKASI",
    create_document_number: "",
    tanggal_verifikasi_tukar: null,
    keterangan_verifikasi_tukar: "",
  },

  {
    id: 3,
    no_faktur: "INV-2026-00003",
    nama_customer: "Apotek Rusli",
    alamat: "Jl. Iskandar Muda No. 45, Medan",
    jatuh_tempo: "2026-08-27",
    nominal: 140000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00003_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-02",

    status_verifikasi_tukar: "SUDAH_DIVERIFIKASI",
    create_document_number: "CD-2026-000003",
    tanggal_verifikasi_tukar: "2026-09-03",
    keterangan_verifikasi_tukar:
      "Dokumen faktur pengganti telah sesuai.",
  },

  {
    id: 4,
    no_faktur: "INV-2026-00004",
    nama_customer: "RSUD Pasuruan",
    alamat: "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",
    jatuh_tempo: "2026-08-29",
    nominal: 175000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00004_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-04",

    status_verifikasi_tukar: "DITOLAK",
    create_document_number: "",
    tanggal_verifikasi_tukar: "2026-09-05",
    keterangan_verifikasi_tukar:
      "Dokumen faktur pengganti tidak sesuai.",
  },

  {
    id: 5,
    no_faktur: "INV-2026-00005",
    nama_customer: "RS Hermina Medan",
    alamat: "Jl. Asrama No. 12, Medan",
    jatuh_tempo: "2026-08-30",
    nominal: 95000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00005_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-03",

    status_verifikasi_tukar: "MENUNGGU_VERIFIKASI",
    create_document_number: "",
    tanggal_verifikasi_tukar: null,
    keterangan_verifikasi_tukar: "",
  },

  {
    id: 6,
    no_faktur: "INV-2026-00006",
    nama_customer: "Apotek Sehat Sentosa",
    alamat: "Jl. Kelapa Gading Raya No. 21, Jakarta",
    jatuh_tempo: "2026-09-01",
    nominal: 65000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00006_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-04",

    status_verifikasi_tukar: "MENUNGGU_VERIFIKASI",
    create_document_number: "",
    tanggal_verifikasi_tukar: null,
    keterangan_verifikasi_tukar: "",
  },

  {
    id: 7,
    no_faktur: "INV-2026-00007",
    nama_customer: "Klinik Medika Utama",
    alamat: "Jl. Boulevard Barat No. 30, Jakarta",
    jatuh_tempo: "2026-09-03",
    nominal: 72500000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00007_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-04",

    status_verifikasi_tukar: "SUDAH_DIVERIFIKASI",
    create_document_number: "CD-2026-000007",
    tanggal_verifikasi_tukar: "2026-09-05",
    keterangan_verifikasi_tukar:
      "Dokumen telah diverifikasi.",
  },

  {
    id: 8,
    no_faktur: "INV-2026-00008",
    nama_customer: "RS Siloam Medan",
    alamat: "Jl. Imam Bonjol No. 5, Medan",
    jatuh_tempo: "2026-09-05",
    nominal: 210000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00008_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-05",

    status_verifikasi_tukar: "MENUNGGU_VERIFIKASI",
    create_document_number: "",
    tanggal_verifikasi_tukar: null,
    keterangan_verifikasi_tukar: "",
  },

  {
    id: 9,
    no_faktur: "INV-2026-00009",
    nama_customer: "Dinas Kesehatan Deli Serdang",
    alamat: "Jl. Negara No. 100, Deli Serdang",
    jatuh_tempo: "2026-09-07",
    nominal: 125000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00009_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-06",

    status_verifikasi_tukar: "MENUNGGU_VERIFIKASI",
    create_document_number: "",
    tanggal_verifikasi_tukar: null,
    keterangan_verifikasi_tukar: "",
  },

  {
    id: 10,
    no_faktur: "INV-2026-00010",
    nama_customer: "Apotek Kimia Sehat",
    alamat: "Jl. Sunter Agung No. 18, Jakarta",
    jatuh_tempo: "2026-09-10",
    nominal: 45000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00010_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-06",

    status_verifikasi_tukar: "SUDAH_DIVERIFIKASI",
    create_document_number: "CD-2026-000010",
    tanggal_verifikasi_tukar: "2026-09-07",
    keterangan_verifikasi_tukar:
      "Dokumen pengganti sesuai.",
  },

  {
    id: 11,
    no_faktur: "INV-2026-00011",
    nama_customer: "RSUD Kota Bogor",
    alamat: "Jl. Pajajaran No. 50, Bogor",
    jatuh_tempo: "2026-09-12",
    nominal: 185000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00011_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-07",

    status_verifikasi_tukar: "MENUNGGU_VERIFIKASI",
    create_document_number: "",
    tanggal_verifikasi_tukar: null,
    keterangan_verifikasi_tukar: "",
  },

  {
    id: 12,
    no_faktur: "INV-2026-00012",
    nama_customer: "Apotek Berkah Farma",
    alamat: "Jl. Merdeka No. 12, Bogor",
    jatuh_tempo: "2026-09-15",
    nominal: 55000000,

    status: "SUDAH_DITUKAR",
    dokumen_tukar: "#",
    nama_dokumen_tukar: "INV-2026-00012_PENGGANTI.pdf",
    tanggal_tukar: "2026-09-08",

    status_verifikasi_tukar: "DITOLAK",
    create_document_number: "",
    tanggal_verifikasi_tukar: "2026-09-09",
    keterangan_verifikasi_tukar:
      "Dokumen tidak sesuai dengan faktur pengganti.",
  },
];


// =====================================================
// STATUS CONFIG
// =====================================================

const verificationStatusConfig = {

  MENUNGGU_VERIFIKASI: {
    label: "Menunggu Verifikasi",
    icon: FaClock,
    className:
      "bg-amber-100 text-amber-700",
  },

  SUDAH_DIVERIFIKASI: {
    label: "Sudah Diverifikasi",
    icon: FaCheckCircle,
    className:
      "bg-green-100 text-green-700",
  },

  DITOLAK: {
    label: "Ditolak",
    icon: FaTimesCircle,
    className:
      "bg-red-100 text-red-700",
  },

};


// =====================================================
// COMPONENT
// =====================================================

const TableVerifikasiTukarFaktur = ({
  dimensionScreenW,
  check,
  loginAccess,
  onVerifikasiTukarFaktur,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [
    allData,
    setAllData,
  ] = useState(dummyData);

  const [
    keyword,
    setKeyword,
  ] = useState("");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("ALL");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    perPage,
    setPerPage,
  ] = useState(10);

  const [
    selectedData,
    setSelectedData,
  ] = useState(null);

  const [
    showVerificationModal,
    setShowVerificationModal,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    showRejectionReason,
    setShowRejectionReason,
  ] = useState(false);

const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  // ===================================================
  // SUMMARY
  // ===================================================

  const summaryData = useMemo(
    () => {

      const total =
        allData.length;

      const menunggu =
        allData.filter(
          item =>
            item.status_verifikasi_tukar ===
            "MENUNGGU_VERIFIKASI"
        ).length;

      const sudah =
        allData.filter(
          item =>
            item.status_verifikasi_tukar ===
            "SUDAH_DIVERIFIKASI"
        ).length;

      const ditolak =
        allData.filter(
          item =>
            item.status_verifikasi_tukar ===
            "DITOLAK"
        ).length;

      return {
        total,
        menunggu,
        sudah,
        ditolak,
      };

    },
    [
      allData,
    ]
  );


  // ===================================================
  // FILTER DATA
  // ===================================================

  const filteredData = useMemo(
    () => {

      let data = [
        ...allData,
      ];


      // STATUS

      if (
        selectedStatus !== "ALL"
      ) {

        data =
          data.filter(
            item =>
              item.status_verifikasi_tukar ===
              selectedStatus
          );

      }


      // SEARCH

      if (
        keyword.trim()
      ) {

        const search =
          keyword
            .toLowerCase()
            .trim();

        data =
          data.filter(
            item =>

              item.no_faktur
                ?.toLowerCase()
                .includes(search)

              ||

              item.nama_customer
                ?.toLowerCase()
                .includes(search)

              ||

              item.alamat
                ?.toLowerCase()
                .includes(search)

              ||

              item.nama_dokumen_tukar
                ?.toLowerCase()
                .includes(search)

              ||

              item.create_document_number
                ?.toLowerCase()
                .includes(search)
          );

      }


      return data;

    },
    [
      allData,
      keyword,
      selectedStatus,
    ]
  );


  // ===================================================
  // PAGINATION
  // ===================================================

  const totalData =
    filteredData.length;

  const totalPage =
    Math.ceil(
      totalData /
      perPage
    );

  const paginatedData =
    filteredData.slice(
      (
        currentPage -
        1
      ) *
      perPage,

      currentPage *
      perPage
    );


  useEffect(
    () => {

      setCurrentPage(1);

    },
    [
      keyword,
      selectedStatus,
      perPage,
    ]
  );


  // ===================================================
  // OPEN VERIFICATION
  // ===================================================

  const openVerification = (
    faktur
  ) => {

    if (!faktur) {
      return;
    }

    setSelectedData(
      faktur
    );

    setRejectionReason("");
    setShowRejectionReason(false);

    setShowVerificationModal(
      true
    );

  };


  // ===================================================
  // CLOSE VERIFICATION
  // ===================================================

  const closeVerification = () => {

    if (isSubmitting) {
      return;
    }

    setShowVerificationModal(
      false
    );

    setSelectedData(
      null
    );

    setRejectionReason("");
    setShowRejectionReason(false);

  };


  // ===================================================
  // OPEN DOCUMENT
  // ===================================================

  const openDocument = (
    faktur
  ) => {

    if (!faktur) {
      return;
    }

    setSelectedData(
      faktur
    );

    setShowVerificationModal(
      false
    );

    setRejectionReason("");
    setShowRejectionReason(false);

    setShowVerificationModal(
      true
    );

  };


  // ===================================================
  // HANDLE VERIFICATION
  // ===================================================

  const handleVerification = async (
    action
  ) => {

    if (!selectedData) {
      return;
    }

    // Jika Tolak, alasan wajib diisi.
    if (
      action === "TOLAK" &&
      !rejectionReason.trim()
    ) {

      setShowRejectionReason(
        true
      );

      alert(
        "Alasan penolakan wajib diisi."
      );

      return;

    }

    try {

      setIsSubmitting(
        true
      );

      const newStatus =
        action === "TERIMA"
          ? "SUDAH_DIVERIFIKASI"
          : "DITOLAK";

      const alasanPenolakan =
        action === "TOLAK"
          ? rejectionReason.trim()
          : "";

      // Payload verifikasi:
      // Terima = tanpa input tambahan.
      // Tolak = wajib membawa alasan_penolakan.
      const payload = {

        faktur_id:
          selectedData.id,

        no_faktur:
          selectedData.no_faktur,

        nama_customer:
          selectedData.nama_customer,

        nominal:
          selectedData.nominal,

        status_verifikasi_tukar:
          newStatus,

        alasan_penolakan:
          alasanPenolakan,

        tanggal_verifikasi_tukar:
          new Date().toISOString(),

        user_id:
          loginAccess?.user_id ||
          null,

        nip:
          loginAccess?.nip ||
          null,

      };

      if (
        typeof onVerifikasiTukarFaktur ===
        "function"
      ) {

        await onVerifikasiTukarFaktur(
          payload
        );

      }

      // Update local data.
      setAllData(
        prev =>
          prev.map(
            item =>
              item.id ===
              selectedData.id
                ? {

                    ...item,

                    status_verifikasi_tukar:
                      newStatus,

                    tanggal_verifikasi_tukar:
                      new Date().toISOString(),

                    alasan_penolakan:
                      alasanPenolakan,

                    keterangan_verifikasi_tukar:
                      alasanPenolakan,

                  }
                : item
          )
      );

      alert(
        action === "TERIMA"
          ? "Tukar Faktur berhasil diterima."
          : "Tukar Faktur berhasil ditolak."
      );

      closeVerification();

    } catch (error) {

      console.error(
        "Gagal verifikasi Tukar Faktur:",
        error
      );

      alert(
        error?.message ||
        "Gagal melakukan verifikasi Tukar Faktur."
      );

    } finally {

      setIsSubmitting(
        false
      );

    }

  };


  // ===================================================
  // STATUS
  // ===================================================

  const renderStatus = (
    status
  ) => {

    const config =
      verificationStatusConfig[
        status
      ];


    if (!config) {
      return "-";
    }


    const Icon =
      config.icon;


    return (

      <span
        className={`
          inline-flex
          items-center
          gap-2
          px-3
          py-1.5
          rounded-full
          text-xs
          font-semibold
          whitespace-nowrap
          ${config.className}
        `}
      >

        <Icon />

        {
          config.label
        }

      </span>

    );

  };


  // ===================================================
  // ACTION
  // ===================================================

  const renderAction = (
    faktur
  ) => {

    const waiting =
      faktur.status_verifikasi_tukar ===
      "MENUNGGU_VERIFIKASI";


    if (waiting) {

      return (

        <button
          type="button"
          onClick={() =>
            openVerification(
              faktur
            )
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-primary
            text-white
            text-xs
            font-semibold
            hover:opacity-90
            transition
            shadow-sm
            whitespace-nowrap
          "
        >

          <FaCheckCircle />

          Verifikasi

        </button>

      );

    }


    return (

      <button
        type="button"
        onClick={() =>
          openVerification(
            faktur
          )
        }
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          px-4
          py-2
          rounded-full
          border
          border-gray-200
          bg-white
          text-gray-600
          text-xs
          font-semibold
          hover:bg-gray-50
          transition
          whitespace-nowrap
        "
      >

        <FaEye />

        Detail

      </button>

    );

  };


  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex =
    totalData > 0
      ? (
          currentPage -
          1
        ) *
          perPage +
          1
      : 0;

  const endIndex =
    Math.min(
      currentPage *
        perPage,
      totalData
    );


  // ===================================================
  // HEADER
  // ===================================================

  const headerTable = [

    {
      label: "Aksi",
      icon: <FaExchangeAlt />,
    },

    {
      label: "No",
      icon: <FaHashtag />,
    },

    {
      label: "No. Faktur",
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "Customer",
      icon: <FaBuilding />,
    },

    {
      label: "Alamat",
      icon: <FaMapMarkerAlt />,
    },

    {
      label: "Tgl. Tukar",
      icon: <FaCalendarAlt />,
    },

    {
      label: "Nominal",
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "Status Verifikasi",
      icon: <FaClock />,
    },

  ];


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div
      className="
        flex
        flex-col
        gap-5
      "
    >

      {/* ================================================= */}
      {/* SEARCH + STATUS */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-4
          items-stretch
          lg:items-center
        "
      >

        <div
          className="
            input
            input-sm
            input-bordered
            flex
            items-center
            gap-2
            bg-white
            rounded-full
            border-gray-200
            shadow-sm
            w-full
            lg:w-[380px]
          "
        >

          <IoSearch
            className="
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="
              Cari nomor faktur / customer / create document...
            "
            className="grow"
            value={
              keyword
            }
            onChange={
              e =>
                setKeyword(
                  e.target.value
                )
            }
          />

        </div>


        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              text-sm
              text-gray-500
            "
          >
            Status:
          </span>


          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[210px]
            "
            value={
              selectedStatus
            }
            onChange={
              e =>
                setSelectedStatus(
                  e.target.value
                )
            }
          >

            <option value="ALL">
              Semua Status
            </option>

            <option value="MENUNGGU_VERIFIKASI">
              Menunggu Verifikasi
            </option>

            <option value="SUDAH_DIVERIFIKASI">
              Sudah Diverifikasi
            </option>

            <option value="DITOLAK">
              Ditolak
            </option>

          </select>

        </div>

      </div>


      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >

        <div
          className="
            rounded-2xl
            bg-blue-50
            p-4
            border
            border-blue-100
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-blue-700
                "
              >
                Total Tukar Faktur
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-blue-900
                "
              >
                {
                  summaryData.total
                }
              </p>

            </div>

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-blue-100
                flex
                items-center
                justify-center
              "
            >
              <FaClipboardList
                className="
                  text-blue-600
                "
              />
            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            bg-amber-50
            p-4
            border
            border-amber-100
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-amber-700
                "
              >
                Menunggu Verifikasi
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-amber-900
                "
              >
                {
                  summaryData.menunggu
                }
              </p>

            </div>

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-amber-100
                flex
                items-center
                justify-center
              "
            >
              <FaClock
                className="
                  text-amber-600
                "
              />
            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            bg-green-50
            p-4
            border
            border-green-100
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-green-700
                "
              >
                Sudah Diverifikasi
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-green-900
                "
              >
                {
                  summaryData.sudah
                }
              </p>

            </div>

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-green-100
                flex
                items-center
                justify-center
              "
            >
              <FaCheckCircle
                className="
                  text-green-600
                "
              />
            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            bg-red-50
            p-4
            border
            border-red-100
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-red-700
                "
              >
                Ditolak
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-red-900
                "
              >
                {
                  summaryData.ditolak
                }
              </p>

            </div>

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-red-100
                flex
                items-center
                justify-center
              "
            >
              <FaTimesCircle
                className="
                  text-red-600
                "
              />
            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              table
              w-full
            "
          >

            <thead>

              <tr
                className="
                  bg-gray-50
                  text-gray-600
                "
              >

                {
                  headerTable.map(
                    (
                      header,
                      index
                    ) => (

                      <th
                        key={
                          index
                        }
                        className="
                          px-4
                          py-3
                          text-xs
                          font-bold
                          whitespace-nowrap
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          {
                            header.icon
                          }

                          {
                            header.label
                          }

                        </div>

                      </th>

                    )
                  )
                }

              </tr>

            </thead>


            <tbody>

              {
                paginatedData.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan={
                        headerTable.length
                      }
                      className="
                        text-center
                        py-12
                        text-gray-400
                      "
                    >

                      Tidak ada data.

                    </td>

                  </tr>

                ) : (

                  paginatedData.map(
                    (
                      faktur,
                      index
                    ) => (

                      <tr
                        key={
                          faktur.id
                        }
                        className="
                          hover:bg-gray-50
                          transition
                          border-b
                        "
                      >

                        {/* AKSI */}

                        <td
                          className="
                            px-4
                            py-3
                            whitespace-nowrap
                          "
                        >

                          {
                            renderAction(
                              faktur
                            )
                          }

                        </td>


                        {/* NO */}

                        <td
                          className="
                            px-4
                            py-3
                            text-sm
                            text-gray-500
                          "
                        >

                          {
                            (
                              currentPage -
                              1
                            ) *
                              perPage +
                              index +
                              1
                          }

                        </td>


                        {/* NO FAKTUR */}

                        <td
                          className="
                            px-4
                            py-3
                            whitespace-nowrap
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <FaFileInvoiceDollar
                              className="
                                text-primary
                              "
                            />

                            <span
                              className="
                                text-sm
                                font-semibold
                                text-primary
                              "
                            >
                              {
                                faktur.no_faktur
                              }
                            </span>

                          </div>

                        </td>


                        {/* CUSTOMER */}

                        <td
                          className="
                            px-4
                            py-3
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-gray-700
                            "
                          >
                            {
                              faktur.nama_customer
                            }
                          </p>

                        </td>


                        {/* ALAMAT */}

                        <td
                          className="
                            px-4
                            py-3
                            max-w-[280px]
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              gap-2
                            "
                          >

                            <FaMapMarkerAlt
                              className="
                                text-gray-400
                                mt-1
                                shrink-0
                              "
                            />

                            <span
                              className="
                                text-sm
                                text-gray-600
                              "
                            >
                              {
                                faktur.alamat
                              }
                            </span>

                          </div>

                        </td>


                        {/* TANGGAL TUKAR */}

                        <td
                          className="
                            px-4
                            py-3
                            whitespace-nowrap
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                              text-gray-600
                            "
                          >

                            <FaCalendarAlt
                              className="
                                text-primary
                              "
                            />

                            {
                              formatDate(
                                faktur.tanggal_tukar
                              )
                            }

                          </div>

                        </td>


                        {/* NOMINAL */}

                        <td
                          className="
                            px-4
                            py-3
                            whitespace-nowrap
                          "
                        >

                          <span
                            className="
                              text-sm
                              font-bold
                              text-gray-700
                            "
                          >
                            {
                              formatCurrency(
                                faktur.nominal
                              )
                            }
                          </span>

                        </td>


                        {/* STATUS */}

                        <td
                          className="
                            px-4
                            py-3
                          "
                        >

                          {
                            renderStatus(
                              faktur.status_verifikasi_tukar
                            )
                          }

                        </td>

                      </tr>

                    )
                  )

                )

              }

            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div
          className="
            border-t
            border-gray-100
            bg-slate-50
            py-4
            px-5
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-4
              lg:items-center
              lg:justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-5
                flex-wrap
              "
            >

              <div
                className="
                  text-sm
                  text-gray-600
                "
              >

                Showing{" "}

                <span
                  className="
                    font-semibold
                  "
                >
                  {
                    startIndex
                  }
                </span>

                {" "}to{" "}

                <span
                  className="
                    font-semibold
                  "
                >
                  {
                    endIndex
                  }
                </span>

                {" "}of{" "}

                <span
                  className="
                    font-semibold
                  "
                >
                  {
                    totalData
                  }
                </span>

                {" "}entries

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  Rows:
                </span>

                <select
                  className="
                    select
                    select-bordered
                    select-sm
                    bg-white
                    rounded-full
                  "
                  value={
                    perPage
                  }
                  onChange={
                    e =>
                      setPerPage(
                        parseInt(
                          e.target.value,
                          10
                        )
                      )
                  }
                >

                  <option value="5">
                    5
                  </option>

                  <option value="10">
                    10
                  </option>

                  <option value="25">
                    25
                  </option>

                  <option value="50">
                    50
                  </option>

                </select>

              </div>

            </div>


            {
              totalPage >
                0 && (

                <ReactPaginate
                  breakLabel="..."
                  previousLabel="←"
                  nextLabel="→"
                  pageCount={
                    totalPage
                  }
                  onPageChange={
                    e =>
                      setCurrentPage(
                        e.selected +
                        1
                      )
                  }
                  forcePage={
                    currentPage -
                    1
                  }
                  className="
                    flex
                    items-center
                    gap-2
                  "
                  activeClassName="
                    !bg-primary
                    !text-white
                    !border-primary
                  "
                  pageClassName="
                    min-w-9
                    h-9
                    border
                    border-gray-300
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-white
                    hover:bg-blue-50
                  "
                  pageLinkClassName="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    px-3
                  "
                  previousClassName="
                    min-w-9
                    h-9
                    border
                    border-gray-300
                    rounded-full
                    bg-white
                  "
                  nextClassName="
                    min-w-9
                    h-9
                    border
                    border-gray-300
                    rounded-full
                    bg-white
                  "
                  previousLinkClassName="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                  "
                  nextLinkClassName="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                  "
                  breakClassName="
                    px-2
                    text-gray-500
                  "
                  disabledClassName="
                    opacity-50
                    cursor-not-allowed
                  "
                />

              )
            }

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* VERIFIKASI TUKAR FAKTUR MODAL */}
      {/* ================================================= */}

      {
        showVerificationModal &&
        selectedData && (

          <div
            className="
              fixed
              inset-0
              z-[9999]
              bg-black/40
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
            onClick={
              closeVerification
            }
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-4xl
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div
                className="
                  bg-primary
                  px-6
                  py-4
                  text-white
                  sticky
                  top-0
                  z-10
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-white/15
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <FaExchangeAlt />

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >
                        Verifikasi Tukar Faktur
                      </h3>

                      <p
                        className="
                          text-xs
                          text-blue-100
                        "
                      >
                        Tentukan apakah Tukar Faktur diterima atau ditolak
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      closeVerification
                    }
                    disabled={
                      isSubmitting
                    }
                    className="
                      w-9
                      h-9
                      rounded-full
                      hover:bg-white/10
                      flex
                      items-center
                      justify-center
                      disabled:opacity-40
                    "
                  >

                    <FaTimes />

                  </button>

                </div>

              </div>


              {/* BODY */}

              <div
                className="
                  p-5
                  flex
                  flex-col
                  gap-5
                "
              >

                {/* INFO */}

                <div
                  className="
                    rounded-2xl
                    bg-blue-50
                    border
                    border-blue-100
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <FaInfoCircle
                      className="
                        text-primary
                        mt-0.5
                      "
                    />

                    <div>

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-blue-800
                        "
                      >
                        Informasi Verifikasi
                      </p>

                      <p
                        className="
                          text-xs
                          text-blue-700
                          mt-1
                          leading-relaxed
                        "
                      >
                        Periksa dokumen faktur pengganti sebelum menerima proses Tukar Faktur. 
                      </p>

                    </div>

                  </div>

                </div>


                {/* DETAIL FAKTUR */}

                <div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-4
                    "
                  >

                    <FaFileInvoiceDollar
                      className="
                        text-primary
                      "
                    />

                    <h3
                      className="
                        font-bold
                        text-gray-700
                      "
                    >
                      Detail Tukar Faktur
                    </h3>

                  </div>


                  <div
                    className="
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      p-5
                    "
                  >

                    <div
                      className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-x-6
                        gap-y-5
                      "
                    >

                      {/* NO FAKTUR */}

                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-1
                          "
                        >
                          No. Faktur
                        </p>

                        <p
                          className="
                            text-sm
                            font-bold
                            text-primary
                          "
                        >
                          {
                            selectedData.no_faktur
                          }
                        </p>

                      </div>


                      {/* CUSTOMER */}

                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-1
                          "
                        >
                          Customer
                        </p>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-700
                          "
                        >
                          {
                            selectedData.nama_customer
                          }
                        </p>

                      </div>


                      {/* ALAMAT */}

                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-1
                          "
                        >
                          Alamat
                        </p>

                        <p
                          className="
                            text-sm
                            text-gray-700
                          "
                        >
                          {
                            selectedData.alamat
                          }
                        </p>

                      </div>


                      {/* JATUH TEMPO */}

                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-1
                          "
                        >
                          Jatuh Tempo
                        </p>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-700
                          "
                        >
                          {
                            formatDate(
                              selectedData.jatuh_tempo
                            )
                          }
                        </p>

                      </div>


                      {/* TANGGAL TUKAR */}

                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-1
                          "
                        >
                          Tanggal Tukar Faktur
                        </p>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-700
                          "
                        >
                          {
                            formatDate(
                              selectedData.tanggal_tukar
                            )
                          }
                        </p>

                      </div>


                      {/* NOMINAL */}

                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-1
                          "
                        >
                          Nominal
                        </p>

                        <p
                          className="
                            text-sm
                            font-bold
                            text-primary
                          "
                        >
                          {
                            formatCurrency(
                              selectedData.nominal
                            )
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* DOKUMEN PENGGANTI */}

                <div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-3
                    "
                  >

                    <FaFileAlt
                      className="
                        text-primary
                      "
                    />

                    <h3
                      className="
                        font-bold
                        text-gray-700
                      "
                    >
                      Dokumen Faktur Pengganti
                    </h3>

                  </div>


                  <div
                    className="
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            w-11
                            h-11
                            rounded-xl
                            bg-red-50
                            text-red-500
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <FaFileAlt />

                        </div>

                        <div>

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-gray-700
                              break-all
                            "
                          >
                            {
                              selectedData.nama_dokumen_tukar ||
                              "Dokumen faktur pengganti"
                            }
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-400
                              mt-1
                            "
                          >
                            Dokumen yang diajukan untuk proses Tukar Faktur
                          </p>

                        </div>

                      </div>


                      {
                        selectedData.dokumen_tukar && (
                          <a
                            href={
                              typeof selectedData.dokumen_tukar ===
                                "string"
                                ? selectedData.dokumen_tukar
                                : undefined
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={
                              e => {

                                if (
                                  typeof selectedData.dokumen_tukar !==
                                  "string"
                                ) {
                                  e.preventDefault();
                                  alert(
                                    "Dokumen tersedia pada data aplikasi."
                                  );
                                }

                              }
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              px-4
                              py-2
                              rounded-full
                              bg-blue-50
                              text-primary
                              border
                              border-blue-100
                              text-xs
                              font-semibold
                              hover:bg-blue-100
                              whitespace-nowrap
                            "
                          >

                            <FaEye />

                            Lihat Dokumen

                          </a>
                        )
                      }

                    </div>

                  </div>

                </div>

                {/* ALASAN PENOLAKAN */}

                {
                  showRejectionReason && (
                    <div
                      className="
                        rounded-2xl
                        bg-red-50
                        border
                        border-red-100
                        p-5
                      "
                    >

                      <label
                        className="
                          block
                          text-sm
                          font-semibold
                          text-gray-700
                          mb-2
                        "
                      >
                        Alasan Penolakan
                        <span
                          className="
                            text-red-500
                            ml-1
                          "
                        >
                          *
                        </span>
                      </label>

                      <textarea
                        className="
                          textarea
                          textarea-bordered
                          w-full
                          bg-white
                          rounded-xl
                          min-h-[100px]
                          border-red-200
                          focus:border-red-400
                          focus:outline-none
                        "
                        placeholder="
                          Masukkan alasan penolakan Tukar Faktur...
                        "
                        value={
                          rejectionReason
                        }
                        onChange={
                          e =>
                            setRejectionReason(
                              e.target.value
                            )
                        }
                        disabled={
                          isSubmitting
                        }
                      />

                      <p
                        className="
                          text-xs
                          text-red-500
                          mt-2
                        "
                      >
                        Alasan wajib diisi jika Tukar Faktur ditolak.
                      </p>

                    </div>
                  )
                }




                {/* STATUS */}

                {
                  selectedData.status_verifikasi_tukar !==
                    "MENUNGGU_VERIFIKASI" && (

                    <div
                      className={`
                        rounded-xl
                        border
                        p-4
                        ${
                          selectedData.status_verifikasi_tukar ===
                          "SUDAH_DIVERIFIKASI"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }
                      `}
                    >

                      <div
                        className="
                          flex
                          items-start
                          gap-3
                        "
                      >

                        {
                          selectedData.status_verifikasi_tukar ===
                          "SUDAH_DIVERIFIKASI"
                            ? (
                              <FaCheckCircle
                                className="
                                  text-green-600
                                  mt-0.5
                                "
                              />
                            )
                            : (
                              <FaTimesCircle
                                className="
                                  text-red-600
                                  mt-0.5
                                "
                              />
                            )
                        }

                        <div>

                          <p
                            className={`
                              text-sm
                              font-semibold
                              ${
                                selectedData.status_verifikasi_tukar ===
                                "SUDAH_DIVERIFIKASI"
                                  ? "text-green-800"
                                  : "text-red-800"
                              }
                            `}
                          >

                            {
                              selectedData.status_verifikasi_tukar ===
                              "SUDAH_DIVERIFIKASI"
                                ? "Tukar Faktur Sudah Diverifikasi"
                                : "Tukar Faktur Ditolak"
                            }

                          </p>

                          <p
                            className="
                              text-xs
                              mt-1
                              text-gray-600
                            "
                          >

                            Tanggal verifikasi:{" "}

                            {
                              formatDate(
                                selectedData.tanggal_verifikasi_tukar
                              )
                            }

                          </p>

                        </div>

                      </div>

                    </div>

                  )
                }

              </div>


              {/* FOOTER */}

              <div
                className="
                  border-t
                  bg-gray-50
                  px-5
                  py-4
                  flex
                  flex-col
                  sm:flex-row
                  justify-end
                  gap-3
                "
              >

                <button
                  type="button"
                  onClick={
                    closeVerification
                  }
                  disabled={
                    isSubmitting
                  }
                  className="
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
                  Tutup
                </button>

                {
                  selectedData.status_verifikasi_tukar ===
                    "MENUNGGU_VERIFIKASI" && (
                    <>

                      <button
                        type="button"
                        onClick={() => {

                          setShowRejectionReason(
                            true
                          );

                        }}
                        disabled={
                          isSubmitting
                        }
                        className="
                          px-5
                          py-2.5
                          rounded-full
                          bg-red-500
                          text-white
                          text-sm
                          font-semibold
                          hover:bg-red-600
                          shadow-md
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          disabled:bg-gray-300
                        "
                      >
                        <FaTimes />

                        Tolak Tukar Faktur

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleVerification(
                            "TERIMA"
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                        className="
                          px-6
                          py-2.5
                          rounded-full
                          bg-green-600
                          text-white
                          text-sm
                          font-semibold
                          hover:bg-green-700
                          shadow-md
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          disabled:bg-gray-300
                        "
                      >

                        {
                          isSubmitting
                            ? (
                              <span
                                className="
                                  loading
                                  loading-spinner
                                  loading-xs
                                "
                              />
                            )
                            : (
                              <FaCheck />
                            )
                        }

                        Terima Tukar Faktur

                      </button>

                      {
                        showRejectionReason && (
                          <button
                            type="button"
                            onClick={() =>
                              handleVerification(
                                "TOLAK"
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                            className="
                              px-5
                              py-2.5
                              rounded-full
                              bg-red-700
                              text-white
                              text-sm
                              font-semibold
                              hover:bg-red-800
                              shadow-md
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              disabled:bg-gray-300
                            "
                          >

                            <FaTimesCircle />

                            Konfirmasi Tolak

                          </button>
                        )
                      }

                    </>

                  )
                }

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

};


export default TableVerifikasiTukarFaktur;