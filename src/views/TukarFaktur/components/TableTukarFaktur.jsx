import React, {
  useEffect,
  useState,
} from "react";

import {
  FaHashtag,
  FaFileInvoiceDollar,
  FaBuilding,
  FaMapMarkerAlt,
  FaMap,
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
  FaUndoAlt,
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

const getPetugasId = (item) => firstValue(item, "faktur_petugas_id", "petugas_id");
const getId = (item) => firstValue(item, "piutang_id", "faktur_id", "id");
const getNoFaktur = (item) => firstValue(item, "no_faktur", "nomor_faktur", "noFaktur") || "-";
const getNoBilling = (item) => firstValue(item, "no_billing", "billing_no", "billing_number") || "-";
const getProsesRetur = (item) => firstValue(item, "proses_retur", "no_retur", "retur_no") || "-";
const getCustomer = (item) => firstValue(item, "nama_customer", "customer_name", "customer") || "-";
const getAlamat = (item) => firstValue(item, "alamat", "customer_address") || "-";
const getJatuhTempo = (item) => firstValue(item, "jatuh_tempo", "due_date") || null;
const getDpp = (item) => Number(firstValue(item, "dpp", "DPP") || 0);
const getPpn = (item) => Number(firstValue(item, "ppn", "PPN") || 0);
const getPph = (item) => Number(firstValue(item, "pph", "PPH") || 0);
const getTotalInvoice = (item) => getDpp(item) + getPpn(item);
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
  dpp: getDpp(item),
  ppn: getPpn(item),
  pph: getPph(item),
  total_invoice: getTotalInvoice(item),
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
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [bulkFile, setBulkFile] = useState(null);
  const [showFakturKembaliModal, setShowFakturKembaliModal] = useState(false);
  const [alasanFakturKembali, setAlasanFakturKembali] = useState("");
  const [loadingFakturKembali, setLoadingFakturKembali] = useState(false);
  const [fakturKembaliList, setFakturKembaliList] = useState([]);
  const [historyPenugasanData, setHistoryPenugasanData] = useState([]);
  const [loadingHistoryPenugasan, setLoadingHistoryPenugasan] = useState(false);

  // Koordinat perangkat saat proses Tukar Faktur dilakukan.
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Alamat hasil reverse geocoding berdasarkan titik koordinat peta.
  const [alamatTukar, setAlamatTukar] = useState("");
  const [alamatMap, setAlamatMap] = useState("");
  const [loadingAlamatTukar, setLoadingAlamatTukar] = useState(false);
  const [loadingAlamatMap, setLoadingAlamatMap] = useState(false);

  const lookupAlamat = async (latitude, longitude, signal) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1&accept-language=id`,
      { signal, headers: { Accept: "application/json" } }
    );
    if (!response.ok) throw new Error("Gagal mencari alamat lokasi");
    const result = await response.json();
    return result?.display_name || "Alamat lengkap tidak ditemukan untuk titik ini.";
  };

  useEffect(() => {
    if (!showTukarModal || !userCoordinates) {
      setAlamatTukar("");
      setLoadingAlamatTukar(false);
      return;
    }
    const controller = new AbortController();
    setLoadingAlamatTukar(true);
    setAlamatTukar("");
    lookupAlamat(userCoordinates.latitude, userCoordinates.longitude, controller.signal)
      .then(setAlamatTukar)
      .catch((error) => {
        if (error.name !== "AbortError") setAlamatTukar("");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingAlamatTukar(false);
      });
    return () => controller.abort();
  }, [showTukarModal, userCoordinates?.latitude, userCoordinates?.longitude]);

  useEffect(() => {
    const latitude = selectedFaktur?.latitude;
    const longitude = selectedFaktur?.longitude;
    if (!showMapModal || latitude == null || latitude === "" || longitude == null || longitude === "" ||
      !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
      setAlamatMap("");
      setLoadingAlamatMap(false);
      return;
    }
    const controller = new AbortController();
    setLoadingAlamatMap(true);
    setAlamatMap("");
    lookupAlamat(latitude, longitude, controller.signal)
      .then(setAlamatMap)
      .catch((error) => {
        if (error.name !== "AbortError") setAlamatMap("");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingAlamatMap(false);
      });
    return () => controller.abort();
  }, [showMapModal, selectedFaktur?.latitude, selectedFaktur?.longitude]);

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

  // Faktur Kembali hanya dapat dilakukan untuk faktur yang belum ditukar.
  const selectedFakturKembaliList = Object.values(selectedRowData).filter(
    (item) =>
      selectedIds.includes(getId(item)) &&
      getStatus(item) === "BELUM_DITUKAR"
  );

  // ===================================================
  // LOKASI USER / KOORDINAT
  // ===================================================

  const getUserCoordinates = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser ini tidak mendukung akses lokasi.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoordinates({
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
          accuracy: position.coords.accuracy
            ? Math.round(position.coords.accuracy)
            : null,
          captured_at: new Date().toISOString(),
        });
        setLocationLoading(false);
      },
      (error) => {
        const messageByCode = {
          1: "Izin lokasi ditolak. Izinkan akses lokasi pada browser lalu coba lagi.",
          2: "Lokasi tidak dapat ditentukan. Pastikan GPS/lokasi perangkat aktif.",
          3: "Permintaan lokasi timeout. Silakan coba lagi.",
        };
        setLocationError(
          messageByCode[error.code] ||
          "Gagal mengambil lokasi perangkat. Silakan coba lagi."
        );
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ===================================================
  // OPEN TUKAR FAKTUR
  // ===================================================

  const openTukarFaktur = (faktur) => {
    setSelectedFaktur(faktur);
    setSelectedIds([getId(faktur)]);
    setSelectedRowData({ [getId(faktur)]: faktur });
    setBulkFile(null);
    setUserCoordinates(null);
    setLocationError("");
    setShowTukarModal(true);

    // Otomatis ambil koordinat saat modal Tukar Faktur dibuka.
    getUserCoordinates();
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
    setUserCoordinates(null);
    setLocationError("");
    setShowTukarModal(true);

    // Otomatis ambil koordinat saat modal Tukar Faktur massal dibuka.
    getUserCoordinates();
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
    setUserCoordinates(null);
    setLocationError("");
  };


  // ===================================================
  // FAKTUR KEMBALI
  // ===================================================

  const openFakturKembali = (faktur = null) => {
    const list = faktur
      ? (getStatus(faktur) === "BELUM_DITUKAR" ? [faktur] : [])
      : selectedFakturKembaliList;

    if (!list.length) {
      swal.error("Faktur Kembali hanya dapat dilakukan untuk faktur yang belum ditukar.");
      return;
    }

    setFakturKembaliList(list);
    setSelectedFaktur(list[0]);
    setAlasanFakturKembali("");
    setShowFakturKembaliModal(true);
  };

  const closeFakturKembali = () => {
    if (loadingFakturKembali) return;
    setShowFakturKembaliModal(false);
    setAlasanFakturKembali("");
    setFakturKembaliList([]);
  };

  const handleInsertFakturKembali = async () => {
    const fakturTerpilih = fakturKembaliList;

    if (!fakturTerpilih.length) {
      await swal.error("Silakan pilih faktur terlebih dahulu.");
      return;
    }

    const fakturBelumDitukar = fakturTerpilih.filter(
      (item) => getStatus(item) === "BELUM_DITUKAR"
    );

    if (fakturBelumDitukar.length !== fakturTerpilih.length) {
      await swal.error("Faktur Kembali hanya dapat dilakukan untuk faktur yang belum ditukar.");
      return;
    }

    if (!alasanFakturKembali.trim()) {
      await swal.error("Alasan Faktur Kembali wajib diisi.");
      return;
    }

    try {
      setLoadingFakturKembali(true);
      const payload = {
        faktur_petugas_id: fakturTerpilih.map((item) => getPetugasId(item)),
        alasan: alasanFakturKembali.trim(),
        kegiatan: 'TUKAR_FAKTUR',
        user_id: loginAccess?.user_id || null,
        nip: loginAccess?.nip || null,
      };

      const res = await storeSchema.actions.insertFakturKembali(payload);
      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal menyimpan Faktur Kembali.");
      }

      await swal.success(res?.message || "Faktur Kembali berhasil disimpan.");
      setShowFakturKembaliModal(false);
      setAlasanFakturKembali("");
      setFakturKembaliList([]);
      setSelectedIds([]);
      setSelectedRowData({});
      await getDataTukarFaktur();
    } catch (error) {
      console.error("ERROR INSERT FAKTUR KEMBALI:", error);
      await swal.error(error?.message || "Gagal menyimpan Faktur Kembali.");
    } finally {
      setLoadingFakturKembali(false);
    }
  };

  const getHistoryPenugasan = async (faktur) => {
    const piutangId = faktur?.piutang_id || getId(faktur);
    if (!piutangId) {
      setHistoryPenugasanData([]);
      return;
    }

    try {
      setLoadingHistoryPenugasan(true);
      setHistoryPenugasanData([]);
      const res = await storeSchema.actions.historyPenugasan({
        piutang_id: piutangId,
        kegiatan: firstValue(faktur, "kegiatan") || "TUKAR_FAKTUR",
      });

      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal mengambil history penugasan.");
      }

      const data = res?.data;
      setHistoryPenugasanData(
        Array.isArray(data) ? data :
          Array.isArray(data?.list_data) ? data.list_data :
            Array.isArray(data?.history) ? data.history :
              data ? [data] : []
      );
    } catch (error) {
      console.error("ERROR HISTORY PENUGASAN:", error);
      setHistoryPenugasanData([]);
    } finally {
      setLoadingHistoryPenugasan(false);
    }
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
  // OPEN / CLOSE MAP LOKASI
  // ===================================================

  const openMap = (faktur) => {
    setSelectedFaktur(faktur);
    setShowMapModal(true);
  };

  const closeMap = () => {
    setShowMapModal(false);
    setSelectedFaktur(null);
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

    if (!userCoordinates?.latitude || !userCoordinates?.longitude) {
      swal.error("Silakan ambil titik koordinat lokasi terlebih dahulu sebelum melakukan Tukar Faktur.");
      return;
    }

    if (loadingAlamatTukar) {
      swal.error("Tunggu sampai alamat titik lokasi selesai dicari.");
      return;
    }

    if (!alamatTukar) {
      swal.error("Alamat titik lokasi belum berhasil ditemukan. Periksa koneksi internet lalu coba lagi.");
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
        latitude: userCoordinates?.latitude ?? null,
        longitude: userCoordinates?.longitude ?? null,
        // Alamat hasil reverse geocoding ikut dikirim ke API insertTukarFaktur.
        alamat: alamatTukar || null,
        koordinat: userCoordinates
          ? {
            latitude: userCoordinates.latitude,
            longitude: userCoordinates.longitude,
            accuracy: userCoordinates.accuracy,
            captured_at: userCoordinates.captured_at,
            alamat: alamatTukar || null,
          }
          : null,
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
    setHistoryPenugasanData([]);
    setShowDocumentModal(true);
    getHistoryPenugasan(faktur);
  };

  const renderAction = (faktur) => {
    const sudahDitukar = faktur.status === "SUDAH_DITUKAR";
    const ditolak = faktur.status_verifikasi_tukar === "DITOLAK";
    const checked = selectedIds.includes(faktur.id);

    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        {(!sudahDitukar || ditolak) && (
          <>
            <label
              className={`flex items-center justify-center w-9 h-9 rounded-full border cursor-pointer transition ${checked
                  ? "bg-blue-50 border-primary text-primary"
                  : "bg-white border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-primary"
                }`}
              title={checked ? "Batalkan pilihan" : "Pilih faktur"}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={() => toggleSelectFaktur(faktur)}
              />
              {checked ? <FaCheck /> : <span className="w-4 h-4 rounded border border-current" />}
            </label>

            <button
              type="button"
              onClick={() => openTukarFaktur(faktur)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 transition shadow-sm whitespace-nowrap"
            >
              <FaExchangeAlt />
              Tukar Faktur
            </button>
          </>
        )}

        {!sudahDitukar && (
          <button
            type="button"
            onClick={() => openFakturKembali(faktur)}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition whitespace-nowrap"
            title="Faktur Kembali"
          >
            <FaUndoAlt />
            Faktur Kembali
          </button>
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
      label: "Detail",
      icon: <FaHashtag />,
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

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => openFakturKembali()}
            disabled={selectedFakturKembaliList.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-orange-200 bg-white text-orange-700 text-sm font-semibold shadow-sm hover:bg-orange-50 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <FaUndoAlt />
            Faktur Kembali {selectedFakturKembaliList.length > 0 ? `${selectedFakturKembaliList.length} Faktur` : ""}
          </button>
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
                          <td className="px-4 py-3">
                            {renderAction(v)}
                          </td>

                          {/* DETAIL: LIHAT DETAIL, DOKUMEN, DAN PETA */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => openDetail(v)}
                                title="Lihat Detail"
                                aria-label="Lihat Detail"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                              >
                                <FaEye />
                              </button>

                              {v.status === "SUDAH_DITUKAR" && (
                                <button
                                  type="button"
                                  onClick={() => openDocument(v)}
                                  title="Dokumen"
                                  aria-label="Dokumen"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700 transition hover:bg-green-100"
                                >
                                  <FaFileAlt />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => openMap(v)}
                                title="Lihat Titik Lokasi"
                                aria-label="Lihat Titik Lokasi"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              >
                                <FaMap />
                              </button>
                            </div>
                          </td>

                          {/* NO BILLING */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
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


                          {/* DPP */}
                          <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-gray-700">
                            {formatCurrency(v.dpp)}
                          </td>

                          {/* PPN */}
                          <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-blue-700">
                            {formatCurrency(v.ppn)}
                          </td>

                          {/* PPH */}
                          <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-purple-700">
                            {formatCurrency(v.pph)}
                          </td>

                          {/* TOTAL INVOICE */}
                          <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-primary">
                            {formatCurrency(v.total_invoice)}
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
                            (sum, item) => sum + getTotalInvoice(item),
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

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-right shrink-0 sm:min-w-[260px]">
                              <div>
                                <p className="text-xs text-gray-500">DPP</p>
                                <p className="text-sm font-semibold text-gray-700">{formatCurrency(faktur.dpp)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">PPN</p>
                                <p className="text-sm font-semibold text-blue-700">{formatCurrency(faktur.ppn)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">PPh</p>
                                <p className="text-sm font-semibold text-purple-700">{formatCurrency(faktur.pph)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Total Invoice</p>
                                <p className="text-sm font-bold text-primary">{formatCurrency(faktur.total_invoice)}</p>
                              </div>
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

                  {/* LOKASI USER / TITIK KOORDINAT */}
                  <div className="rounded-xl border border-emerald-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <FaMapMarkerAlt />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Titik Lokasi Tukar Faktur
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-gray-500">
                            Lokasi perangkat diambil otomatis saat modal dibuka. Pastikan izin akses lokasi pada browser sudah diizinkan.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={getUserCoordinates}
                        disabled={locationLoading || isSubmitting}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {locationLoading ? (
                          <>
                            <span className="loading loading-spinner loading-xs" />
                            Mengambil lokasi...
                          </>
                        ) : (
                          <>
                            <FaMapMarkerAlt />
                            {userCoordinates ? "Perbarui Lokasi" : "Coba Ambil Lagi"}
                          </>
                        )}
                      </button>
                    </div>

                    {locationError && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                        {locationError}
                      </div>
                    )}

                    {userCoordinates ? (
                      <>
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div className="rounded-lg bg-emerald-50 p-3">
                            <p className="text-[11px] font-medium text-emerald-700">Latitude</p>
                            <p className="mt-1 break-all text-sm font-bold text-emerald-900">
                              {userCoordinates.latitude}
                            </p>
                          </div>
                          <div className="rounded-lg bg-emerald-50 p-3">
                            <p className="text-[11px] font-medium text-emerald-700">Longitude</p>
                            <p className="mt-1 break-all text-sm font-bold text-emerald-900">
                              {userCoordinates.longitude}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                          <iframe
                            title="Peta lokasi Tukar Faktur"
                            width="100%"
                            height="260"
                            loading="lazy"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${userCoordinates.longitude - 0.005}%2C${userCoordinates.latitude - 0.005}%2C${userCoordinates.longitude + 0.005}%2C${userCoordinates.latitude + 0.005}&layer=mapnik&marker=${userCoordinates.latitude}%2C${userCoordinates.longitude}`}
                            className="block w-full"
                          />
                        </div>
                        <div className="mt-3 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                          <FaMapMarkerAlt className="mt-0.5 shrink-0 text-blue-600" />
                          <div>
                            <p className="text-xs font-semibold text-blue-800">Alamat Titik Lokasi</p>
                            <p className="mt-1 text-sm leading-relaxed text-gray-700">
                              {loadingAlamatTukar ? "Sedang mencari alamat..." : alamatTukar || "Alamat belum tersedia"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[11px] text-gray-500">
                            {userCoordinates.accuracy
                              ? `Akurasi perkiraan ±${userCoordinates.accuracy} meter`
                              : "Akurasi lokasi tidak tersedia"}
                          </p>
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${userCoordinates.latitude}&mlon=${userCoordinates.longitude}#map=17/${userCoordinates.latitude}/${userCoordinates.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-700 hover:underline"
                          >
                            Buka peta di tab baru
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 flex min-h-[100px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
                        <div>
                          <FaMapMarkerAlt className="mx-auto mb-2 text-2xl text-gray-300" />
                          <p className="text-xs text-gray-500">
                            Peta akan tampil setelah koordinat berhasil diambil.
                          </p>
                        </div>
                      </div>
                    )}
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
                  <span>
                    {bulkFile ? "1 dokumen" : "0 dokumen"} siap diproses untuk {selectedFakturList.length} billing
                    {" • "}
                    {userCoordinates ? "Lokasi tercatat" : "Lokasi belum diambil"}
                  </span>
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
                      !bulkFile ||
                      !userCoordinates?.latitude ||
                      !userCoordinates?.longitude
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
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

            <div className="grid min-h-0 grid-cols-1 gap-5 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
              <div className="min-w-0">
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
                    ["DPP", formatCurrency(selectedFaktur.dpp)],
                    ["PPN", formatCurrency(selectedFaktur.ppn)],
                    ["PPh", formatCurrency(selectedFaktur.pph)],
                    ["Total Invoice", formatCurrency(selectedFaktur.total_invoice)],
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

              {/* HISTORY PENUGASAN */}
              <aside className="min-w-0 rounded-2xl border border-gray-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <FaClipboardList />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">History Penugasan</h4>
                    <p className="mt-0.5 text-xs text-gray-500">Riwayat penugasan untuk faktur ini</p>
                  </div>
                </div>

                {loadingHistoryPenugasan ? (
                  <div className="flex min-h-[180px] flex-col items-center justify-center text-sm text-gray-500">
                    <span className="loading loading-spinner loading-md text-primary" />
                    <span className="mt-3">Memuat history penugasan...</span>
                  </div>
                ) : historyPenugasanData.length === 0 ? (
                  <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 text-center">
                    <FaInfoCircle className="mb-2 text-2xl text-gray-300" />
                    <p className="text-sm font-semibold text-gray-600">Belum Ada History</p>
                  </div>
                ) : (
                  <ul className="steps steps-vertical w-full items-start">
                    {historyPenugasanData.map((history, index) => {
                      const isActive = String(history?.is_active || "").toUpperCase() === "Y";
                      const namaPetugas = firstValue(
                        history,
                        "nama",
                        "nama_petugas",
                        "petugas",
                        "nama_user",
                        "user_name",
                        "nip"
                      );
                      const tanggalPenugasan = firstValue(
                        history,
                        "assigned_at",
                        "tanggal",
                        "created_at",
                        "tanggal_penugasan",
                        "updated_at"
                      );

                      return (
                        <li
                          key={history?.id || history?.penugasan_id || `${namaPetugas || "history"}-${index}`}
                          className={`step ${isActive ? "step-primary" : ""} !grid !w-full !grid-cols-[2rem_minmax(0,1fr)] !items-start !gap-3 !text-left`}
                          data-content={isActive ? "✓" : ''}
                        >
                          <div className="mb-5 min-w-0 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                  Petugas Tukar Faktur
                                </p>
                                <p className="mt-1 break-words text-sm font-bold text-gray-800">
                                  {namaPetugas || "-"}
                                </p>
                              </div>
                              <span className={`badge badge-sm ${isActive ? "badge-success" : "badge-ghost"}`}>
                                {isActive ? "Aktif" : "Tidak Aktif"}
                              </span>
                            </div>
                            <div className="mt-3 border-t border-gray-100 pt-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Tanggal Penugasan
                              </p>
                              <p className="mt-1 break-words text-sm text-gray-700">
                                {tanggalPenugasan || "-"}
                              </p>
                            </div>
                            <div className="mt-3 border-t border-gray-100 pt-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Alasan Pengembalian
                              </p>
                              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                                {firstValue(history, "alasan") || "-"}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </aside>
            </div>

            <div className="border-t bg-gray-50 px-5 py-4 flex justify-end">
              <button type="button" onClick={closeDocument} className="px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100 transition">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MODAL FAKTUR KEMBALI */}
      {/* ================================================= */}

      {/* MODAL FAKTUR KEMBALI */}
      {showFakturKembaliModal && (
        <div
          className="fixed inset-0 z-[520] flex items-center justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:p-5"
          onClick={closeFakturKembali}
        >
          <div
            className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER - TETAP TERLIHAT */}
            <div className="flex shrink-0 items-center justify-between gap-3 bg-orange-600 px-5 py-4 text-white sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <FaUndoAlt />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold">Faktur Kembali</h3>
                  <p className="mt-0.5 text-xs text-orange-100">
                    Masukkan alasan pengembalian faktur
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeFakturKembali}
                disabled={loadingFakturKembali}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10 disabled:opacity-50"
                title="Tutup"
              >
                <FaTimes />
              </button>
            </div>

            {/* CONTENT - SCROLL JIKA MELEBIHI TINGGI MODAL */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
              {/* DAFTAR FAKTUR */}
              <div className="min-w-0 rounded-xl border border-orange-100 bg-orange-50 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-orange-900">
                      Daftar Faktur yang Dipilih
                    </p>
                    <p className="mt-1 text-xs text-orange-700">
                      {fakturKembaliList.length} faktur akan diproses untuk Faktur Kembali.
                    </p>
                  </div>

                  <span className="badge badge-warning badge-lg shrink-0">
                    {fakturKembaliList.length} Faktur
                  </span>
                </div>

                {/* LIST FAKTUR - SCROLL TERPISAH */}
                <div className="max-h-48 space-y-2 overflow-x-hidden overflow-y-auto overscroll-contain pr-1 sm:max-h-56">
                  {fakturKembaliList.map((faktur, index) => (
                    <div
                      key={getId(faktur) ?? `${getNoBilling(faktur)}-${index}`}
                      className="min-w-0 rounded-lg border border-orange-100 bg-white p-3"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-gray-500">
                            No. Billing
                          </p>
                          <p className="break-all text-sm font-bold text-orange-900">
                            {getNoBilling(faktur)}
                          </p>

                          <p className="mt-2 text-[11px] font-medium text-gray-500">
                            Customer
                          </p>
                          <p className="break-words text-sm font-semibold text-gray-800">
                            {getCustomer(faktur)}
                          </p>

                          <p className="mt-1 break-words text-xs text-gray-500">
                            No. Faktur: {getNoFaktur(faktur)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {fakturKembaliList.length > 1 && (
                  <p className="mt-3 text-xs text-orange-700">
                    Satu alasan akan diterapkan untuk seluruh{" "}
                    {fakturKembaliList.length} faktur yang dipilih.
                  </p>
                )}
              </div>

              {/* ALASAN FAKTUR KEMBALI */}
              <div>
                <label
                  htmlFor="alasan-faktur-kembali"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Alasan Faktur Kembali <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="alasan-faktur-kembali"
                  rows={4}
                  value={alasanFakturKembali}
                  onChange={(e) => setAlasanFakturKembali(e.target.value)}
                  placeholder="Tuliskan alasan faktur dikembalikan..."
                  disabled={loadingFakturKembali}
                  className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* FOOTER - TETAP TERLIHAT */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeFakturKembali}
                disabled={loadingFakturKembali}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleInsertFakturKembali}
                disabled={loadingFakturKembali || !alasanFakturKembali.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loadingFakturKembali ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaUndoAlt />
                    Submit Faktur Kembali
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MODAL PETA LOKASI TUKAR FAKTUR */}
      {/* ================================================= */}

      {showMapModal && selectedFaktur && (
        <div
          className="fixed inset-0 z-[510] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-5"
          onClick={closeMap}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 bg-primary px-5 py-4 text-white sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <FaMap />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold">Lokasi Tukar Faktur</h3>
                    <p className="mt-1 break-all text-xs text-blue-100">
                      No. Billing: {selectedFaktur.no_billing || getNoBilling(selectedFaktur)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeMap}
                  title="Tutup"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto p-4 sm:p-6">
              {selectedFaktur.latitude !== null &&
                selectedFaktur.latitude !== undefined &&
                selectedFaktur.latitude !== "" &&
                selectedFaktur.longitude !== null &&
                selectedFaktur.longitude !== undefined &&
                selectedFaktur.longitude !== "" &&
                Number.isFinite(Number(selectedFaktur.latitude)) &&
                Number.isFinite(Number(selectedFaktur.longitude)) ? (
                <>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <iframe
                      title={`Peta lokasi billing ${selectedFaktur.no_billing || ""}`}
                      width="100%"
                      height="360"
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(selectedFaktur.longitude) - 0.005}%2C${Number(selectedFaktur.latitude) - 0.005}%2C${Number(selectedFaktur.longitude) + 0.005}%2C${Number(selectedFaktur.latitude) + 0.005}&layer=mapnik&marker=${Number(selectedFaktur.latitude)}%2C${Number(selectedFaktur.longitude)}`}
                      className="block w-full"
                    />
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <FaMapMarkerAlt className="mt-0.5 shrink-0 text-blue-600" />
                    <div>
                      <p className="text-xs font-semibold text-blue-800">Alamat Titik Lokasi</p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-700">
                        {loadingAlamatMap ? "Sedang mencari alamat..." : alamatMap || "Alamat belum tersedia"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-medium text-emerald-700">Latitude</p>
                      <p className="mt-1 break-all text-sm font-bold text-emerald-900">
                        {selectedFaktur.latitude}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-medium text-emerald-700">Longitude</p>
                      <p className="mt-1 break-all text-sm font-bold text-emerald-900">
                        {selectedFaktur.longitude}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Accuracy</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {selectedFaktur.accuracy !== null &&
                          selectedFaktur.accuracy !== undefined &&
                          selectedFaktur.accuracy !== ""
                          ? `±${selectedFaktur.accuracy} meter`
                          : "Tidak tersedia"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Waktu Pengambilan</p>
                      <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                        {selectedFaktur.captured_at
                          ? new Date(selectedFaktur.captured_at).toLocaleString("id-ID")
                          : "Tidak tersedia"}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://www.openstreetmap.org/?mlat=${Number(selectedFaktur.latitude)}&mlon=${Number(selectedFaktur.longitude)}#map=17/${Number(selectedFaktur.latitude)}/${Number(selectedFaktur.longitude)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <FaMap />
                    Buka Peta di Tab Baru
                  </a>
                </>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                  <FaMapMarkerAlt className="mb-3 text-4xl text-gray-300" />
                  <p className="font-semibold text-gray-700">Titik lokasi belum tersedia</p>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-gray-500">
                    Data latitude dan longitude belum tersimpan pada data billing ini.
                  </p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 justify-end border-t bg-gray-50 px-5 py-4">
              <button
                type="button"
                onClick={closeMap}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


export default TableTukarFaktur;