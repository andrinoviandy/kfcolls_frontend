import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaEllipsisV,
  FaHashtag,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
  FaBox,
  FaClipboardList,
  FaEye,
  FaTimes,
  FaSearch,
  FaFilter,
  FaFileInvoiceDollar,
  FaChartLine,
  FaWarehouse,
  FaTag,
  FaPercentage,
} from "react-icons/fa";

import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";

import { swal } from "global/helper/swal";
import storeSchema from "global/store";

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
// DUMMY DATA - DIAMBIL DARI Data Penjualann.xlsx
// 100 baris x 60 kolom
// =====================================================

// =====================================================
// DATA TAMBAHAN - TOP & TANGGAL JATUH TEMPO
// =====================================================
// TOP belum tersedia di data dummy sumber.
// Untuk kebutuhan tampilan, setiap transaksi menggunakan TOP 30 hari.
// Jika nanti TOP berasal dari API/Excel, cukup ganti nilai "TOP"
// pada masing-masing item dan Tanggal Jatuh Tempo akan otomatis dihitung.

// =====================================================
// HELPER
// =====================================================

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(Number(value));
};

const formatRupiah = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
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

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const addDaysToDate = (dateValue, days) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  date.setDate(date.getDate() + Number(days || 0));

  return date.toISOString().split("T")[0];
};

const getTanggalJatuhTempo = (item) => {
  if (!item) return null;

  return addDaysToDate(
    item["Posting Date"],
    item["TOP"]
  );
};

const formatTOP = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${Number(value)} Hari`;
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
};

// =====================================================
// STATUS
// =====================================================

const renderPostingStatus = (status) => {
  const statusMap = {
    C: {
      label: "Posted",
      className: "bg-green-100 text-green-700",
    },
    D: {
      label: "Draft",
      className: "bg-yellow-100 text-yellow-700",
    },
    X: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700",
    },
  };

  const current = statusMap[status] || {
    label: status || "-",
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1.5
        rounded-full
        text-xs
        font-semibold
        whitespace-nowrap
        ${current.className}
      `}
    >
      {current.label}
    </span>
  );
};

// =====================================================
// KOLOM UTAMA
// =====================================================

const mainColumns = [
  /* {
    key: "No",
    label: "No",
    icon: <FaHashtag />,
    type: "number",
  }, */
  {
    key: "Sales Office",
    label: "Profit Center",
    icon: <FaBuilding />,
    type: "plainNumber",
  },
  {
    key: "Desc. S.Office",
    label: "Profit Center Desc",
    icon: <FaBuilding />,
  },
  {
    key: "Document Date",
    label: "Document Date",
    icon: <FaCalendarAlt />,
    type: "date",
  },
  {
    key: "TOP",
    label: "TOP",
    icon: <FaCalendarAlt />,
    type: "top",
  },
  {
    key: "Tanggal Jatuh Tempo",
    label: "Tanggal Jatuh Tempo",
    icon: <FaCalendarAlt />,
    type: "dueDate",
  },
  {
    key: "Billing No",
    label: "Billing No",
    icon: <FaFileInvoiceDollar />,
    type: "plainNumber",
  },
  /* {
    key: "Posting Status",
    label: "Status",
    icon: <FaClipboardList />,
    type: "status",
  }, */
  /* {
    key: "Bill.Cancel",
    label: "Bill Cancel",
    icon: <FaTimes />,
  }, */
  {
    key: "Bill to party",
    label: "Bill to Party",
    icon: <FaBuilding />,
    type: "plainNumber",
  },
  {
    key: "Name Bill to",
    label: "Customer",
    icon: <FaBuilding />,
  },
  /* {
    key: "Address",
    label: "Address",
    icon: <FaBuilding />,
  }, */
  {
    key: "Material",
    label: "Material",
    icon: <FaBox />,
    type: "plainNumber",
  },
  {
    key: "Text Material",
    label: "Text Material",
    icon: <FaBox />,
  },
  {
    key: "Material Group 1",
    label: "Material Group",
    icon: <FaTag />,
    type: "number",
  },
  {
    key: "Desc Material Group 1",
    label: "Desc. Material Group",
    icon: <FaTag />,
  },
  {
    key: "Quantity",
    label: "Quantity",
    icon: <FaChartLine />,
    type: "number",
  },
  {
    key: "Sales Unit",
    label: "Sales Unit",
    icon: <FaBox />,
  },
  {
    key: "Unit Price Penjualan",
    label: "Harga Jual",
    icon: <FaMoneyBillWave />,
    type: "currency",
  },
  {
    key: "Total Discount",
    label: "Total Discount",
    icon: <FaPercentage />,
    type: "currency",
  },
  {
    key: "Total Penjualan",
    label: "DPP",
    icon: <FaMoneyBillWave />,
    type: "currency",
  },
  {
    key: "Tax Amount",
    label: "PPN",
    icon: <FaMoneyBillWave />,
    type: "currency",
  },
  {
    key: "PPh",
    label: "PPh",
    icon: <FaMoneyBillWave />,
    type: "calculatedPph",
  },
  {
    key: "Total COGS",
    label: "Total COGS",
    icon: <FaMoneyBillWave />,
    type: "currency",
  },
  {
    key: "Persentase COGS",
    label: "Persentase COGS",
    icon: <FaPercentage />,
    type: "calculatedPercentCOGS",
  },
  {
    key: "Margin",
    label: "Margin",
    icon: <FaMoneyBillWave />,
    type: "calculatedMargin",
  },
  {
    key: "Persentase Margin",
    label: "Persentase Margin",
    icon: <FaPercentage />,
    type: "calculatedPercentMargin",
  },
  {
    key: "Principle",
    label: "Principle",
    icon: <FaBuilding />,
    type: "plainNumber",
  },
  {
    key: "Name Principle",
    label: "Nama Principle",
    icon: <FaBuilding />,
  },
  {
    key: "Desc. Cust. Grp4",
    label: "Customer Group",
    icon: <FaBuilding />,
  },
  {
    key: "Salesman",
    label: "Salesman",
    icon: <FaUser />,
    type: "plainNumber",
  },
  {
    key: "Name Salesman",
    label: "Nama Salesman",
    icon: <FaUser />,
  },
  {
    key: "PO Number",
    label: "PO Number",
    icon: <FaFileInvoiceDollar />,
  },
  {
    key: "Quotation Number",
    label: "Quotation Number",
    icon: <FaFileInvoiceDollar />,
    type: "plainNumber",
  },
];

// =====================================================
// DETAIL - SELURUH KOLOM EXCEL
// =====================================================

const detailGroups = [
  {
    title: "Informasi Billing",
    fields: [
      ["No", "No", "number"],
      ["Sales Office", "Sales Office", "plainNumber"],
      ["Desc. S.Office", "Desc. S.Office"],
      ["Posting Date", "Posting Date", "date"],
      ["TOP", "TOP", "top"],
      ["Tanggal Jatuh Tempo", "Tanggal Jatuh Tempo", "dueDate"],
      ["Billing No", "Billing No", "plainNumber"],
      ["Posting Status", "Posting Status"],
      ["Bill.Cancel", "Bill.Cancel"],
    ],
  },
  {
    title: "Customer",
    fields: [
      ["Bill to party", "Bill to party", "plainNumber"],
      ["Name Bill to", "Name Bill to"],
      ["Address", "Address"],
    ],
  },
  {
    title: "Material & Penjualan",
    fields: [
      ["Material", "Material", "plainNumber"],
      ["Material Group 1", "Material Group 1", "number"],
      ["Desc Material Group 1", "Desc Material Group 1"],
      ["Text Material", "Text Material"],
      ["Quantity", "Quantity", "number"],
      ["Sales Unit", "Sales Unit"],
      ["Unit Price Penjualan", "Unit Price Penjualan", "currency"],
    ],
  },
  {
    title: "Discount ZD01 - ZD06",
    fields: [
      ["Dis% (ZD01)", "Dis% (ZD01)", "percent"],
      ["DisAmt (ZD01)", "DisAmt (ZD01)", "currency"],
      ["Dis% (ZD02)", "Dis% (ZD02)", "percent"],
      ["DisAmt (ZD02)", "DisAmt (ZD02)", "currency"],
      ["Dis% (ZD03)", "Dis% (ZD03)", "percent"],
      ["DisAmt (ZD03)", "DisAmt (ZD03)", "currency"],
      ["Dis% (ZD04)", "Dis% (ZD04)", "percent"],
      ["DisAmt (ZD04)", "DisAmt (ZD04)", "currency"],
      ["Dis% (ZD05)", "Dis% (ZD05)", "percent"],
      ["DisAmt (ZD05)", "DisAmt (ZD05)", "currency"],
      ["Dis% (ZD06)", "Dis% (ZD06)", "percent"],
      ["DisAmt (ZD06)", "DisAmt (ZD06)", "currency"],
    ],
  },
  {
    title: "Discount Upfront ZD07 - ZD10",
    fields: [
      ["Disc. Upfront % (ZD07)", "Disc. Upfront % (ZD07)", "percent"],
      ["Disc. Upfront Amt (ZD07)", "Disc. Upfront Amt (ZD07)", "currency"],
      ["Disc. Beban KFTD Upf % (ZD08)", "Disc. Beban KFTD Upf % (ZD08)", "percent"],
      ["Disc. Beban KFTD Upf Amt (ZD08)", "Disc. Beban KFTD Upf Amt (ZD08)", "currency"],
      ["Disc. Beban Principle Upf % (ZD09)", "Disc. Beban Principle Upf % (ZD09)", "percent"],
      ["Disc. Beban Principle Upf Amt (ZD09)", "Disc. Beban Principle Upf Amt (ZD09)", "currency"],
      ["Disc. Pengembalian Upf % (ZD10)", "Disc. Pengembalian Upf % (ZD10)", "percent"],
      ["Disc. Pengembalian Upf Amt (ZD10)", "Disc. Pengembalian Upf Amt (ZD10)", "currency"],
    ],
  },
  {
    title: "Discount ZD12 - ZD15",
    fields: [
      ["Dis% (ZD12)", "Dis% (ZD12)", "percent"],
      ["DisAmt (ZD12)", "DisAmt (ZD12)", "currency"],
      ["Dis% (ZD14)", "Dis% (ZD14)", "percent"],
      ["DisAmt (ZD14)", "DisAmt (ZD14)", "currency"],
      ["Dis% (ZD15)", "Dis% (ZD15)", "percent"],
      ["DisAmt (ZD15)", "DisAmt (ZD15)", "currency"],
      ["Total Discount", "Total Discount", "currency"],
    ],
  },
  {
    title: "Nilai Transaksi",
    fields: [
      ["Total Penjualan", "Total Penjualan", "currency"],
      ["Tax Amount", "Tax Amount", "currency"],
      ["Total COGS", "Total COGS", "currency"],
      ["Persentase COGS", "Persentase COGS", "calculatedPercentCOGS"],
      ["Margin", "Margin", "calculatedMargin"],
      ["Persentase Margin", "Persentase Margin", "calculatedPercentMargin"],
      ["Unit Price Pembelian", "Unit Price Pembelian", "currency"],
      ["Bill Qty in SKU", "Bill Qty in SKU", "number"],
      ["UoM SKU", "UoM SKU"],
    ],
  },
  {
    title: "Pelayanan & Produk",
    fields: [
      ["Code Pelayanan", "Code Pelayanan", "number"],
      ["Dec. Pelayanan", "Dec. Pelayanan"],
      ["Prod. Hierarchy3", "Prod. Hierarchy3"],
      ["Principle", "Principle", "plainNumber"],
      ["Name Principle", "Name Principle"],
      ["Desc. Cust. Grp4", "Desc. Cust. Grp4"],
    ],
  },
  {
    title: "Sales & Referensi",
    fields: [
      ["Salesman", "Salesman", "plainNumber"],
      ["Name Salesman", "Name Salesman"],
      ["PO Number", "PO Number"],
      ["Quotation Number", "Quotation Number", "plainNumber"],
    ],
  },
];

// =====================================================
// CALCULATION - COGS & MARGIN
// =====================================================

const getCalculatedValue = (item, key) => {
  const totalPenjualan = Number(item?.["Total Penjualan"] || 0);
  const totalCOGS = Number(item?.["Total COGS"] || 0);

  if (key === "Persentase COGS") {
    return totalPenjualan !== 0
      ? (totalCOGS / totalPenjualan) * 100
      : 0;
  }

  if (key === "PPh") {
    return totalPenjualan * 0.015;
  }

  if (key === "Margin") {
    return totalPenjualan - totalCOGS;
  }

  if (key === "Persentase Margin") {
    const margin = totalPenjualan - totalCOGS;
    return totalPenjualan !== 0
      ? (margin / totalPenjualan) * 100
      : 0;
  }

  return 0;
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0%";
  }

  return `${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))}%`;
};

// =====================================================
// FORMAT DETAIL
// =====================================================

const formatFieldValue = (value, type, item = null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (type === "date") {
    return formatDate(value);
  }

  if (type === "top") {
    return formatTOP(value);
  }

  if (type === "dueDate") {
    return formatDate(
      item ? getTanggalJatuhTempo(item) : value
    );
  }

  if (type === "currency") {
    return formatRupiah(value);
  }

  if (type === "plainNumber") {
    return String(value);
  }

  if (type === "percent") {
    return formatPercent(value);
  }

  if (type === "calculatedPercentCOGS") {
    return formatPercent(getCalculatedValue(item, "Persentase COGS"));
  }

  if (type === "calculatedMargin") {
    return formatRupiah(getCalculatedValue(item, "Margin"));
  }

  if (type === "calculatedPercentMargin") {
    return formatPercent(getCalculatedValue(item, "Persentase Margin"));
  }

  if (type === "number") {
    return formatNumber(value);
  }

  return value;
};

// =====================================================
// COMPONENT
// =====================================================

const TableMasterFaktur = ({
  dimensionScreenW,
  check,
  loginAccess,
  reloadData,
  setReloadData,
}) => {
  const [tableData, setTableData] = useState([]);
  const [options, setOptions] = useState({});
  const [summaryData, setSummaryData] = useState({
    total_transaksi: 0,
    total_billing: 0,
    total_customer: 0,
    total_quantity: 0,
    total_penjualan: 0,
    total_tax: 0,
    total_cogs: 0,
    total_margin: 0,
    total_discount: 0,
  });

  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterSalesOffice, setFilterSalesOffice] = useState([]);
  const [filterCustomerGroup, setFilterCustomerGroup] = useState([]);
  const [filterPrinciple, setFilterPrinciple] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // ===================================================
  // GET REFERENSI CABANG / SALES OFFICE
  // ===================================================

  const getListPrinciple = async () => {
    try {
      const res = await storeSchema.actions.getListPrinciple({
        page: 1,
        limit: 9999,
        sortBy: 'ASC'
      });
      if (res?.status === true) {
        const data = (res?.data?.list_data || []).map((item) => ({
          label: item?.nama_principle,
          value: item?.principle,
        }));

        setOptions((prev) => ({ ...prev, principle: data }));
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI CABANG:", error);
    }
  };

  useEffect(() => {
    const getReferensi = async () => {
      const refCabang = await storeSchema.actions.getReferensiByJenis("cabang_id");
      if (refCabang?.status === true) {
        const data = (refCabang?.data || []).map((item) => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));

        setOptions((prev) => ({ ...prev, cabang: data }))
      }
      const refChannel = await storeSchema.actions.getReferensiByJenis("channel_id");
      if (refChannel?.status === true) {
        const data = (refChannel?.data || []).map((item) => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));

        setOptions((prev) => ({ ...prev, channel: data }))
      }
    }
    getReferensi();
    getListPrinciple();
  }, []);

  // ===================================================
  // NORMALIZE RESPONSE BACKEND -> FORMAT TABLE
  // ===================================================

  const normalizePenjualanItem = (item, index) => ({
    ...item,
    "No": ((currentPage - 1) * perPage) + index + 1,
    "Sales Office": item?.sales_office,
    "Desc. S.Office": item?.desc_s_office,
    "Document Date":
      item?.document_date ||
      item?.documentDate ||
      item?.doc_date ||
      item?.tanggal_dokumen ||
      item?.DOCUMENT_DATE ||
      item?.posting_date,
    "Posting Date": item?.posting_date,
    "Billing No": item?.billing_no,
    "Posting Status": item?.posting_status,
    "Bill.Cancel": item?.bill_cancel,
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
    "Total Penjualan": item?.total_penjualan,
    "Tax Amount": item?.tax_amount,
    "Total COGS": item?.total_cogs,
    "Unit Price Pembelian": item?.unit_price_pembelian,
    "Bill Qty in SKU": item?.bill_qty_in_sku,
    "UoM SKU": item?.uom_sku,
    "Code Pelayanan": item?.code_pelayanan,
    "Dec. Pelayanan": item?.dec_pelayanan,
    "Prod. Hierarchy3": item?.prod_hierarchy3,
    "Principle": item?.principle,
    "Name Principle": item?.name_principle,
    "Desc. Cust. Grp4": item?.desc_cust_grp4,
    "Salesman": item?.salesman,
    "Name Salesman": item?.name_salesman,
    "PO Number": item?.po_number,
    "Quotation Number": item?.quotation_number,
  });

  // ===================================================
  // GET DATA PENJUALAN
  // ===================================================

  const getDataPenjualan = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        sales_office: filterSalesOffice.length ? filterSalesOffice : "ALL",
        customer_group: filterCustomerGroup.length ? filterCustomerGroup : "ALL",
        principle: filterPrinciple.length ? filterPrinciple : "ALL",
        start_date: filterStartDate,
        end_date: filterEndDate,
      };

      const res = await storeSchema.actions.getDataPenjualan(payload);

      if (res?.status !== true) {
        throw new Error(
          res?.message || "Gagal mengambil data penjualan"
        );
      }

      const responseData = res?.data || {};
      const listData = responseData?.list_data || [];

      setTableData(
        listData.map((item, index) =>
          normalizePenjualanItem(item, index)
        )
      );

      setTotalData(Number(responseData?.total_data || 0));
      setTotalPage(Number(responseData?.total_halaman || 0));

      setSummaryData({
        total_transaksi: Number(
          responseData?.summary?.total_transaksi ||
          responseData?.total_data ||
          0
        ),
        total_billing: Number(
          responseData?.summary?.total_billing || 0
        ),
        total_customer: Number(
          responseData?.summary?.total_customer || 0
        ),
        total_quantity: Number(
          responseData?.summary?.total_quantity || 0
        ),
        total_penjualan: Number(
          responseData?.summary?.total_penjualan || 0
        ),
        total_tax: Number(
          responseData?.summary?.total_tax || 0
        ),
        total_cogs: Number(
          responseData?.summary?.total_cogs || 0
        ),
        total_margin: Number(
          responseData?.summary?.total_margin || 0
        ),
        total_discount: Number(
          responseData?.summary?.total_discount || 0
        ),
      });
    } catch (error) {
      console.error("ERROR GET DATA PENJUALAN:", error);

      setTableData([]);
      setTotalData(0);
      setTotalPage(0);
      setSummaryData({
        total_transaksi: 0,
        total_billing: 0,
        total_customer: 0,
        total_quantity: 0,
        total_penjualan: 0,
        total_tax: 0,
        total_cogs: 0,
        total_margin: 0,
        total_discount: 0,
      });

      await swal.error(
        error?.message ||
        "Gagal mengambil data penjualan"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD + SERVER SIDE FILTER/PAGING
  // ===================================================

  useEffect(() => {
    getDataPenjualan();
  }, [
    currentPage,
    perPage,
    searchKeyword,
    filterSalesOffice,
    filterCustomerGroup,
    filterPrinciple,
    filterStartDate,
    filterEndDate,
  ]);

  // ===================================================
  // RELOAD SETELAH UPLOAD
  // ===================================================

  useEffect(() => {
    if (!reloadData) return;

    if (currentPage === 1) {
      getDataPenjualan();
    } else {
      setCurrentPage(1);
    }

    if (setReloadData) {
      setReloadData(false);
    }
  }, [reloadData]);

  // ===================================================
  // FILTER OPTIONS
  // ===================================================

  const salesOfficeOptions = useMemo(
    () => options?.cabang || [],
    [options?.cabang]
  );

  const customerGroupOptions = useMemo(
    () => (options?.channel || []).map((item) => ({
      label: item.label,
      value: item.label,
    })),
    [options?.channel]
  );

  const principleOptions = useMemo(
    () => options?.principle || [],
    [options?.principle]
  );

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
    setFilterSalesOffice([]);
    setFilterCustomerGroup([]);
    setFilterPrinciple([]);
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  // ===================================================
  // DETAIL
  // ===================================================

  const handleDetail = (data) => {
    setSelectedData(data);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedData(null);
  };

  // ===================================================
  // DELETE - SEMENTARA UI SAJA
  // ===================================================

  const handleDelete = async (data) => {
    const billingNo = data?.["Billing No"];

    const result = await swal.confirm(
      "Hapus Data Penjualan",
      `Apakah transaksi Billing No ${billingNo} akan dihapus?`
    );

    if (!result) return;

    await swal.custom(
      "Belum Tersedia",
      "API hapus data penjualan belum dihubungkan.",
      "info"
    );
  };

  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex = totalData > 0
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

        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">

          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input
              type="text"
              placeholder="Cari billing / customer / material / salesman..."
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

          <button
            type="button"
            onClick={resetFilter}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"
          >
            <FaFilter />
            Reset Filter
          </button>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Cabang
            </label>
            <Select
              isMulti
              options={salesOfficeOptions}
              value={getSelectedFilterOptions(salesOfficeOptions, filterSalesOffice)}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterSalesOffice((selected || []).map((item) => item.value));
              }}
              placeholder="Semua Sales Office"
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
              options={customerGroupOptions}
              value={getSelectedFilterOptions(customerGroupOptions, filterCustomerGroup)}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCustomerGroup((selected || []).map((item) => item.value));
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
              options={principleOptions}
              value={getSelectedFilterOptions(principleOptions, filterPrinciple)}
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
              isDisabled
              options={[]}
              value={[]}
              placeholder="Customer"
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

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(summaryData.total_transaksi)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaClipboardList className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-green-700">Total Billing</p>
              <p className="text-2xl font-bold text-green-900">
                {formatNumber(summaryData.total_billing)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <FaFileInvoiceDollar className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-purple-700">Total Penjualan</p>
              <p className="text-xl font-bold text-purple-900">
                {formatCompactRupiah(summaryData.total_penjualan)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <FaMoneyBillWave className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-orange-700">Total COGS</p>
              <p className="text-xl font-bold text-orange-900">
                {formatCompactRupiah(summaryData.total_cogs)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
              <FaWarehouse className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-emerald-700">Total Margin</p>
              <p className="text-xl font-bold text-emerald-900">
                {formatCompactRupiah(summaryData.total_margin)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FaChartLine className="text-emerald-600" />
            </div>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className={dimensionScreenW < 768 && check ? "bringToBack" : ""}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

          <div className="relative overflow-auto rounded-2xl max-h-[65vh]">

            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <span className="text-sm text-gray-600">
                    Memuat data penjualan...
                  </span>
                </div>
              </div>
            )}

            <table className="table w-full">
              <thead className="bg-primary text-white sticky top-0 text-[13px] z-10">
                <tr>
                  {/* <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-semibold">
                      <FaEllipsisV />
                      Aksi
                    </div>
                  </th> */}

                  {mainColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        {column.icon}
                        {column.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={mainColumns.length}
                      className="text-center py-16 text-gray-500"
                    >
                      <FaClipboardList className="text-4xl text-gray-300 mx-auto mb-3" />
                      Tidak ada data penjualan
                    </td>
                  </tr>
                ) : (
                  tableData.map((item, index) => (
                    <tr
                      key={`${item?.penjualan_id || item?.["Billing No"] || "row"}-${index}`}
                      className="border-b hover:bg-blue-50 transition duration-200"
                    >
                      {/* Aksi column disabled temporarily */}

                      {mainColumns.map((column) => {
                        const value = [
                          "Persentase COGS",
                          "Margin",
                          "Persentase Margin",
                          "PPh",
                        ].includes(column.key)
                          ? getCalculatedValue(item, column.key)
                          : column.key === "Tanggal Jatuh Tempo"
                            ? getTanggalJatuhTempo(item)
                            : item[column.key];

                        return (
                          <td
                            key={column.key}
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            {column.type === "status" ? (
                              renderPostingStatus(value)
                            ) : column.type === "date" ? (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCalendarAlt className="text-primary" />
                                {formatDate(value)}
                              </div>
                            ) : column.type === "top" ? (
                              <span className="font-semibold text-gray-700">
                                {formatTOP(value)}
                              </span>
                            ) : column.type === "dueDate" ? (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCalendarAlt className="text-primary" />
                                {formatDate(value)}
                              </div>
                            ) : column.type === "currency" ? (
                              <span className="font-bold text-gray-700">
                                {formatRupiah(value)}
                              </span>
                            ) : column.type === "plainNumber" ? (
                              <span className="text-gray-700">
                                {displayValue(value)}
                              </span>
                            ) : column.type === "calculatedPercentCOGS" ||
                              column.type === "calculatedPercentMargin" ? (
                              <span className="font-bold text-gray-700">
                                {formatPercent(value)}
                              </span>
                            ) : column.type === "calculatedMargin" ? (
                              <span className="font-bold text-gray-700">
                                {formatRupiah(value)}
                              </span>
                            ) : column.type === "calculatedPph" ? (
                              <span className="font-bold text-gray-700">
                                {formatRupiah(value)}
                              </span>
                            ) : column.type === "number" ? (
                              <span className="text-gray-700">
                                {formatNumber(value)}
                              </span>
                            ) : (
                              <span
                                className="text-gray-700 max-w-[280px] block truncate"
                                title={String(displayValue(value))}
                              >
                                {displayValue(value)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-100 bg-slate-50 py-4 px-5">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

              <div className="flex items-center gap-5 flex-wrap">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">{startIndex}</span>{" "}
                  to{" "}
                  <span className="font-semibold">{endIndex}</span>{" "}
                  of{" "}
                  <span className="font-semibold">{totalData}</span>{" "}
                  entries
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows:</span>

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

              {totalPage > 0 && (
                <ReactPaginate
                  breakLabel="..."
                  previousLabel="←"
                  nextLabel="→"
                  pageCount={totalPage}
                  onPageChange={(e) => setCurrentPage(e.selected + 1)}
                  forcePage={Math.min(
                    currentPage - 1,
                    Math.max(totalPage - 1, 0)
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

      {/* DETAIL MODAL */}
      {showDetail && selectedData && (
        <div
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="bg-primary px-6 py-4 text-white sticky top-0 z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <FaFileInvoiceDollar />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Detail Penjualan
                    </h3>

                    <p className="text-xs text-blue-100">
                      Billing No: {displayValue(selectedData["Billing No"])}
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

            <div className="p-6">
              {detailGroups.map((group) => (
                <div key={group.title} className="mb-7">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                    <FaClipboardList className="text-primary" />
                    <h4 className="font-bold text-gray-800">
                      {group.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.fields.map(([key, label, type]) => (
                      <div
                        key={key}
                        className="rounded-xl bg-gray-50 border border-gray-100 p-3"
                      >
                        <p className="text-xs text-gray-400 mb-1">
                          {label}
                        </p>

                        <p className="font-semibold text-gray-700 break-words">
                          {formatFieldValue(
                            key === "Tanggal Jatuh Tempo"
                              ? getTanggalJatuhTempo(selectedData)
                              : selectedData[key],
                            type,
                            selectedData
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

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

export default TableMasterFaktur;