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
  FaUpload,
  FaTimes,
  FaClipboardList,
  FaFileAlt,
  FaCheck,
  FaFilter,
  FaSearch,
  FaSyncAlt,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import { swal } from "global/helper/swal";
import storeSchema from "global/store";


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
// HELPERS
// =====================================================

const firstValue = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") {
      return item[key];
    }
  }
  return null;
};

const getId = (item) => firstValue(item, "piutang_id", "faktur_id", "id");
const getNoFaktur = (item) => firstValue(item, "no_faktur", "nomor_faktur", "noFaktur") || "-";
const getNoBilling = (item) => firstValue(item, "no_billing", "billing_no", "billing_number") || "-";
const getProsesRetur = (item) => firstValue(item, "proses_retur", "no_retur", "retur_no") || "-";
const getCustomer = (item) => firstValue(item, "nama_customer", "customer_name", "customer") || "-";
const getAlamat = (item) => firstValue(item, "alamat", "customer_address") || "-";
const getJatuhTempo = (item) => firstValue(item, "jatuh_tempo", "due_date") || null;
const getNominal = (item) => Number(firstValue(item, "nominal", "outstanding", "saldo_piutang", "dpp") || 0);
const getStatus = (item) => {
  const raw = String(
    firstValue(item, "status", "status_tukar_faktur", "status_tukar", "status_dokumen") || ""
  ).toUpperCase();
  if (raw.includes("BELUM")) return "BELUM_DITUKAR";
  if (raw.includes("SUDAH") || raw.includes("DITUKAR")) return "SUDAH_DITUKAR";
  return "BELUM_DITUKAR";
};
const getDokumenTukar = (item) => firstValue(item, "dokumen_tukar", "dokumen_tukar_faktur", "file_tukar_faktur", "file_url");
const getNamaDokumenTukar = (item) => firstValue(item, "nama_dokumen_tukar", "dokumen_tukar_nama", "file_name");
const getTanggalTukar = (item) => firstValue(item, "tanggal_tukar", "tukar_faktur_at", "updated_at") || null;
const normalizeRow = (item, index, page, perPage) => ({
  ...item,
  id: getId(item),
  piutang_id: firstValue(item, "piutang_id", "faktur_id", "id"),
  no_faktur: getNoFaktur(item),
  no_billing: getNoBilling(item),
  proses_retur: getProsesRetur(item),
  nama_customer: getCustomer(item),
  alamat: getAlamat(item),
  jatuh_tempo: getJatuhTempo(item),
  nominal: getNominal(item),
  status: getStatus(item),
  status_verifikasi_tukar: getStatusVerifikasi(item),
  tanggal_verifikasi: firstValue(item, "tanggal_verifikasi"),
  status_keterangan: firstValue(item, "status_keterangan"),
  dokumen_tukar: getDokumenTukar(item),
  nama_dokumen_tukar: getNamaDokumenTukar(item),
  tanggal_tukar: getTanggalTukar(item),
  No: (page - 1) * perPage + index + 1,
});

const FilterOption = (props) => (
  <selectComponents.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      readOnly
      className="checkbox checkbox-primary checkbox-xs mr-2"
    />
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
const filterSelectComponents = {
  Option: FilterOption,
  MultiValue: FilterMultiValue,
  ValueContainer: FilterValueContainer,
};
const filterSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    borderRadius: 9999,
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
    boxShadow: "none",
    fontSize: ".875rem",
    ":hover": { borderColor: "#2563eb" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 36 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};
const getSelectedFilterOptions = (options, selectedValues) =>
  options.filter((option) => selectedValues.includes(option.value));

const statusConfig = {
  BELUM_DITUKAR: {
    label: "Belum Tukar Faktur",
    icon: FaClock,
    className: "bg-amber-100 text-amber-700",
  },
  SUDAH_DITUKAR: {
    label: "Sudah Tukar Faktur",
    icon: FaCheckCircle,
    className: "bg-green-100 text-green-700",
  },
};
const statusVerifikasiConfig = {
  MENUNGGU_VERIFIKASI: {
    label: "Menunggu Verifikasi",
    icon: FaClock,
    className: "bg-amber-100 text-amber-700",
  },
  DITERIMA: {
    label: "Diterima",
    icon: FaCheckCircle,
    className: "bg-green-100 text-green-700",
  },
  DITOLAK: {
    label: "Ditolak",
    icon: FaTimesCircle,
    className: "bg-red-100 text-red-700",
  },
};

const getStatusVerifikasi = (item) => {
  const raw = String(
    firstValue(item, "status_verifikasi_tukar", "status_verifikasi", "verifikasi_status") || ""
  ).toUpperCase();
  if (raw === "DITERIMA") return "DITERIMA";
  if (raw === "SUDAH_DIVERIFIKASI") return "DITERIMA";
  if (raw === "DITOLAK") return "DITOLAK";
  return "MENUNGGU_VERIFIKASI";
};



// =====================================================
// COMPONENT
// =====================================================

const TableTukarFaktur = ({
  dimensionScreenW,
  check,
  loginAccess,
  onTukarFaktur,
  reloadData,
  setReloadData,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({ total: 0, belum: 0, sudah: 0 });
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCabang, setFilterCabang] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [selectedStatusTukar, setSelectedStatusTukar] = useState("ALL");
  const [selectedStatusVerifikasi, setSelectedStatusVerifikasi] = useState("ALL");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedFaktur, setSelectedFaktur] = useState(null);
  const [showTukarModal, setShowTukarModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [bulkFile, setBulkFile] = useState(null);

  // ===================================================
  // FILTER OPTIONS
  // ===================================================

  const getReferensi = async () => {
    try {
      const refCabang = await storeSchema.actions.getReferensiByJenis("cabang_id");
      if (refCabang?.status === true) {
        setCabangOptions(
          (refCabang?.data || []).map((item) => ({
            label: item?.ur_ref,
            value: item?.kd_ref,
          }))
        );
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI CABANG:", error);
    }
  };

  const loadCustomerOptions = async () => {
    try {
      const res = await storeSchema.actions.getDataTukarFaktur({
        page: 1,
        limit: 9999,
        keyword: "",
        sales_office: "ALL",
        customer: "ALL",
        status: "ALL",
        status_verifikasi: "ALL",
        start_date: "",
        end_date: "",
      });
      if (res?.status === true) {
        const list = res?.data?.list_data || [];
        const unique = [
          ...new Map(
            list.map((item) => {
              const value = firstValue(item, "customer", "nama_customer", "customer_name");
              return [String(value || ""), { label: value || "-", value: value || "" }];
            })
          ).values(),
        ].filter((x) => x.value);
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
  // GET DATA TUKAR FAKTUR
  // ===================================================

  const getDataTukarFaktur = async () => {
    try {
      setLoading(true);
      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        sales_office: filterCabang.length ? filterCabang : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        status: selectedStatusTukar,
        status_verifikasi: selectedStatusVerifikasi,
        start_date: filterStartDate,
        end_date: filterEndDate,
      };
      const res = await storeSchema.actions.getDataTukarFaktur(payload);
      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal mengambil data Tukar Faktur");
      }
      const responseData = res?.data || {};
      const list = responseData?.list_data || [];
      setTableData(list.map((item, index) => normalizeRow(item, index, currentPage, perPage)));
      const totalDataResponse = Number(responseData?.total_data || 0);
      setTotalData(totalDataResponse);
      setTotalPage(Number(responseData?.total_halaman || Math.ceil(totalDataResponse / perPage) || 0));
      const summary = responseData?.summary || {};
      setSummaryData({
        total: Number(summary?.total_faktur ?? summary?.total ?? responseData?.total_data ?? 0),
        belum: Number(summary?.belum_ditukar ?? summary?.belum ?? 0),
        sudah: Number(summary?.sudah_ditukar ?? summary?.sudah ?? 0),
      });
    } catch (error) {
      console.error("ERROR GET DATA TUKAR FAKTUR:", error);
      setTableData([]);
      setTotalData(0);
      setTotalPage(0);
      setSummaryData({ total: 0, belum: 0, sudah: 0 });
      await swal.error(error?.message || "Gagal mengambil data Tukar Faktur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataTukarFaktur();
  }, [
    currentPage,
    perPage,
    searchKeyword,
    filterCabang,
    filterCustomer,
    selectedStatusTukar,
    selectedStatusVerifikasi,
    filterStartDate,
    filterEndDate,
  ]);

  useEffect(() => {
    if (!reloadData) return;
    if (currentPage === 1) getDataTukarFaktur();
    else setCurrentPage(1);
    if (setReloadData) setReloadData(false);
  }, [reloadData]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setSelectedStatusTukar("ALL");
    setSelectedStatusVerifikasi("ALL");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
    setSelectedIds([]);
    setSelectedRowData({});
  };

  const handleRefresh = () => {
    if (currentPage === 1) getDataTukarFaktur();
    else setCurrentPage(1);
  };

  const selectedFakturList = Object.values(selectedRowData).filter(
    (item) =>
      selectedIds.includes(getId(item)) &&
      (
        getStatus(item) === "BELUM_DITUKAR" ||
        item?.status_verifikasi_tukar === "DITOLAK"
      )
  );

  // ===================================================
  // OPEN TUKAR FAKTUR
  // ===================================================

  const openTukarFaktur = (faktur) => {
    setSelectedFaktur(faktur);
    setSelectedIds([getId(faktur)]);
    setSelectedRowData({ [getId(faktur)]: faktur });
    setBulkFile(null);
    setShowTukarModal(true);
  };

  // ===================================================
  // SELECTION TUKAR FAKTUR
  // ===================================================

  const selectableData = tableData.filter(
    (item) =>
      getStatus(item) === "BELUM_DITUKAR" ||
      item?.status_verifikasi_tukar === "DITOLAK"
  );
  const toggleSelectFaktur = (faktur) => {
    const id = getId(faktur);
    const canSelect =
      getStatus(faktur) === "BELUM_DITUKAR" ||
      faktur?.status_verifikasi_tukar === "DITOLAK";
    if (!id || !canSelect) return;
    if (selectedIds.includes(id)) {
      const nextIds = selectedIds.filter((x) => x !== id);
      setSelectedIds(nextIds);
      setSelectedRowData((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    setSelectedIds((prev) => [...prev, id]);
    setSelectedRowData((prev) => ({ ...prev, [id]: faktur }));
  };

  const toggleSelectAll = () => {
    const selectableIds = selectableData.map((item) => getId(item)).filter(Boolean);
    const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !selectableIds.includes(id)));
      setSelectedRowData((prev) => {
        const next = { ...prev };
        selectableIds.forEach((id) => delete next[id]);
        return next;
      });
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...selectableIds])));
      setSelectedRowData((prev) => ({
        ...prev,
        ...selectableData.reduce((acc, item) => ({ ...acc, [getId(item)]: item }), {}),
      }));
    }
  };

  const openBulkTukarFaktur = () => {
    if (selectedFakturList.length === 0) {
      swal.error("Silakan pilih minimal satu faktur yang dapat ditukar.");
      return;
    }
    setSelectedFaktur(selectedFakturList[0]);
    setBulkFile(null);
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

    setBulkFile(null);
    setShowTukarModal(false);
  };


  // ===================================================
  // OPEN DOCUMENT
  // ===================================================

  // const openDocument = (
  //   faktur
  // ) => {

  //   setSelectedFaktur(
  //     faktur
  //   );

  //   setShowDocumentModal(
  //     true
  //   );
  // };
  const openDocument = (faktur) => {
    const url_files = faktur?.files;

    if (!url_files) {
      swal.error("Dokumen Tukar Faktur tidak tersedia.");
      return;
    }

    window.open(url_files, "_blank", "noopener,noreferrer");
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

  const handleBulkFileChange = (e) => {

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

    setBulkFile(file);
  };


  // ===================================================
  // SUBMIT TUKAR FAKTUR
  // ===================================================

  const handleTukarFaktur = async () => {
    const fakturTerpilih = selectedFakturList.filter(
      (item) =>
        getStatus(item) === "BELUM_DITUKAR" ||
        item?.status_verifikasi_tukar === "DITOLAK"
    );

    if (fakturTerpilih.length === 0) {
      swal.error("Silakan pilih minimal satu faktur yang dapat ditukar.");
      return;
    }

    if (!bulkFile) {
      swal.error("Silakan upload bukti tukar faktur terlebih dahulu.");
      return;
    }

    try {
      setIsSubmitting(true);

      const resultFix = {
        faktur: fakturTerpilih.map((faktur) => ({
          faktur_petugas_id: faktur?.faktur_petugas_id || "",
          piutang_id: faktur?.piutang_id || getId(faktur) || "",
          no_faktur: getNoFaktur(faktur),
        })),
        user_id: loginAccess?.user_id || null,
        nip: loginAccess?.nip || null,
      };

      const formData = new FormData();

      formData.append("payload", JSON.stringify(resultFix));
      formData.append("lampiran", bulkFile, bulkFile.name);

      const res = await storeSchema.actions.insertTukarFaktur(formData);

      if (res?.status !== true) {
        throw new Error(
          res?.message || "Gagal melakukan proses Tukar Faktur."
        );
      }

      await swal.success(
        `${fakturTerpilih.length} faktur berhasil ditukar.`
      );

      setSelectedIds([]);
      setSelectedRowData({});
      closeTukarFaktur();
      await getDataTukarFaktur();
    } catch (error) {
      console.error("ERROR INSERT TUKAR FAKTUR:", error);
      await swal.error(
        error?.message || "Gagal melakukan proses Tukar Faktur."
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


  const renderStatusVerifikasi = (status) => {
    const config = statusVerifikasiConfig[status];
    if (!config) return "-";
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}>
        <Icon />
        {config.label}
      </span>
    );
  };

  // ===================================================
  // ACTION
  // ===================================================

  const openDetail = (faktur) => {
    setSelectedFaktur(faktur);
    setShowDocumentModal(true);
  };

  const renderAction = (faktur) => {
    const sudahDitukar = faktur.status === "SUDAH_DITUKAR";
    const ditolak = faktur.status_verifikasi_tukar === "DITOLAK";
    const checked = selectedIds.includes(faktur.id);

    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <button type="button" onClick={() => openDetail(faktur)} title="Lihat Detail" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100 transition">
          <FaInfoCircle />
        </button>

        {sudahDitukar && (
          <button type="button" onClick={() => openDocument(faktur)} title="Lihat Dokumen" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition whitespace-nowrap">
            <FaFileAlt />
            Dokumen
          </button>
        )}

        {(!sudahDitukar || ditolak) && (
          <>
            <label className={`flex items-center justify-center w-9 h-9 rounded-full border cursor-pointer transition ${checked ? "bg-blue-50 border-primary text-primary" : "bg-white border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-primary"}`} title={checked ? "Batalkan pilihan" : "Pilih faktur"}>
              <input type="checkbox" className="hidden" checked={checked} onChange={() => toggleSelectFaktur(faktur)} />
              {checked ? <FaCheck /> : <span className="w-4 h-4 rounded border border-current" />}
            </label>
            <button type="button" onClick={() => openTukarFaktur(faktur)} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 transition shadow-sm whitespace-nowrap">
              <FaExchangeAlt />
              Tukar Faktur
            </button>
          </>
        )}
      </div>
    );
  };


  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex = totalData > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex = Math.min(currentPage * perPage, totalData);

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
      label: "No. Billing",
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "Customer",
      icon: <FaBuilding />,
    },

    {
      label: "Proses Retur",
      icon: <FaExchangeAlt />,
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
      label: "Status Tukar Faktur",
      icon: <FaFileAlt />,
    },
    {
      label: "Status Verifikasi",
      icon: <FaCheckCircle />,
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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input
              type="text"
              placeholder="Cari no faktur / no billing / customer / proses retur..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={keyword}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSearch}
              title="Cari"
              aria-label="Cari"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90"
            >
              <FaSearch className="text-sm" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilter}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"
            >
              <FaFilter />
              Reset Filter
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"
            >
              <FaSyncAlt />
              Refresh
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
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCabang((selected || []).map((item) => item.value));
                setSelectedIds([]);
                setSelectedRowData({});
              }}
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
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCustomer((selected || []).map((item) => item.value));
                setSelectedIds([]);
                setSelectedRowData({});
              }}
              placeholder="Semua Customer"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Status Tukar Faktur</label>
            <Select
              options={[
                { label: "Semua Status", value: "ALL" },
                { label: "Belum Tukar Faktur", value: "BELUM_DITUKAR" },
                { label: "Sudah Tukar Faktur", value: "SUDAH_DITUKAR" },
              ]}
              value={[
                { label: "Semua Status", value: "ALL" },
                { label: "Belum Tukar Faktur", value: "BELUM_DITUKAR" },
                { label: "Sudah Tukar Faktur", value: "SUDAH_DITUKAR" },
              ].find((item) => item.value === selectedStatusTukar)}
              onChange={(selected) => {
                setCurrentPage(1);
                setSelectedStatusTukar(selected?.value || "ALL");
                setSelectedIds([]);
                setSelectedRowData({});
              }}
              placeholder="Semua Status"
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Status Verifikasi</label>
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
              ].find((item) => item.value === selectedStatusVerifikasi)}
              onChange={(selected) => {
                setCurrentPage(1);
                setSelectedStatusVerifikasi(selected?.value || "ALL");
                setSelectedIds([]);
                setSelectedRowData({});
              }}
              placeholder="Semua Status"
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">Document Date</label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm">
              <FaCalendarAlt className="text-primary text-sm" />
              <input
                type="date"
                value={filterStartDate}
                max={filterEndDate || undefined}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterStartDate(e.target.value);
                  setSelectedIds([]);
                  setSelectedRowData({});
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
              <span className="text-gray-300">-</span>
              <input
                type="date"
                value={filterEndDate}
                min={filterStartDate || undefined}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterEndDate(e.target.value);
                  setSelectedIds([]);
                  setSelectedRowData({});
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
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
                Belum Tukar Faktur
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
                Sudah Tukar Faktur
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
                  loading ? (
                    <tr>
                      <td
                        colSpan={headerTable.length}
                        className="text-center py-16 text-gray-500"
                      >
                        <span className="loading loading-spinner loading-md text-primary" />
                        <div className="mt-2">Memuat data...</div>
                      </td>
                    </tr>
                  ) : tableData.length === 0 ? (

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

                    tableData.map(
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


                          {/* NO BILLING */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="
                                  w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600
                                  flex items-center justify-center
                                "
                              >
                                <FaFileInvoiceDollar />
                              </div>
                              <span className="font-semibold text-indigo-700">
                                {v.no_billing}
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


                          {/* PROSES RETUR */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >
                            <div
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-xl
                                bg-orange-50
                                border
                                border-orange-200
                              "
                            >
                              <FaExchangeAlt className="text-orange-600" />
                              <span className="font-semibold text-orange-700">
                                {v.proses_retur}
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


                          {/* STATUS FAKTUR */}

                          <td className="px-4 py-3">
                            {renderStatus(v.status)}
                          </td>

                          {/* STATUS VERIFIKASI */}

                          <td className="px-4 py-3">
                            {renderStatusVerifikasi(v.status_verifikasi_tukar)}
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
              z-[500]
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
                      {selectedFakturList.map((faktur, index) => (
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
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className="
                                  w-10 h-10 shrink-0 rounded-xl bg-blue-50 text-primary
                                  flex items-center justify-center font-bold text-sm
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
                              <p className="text-xs text-gray-500">Nominal</p>
                              <p className="font-bold text-orange-700">
                                {formatCurrency(faktur.nominal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BUKTI TUKAR FAKTUR - SATU DOKUMEN UNTUK SEMUA BILLING */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Bukti Tukar Faktur
                    </p>

                    <label
                      className="
                        relative flex items-center gap-3 w-full rounded-xl border-2 border-dashed
                        border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-primary
                        transition cursor-pointer p-4
                      "
                    >
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleBulkFileChange}
                      />

                      <div
                        className={`
                          w-11 h-11 shrink-0 rounded-xl flex items-center justify-center
                          ${bulkFile
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-primary"
                          }
                        `}
                      >
                        {bulkFile ? <FaCheck /> : <FaUpload />}
                      </div>

                      <div className="min-w-0 flex-1">
                        {bulkFile ? (
                          <>
                            <p className="break-all text-sm font-semibold text-gray-700">
                              {bulkFile.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {(bulkFile.size / 1024 / 1024).toFixed(2)} MB • Klik untuk mengganti
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-gray-700">
                              Upload Bukti Tukar Faktur
                            </p>
                            <p className="text-xs font-semibold leading-relaxed text-gray-700">
                              Satu dokumen dapat digunakan sebagai bukti untuk seluruh billing yang dipilih.
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              PDF, JPG, JPEG, PNG • Maks. 25 MB
                            </p>
                          </>
                        )}
                      </div>
                    </label>
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
                          Pastikan bukti tukar faktur yang diupload sesuai dengan seluruh billing yang dipilih sebelum melakukan proses Tukar Faktur.
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
                  {bulkFile ? "1 dokumen" : "0 dokumen"} siap diproses untuk {selectedFakturList.length} billing
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
                      !bulkFile
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
      {/* MODAL DETAIL TUKAR FAKTUR */}
      {/* ================================================= */}

      {showDocumentModal && selectedFaktur && (
        <div className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5" onClick={closeDocument}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-primary px-5 sm:px-6 py-4 text-white shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <FaFileAlt />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Detail Tukar Faktur</h3>
                    <p className="text-xs text-blue-100">Detail faktur dan proses verifikasi</p>
                  </div>
                </div>
                <button type="button" onClick={closeDocument} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto">
              <div className={`rounded-xl border p-4 mb-5 ${selectedFaktur.status_verifikasi_tukar === "DITERIMA" ? "bg-green-50 border-green-200" : selectedFaktur.status_verifikasi_tukar === "DITOLAK" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                <div className="flex items-start gap-3">
                  {selectedFaktur.status_verifikasi_tukar === "DITERIMA" ? <FaCheckCircle className="text-green-600 mt-0.5" /> : selectedFaktur.status_verifikasi_tukar === "DITOLAK" ? <FaTimesCircle className="text-red-600 mt-0.5" /> : <FaClock className="text-amber-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${selectedFaktur.status_verifikasi_tukar === "DITERIMA" ? "text-green-800" : selectedFaktur.status_verifikasi_tukar === "DITOLAK" ? "text-red-800" : "text-amber-800"}`}>
                      {selectedFaktur.status_verifikasi_tukar === "DITERIMA" ? "Tukar Faktur Diterima" : selectedFaktur.status_verifikasi_tukar === "DITOLAK" ? "Tukar Faktur Ditolak" : "Menunggu Verifikasi"}
                    </p>
                    {selectedFaktur.tanggal_verifikasi && <p className="text-xs text-gray-600 mt-1">Tanggal Verifikasi: <span className="font-semibold">{selectedFaktur.tanggal_verifikasi}</span></p>}
                    {selectedFaktur.status_verifikasi_tukar === "DITOLAK" && selectedFaktur.status_keterangan && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <p className="text-xs font-semibold text-red-700 mb-1">Keterangan Penolakan</p>
                        <p className="text-sm text-red-700 leading-relaxed">{selectedFaktur.status_keterangan}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center"><FaFileInvoiceDollar /></div>
                  <div><p className="text-xs text-blue-600">Status Tukar Faktur</p><div className="mt-1">{renderStatus(selectedFaktur.status)}</div></div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["No. Faktur", selectedFaktur.no_faktur],
                  ["No. Billing", selectedFaktur.no_billing],
                  ["Customer", selectedFaktur.nama_customer],
                  ["Proses Retur", selectedFaktur.proses_retur],
                  ["Jatuh Tempo", formatDate(selectedFaktur.jatuh_tempo)],
                  ["Nominal", formatCurrency(selectedFaktur.nominal)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 pb-3 border-b">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-700 text-right break-all">{value || "-"}</span>
                  </div>
                ))}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-gray-500">Dokumen</span>
                  <span className="text-sm font-semibold text-gray-700 text-right break-all max-w-[60%]">{selectedFaktur.nama_dokumen_tukar || "Dokumen tersedia"}</span>
                </div>
              </div>

              {selectedFaktur.files && (
                <a href={typeof selectedFaktur.files === "string" ? selectedFaktur.files : undefined} target="_blank" rel="noopener noreferrer" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition">
                  <FaEye />
                  Buka Dokumen Tukar Faktur
                </a>
              )}
            </div>

            <div className="border-t bg-gray-50 px-5 py-4 flex justify-end">
              <button type="button" onClick={closeDocument} className="px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100 transition">Tutup</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


export default TableTukarFaktur;