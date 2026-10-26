import React, {
  useEffect,
  useState,
} from "react";

import {
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
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
  FaPlus,
  FaCheckDouble,
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
  "Document Date":
    item?.document_date ||
    item?.documentDate ||
    item?.doc_date ||
    item?.tanggal_dokumen ||
    item?.DOCUMENT_DATE ||
    item?.posting_date,
  "Posting Date":
    item?.posting_date ||
    item?.postingDate ||
    item?.tanggal_posting,
  "Billing No": item?.billing_no || item?.no_billing,
  "TOP":
    item?.["TOP"] ??
    item?.top ??
    item?.top_days ??
    item?.term_of_payment,
  "Tanggal Jatuh Tempo":
    item?.tanggal_jatuh_tempo ||
    item?.jatuh_tempo,
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
  "Total Penjualan":
    item?.total_penjualan ??
    item?.total_penjualan_neto ??
    item?.dpp,
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
  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: 36,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50,
  }),
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

const addDaysToDate = (dateValue, days) => {
  if (
    !dateValue ||
    days === null ||
    days === undefined ||
    days === ""
  ) {
    return null;
  }

  const rawDate = String(dateValue).trim();
  const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);

  const date = match
    ? new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    )
    : new Date(dateValue);

  const parsedDays = Number(
    String(days)
      .match(/-?\d+(?:[.,]\d+)?/)?.[0]
      ?.replace(",", ".")
  );

  if (
    Number.isNaN(date.getTime()) ||
    !Number.isFinite(parsedDays)
  ) {
    return null;
  }

  date.setDate(date.getDate() + parsedDays);
  return date;
};

const getTanggalJatuhTempoPenjualan = (item) => {
  const postingDate =
    item?.["Posting Date"] ||
    item?.posting_date ||
    item?.postingDate ||
    item?.tanggal_posting;

  const top =
    item?.TOP ??
    item?.top ??
    item?.top_days ??
    item?.term_of_payment;

  return addDaysToDate(postingDate, top);
};

const formatTOP = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const parsed = String(value).match(/-?\d+(?:[.,]\d+)?/);

  return parsed
    ? `${formatNumber(Number(parsed[0].replace(",", ".")))} Hari`
    : value;
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
// =====================================================

const getCalculatedDueDate = (item) => {
  if (item?.jatuh_tempo) {
    return normalizeDate(item.jatuh_tempo);
  }

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
// =====================================================

const getPiutangStatus = (item) => {
  const { collection, saldoPiutang } = getInvoiceAmounts(item);
  const outstanding = saldoPiutang;

  if (outstanding <= 0) {
    return "LUNAS";
  }

  if (collection <= 0) {
    return "OUTSTANDING";
  }

  return "BELUM_LUNAS";
};

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

const renderStatus = (item) => {
  const status = getPiutangStatus(item);
  const akanJatuhTempo = isAkanJatuhTempo(item);
  const sudahJatuhTempo = isSudahJatuhTempo(item);

  if (status === "LUNAS") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 whitespace-nowrap">
          <FaCheckCircle />
          Sudah Lunas
        </span>
      </div>
    );
  }

  if (status === "BELUM_LUNAS") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 whitespace-nowrap">
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

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 whitespace-nowrap">
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

const renderJtoStatus = (item) => {
  const daysToDue = getDaysToDue(item);

  if (daysToDue === null) {
    return <span className="text-sm text-gray-400">-</span>;
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${status.className}`}
    >
      <StatusIcon />
      {status.label}
    </span>
  );
};

// =====================================================
// COMPONENT
// =====================================================

const TableKreasiFaktur = ({
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

  const [tableData, setTableData] = useState([]);

  const [expandedRows, setExpandedRows] = useState({});
  const [penjualanDetails, setPenjualanDetails] = useState({});
  const [loadingPenjualanDetails, setLoadingPenjualanDetails] =
    useState({});

  const [summaryData, setSummaryData] = useState({
    belum_diterima: 0,
    sudah_diterima: 0,
    total_data: 0,
  });

  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [filterCabang, setFilterCabang] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [filterChannel, setFilterChannel] = useState([]);
  const [filterPrinciple, setFilterPrinciple] = useState([]);
  const [filterStatusTerimaFaktur, setFilterStatusTerimaFaktur] =
    useState("");

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState({
    cabang: [],
    customer: [],
    channel: [],
    principle: [],
  });

  const [selectedData, setSelectedData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [showTerimaFaktur, setShowTerimaFaktur] = useState(false);
  const [selectedFaktur, setSelectedFaktur] = useState(null);
  const [statusTerimaFaktur, setStatusTerimaFaktur] =
    useState("DITERIMA");
  const [loadingTerimaFaktur, setLoadingTerimaFaktur] =
    useState(false);
  const [selectedFakturIds, setSelectedFakturIds] = useState([]);
  const [catatanTerimaFaktur, setCatatanTerimaFaktur] = useState("");

  // ===================================================
  // GET REFERENSI
  // ===================================================

  const getReferensi = async () => {
    try {
      const [refCabang, refChannel] = await Promise.all([
        storeSchema.actions.getReferensiByJenis("cabang_id"),
        storeSchema.actions.getReferensiByJenis("channel_id"),
      ]);

      if (refCabang?.status === true) {
        const data = (refCabang?.data || []).map((item) => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));

        setOptions((prev) => ({
          ...prev,
          cabang: data,
        }));
      }

      if (refChannel?.status === true) {
        const data = (refChannel?.data || []).map((item) => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));

        setOptions((prev) => ({
          ...prev,
          channel: data,
        }));
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI PIUTANG:", error);
    }
  };

  // ===================================================
  // GET LIST PRINCIPLE
  // ===================================================

  const getListPrinciple = async () => {
    try {
      const res = await storeSchema.actions.getListPrinciple({
        page: 1,
        limit: 9999,
        sortBy: "ASC",
      });

      if (res?.status === true) {
        const data = (res?.data?.list_data || []).map((item) => ({
          label: item?.nama_principle,
          value: item?.principle,
        }));

        setOptions((prev) => ({
          ...prev,
          principle: data,
        }));
      }
    } catch (error) {
      console.error("ERROR GET LIST PRINCIPLE:", error);
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
              label: `${kodeCustomer ?? ""}${namaCustomer ? ` - ${namaCustomer}` : ""
                }`,
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
                (option) =>
                  String(option.value) === String(value)
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
  // GET DATA KREASI FAKTUR
  // ===================================================

  const getDataPiutang = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        sales_office: filterCabang.length ? filterCabang : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        customer_group: filterChannel.length ? filterChannel : "ALL",
        principle: filterPrinciple.length ? filterPrinciple : "ALL",
        status_terima_faktur: filterStatusTerimaFaktur || "ALL",
        start_date: filterStartDate,
        end_date: filterEndDate,
      };

      const res = await storeSchema.actions.getDataKreasiFaktur(payload);

      if (res?.status !== true) {
        throw new Error(
          res?.message || "Gagal mengambil data piutang"
        );
      }

      const responseData = res?.data || {};
      const listData = responseData?.list_data || [];

      setTableData(
        listData.map((item, index) => ({
          ...item,
          No: (currentPage - 1) * perPage + index + 1,
        }))
      );

      setTotalData(Number(responseData?.total_data || 0));
      setTotalPage(Number(responseData?.total_halaman || 0));

      const summary = responseData?.summary || {};

      setSummaryData({
        belum_diterima: firstNumber(
          summary?.belum_diterima,
          summary?.belum_diterima_count,
          summary?.count_belum_diterima,
          summary?.total_belum_diterima
        ),
        sudah_diterima: firstNumber(
          summary?.sudah_diterima,
          summary?.sudah_diterima_count,
          summary?.count_sudah_diterima,
          summary?.total_sudah_diterima
        ),
        total_data: firstNumber(
          summary?.total_data,
          responseData?.total_data
        ),
      });
    } catch (error) {
      console.error("ERROR GET DATA PIUTANG:", error);

      setTableData([]);
      setTotalData(0);
      setTotalPage(0);

      setSummaryData({
        belum_diterima: 0,
        sudah_diterima: 0,
        total_data: 0,
      });

      await swal.error(
        error?.message || "Gagal mengambil data piutang"
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
    filterStatusTerimaFaktur,
    filterStartDate,
    filterEndDate,
  ]);

  // ===================================================
  // RELOAD
  // ===================================================

  useEffect(() => {
    if (!reloadData) return;

    if (currentPage === 1) {
      getDataPiutang();
    } else {
      setCurrentPage(1);
    }

    if (setReloadData) {
      setReloadData(false);
    }
  }, [reloadData]);

  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };

  // ===================================================
  // RESET FILTER
  // ===================================================

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setFilterChannel([]);
    setFilterPrinciple([]);
    setFilterStatusTerimaFaktur("");
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
      setReloadData((prev) => !prev);
    } else {
      getDataPiutang();
    }
  };

  // ===================================================
  // EXPAND DETAIL PENJUALAN
  // ===================================================

  const handleExpandPenjualan = async (item, rowKey) => {
    if (expandedRows[rowKey]) {
      setExpandedRows((prev) => ({
        ...prev,
        [rowKey]: false,
      }));
      return;
    }

    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: true,
    }));

    if (
      Object.prototype.hasOwnProperty.call(
        penjualanDetails,
        rowKey
      )
    ) {
      return;
    }

    const noBilling = item?.no_billing || item?.billing_no;

    if (!noBilling) {
      setPenjualanDetails((prev) => ({
        ...prev,
        [rowKey]: [],
      }));
      return;
    }

    try {
      setLoadingPenjualanDetails((prev) => ({
        ...prev,
        [rowKey]: true,
      }));

      const res = await storeSchema.actions.getDataPenjualan({
        page: 1,
        limit: 9999,
        keyword: String(noBilling),
      });

      if (res?.status !== true) {
        throw new Error(
          res?.message || "Gagal mengambil detail data penjualan"
        );
      }

      const responseData = res?.data || {};

      const listData = Array.isArray(responseData)
        ? responseData
        : responseData?.list_data ||
        responseData?.data ||
        responseData?.rows ||
        [];

      const filteredData = listData.filter((detail) => {
        const detailBilling =
          detail?.billing_no ||
          detail?.no_billing ||
          detail?.["Billing No"];

        return (
          detailBilling === null ||
          detailBilling === undefined ||
          String(detailBilling) === String(noBilling)
        );
      });

      setPenjualanDetails((prev) => ({
        ...prev,
        [rowKey]: filteredData.map(normalizePenjualanDetail),
      }));
    } catch (error) {
      console.error("ERROR GET DETAIL DATA PENJUALAN:", error);

      setPenjualanDetails((prev) => ({
        ...prev,
        [rowKey]: [],
      }));

      await swal.error(
        error?.message || "Gagal mengambil detail data penjualan"
      );
    } finally {
      setLoadingPenjualanDetails((prev) => ({
        ...prev,
        [rowKey]: false,
      }));
    }
  };
  // ===================================================
  // DETAIL
  // ===================================================

  /* const handleDetail = (item) => {
    setSelectedData(item);
    setShowDetail(true);
  }; */

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedData(null);
  };

  // ===================================================
  // KREASI FAKTUR - MODAL KONFIRMASI PENERIMAAN
  // ===================================================

  const getBillingKey = (item) =>
    String(item?.billing_no || item?.no_billing || "");

  const openTerimaFaktur = (item) => {
    setSelectedFaktur([item]);

    setStatusTerimaFaktur(
      item?.status_terima_faktur ||
      item?.status_penerimaan_faktur ||
      "DITERIMA"
    );

    setCatatanTerimaFaktur(
      item?.catatan_penerimaan_faktur ||
      item?.catatan ||
      ""
    );

    setShowTerimaFaktur(true);
  };

  const openBulkTerimaFaktur = () => {
    const rows = tableData.filter((item) =>
      selectedFakturIds.includes(getBillingKey(item))
    );

    if (!rows.length) return;

    setSelectedFaktur(rows);
    setStatusTerimaFaktur("DITERIMA");
    setCatatanTerimaFaktur("");
    setShowTerimaFaktur(true);
  };

  const closeTerimaFaktur = () => {
    if (loadingTerimaFaktur) return;

    setShowTerimaFaktur(false);
    setSelectedFaktur(null);
    setCatatanTerimaFaktur("");
  };

  const handleSelectFaktur = (item) => {
    const key = getBillingKey(item);

    if (!key) return;

    setSelectedFakturIds((prev) =>
      prev.includes(key)
        ? prev.filter((id) => id !== key)
        : [...prev, key]
    );
  };

  const handleSelectAllFaktur = () => {
    const currentKeys = tableData
      .map(getBillingKey)
      .filter(Boolean);

    const allSelected =
      currentKeys.length > 0 &&
      currentKeys.every((key) =>
        selectedFakturIds.includes(key)
      );

    setSelectedFakturIds((prev) =>
      allSelected
        ? prev.filter((id) => !currentKeys.includes(id))
        : [...new Set([...prev, ...currentKeys])]
    );
  };


  const handleTerimaFaktur = async () => {
    const fakturList = Array.isArray(selectedFaktur)
      ? selectedFaktur
      : selectedFaktur
        ? [selectedFaktur]
        : [];

    if (!fakturList.length) return;

    if (
      statusTerimaFaktur === "BELUM_DITERIMA" &&
      !catatanTerimaFaktur.trim()
    ) {
      await swal.error(
        "Catatan wajib diisi jika faktur belum diterima."
      );
      return;
    }

    try {
      setLoadingTerimaFaktur(true);

      for (const faktur of fakturList) {
        const billingNo =
          faktur?.billing_no || faktur?.no_billing;

        if (!billingNo) {
          throw new Error("Nomor billing tidak ditemukan.");
        }

        if (!faktur?.piutang_id) {
          throw new Error(
            `piutang_id tidak ditemukan untuk billing ${billingNo}.`
          );
        }

        const payload = {
          piutang_id: faktur.piutang_id,
          billing_no: billingNo,
          no_billing: billingNo,
          customer: faktur?.customer,
          customer_name:
            faktur?.customer_name || faktur?.name_bill_to,
          status_terima_faktur: statusTerimaFaktur,
          diterima: statusTerimaFaktur === "DITERIMA",
          catatan:
            statusTerimaFaktur === "BELUM_DITERIMA"
              ? catatanTerimaFaktur.trim()
              : "",
        };

        const response =
          await storeSchema.actions.terimaFaktur(payload);

        if (response?.status !== true) {
          throw new Error(
            response?.message ||
            `Gagal menyimpan status faktur ${billingNo}.`
          );
        }
      }

      await swal.custom(
        "Berhasil",
        `${fakturList.length} faktur berhasil diperbarui.`,
        "success"
      );

      setSelectedFakturIds((prev) =>
        prev.filter(
          (id) =>
            !fakturList.some(
              (item) => getBillingKey(item) === id
            )
        )
      );

      setShowTerimaFaktur(false);
      setSelectedFaktur(null);
      setCatatanTerimaFaktur("");
      handleRefresh();
    } catch (error) {
      console.error("ERROR TERIMA FAKTUR:", error);

      await swal.error(
        error?.message ||
        "Gagal menyimpan status penerimaan faktur."
      );
    } finally {
      setLoadingTerimaFaktur(false);
    }
  };


  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex =
    totalData > 0
      ? (currentPage - 1) * perPage + 1
      : 0;

  const endIndex = Math.min(
    currentPage * perPage,
    totalData
  );

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex flex-col gap-5">
      {/* SEARCH + FILTER */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex h-12 w-full items-center rounded-full border border-gray-300 bg-white px-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 lg:w-[460px]">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />

            <input
              type="text"
              placeholder="Cari billing / customer / sales..."
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
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <FaFilter />
              Reset Filter
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Cabang
            </label>
            <Select
              isMulti
              options={options?.cabang || []}
              value={getSelectedFilterOptions(
                options?.cabang || [],
                filterCabang
              )}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCabang(
                  (selected || []).map((item) => item.value)
                );
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
              value={getSelectedFilterOptions(
                options?.channel || [],
                filterChannel
              )}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterChannel(
                  (selected || []).map((item) => item.value)
                );
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
              value={getSelectedFilterOptions(
                options?.principle || [],
                filterPrinciple
              )}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterPrinciple(
                  (selected || []).map((item) => item.value)
                );
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

          <div className="w-full min-w-[190px] sm:w-[210px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Status Penerimaan
            </label>
            <Select
              isClearable
              options={[
                {
                  label: "Belum Diterima",
                  value: "BELUM_DITERIMA",
                },
                {
                  label: "Sudah Diterima",
                  value: "DITERIMA",
                },
              ]}
              value={[
                {
                  label: "Belum Diterima",
                  value: "BELUM_DITERIMA",
                },
                {
                  label: "Sudah Diterima",
                  value: "DITERIMA",
                },
              ].find(
                (option) =>
                  option.value === filterStatusTerimaFaktur
              ) || null}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterStatusTerimaFaktur(
                  selected?.value || ""
                );
              }}
              placeholder="Semua Status"
              styles={filterSelectStyles}
            />
          </div>

          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Document Date
            </label>

            <div className="flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 shadow-sm">
              <FaCalendarAlt className="text-sm text-primary" />

              <input
                type="date"
                value={filterStartDate}
                max={filterEndDate || undefined}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterStartDate(e.target.value);
                }}
                className="h-full w-[125px] bg-transparent text-sm text-gray-600 outline-none"
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
                className="h-full w-[125px] bg-transparent text-sm text-gray-600 outline-none"
                title="Tanggal akhir"
              />
            </div>
          </div>
        </div>
      </div>
      {/* SUMMARY PENERIMAAN FAKTUR */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-orange-700">
                Belum Diterima
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-900">
                {formatNumber(summaryData.belum_diterima)}
              </p>
              <p className="mt-1 text-xs text-orange-600">
                Faktur Belum Diterima
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <FaClock className="text-xl text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-green-700">
                Sudah Diterima
              </p>
              <p className="mt-1 text-2xl font-bold text-green-900">
                {formatNumber(summaryData.sudah_diterima)}
              </p>
              <p className="mt-1 text-xs text-green-600">
                Faktur Diterima
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <FaCheckCircle className="text-xl text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE ACTION */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          {selectedFakturIds.length > 0 ? (
            <span>
              <strong className="text-primary">
                {selectedFakturIds.length}
              </strong>{" "}
              faktur dipilih
            </span>
          ) : (
            "Pilih faktur untuk melakukan penerimaan sekaligus."
          )}
        </div>

        <button
          type="button"
          onClick={openBulkTerimaFaktur}
          disabled={selectedFakturIds.length === 0 || loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
        >
          <FaCheckDouble />
          Terima Faktur Sekaligus

          {selectedFakturIds.length > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {selectedFakturIds.length}
            </span>
          )}
        </button>
      </div>

      <div
        className={
          dimensionScreenW < 768 && check
            ? "bringToBack"
            : ""
        }
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="relative max-h-[65vh] overflow-auto rounded-2xl">
            {/* LOADING */}
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <span className="text-sm text-gray-600">
                    Memuat data Kreasi Faktur...
                  </span>
                </div>
              </div>
            )}

            <table className="table w-full">
              <thead className="sticky top-0 z-10 bg-primary text-[13px] text-white">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        aria-label="Pilih semua faktur di halaman ini"
                        checked={
                          tableData.length > 0 &&
                          tableData.every((item) =>
                            selectedFakturIds.includes(
                              getBillingKey(item)
                            )
                          )
                        }
                        onChange={handleSelectAllFaktur}
                        className="h-4 w-4 cursor-pointer accent-white"
                      />
                      <span>Aksi</span>
                    </div>
                  </th>


                  <th className="whitespace-nowrap px-4 py-3">
                    Status Penerimaan
                  </th>

                  <th className="whitespace-nowrap px-4 py-3">
                    Catatan Belum Diterima
                  </th>

                  <th className="whitespace-nowrap px-4 py-3">
                    No. Billing
                  </th>

                  <th className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Document Date
                    </div>
                  </th>

                  <th className="whitespace-nowrap px-4 py-3">
                    Document Type
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Kode Customer
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Nama Customer
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Salesman
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Nama Sales
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Profit Center
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Cabang
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Lini
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    TOP
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Jatuh Tempo
                    </div>
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    DPP
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    PPN
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    PPh
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    Total Invoice
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    Collection
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    Saldo Piutang
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">
                    Keterangan Outstanding
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-center">
                    Umur Piutang
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={24}
                      className="py-16 text-center text-gray-500"
                    >
                      <FaFileInvoiceDollar className="mx-auto mb-3 text-4xl text-gray-300" />

                      <p className="font-medium">
                        Tidak ada data Kreasi Faktur
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Silakan ubah filter atau kata pencarian
                      </p>
                    </td>
                  </tr>
                ) : (
                  tableData.map((item, index) => {
                    const rowKey = `${item?.billing_no ||
                      item?.no_billing ||
                      "billing"
                      }-${item?.customer || "customer"}-${index}`;

                    const invoiceAmounts = getInvoiceAmounts(item);
                    const keterangan =
                      getPiutangKeterangan(invoiceAmounts);

                    return (
                      <React.Fragment key={rowKey}>
                        <tr className="border-b transition duration-200 hover:bg-blue-50">
                          <td className="px-3 py-3">
                            <div className="flex min-w-[150px] items-center justify-center gap-2 whitespace-nowrap">
                              <input
                                type="checkbox"
                                aria-label={`Pilih faktur ${getBillingKey(item)}`}
                                checked={selectedFakturIds.includes(
                                  getBillingKey(item)
                                )}
                                disabled={Number(item?.diterima) === 1}
                                onChange={() =>
                                  handleSelectFaktur(item)
                                }
                                className="checkbox checkbox-primary checkbox-sm"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleExpandPenjualan(item, rowKey)
                                }
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
                                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${expandedRows[rowKey]
                                  ? "border-blue-200 bg-blue-100 text-blue-700"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                  }`}
                              >
                                {expandedRows[rowKey] ? (
                                  <FaChevronUp size={12} />
                                ) : (
                                  <FaChevronDown size={12} />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => openTerimaFaktur(item)}
                                className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-white hover:opacity-90"
                                title="Buat / konfirmasi penerimaan faktur"
                                disabled={Number(item?.diterima) === 1}
                              >
                                <FaCheckCircle size={10} />
                                Konfirm
                              </button>
                            </div>
                          </td>

                          {/* STATUS PENERIMAAN FAKTUR */}
                          <td className="whitespace-nowrap px-4 py-3">
                            {Number(item?.diterima) === 1 ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                                <FaCheckCircle />
                                Sudah Diterima
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700">
                                <FaClock />
                                Belum Diterima
                              </span>
                            )}
                          </td>

                          {/* CATATAN BELUM DITERIMA */}
                          <td className="min-w-[220px] px-4 py-3">
                            {Number(item?.diterima) === 0 &&
                              (item?.catatan_belum_diterima || item?.keterangan) ? (
                              <p
                                className="max-w-[300px] whitespace-normal text-sm text-gray-600"
                                title={
                                  item?.catatan_belum_diterima || item?.keterangan
                                }
                              >
                                {item?.catatan_belum_diterima || item?.keterangan}
                              </p>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>

                          {/* NO BILLING */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <p className="font-semibold text-gray-700">
                              {displayValue(
                                item?.billing_no ?? item?.no_billing
                              )}
                            </p>
                          </td>

                          {/* DOCUMENT DATE */}
                          <td className="whitespace-nowrap px-4 py-3">
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

                          {/* DOCUMENT TYPE */}
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            {displayValue(item?.document_type)}
                          </td>

                          {/* KODE CUSTOMER */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
                                <FaBuilding className="text-xs" />
                              </div>

                              <span className="text-sm font-semibold text-gray-700">
                                {displayValue(item?.customer)}
                              </span>
                            </div>
                          </td>

                          {/* NAMA CUSTOMER */}
                          <td className="min-w-[220px] px-4 py-3">
                            <p
                              className="max-w-[240px] truncate text-sm font-semibold text-gray-700"
                              title={String(item?.customer_name || "-")}
                            >
                              {displayValue(item?.customer_name)}
                            </p>
                          </td>

                          {/* KODE SALES */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                <FaUser className="text-xs text-gray-400" />
                              </div>

                              <span className="text-sm font-semibold text-gray-700">
                                {displayValue(item?.sales)}
                              </span>
                            </div>
                          </td>

                          {/* NAMA SALES */}
                          <td className="min-w-[200px] px-4 py-3">
                            <p className="max-w-[220px] truncate text-sm font-semibold text-gray-700">
                              {displayValue(item?.nama_sales)}
                            </p>
                          </td>

                          {/* PROFIT CENTER */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className="text-sm font-semibold text-gray-700">
                              {displayValue(item?.cabang)}
                            </span>
                          </td>

                          {/* CABANG */}
                          <td className="min-w-[180px] px-4 py-3">
                            <span className="text-sm font-semibold text-gray-700">
                              {displayValue(item?.name_cabang || "")}
                            </span>
                          </td>

                          {/* LINI */}
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                            {displayValue(item?.lini)}
                          </td>

                          {/* TOP */}
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                            {formatTOP(item?.top)}
                          </td>

                          {/* JATUH TEMPO */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCalendarAlt className="text-primary" />
                              {formatDate(item?.jatuh_tempo)}
                            </div>
                          </td>

                          {/* DPP */}
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.dpp)}
                            </span>
                          </td>

                          {/* PPN */}
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.ppn)}
                            </span>
                          </td>

                          {/* PPH */}
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.pph)}
                            </span>
                          </td>

                          {/* TOTAL INVOICE */}
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <span className="font-bold text-gray-700">
                              {formatRupiah(invoiceAmounts.totalInvoice)}
                            </span>
                          </td>

                          {/* COLLECTION */}
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <span className="font-bold text-green-600">
                              {formatRupiah(invoiceAmounts.collection)}
                            </span>
                          </td>

                          {/* SALDO PIUTANG */}
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <span
                              className={`font-bold ${invoiceAmounts.saldoPiutang > 0
                                ? "text-red-600"
                                : "text-gray-500"
                                }`}
                            >
                              {formatRupiah(invoiceAmounts.saldoPiutang)}
                            </span>
                          </td>

                          {/* KETERANGAN */}
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                            {keterangan}
                          </td>

                          {/* AGING */}
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            {Number(item?.aging || 0) <= 0 ? (
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                                Current
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${Number(item?.aging || 0) <= 7
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

                          {/* STATUS JTO */}
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            {renderJtoStatus(item)}
                          </td>
                        </tr>

                        {/* DETAIL PENJUALAN */}
                        {expandedRows[rowKey] && (
                          <tr className="border-b border-blue-100 bg-slate-50">
                            <td colSpan={24} className="p-0">
                              <div className="border-l-4 border-blue-500 px-4 py-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Detail Data Penjualan
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      No. Billing:{" "}
                                      {displayValue(
                                        item?.no_billing ||
                                        item?.billing_no
                                      )}
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
                                ) : (penjualanDetails[rowKey] || []).length ===
                                  0 ? (
                                  <div className="rounded-xl border border-dashed border-gray-300 bg-white py-8 text-center text-sm text-gray-500">
                                    Data penjualan untuk billing ini tidak ditemukan.
                                  </div>
                                ) : (
                                  <div className="max-h-[420px] overflow-auto rounded-xl border border-gray-200 bg-white">
                                    <table className="table table-sm w-full">
                                      <thead className="sticky top-0 z-[1] bg-blue-50 text-gray-700">
                                        <tr>
                                          {penjualanDetailColumns.map(
                                            (column) => (
                                              <th
                                                key={column.key}
                                                className="whitespace-nowrap px-3 py-2 text-xs"
                                              >
                                                {column.label}
                                              </th>
                                            )
                                          )}
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {penjualanDetails[rowKey].map(
                                          (detail, detailIndex) => (
                                            <tr
                                              key={`${detail?.["Billing No"] ||
                                                rowKey
                                                }-${detail?.Material ||
                                                detail?.material ||
                                                detailIndex
                                                }-${detailIndex}`}
                                              className="border-b last:border-b-0 hover:bg-blue-50/60"
                                            >
                                              {penjualanDetailColumns.map(
                                                (column) => {
                                                  const totalPenjualan =
                                                    Number(
                                                      detail?.[
                                                      "Total Penjualan"
                                                      ] || 0
                                                    );

                                                  const totalCOGS =
                                                    Number(
                                                      detail?.["Total COGS"] ||
                                                      0
                                                    );

                                                  let value =
                                                    detail?.[column.key];

                                                  if (
                                                    column.key ===
                                                    "Tanggal Jatuh Tempo"
                                                  ) {
                                                    value =
                                                      getTanggalJatuhTempoPenjualan(
                                                        detail
                                                      );
                                                  }

                                                  if (column.key === "TOP") {
                                                    value =
                                                      detail?.["TOP"] ??
                                                      detail?.top ??
                                                      detail?.top_days ??
                                                      detail?.term_of_payment;
                                                  }

                                                  if (column.key === "PPh") {
                                                    value =
                                                      totalPenjualan * 0.015;
                                                  }

                                                  if (
                                                    column.key ===
                                                    "Persentase COGS"
                                                  ) {
                                                    value =
                                                      totalPenjualan !== 0
                                                        ? (totalCOGS /
                                                          totalPenjualan) *
                                                        100
                                                        : 0;
                                                  }

                                                  if (
                                                    column.key === "Margin"
                                                  ) {
                                                    value =
                                                      totalPenjualan -
                                                      totalCOGS;
                                                  }

                                                  if (
                                                    column.key ===
                                                    "Persentase Margin"
                                                  ) {
                                                    value =
                                                      totalPenjualan !== 0
                                                        ? ((totalPenjualan -
                                                          totalCOGS) /
                                                          totalPenjualan) *
                                                        100
                                                        : 0;
                                                  }

                                                  return (
                                                    <td
                                                      key={column.key}
                                                      className="whitespace-nowrap px-3 py-2 text-xs text-gray-700"
                                                    >
                                                      {column.type ===
                                                        "currency"
                                                        ? formatRupiah(value)
                                                        : column.type ===
                                                          "number"
                                                          ? formatNumber(value)
                                                          : column.type ===
                                                            "percent"
                                                            ? `${formatNumber(
                                                              value
                                                            )}%`
                                                            : column.type ===
                                                              "date"
                                                              ? formatDate(value)
                                                              : column.type ===
                                                                "top"
                                                                ? formatTOP(value)
                                                                : displayValue(
                                                                  value
                                                                )}
                                                    </td>
                                                  );
                                                }
                                              )}
                                            </tr>
                                          )
                                        )}
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
          {/* FOOTER / PAGINATION */}
          <div className="border-t border-gray-100 bg-slate-50 px-5 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* INFO */}
              <div className="flex flex-wrap items-center gap-5">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">{startIndex}</span>{" "}
                  to{" "}
                  <span className="font-semibold">{endIndex}</span>{" "}
                  of{" "}
                  <span className="font-semibold">{totalData}</span>{" "}
                  entries
                </div>

                {/* ROWS */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Rows:
                  </span>

                  <select
                    className="select select-bordered select-sm rounded-full bg-white"
                    value={perPage}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setPerPage(parseInt(e.target.value, 10));
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>

              {/* PAGINATION */}
              {totalPage > 0 && (
                <ReactPaginate
                  breakLabel="..."
                  previousLabel="←"
                  nextLabel="→"
                  pageCount={totalPage}
                  forcePage={Math.min(
                    Math.max(currentPage - 1, 0),
                    Math.max(totalPage - 1, 0)
                  )}
                  onPageChange={(selectedItem) => {
                    setCurrentPage(selectedItem.selected + 1);
                  }}
                  containerClassName="flex flex-wrap items-center justify-center gap-2"
                  pageClassName="rounded-full border border-gray-200 bg-white text-sm text-gray-600 transition-colors"
                  pageLinkClassName="flex h-9 min-w-9 items-center justify-center rounded-full px-3"
                  activeClassName="!border-primary !bg-primary !text-white"
                  previousClassName="rounded-full border border-gray-200 bg-white text-sm text-gray-600 transition-colors"
                  previousLinkClassName="flex h-9 items-center justify-center rounded-full px-3"
                  nextClassName="rounded-full border border-gray-200 bg-white text-sm text-gray-600 transition-colors"
                  nextLinkClassName="flex h-9 items-center justify-center rounded-full px-3"
                  breakClassName="px-2 text-gray-400"
                  disabledClassName="cursor-not-allowed opacity-40"
                  renderOnZeroPageCount={null}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* MODAL DETAIL */}
      {showDetail && selectedData && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-20 bg-primary px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <FaFileInvoiceDollar />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      Detail Kreasi Faktur
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
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    No. Billing
                  </p>
                  <p className="break-words font-semibold text-gray-700">
                    {displayValue(selectedData?.billing_no)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Customer
                  </p>
                  <p className="break-words font-semibold text-gray-700">
                    {displayValue(selectedData?.name_bill_to)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {displayValue(selectedData?.bill_to_party)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Sales
                  </p>
                  <p className="break-words font-semibold text-gray-700">
                    {displayValue(selectedData?.name_salesman)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {displayValue(selectedData?.salesman)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Sales Office
                  </p>
                  <p className="break-words font-semibold text-gray-700">
                    {displayValue(selectedData?.desc_s_office)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {displayValue(selectedData?.sales_office)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Channel
                  </p>
                  <p className="break-words font-semibold text-gray-700">
                    {displayValue(selectedData?.desc_cust_grp4)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Principle
                  </p>
                  <p className="break-words font-semibold text-gray-700">
                    {displayValue(selectedData?.name_principle)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {displayValue(selectedData?.principle)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Tanggal Faktur
                  </p>
                  <p className="font-semibold text-gray-700">
                    {formatDate(selectedData?.posting_date)}
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Jatuh Tempo
                  </p>
                  <p className="font-semibold text-yellow-700">
                    {formatDate(selectedData?.jatuh_tempo)}
                  </p>

                  {getDaysToDue(selectedData) !== null && (
                    <p className="mt-1 text-xs">
                      {getDaysToDue(selectedData) > 0 ? (
                        <span className="text-yellow-600">
                          {getDaysToDue(selectedData)} hari lagi
                        </span>
                      ) : getDaysToDue(selectedData) === 0 ? (
                        <span className="font-semibold text-red-600">
                          Jatuh tempo hari ini
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Terlambat{" "}
                          {Math.abs(getDaysToDue(selectedData))} hari
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Total Piutang
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    {formatRupiah(selectedData?.total_piutang)}
                  </p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Dibayar
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatRupiah(
                      selectedData?.dibayar ??
                      selectedData?.sudah_dibayar
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="mb-1 text-xs text-gray-500">
                    Outstanding
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatRupiah(selectedData?.outstanding)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-1 text-xs text-gray-400">
                    Aging
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {formatNumber(selectedData?.aging)} Hari
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:col-span-2 lg:col-span-2">
                  <p className="mb-2 text-xs text-gray-400">
                    Status Pembayaran
                  </p>
                  {renderStatus(selectedData)}
                </div>
              </div>

              {/* INFO AKAN JATUH TEMPO */}
              {isAkanJatuhTempo(selectedData) && (
                <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <div className="flex items-start gap-3">
                    <FaClock className="mt-0.5 text-yellow-600" />

                    <div>
                      <p className="text-xs font-semibold text-yellow-700">
                        Akan Jatuh Tempo
                      </p>

                      <p className="mt-1 text-xs text-yellow-600">
                        Piutang ini akan jatuh tempo dalam{" "}
                        <strong>
                          {getDaysToDue(selectedData)} hari
                        </strong>.
                      </p>

                      <p className="mt-1 text-[11px] text-yellow-600">
                        Jatuh tempo dihitung{" "}
                        <strong>
                          7 hari setelah tanggal faktur
                        </strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* INFO SUDAH JATUH TEMPO */}
              {isSudahJatuhTempo(selectedData) && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <FaExclamationCircle className="mt-0.5 text-red-600" />

                    <div>
                      <p className="text-xs font-semibold text-red-700">
                        Sudah Jatuh Tempo
                      </p>

                      <p className="mt-1 text-xs text-red-600">
                        Piutang ini sudah melewati tanggal jatuh tempo.
                      </p>

                      <p className="mt-1 text-[11px] text-red-600">
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

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 flex justify-end border-t bg-gray-50 px-5 py-4">
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL BUAT / TERIMA FAKTUR */}
      {showTerimaFaktur && selectedFaktur && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={closeTerimaFaktur}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between bg-primary px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <FaFileInvoiceDollar />
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    {selectedFaktur.length > 1
                      ? "Konfirmasi Penerimaan Faktur Massal"
                      : "Konfirmasi Penerimaan Faktur"}
                  </h3>

                  <p className="text-xs text-blue-100">
                    Kreasi Faktur
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeTerimaFaktur}
                disabled={loadingTerimaFaktur}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            {/* CONTENT */}
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-6">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                {selectedFaktur.length > 1 ? (
                  <>
                    <p className="mb-1 text-xs text-gray-500">
                      Jumlah Faktur Dipilih
                    </p>

                    <p className="font-semibold text-gray-800">
                      {selectedFaktur.length} faktur
                    </p>

                    <div className="mt-3 max-h-28 space-y-1 overflow-y-auto">
                      {selectedFaktur.map((item) => (
                        <p
                          key={getBillingKey(item)}
                          className="text-sm text-gray-700"
                        >
                          • {getBillingKey(item)} —{" "}
                          {displayValue(
                            item?.customer_name ||
                            item?.customer ||
                            item?.name_bill_to
                          )}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-1 text-xs text-gray-500">
                      No. Billing
                    </p>

                    <p className="font-semibold text-gray-800">
                      {displayValue(
                        selectedFaktur?.[0]?.billing_no ||
                        selectedFaktur?.[0]?.no_billing
                      )}
                    </p>

                    <p className="mb-1 mt-4 text-xs text-gray-500">
                      Customer
                    </p>

                    <p className="font-semibold text-gray-800">
                      {displayValue(
                        selectedFaktur?.[0]?.customer_name ||
                        selectedFaktur?.[0]?.customer ||
                        selectedFaktur?.[0]?.name_bill_to
                      )}
                    </p>
                  </>
                )}
              </div>

              {/* PILIH STATUS PENERIMAAN */}
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Apakah faktur sudah diterima?
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* FAKTUR DITERIMA */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${statusTerimaFaktur === "DITERIMA"
                      ? "border-green-300 bg-green-50 ring-1 ring-green-200"
                      : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="statusTerimaFaktur"
                      value="DITERIMA"
                      checked={statusTerimaFaktur === "DITERIMA"}
                      onChange={(event) =>
                        setStatusTerimaFaktur(event.target.value)
                      }
                      disabled={loadingTerimaFaktur}
                      className="radio radio-success radio-sm"
                    />

                    <div>
                      <p className="font-semibold text-green-700">
                        Sudah diterima
                      </p>

                      <p className="text-xs text-gray-500">
                        Faktur Diterima
                      </p>
                    </div>
                  </label>

                  {/* FAKTUR BELUM DITERIMA */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${statusTerimaFaktur === "BELUM_DITERIMA"
                      ? "border-orange-300 bg-orange-50 ring-1 ring-orange-200"
                      : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="statusTerimaFaktur"
                      value="BELUM_DITERIMA"
                      checked={
                        statusTerimaFaktur === "BELUM_DITERIMA"
                      }
                      onChange={(event) =>
                        setStatusTerimaFaktur(event.target.value)
                      }
                      disabled={loadingTerimaFaktur}
                      className="radio radio-warning radio-sm"
                    />

                    <div>
                      <p className="font-semibold text-orange-700">
                        Belum diterima
                      </p>

                      <p className="text-xs text-gray-500">
                        Faktur Belum Diterima
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* CATATAN JIKA BELUM DITERIMA */}
              {statusTerimaFaktur === "BELUM_DITERIMA" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Catatan <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    rows={3}
                    value={catatanTerimaFaktur}
                    onChange={(event) =>
                      setCatatanTerimaFaktur(event.target.value)
                    }
                    disabled={loadingTerimaFaktur}
                    placeholder="Tuliskan alasan atau catatan faktur belum diterima..."
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-gray-100"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Catatan wajib diisi jika status faktur belum diterima.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeTerimaFaktur}
                  disabled={loadingTerimaFaktur}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleTerimaFaktur}
                  disabled={loadingTerimaFaktur}
                  className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingTerimaFaktur ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Simpan Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableKreasiFaktur;