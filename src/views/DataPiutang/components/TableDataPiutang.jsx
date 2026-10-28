import React, {
  useEffect,
  useState,
} from "react";

import {
  // FaEllipsisV,
  // FaHashtag,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
  // FaEye,
  FaTimes,
  FaSearch,
  FaFilter,
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaSyncAlt,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
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
  { key: "Collection", label: "Collection", type: "currency" },
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
  options.filter((option) => selectedValues.includes(option.value));

// =====================================================
// HELPERS
// =====================================================

const formatNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "0";
  }

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const formatCompactRupiah = (value) => {
  const amount = Number(value) || 0;
  const absoluteAmount = Math.abs(amount);

  if (absoluteAmount >= 1_000_000_000_000) {
    return `Rp ${new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 1,
    }).format(amount / 1_000_000_000_000)} T`;
  }

  if (absoluteAmount >= 1_000_000_000) {
    return `Rp ${new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 1,
    }).format(amount / 1_000_000_000)} M`;
  }

  if (absoluteAmount >= 1_000_000) {
    return `Rp ${new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 1,
    }).format(amount / 1_000_000)} Juta`;
  }

  return formatRupiah(amount);
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Label tanggal acuan aging: hari terakhir bulan berjalan (dd/mm/yyyy).
const getEndOfCurrentMonthLabel = () => {
  const today = new Date();
  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  const day = String(endOfMonth.getDate()).padStart(2, "0");
  const month = String(endOfMonth.getMonth() + 1).padStart(2, "0");
  const year = endOfMonth.getFullYear();

  return `${day}/${month}/${year}`;
};

const addDaysToDate = (dateValue, days) => {
  if (!dateValue || days === null || days === undefined || days === "") return null;

  // Parse YYYY-MM-DD as local date to avoid timezone shifts.
  const rawDate = String(dateValue).trim();
  const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(dateValue);

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

const displayValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return value;
};

const firstNumber = (...values) => {
  for (const value of values) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return 0;
};

const getInvoiceAmounts = (item) => {
  const dpp = firstNumber(item?.dpp);
  const ppn = firstNumber(item?.ppn);
  const pph = firstNumber(item?.pph);
  const totalInvoice = dpp + ppn;

  const collection = firstNumber(
    item?.collection,
    item?.dibayar,
    item?.sudah_dibayar
  );

  const saldoValue =
    item?.saldo_piutang !== null &&
      item?.saldo_piutang !== undefined &&
      item?.saldo_piutang !== ""
      ? item.saldo_piutang
      : item?.outstanding;

  const hasSaldoValue =
    saldoValue !== null &&
    saldoValue !== undefined &&
    saldoValue !== "";

  const saldoPiutang = totalInvoice - collection;

  return {
    dpp,
    ppn,
    pph,
    totalInvoice,
    collection,
    saldoPiutang,
  };
};

// =====================================================
// ALOKASI COLLECTION DETAIL PENJUALAN SECARA PROPORSIONAL
// Dasar proporsi: DPP + PPN masing-masing detail.
// =====================================================

const getDetailCollection = (details, totalCollection, detailIndex) => {
  const rows = Array.isArray(details) ? details : [];
  const collection = Number(totalCollection) || 0;

  if (
    rows.length === 0 ||
    detailIndex < 0 ||
    detailIndex >= rows.length
  ) {
    return 0;
  }

  // Dasar alokasi tiap detail adalah DPP + PPN.
  const detailAmounts = rows.map((detail) => {
    const dpp = firstNumber(
      detail?.["Total Penjualan"],
      detail?.total_penjualan,
      detail?.total_penjualan_neto,
      detail?.dpp
    );

    const ppn = firstNumber(
      detail?.["Tax Amount"],
      detail?.tax_amount,
      detail?.ppn
    );

    return Math.max(0, dpp + ppn);
  });

  const totalDetailInvoice = detailAmounts.reduce(
    (sum, amount) => sum + amount,
    0
  );

  if (totalDetailInvoice <= 0) return 0;

  // Baris terakhir menampung sisa pembulatan agar jumlah alokasi
  // tepat sama dengan Collection dari data utama piutang.
  if (detailIndex === rows.length - 1) {
    const allocatedBefore = detailAmounts
      .slice(0, detailIndex)
      .reduce(
        (sum, amount) =>
          sum + Math.round((collection * amount) / totalDetailInvoice),
        0
      );

    return Math.round(collection) - allocatedBefore;
  }

  return Math.round(
    (collection * detailAmounts[detailIndex]) / totalDetailInvoice
  );
};

const getPiutangKeterangan = ({ saldoPiutang, ppn, pph }) => {
  const isSameAmount = (first, second) =>
    Math.abs(first - second) < 0.01;

  if (ppn > 0 && isSameAmount(saldoPiutang, ppn)) {
    return "Sisa PPN";
  }

  if (pph > 0 && isSameAmount(saldoPiutang, pph)) {
    return "Sisa PPh";
  }

  if (
    ppn + pph > 0 &&
    isSameAmount(saldoPiutang, ppn + pph)
  ) {
    return "Sisa PPN + PPh";
  }

  return "Sisa Komersil";
};
// =====================================================
// DATE HELPER
// =====================================================

const normalizeDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};

// =====================================================
// HITUNG JATUH TEMPO
// 7 HARI SETELAH POSTING DATE / TANGGAL FAKTUR
// =====================================================

const getCalculatedDueDate = (item) => {
  // Kalau backend sudah mengirim jatuh_tempo,
  // gunakan nilai dari backend.
  if (item?.jatuh_tempo) {
    return normalizeDate(item.jatuh_tempo);
  }

  // Fallback: hitung dari posting_date + 7 hari
  const postingDate = normalizeDate(
    item?.posting_date ||
    item?.tanggal_faktur
  );

  if (!postingDate) {
    return null;
  }

  const dueDate = new Date(postingDate);

  dueDate.setDate(dueDate.getDate() + 7);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate;
};

// =====================================================
// JUMLAH HARI MENUJU JATUH TEMPO
// =====================================================

const getDaysToDue = (item) => {
  const dueDate = getCalculatedDueDate(item);

  if (!dueDate) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (dueDate.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)
  );
};

// =====================================================
// STATUS PEMBAYARAN
//
// 1. OUTSTANDING
//    Belum ada pembayaran
//
// 2. BELUM_LUNAS
//    Sudah ada pembayaran, tetapi masih ada outstanding
//
// 3. LUNAS
//    Outstanding <= 0
// =====================================================

const getPiutangStatus = (item) => {
  const { collection, saldoPiutang } =
    getInvoiceAmounts(item);

  const outstanding = saldoPiutang;

  if (outstanding <= 0) {
    return "LUNAS";
  }

  if (collection <= 0) {
    return "OUTSTANDING";
  }

  return "BELUM_LUNAS";
};

// =====================================================
// CEK AKAN JATUH TEMPO
// =====================================================

const isAkanJatuhTempo = (item) => {
  const status = getPiutangStatus(item);

  if (status === "LUNAS") {
    return false;
  }

  const days = getDaysToDue(item);

  if (days === null) {
    return false;
  }

  return days >= 0 && days <= 7;
};

// =====================================================
// CEK SUDAH JATUH TEMPO
// =====================================================

const isSudahJatuhTempo = (item) => {
  const status = getPiutangStatus(item);

  if (status === "LUNAS") {
    return false;
  }

  const days = getDaysToDue(item);

  if (days === null) {
    return false;
  }

  return days < 0;
};

// =====================================================
// STATUS BADGE
// =====================================================

const renderStatus = (item) => {
  const status = getPiutangStatus(item);
  const akanJatuhTempo = isAkanJatuhTempo(item);
  const sudahJatuhTempo = isSudahJatuhTempo(item);

  // SUDAH LUNAS
  if (status === "LUNAS") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
          <FaCheckCircle />
          Sudah Lunas
        </span>
      </div>
    );
  }

  // BELUM LUNAS
  if (status === "BELUM_LUNAS") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 whitespace-nowrap">
          <FaMoneyBillWave />
          Belum Lunas
        </span>

        {akanJatuhTempo && (
          <span className="text-[10px] font-semibold text-yellow-600">
            Akan Jatuh Tempo
          </span>
        )}

        {sudahJatuhTempo && (
          <span className="text-[10px] font-semibold text-red-600">
            Sudah Jatuh Tempo
          </span>
        )}
      </div>
    );
  }

  // OUTSTANDING
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 whitespace-nowrap">
        <FaExclamationCircle />
        Outstanding
      </span>

      {akanJatuhTempo && (
        <span className="text-[10px] font-semibold text-yellow-600">
          Akan Jatuh Tempo
        </span>
      )}

      {sudahJatuhTempo && (
        <span className="text-[10px] font-semibold text-red-600">
          Sudah Jatuh Tempo
        </span>
      )}
    </div>
  );
};

// =====================================================
// STATUS JATUH TEMPO
// =====================================================

const renderJtoStatus = (item) => {
  const daysToDue = getDaysToDue(item);

  if (daysToDue === null) {
    return (
      <span className="text-sm text-gray-400">
        -
      </span>
    );
  }

  const status =
    daysToDue < 0
      ? {
          label: "Sudah JTO",
          icon: FaExclamationCircle,
          className: "bg-red-100 text-red-700",
        }
      : daysToDue <= 7
        ? {
            label: "Akan JTO",
            icon: FaClock,
            className: "bg-yellow-100 text-yellow-700",
          }
        : {
            label: "Belum JTO",
            icon: FaClock,
            className: "bg-blue-100 text-blue-700",
          };

  const StatusIcon = status.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${status.className}`}
    >
      <StatusIcon />
      {status.label}
    </span>
  );
};
// =====================================================
// COMPONENT
// =====================================================

const TableDataPiutang = ({
  navigation,
  location,
  dimensionScreenW,
  check,
  loginAccess,
  reloadData,
  setReloadData,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [tableData, setTableData] =
    useState([]);

  const [expandedRows, setExpandedRows] = useState({});
  const [penjualanDetails, setPenjualanDetails] = useState({});
  const [loadingPenjualanDetails, setLoadingPenjualanDetails] = useState({});

  const [summaryData, setSummaryData] =
    useState({
      total_piutang: 0,
      sudah_dibayar: 0,
      outstanding: 0,

      outstanding_count: 0,
      belum_lunas_count: 0,
      lunas_count: 0,

      akan_jatuh_tempo_amount: 0,
      akan_jatuh_tempo_count: 0,

      sudah_jatuh_tempo_amount: 0,
      sudah_jatuh_tempo_count: 0,

      total_data: 0,
    });

  const [totalData, setTotalData] =
    useState(0);

  const [totalPage, setTotalPage] =
    useState(0);

  const [keyword, setKeyword] =
    useState("");

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [filterCabang, setFilterCabang] =
    useState([]);

  const [filterCustomer, setFilterCustomer] =
    useState([]);

  const [filterChannel, setFilterChannel] =
    useState([]);

  const [filterPrinciple, setFilterPrinciple] =
    useState([]);

  const [filterStartDate, setFilterStartDate] =
    useState("");

  const [filterEndDate, setFilterEndDate] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(10);

  const [loading, setLoading] =
    useState(false);

  const [options, setOptions] =
    useState({
      cabang: [],
      customer: [],
      channel: [],
      principle: [],
    });

  const [selectedData, setSelectedData] =
    useState(null);

  const [showDetail, setShowDetail] =
    useState(false);

  // ===================================================
  // GET REFERENSI
  // ===================================================

  const getReferensi = async () => {
    try {
      const [
        refCabang,
        refChannel,
      ] = await Promise.all([
        storeSchema.actions.getReferensiByJenis(
          "cabang_id"
        ),

        storeSchema.actions.getReferensiByJenis(
          "channel_id"
        ),
      ]);

      // ===============================================
      // CABANG
      // ===============================================

      if (
        refCabang?.status === true
      ) {
        const data = (
          refCabang?.data || []
        ).map((item) => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));

        setOptions((prev) => ({
          ...prev,
          cabang: data,
        }));
      }

      // ===============================================
      // CHANNEL
      // ===============================================

      if (
        refChannel?.status === true
      ) {
        const data = (
          refChannel?.data || []
        ).map((item) => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));

        setOptions((prev) => ({
          ...prev,
          channel: data,
        }));
      }

    } catch (error) {
      console.error(
        "ERROR GET REFERENSI PIUTANG:",
        error
      );
    }
  };

  // ===================================================
  // GET LIST PRINCIPLE
  // ===================================================

  const getListPrinciple = async () => {
    try {
      const res =
        await storeSchema.actions.getListPrinciple({
          page: 1,
          limit: 9999,
          sortBy: "ASC",
        });

      if (
        res?.status === true
      ) {
        const data = (
          res?.data?.list_data || []
        ).map((item) => ({
          label:
            item?.nama_principle,
          value:
            item?.principle,
        }));

        setOptions((prev) => ({
          ...prev,
          principle: data,
        }));
      }

    } catch (error) {
      console.error(
        "ERROR GET LIST PRINCIPLE:",
        error
      );
    }
  };

  // ===================================================
  // LOAD REFERENSI
  // ===================================================

  useEffect(() => {
    getReferensi();
    getListPrinciple();
  }, []);

  // ===================================================
  // GET DATA CUSTOMER BERDASARKAN CABANG
  // Customer aktif setelah cabang dipilih.
  // Dropdown menampilkan kode_customer - name.
  // ===================================================

  useEffect(() => {
    let isMounted = true;

    const getDataCustomer = async () => {
      if (!filterCabang.length) {
        setOptions((prev) => ({
          ...prev,
          customer: [],
        }));
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
          throw new Error(
            res?.message || "Gagal mengambil data customer"
          );
        }

        const responseData = res?.data;
        const listData = Array.isArray(responseData)
          ? responseData
          : responseData?.list_data ||
          responseData?.data ||
          responseData?.rows ||
          [];

        const customerOptions = listData
          .map((item) => {
            const kodeCustomer = item?.kode_customer;
            const namaCustomer = item?.name;

            return {
              label: `${kodeCustomer ?? ""}${namaCustomer ? ` - ${namaCustomer}` : ""}`,
              value: kodeCustomer,
            };
          })
          .filter(
            (item) =>
              item.value !== null &&
              item.value !== undefined &&
              String(item.value).trim() !== ""
          );

        if (isMounted) {
          setOptions((prev) => ({
            ...prev,
            customer: customerOptions,
          }));

          setFilterCustomer((prev) =>
            prev.filter((value) =>
              customerOptions.some(
                (option) => String(option.value) === String(value)
              )
            )
          );
        }
      } catch (error) {
        console.error("ERROR GET DATA CUSTOMER PIUTANG:", error);

        if (isMounted) {
          setOptions((prev) => ({
            ...prev,
            customer: [],
          }));
          setFilterCustomer([]);
          await swal.error(
            error?.message || "Gagal mengambil data customer"
          );
        }
      }
    };

    getDataCustomer();

    return () => {
      isMounted = false;
    };
  }, [filterCabang]);

  // ===================================================
  // GET DATA PIUTANG
  // ===================================================

  const getDataPiutang = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        limit: perPage,

        keyword:
          searchKeyword,

        sales_office: filterCabang.length ? filterCabang : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        customer_group: filterChannel.length ? filterChannel : "ALL",
        principle: filterPrinciple.length ? filterPrinciple : "ALL",
        start_date: filterStartDate,
        end_date: filterEndDate,
      };

      const res =
        await storeSchema.actions.getDataPiutang(
          payload
        );

      if (
        res?.status !== true
      ) {
        throw new Error(
          res?.message ||
          "Gagal mengambil data piutang"
        );
      }

      const responseData =
        res?.data || {};

      const listData =
        responseData?.list_data || [];

      // ===============================================
      // TABLE DATA
      // ===============================================

      setTableData(
        listData.map(
          (item, index) => ({
            ...item,

            No:
              (currentPage - 1) *
              perPage +
              index +
              1,
          })
        )
      );

      // ===============================================
      // PAGINATION
      // ===============================================

      setTotalData(
        Number(
          responseData?.total_data ||
          0
        )
      );

      setTotalPage(
        Number(
          responseData?.total_halaman ||
          0
        )
      );

      // ===============================================
      // SUMMARY
      // ===============================================

      const summary =
        responseData?.summary ||
        {};

      setSummaryData({
        total_piutang:
          firstNumber(
            summary?.total_piutang
          ),

        sudah_dibayar:
          firstNumber(
            summary?.sudah_dibayar,
            summary?.total_dibayar,
            summary?.dibayar
          ),

        outstanding:
          firstNumber(
            summary?.outstanding
          ),

        outstanding_count:
          firstNumber(
            summary?.outstanding_count,
            summary?.count_outstanding
          ),

        not_due:
          firstNumber(
            summary?.not_due,
            summary?.not_due_count
          ),

        not_due_amount:
          firstNumber(
            summary?.not_due_amount
          ),

        overdue:
          firstNumber(
            summary?.overdue,
            summary?.overdue_count
          ),

        overdue_amount:
          firstNumber(
            summary?.overdue_amount
          ),

        belum_lunas_count:
          firstNumber(
            summary?.belum_lunas_count,
            summary?.count_belum_lunas
          ),

        lunas_count:
          firstNumber(
            summary?.lunas_count,
            summary?.count_lunas,
            summary?.paid
          ),

        akan_jatuh_tempo_amount:
          firstNumber(
            summary?.akan_jatuh_tempo_amount,
            summary?.due_soon_amount
          ),

        akan_jatuh_tempo_count:
          firstNumber(
            summary?.akan_jatuh_tempo_count,
            summary?.due_soon
          ),

        sudah_jatuh_tempo_amount:
          firstNumber(
            summary?.sudah_jatuh_tempo_amount,
            summary?.overdue_amount
          ),

        sudah_jatuh_tempo_count:
          firstNumber(
            summary?.sudah_jatuh_tempo_count,
            summary?.overdue
          ),

        total_data:
          firstNumber(
            summary?.total_data,
            responseData?.total_data
          ),
      });

    } catch (error) {
      console.error(
        "ERROR GET DATA PIUTANG:",
        error
      );

      setTableData([]);
      setTotalData(0);
      setTotalPage(0);

      setSummaryData({
        total_piutang: 0,
        sudah_dibayar: 0,
        outstanding: 0,

        outstanding_count: 0,
        belum_lunas_count: 0,
        lunas_count: 0,

        akan_jatuh_tempo_amount: 0,
        akan_jatuh_tempo_count: 0,

        sudah_jatuh_tempo_amount: 0,
        sudah_jatuh_tempo_count: 0,

        total_data: 0,
      });

      await swal.error(
        error?.message ||
        "Gagal mengambil data piutang"
      );

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // SERVER SIDE FILTER + PAGINATION
  // ===================================================

  useEffect(() => {
    getDataPiutang();
  }, [
    currentPage,
    perPage,
    searchKeyword,
    filterCabang,
    filterCustomer,
    filterChannel,
    filterPrinciple,
    filterStartDate,
    filterEndDate,
  ]);

  // ===================================================
  // RELOAD
  // ===================================================

  useEffect(() => {
    if (!reloadData) {
      return;
    }

    if (
      currentPage === 1
    ) {
      getDataPiutang();
    } else {
      setCurrentPage(1);
    }

    if (setReloadData) {
      setReloadData(false);
    }

  }, [reloadData]);

  // ===================================================
  // RESET FILTER
  // ===================================================

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setFilterChannel([]);
    setFilterPrinciple([]);
    setFilterStartDate("");
    setFilterEndDate("");

    setCurrentPage(1);
  };

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {
    setCurrentPage(1);

    if (setReloadData) {
      setReloadData(
        (prev) => !prev
      );
    } else {
      getDataPiutang();
    }
  };

  // ===================================================
  // EXPAND DETAIL PENJUALAN BERDASARKAN NO. BILLING
  // ===================================================

  const handleExpandPenjualan = async (item, rowKey) => {
    if (expandedRows[rowKey]) {
      setExpandedRows((prev) => ({ ...prev, [rowKey]: false }));
      return;
    }

    setExpandedRows((prev) => ({ ...prev, [rowKey]: true }));
    if (Object.prototype.hasOwnProperty.call(penjualanDetails, rowKey)) return;

    const noBilling = item?.no_billing || item?.billing_no;
    if (!noBilling) {
      setPenjualanDetails((prev) => ({ ...prev, [rowKey]: [] }));
      return;
    }

    try {
      setLoadingPenjualanDetails((prev) => ({ ...prev, [rowKey]: true }));
      const res = await storeSchema.actions.getDataPenjualan({
        page: 1,
        limit: 9999,
        keyword: String(noBilling),
      });

      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal mengambil detail data penjualan");
      }

      const responseData = res?.data || {};
      const listData = Array.isArray(responseData)
        ? responseData
        : responseData?.list_data || responseData?.data || responseData?.rows || [];

      const filteredData = listData.filter((detail) => {
        const detailBilling = detail?.billing_no || detail?.no_billing || detail?.["Billing No"];
        return detailBilling === null || detailBilling === undefined || String(detailBilling) === String(noBilling);
      });

      setPenjualanDetails((prev) => ({
        ...prev,
        [rowKey]: filteredData.map(normalizePenjualanDetail),
      }));
    } catch (error) {
      console.error("ERROR GET DETAIL DATA PENJUALAN:", error);
      setPenjualanDetails((prev) => ({ ...prev, [rowKey]: [] }));
      await swal.error(error?.message || "Gagal mengambil detail data penjualan");
    } finally {
      setLoadingPenjualanDetails((prev) => ({ ...prev, [rowKey]: false }));
    }
  };

  // ===================================================
  // DETAIL
  // ===================================================

  /* const handleDetail = (
    item
  ) => {
    setSelectedData(item);
    setShowDetail(true);
  }; */

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedData(null);
  };

  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex =
    totalData > 0
      ? (currentPage - 1) *
      perPage +
      1
      : 0;

  const endIndex =
    Math.min(
      currentPage * perPage,
      totalData
    );

  // ===================================================
  // RENDER
  // ===================================================

  return (
        <div className="flex flex-col gap-5">

      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4">

        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">

          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />

            <input
              type="text"
              placeholder="Cari billing / customer / sales..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={keyword}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
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

        {/* ================================================= */}
        {/* FILTER */}
        {/* ================================================= */}

        <div className="flex flex-wrap items-center gap-3">

          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Cabang
            </label>

            <Select
              isMulti
              options={options?.cabang || []}
              value={getSelectedFilterOptions(options?.cabang || [], filterCabang)}
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

          <div className="w-full min-w-[180px] sm:w-[210px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Channel
            </label>

            <Select
              isMulti
              options={options?.channel || []}
              value={getSelectedFilterOptions(options?.channel || [], filterChannel)}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterChannel((selected || []).map((item) => item.value));
              }}
              placeholder="Semua Channel"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>

          <div className="w-full min-w-[180px] sm:w-[210px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Principle
            </label>

            <Select
              isMulti
              options={options?.principle || []}
              value={getSelectedFilterOptions(options?.principle || [], filterPrinciple)}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterPrinciple((selected || []).map((item) => item.value));
              }}
              placeholder="Semua Principle"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>

          <div className="w-full min-w-[180px] sm:w-[210px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Customer
            </label>

            <Select
              isMulti
              isDisabled={!filterCabang.length}
              options={options?.customer || []}
              value={getSelectedFilterOptions(
                options?.customer || [],
                filterCustomer
              )}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCustomer(
                  (selected || []).map((item) => item.value)
                );
              }}
              placeholder={
                !filterCabang.length
                  ? "Pilih cabang dahulu"
                  : "Semua Customer"
              }
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>

          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Document Date
            </label>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm">
              <FaCalendarAlt className="text-primary text-sm" />

              <input
                type="date"
                value={filterStartDate}
                max={filterEndDate || undefined}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterStartDate(e.target.value);
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
                title="Tanggal mulai"
              />

              <span className="text-gray-300">-</span>

              <input
                type="date"
                value={filterEndDate}
                min={filterStartDate || undefined}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterEndDate(e.target.value);
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
                title="Tanggal akhir"
              />
            </div>
          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        {/* TOTAL PIUTANG */}

        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-blue-700">
                Total Piutang
              </p>

              <p className="text-xl font-bold text-blue-900">
                {formatCompactRupiah(
                  summaryData.total_piutang
                )}
              </p>

              <p className="text-[10px] text-blue-500 mt-1">
                {formatNumber(
                  summaryData.total_data ||
                  totalData
                )}{" "}
                Data
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaFileInvoiceDollar className="text-blue-600" />
            </div>

          </div>

        </div>

        {/* SUDAH DIBAYAR */}

        <div className="rounded-2xl bg-green-50 border border-green-100 p-4">

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-green-700">
                Collections
              </p>

              <p className="text-xl font-bold text-green-900">
                {formatCompactRupiah(
                  summaryData.sudah_dibayar
                )}
              </p>

              <p className="text-[10px] text-green-500 mt-1">
                Total Pembayaran
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-green-600" />
            </div>

          </div>

        </div>

        {/* OUTSTANDING */}

        <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-purple-700">
                Outstanding
              </p>

              <p className="text-xl font-bold text-purple-900">
                {formatCompactRupiah(
                  summaryData.outstanding
                )}
              </p>

              <p className="text-[10px] text-purple-500 mt-1">
                {formatNumber(
                  summaryData.outstanding_count
                )}{" "}
                Data
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <FaMoneyBillWave className="text-purple-600" />
            </div>

          </div>

        </div>

        {/* BELUM JATUH TEMPO */}

        <div className="rounded-2xl bg-green-50 border border-green-100 p-4">

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-green-700">
                Belum Jatuh Tempo
              </p>

              <p className="text-xl font-bold text-green-900">
                {formatCompactRupiah(
                  summaryData.not_due_amount
                )}
              </p>

              <p className="text-[10px] text-green-500 mt-1">
                {formatNumber(
                  summaryData.not_due
                )}{" "}
                Data
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <FaClock className="text-green-600" />
            </div>

          </div>

        </div>

        {/* AKAN JATUH TEMPO */}

        <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4">

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-yellow-700">
                Akan Jatuh Tempo
              </p>

              <p className="text-xl font-bold text-yellow-900">
                {formatCompactRupiah(
                  summaryData.akan_jatuh_tempo_amount
                )}
              </p>

              <p className="text-[10px] text-yellow-600 mt-1">
                {formatNumber(
                  summaryData.akan_jatuh_tempo_count
                )}{" "}
                Data
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
              <FaClock className="text-yellow-600" />
            </div>

          </div>

        </div>

        {/* SUDAH JATUH TEMPO */}

        <div className="rounded-2xl bg-red-50 border border-red-100 p-4">

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-red-700">
                Sudah Jatuh Tempo
              </p>

              <p className="text-xl font-bold text-red-900">
                {formatCompactRupiah(
                  summaryData.overdue_amount
                )}
              </p>

              <p className="text-[10px] text-red-500 mt-1">
                {formatNumber(
                  summaryData.overdue
                )}{" "}
                Data
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
              <FaExclamationCircle className="text-red-600" />
            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div
        className={
          dimensionScreenW < 768 &&
            check
            ? "bringToBack"
            : ""
        }
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="relative overflow-auto rounded-2xl max-h-[65vh]">

            {/* ============================================= */}
            {/* LOADING */}
            {/* ============================================= */}

            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <span className="text-sm text-gray-600">
                    Memuat data piutang...
                  </span>
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* TABLE */}
            {/* ============================================= */}

            <table className="table w-full">
              <thead className="bg-primary text-white sticky top-0 text-[13px] z-10">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Aksi</th>
                  <th className="px-4 py-3 whitespace-nowrap">No. Billing</th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Document Date
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">Document Type</th>
                  <th className="px-4 py-3 whitespace-nowrap">Kode Customer</th>
                  <th className="px-4 py-3 whitespace-nowrap">Nama Customer</th>
                  <th className="px-4 py-3 whitespace-nowrap">Salesman</th>
                  <th className="px-4 py-3 whitespace-nowrap">Nama Sales</th>
                  <th className="px-4 py-3 whitespace-nowrap">Profit Center</th>
                  <th className="px-4 py-3 whitespace-nowrap">Cabang</th>
                  <th className="px-4 py-3 whitespace-nowrap">Lini</th>
                  <th className="px-4 py-3 whitespace-nowrap">TOP</th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Jatuh Tempo
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">DPP</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">PPN</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">PPh</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Total Invoice</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Collection</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Saldo Piutang</th>
                  <th className="px-4 py-3 whitespace-nowrap">Keterangan Outstanding</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Umur Piutang</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Aging Standar</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">
                    {getEndOfCurrentMonthLabel()}
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Aging TOP</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">
                    {getEndOfCurrentMonthLabel()}
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {/* ========================================= */}
                {/* EMPTY DATA */}
                {/* ========================================= */}

                {tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={26}
                      className="text-center py-16 text-gray-500"
                    >
                      <FaFileInvoiceDollar className="text-4xl text-gray-300 mx-auto mb-3" />

                      <p className="font-medium">
                        Tidak ada data piutang
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Silakan ubah filter atau kata pencarian
                      </p>
                    </td>
                  </tr>
                ) : (
                  /* ========================================= */
                  /* DATA */
                  /* ========================================= */

                  tableData.map((item, index) => {
                    const rowKey = `${item?.billing_no || item?.no_billing || "billing"}-${item?.customer || "customer"}-${index}`;
                    const invoiceAmounts = getInvoiceAmounts(item);
                    const keterangan = getPiutangKeterangan(invoiceAmounts);

                    return (
                      <React.Fragment key={rowKey}>
                        <tr className="border-b hover:bg-blue-50 transition duration-200">
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleExpandPenjualan(item, rowKey)}
                              title={
                                expandedRows[rowKey]
                                  ? "Tutup detail penjualan"
                                  : "Lihat detail penjualan"
                              }
                              aria-label={
                                expandedRows[rowKey]
                                  ? "Tutup detail penjualan"
                                  : "Lihat detail penjualan"
                              }
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                                expandedRows[rowKey]
                                  ? "border-blue-200 bg-blue-100 text-blue-700"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                            >
                              {expandedRows[rowKey]
                                ? <FaChevronUp size={12} />
                                : <FaChevronDown size={12} />}
                            </button>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <p className="font-semibold text-gray-700">
                              {displayValue(
                                item?.billing_no ??
                                item?.no_billing
                              )}
                            </p>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaCalendarAlt className="text-gray-400" />
                              {formatDate(
                                item?.document_date ||
                                item?.documentDate ||
                                item?.doc_date ||
                                item?.tanggal_dokumen ||
                                item?.DOCUMENT_DATE ||
                                item?.posting_date
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {displayValue(item?.document_type)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                                <FaBuilding className="text-xs" />
                              </div>

                              <span className="font-semibold text-gray-700 text-sm">
                                {displayValue(item?.customer)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 min-w-[220px]">
                            <p
                              className="font-semibold text-gray-700 text-sm truncate max-w-[240px]"
                              title={String(item?.customer_name || "-")}
                            >
                              {displayValue(item?.customer_name)}
                            </p>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                <FaUser className="text-gray-400 text-xs" />
                              </div>

                              <span className="font-semibold text-gray-700 text-sm">
                                {displayValue(item?.sales)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 min-w-[200px]">
                            <p className="font-semibold text-gray-700 text-sm truncate max-w-[220px]">
                              {displayValue(item?.nama_sales)}
                            </p>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-semibold text-gray-700 text-sm">
                              {displayValue(item?.cabang)}
                            </span>
                          </td>

                          <td className="px-4 py-3 min-w-[180px]">
                            <span className="font-semibold text-gray-700 text-sm">
                              {displayValue(item?.name_cabang || "")}
                            </span>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {displayValue(item?.lini)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {formatTOP(item?.top)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCalendarAlt className="text-primary" />
                              {formatDate(item?.jatuh_tempo)}
                            </div>
                          </td>

                          {/* DPP */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.dpp)}
                            </span>
                          </td>

                          {/* PPN */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.ppn)}
                            </span>
                          </td>

                          {/* PPH */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.pph)}
                            </span>
                          </td>

                          {/* TOTAL INVOICE */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.totalInvoice)}
                            </span>
                          </td>

                          {/* COLLECTION */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className="font-bold text-green-600">
                              {formatRupiah(invoiceAmounts.collection)}
                            </span>
                          </td>

                          {/* SALDO PIUTANG */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span
                              className={`font-bold ${
                                invoiceAmounts.saldoPiutang > 0
                                  ? "text-red-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatRupiah(invoiceAmounts.saldoPiutang)}
                            </span>
                          </td>

                          {/* KETERANGAN */}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {keterangan}
                          </td>

                          {/* AGING */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {Number(item?.aging || 0) <= 0 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                                Current
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  Number(item?.aging || 0) <= 7
                                    ? "bg-yellow-50 text-yellow-600"
                                    : Number(item?.aging || 0) <= 30
                                      ? "bg-orange-50 text-orange-600"
                                      : "bg-red-50 text-red-600"
                                }`}
                              >
                                {formatNumber(item?.aging)} Hari
                              </span>
                            )}
                          </td>

                          {/* AGING STANDAR: JUMLAH HARI */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                              {item?.aging_standar === null ||
                              item?.aging_standar === undefined ||
                              item?.aging_standar === ""
                                ? "-"
                                : `${formatNumber(item.aging_standar)} Hari`}
                            </span>
                          </td>

                          {/* KELOMPOK AGING STANDAR PER AKHIR BULAN */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {item?.ur_aging_standar ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                {item.ur_aging_standar}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>

                          {/* AGING TOP: JUMLAH HARI */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                Number(item?.aging_top) > 0
                                  ? "bg-red-50 text-red-700"
                                  : Number(item?.aging_top) < 0
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {item?.aging_top === null ||
                              item?.aging_top === undefined ||
                              item?.aging_top === ""
                                ? "-"
                                : `${formatNumber(item.aging_top)} Hari`}
                            </span>
                          </td>

                          {/* KELOMPOK AGING TOP PER AKHIR BULAN */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {item?.ur_aging_top ? (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  item.ur_aging_top === "Belum JTO"
                                    ? "bg-green-50 text-green-700"
                                    : item.ur_aging_top === ">360"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-purple-50 text-purple-700"
                                }`}
                              >
                                {item.ur_aging_top}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {renderJtoStatus(item)}
                          </td>
                        </tr>

                        {/* DETAIL DATA PENJUALAN */}
                        {expandedRows[rowKey] && (
                          <tr className="border-b border-blue-100 bg-slate-50">
                            <td colSpan={26} className="p-0">
                              <div className="border-l-4 border-blue-500 px-4 py-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Detail Data Penjualan
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      No. Billing: {displayValue(item?.no_billing || item?.billing_no)}
                                    </p>
                                  </div>

                                  {loadingPenjualanDetails[rowKey] && (
                                    <span className="inline-flex items-center gap-2 text-sm text-blue-600">
                                      <FaSpinner className="animate-spin" />
                                      Memuat detail...
                                    </span>
                                  )}
                                </div>

                                {loadingPenjualanDetails[rowKey] ? (
                                  <div className="py-8 text-center text-sm text-gray-500">
                                    Sedang mengambil data penjualan dari API...
                                  </div>
                                ) : (penjualanDetails[rowKey] || []).length === 0 ? (
                                  <div className="rounded-xl border border-dashed border-gray-300 bg-white py-8 text-center text-sm text-gray-500">
                                    Data penjualan untuk billing ini tidak ditemukan.
                                  </div>
                                ) : (
                                  <div className="overflow-auto rounded-xl border border-gray-200 bg-white max-h-[420px]">
                                    <table className="table table-sm w-full">
                                      <thead className="sticky top-0 z-[1] bg-blue-50 text-gray-700">
                                        <tr>
                                          {penjualanDetailColumns.map((column) => (
                                            <th
                                              key={column.key}
                                              className="whitespace-nowrap px-3 py-2 text-xs"
                                            >
                                              {column.label}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {penjualanDetails[rowKey].map((detail, detailIndex) => (
                                          <tr
                                            key={`${detail?.["Billing No"] || rowKey}-${detail?.Material || detail?.material || detailIndex}-${detailIndex}`}
                                            className="border-b last:border-b-0 hover:bg-blue-50/60"
                                          >
                                            {penjualanDetailColumns.map((column) => {
                                              const totalPenjualan = Number(detail?.["Total Penjualan"] || 0);
                                              const totalCOGS = Number(detail?.["Total COGS"] || 0);
                                              let value = detail?.[column.key];

                                              if (column.key === "Tanggal Jatuh Tempo") {
                                                value = getTanggalJatuhTempoPenjualan(detail);
                                              }

                                              if (column.key === "TOP") {
                                                value = detail?.["TOP"] ?? detail?.top ?? detail?.top_days ?? detail?.term_of_payment;
                                              }

                                              if (column.key === "PPh") {
                                                value = totalPenjualan * 0.015;
                                              }

                                              if (column.key === "Persentase COGS") {
                                                value = totalPenjualan !== 0
                                                  ? (totalCOGS / totalPenjualan) * 100
                                                  : 0;
                                              }

                                              if (column.key === "Margin") {
                                                value = totalPenjualan - totalCOGS;
                                              }

                                              if (column.key === "Persentase Margin") {
                                                value = totalPenjualan !== 0
                                                  ? ((totalPenjualan - totalCOGS) / totalPenjualan) * 100
                                                  : 0;
                                              }

                                              // COLLECTION DETAIL:
                                              // Alokasi proporsional berdasarkan DPP + PPN.
                                              // Sisa pembulatan dialokasikan ke baris terakhir.
                                              if (column.key === "Collection") {
                                                // Ambil Collection dari data utama piutang,
                                                // bukan dari API detail penjualan.
                                                const collectionInduk = firstNumber(
                                                  item?.collection,
                                                  item?.Collection,
                                                  item?.["Collection"],
                                                  item?.dibayar,
                                                  item?.sudah_dibayar,
                                                  item?.total_dibayar
                                                );

                                                value = getDetailCollection(
                                                  penjualanDetails[rowKey],
                                                  collectionInduk,
                                                  detailIndex
                                                );
                                              }

                                              return (
                                                <td
                                                  key={column.key}
                                                  className="whitespace-nowrap px-3 py-2 text-xs text-gray-700"
                                                >
                                                  {column.type === "currency"
                                                    ? formatRupiah(value)
                                                    : column.type === "number"
                                                      ? formatNumber(value)
                                                      : column.type === "percent"
                                                        ? `${formatNumber(value)}%`
                                                        : column.type === "date"
                                                          ? formatDate(value)
                                                          : column.type === "top"
                                                            ? formatTOP(value)
                                                            : displayValue(value)}
                                                </td>
                                              );
                                            })}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
                    {/* ================================================= */}
          {/* FOOTER / PAGINATION */}
          {/* ================================================= */}

          <div className="border-t border-gray-100 bg-slate-50 py-4 px-5">

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

              {/* ============================================= */}
              {/* INFO */}
              {/* ============================================= */}

              <div className="flex items-center gap-5 flex-wrap">

                <div className="text-sm text-gray-600">

                  Showing{" "}

                  <span className="font-semibold">
                    {startIndex}
                  </span>{" "}

                  to{" "}

                  <span className="font-semibold">
                    {endIndex}
                  </span>{" "}

                  of{" "}

                  <span className="font-semibold">
                    {totalData}
                  </span>{" "}

                  entries

                </div>

                {/* =========================================== */}
                {/* ROWS */}
                {/* =========================================== */}

                <div className="flex items-center gap-2">

                  <span className="text-sm text-gray-600">
                    Rows:
                  </span>

                  <select
                    className="select select-bordered select-sm rounded-full bg-white"
                    value={perPage}
                    onChange={(e) => {
                      setCurrentPage(1);

                      setPerPage(
                        parseInt(
                          e.target.value,
                          10
                        )
                      );
                    }}
                  >

                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>

                  </select>

                </div>

              </div>

              {/* ============================================= */}
              {/* PAGINATION */}
              {/* ============================================= */}

              {totalPage > 0 && (

                <ReactPaginate
                  breakLabel="..."
                  previousLabel="←"
                  nextLabel="→"

                  pageCount={totalPage}

                  onPageChange={(e) =>
                    setCurrentPage(
                      e.selected + 1
                    )
                  }

                  forcePage={Math.min(
                    currentPage - 1,
                    Math.max(
                      totalPage - 1,
                      0
                    )
                  )}

                  className="flex items-center gap-2"

                  activeClassName="!bg-primary !text-white !border-primary"

                  pageClassName="min-w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center bg-white hover:bg-blue-50 transition"

                  pageLinkClassName="w-full h-full flex items-center justify-center"

                  previousClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white"

                  nextClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white"

                  previousLinkClassName="w-full h-full flex items-center justify-center"

                  nextLinkClassName="w-full h-full flex items-center justify-center"

                  breakClassName="px-2 text-gray-500"

                  disabledClassName="opacity-50 cursor-not-allowed"
                />

              )}

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* DETAIL MODAL */}
      {/* ================================================= */}

      {showDetail &&
        selectedData && (

          <div
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeDetail}
          >

            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* =========================================== */}
              {/* MODAL HEADER */}
              {/* =========================================== */}

              <div className="bg-primary px-6 py-4 text-white sticky top-0 z-20">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <FaFileInvoiceDollar />
                    </div>

                    <div>

                      <h3 className="font-bold text-lg">
                        Detail Piutang
                      </h3>

                      <p className="text-xs text-blue-100">
                        No. Billing:{" "}
                        {displayValue(
                          selectedData?.billing_no
                        )}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={closeDetail}
                    className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center"
                  >
                    <FaTimes />
                  </button>

                </div>

              </div>

              {/* =========================================== */}
              {/* MODAL CONTENT */}
              {/* =========================================== */}

              <div className="p-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* BILLING */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      No. Billing
                    </p>

                    <p className="font-semibold text-gray-700 break-words">
                      {displayValue(
                        selectedData?.billing_no
                      )}
                    </p>

                  </div>

                  {/* CUSTOMER */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      Customer
                    </p>

                    <p className="font-semibold text-gray-700 break-words">
                      {displayValue(
                        selectedData?.name_bill_to
                      )}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {displayValue(
                        selectedData?.bill_to_party
                      )}
                    </p>

                  </div>

                  {/* SALES */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      Sales
                    </p>

                    <p className="font-semibold text-gray-700 break-words">
                      {displayValue(
                        selectedData?.name_salesman
                      )}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {displayValue(
                        selectedData?.salesman
                      )}
                    </p>

                  </div>

                  {/* SALES OFFICE */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      Sales Office
                    </p>

                    <p className="font-semibold text-gray-700 break-words">
                      {displayValue(
                        selectedData?.desc_s_office
                      )}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {displayValue(
                        selectedData?.sales_office
                      )}
                    </p>

                  </div>

                  {/* CHANNEL */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      Channel
                    </p>

                    <p className="font-semibold text-gray-700 break-words">
                      {displayValue(
                        selectedData?.desc_cust_grp4
                      )}
                    </p>

                  </div>

                  {/* PRINCIPLE */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      Principle
                    </p>

                    <p className="font-semibold text-gray-700 break-words">
                      {displayValue(
                        selectedData?.name_principle
                      )}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {displayValue(
                        selectedData?.principle
                      )}
                    </p>

                  </div>

                  {/* TANGGAL FAKTUR */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      Tanggal Faktur
                    </p>

                    <p className="font-semibold text-gray-700">
                      {formatDate(
                        selectedData?.posting_date
                      )}
                    </p>

                  </div>

                  {/* JATUH TEMPO */}

                  <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Jatuh Tempo
                    </p>

                    <p className="font-semibold text-yellow-700">
                      {formatDate(
                        selectedData?.jatuh_tempo
                      )}
                    </p>

                    {getDaysToDue(
                      selectedData
                    ) !== null && (

                      <p className="text-xs mt-1">

                        {getDaysToDue(
                          selectedData
                        ) > 0 ? (

                          <span className="text-yellow-600">
                            {getDaysToDue(
                              selectedData
                            )}{" "}
                            hari lagi
                          </span>

                        ) : getDaysToDue(
                          selectedData
                        ) === 0 ? (

                          <span className="text-red-600 font-semibold">
                            Jatuh tempo hari ini
                          </span>

                        ) : (

                          <span className="text-red-600">
                            Terlambat{" "}
                            {Math.abs(
                              getDaysToDue(
                                selectedData
                              )
                            )}{" "}
                            hari
                          </span>

                        )}

                      </p>

                    )}

                  </div>

                  {/* TOTAL PIUTANG */}

                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Total Piutang
                    </p>

                    <p className="text-lg font-bold text-blue-700">
                      {formatRupiah(
                        selectedData?.total_piutang
                      )}
                    </p>

                  </div>

                  {/* DIBAYAR */}

                  <div className="rounded-xl bg-green-50 border border-green-100 p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Dibayar
                    </p>

                    <p className="text-lg font-bold text-green-600">
                      {formatRupiah(
                        selectedData?.dibayar ??
                        selectedData?.sudah_dibayar
                      )}
                    </p>

                  </div>

                  {/* OUTSTANDING */}

                  <div className="rounded-xl bg-red-50 border border-red-100 p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Outstanding
                    </p>

                    <p className="text-lg font-bold text-red-600">
                      {formatRupiah(
                        selectedData?.outstanding
                      )}
                    </p>

                  </div>

                  {/* AGING */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

                    <p className="text-xs text-gray-400 mb-1">
                      Aging
                    </p>

                    <p className="text-lg font-bold text-gray-700">
                      {formatNumber(
                        selectedData?.aging
                      )}{" "}
                      Hari
                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 sm:col-span-2 lg:col-span-2">

                    <p className="text-xs text-gray-400 mb-2">
                      Status Pembayaran
                    </p>

                    {renderStatus(
                      selectedData
                    )}

                  </div>

                </div>

                {/* ========================================= */}
                {/* INFO AKAN JATUH TEMPO */}
                {/* ========================================= */}

                {isAkanJatuhTempo(
                  selectedData
                ) && (

                  <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-100">

                    <div className="flex items-start gap-3">

                      <FaClock className="text-yellow-600 mt-0.5" />

                      <div>

                        <p className="text-xs font-semibold text-yellow-700">
                          Akan Jatuh Tempo
                        </p>

                        <p className="text-xs text-yellow-600 mt-1">
                          Piutang ini akan jatuh tempo dalam{" "}

                          <strong>
                            {getDaysToDue(
                              selectedData
                            )}{" "}
                            hari
                          </strong>.
                        </p>

                        <p className="text-[11px] text-yellow-600 mt-1">
                          Jatuh tempo dihitung{" "}
                          <strong>
                            7 hari setelah tanggal faktur
                          </strong>.
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* ========================================= */}
                {/* INFO SUDAH JATUH TEMPO */}
                {/* ========================================= */}

                {isSudahJatuhTempo(
                  selectedData
                ) && (

                  <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">

                    <div className="flex items-start gap-3">

                      <FaExclamationCircle className="text-red-600 mt-0.5" />

                      <div>

                        <p className="text-xs font-semibold text-red-700">
                          Sudah Jatuh Tempo
                        </p>

                        <p className="text-xs text-red-600 mt-1">
                          Piutang ini sudah melewati tanggal jatuh tempo.
                        </p>

                        <p className="text-[11px] text-red-600 mt-1">
                          Jatuh tempo dihitung{" "}
                          <strong>
                            7 hari setelah tanggal faktur
                          </strong>.
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>

              {/* =========================================== */}
              {/* MODAL FOOTER */}
              {/* =========================================== */}

              <div className="border-t bg-gray-50 px-5 py-4 flex justify-end sticky bottom-0">

                <button
                  type="button"
                  onClick={closeDetail}
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90"
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

export default TableDataPiutang;