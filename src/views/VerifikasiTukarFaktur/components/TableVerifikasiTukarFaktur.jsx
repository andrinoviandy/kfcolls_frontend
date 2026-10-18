import React, {
  useEffect,
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
  FaSearch,
  FaFilter,
  FaSyncAlt,
} from "react-icons/fa";

import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import { swal } from "global/helper/swal";
import storeSchema from "global/store";


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
// - dpp
// - ppn
// - pph
// - total_invoice
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

const firstValue = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") return item[key];
  }
  return null;
};

const getId = (item) => firstValue(item, "piutang_id", "faktur_id", "id");
const getNoFaktur = (item) => firstValue(item, "no_faktur", "nomor_faktur", "noFaktur") || "-";
const getCustomer = (item) => firstValue(item, "nama_customer", "customer_name", "customer") || "-";
const getAlamat = (item) => firstValue(item, "alamat", "customer_address") || "-";
const getJatuhTempo = (item) => firstValue(item, "jatuh_tempo", "due_date") || null;
const getDpp = (item) => Number(firstValue(item, "dpp", "DPP") || 0);
const getPpn = (item) => Number(firstValue(item, "ppn", "PPN") || 0);
const getPph = (item) => Number(firstValue(item, "pph", "PPH") || 0);
const getTotalInvoice = (item) => getDpp(item) + getPpn(item);
const getStatusVerifikasi = (item) => {
  const raw = String(firstValue(item, "status_verifikasi_tukar", "status_verifikasi", "status_verifikasi_faktur") || "").toUpperCase();
  if (raw.includes("DITOLAK") || raw.includes("TOLAK")) return "DITOLAK";
  if (raw.includes("MENUNGGU")) return "MENUNGGU_VERIFIKASI";
  if (raw.includes("DITERIMA") || raw === "SUDAH") return "DITERIMA";
  return "MENUNGGU_VERIFIKASI";
};
const getTanggalTukar = (item) => firstValue(item, "tanggal_tukar", "tukar_faktur_at", "tukar_faktur_created_at", "updated_at") || null;
const getDocumentNumber = (item) => firstValue(item, "create_document_number", "document_number", "no_document") || "";
const getNamaDokumenTukar = (item) => firstValue(item, "nama_dokumen_tukar", "dokumen_tukar_nama", "file_name") || "";
const getDokumenTukar = (item) => firstValue(item, "dokumen_tukar", "files", "file_tukar_faktur", "file_url") || "";
const normalizeRow = (item, index, page, perPage) => ({
  ...item,
  id: getId(item),
  piutang_id: firstValue(item, "piutang_id", "faktur_id", "id"),
  no_faktur: getNoFaktur(item),
  nama_customer: getCustomer(item),
  alamat: getAlamat(item),
  jatuh_tempo: getJatuhTempo(item),
  dpp: getDpp(item),
  ppn: getPpn(item),
  pph: getPph(item),
  total_invoice: getTotalInvoice(item),
  status_verifikasi_tukar: getStatusVerifikasi(item),
  tanggal_tukar: getTanggalTukar(item),
  create_document_number: getDocumentNumber(item),
  nama_dokumen_tukar: getNamaDokumenTukar(item),
  dokumen_tukar: getDokumenTukar(item),
  cabang: firstValue(item, "cabang", "sales_office"),
  nama_cabang: firstValue(item, "nama_cabang", "cabang_name", "sales_office_name") || "-",
  customer: firstValue(item, "customer", "kode_customer") || "",
  No: (page - 1) * perPage + index + 1,
});

const FilterOption = (props) => (
  <selectComponents.Option {...props}>
    <input type="checkbox" checked={props.isSelected} readOnly className="checkbox checkbox-primary checkbox-xs mr-2" />
    {props.label}
  </selectComponents.Option>
);
const FilterMultiValue = () => null;
const FilterValueContainer = ({ children, ...props }) => {
  const selectedCount = props.getValue().length;
  return (
    <selectComponents.ValueContainer {...props}>
      {selectedCount > 0 ? `${selectedCount} dipilih` : children[0]}
      {children[1]}
    </selectComponents.ValueContainer>
  );
};
const filterSelectComponents = { Option: FilterOption, MultiValue: FilterMultiValue, ValueContainer: FilterValueContainer };
const filterSelectStyles = {
  control: (base, state) => ({ ...base, minHeight: 36, borderRadius: 9999, borderColor: state.isFocused ? "#2563eb" : "#d1d5db", boxShadow: "none", fontSize: ".875rem", ":hover": { borderColor: "#2563eb" } }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 36 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};
const getSelectedFilterOptions = (options, selectedValues) => options.filter((option) => selectedValues.includes(option.value));


// STATUS CONFIG
// =====================================================

const verificationStatusConfig = {

  MENUNGGU_VERIFIKASI: {
    label: "Menunggu Verifikasi",
    icon: FaClock,
    className:
      "bg-amber-100 text-amber-700",
  },

  DITERIMA: {
    label: "Diterima",
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

  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({ total: 0, menunggu: 0, diterima: 0, ditolak: 0 });
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCabang, setFilterCabang] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===================================================
  // FILTER OPTIONS
  // ===================================================

  const getReferensi = async () => {
    try {
      const refCabang = await storeSchema.actions.getReferensiByJenis("cabang_id");
      if (refCabang?.status === true) {
        setCabangOptions((refCabang?.data || []).map((item) => ({ label: item?.ur_ref, value: item?.kd_ref })));
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI CABANG:", error);
    }
  };

  const loadCustomerOptions = async () => {
    try {
      const res = await storeSchema.actions.getDataVerifikasiTukarFaktur({
        page: 1,
        limit: 9999,
        keyword: "",
        sales_office: "ALL",
        customer: "ALL",
        status: "ALL",
        start_date: "",
        end_date: "",
      });
      if (res?.status === true) {
        const list = res?.data?.list_data || [];
        const unique = [...new Map(list.map((item) => {
          const value = firstValue(item, "customer", "kode_customer", "nama_customer", "customer_name");
          const label = firstValue(item, "nama_customer", "customer_name", "customer", "kode_customer");
          return [String(value || label || ""), { label: label || "-", value: value || label || "" }];
        })).values()].filter((x) => x.value);
        setCustomerOptions(unique);
      }
    } catch (error) {
      console.error("ERROR GET CUSTOMER OPTIONS:", error);
    }
  };

  useEffect(() => {
    getReferensi();
    loadCustomerOptions();
  }, []);

  // ===================================================
  // GET DATA VERIFIKASI TUKAR FAKTUR
  // ===================================================

  const getDataVerifikasiTukarFaktur = async () => {
    try {
      setLoading(true);
      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        sales_office: filterCabang.length ? filterCabang : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        status: selectedStatus,
        start_date: filterStartDate,
        end_date: filterEndDate,
      };
      const res = await storeSchema.actions.getDataVerifikasiTukarFaktur(payload);
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data Verifikasi Tukar Faktur");
      const responseData = res?.data || {};
      const list = responseData?.list_data || [];
      setTableData(list.map((item, index) => normalizeRow(item, index, currentPage, perPage)));
      const totalDataResponse = Number(responseData?.total_data || 0);
      setTotalData(totalDataResponse);
      setTotalPage(Number(responseData?.total_halaman || Math.ceil(totalDataResponse / perPage) || 0));
      const summary = responseData?.summary || {};
      setSummaryData({
        total: Number(summary?.total_verifikasi ?? summary?.total_faktur ?? summary?.total ?? totalDataResponse),
        menunggu: Number(summary?.menunggu_verifikasi ?? summary?.menunggu ?? 0),
        diterima: Number(summary?.diterima ?? 0),
        ditolak: Number(summary?.ditolak ?? 0),
      });
    } catch (error) {
      console.error("ERROR GET DATA VERIFIKASI TUKAR FAKTUR:", error);
      setTableData([]);
      setTotalData(0);
      setTotalPage(0);
      setSummaryData({ total: 0, menunggu: 0, diterima: 0, ditolak: 0 });
      await swal.error(error?.message || "Gagal mengambil data Verifikasi Tukar Faktur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataVerifikasiTukarFaktur();
  }, [currentPage, perPage, searchKeyword, filterCabang, filterCustomer, selectedStatus, filterStartDate, filterEndDate]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setSelectedStatus("ALL");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    if (currentPage === 1) getDataVerifikasiTukarFaktur();
    else setCurrentPage(1);
  };

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

    if (
      action === "TOLAK" &&
      !rejectionReason.trim()
    ) {
      setShowRejectionReason(true);

      swal.warning(
        "Alasan penolakan wajib diisi."
      );

      return;
    }

    if (!selectedData?.tukar_faktur_id) {
      swal.error(
        "Tukar Faktur ID tidak ditemukan."
      );

      return;
    }

    if (!selectedData?.faktur_petugas_id) {
      swal.error(
        "Faktur Petugas ID tidak ditemukan."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const kdStatus =
        action === "TERIMA"
          ? "S"
          : "T";

      const alasanPenolakan =
        action === "TOLAK"
          ? rejectionReason.trim()
          : "";

      const payload = {
        tukar_faktur_id:
          selectedData?.tukar_faktur_id,

        piutang_id:
          selectedData?.piutang_id,

        faktur_petugas_id:
          selectedData?.faktur_petugas_id,

        kegiatan:
          "TUKAR_FAKTUR",

        kd_status:
          kdStatus,

        keterangan:
          alasanPenolakan,

        no_faktur:
          selectedData?.no_faktur,

        user_id:
          loginAccess?.user_id || null,

        nip:
          loginAccess?.nip || null,

        tanggal_verifikasi:
          new Date().toISOString()
      };

      console.log(
        "PAYLOAD VERIFIKASI TUKAR FAKTUR:",
        payload
      );

      const res =
        await storeSchema.actions.verifikasiTukarFaktur(
          payload
        );

      if (res?.status !== true) {
        throw new Error(
          res?.message ||
          "Gagal melakukan verifikasi Tukar Faktur."
        );
      }

      await swal.success(
        action === "TERIMA"
          ? "Tukar Faktur berhasil disetujui."
          : "Tukar Faktur berhasil ditolak."
      );

      closeVerification();

      await getDataVerifikasiTukarFaktur();

    } catch (error) {
      console.error(
        "ERROR VERIFIKASI TUKAR FAKTUR:",
        error
      );

      await swal.error(
        error?.message ||
        "Gagal melakukan verifikasi Tukar Faktur."
      );

    } finally {
      setIsSubmitting(false);
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
      label: "DPP",
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "PPN",
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "PPh",
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "Total Invoice",
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
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input
              type="text"
              placeholder="Cari no faktur / customer / create document..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={keyword}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="button" onClick={handleSearch} title="Cari" aria-label="Cari" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90">
              <FaSearch className="text-sm" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={resetFilter} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50">
              <FaFilter /> Reset Filter
            </button>
            <button type="button" onClick={handleRefresh} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50">
              <FaSyncAlt /> Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Cabang</label>
            <Select
              isMulti
              options={cabangOptions}
              value={getSelectedFilterOptions(cabangOptions, filterCabang)}
              onChange={(selected) => { setCurrentPage(1); setFilterCabang((selected || []).map((item) => item.value)); }}
              placeholder="Semua Cabang"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Customer</label>
            <Select
              isMulti
              options={customerOptions}
              value={getSelectedFilterOptions(customerOptions, filterCustomer)}
              onChange={(selected) => { setCurrentPage(1); setFilterCustomer((selected || []).map((item) => item.value)); }}
              placeholder="Semua Customer"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <Select
              options={[
                { label: "Semua Status", value: "ALL" },
                { label: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
                { label: "Diterima", value: "DITERIMA" },
                { label: "Ditolak", value: "DITOLAK" },
              ]}
              value={[
                { label: "Semua Status", value: "ALL" },
                { label: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
                { label: "Diterima", value: "DITERIMA" },
                { label: "Ditolak", value: "DITOLAK" },
              ].find((item) => item.value === selectedStatus)}
              onChange={(selected) => { setCurrentPage(1); setSelectedStatus(selected?.value || "ALL"); }}
              placeholder="Semua Status"
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">Document Date</label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm">
              <FaCalendarAlt className="text-primary text-sm" />
              <input type="date" value={filterStartDate} max={filterEndDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterStartDate(e.target.value); }} className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]" />
              <span className="text-gray-300">-</span>
              <input type="date" value={filterEndDate} min={filterStartDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterEndDate(e.target.value); }} className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]" />
            </div>
          </div>
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
                Diterima
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-green-900
                "
              >
                {
                  summaryData.diterima
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
                  bg-primary
                  text-white
                  sticky
                  top-0
                  text-[13px]
                  z-10
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
                tableData.length ===
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

                  tableData.map(
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

                          {faktur.No}

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


                        {/* DPP */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{formatCurrency(faktur.dpp)}</span>
                        </td>

                        {/* PPN */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{formatCurrency(faktur.ppn)}</span>
                        </td>

                        {/* PPh */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{formatCurrency(faktur.pph)}</span>
                        </td>

                        {/* TOTAL INVOICE */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-700">{formatCurrency(faktur.total_invoice)}</span>
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
              z-[500]
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


                      {/* DPP */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1">DPP</p>
                        <p className="text-sm font-semibold text-gray-700">{formatCurrency(selectedData.dpp)}</p>
                      </div>

                      {/* PPN */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1">PPN</p>
                        <p className="text-sm font-semibold text-gray-700">{formatCurrency(selectedData.ppn)}</p>
                      </div>

                      {/* PPh */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1">PPh</p>
                        <p className="text-sm font-semibold text-gray-700">{formatCurrency(selectedData.pph)}</p>
                      </div>

                      {/* TOTAL INVOICE */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Total Invoice</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(selectedData.total_invoice)}</p>
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
                                  swal.error(
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
        ${selectedData.status_verifikasi_tukar ===
                          "DITERIMA"
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
                            "DITERIMA"
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
              ${selectedData.status_verifikasi_tukar ===
                                "DITERIMA"
                                ? "text-green-800"
                                : "text-red-800"
                              }
            `}
                          >
                            {
                              selectedData.status_verifikasi_tukar ===
                                "DITERIMA"
                                ? "Tukar Faktur Diterima"
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
                            {selectedData?.tanggal_verifikasi || "-"}
                          </p>

                          {
                            selectedData.status_verifikasi_tukar ===
                            "DITOLAK" &&
                            selectedData?.status_keterangan && (

                              <div
                                className="
                  mt-3
                  pt-3
                  border-t
                  border-red-200
                "
                              >

                                <p
                                  className="
                    text-xs
                    font-semibold
                    text-red-700
                    mb-1
                  "
                                >
                                  Keterangan Penolakan
                                </p>

                                <p
                                  className="
                    text-sm
                    text-red-700
                    leading-relaxed
                  "
                                >
                                  {selectedData.status_keterangan}
                                </p>

                              </div>

                            )
                          }

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