import React, { useCallback, useEffect, useState } from "react";
import XLSX from "xlsx-js-style";
import {
  FaBuilding,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaExclamationCircle,
  FaFileExcel,
  FaFileInvoiceDollar,
  FaFilter,
  FaSearch,
  FaStore,
  FaSpinner,
  FaSyncAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import { swal } from "global/helper/swal";
import storeSchema from "global/store";

const penjualanDetailColumns = [
  { key: "Sales Office", label: "Profit Center" },
  { key: "Desc. S.Office", label: "Profit Center Desc" },
  { key: "Document Date", label: "Document Date", type: "date" },
  { key: "Tanggal Jatuh Tempo", label: "Tanggal Jatuh Tempo", type: "date" },
  { key: "Billing No", label: "Billing No" },
  { key: "Bill to party", label: "Bill to Party" },
  { key: "Name Bill to", label: "Customer" },
  { key: "Address", label: "Address" },
  { key: "Material", label: "Material" },
  { key: "Text Material", label: "Text Material" },
  { key: "Material Group 1", label: "Material Group" },
  { key: "Desc Material Group 1", label: "Desc. Material Group" },
  { key: "Quantity", label: "Quantity", type: "number" },
  { key: "Sales Unit", label: "Sales Unit" },
  { key: "Unit Price Penjualan", label: "Harga Jual", type: "currency" },
  { key: "Total Discount", label: "Total Discount", type: "currency" },
  { key: "Total Penjualan", label: "DPP", type: "currency" },
  { key: "Tax Amount", label: "PPN", type: "currency" },
  { key: "PPh", label: "PPh", type: "currency" },
  { key: "Total COGS", label: "Total COGS", type: "currency" },
  { key: "Persentase COGS", label: "Persentase COGS", type: "percent" },
  { key: "Margin", label: "Margin", type: "currency" },
  { key: "Persentase Margin", label: "Persentase Margin", type: "percent" },
  { key: "Principle", label: "Principle" },
  { key: "Name Principle", label: "Nama Principle" },
  { key: "Desc. Cust. Grp4", label: "Lini" },
  { key: "TOP", label: "TOP", type: "top" },
  { key: "Salesman", label: "Salesman" },
  { key: "Name Salesman", label: "Nama Salesman" },
  { key: "PO Number", label: "PO Number" },
  { key: "Quotation Number", label: "Quotation Number" },
];

const normalizePenjualanDetail = (item) => ({
  ...item,
  "Sales Office": item?.sales_office,
  "Desc. S.Office": item?.desc_s_office,
  "Document Date": item?.document_date || item?.documentDate || item?.doc_date || item?.tanggal_dokumen || item?.DOCUMENT_DATE || item?.posting_date,
  "Posting Date": item?.posting_date || item?.postingDate || item?.tanggal_posting,
  "Billing No": item?.billing_no || item?.no_billing,
  "TOP": item?.["TOP"] ?? item?.top ?? item?.top_days ?? item?.term_of_payment,
  "Tanggal Jatuh Tempo": item?.tanggal_jatuh_tempo || item?.jatuh_tempo,
  "Bill to party": item?.bill_to_party,
  "Name Bill to": item?.name_bill_to,
  "Address": item?.address,
  "Material": item?.material,
  "Material Group 1": item?.material_group_1,
  "Desc Material Group 1": item?.desc_material_group_1,
  "Text Material": item?.text_material,
  "Quantity": item?.quantity,
  "Sales Unit": item?.sales_unit,
  "Unit Price Penjualan": item?.unit_price_penjualan,
  "Dis% (ZD01)": item?.dis_pct_zd01,
  "DisAmt (ZD01)": item?.dis_amt_zd01,
  "Dis% (ZD02)": item?.dis_pct_zd02,
  "DisAmt (ZD02)": item?.dis_amt_zd02,
  "Dis% (ZD03)": item?.dis_pct_zd03,
  "DisAmt (ZD03)": item?.dis_amt_zd03,
  "Dis% (ZD04)": item?.dis_pct_zd04,
  "DisAmt (ZD04)": item?.dis_amt_zd04,
  "Dis% (ZD05)": item?.dis_pct_zd05,
  "DisAmt (ZD05)": item?.dis_amt_zd05,
  "Dis% (ZD06)": item?.dis_pct_zd06,
  "DisAmt (ZD06)": item?.dis_amt_zd06,
  "Disc. Upfront % (ZD07)": item?.disc_upfront_pct_zd07,
  "Disc. Upfront Amt (ZD07)": item?.disc_upfront_amt_zd07,
  "Disc. Beban KFTD Upf % (ZD08)": item?.disc_beban_kftd_upf_pct_zd08,
  "Disc. Beban KFTD Upf Amt (ZD08)": item?.disc_beban_kftd_upf_amt_zd08,
  "Disc. Beban Principle Upf % (ZD09)": item?.disc_beban_principle_upf_pct_zd09,
  "Disc. Beban Principle Upf Amt (ZD09)": item?.disc_beban_principle_upf_amt_zd09,
  "Disc. Pengembalian Upf % (ZD10)": item?.disc_pengembalian_upf_pct_zd10,
  "Disc. Pengembalian Upf Amt (ZD10)": item?.disc_pengembalian_upf_amt_zd10,
  "Dis% (ZD12)": item?.dis_pct_zd12,
  "DisAmt (ZD12)": item?.dis_amt_zd12,
  "Dis% (ZD14)": item?.dis_pct_zd14,
  "DisAmt (ZD14)": item?.dis_amt_zd14,
  "Dis% (ZD15)": item?.dis_pct_zd15,
  "DisAmt (ZD15)": item?.dis_amt_zd15,
  "Total Discount": item?.total_discount,
  "Total Penjualan": item?.total_penjualan ?? item?.total_penjualan_neto ?? item?.dpp,
  "Tax Amount": item?.tax_amount ?? item?.ppn,
  "PPh": item?.pph,
  "Total COGS": item?.total_cogs,
  "Persentase COGS": item?.persentase_cogs,
  "Margin": item?.margin,
  "Persentase Margin": item?.persentase_margin,
  "Principle": item?.principle,
  "Name Principle": item?.name_principle,
  "Desc. Cust. Grp4": item?.desc_cust_grp4,
  "Salesman": item?.salesman,
  "Name Salesman": item?.name_salesman,
  "PO Number": item?.po_number,
  "Quotation Number": item?.quotation_number,
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
  control: (base, state) => ({ ...base, minHeight: 36, borderRadius: 9999, borderColor: state.isFocused ? "#2563eb" : "#d1d5db", boxShadow: "none", fontSize: "0.875rem", ":hover": { borderColor: "#2563eb" } }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 36 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};
const getSelectedFilterOptions = (options, selectedValues) => options.filter((option) => selectedValues.includes(option.value));
const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "0";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(Number(value) || 0);
};
const addDaysToDate = (dateValue, days) => {
  if (!dateValue || days === null || days === undefined || days === "") return null;
  const rawDate = String(dateValue).trim();
  const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(dateValue);
  const parsedDays = Number(String(days).match(/-?\d+(?:[.,]\d+)?/)?.[0]?.replace(",", "."));
  if (Number.isNaN(date.getTime()) || !Number.isFinite(parsedDays)) return null;
  date.setDate(date.getDate() + parsedDays);
  return date;
};
const getTanggalJatuhTempoPenjualan = (item) => {
  const postingDate = item?.["Posting Date"] || item?.posting_date || item?.postingDate || item?.tanggal_posting;
  const top = item?.TOP ?? item?.top ?? item?.top_days ?? item?.term_of_payment;
  return addDaysToDate(postingDate, top);
};
const formatTOP = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const parsed = String(value).match(/-?\d+(?:[.,]\d+)?/);
  return parsed ? `${formatNumber(Number(parsed[0].replace(",", ".")))} Hari` : value;
};

const firstNumber = (...values) => {
  for (const value of values) if (value !== null && value !== undefined && value !== "" && !Number.isNaN(Number(value))) return Number(value);
  return 0;
};
const formatRupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0);
const formatCompactRupiah = (value) => {
  const amount = Number(value) || 0;
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000_000) return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(amount / 1_000_000_000_000)} T`;
  if (abs >= 1_000_000_000) return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(amount / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(amount / 1_000_000)} Juta`;
  return formatRupiah(amount);
};
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};
const displayValue = (value) => value === null || value === undefined || value === "" ? "-" : value;
const getDpp = (item) => firstNumber(item?.dpp, item?.DPP, item?.nominal, item?.nominal_piutang);
const getPpn = (item) => firstNumber(item?.ppn, item?.PPN, getDpp(item) * 0.11);
const getPph = (item) => firstNumber(item?.pph, item?.PPH, getDpp(item) * 0.015);
const getCollection = (item) => firstNumber(item?.collection, item?.pencairan, item?.pembayaran, item?.dibayar, item?.sudah_dibayar);
const getOutstanding = (item) => {
  const value = item?.saldo_piutang ?? item?.outstanding ?? item?.sisa_piutang;
  return value !== null && value !== undefined && value !== "" ? firstNumber(value) : Math.max(0, getDpp(item) + getPpn(item) - getCollection(item));
};
const getPiutangStatus = (item) => getOutstanding(item) <= 0 ? "LUNAS" : "BELUM_LUNAS";
const getUmurPiutang = (item) => {
  const rawDate = item?.document_date || item?.documentDate || item?.tanggal_faktur || item?.posting_date;
  if (!rawDate) return 0;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return 0;
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today.getTime() - date.getTime()) / 86400000));
};
const getTukarFakturStatus = (item) => {
  const value = String(item?.status_tukar_faktur ?? item?.status_tukar ?? item?.status_verifikasi_tukar_faktur ?? "").toUpperCase();
  if (["TERVERIFIKASI", "VERIFIED", "DISETUJUI", "APPROVED", "S"].includes(value)) return "TERVERIFIKASI";
  if (["DITOLAK", "REJECTED", "REJECT", "R"].includes(value)) return "DITOLAK";
  return "MENUNGGU_VERIFIKASI";
};
const getStatusLunas = (item) => {
  const explicit = String(item?.status_lunas ?? item?.status_pelunasan ?? "").toUpperCase();
  if (["LUNAS", "SUDAH_LUNAS", "PAID", "Y", "S"].includes(explicit)) return "LUNAS";
  if (["BELUM_LUNAS", "BELUM LUNAS", "UNPAID", "N", "B"].includes(explicit)) return "BELUM_LUNAS";
  return getPiutangStatus(item);
};
const getSalesman = (item) => item?.nama_sales ?? item?.nama_salesman ?? item?.salesman_name ?? item?.sales_name ?? item?.salesman ?? "-";
const getPetugasTukarFaktur = (item) => item?.tukar_faktur_nama ?? item?.nama_petugas_tukar_faktur ?? item?.nama_salesman_tukar_faktur ?? getSalesman(item);
const getTanggalTukarFaktur = (item) => item?.tukar_faktur_assigned_at ?? item?.tanggal_penugasan_tukar_faktur ?? item?.tgl_penugasan_tukar_faktur ?? item?.tanggal_penugasan_tukar ?? item?.tanggal_penugasan ?? null;
const getPenagih = (item) => item?.penagihan_nama ?? item?.nama_penagih ?? item?.penagih ?? item?.nama_kolektor ?? item?.kolektor ?? "-";
const getTanggalPenagihan = (item) => item?.penagihan_assigned_at ?? item?.tanggal_penugasan_penagihan ?? item?.tgl_penugasan_penagihan ?? item?.tanggal_penugasan_penagih ?? item?.tanggal_penagihan ?? null;
const getInvoiceAmounts = (item) => {
  const dpp = getDpp(item); const ppn = getPpn(item); const pph = getPph(item);
  const collection = getCollection(item); const saldoPiutang = getOutstanding(item);
  let keterangan = "Sisa Piutang";
  if (saldoPiutang > 0 && Math.round(saldoPiutang) === Math.round(ppn)) keterangan = "Sisa PPN";
  else if (saldoPiutang > 0 && Math.round(saldoPiutang) === Math.round(pph)) keterangan = "Sisa PPh";
  return { dpp, ppn, pph, totalInvoice: dpp + ppn, collection, saldoPiutang, keterangan };
};

const TableLaporan = ({ dimensionScreenW, check, loginAccess, reloadData, setReloadData }) => {
  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({ total_data: 0, total_nominal: 0, total_collection: 0, lunas_count: 0, belum_lunas_count: 0, tukar_menunggu: 0, tukar_terverifikasi: 0, tukar_ditolak: 0 });
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCabang, setFilterCabang] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [filterChannel, setFilterChannel] = useState([]);
  const [filterPrinciple, setFilterPrinciple] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ cabang: [], customer: [], channel: [], principle: [] });
  const [selectedData, setSelectedData] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [penjualanDetails, setPenjualanDetails] = useState({});
  const [loadingPenjualanDetails, setLoadingPenjualanDetails] = useState({});

  const getReferensi = useCallback(async () => {
    try {
      const [refCabang, refChannel] = await Promise.all([
        storeSchema.actions.getReferensiByJenis("cabang_id"),
        storeSchema.actions.getReferensiByJenis("channel_id"),
      ]);
      if (refCabang?.status === true) setOptions((prev) => ({ ...prev, cabang: (refCabang?.data || []).map((item) => ({ label: item?.ur_ref, value: item?.kd_ref })) }));
      if (refChannel?.status === true) setOptions((prev) => ({ ...prev, channel: (refChannel?.data || []).map((item) => ({ label: item?.ur_ref, value: item?.kd_ref })) }));
      const principleRes = await storeSchema.actions.getListPrinciple({ page: 1, limit: 9999, sortBy: "ASC" });
      if (principleRes?.status === true) setOptions((prev) => ({ ...prev, principle: (principleRes?.data?.list_data || []).map((item) => ({ label: item?.nama_principle, value: item?.principle })) }));
    } catch (error) { console.error("ERROR GET REFERENSI LAPORAN:", error); }
  }, []);

  useEffect(() => { getReferensi(); }, [getReferensi]);

  useEffect(() => {
    let mounted = true;
    const getCustomers = async () => {
      if (!filterCabang.length) {
        setOptions((prev) => ({ ...prev, customer: [] }));
        setFilterCustomer([]);
        return;
      }
      try {
        const res = await storeSchema.actions.getDataPelanggan({ page: 1, limit: 9999, cabang_id: filterCabang });
        if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data customer");
        const response = res?.data;
        const list = Array.isArray(response) ? response : response?.list_data || response?.data || response?.rows || [];
        const customerOptions = list.map((item) => ({ label: `${item?.kode_customer ?? ""}${item?.name ? ` - ${item.name}` : ""}`, value: item?.kode_customer })).filter((item) => item.value !== null && item.value !== undefined && String(item.value).trim() !== "");
        if (mounted) {
          setOptions((prev) => ({ ...prev, customer: customerOptions }));
          setFilterCustomer((prev) => prev.filter((value) => customerOptions.some((option) => String(option.value) === String(value))));
        }
      } catch (error) {
        console.error("ERROR GET CUSTOMER LAPORAN:", error);
        if (mounted) { setOptions((prev) => ({ ...prev, customer: [] })); setFilterCustomer([]); }
      }
    };
    getCustomers();
    return () => { mounted = false; };
  }, [filterCabang]);

  const buildPayload = useCallback((page = currentPage, limit = perPage, keywordOverride = searchKeyword) => ({
    page,
    limit,
    keyword: keywordOverride,
    sales_office: filterCabang.length ? filterCabang : "ALL",
    customer: filterCustomer.length ? filterCustomer : "ALL",
    channel: filterChannel.length ? filterChannel : "ALL",
    principle: filterPrinciple.length ? filterPrinciple : "ALL",
    start_date: filterStartDate,
    end_date: filterEndDate,
  }), [currentPage, perPage, searchKeyword, filterCabang, filterCustomer, filterChannel, filterPrinciple, filterStartDate, filterEndDate]);

  const getDataLaporan = useCallback(async (overrides = {}) => {
    try {
      setLoading(true);
      const payload = { ...buildPayload(), ...overrides };
      const res = await storeSchema.actions.getDataLaporan(payload);
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data laporan");
      const responseData = res?.data || {};
      const list = Array.isArray(responseData?.list_data) ? responseData.list_data : Array.isArray(responseData?.data) ? responseData.data : Array.isArray(res?.data) ? res.data : [];
      setTableData(list.map((item, index) => ({ ...item, id: item?.id ?? item?.piutang_id ?? item?.billing_id ?? item?.no_billing ?? item?.no_tagihan ?? item?.no_faktur ?? `${payload.page}-${index}` })));
      setTotalData(Number(responseData?.total_data ?? responseData?.total ?? list.length));
      setTotalPage(Number(responseData?.total_halaman ?? responseData?.total_page ?? Math.ceil(Number(responseData?.total_data ?? list.length) / Number(payload.limit || perPage))));
      const summary = responseData?.summary || {};
      const rows = list;
      setSummaryData({
        total_data: firstNumber(summary?.total_data, responseData?.total_data, list.length),
        total_nominal: firstNumber(summary?.total_nominal, summary?.total_piutang, summary?.total_dpp, rows.reduce((sum, item) => sum + getDpp(item), 0)),
        total_collection: firstNumber(summary?.total_collection, summary?.total_dibayar, summary?.collection, rows.reduce((sum, item) => sum + getCollection(item), 0)),
        lunas_count: firstNumber(summary?.lunas_count, summary?.sudah_lunas, rows.filter((item) => getStatusLunas(item) === "LUNAS").length),
        belum_lunas_count: firstNumber(summary?.belum_lunas_count, summary?.belum_lunas, rows.filter((item) => getStatusLunas(item) !== "LUNAS").length),
        tukar_menunggu: firstNumber(summary?.tukar_menunggu, summary?.menunggu_verifikasi, rows.filter((item) => getTukarFakturStatus(item) === "MENUNGGU_VERIFIKASI").length),
        tukar_terverifikasi: firstNumber(summary?.tukar_terverifikasi, summary?.terverifikasi, rows.filter((item) => getTukarFakturStatus(item) === "TERVERIFIKASI").length),
        tukar_ditolak: firstNumber(summary?.tukar_ditolak, summary?.ditolak, rows.filter((item) => getTukarFakturStatus(item) === "DITOLAK").length),
      });
    } catch (error) {
      console.error("ERROR GET DATA LAPORAN:", error);
      setTableData([]); setTotalData(0); setTotalPage(0);
      setSummaryData({ total_data: 0, total_nominal: 0, total_collection: 0, lunas_count: 0, belum_lunas_count: 0, tukar_menunggu: 0, tukar_terverifikasi: 0, tukar_ditolak: 0 });
      await swal.error(error?.message || "Gagal mengambil data laporan");
    } finally { setLoading(false); }
  }, [buildPayload, perPage]);

  useEffect(() => { getDataLaporan(); }, [getDataLaporan]);
  useEffect(() => {
    if (!reloadData) return;
    if (currentPage !== 1) setCurrentPage(1); else getDataLaporan();
    if (setReloadData) setReloadData(false);
  }, [reloadData, currentPage, getDataLaporan, setReloadData]);

  const handleSearch = () => { setCurrentPage(1); setSearchKeyword(keyword.trim()); };
  const resetFilter = () => {
    setKeyword(""); setSearchKeyword(""); setFilterCabang([]); setFilterCustomer([]); setFilterChannel([]); setFilterPrinciple([]); setFilterStartDate(""); setFilterEndDate(""); setCurrentPage(1);
  };
  const handleRefresh = () => { if (currentPage !== 1) setCurrentPage(1); else getDataLaporan(); };
  const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
  const startIndex = totalData > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex = Math.min(currentPage * perPage, totalData);

  const renderStatusTukarFaktur = (item) => {
    const status = getTukarFakturStatus(item);
    const config = {
      MENUNGGU_VERIFIKASI: { label: "Menunggu Verifikasi", icon: FaClock, cls: "bg-amber-100 text-amber-700" },
      TERVERIFIKASI: { label: "Terverifikasi", icon: FaCheckCircle, cls: "bg-green-100 text-green-700" },
      DITOLAK: { label: "Ditolak", icon: FaExclamationCircle, cls: "bg-red-100 text-red-700" },
    }[status];
    const Icon = config.icon;
    return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.cls}`}><Icon />{config.label}</span>;
  };
  const renderStatusLunas = (item) => {
    const lunas = getStatusLunas(item) === "LUNAS";
    return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${lunas ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{lunas ? <FaCheckCircle /> : <FaClock />}{lunas ? "Sudah Lunas" : "Belum Lunas"}</span>;
  };

  const handleExpandPenjualan = async (item, rowKey) => {
    if (expandedRows[rowKey]) {
      setExpandedRows((prev) => ({ ...prev, [rowKey]: false }));
      return;
    }
    setExpandedRows((prev) => ({ ...prev, [rowKey]: true }));
    if (Object.prototype.hasOwnProperty.call(penjualanDetails, rowKey)) return;
    const noBilling = item?.no_billing || item?.no_tagihan || item?.billing_no;
    if (!noBilling) {
      setPenjualanDetails((prev) => ({ ...prev, [rowKey]: [] }));
      return;
    }
    try {
      setLoadingPenjualanDetails((prev) => ({ ...prev, [rowKey]: true }));
      const res = await storeSchema.actions.getDataPenjualan({ page: 1, limit: 9999, keyword: String(noBilling) });
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil detail data penjualan");
      const responseData = res?.data || {};
      const listData = Array.isArray(responseData) ? responseData : responseData?.list_data || responseData?.data || responseData?.rows || [];
      const filteredData = listData.filter((detail) => {
        const detailBilling = detail?.billing_no || detail?.no_billing || detail?.["Billing No"];
        return detailBilling === null || detailBilling === undefined || String(detailBilling) === String(noBilling);
      });
      setPenjualanDetails((prev) => ({ ...prev, [rowKey]: filteredData.map(normalizePenjualanDetail) }));
    } catch (error) {
      console.error("ERROR GET DETAIL DATA PENJUALAN:", error);
      setPenjualanDetails((prev) => ({ ...prev, [rowKey]: [] }));
      await swal.error(error?.message || "Gagal mengambil detail data penjualan");
    } finally {
      setLoadingPenjualanDetails((prev) => ({ ...prev, [rowKey]: false }));
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      // Ambil seluruh data sesuai filter aktif, bukan hanya halaman yang sedang tampil.
      const payload = buildPayload(1, Math.max(totalData, perPage, 99999), searchKeyword);
      const res = await storeSchema.actions.getDataLaporan(payload);
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data untuk export");
      const responseData = res?.data || {};
      const rows = Array.isArray(responseData?.list_data) ? responseData.list_data : Array.isArray(responseData?.data) ? responseData.data : Array.isArray(res?.data) ? res.data : [];
      if (!rows.length) { await swal.error("Tidak ada data untuk diexport."); return; }
      const excelData = rows.map((item, index) => ({
        No: index + 1,
        "No. Faktur": item?.no_faktur || item?.faktur || "-",
        "No. Billing": item?.no_billing || item?.no_tagihan || item?.billing_no || "-",
        "Document Date": item?.document_date || item?.documentDate || item?.tanggal_faktur || item?.posting_date || null,
        "Document Type": item?.document_type || item?.documentType || item?.doc_type || "-",
        "Kode Customer": item?.kode_customer || item?.customer_code || item?.customer || "-",
        "Nama Customer": item?.nama_customer || item?.customer_name || item?.name || item?.customer || "-",
        Salesman: item?.sales || item?.salesman || item?.kode_salesman || item?.sales_code || "-",
        "Nama Sales": item?.nama_sales || item?.nama_salesman || item?.sales_name || getSalesman(item),
        "Profit Center": item?.profit_center || item?.profit_center_name || "-",
        Cabang: item?.nama_cabang || item?.cabang || item?.sales_office_name || "-",
        Channel: item?.nama_channel || item?.channel_name || item?.channel || "-",
        "Kode Principle": item?.principle || item?.kode_principle || "-",
        "Nama Principle": item?.nama_principle || item?.principle_name || "-",
        "Lini Penjualan": item?.lini_penjualan || item?.sales_line || "-",
        TOP: item?.top || item?.TOP || "-",
        "Posting Date": item?.posting_date || item?.tanggal_posting || null,
        "Jatuh Tempo": item?.jatuh_tempo || item?.due_date || null,
        "Umur Piutang (Hari)": item?.aging ?? getUmurPiutang(item),
        DPP: getDpp(item), PPN: getPpn(item), PPh: getPph(item),
        "Total Invoice": getDpp(item) + getPpn(item),
        Collection: getCollection(item), "Saldo Piutang": getOutstanding(item),
        "Keterangan Outstanding": item?.keterangan_outstanding || item?.keterangan || getInvoiceAmounts(item).keterangan,
        Status: item?.status || item?.status_piutang || "-",
        "Tukar Faktur - Petugas": getPetugasTukarFaktur(item),
        "Tukar Faktur - Tanggal Penugasan": getTanggalTukarFaktur(item),
        "Status Tukar Faktur": ({ MENUNGGU_VERIFIKASI: "Menunggu Verifikasi", TERVERIFIKASI: "Terverifikasi", DITOLAK: "Ditolak" })[getTukarFakturStatus(item)],
        "Penagihan - Penagih": getPenagih(item),
        "Penagihan - Tanggal Penugasan": getTanggalPenagihan(item),
        "Status Lunas": getStatusLunas(item) === "LUNAS" ? "Sudah Lunas" : "Belum Lunas",
      }));
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      if (worksheet["!ref"]) {
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col += 1) {
          const address = XLSX.utils.encode_cell({ r: 0, c: col });
          if (worksheet[address]) worksheet[address].s = { fill: { fgColor: { rgb: "000080" } }, font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 }, alignment: { horizontal: "center", vertical: "center" }, border: { top: { style: "thin", color: { rgb: "D1D5DB" } }, bottom: { style: "thin", color: { rgb: "D1D5DB" } }, left: { style: "thin", color: { rgb: "D1D5DB" } }, right: { style: "thin", color: { rgb: "D1D5DB" } } } };
        }
      }
      worksheet["!cols"] = Array.from({ length: Object.keys(excelData[0] || {}).length }, (_, index) => ({ wch: index === 0 ? 6 : 22 }));
      for (let row = 1; row <= excelData.length; row += 1) [17, 18, 19, 20, 21, 22].forEach((columnIndex) => { const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: columnIndex })]; if (cell) { cell.z = '"Rp" #,##0'; cell.s = { alignment: { horizontal: "right" } }; } });
      worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
      const summaryRows = [
        { Informasi: "Cabang", Nilai: filterCabang.length ? filterCabang.join(", ") : "Semua Cabang" },
        { Informasi: "Channel", Nilai: filterChannel.length ? filterChannel.join(", ") : "Semua Channel" },
        { Informasi: "Principle", Nilai: filterPrinciple.length ? filterPrinciple.join(", ") : "Semua Principle" },
        { Informasi: "Customer", Nilai: filterCustomer.length ? filterCustomer.join(", ") : "Semua Customer" },
        { Informasi: "Kata Pencarian", Nilai: searchKeyword || "-" },
        { Informasi: "Jumlah Data Diexport", Nilai: rows.length },
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
      summarySheet["!cols"] = [{ wch: 28 }, { wch: 45 }];
      ["A1", "B1"].forEach((cell) => { if (summarySheet[cell]) summarySheet[cell].s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "000080" } }, alignment: { horizontal: "center" } }; });
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Filter");
      XLSX.writeFile(workbook, `Laporan_Tukar_Faktur_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (error) {
      console.error("ERROR EXPORT LAPORAN:", error);
      await swal.error(error?.message || "Gagal export Excel");
    } finally { setLoading(false); }
  };

  const statusLabel = (value) => String(value ?? "").replaceAll("_", " ");

  return (
    <div className="flex flex-col gap-5">
      {/* PENCARIAN DAN FILTER - mengikuti tampilan TableDataPiutang */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input type="text" placeholder="Cari billing / faktur / customer / salesman..." className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0" value={keyword} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} onChange={(e) => setKeyword(e.target.value)} />
            <button type="button" onClick={handleSearch} title="Cari" aria-label="Cari" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90"><FaSearch className="text-sm" /></button>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button type="button" onClick={resetFilter} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"><FaFilter />Reset Filter</button>
            <button type="button" onClick={handleRefresh} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"><FaSyncAlt />Refresh</button>
            <button type="button" onClick={handleExportExcel} disabled={loading} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-md hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed"><FaFileExcel />Export Excel</button>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full min-w-[190px] sm:w-[220px]"><label className="mb-1 block text-xs font-medium text-gray-600">Cabang</label><Select isMulti options={options.cabang} value={getSelectedFilterOptions(options.cabang, filterCabang)} onChange={(selected) => { setCurrentPage(1); setFilterCabang((selected || []).map((item) => item.value)); setFilterCustomer([]); }} placeholder="Semua Cabang" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full min-w-[180px] sm:w-[210px]"><label className="mb-1 block text-xs font-medium text-gray-600">Channel</label><Select isMulti options={options.channel} value={getSelectedFilterOptions(options.channel, filterChannel)} onChange={(selected) => { setCurrentPage(1); setFilterChannel((selected || []).map((item) => item.value)); }} placeholder="Semua Channel" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full min-w-[180px] sm:w-[210px]"><label className="mb-1 block text-xs font-medium text-gray-600">Principle</label><Select isMulti options={options.principle} value={getSelectedFilterOptions(options.principle, filterPrinciple)} onChange={(selected) => { setCurrentPage(1); setFilterPrinciple((selected || []).map((item) => item.value)); }} placeholder="Semua Principle" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full min-w-[180px] sm:w-[210px]"><label className="mb-1 block text-xs font-medium text-gray-600">Customer</label><Select isMulti isDisabled={!filterCabang.length} options={options.customer} value={getSelectedFilterOptions(options.customer, filterCustomer)} onChange={(selected) => { setCurrentPage(1); setFilterCustomer((selected || []).map((item) => item.value)); }} placeholder={!filterCabang.length ? "Pilih cabang dahulu" : "Semua Customer"} closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full sm:w-auto"><label className="mb-1 block text-xs font-medium text-gray-600">Document Date</label><div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm"><FaCalendarAlt className="text-primary text-sm" /><input type="date" value={filterStartDate} max={filterEndDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterStartDate(e.target.value); }} className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]" title="Tanggal mulai" /><span className="text-gray-300">-</span><input type="date" value={filterEndDate} min={filterStartDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterEndDate(e.target.value); }} className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]" title="Tanggal akhir" /></div></div>
        </div>
      </div>

      {/* RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4"><p className="text-sm text-blue-700">Total Data</p><p className="text-2xl font-bold text-blue-900">{summaryData.total_data || totalData}</p></div>
        <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4"><p className="text-sm text-purple-700">Total DPP</p><p className="text-xl font-bold text-purple-900">{formatCompactRupiah(summaryData.total_nominal)}</p></div>
        <div className="rounded-2xl bg-green-50 border border-green-100 p-4"><p className="text-sm text-green-700">Sudah Lunas</p><p className="text-2xl font-bold text-green-900">{summaryData.lunas_count}</p></div>
        <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4"><p className="text-sm text-orange-700">Belum Lunas</p><p className="text-2xl font-bold text-orange-900">{summaryData.belum_lunas_count}</p></div>
        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4"><p className="text-sm text-indigo-700">Collection</p><p className="text-xl font-bold text-indigo-900">{formatCompactRupiah(summaryData.total_collection)}</p></div>
      </div>

      {/* TABEL */}
      <div className={dimensionScreenW < 768 && check ? "bringToBack" : ""}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="relative overflow-auto rounded-2xl max-h-[65vh]">
            {loading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"><div className="flex flex-col items-center gap-3"><span className="loading loading-spinner loading-lg text-primary" /><span className="text-sm text-gray-600">Memuat data laporan...</span></div></div>}
            <table className="table w-full border-collapse">
              <thead className="bg-primary text-white sticky top-0 text-[12px] z-10"><tr>
                <th className="px-4 py-3 whitespace-nowrap text-center">Aksi</th>
                <th className="px-4 py-3 whitespace-nowrap">No</th>
                <th className="px-4 py-3 whitespace-nowrap">No. Billing</th>
                <th className="px-4 py-3 whitespace-nowrap">Document Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Document Type</th>
                <th className="px-4 py-3 whitespace-nowrap">Kode Customer</th>
                <th className="px-4 py-3 whitespace-nowrap">Nama Customer</th>
                <th className="px-4 py-3 whitespace-nowrap">Salesman</th>
                <th className="px-4 py-3 whitespace-nowrap">Nama Sales</th>
                <th className="px-4 py-3 whitespace-nowrap">Profit Center</th>
                <th className="px-4 py-3 whitespace-nowrap">Cabang</th>
                <th className="px-4 py-3 whitespace-nowrap">Posting Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Jatuh Tempo</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">DPP</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">PPN</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">PPh</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Total Invoice</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Collection</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Saldo Piutang</th>
                <th className="px-4 py-3 whitespace-nowrap">Keterangan Outstanding</th>
                <th className="px-4 py-3 whitespace-nowrap text-center">Aging</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Tukar Faktur</th>
                <th className="px-4 py-3 whitespace-nowrap">Status Tukar Faktur</th>
                <th className="px-4 py-3 whitespace-nowrap">Penagihan</th>
                <th className="px-4 py-3 whitespace-nowrap">Status Lunas</th>
              </tr></thead>
              <tbody>
                {!tableData.length ? <tr><td colSpan={26} className="text-center py-16 text-gray-500"><FaFileInvoiceDollar className="text-4xl text-gray-300 mx-auto mb-3" /><p className="font-medium">Tidak ada data laporan</p><p className="text-xs text-gray-400 mt-1">Silakan ubah filter atau kata pencarian</p></td></tr> : tableData.map((item, index) => {
                  const amounts = getInvoiceAmounts(item);
                  const docDate = item?.document_date || item?.documentDate || item?.tanggal_faktur || item?.posting_date;
                  const postingDate = item?.posting_date || item?.tanggal_posting;
                  const aging = item?.aging ?? getUmurPiutang(item);
                  const statusText = item?.status ?? item?.status_piutang ?? "-";
                  const rowKey = `${item?.no_billing || item?.no_tagihan || item?.billing_no || item?.no_faktur || "billing"}-${item?.kode_customer || item?.customer_code || "customer"}-${index}`;
                  return <React.Fragment key={rowKey}>
                  <tr className="border-b hover:bg-blue-50 transition duration-200">
                    <td className="px-4 py-2 text-center">
                      <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                        <button type="button" title="Lihat detail" aria-label="Lihat detail" onClick={() => setSelectedData(item)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition hover:bg-blue-100">
                          <FaEye />
                        </button>
                        <button type="button" title={expandedRows[rowKey] ? "Tutup detail penjualan" : "Lihat detail penjualan"} aria-label={expandedRows[rowKey] ? "Tutup detail penjualan" : "Lihat detail penjualan"} onClick={() => handleExpandPenjualan(item, rowKey)} className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${expandedRows[rowKey] ? "border-blue-200 bg-blue-100 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"}`}>
                          {expandedRows[rowKey] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-700">{(currentPage - 1) * perPage + index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap"><p className="font-semibold text-primary">{displayValue(item?.no_billing || item?.no_tagihan || item?.billing_no || item?.no_faktur)}</p></td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(docDate)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{displayValue(item?.document_type || item?.documentType || item?.doc_type)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{displayValue(item?.kode_customer || item?.customer_code || item?.customer)}</td>
                    <td className="px-4 py-2 min-w-[220px]"><div className="flex items-center gap-2"><FaBuilding className="text-blue-500 shrink-0" /><span className="font-medium text-gray-700">{displayValue(item?.nama_customer || item?.customer_name || item?.name || item?.customer)}</span></div></td>
                    <td className="px-4 py-2 whitespace-nowrap">{displayValue(item?.sales || item?.salesman || item?.kode_salesman || item?.sales_code)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{displayValue(item?.nama_sales || item?.nama_salesman || item?.sales_name || getSalesman(item))}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{displayValue(item?.profit_center || item?.profit_center_name)}</td>
                    <td className="px-4 py-2 whitespace-nowrap"><div className="flex items-center gap-2"><FaStore className="text-orange-500" />{displayValue(item?.nama_cabang || item?.cabang || item?.sales_office_name)}</div></td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(postingDate)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(item?.jatuh_tempo || item?.due_date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right font-semibold">{formatRupiah(amounts.dpp)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right font-semibold text-blue-600">{formatRupiah(amounts.ppn)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right font-semibold text-purple-600">{formatRupiah(amounts.pph)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right font-semibold">{formatRupiah(amounts.totalInvoice)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right font-semibold text-green-600">{formatRupiah(amounts.collection)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right font-bold text-red-600">{formatRupiah(amounts.saldoPiutang)}</td>
                    <td className="px-4 py-2 whitespace-nowrap"><span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{displayValue(item?.keterangan_outstanding || item?.keterangan || amounts.keterangan)}</span></td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{displayValue(aging)}{typeof aging === "number" || /^\d+$/.test(String(aging)) ? " hari" : ""}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{displayValue(statusText)}</td>
                    <td className="px-4 py-2 min-w-[200px]"><div className="flex flex-col gap-1"><span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"><FaUser className="text-blue-500" />{displayValue(getPetugasTukarFaktur(item))}</span><span className="text-xs text-gray-500"><FaCalendarAlt className="inline mr-1" />{formatDate(getTanggalTukarFaktur(item))}</span></div></td>
                    <td className="px-4 py-2">{renderStatusTukarFaktur(item)}</td>
                    <td className="px-4 py-2 min-w-[190px]"><div className="flex flex-col gap-1"><span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"><FaUser className="text-orange-500" />{displayValue(getPenagih(item))}</span><span className="text-xs text-gray-500"><FaCalendarAlt className="inline mr-1" />{formatDate(getTanggalPenagihan(item))}</span></div></td>
                    <td className="px-4 py-2">{renderStatusLunas(item)}</td>
                  </tr>
                  {expandedRows[rowKey] && (
                    <tr className="border-b border-blue-100 bg-slate-50">
                      <td colSpan={26} className="p-0">
                        <div className="border-l-4 border-blue-500 px-4 py-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-800">Detail Data Penjualan</p>
                              <p className="text-xs text-gray-500">No. Billing: {displayValue(item?.no_billing || item?.no_tagihan || item?.billing_no || item?.no_faktur)}</p>
                            </div>
                            {loadingPenjualanDetails[rowKey] && <span className="inline-flex items-center gap-2 text-sm text-blue-600"><FaSpinner className="animate-spin" /> Memuat detail...</span>}
                          </div>
                          {loadingPenjualanDetails[rowKey] ? (
                            <div className="py-8 text-center text-sm text-gray-500">Sedang mengambil data penjualan dari API...</div>
                          ) : (penjualanDetails[rowKey] || []).length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-8 text-center text-sm text-gray-500">Data penjualan untuk billing ini tidak ditemukan.</div>
                          ) : (
                            <div className="overflow-auto rounded-xl border border-gray-200 bg-white max-h-[420px]">
                              <table className="table table-sm w-full">
                                <thead className="sticky top-0 z-[1] bg-blue-50 text-gray-700"><tr>{penjualanDetailColumns.map((column) => <th key={column.key} className="whitespace-nowrap px-3 py-2 text-xs">{column.label}</th>)}</tr></thead>
                                <tbody>{penjualanDetails[rowKey].map((detail, detailIndex) => (
                                  <tr key={`${detail?.["Billing No"] || rowKey}-${detail?.Material || detail?.material || detailIndex}-${detailIndex}`} className="border-b last:border-b-0 hover:bg-blue-50/60">
                                    {penjualanDetailColumns.map((column) => {
                                      const totalPenjualan = Number(detail?.["Total Penjualan"] || 0);
                                      const totalCOGS = Number(detail?.["Total COGS"] || 0);
                                      let value = detail?.[column.key];
                                      if (column.key === "Tanggal Jatuh Tempo") value = getTanggalJatuhTempoPenjualan(detail);
                                      if (column.key === "TOP") value = detail?.["TOP"] ?? detail?.top ?? detail?.top_days ?? detail?.term_of_payment;
                                      if (column.key === "PPh") value = firstNumber(detail?.PPh, detail?.pph, totalPenjualan * 0.015);
                                      if (column.key === "Persentase COGS") value = totalPenjualan !== 0 ? (totalCOGS / totalPenjualan) * 100 : 0;
                                      if (column.key === "Margin") value = totalPenjualan - totalCOGS;
                                      if (column.key === "Persentase Margin") value = totalPenjualan !== 0 ? ((totalPenjualan - totalCOGS) / totalPenjualan) * 100 : 0;
                                      return <td key={column.key} className="whitespace-nowrap px-3 py-2 text-xs text-gray-700">{column.type === "currency" ? formatRupiah(value) : column.type === "number" ? formatNumber(value) : column.type === "percent" ? `${formatNumber(value)}%` : column.type === "date" ? formatDate(value) : column.type === "top" ? formatTOP(value) : displayValue(value)}</td>;
                                    })}
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>;
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-500"><span>Menampilkan <b className="text-gray-700">{startIndex}-{endIndex}</b> dari <b className="text-gray-700">{totalData}</b> data</span><div className="flex items-center gap-2"><label htmlFor="laporan-per-page">Baris:</label><select id="laporan-per-page" value={perPage} onChange={(e) => { setCurrentPage(1); setPerPage(Number(e.target.value)); }} className="select select-bordered select-xs rounded-full bg-white"><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select></div></div>
            {totalPage > 0 && <ReactPaginate breakLabel="..." previousLabel="←" nextLabel="→" pageCount={totalPage} onPageChange={handlePageChange} forcePage={Math.min(currentPage - 1, Math.max(totalPage - 1, 0))} className="flex items-center gap-2" activeClassName="!bg-primary !text-white !border-primary" pageClassName="min-w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center bg-white hover:bg-blue-50" pageLinkClassName="w-full h-full flex items-center justify-center px-3" previousClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white" nextClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white" previousLinkClassName="w-full h-full flex items-center justify-center" nextLinkClassName="w-full h-full flex items-center justify-center" breakClassName="px-2 text-gray-500" disabledClassName="opacity-50 cursor-not-allowed" />}
          </div>
        </div>
      </div>

      {selectedData && <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedData(null)}><div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-primary px-6 py-4 text-white flex items-center justify-between"><div><h3 className="font-bold text-lg">Detail Laporan</h3><p className="text-xs text-white/80">{displayValue(selectedData?.no_faktur || selectedData?.faktur)}</p></div><button type="button" onClick={() => setSelectedData(null)} className="p-2 rounded-full hover:bg-white/10" aria-label="Tutup"><FaTimes /></button></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {[["No. Faktur", selectedData?.no_faktur || selectedData?.faktur], ["No. Billing", selectedData?.no_billing || selectedData?.no_tagihan || selectedData?.billing_no || selectedData?.no_faktur], ["Document Date", formatDate(selectedData?.document_date || selectedData?.documentDate || selectedData?.tanggal_faktur || selectedData?.posting_date)], ["Kode Customer", selectedData?.kode_customer || selectedData?.customer_code || selectedData?.customer], ["Nama Customer", selectedData?.nama_customer || selectedData?.customer_name || selectedData?.name || selectedData?.customer], ["Cabang", selectedData?.nama_cabang || selectedData?.cabang], ["Posting Date", formatDate(selectedData?.posting_date)], ["Jatuh Tempo", formatDate(selectedData?.jatuh_tempo)], ["Document Type", selectedData?.document_type], ["Sales", selectedData?.sales], ["Nama Sales", selectedData?.nama_sales], ["PPN", formatRupiah(getPpn(selectedData))], ["PPh", formatRupiah(getPph(selectedData))], ["Dibayar / Collection", formatRupiah(getCollection(selectedData))], ["Aging", selectedData?.aging != null ? `${selectedData.aging} hari` : getUmurPiutang(selectedData)], ["Status Piutang", statusLabel(selectedData?.status_piutang)], ["DPP", formatRupiah(getDpp(selectedData))], ["Saldo Piutang", formatRupiah(getOutstanding(selectedData))], ["Petugas Tukar Faktur", getPetugasTukarFaktur(selectedData)], ["Tanggal Penugasan Tukar Faktur", formatDate(getTanggalTukarFaktur(selectedData))], ["Status Tukar Faktur", statusLabel(getTukarFakturStatus(selectedData))], ["Penagih", getPenagih(selectedData)], ["Tanggal Penugasan Penagihan", formatDate(getTanggalPenagihan(selectedData))], ["Status Lunas", getStatusLunas(selectedData) === "LUNAS" ? "Sudah Lunas" : "Belum Lunas"]].map(([label, value]) => <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-3"><p className="text-xs text-gray-500 mb-1">{label}</p><p className="text-sm font-semibold text-gray-800">{displayValue(value)}</p></div>)}
        </div>
        <div className="px-6 pb-6 flex justify-end"><button type="button" onClick={() => setSelectedData(null)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"><FaTimes />Tutup</button></div>
      </div></div>}
    </div>
  );
};

export default TableLaporan;
