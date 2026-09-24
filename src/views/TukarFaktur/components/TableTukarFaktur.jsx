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
  FaUpload,
  FaTimes,
  FaClipboardList,
  FaFileAlt,
  FaCheck,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

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
// DUMMY DATA FAKTUR
// =====================================================
// Struktur data tetap mengikuti data sebelumnya.
// Status sudah diubah menjadi status Tukar Faktur.
// =====================================================

const dummyData = [
  {
    id: 1,
    no_faktur: "INV-2026-00001",
    nama_customer: "Dinas Kesehatan Kota Medan",
    alamat: "Jl. Gatot Subroto No. 125, Medan",
    jatuh_tempo: "2026-08-22",
    nominal: 140000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
  },

  {
    id: 2,
    no_faktur: "INV-2026-00002",
    nama_customer: "Apotek Maju Djaya",
    alamat: "Jl. Sisingamangaraja No. 88, Medan",
    jatuh_tempo: "2026-08-25",
    nominal: 85000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
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
  },

  {
    id: 4,
    no_faktur: "INV-2026-00004",
    nama_customer: "RSUD Pasuruan",
    alamat: "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",
    jatuh_tempo: "2026-08-29",
    nominal: 175000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
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
  },

  {
    id: 6,
    no_faktur: "INV-2026-00006",
    nama_customer: "Apotek Sehat Sentosa",
    alamat: "Jl. Kelapa Gading Raya No. 21, Jakarta",
    jatuh_tempo: "2026-09-01",
    nominal: 65000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
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
  },

  {
    id: 8,
    no_faktur: "INV-2026-00008",
    nama_customer: "RS Siloam Medan",
    alamat: "Jl. Imam Bonjol No. 5, Medan",
    jatuh_tempo: "2026-09-05",
    nominal: 210000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
  },

  {
    id: 9,
    no_faktur: "INV-2026-00009",
    nama_customer: "Dinas Kesehatan Deli Serdang",
    alamat: "Jl. Negara No. 100, Deli Serdang",
    jatuh_tempo: "2026-09-07",
    nominal: 125000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
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
  },

  {
    id: 11,
    no_faktur: "INV-2026-00011",
    nama_customer: "RSUD Kota Bogor",
    alamat: "Jl. Pajajaran No. 50, Bogor",
    jatuh_tempo: "2026-09-12",
    nominal: 185000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
  },

  {
    id: 12,
    no_faktur: "INV-2026-00012",
    nama_customer: "Apotek Berkah Farma",
    alamat: "Jl. Merdeka No. 12, Bogor",
    jatuh_tempo: "2026-09-15",
    nominal: 55000000,
    status: "BELUM_DITUKAR",
    dokumen_tukar: null,
    nama_dokumen_tukar: null,
    tanggal_tukar: null,
  },
];


// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {
  BELUM_DITUKAR: {
    label: "Belum Ditukar",
    icon: FaClock,
    className: "bg-amber-100 text-amber-700",
  },

  SUDAH_DITUKAR: {
    label: "Sudah Ditukar",
    icon: FaCheckCircle,
    className: "bg-green-100 text-green-700",
  },
};


// =====================================================
// COMPONENT
// =====================================================

const TableTukarFaktur = ({
  dimensionScreenW,
  check,
  loginAccess,
  onTukarFaktur,
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
    selectedFaktur,
    setSelectedFaktur,
  ] = useState(null);

  const [
    showTukarModal,
    setShowTukarModal,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    showDocumentModal,
    setShowDocumentModal,
  ] = useState(false);


  const [
    selectedIds,
    setSelectedIds,
  ] = useState([]);

  const [
    bulkFiles,
    setBulkFiles,
  ] = useState({});


  // ===================================================
  // SUMMARY
  // ===================================================

  const summaryData = useMemo(
    () => {

      const total = allData.length;

      const belum = allData.filter(
        item =>
          item.status === "BELUM_DITUKAR"
      ).length;

      const sudah = allData.filter(
        item =>
          item.status === "SUDAH_DITUKAR"
      ).length;

      return {
        total,
        belum,
        sudah,
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
        data = data.filter(
          item =>
            item.status ===
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

        data = data.filter(
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


  // ===================================================
  // RESET PAGE
  // ===================================================

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
  // OPEN TUKAR FAKTUR
  // ===================================================

  const openTukarFaktur = (
    faktur
  ) => {

    setSelectedFaktur(
      faktur
    );

    setSelectedIds([
      faktur.id,
    ]);

    setBulkFiles({});

    setShowTukarModal(
      true
    );
  };


  // ===================================================
  // SELECTION TUKAR FAKTUR
  // ===================================================

  const selectableData = useMemo(
    () => filteredData.filter(
      item => item.status === "BELUM_DITUKAR"
    ),
    [filteredData]
  );

  const selectedFakturList = useMemo(
    () => allData.filter(
      item => selectedIds.includes(item.id) &&
        item.status === "BELUM_DITUKAR"
    ),
    [allData, selectedIds]
  );

  const toggleSelectFaktur = (
    faktur
  ) => {
    if (faktur.status !== "BELUM_DITUKAR") {
      return;
    }

    setSelectedIds(
      prev => prev.includes(faktur.id)
        ? prev.filter(id => id !== faktur.id)
        : [...prev, faktur.id]
    );
  };

  const toggleSelectAll = () => {
    const selectableIds = selectableData.map(
      item => item.id
    );

    const allSelected = selectableIds.length > 0 &&
      selectableIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(
        prev => prev.filter(id => !selectableIds.includes(id))
      );
    } else {
      setSelectedIds(
        prev => Array.from(new Set([
          ...prev,
          ...selectableIds,
        ]))
      );
    }
  };

  const openBulkTukarFaktur = () => {
    const fakturTerpilih = allData.filter(
      item => selectedIds.includes(item.id) &&
        item.status === "BELUM_DITUKAR"
    );

    if (fakturTerpilih.length === 0) {
      alert("Silakan pilih minimal satu faktur yang belum ditukar.");
      return;
    }

    setSelectedFaktur(
      fakturTerpilih[0]
    );

    setBulkFiles({});
    setShowTukarModal(true);
  };


  // ===================================================
  // CLOSE TUKAR MODAL
  // ===================================================

  const closeTukarFaktur = () => {

    if (isSubmitting) {
      return;
    }

    setSelectedFaktur(null);

    setBulkFiles({});
    setShowTukarModal(false);
  };


  // ===================================================
  // OPEN DOCUMENT
  // ===================================================

  const openDocument = (
    faktur
  ) => {

    setSelectedFaktur(
      faktur
    );

    setShowDocumentModal(
      true
    );
  };


  // ===================================================
  // CLOSE DOCUMENT
  // ===================================================

  const closeDocument = () => {

    setSelectedFaktur(
      null
    );

    setShowDocumentModal(
      false
    );
  };


  // ===================================================
  // FILE CHANGE
  // ===================================================

  const handleBulkFileChange = (
    e,
    fakturId
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    // MAX 25 MB
    const maxSize =
      25 *
      1024 *
      1024;

    if (
      file.size >
      maxSize
    ) {
      alert(
        "Ukuran dokumen maksimal 25 MB."
      );
      e.target.value = "";
      return;
    }

    setBulkFiles(
      prev => ({
        ...prev,
        [fakturId]: file,
      })
    );
  };


  // ===================================================
  // SUBMIT TUKAR FAKTUR
  // ===================================================

  const handleTukarFaktur =
    async () => {

      const fakturTerpilih = allData.filter(
        item => selectedIds.includes(item.id) &&
          item.status === "BELUM_DITUKAR"
      );

      if (fakturTerpilih.length === 0) {
        alert("Silakan pilih minimal satu faktur yang belum ditukar.");
        return;
      }

      const belumUpload = fakturTerpilih.filter(
        faktur => !bulkFiles[faktur.id]
      );

      if (belumUpload.length > 0) {
        alert(
          `Silakan upload bukti tukar faktur untuk ${belumUpload.length} faktur yang dipilih.`
        );
        return;
      }

      try {
        setIsSubmitting(true);

        const berhasilIds = [];

        for (const faktur of fakturTerpilih) {
          const file = bulkFiles[faktur.id];

          if (typeof onTukarFaktur === "function") {
            await onTukarFaktur({
              faktur,
              file,
            });
          }

          berhasilIds.push(faktur.id);
        }

        const tanggalTukar = new Date().toISOString();

        setAllData(
          prev => prev.map(
            item => berhasilIds.includes(item.id)
              ? {
                ...item,
                status: "SUDAH_DITUKAR",
                dokumen_tukar: bulkFiles[item.id],
                nama_dokumen_tukar: bulkFiles[item.id]?.name,
                tanggal_tukar: tanggalTukar,
              }
              : item
          )
        );

        setSelectedIds([]);

        alert(
          `${berhasilIds.length} faktur berhasil ditukar.`
        );

        closeTukarFaktur();

      } catch (error) {
        console.error(
          "Gagal tukar faktur:",
          error
        );

        alert(
          "Gagal melakukan proses Tukar Faktur. Silakan periksa kembali dokumen yang dipilih."
        );

      } finally {
        setIsSubmitting(false);
      }
    };


  // ===================================================
  // STATUS
  // ===================================================

  const renderStatus =
    (
      status
    ) => {

      const config =
        statusConfig[
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

  const renderAction =
    (
      faktur
    ) => {

      const sudahDitukar =
        faktur.status === "SUDAH_DITUKAR";

      if (
        sudahDitukar
      ) {
        return (
          <button
            type="button"
            onClick={() =>
              openDocument(
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
              bg-green-50
              text-green-700
              border
              border-green-200
              text-xs
              font-semibold
              hover:bg-green-100
              transition
              whitespace-nowrap
            "
          >
            <FaEye />
            Lihat Dokumen
          </button>
        );
      }

      const checked = selectedIds.includes(faktur.id);

      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label
            className={`
              flex
              items-center
              justify-center
              w-9
              h-9
              rounded-full
              border
              cursor-pointer
              transition
              ${checked
                ? "bg-blue-50 border-primary text-primary"
                : "bg-white border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-primary"
              }
            `}
            title={checked ? "Batalkan pilihan" : "Pilih faktur"}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={checked}
              onChange={() =>
                toggleSelectFaktur(faktur)
              }
            />

            {checked ? (
              <FaCheck />
            ) : (
              <span className="w-4 h-4 rounded border border-current" />
            )}
          </label>

          <button
            type="button"
            onClick={() =>
              openTukarFaktur(
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
            <FaExchangeAlt />
            Tukar Faktur
          </button>
        </div>
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
  // HEADER TABLE
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
      label: "Jatuh Tempo",
      icon: <FaCalendarAlt />,
    },

    {
      label: "Nominal",
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "Status",
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

        {/* SEARCH */}

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
              Cari nomor faktur / customer...
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


        {/* STATUS */}

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
              min-w-[190px]
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

            <option value="BELUM_DITUKAR">
              Belum Ditukar
            </option>

            <option value="SUDAH_DITUKAR">
              Sudah Ditukar
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
          lg:grid-cols-3
          gap-4
        "
      >

        {/* TOTAL */}

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
                Total Faktur
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


        {/* BELUM DITUKAR */}

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
                Belum Ditukar
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-amber-900
                "
              >
                {
                  summaryData.belum
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


        {/* SUDAH DITUKAR */}

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
                Sudah Ditukar
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

      </div>


      {/* ================================================= */}
      {/* BULK ACTION */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          items-stretch
          sm:items-center
          justify-between
          gap-3
          rounded-2xl
          border
          border-blue-100
          bg-blue-50/70
          px-4
          py-3
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              bg-blue-100
              text-primary
            "
          >
            <FaClipboardList />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">
              Pilih Faktur untuk Tukar Faktur
            </p>
            <p className="text-xs text-gray-500">
              {selectedIds.length > 0
                ? `${selectedIds.length} faktur dipilih`
                : "Anda dapat memilih lebih dari satu faktur sekaligus."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openBulkTukarFaktur}
          disabled={selectedIds.length === 0}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-2.5
            rounded-full
            bg-primary
            text-white
            text-sm
            font-semibold
            shadow-sm
            hover:opacity-90
            transition
            disabled:bg-gray-300
            disabled:cursor-not-allowed
            whitespace-nowrap
          "
        >
          <FaExchangeAlt />
          Tukar {selectedIds.length > 0 ? `${selectedIds.length} Faktur` : "Faktur"}
        </button>
      </div>


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div
        className={
          dimensionScreenW <
            768 &&
            check
            ? "bringToBack"
            : ""
        }
      >

        <div
          className="
            bg-white
            rounded-2xl
            shadow-xl
            overflow-hidden
            border
            border-gray-200
          "
        >

          <div
            className="
              overflow-auto
              rounded-2xl
              max-h-[65vh]
            "
          >

            <table
              className="
                table
                w-full
              "
            >

              {/* HEADER */}

              <thead
                className="
                  bg-primary
                  text-white
                  sticky
                  top-0
                  text-[13px]
                  z-10
                "
              >

                <tr>

                  {
                    headerTable.map(
                      (
                        h,
                        i
                      ) => (

                        <th
                          key={i}
                          className="
                            px-4
                            py-3
                            whitespace-nowrap
                          "
                        >

                          {i === 0 ? (
                            <div className="flex items-center gap-2 font-semibold">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-sm border-white/70 bg-white/10 checked:bg-white checked:text-primary"
                                checked={
                                  selectableData.length > 0 &&
                                  selectableData.every(item => selectedIds.includes(item.id))
                                }
                                onChange={toggleSelectAll}
                                disabled={selectableData.length === 0}
                                title="Pilih semua faktur yang belum ditukar"
                              />
                              <span>{h.icon}</span>
                              {h.label}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 font-semibold">
                              <span>{h.icon}</span>
                              {h.label}
                            </div>
                          )}

                        </th>

                      )
                    )
                  }

                </tr>

              </thead>


              {/* BODY */}

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
                          py-16
                          text-gray-500
                        "
                      >

                        <FaClipboardList
                          className="
                            text-4xl
                            text-gray-300
                            mx-auto
                            mb-3
                          "
                        />

                        <p className="font-medium">
                          Tidak ada data faktur
                        </p>

                        <p className="text-xs mt-1">
                          Coba ubah pencarian atau filter status.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    paginatedData.map(
                      (
                        v,
                        i
                      ) => (

                        <tr
                          key={
                            v.id
                          }
                          className="
                            transition
                            duration-200
                            border-b
                            hover:bg-blue-50
                          "
                        >

                          {/* AKSI */}

                          <td
                            className="
                              px-4
                              py-3
                            "
                          >

                            {
                              renderAction(
                                v
                              )
                            }

                          </td>

                          {/* NO */}

                          <td
                            className="
                              px-4
                              py-3
                              font-semibold
                              text-gray-700
                            "
                          >

                            {
                              (
                                currentPage -
                                1
                              ) *
                              perPage +
                              i +
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

                              <div
                                className="
                                  w-9
                                  h-9
                                  rounded-lg
                                  bg-blue-50
                                  flex
                                  items-center
                                  justify-center
                                "
                              >

                                <FaFileInvoiceDollar
                                  className="
                                    text-primary
                                  "
                                />

                              </div>


                              <span
                                className="
                                  font-semibold
                                  text-primary
                                "
                              >
                                {
                                  v.no_faktur
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

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                                min-w-[220px]
                              "
                            >

                              <div
                                className="
                                  w-9
                                  h-9
                                  rounded-full
                                  bg-blue-50
                                  text-primary
                                  flex
                                  items-center
                                  justify-center
                                "
                              >

                                <FaBuilding />

                              </div>


                              <div>

                                <p
                                  className="
                                    font-semibold
                                    text-gray-700
                                  "
                                >
                                  {
                                    v.nama_customer
                                  }
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* ALAMAT */}

                          <td
                            className="
                              px-4
                              py-3
                              min-w-[270px]
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                gap-2
                                text-sm
                                text-gray-600
                              "
                            >

                              <FaMapMarkerAlt
                                className="
                                  text-orange-500
                                  mt-1
                                  shrink-0
                                "
                              />

                              <span>
                                {
                                  v.alamat
                                }
                              </span>

                            </div>

                          </td>


                          {/* JATUH TEMPO */}

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
                              "
                            >

                              <FaCalendarAlt
                                className="
                                  text-primary
                                "
                              />

                              {
                                formatDate(
                                  v.jatuh_tempo
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
                                font-semibold
                                text-gray-700
                              "
                            >
                              {
                                formatCurrency(
                                  v.nominal
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
                                v.status
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


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

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

      </div>


      {/* ================================================= */}
      {/* MODAL TUKAR FAKTUR */}
      {/* ================================================= */}

      {
        showTukarModal &&
        selectedFakturList.length > 0 && (

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
              p-3
              sm:p-5
            "
            onClick={closeTukarFaktur}
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-3xl
                max-h-[90vh]
                flex
                flex-col
                overflow-hidden
              "
              onClick={e => e.stopPropagation()}
            >

              {/* HEADER */}
              <div
                className="
                  bg-primary
                  px-5
                  sm:px-6
                  py-4
                  text-white
                  shrink-0
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="
                        w-10
                        h-10
                        shrink-0
                        rounded-xl
                        bg-white/15
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FaExchangeAlt />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-lg truncate">
                        Tukar Faktur
                      </h3>
                      <p className="text-xs text-blue-100">
                        Proses {selectedFakturList.length} faktur sekaligus
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeTukarFaktur}
                    disabled={isSubmitting}
                    className="
                      w-9
                      h-9
                      shrink-0
                      rounded-full
                      hover:bg-white/10
                      flex
                      items-center
                      justify-center
                      transition
                    "
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div
                className="
                  p-4
                  sm:p-6
                  overflow-y-auto
                  overscroll-contain
                  flex-1
                  min-h-0
                "
              >
                <div className="flex flex-col gap-4">

                  {/* SUMMARY SELECTION */}
                  <div
                    className="
                      rounded-xl
                      bg-blue-50
                      border
                      border-blue-100
                      p-4
                    "
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-blue-100
                            text-primary
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FaClipboardList />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900">
                            {selectedFakturList.length} Faktur Dipilih
                          </p>
                          <p className="text-xs text-blue-700 mt-0.5">
                            Setiap faktur wajib memiliki dokumen pengganti.
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-primary whitespace-nowrap">
                        {formatCurrency(
                          selectedFakturList.reduce(
                            (sum, item) => sum + Number(item.nominal || 0),
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>

                  {/* LIST FAKTUR */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Daftar Faktur
                    </p>

                    <div className="flex flex-col gap-3">
                      {selectedFakturList.map((faktur, index) => {
                        const file = bulkFiles[faktur.id];

                        return (
                          <div
                            key={faktur.id}
                            className="
                              rounded-xl
                              border
                              border-gray-200
                              bg-white
                              shadow-sm
                              p-4
                            "
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div
                                    className="
                                      w-10
                                      h-10
                                      shrink-0
                                      rounded-xl
                                      bg-blue-50
                                      text-primary
                                      flex
                                      items-center
                                      justify-center
                                      font-bold
                                      text-sm
                                    "
                                  >
                                    {index + 1}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="font-bold text-primary break-all">
                                      {faktur.no_faktur}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-700 mt-0.5">
                                      {faktur.nama_customer}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Jatuh Tempo: {formatDate(faktur.jatuh_tempo)}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-left sm:text-right shrink-0">
                                  <p className="text-xs text-gray-500">
                                    Nominal
                                  </p>
                                  <p className="font-bold text-orange-700">
                                    {formatCurrency(faktur.nominal)}
                                  </p>
                                </div>
                              </div>

                              <label
                                className="
                                  relative
                                  flex
                                  items-center
                                  gap-3
                                  w-full
                                  rounded-xl
                                  border-2
                                  border-dashed
                                  border-blue-200
                                  bg-blue-50/50
                                  hover:bg-blue-50
                                  hover:border-primary
                                  transition
                                  cursor-pointer
                                  p-4
                                "
                              >
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={e =>
                                    handleBulkFileChange(
                                      e,
                                      faktur.id
                                    )
                                  }
                                />

                                <div
                                  className={`
                                    w-11
                                    h-11
                                    shrink-0
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    ${file
                                      ? "bg-green-100 text-green-600"
                                      : "bg-blue-100 text-primary"
                                    }
                                  `}
                                >
                                  {file ? (
                                    <FaCheck />
                                  ) : (
                                    <FaUpload />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  {file ? (
                                    <>
                                      <p className="break-all text-sm font-semibold text-gray-700">
                                        {file.name}
                                      </p>

                                      <p className="mt-0.5 text-xs text-gray-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • Klik untuk mengganti
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm font-semibold text-gray-700">
                                        Upload Bukti Tukar Faktur
                                      </p>

                                      <p className="text-xs font-semibold leading-relaxed text-gray-700">
                                        Sebagai bukti akan dibayarkan dan perhitungan insentif untuk sales
                                      </p>

                                      <p className="mt-0.5 text-xs text-gray-400">
                                        PDF, JPG, JPEG, PNG • Maks. 25 MB
                                      </p>
                                    </>
                                  )}
                                </div>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* INFO */}
                  <div
                    className="
                      rounded-xl
                      bg-amber-50
                      border
                      border-amber-200
                      p-4
                    "
                  >
                    <div className="flex items-start gap-3">
                      <FaFileInvoiceDollar className="text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">
                          Perhatian
                        </p>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                          Pastikan setiap dokumen yang diupload sesuai dengan nomor faktur yang dipilih sebelum melakukan proses Tukar Faktur.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* FOOTER */}
              <div
                className="
                  border-t
                  bg-gray-50
                  px-4
                  sm:px-5
                  py-4
                  flex
                  flex-col-reverse
                  sm:flex-row
                  justify-between
                  gap-3
                  shrink-0
                "
              >
                <div className="flex items-center text-xs text-gray-500">
                  {Object.keys(bulkFiles).length} / {selectedFakturList.length} dokumen siap diproses
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={closeTukarFaktur}
                    disabled={isSubmitting}
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
                      transition
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    disabled={
                      isSubmitting ||
                      selectedFakturList.length === 0 ||
                      selectedFakturList.some(item => !bulkFiles[item.id])
                    }
                    onClick={handleTukarFaktur}
                    className="
                      w-full
                      sm:w-auto
                      px-6
                      py-2.5
                      rounded-full
                      bg-primary
                      text-white
                      text-sm
                      font-semibold
                      hover:opacity-90
                      shadow-md
                      disabled:bg-gray-300
                      disabled:cursor-not-allowed
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      transition
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FaExchangeAlt />
                        Tukar {selectedFakturList.length} Faktur
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )
      }


      {/* ================================================= */}
      {/* MODAL LIHAT DOKUMEN */}
      {/* ================================================= */}

      {
        showDocumentModal &&
        selectedFaktur && (

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
              p-3
              sm:p-5
            "
            onClick={
              closeDocument
            }
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-lg
                overflow-hidden
              "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div
                className="
                  bg-green-600
                  px-5
                  py-4
                  text-white
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

                      <FaFileAlt />

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >
                        Dokumen Faktur
                      </h3>

                      <p
                        className="
                          text-xs
                          text-green-100
                        "
                      >
                        Dokumen faktur pengganti
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      closeDocument
                    }
                    className="
                      w-9
                      h-9
                      rounded-full
                      hover:bg-white/10
                      flex
                      items-center
                      justify-center
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
                  sm:p-6
                "
              >

                <div
                  className="
                    rounded-xl
                    bg-green-50
                    border
                    border-green-100
                    p-4
                    mb-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <FaCheckCircle
                      className="
                        text-green-600
                        text-xl
                      "
                    />

                    <div>

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-green-800
                        "
                      >
                        Faktur Sudah Ditukar
                      </p>

                      <p
                        className="
                          text-xs
                          text-green-700
                          mt-0.5
                        "
                      >
                        {
                          selectedFaktur.tanggal_tukar
                            ? formatDate(
                              selectedFaktur.tanggal_tukar
                            )
                            : "-"
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* INFO FAKTUR */}

                <div
                  className="
                    space-y-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      pb-3
                      border-b
                    "
                  >

                    <span
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      No. Faktur
                    </span>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-primary
                      "
                    >
                      {
                        selectedFaktur.no_faktur
                      }
                    </span>

                  </div>


                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      pb-3
                      border-b
                    "
                  >

                    <span
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Customer
                    </span>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-gray-700
                        text-right
                      "
                    >
                      {
                        selectedFaktur.nama_customer
                      }
                    </span>

                  </div>


                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      pb-3
                      border-b
                    "
                  >

                    <span
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Nominal
                    </span>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      {
                        formatCurrency(
                          selectedFaktur.nominal
                        )
                      }
                    </span>

                  </div>


                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    <span
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Dokumen
                    </span>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-gray-700
                        text-right
                        break-all
                      "
                    >
                      {
                        selectedFaktur
                          .nama_dokumen_tukar ||
                        "Dokumen tersedia"
                      }
                    </span>

                  </div>

                </div>


                {/* DOCUMENT BUTTON */}

                {
                  selectedFaktur.dokumen_tukar && (
                    <a
                      href={
                        typeof selectedFaktur.dokumen_tukar ===
                          "string"
                          ? selectedFaktur.dokumen_tukar
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={
                        e => {

                          if (
                            typeof selectedFaktur.dokumen_tukar !==
                            "string"
                          ) {
                            e.preventDefault();
                          }

                        }
                      }
                      className="
                        mt-5
                        w-full
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-full
                        bg-green-600
                        text-white
                        text-sm
                        font-semibold
                        hover:bg-green-700
                        transition
                      "
                    >

                      <FaEye />

                      Buka Dokumen

                    </a>
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
                  justify-end
                "
              >

                <button
                  type="button"
                  onClick={
                    closeDocument
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
                    transition
                  "
                >
                  Tutup
                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>
  );
};


export default TableTukarFaktur;