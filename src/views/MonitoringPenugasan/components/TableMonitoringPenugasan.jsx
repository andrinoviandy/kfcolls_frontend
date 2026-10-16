import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaHashtag,
  FaFileInvoiceDollar,
  FaBuilding,
  FaStore,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaUndo,
  FaUser,
  FaEllipsisV,
  FaSearch,
  FaFilter,
  FaEye,
  FaExclamationTriangle,
  FaClipboardList,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import { swal } from "global/helper/swal";
import storeSchema from "global/store";

// =====================================================
// HELPERS
// =====================================================

const firstValue = (item, ...keys) => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
};

const formatDate = (date) => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";
  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const normalizeStatus = (value) =>
  String(value ?? "").trim().toUpperCase().replace(/[ -]/g, "_");

const statusLabel = (value, type = "default") => {
  const status = normalizeStatus(value);
  if (!status) return "Belum ada data";

  const maps = {
    tukar: {
      SUDAH_DITUKAR: "Sudah Tukar Faktur",
      SUDAH_DITUKAR_FAKTUR: "Sudah Tukar Faktur",
      DITUKAR: "Sudah Tukar Faktur",
      SELESAI: "Sudah Tukar Faktur",
      BELUM_DITUKAR: "Belum Tukar Faktur",
      BELUM_TUKAR: "Belum Tukar Faktur",
      MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
      MENUNGGU: "Menunggu Verifikasi",
      DITOLAK: "Ditolak",
      DITERIMA: "Diterima",
      SUDAH_DIVERIFIKASI: "Diterima",
    },
    bayar: {
      SUDAH_DIBAYAR: "Sudah Dibayar",
      LUNAS: "Lunas",
      PAID: "Sudah Dibayar",
      BELUM_DIBAYAR: "Belum Dibayar",
      BELUM_BAYAR: "Belum Dibayar",
      MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
      PARTIAL: "Dibayar Sebagian",
      PARTIAL_PAYMENT: "Dibayar Sebagian",
      DITOLAK: "Ditolak",
      MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
      DITERIMA: "Diterima",
    },
    default: {
      DIKIRIM: "Dikirim",
      DIKEMBALIKAN: "Dikembalikan",
    },
  };

  return maps[type]?.[status] || status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const statusClass = (value, type = "default") => {
  const status = normalizeStatus(value);
  if (["SUDAH_DITUKAR", "SUDAH_DITUKAR_FAKTUR", "DITUKAR", "SELESAI", "SUDAH_DIBAYAR", "SUDAH_LUNAS", "LUNAS", "PAID", "DITERIMA", "SUDAH_DIVERIFIKASI", "DIKIRIM"].includes(status)) {
    return "bg-green-100 text-green-700";
  }
  if (["DITOLAK", "GAGAL", "BATAL"].includes(status)) return "bg-red-100 text-red-700";
  if (["MENUNGGU_VERIFIKASI", "MENUNGGU", "MENUNGGU_PEMBAYARAN", "BELUM_DITUKAR", "BELUM_TUKAR", "BELUM_DIBAYAR", "BELUM_BAYAR", "BELUM_LUNAS", "DIKEMBALIKAN"].includes(status)) {
    return "bg-amber-100 text-amber-700";
  }
  if (!status) return "bg-gray-100 text-gray-500";
  return type === "bayar" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700";
};

const StatusBadge = ({ value, type }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusClass(value, type)}`}>
    {statusLabel(value, type)}
  </span>
);

// Checkbox multi-select components following Attachment 4
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
    fontSize: "0.875rem",
    ":hover": { borderColor: "#2563eb" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 36 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};

const getSelectedFilterOptions = (options, selectedValues) =>
  options.filter((option) =>
    selectedValues.some((value) => String(value) === String(option.value))
  );

const normalizeRow = (item, index, currentPage, perPage) => ({
  ...item,
  _rowNo: (currentPage - 1) * perPage + index + 1,
  _id: firstValue(item, "id", "faktur_id", "id_faktur", "nomor_tagihan", "no_faktur") ?? index,
  _nomorTagihan: firstValue(item, "nomor_tagihan", "no_faktur", "nomor_faktur", "billing_number", "no_tagihan") ?? "-",
  _customerCode: firstValue(item, "kode_customer", "customer", "customer_id", "kd_pelanggan", "kode_pelanggan"),
  _customerName: firstValue(item, "nama_customer", "name_customer", "customer_name", "pelanggan", "nama_pelanggan", "name") ?? "-",
  _cabang: firstValue(item, "sales_office_name", "nama_cabang", "cabang", "sales_office", "ur_cabang") ?? "-",
  _dpp: Number(firstValue(item, "dpp", "nilai_dpp", "nominal_dpp") ?? 0),
  _ppn: Number(firstValue(item, "ppn", "nilai_ppn", "nominal_ppn") ?? 0),
  _pph: Number(firstValue(item, "pph", "nilai_pph", "nominal_pph") ?? 0),
  _collections: Number(firstValue(item, "collections", "total_collections", "total_dibayar", "total_pembayaran", "nominal_terbayar") ?? 0),
  _saldo: firstValue(item, "sisa_saldo", "saldo_piutang", "sisa_tagihan", "outstanding", "total_piutang", "amount") ?? 0,
  _jatuhTempo: firstValue(item, "tanggal_jatuh_tempo", "jatuh_tempo", "jatuh_tempo_date", "due_date", "tanggal_jatuh_tempo_piutang"),
  _periode: firstValue(item, "periode", "tanggal_faktur", "invoice_date", "document_date", "posting_date"),
  _statusPembayaran: firstValue(item, "status_pembayaran_label", "status_lunas_label", "status_pembayaran", "status_lunas", "status_bayar", "status_verifikasi_pembayaran", "status_bayar_faktur"),
  _statusPenugasan: firstValue(item, "status_penugasan", "status_assignment"),
  _tanggalPenugasan: firstValue(item, "tanggal_penugasan", "created_at", "tanggal_assign"),
  _umurFaktur: firstValue(item, "umur_faktur", "umur_piutang", "aging", "umur"),
  _kolektor: firstValue(item, "nama_kolektor", "kolektor", "petugas_penagihan", "petugas", "nama_petugas", "collector_name") ?? "-",
  _tanggalPenugasanTukar: firstValue(item, "tanggal_penugasan_tukar_faktur", "created_at_penugasan_tukar", "tanggal_assign_tukar_faktur"),
  _petugasTukar: firstValue(item, "petugas_tukar_faktur", "nama_petugas_tukar_faktur", "petugas_tukar", "nama_petugas_tukar") ?? "-",
  _statusVerifikasiTukar: firstValue(item, "status_verifikasi_tukar", "status_verifikasi_tukar_faktur", "kd_status_verifikasi_tukar"),
  _tanggalPenugasanPenagihan: firstValue(item, "tanggal_penugasan_penagihan", "tanggal_penugasan", "created_at_penagihan", "created_at", "tanggal_assign"),
  _petugasPenagihan: firstValue(item, "nama_kolektor", "petugas_penagihan", "nama_petugas_penagihan", "petugas", "nama_petugas", "collector_name") ?? "-",
  _statusTukar: firstValue(item, "status_tukar_faktur", "status_tukar", "status_tukar_faktur_label", "status_verifikasi_tukar", "status_verifikasi_tukar_faktur"),
  _tanggalVerifikasiTukar: firstValue(item, "tanggal_verifikasi_tukar_faktur", "tgl_verifikasi_tukar_faktur", "tanggal_verifikasi_tukar", "verified_tukar_at", "tanggal_tukar_faktur"),
  _statusBayar: firstValue(item, "status_pembayaran_label", "status_pembayaran", "status_bayar", "status_verifikasi_pembayaran", "status_bayar_faktur"),
  _tanggalVerifikasiBayar: firstValue(item, "tanggal_verifikasi_pembayaran", "tgl_verifikasi_pembayaran", "tanggal_verifikasi_bayar", "verified_payment_at", "tanggal_pembayaran"),
});

const TableMonitoringPenugasan = ({ dimensionScreenW, check, loginAccess, reloadData, setReloadData }) => {
  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    total: 0,
    belumTukar: 0,
    sudahTukar: 0,
    belumPenagihan: 0,
    sudahPenagihan: 0,
  });
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCabang, setFilterCabang] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [selectedStatusPenugasan, setSelectedStatusPenugasan] = useState("ALL");
  const [selectedStatusTukar, setSelectedStatusTukar] = useState("ALL");
  const [selectedStatusBayar, setSelectedStatusBayar] = useState("ALL");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const getReferensi = useCallback(async () => {
    try {
      const res = await storeSchema.actions.getReferensiByJenis("cabang_id");
      if (res?.status === true) {
        setCabangOptions((res?.data || []).map((item) => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        })));
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI CABANG:", error);
      await swal.error(error?.message || "Gagal mengambil referensi cabang");
    }
  }, []);

  // Customer dropdown mengikuti Attachment 4: pilih cabang dahulu,
  // kemudian customer dimuat berdasarkan cabang terpilih.
  useEffect(() => {
    let isMounted = true;
    const getDataCustomer = async () => {
      if (!filterCabang.length) {
        setCustomerOptions([]);
        setFilterCustomer([]);
        return;
      }
      try {
        const res = await storeSchema.actions.getDataPelanggan({
          page: 1,
          limit: 9999,
          cabang_id: filterCabang,
        });
        if (res?.status !== true) {
          throw new Error(res?.message || "Gagal mengambil data customer");
        }
        const responseData = res?.data;
        const listData = Array.isArray(responseData)
          ? responseData
          : responseData?.list_data || responseData?.data || responseData?.rows || [];
        const options = listData
          .map((item) => ({
            label: `${item?.kode_customer ?? ""}${item?.name ? ` - ${item.name}` : ""}`,
            value: item?.kode_customer,
          }))
          .filter((item) => item.value !== null && item.value !== undefined && String(item.value).trim() !== "");
        if (isMounted) {
          setCustomerOptions(options);
          setFilterCustomer((prev) =>
            prev.filter((value) => options.some((option) => String(option.value) === String(value)))
          );
        }
      } catch (error) {
        console.error("ERROR GET DATA CUSTOMER PENUGASAN:", error);
        if (isMounted) {
          setCustomerOptions([]);
          setFilterCustomer([]);
          await swal.error(error?.message || "Gagal mengambil data customer");
        }
      }
    };
    getDataCustomer();
    return () => { isMounted = false; };
  }, [filterCabang]);

  const getDataMonitoringPenugasan = useCallback(async () => {
    try {
      setLoading(true);
      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        sales_office: filterCabang.length ? filterCabang : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        status_penugasan: "ALL",
        status_tukar_faktur: selectedStatusTukar,
        status_pembayaran: selectedStatusBayar,
        start_date: filterStartDate,
        end_date: filterEndDate,
      };

      // API action baru yang disarankan: getMonitoringPenugasan.
      const res = await storeSchema.actions.getMonitoringPenugasan(payload);
      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal mengambil data monitoring penugasan");
      }

      const responseData = res?.data || {};
      const listData = responseData?.list_data || responseData?.data || responseData?.rows || [];
      const normalized = listData.map((item, index) => normalizeRow(item, index, currentPage, perPage));
      setTableData(normalized);

      const total = Number(responseData?.total_data ?? responseData?.total ?? normalized.length);
      setTotalData(total);
      setTotalPage(Number(responseData?.total_halaman ?? Math.ceil(total / perPage) ?? 0));

      const summary = responseData?.summary || {};
      const belumTukarCount = normalized.filter((item) => {
        const status = normalizeStatus(item._statusTukar);
        return !status || status.includes("BELUM") || status.includes("MENUNGGU");
      }).length;
      const sudahTukarCount = normalized.filter((item) => {
        const status = normalizeStatus(item._statusTukar);
        return status.includes("SUDAH_DITUKAR") || status === "DITUKAR" || status === "SELESAI";
      }).length;
      const belumTagihCount = normalized.filter((item) => {
        const status = normalizeStatus(item._statusBayar);
        return !status || status.includes("BELUM") || status.includes("MENUNGGU") || status.includes("PARTIAL");
      }).length;
      const sudahTagihCount = normalized.filter((item) => {
        const status = normalizeStatus(item._statusBayar);
        return status.includes("LUNAS") || status.includes("SUDAH_DIBAYAR") || status === "PAID" || status === "SETTLED";
      }).length;
      setSummaryData({
        total: Number(summary?.total_penugasan ?? summary?.total ?? total),
        belumTukar: Number(summary?.belum_tukar_faktur ?? summary?.belum_ditukar ?? summary?.belum_tukar ?? belumTukarCount),
        sudahTukar: Number(summary?.sudah_tukar_faktur ?? summary?.sudah_ditukar ?? summary?.sudah_tukar ?? sudahTukarCount),
        belumPenagihan: Number(summary?.belum_penagihan ?? summary?.belum_lunas ?? summary?.belum_dibayar ?? belumTagihCount),
        sudahPenagihan: Number(summary?.sudah_penagihan ?? summary?.sudah_lunas ?? summary?.sudah_dibayar ?? sudahTagihCount),
      });
    } catch (error) {
      console.error("ERROR GET MONITORING PENUGASAN:", error);
      setTableData([]);
      setTotalData(0);
      setTotalPage(0);
      setSummaryData({ total: 0, belumTukar: 0, sudahTukar: 0, belumPenagihan: 0, sudahPenagihan: 0 });
      await swal.error(error?.message || "Gagal mengambil data monitoring penugasan");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    perPage,
    searchKeyword,
    filterCabang,
    filterCustomer,
    selectedStatusTukar,
    selectedStatusBayar,
    filterStartDate,
    filterEndDate,
  ]);

  useEffect(() => {
    getReferensi();
  }, [getReferensi]);

  useEffect(() => {
    getDataMonitoringPenugasan();
  }, [getDataMonitoringPenugasan]);

  useEffect(() => {
    if (!reloadData) return;
    if (currentPage === 1) getDataMonitoringPenugasan();
    else setCurrentPage(1);
    if (setReloadData) setReloadData(false);
  }, [reloadData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setSelectedStatusPenugasan("ALL");
    setSelectedStatusTukar("ALL");
    setSelectedStatusBayar("ALL");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    if (currentPage === 1) getDataMonitoringPenugasan();
    else setCurrentPage(1);
  };

  const renderStatusPenugasan = (status) => {
    if (!status) return "-";
    const statusNormalized = normalizeStatus(status);
    const Icon = statusNormalized === "DIKEMBALIKAN" ? FaUndo : FaCheckCircle;
    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${statusNormalized === "DIKEMBALIKAN" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
        <Icon />
        {statusLabel(status, "default")}
      </span>
    );
  };

  const totalNominal = useMemo(
    () => tableData.reduce((sum, item) => sum + Number(item._saldo || 0), 0),
    [tableData]
  );

  return (
    <div className="w-full space-y-5">
      {/* SEARCH & FILTERS - mengikuti layout Lampiran 2 */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor faktur / customer / kolektor / cabang..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={keyword}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              onChange={(event) => setKeyword(event.target.value)}
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
          <div className="flex flex-wrap items-center gap-2">
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
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
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
                setFilterCustomer([]);
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
              isDisabled={!filterCabang.length}
              options={customerOptions}
              value={getSelectedFilterOptions(customerOptions, filterCustomer)}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCustomer((selected || []).map((item) => item.value));
              }}
              placeholder={filterCabang.length ? "Semua Customer" : "Pilih cabang dahulu"}
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
                { label: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
                { label: "Ditolak", value: "DITOLAK" },
              ]}
              value={[
                { label: "Semua Status", value: "ALL" },
                { label: "Belum Tukar Faktur", value: "BELUM_DITUKAR" },
                { label: "Sudah Tukar Faktur", value: "SUDAH_DITUKAR" },
                { label: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
                { label: "Ditolak", value: "DITOLAK" },
              ].find((item) => item.value === selectedStatusTukar)}
              onChange={(selected) => {
                setCurrentPage(1);
                setSelectedStatusTukar(selected?.value || "ALL");
              }}
              placeholder="Semua Status"
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Status Pembayaran</label>
            <Select
              options={[
                { label: "Semua Status Pembayaran", value: "ALL" },
                { label: "Belum Lunas", value: "BELUM_LUNAS" },
                { label: "Sudah Lunas", value: "SUDAH_LUNAS" },
              ]}
              value={[
                { label: "Semua Status Pembayaran", value: "ALL" },
                { label: "Belum Lunas", value: "BELUM_LUNAS" },
                { label: "Sudah Lunas", value: "SUDAH_LUNAS" },
              ].find((item) => item.value === selectedStatusBayar)}
              onChange={(selected) => {
                setCurrentPage(1);
                setSelectedStatusBayar(selected?.value || "ALL");
              }}
              placeholder="Semua Status"
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal</label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm">
              <FaCalendarAlt className="text-primary text-sm" />
              <input
                type="date"
                value={filterStartDate}
                max={filterEndDate || undefined}
                onChange={(event) => {
                  setCurrentPage(1);
                  setFilterStartDate(event.target.value);
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
              <span className="text-gray-300">-</span>
              <input
                type="date"
                value={filterEndDate}
                min={filterStartDate || undefined}
                onChange={(event) => {
                  setCurrentPage(1);
                  setFilterEndDate(event.target.value);
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-700"><FaFileInvoiceDollar /></div>
            <h3 className="font-bold text-gray-800">Tukar Faktur</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-700">Belum Tukar</p>
              <p className="mt-1 text-2xl font-bold text-amber-800">{Number(summaryData.belumTukar || 0).toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-xl bg-green-50 p-3">
              <p className="text-xs font-medium text-green-700">Sudah Tukar</p>
              <p className="mt-1 text-2xl font-bold text-green-800">{Number(summaryData.sudahTukar || 0).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-lg text-cyan-700"><FaMoneyBillWave /></div>
            <h3 className="font-bold text-gray-800">Penagihan</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-700">Belum Lunas</p>
              <p className="mt-1 text-2xl font-bold text-amber-800">{Number(summaryData.belumPenagihan || 0).toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-xl bg-green-50 p-3">
              <p className="text-xs font-medium text-green-700">Sudah Lunas</p>
              <p className="mt-1 text-2xl font-bold text-green-800">{Number(summaryData.sudahPenagihan || 0).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-auto rounded-2xl max-h-[65vh]">
          <table className="table w-full min-w-[3000px]">
            <thead className="bg-primary text-white sticky top-0 text-[13px] z-10">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2 font-semibold"><FaEllipsisV /> Aksi</div>
                </th>
                <th className="px-4 py-3 whitespace-nowrap">No</th>
                <th className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><FaFileInvoiceDollar /> No. Faktur</div></th>
                <th className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><FaBuilding /> Customer</div></th>
                {/* <th className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><FaUser /> Penagih</div></th> */}
                <th className="px-4 py-3 whitespace-nowrap text-right">DPP</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">PPN</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">PPh</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Total Invoice</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Collections</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Saldo Piutang</th>
                <th className="px-4 py-3 whitespace-nowrap">Document Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Due Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Tgl Penugasan Tukar Faktur</th>
                <th className="px-4 py-3 whitespace-nowrap">Petugas Tukar Faktur</th>
                <th className="px-4 py-3 whitespace-nowrap">Status Verifikasi Tukar Faktur</th>
                <th className="px-4 py-3 whitespace-nowrap">Tgl Penugasan Penagihan</th>
                <th className="px-4 py-3 whitespace-nowrap">Petugas Penagihan</th>
                <th className="px-4 py-3 whitespace-nowrap">Status Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={19} className="px-4 py-14 text-center text-gray-500"><span className="loading loading-spinner loading-md text-primary" /><div className="mt-2">Memuat data...</div></td></tr>
              ) : tableData.length === 0 ? (
                <tr><td colSpan={19} className="px-4 py-16 text-center text-gray-500"><FaClipboardList className="mx-auto mb-3 text-4xl text-gray-300" /><p className="font-medium">Tidak ada data</p><p className="mt-1 text-xs">Coba ubah pencarian atau filter.</p></td></tr>
              ) : tableData.map((item) => {
                const totalInvoice = item._dpp + item._ppn;
                return (
                  <tr key={item._id} className="transition duration-200 border-b border-gray-100 hover:bg-blue-50">
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => setSelectedData(item)} title="Lihat detail" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-primary transition hover:bg-blue-100"><FaEye /></button>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item._rowNo}</td>
                    <td className="px-4 py-3 font-semibold text-blue-900 whitespace-nowrap">{item._nomorTagihan}</td>
                    <td className="px-4 py-3"><div className="font-semibold text-gray-800">{item._customerName}</div>{item._customerCode && <div className="mt-0.5 text-xs text-gray-500">{item._customerCode}</div>}</td>
                    {/* <td className="px-4 py-3 whitespace-nowrap">{item._petugasPenagihan || item._kolektor || "-"}</td> */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">{formatRupiah(item._dpp)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">{formatRupiah(item._ppn)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">{formatRupiah(item._pph)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">{formatRupiah(totalInvoice)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">{formatRupiah(item._collections)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">{formatRupiah(item._saldo)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item._periode)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item._jatuhTempo)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item._tanggalPenugasanTukar)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item._petugasTukar || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge value={item._statusVerifikasiTukar || item._statusTukar} type="tukar" /></td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item._tanggalPenugasanPenagihan)}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className="inline-flex items-center gap-2"><FaUser className="text-gray-400" />{item._petugasPenagihan || item._kolektor || "-"}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge value={item._statusPembayaran || item._statusBayar} type="bayar" /></td>
                  </tr>
                );
              })}
            </tbody>
            {!loading && tableData.length > 0 && (
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={10} className="px-4 py-3 font-semibold text-gray-700">Total pada halaman ini</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatRupiah(totalNominal)}</td>
                  <td colSpan={8} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="border-t border-gray-100 bg-slate-50 px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-sm text-gray-600">Menampilkan <span className="font-semibold">{tableData.length ? (currentPage - 1) * perPage + 1 : 0}</span> sampai <span className="font-semibold">{Math.min(currentPage * perPage, totalData)}</span> dari <span className="font-semibold">{totalData}</span> data</div>
              <div className="flex items-center gap-2"><span className="text-sm text-gray-600">Baris:</span><select className="select select-bordered select-sm rounded-full bg-white" value={perPage} onChange={(event) => { setCurrentPage(1); setPerPage(Number(event.target.value)); }}>{[5, 10, 25, 50].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
            </div>
            {totalPage > 0 && <ReactPaginate breakLabel="..." previousLabel="←" nextLabel="→" pageCount={totalPage} onPageChange={(event) => setCurrentPage(event.selected + 1)} forcePage={Math.max(0, Math.min(currentPage - 1, totalPage - 1))} className="flex items-center gap-2" activeClassName="!bg-primary !text-white !border-primary" pageClassName="min-w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center bg-white hover:bg-blue-50" pageLinkClassName="w-full h-full flex items-center justify-center px-3" previousClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white" nextClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white" previousLinkClassName="w-full h-full flex items-center justify-center" nextLinkClassName="w-full h-full flex items-center justify-center" breakClassName="px-2 text-gray-500" disabledClassName="opacity-50 cursor-not-allowed" />}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedData && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedData(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-primary px-6 py-4 text-white">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <FaFileInvoiceDollar />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Detail Monitoring Penugasan</h3>
                    <p className="mt-0.5 text-xs text-blue-100">
                      Nomor Faktur: {selectedData._nomorTagihan}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedData(null)}
                  aria-label="Tutup detail"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FaBuilding className="text-primary" />
                  <h4 className="font-bold text-gray-700">Informasi Faktur</h4>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    ["Nomor Faktur", selectedData._nomorTagihan],
                    ["Customer", selectedData._customerName],
                    ["Kode Customer", selectedData._customerCode || "-"],
                    ["Cabang", selectedData._cabang],
                    ["DPP", formatRupiah(selectedData._dpp)],
                    ["PPN", formatRupiah(selectedData._ppn)],
                    ["PPh", formatRupiah(selectedData._pph)],
                    ["Total Invoice", formatRupiah(Number(selectedData._dpp || 0) + Number(selectedData._ppn || 0))],
                    ["Collections", formatRupiah(selectedData._collections)],
                    ["Saldo Piutang", formatRupiah(selectedData._saldo)],
                    ["Periode Faktur / Document Date", formatDate(selectedData._periode)],
                    ["Tanggal Jatuh Tempo", formatDate(selectedData._jatuhTempo)],
                    ["Umur Faktur", selectedData._umurFaktur == null ? "-" : `${selectedData._umurFaktur} hari`],
                    ["Petugas Tukar Faktur", selectedData._petugasTukar || "-"],
                    ["Tgl Penugasan Tukar Faktur", formatDate(selectedData._tanggalPenugasanTukar)],
                    ["Petugas Penagihan", selectedData._petugasPenagihan || "-"],
                    ["Tgl Penugasan Penagihan", formatDate(selectedData._tanggalPenugasanPenagihan)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-gray-100 bg-white p-3">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-gray-700">{value || "-"}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FaClipboardList className="text-primary" />
                  <h4 className="font-bold text-gray-700">Status Tukar Faktur & Pembayaran</h4>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 bg-white p-3">
                    <p className="text-xs text-gray-500">Status Penugasan</p>
                    <div className="mt-2">{renderStatusPenugasan(selectedData._statusPenugasan) || "-"}</div>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-3">
                    <p className="text-xs text-gray-500">Status Verifikasi Tukar Faktur</p>
                    <div className="mt-2"><StatusBadge value={selectedData._statusVerifikasiTukar} type="tukar" /></div>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-3">
                    <p className="text-xs text-gray-500">Tanggal Verifikasi Tukar Faktur</p>
                    <p className="mt-1 text-sm font-semibold text-gray-700">{formatDate(selectedData._tanggalVerifikasiTukar)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-3">
                    <p className="text-xs text-gray-500">Status Pembayaran</p>
                    <div className="mt-2"><StatusBadge value={selectedData._statusBayar} type="bayar" /></div>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-3 sm:col-span-2">
                    <p className="text-xs text-gray-500">Tanggal Verifikasi Pembayaran</p>
                    <p className="mt-1 text-sm font-semibold text-gray-700">{formatDate(selectedData._tanggalVerifikasiBayar)}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-end border-t border-gray-100 bg-slate-50 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedData(null)}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
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

export default TableMonitoringPenugasan;
