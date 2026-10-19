import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaHashtag,
  FaShoppingCart,
  FaUndoAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaCalendarAlt,
  FaUserTie,
  FaChartLine,
  FaClipboardList,
  FaWallet,
  FaPercentage,
  FaTimes,
  FaBoxOpen,
  FaFileInvoice,
  FaFileExcel,
  FaUser,
  FaMapMarkerAlt,
  FaFilter,
  FaSyncAlt,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import * as XLSX from "xlsx";

import storeSchema from "global/store";
import { swal } from "global/helper/swal";


const FilterOption = (props) => (
  <selectComponents.Option {...props}>
    <input type="checkbox" checked={props.isSelected} readOnly className="checkbox checkbox-primary checkbox-xs mr-2" />
    {props.label}
  </selectComponents.Option>
);
const FilterMultiValue = () => null;
const FilterValueContainer = ({ children, ...props }) => {
  const selectedCount = props.getValue().length;
  return <selectComponents.ValueContainer {...props}>{selectedCount > 0 ? `${selectedCount} dipilih` : children[0]}{children[1]}</selectComponents.ValueContainer>;
};
const filterSelectComponents = { Option: FilterOption, MultiValue: FilterMultiValue, ValueContainer: FilterValueContainer };
const filterSelectStyles = {
  control: (base, state) => ({ ...base, minHeight: 40, borderRadius: 12, borderColor: state.isFocused ? "#60a5fa" : "#e5e7eb", boxShadow: state.isFocused ? "0 0 0 2px rgba(219,234,254,.8)" : "none", fontSize: "0.875rem", ":hover": { borderColor: "#60a5fa" } }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 38 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
  option: (base, state) => ({ ...base, fontSize: "0.875rem", backgroundColor: state.isFocused ? "#eff6ff" : "white", color: "#374151" }),
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {

  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
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

  const number =
    Number(value || 0);

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
// FORMAT RUPIAH SINGKAT UNTUK CARD SUMMARY
// Contoh: Rp 29 M, Rp 2 Juta
// =====================================================
const formatCompactRupiah = (value) => {
  const amount = Number(value) || 0;
  const absoluteAmount = Math.abs(amount);
  const formatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  });

  if (absoluteAmount >= 1_000_000_000_000) {
    return `Rp ${formatter.format(amount / 1_000_000_000_000)} T`;
  }

  if (absoluteAmount >= 1_000_000_000) {
    return `Rp ${formatter.format(amount / 1_000_000_000)} M`;
  }

  if (absoluteAmount >= 1_000_000) {
    return `Rp ${formatter.format(amount / 1_000_000)} Juta`;
  }

  return formatCurrency(amount);
};


// =====================================================
// PRODUCT MASTER DUMMY
// =====================================================

const productMaster = [

  {
    material: 13076374,
    product: "ARTESUNATE INJ",
    unit: "VL",
    price: 109998,
    group: "ETHICAL",
  },

  {
    material: 13076121,
    product: "PARACETAMOL 500 MG",
    unit: "BT",
    price: 24500,
    group: "ETHICAL",
  },

  {
    material: 13075432,
    product: "AMOXICILLIN 500 MG",
    unit: "BT",
    price: 38500,
    group: "ETHICAL",
  },

  {
    material: 13074218,
    product: "INFUS SET DEWASA",
    unit: "PCS",
    price: 18750,
    group: "ALKES",
  },

  {
    material: 13073109,
    product: "MASKER MEDIS 3 PLY",
    unit: "BOX",
    price: 32500,
    group: "ALKES",
  },

  {
    material: 13072551,
    product: "OMEPRAZOLE 20 MG",
    unit: "BT",
    price: 41250,
    group: "ETHICAL",
  },

  {
    material: 13071983,
    product: "CETIRIZINE 10 MG",
    unit: "BT",
    price: 29500,
    group: "ETHICAL",
  },

  {
    material: 13071442,
    product: "VITAMIN B COMPLEX",
    unit: "BT",
    price: 33500,
    group: "OTC",
  },

  {
    material: 13070881,
    product: "OMEPRAZOLE INJ",
    unit: "VL",
    price: 57500,
    group: "ETHICAL",
  },

  {
    material: 13070221,
    product: "CEFTRIAXONE INJ",
    unit: "VL",
    price: 68500,
    group: "ETHICAL",
  },

];


// =====================================================
// GENERATE DETAIL PENJUALAN
// =====================================================

const generateDetailPenjualan = ({
  index,
  totalPenjualan,
  customer,
  principal,
  sales,
  tanggal,
}) => {

  const salesOfficeList = [
    [2247, "KFTD Jayapura"],
    [2201, "KFTD Medan"],
    [2202, "KFTD Jakarta"],
    [2203, "KFTD Bogor"],
    [2204, "KFTD Pasuruan"],
  ];

  const addressList = [
    "JL. IRIAN NO.04 IMBI KEL. GURABESI",
    "JL. PEMUDA NO.25 MEDAN",
    "JL. RAYA BOGOR NO.18 JAKARTA",
    "JL. AHMAD YANI NO.15 BOGOR",
    "JL. PANGGUNG NO.12 PASURUAN",
  ];

  const [
    salesOffice,
    descSalesOffice,
  ] =
    salesOfficeList[
      index % salesOfficeList.length
    ];

  const address =
    addressList[
      index % addressList.length
    ];

  const billTo =
    10007405 +
    (index * 13);

  const billingNo =
    2809361541 +
    (index * 17);

  const quantityList = [
    5,
    8,
    4,
    6,
    9,
  ];

  const details = [];

  let allocated =
    0;

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const product =
      productMaster[
        (index + i) %
        productMaster.length
      ];

    const quantity =
      quantityList[i];

    let lineTotal;

    if (i === 4) {

      lineTotal =
        totalPenjualan -
        allocated;

    } else {

      const ratio =
        [
          0.22,
          0.18,
          0.21,
          0.16,
        ][i];

      lineTotal =
        Math.round(
          (
            totalPenjualan *
            ratio
          ) / 1000
        ) * 1000;
    }

    allocated +=
      lineTotal;

    const discountPercent =
      i % 3 === 0
        ? 5
        : 0;

    const gross =
      quantity *
      product.price;

    const discountAmount =
      Math.min(
        Math.round(
          gross *
          discountPercent /
          100
        ),
        gross
      );

    const taxAmount =
      Math.round(
        lineTotal * 0.11
      );

    const totalCogs =
      Math.round(
        lineTotal * 0.86
      );

    details.push({

      No: i + 1,

      "Sales Office":
        salesOffice,

      "Desc. S.Office":
        descSalesOffice,

      "Posting Date":
        tanggal,

      "Billing No":
        billingNo,

      "Posting Status":
        "C",

      "Bill.Cancel":
        null,

      "Bill to party":
        billTo,

      "Name Bill to":
        customer.toUpperCase(),

      Address:
        address,

      Material:
        product.material,

      "Material Group 1":
        product.group ===
        "ALKES"
          ? 350
          : 250,

      "Desc Material Group 1":
        "PIHAK 3",

      "Text Material":
        product.product,

      Quantity:
        quantity,

      "Sales Unit":
        product.unit,

      "Unit Price Penjualan":
        product.price,

      "Dis% (ZD01)":
        0,

      "DisAmt (ZD01)":
        0,

      "Dis% (ZD02)":
        0,

      "DisAmt (ZD02)":
        0,

      "Dis% (ZD03)":
        discountPercent,

      "DisAmt (ZD03)":
        discountAmount,

      "Dis% (ZD04)":
        0,

      "DisAmt (ZD04)":
        0,

      "Dis% (ZD05)":
        0,

      "DisAmt (ZD05)":
        0,

      "Dis% (ZD06)":
        0,

      "DisAmt (ZD06)":
        0,

      "Disc. Upfront % (ZD07)":
        0,

      "Disc. Upfront Amt (ZD07)":
        0,

      "Disc. Beban KFTD Upf % (ZD08)":
        0,

      "Disc. Beban KFTD Upf Amt (ZD08)":
        0,

      "Disc. Beban Principle Upf % (ZD09)":
        0,

      "Disc. Beban Principle Upf Amt (ZD09)":
        0,

      "Disc. Pengembalian Upf % (ZD10)":
        0,

      "Disc. Pengembalian Upf Amt (ZD10)":
        0,

      "Dis% (ZD12)":
        0,

      "DisAmt (ZD12)":
        0,

      "Dis% (ZD14)":
        0,

      "DisAmt (ZD14)":
        0,

      "Dis% (ZD15)":
        0,

      "DisAmt (ZD15)":
        0,

      "Total Discount":
        discountAmount,

      "Total Penjualan":
        lineTotal,

      "Tax Amount":
        taxAmount,

      "Total COGS":
        totalCogs,

      "Unit Price Pembelian":
        Math.round(
          totalCogs /
          quantity
        ),

      "Bill Qty in SKU":
        quantity,

      "UoM SKU":
        product.unit,

      "Code Pelayanan":
        99,

      "Dec. Pelayanan":
        "Rutin",

      "Prod. Hierarchy3":
        product.group,

      Principle:
        7000000004 +
        (index % 5),

      "Name Principle":
        principal,

      "Desc. Cust. Grp4":
        customer
          .toLowerCase()
          .includes("apotek")
          ? "Apotek"
          : "Rumah Sakit",

      Salesman:
        80427 +
        (index % 5),

      "Name Salesman":
        sales,

      "PO Number":
        `PO/${String(
          index + 1
        ).padStart(2, "0")}/IX/2026`,

      "Quotation Number":
        2012394400 +
        index,

    });
  }

  return details;
};


// =====================================================
// DUMMY DATA REPORT SALES
// =====================================================

const baseData = [

  {
    id: 1,
    tanggal: "2026-09-01",
    no_transaksi: "SAL-2026-00001",
    customer:
      "Dinas Kesehatan Kota Medan",
    principal:
      "BIOFARMA",
    sales: "Andi",
    penjualan:
      150000000,
    retur:
      10000000,
    pencairan:
      125000000,
    status: "SELESAI",
  },

  {
    id: 2,
    tanggal: "2026-09-02",
    no_transaksi: "SAL-2026-00002",
    customer:
      "RSUD Pasuruan",
    principal:
      "KIMIA FARMA",
    sales: "Budi",
    penjualan:
      225000000,
    retur:
      15000000,
    pencairan:
      180000000,
    status: "SELESAI",
  },

  {
    id: 3,
    tanggal: "2026-09-03",
    no_transaksi: "SAL-2026-00003",
    customer:
      "Apotek Maju Djaya",
    principal:
      "PHAPROS",
    sales: "Citra",
    penjualan:
      85000000,
    retur:
      5000000,
    pencairan:
      65000000,
    status: "SELESAI",
  },

  {
    id: 4,
    tanggal: "2026-09-04",
    no_transaksi: "SAL-2026-00004",
    customer:
      "RS Hermina Medan",
    principal:
      "AMAROX",
    sales: "Dedi",
    penjualan:
      175000000,
    retur:
      20000000,
    pencairan:
      135000000,
    status: "PROSES",
  },

  {
    id: 5,
    tanggal: "2026-09-05",
    no_transaksi: "SAL-2026-00005",
    customer:
      "Apotek Sehat Sentosa",
    principal:
      "SANBE",
    sales: "Eko",
    penjualan:
      95000000,
    retur:
      7500000,
    pencairan:
      70000000,
    status: "SELESAI",
  },

  {
    id: 6,
    tanggal: "2026-09-06",
    no_transaksi: "SAL-2026-00006",
    customer:
      "Klinik Medika Utama",
    principal:
      "BIOFARMA",
    sales: "Andi",
    penjualan:
      120000000,
    retur: 0,
    pencairan:
      95000000,
    status: "SELESAI",
  },

  {
    id: 7,
    tanggal: "2026-09-07",
    no_transaksi: "SAL-2026-00007",
    customer:
      "RS Siloam Medan",
    principal:
      "KIMIA FARMA",
    sales: "Budi",
    penjualan:
      275000000,
    retur:
      25000000,
    pencairan:
      210000000,
    status: "SELESAI",
  },

  {
    id: 8,
    tanggal: "2026-09-08",
    no_transaksi: "SAL-2026-00008",
    customer:
      "Dinas Kesehatan Deli Serdang",
    principal:
      "PHAPROS",
    sales: "Citra",
    penjualan:
      145000000,
    retur:
      10000000,
    pencairan:
      110000000,
    status: "PROSES",
  },

  {
    id: 9,
    tanggal: "2026-09-09",
    no_transaksi: "SAL-2026-00009",
    customer:
      "Apotek Kimia Sehat",
    principal:
      "AMAROX",
    sales: "Dedi",
    penjualan:
      65000000,
    retur:
      5000000,
    pencairan:
      45000000,
    status: "SELESAI",
  },

  {
    id: 10,
    tanggal: "2026-09-10",
    no_transaksi: "SAL-2026-00010",
    customer:
      "RSUD Kota Bogor",
    principal:
      "SANBE",
    sales: "Eko",
    penjualan:
      195000000,
    retur:
      12000000,
    pencairan:
      150000000,
    status: "SELESAI",
  },

  {
    id: 11,
    tanggal: "2026-09-11",
    no_transaksi: "SAL-2026-00011",
    customer:
      "Apotek Berkah Farma",
    principal:
      "BIOFARMA",
    sales: "Andi",
    penjualan:
      110000000,
    retur:
      8000000,
    pencairan:
      85000000,
    status: "SELESAI",
  },

  {
    id: 12,
    tanggal: "2026-09-12",
    no_transaksi: "SAL-2026-00012",
    customer:
      "RS Jakarta Sehat",
    principal:
      "KIMIA FARMA",
    sales: "Budi",
    penjualan:
      310000000,
    retur:
      18000000,
    pencairan:
      250000000,
    status: "PROSES",
  },

];


// =====================================================
// FILTER MASTER DUMMY
// =====================================================

const cabangMaster = [
  "KFTD Jayapura",
  "KFTD Medan",
  "KFTD Jakarta",
  "KFTD Bogor",
  "KFTD Pasuruan",
];

const channelMaster = [
  "Tender",
  "Regular",
  "Apotek",
  "Rumah Sakit",
  "Klinik",
];


// =====================================================
// GENERATE DETAIL RETUR / PENCAIRAN
// =====================================================
//
// Untuk dummy data, detail retur dan pencairan diturunkan
// dari detail penjualan per produk/invoice agar ketika angka
// di kolom Retur/Pencairan diklik, struktur detailnya tetap
// sama seperti modal Penjualan.
//
// Saat sudah memakai API real, bagian ini dapat diganti dengan
// detail retur/pencairan yang dikirim langsung dari backend.
// =====================================================

const generateDetailMetric = ({
  sourceDetails,
  totalAmount,
  fieldName,
}) => {
  const details =
    Array.isArray(sourceDetails)
      ? sourceDetails
      : [];

  if (
    details.length === 0 ||
    Number(totalAmount || 0) <= 0
  ) {
    return [];
  }

  const totalSource =
    details.reduce(
      (sum, item) =>
        sum +
        Number(
          item["Total Penjualan"] || 0
        ),
      0
    );

  if (totalSource <= 0) {
    return [];
  }

  let allocated = 0;

  return details.map(
    (detail, index) => {
      const sourceAmount =
        Number(
          detail["Total Penjualan"] || 0
        );

      let metricAmount;

      if (
        index ===
        details.length - 1
      ) {
        metricAmount =
          Number(totalAmount || 0) -
          allocated;
      } else {
        metricAmount =
          Math.round(
            (
              Number(totalAmount || 0) *
              (sourceAmount /
                totalSource)
            ) /
              1000
          ) * 1000;
      }

      allocated += metricAmount;

      return {
        ...detail,
        [fieldName]:
          metricAmount,
      };
    }
  );
};


// =====================================================
// ATTACH DETAIL TO EVERY TRANSACTION
// =====================================================

const dummyData =
  baseData.map(
    (item, index) => {

      // Generate satu kali saja agar detail
      // penjualan, retur, dan pencairan
      // menggunakan invoice/product yang sama.
      const detailPenjualan =
        generateDetailPenjualan({
          index,
          totalPenjualan:
            item.penjualan,
          customer:
            item.customer,
          principal:
            item.principal,
          sales:
            item.sales,
          tanggal:
            item.tanggal,
        });

      return {

        ...item,

        // Metadata tambahan untuk kebutuhan filter.
        // Tidak mengubah kolom/data yang tampil di tabel utama.
        cabang:
          cabangMaster[
            index % cabangMaster.length
          ],
        channel:
          channelMaster[
            index % channelMaster.length
          ],

        detailPenjualan,

        detailRetur:
          generateDetailMetric({
            sourceDetails:
              detailPenjualan,
            totalAmount:
              item.retur,
            fieldName:
              "Total Retur",
          }),

        detailPencairan:
          generateDetailMetric({
            sourceDetails:
              detailPenjualan,
            totalAmount:
              item.pencairan,
            fieldName:
              "Total Pencairan",
          }),

      };

    }
  );


// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {

  SELESAI: {
    label: "Selesai",
    className:
      "bg-green-100 text-green-700",
  },

  PROSES: {
    label: "Proses",
    className:
      "bg-amber-100 text-amber-700",
  },

};


// =====================================================
// COMPONENT
// =====================================================

const TableReportSales = ({
  dimensionScreenW,
  check,
  loginAccess,
}) => {

  // ===================================================
  // STATE - SERVER SIDE
  // ===================================================
  const [allData, setAllData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiSummary, setApiSummary] = useState(null);
  const [apiOptions, setApiOptions] = useState({});

  // ===================================================
  // DETAIL MODAL STATE
  // ===================================================

  const [
    selectedPenjualan,
    setSelectedPenjualan,
  ] = useState(null);

  const [
    isDetailModalOpen,
    setIsDetailModalOpen,
  ] = useState(false);

  // ===================================================
  // DETAIL RETUR / PENCAIRAN MODAL STATE
  // ===================================================

  const [
    selectedMetric,
    setSelectedMetric,
  ] = useState(null);

  const [
    isMetricModalOpen,
    setIsMetricModalOpen,
  ] = useState(false);


  const getReportRows = (response) => {
    const data = response?.data ?? response ?? {};
    if (Array.isArray(data)) return data;
    return data?.detail_data || data?.detail_list || data?.detail_penjualan ||
      data?.list_data || data?.rows || data?.data || [];
  };

  const getReportDetail = async (item, detailType) => {
    const payload = {
      page: 1,
      limit: 9999,
      keyword: "",
      detail: true,
      is_detail: true,
      detail_type: detailType,
      type: detailType,
      id: item?.id ?? item?.report_sales_id ?? item?.sales_id ?? null,
      report_sales_id: item?.report_sales_id ?? item?.id ?? null,
      no_transaksi: item?.no_transaksi ?? item?.no_invoice ?? item?.billing_no ?? null,
      tanggal: item?.tanggal ?? item?.posting_date ?? null,
      customer: item?.customer_id ?? item?.customer ?? null,
      principal: item?.principle_id ?? item?.principle ?? null,
    };
    const response = await storeSchema.actions.getDataReportSales(payload);
    if (response?.status !== true) {
      throw new Error(response?.message || "Gagal mengambil detail report sales");
    }
    return getReportRows(response);
  };

  // Detail Penjualan memakai API khusus dan mengirim kode Sales.
  const openDetailPenjualan = async (item) => {
    setSelectedPenjualan({ ...item, detailPenjualan: [], detailLoading: true });
    setIsDetailModalOpen(true);

    try {
      const kodeSales = item?.sales_id ?? item?.kode_sales ?? item?.sales ?? null;
      if (kodeSales === null || kodeSales === undefined || kodeSales === "-") {
        throw new Error("Kode Sales tidak ditemukan");
      }

      const response = await storeSchema.actions.getDetailPenjualan({
        kode_sales: kodeSales,
      });
      if (response?.status !== true) {
        throw new Error(response?.message || "Gagal mengambil detail penjualan");
      }

      const rows = getReportRows(response);
      setSelectedPenjualan((previous) => previous ? {
        ...previous,
        detailPenjualan: rows,
        detailLoading: false,
      } : previous);
    } catch (error) {
      console.error("ERROR DETAIL PENJUALAN REPORT SALES:", error);
      setSelectedPenjualan((previous) => previous ? {
        ...previous,
        detailPenjualan: [],
        detailLoading: false,
        detailError: error?.message,
      } : previous);
      await swal.error(error?.message || "Gagal mengambil detail penjualan");
    }
  };

  const openDetailMetric = async (item, type) => {
    setSelectedMetric({ item, type, detailData: [], loading: true });
    setIsMetricModalOpen(true);

    try {
      let rows = [];

      if (type === "PENCAIRAN") {
        const kodeSales = item?.sales_id ?? item?.kode_sales ?? item?.sales ?? null;
        if (kodeSales === null || kodeSales === undefined || kodeSales === "-") {
          throw new Error("Kode Sales tidak ditemukan");
        }

        const response = await storeSchema.actions.getDetailPencairan({
          kode_sales: kodeSales,
        });
        if (response?.status !== true) {
          throw new Error(response?.message || "Gagal mengambil detail pencairan");
        }
        rows = getReportRows(response);
      } else {
        // Retur tetap memakai mekanisme sebelumnya; hanya Penjualan dan Pencairan
        // yang dialihkan ke API khusus sesuai kebutuhan.
        rows = await getReportDetail(item, type);
      }

      setSelectedMetric({ item, type, detailData: rows, loading: false });
    } catch (error) {
      console.error(`ERROR DETAIL ${type} REPORT SALES:`, error);
      setSelectedMetric({ item, type, detailData: [], loading: false, error: error?.message });
      await swal.error(error?.message || `Gagal mengambil detail ${String(type).toLowerCase()}`);
    }
  };

  const closeDetailMetric = () => {
    setIsMetricModalOpen(false);
    setSelectedMetric(null);
  };

  const closeDetailPenjualan = () => {
    setIsDetailModalOpen(false);
    setSelectedPenjualan(null);
  };

  // ===================================================
  // EXPORT DETAIL PENJUALAN KE EXCEL
  // ===================================================

  const exportDetailPenjualanToExcel =
    () => {

      if (
        !selectedPenjualan
      ) {
        return;
      }

      const details =
        selectedPenjualan
          .detailPenjualan || [];

      if (
        details.length === 0
      ) {
        window.alert(
          "Tidak ada detail penjualan yang dapat diexport."
        );
        return;
      }

      // Tambahkan nomor urut tanpa mengubah data asli.
      const exportData =
        details.map(
          (
            detail,
            index
          ) => ({
            No:
              index + 1,

            ...detail,
          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          exportData
        );

      // Lebar kolom otomatis berdasarkan isi.
      const headers =
        Object.keys(
          exportData[0] || {}
        );

      worksheet["!cols"] =
        headers.map(
          (header) => {

            const maxLength =
              Math.max(
                header.length,
                ...exportData.map(
                  (row) =>
                    String(
                      row[header] ??
                      ""
                    ).length
                )
              );

            return {
              wch:
                Math.min(
                  Math.max(
                    maxLength + 2,
                    10
                  ),
                  35
                ),
            };
          }
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Detail Penjualan"
      );

      const safeInvoice =
        String(
          selectedPenjualan
            .no_transaksi ||
          "detail"
        )
          .replace(
            /[^a-zA-Z0-9_-]/g,
            "_"
          );

      XLSX.writeFile(
        workbook,
        `Detail_Penjualan_${safeInvoice}.xlsx`
      );
    };


  // ===================================================
  // FILTER STATE + REFERENSI FILTER DARI API
  // ===================================================
  // Array kosong berarti semua data; nilai terpilih dikirim sebagai array ke API.
  const initialFilter = { cabang: [], principal: [], channel: [], customer: [], sales: [] };
  const [filter, setFilter] = useState(initialFilter);
  const [appliedFilter, setAppliedFilter] = useState(initialFilter);
  const [filterOptions, setFilterOptions] = useState({
    cabang: [], principal: [], channel: [], customer: [], sales: [],
  });

  const normalizeOptions = (items, valueKeys, labelKeys) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => {
      if (item && typeof item === "object") {
        const value = valueKeys.map((key) => item?.[key]).find((v) => v !== undefined && v !== null && v !== "");
        const label = labelKeys.map((key) => item?.[key]).find((v) => v !== undefined && v !== null && v !== "");
        return value === undefined ? null : { value: String(value), label: String(label ?? value) };
      }
      return item === undefined || item === null || item === "" ? null : { value: String(item), label: String(item) };
    }).filter(Boolean).filter((item, index, arr) => arr.findIndex((other) => other.value === item.value) === index);
  };

  const handleFilterChange = (key, value) => {
    setFilter((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "cabang" ? { customer: [], sales: [] } : {}),
      ...(key === "channel" ? { customer: [] } : {}),
    }));
  };

  const applyFilter = () => {
    setAppliedFilter({ ...filter });
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setFilter({ ...initialFilter });
    setAppliedFilter({ ...initialFilter });
    setKeyword("");
    setSearchKeyword("");
    setCurrentPage(1);
  };

  // Referensi cabang/channel/principal diambil dari API, bukan hanya
  // dari data halaman yang sedang tampil di tabel.
  useEffect(() => {
    let active = true;
    const loadFilterReferences = async () => {
      try {
        const [refCabang, refChannel, refPrincipal] = await Promise.all([
          storeSchema.actions.getReferensiByJenis("cabang_id"),
          storeSchema.actions.getReferensiByJenis("channel_id"),
          storeSchema.actions.getListPrinciple({ page: 1, limit: 9999, sortBy: "ASC" }),
        ]);
        if (!active) return;
        setFilterOptions((prev) => ({
          ...prev,
          cabang: refCabang?.status === true
            ? normalizeOptions(refCabang?.data, ["kd_ref", "value", "id"], ["ur_ref", "label", "name"])
            : prev.cabang,
          channel: refChannel?.status === true
            ? normalizeOptions(refChannel?.data, ["kd_ref", "value", "id"], ["ur_ref", "label", "name"])
            : prev.channel,
          principal: refPrincipal?.status === true
            ? normalizeOptions(refPrincipal?.data?.list_data || refPrincipal?.data, ["principle", "kode_principle", "value", "id"], ["nama_principle", "name", "label"])
            : prev.principal,
        }));
      } catch (error) {
        console.error("ERROR GET REFERENSI FILTER REPORT SALES:", error);
      }
    };
    loadFilterReferences();
    return () => { active = false; };
  }, []);

  // Customer mengikuti cabang yang dipilih, sesuai pola filter pada lampiran.
  useEffect(() => {
    let active = true;
    const loadCustomers = async () => {
      if (!filter.cabang.length) {
        setFilterOptions((prev) => ({ ...prev, customer: [] }));
        setFilter((prev) => prev.customer.length ? { ...prev, customer: [] } : prev);
        return;
      }
      try {
        const res = await storeSchema.actions.getDataPelanggan({
          page: 1,
          limit: 9999,
          cabang_id: filter.cabang,
        });
        if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data customer");
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.list_data || res?.data?.data || res?.data?.rows || [];
        const customers = normalizeOptions(data, ["kode_customer", "customer", "value", "id"], ["name", "customer_name", "nama_customer", "label"]);
        if (active) {
          setFilterOptions((prev) => ({ ...prev, customer: customers }));
          setFilter((prev) => ({ ...prev, customer: prev.customer.filter((value) => customers.some((item) => item.value === String(value))) }));
        }
      } catch (error) {
        console.error("ERROR GET CUSTOMER FILTER REPORT SALES:", error);
        if (active) setFilterOptions((prev) => ({ ...prev, customer: [] }));
      }
    };
    loadCustomers();
    return () => { active = false; };
  }, [filter.cabang]);

  // Sales mengikuti cabang yang dipilih dan diambil dari API User Management.
  useEffect(() => {
    let active = true;

    const loadSales = async () => {
      if (!filter.cabang.length) {
        setFilterOptions((prev) => ({ ...prev, sales: [] }));
        setFilter((prev) => prev.sales.length ? { ...prev, sales: [] } : prev);
        return;
      }

      try {
        const res = await storeSchema.actions.getListUserManagement({
          page: 1,
          limit: 9999,
          sortBy: "Asc",
          cabang_id: filter.cabang,
          role_id: "04",
        });

        if (res?.status !== true) {
          throw new Error(res?.message || "Gagal mengambil data Sales");
        }

        const data = Array.isArray(res?.data?.list_data)
          ? res.data.list_data
          : [];

        const salesOptions = normalizeOptions(
          data,
          ["user_id"],
          ["nama"]
        );

        if (active) {
          setFilterOptions((prev) => ({ ...prev, sales: salesOptions }));
          setFilter((prev) => ({
            ...prev,
            sales: prev.sales.filter((value) =>
              salesOptions.some((item) => item.value === String(value))
            ),
          }));
        }
      } catch (error) {
        console.error("ERROR GET SALES FILTER REPORT SALES:", error);
        if (active) {
          setFilterOptions((prev) => ({ ...prev, sales: [] }));
          setFilter((prev) => prev.sales.length ? { ...prev, sales: [] } : prev);
        }
      }
    };

    loadSales();
    return () => { active = false; };
  }, [filter.cabang]);

  // Opsi produk dapat disediakan oleh API report (options/filter_options).
  // Jika backend belum mengirimkannya, gunakan produk dari data yang diterima.
  const optionList = (key, field) => {
    const supplied = filterOptions[key];
    if (supplied?.length) return supplied.filter((item) => item.value !== "ALL");
    const apiSupplied = apiOptions?.[key];
    const fromApi = normalizeOptions(apiSupplied, ["value", "id", "kode", "kode_produk", "produk"], ["label", "name", "nama", "nama_produk"]);
    const fromRows = normalizeOptions(allData.map((item) => item[key]).filter(Boolean), ["value"], ["label"]);
    const list = fromApi.length ? fromApi : fromRows;
    return list.filter((item) => item.value !== "ALL");
  };

  const cabangOptions = useMemo(() => optionList("cabang", "Cabang"), [filterOptions, apiOptions, allData]);
  const principalOptions = useMemo(() => optionList("principal", "Principal"), [filterOptions, apiOptions, allData]);
  const channelOptions = useMemo(() => optionList("channel", "Channel"), [filterOptions, apiOptions, allData]);
  const customerOptions = useMemo(() => optionList("customer", "Customer"), [filterOptions, apiOptions, allData]);
  const salesOptions = useMemo(() => filterOptions.sales || [], [filterOptions]);

  const filterLabel = (key, options, allLabel) => {
    const selected = appliedFilter[key] || [];
    if (!selected.length) return allLabel;
    return selected.map((value) => options.find((item) => item.value === String(value))?.label || String(value)).join(", ");
  };

  // Backend mengirim rekap per Sales. Nilai summary_* berada pada setiap row.
  const normalizeReportRow = (item, index) => {
    const details = item?.detailPenjualan || item?.detail_penjualan || item?.details || [];
    const totalPenjualan = Number(
      item?.total_penjualan ??
      item?.penjualan ??
      item?.summary_total_penjualan ??
      item?.total_sales ??
      item?.nilai_penjualan ??
      0
    );
    const totalPencairan = Number(
      item?.total_pencairan ??
      item?.pencairan ??
      item?.summary_total_pencairan ??
      item?.nilai_pencairan ??
      0
    );
    const totalSisaPencairan = Number(
      item?.total_sisa_pencairan ??
      item?.sisa_pencairan ??
      item?.summary_total_sisa_pencairan ??
      (totalPenjualan - totalPencairan)
    );

    return {
      ...item,
      id: item?.id ?? item?.sales_id ?? item?.sales ?? item?.user_id ?? index,
      sales: item?.nama_sales ?? item?.salesman_name ?? item?.name_salesman ?? item?.sales ?? "-",
      sales_id: item?.sales ?? item?.sales_id ?? item?.user_id ?? "-",
      nama_sales: item?.nama_sales ?? "-",
      cabang: item?.nama_cabang ?? item?.sales_office_name ?? item?.desc_sales_office ?? item?.cabang ?? "-",
      principle: item?.principle ?? null,
      principal: item?.nama_principle ?? item?.principal_name ?? item?.principal ?? "-",
      penjualan: totalPenjualan,
      retur: Number(item?.summary_total_retur ?? item?.total_retur ?? item?.retur ?? item?.nilai_retur ?? 0),
      pencairan: totalPencairan,
      sisaPencairan: totalSisaPencairan,
      totalTransaksi: Number(item?.summary_total_transaksi ?? item?.total_transaksi ?? 0),
      totalCustomer: Number(item?.summary_total_customer ?? item?.total_customer ?? 0),
      status: item?.status ?? item?.status_label ?? "PROSES",
      detailPenjualan: Array.isArray(details) ? details : [],
      detailRetur: item?.detailRetur ?? item?.detail_retur ?? [],
      detailPencairan: item?.detailPencairan ?? item?.detail_pencairan ?? [],
    };
  };

  const getDataReportSales = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        search: searchKeyword,
        cabang: appliedFilter.cabang.length ? appliedFilter.cabang : "ALL",
        principal: appliedFilter.principal.length ? appliedFilter.principal : "ALL",
        channel: appliedFilter.channel.length ? appliedFilter.channel : "ALL",
        customer: appliedFilter.customer.length ? appliedFilter.customer : "ALL",
        sales: appliedFilter.sales.length ? appliedFilter.sales : "ALL",
        sales_office: appliedFilter.cabang.length ? appliedFilter.cabang : "ALL",
      };
      const response = await storeSchema.actions.getDataReportSales(payload);
      if (response?.status !== true) {
        throw new Error(response?.message || "Gagal mengambil data report sales");
      }
      const responseData = response?.data ?? {};
      const list = Array.isArray(responseData)
        ? responseData
        : responseData?.list_data ?? responseData?.rows ?? responseData?.data ?? [];
      setAllData((Array.isArray(list) ? list : []).map(normalizeReportRow));
      setTotalData(Number(responseData?.total_data ?? responseData?.total ?? response?.total_data ?? list.length) || 0);
      setTotalPage(Number(responseData?.total_halaman ?? responseData?.total_page ?? responseData?.total_pages ?? response?.total_halaman) || Math.ceil((Number(responseData?.total_data ?? responseData?.total ?? list.length) || 0) / perPage));
      // Ringkasan backend dikirim sebagai field summary_* pada row.
      // Ambil row pertama untuk kartu summary, bukan hanya responseData.summary.
      const firstRow = Array.isArray(list) ? list[0] : null;
      setApiSummary(
        responseData?.summary ??
        responseData?.summary_data ??
        (firstRow ? {
          total_penjualan: firstRow?.summary_total_penjualan,
          total_pencairan: firstRow?.summary_total_pencairan,
          total_sisa_pencairan: firstRow?.summary_total_sisa_pencairan,
          total_transaksi: firstRow?.summary_total_transaksi,
          total_customer: firstRow?.summary_total_customer,
        } : null)
      );
      setApiOptions(responseData?.options ?? responseData?.filter_options ?? {});
    } catch (error) {
      console.error("ERROR GET DATA REPORT SALES:", error);
      setAllData([]);
      setTotalData(0);
      setTotalPage(0);
      setApiSummary(null);
      await swal.error(error?.message || "Gagal mengambil data report sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataReportSales();
  }, [currentPage, perPage, searchKeyword, appliedFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };

  const summaryFallback = useMemo(() => {
    const penjualan = allData.reduce((sum, item) => sum + Number(item.penjualan || 0), 0);
    const retur = allData.reduce((sum, item) => sum + Number(item.retur || 0), 0);
    const pencairan = allData.reduce((sum, item) => sum + Number(item.pencairan || 0), 0);
    const sisaPencairan = allData.reduce((sum, item) => sum + Number(item.sisaPencairan ?? (item.penjualan - item.pencairan) ?? 0), 0);
    const totalTransaksi = allData.reduce((sum, item) => sum + Number(item.totalTransaksi || 0), 0);
    const totalCustomer = allData.reduce((sum, item) => sum + Number(item.totalCustomer || 0), 0);
    return { penjualan, retur, pencairan, netSales: penjualan - retur, sisaPencairan, totalTransaksi, totalCustomer };
  }, [allData]);

  const filteredSummary = {
    penjualan: Number(apiSummary?.penjualan ?? apiSummary?.total_penjualan ?? apiSummary?.summary_total_penjualan ?? apiSummary?.total_sales ?? summaryFallback.penjualan),
    retur: Number(apiSummary?.retur ?? apiSummary?.total_retur ?? apiSummary?.summary_total_retur ?? summaryFallback.retur),
    pencairan: Number(apiSummary?.pencairan ?? apiSummary?.total_pencairan ?? apiSummary?.summary_total_pencairan ?? summaryFallback.pencairan),
    netSales: Number(apiSummary?.net_sales ?? apiSummary?.netSales ?? (Number(apiSummary?.penjualan ?? apiSummary?.total_penjualan ?? apiSummary?.summary_total_penjualan ?? summaryFallback.penjualan) - Number(apiSummary?.retur ?? apiSummary?.total_retur ?? apiSummary?.summary_total_retur ?? summaryFallback.retur))),
    sisaPencairan: Number(apiSummary?.sisa_pencairan ?? apiSummary?.sisaPencairan ?? apiSummary?.total_sisa_pencairan ?? apiSummary?.summary_total_sisa_pencairan ?? summaryFallback.sisaPencairan),
    totalTransaksi: Number(apiSummary?.total_transaksi ?? apiSummary?.summary_total_transaksi ?? summaryFallback.totalTransaksi),
    totalCustomer: Number(apiSummary?.total_customer ?? apiSummary?.summary_total_customer ?? summaryFallback.totalCustomer),
  };

  const paginatedData = allData;

  const startIndex = totalData > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex = Math.min(currentPage * perPage, totalData);

  const renderStatus = (status) => {
    const config = statusConfig[status];
    if (!config) return "-";
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {config.label}
      </span>
    );
  };

  // ===================================================
  // HEADER TABLE
  // ===================================================

  const headerTable = [

    {
      label: "No",
      icon:
        <FaHashtag />,
    },

    {
      label: "Sales",
      icon:
        <FaUserTie />,
    },

    {
      label: "Penjualan",
      icon:
        <FaShoppingCart />,
    },

    {
      label: "Retur",
      icon:
        <FaUndoAlt />,
    },

    {
      label: "Net Sales",
      icon:
        <FaChartLine />,
    },

    {
      label: "Pencairan",
      icon:
        <FaMoneyBillWave />,
    },

    {
      label: "Sisa Pencairan",
      icon:
        <FaWallet />,
    },

  ];


  // ===================================================
  // PAGINATION INFO
  // startIndex dan endIndex sudah didefinisikan di atas.
  // ===================================================

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

      {/* SEARCH */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-3
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
              Cari transaksi / customer / sales...
            "
            className="
              grow
            "
            value={
              keyword
            }
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />
          <button type="button" onClick={handleSearch} title="Cari" className="text-blue-600 hover:text-blue-800">
            <IoSearch />
          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* FILTER DATA */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          shadow-sm
          p-5
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-3
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

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-orange-50
                text-orange-500
                flex
                items-center
                justify-center
              "
            >
              <FaFilter size={14} />
            </div>

            <div>
              <h2
                className="
                  text-sm
                  font-bold
                  text-gray-800
                "
              >
                Filter Data
              </h2>

              <p
                className="
                  text-[11px]
                  text-gray-400
                "
              >
                Tentukan parameter data yang ingin ditampilkan
              </p>
            </div>

          </div>

          <div
            className="
              text-[11px]
              text-gray-400
            "
          >
            Filter aktif:

            <span
              className="
                ml-1
                font-semibold
                text-blue-600
              "
            >
              {
                Object.values(appliedFilter).every((value) => !Array.isArray(value) || value.length === 0)
                  ? "Semua Data"
                  : "Terapan"
              }
            </span>
          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-5
            gap-4
          "
        >

          {/* CABANG */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cabang</label>
            <Select
              isMulti
              options={cabangOptions.filter((item) => item.value !== "ALL")}
              value={cabangOptions.filter((item) => (filter.cabang || []).includes(item.value))}
              onChange={(selected) => handleFilterChange("cabang", (selected || []).map((item) => item.value))}
              placeholder="Semua Cabang"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
              noOptionsMessage={() => "Tidak ada pilihan"}
            />
          </div>


          {/* PRINCIPAL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Principal</label>
            <Select
              isMulti
              options={principalOptions.filter((item) => item.value !== "ALL")}
              value={principalOptions.filter((item) => (filter.principal || []).includes(item.value))}
              onChange={(selected) => handleFilterChange("principal", (selected || []).map((item) => item.value))}
              placeholder="Semua Principal"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
              noOptionsMessage={() => "Tidak ada pilihan"}
            />
          </div>


          {/* CHANNEL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Channel</label>
            <Select
              isMulti
              options={channelOptions.filter((item) => item.value !== "ALL")}
              value={channelOptions.filter((item) => (filter.channel || []).includes(item.value))}
              onChange={(selected) => handleFilterChange("channel", (selected || []).map((item) => item.value))}
              placeholder="Semua Channel"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
              noOptionsMessage={() => "Tidak ada pilihan"}
            />
          </div>


          {/* CUSTOMER */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Customer</label>
            <Select
              isMulti
              isDisabled={!filter.cabang.length}
              options={customerOptions.filter((item) => item.value !== "ALL")}
              value={customerOptions.filter((item) => (filter.customer || []).includes(item.value))}
              onChange={(selected) => handleFilterChange("customer", (selected || []).map((item) => item.value))}
              placeholder="Semua Customer"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
              noOptionsMessage={() => "Tidak ada pilihan"}
            />
          </div>


          {/* SALES */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sales</label>
            <Select
              isMulti
              isDisabled={!filter.cabang.length}
              options={salesOptions.filter((item) => item.value !== "ALL")}
              value={salesOptions.filter((item) => (filter.sales || []).includes(item.value))}
              onChange={(selected) => handleFilterChange("sales", (selected || []).map((item) => item.value))}
              placeholder="Semua Sales"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
              noOptionsMessage={() => "Tidak ada pilihan"}
            />
          </div>




        </div>


        {/* ACTIVE FILTER */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            mt-4
          "
        >
          <span
            className="
              text-[10px]
              text-gray-400
              font-semibold
            "
          >
            Filter:
          </span>

          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">
            {filterLabel("cabang", cabangOptions, "Semua Cabang")}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-semibold">
            {filterLabel("principal", principalOptions, "Semua Principal")}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-semibold">
            {filterLabel("channel", channelOptions, "Semua Channel")}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold max-w-[250px] truncate">
            {filterLabel("customer", customerOptions, "Semua Customer")}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-semibold max-w-[250px] truncate">
            {filterLabel("sales", salesOptions, "Semua Sales")}
          </span>

        </div>


        {/* BUTTON */}
        <div
          className="
            flex
            justify-end
            items-center
            gap-2
            mt-5
            pt-4
            border-t
            border-gray-100
          "
        >

          <button
            type="button"
            onClick={resetFilter}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              text-xs
              font-semibold
              text-gray-500
              hover:bg-gray-100
              transition
            "
          >
            <FaSyncAlt size={11} />
            Reset
          </button>

          <button
            type="button"
            onClick={applyFilter}
            className="
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              bg-blue-600
              text-white
              text-xs
              font-bold
              shadow-md
              shadow-blue-100
              hover:bg-blue-700
              transition
            "
          >
            <FaFilter size={11} />
            Terapkan Filter
          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
          gap-4
        "
      >

        {/* PENJUALAN */}

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
              justify-between
              gap-3
            "
          >

            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-blue-600
                "
              >
                Total Penjualan
              </p>

              <p
                className="
                  text-lg
                  font-bold
                  text-blue-900
                  mt-1
                  truncate
                "
                title={formatCurrency(filteredSummary.penjualan)}
              >
                {formatCompactRupiah(filteredSummary.penjualan)}
              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <FaShoppingCart
                className="
                  text-blue-600
                "
              />

            </div>

          </div>

        </div>


        {/* RETUR */}

        <div
          className="
            rounded-2xl
            bg-red-50
            border
            border-red-100
            p-4
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-red-600
                "
              >
                Total Retur
              </p>

              <p
                className="
                  text-lg
                  font-bold
                  text-red-900
                  mt-1
                  truncate
                "
              >
                {formatCompactRupiah(filteredSummary.retur)}
              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-red-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <FaUndoAlt
                className="
                  text-red-600
                "
              />

            </div>

          </div>

        </div>


        {/* PENCAIRAN */}

        <div
          className="
            rounded-2xl
            bg-green-50
            border
            border-green-100
            p-4
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-green-600
                "
              >
                Total Pencairan
              </p>

              <p
                className="
                  text-lg
                  font-bold
                  text-green-900
                  mt-1
                  truncate
                "
              >
                {formatCompactRupiah(filteredSummary.pencairan)}
              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-green-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <FaMoneyBillWave
                className="
                  text-green-600
                "
              />

            </div>

          </div>

        </div>


        {/* NET SALES */}

        <div
          className="
            rounded-2xl
            bg-indigo-50
            border
            border-indigo-100
            p-4
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-indigo-600
                "
              >
                Net Sales
              </p>

              <p
                className="
                  text-lg
                  font-bold
                  text-indigo-900
                  mt-1
                  truncate
                "
              >
                {formatCompactRupiah(filteredSummary.netSales)}
              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-indigo-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <FaChartLine
                className="
                  text-indigo-600
                "
              />

            </div>

          </div>

        </div>


        {/* TRANSAKSI */}

        <div
          className="
            rounded-2xl
            bg-orange-50
            border
            border-orange-100
            p-4
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-medium
                  text-orange-600
                "
              >
                Jumlah Transaksi
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-orange-900
                  mt-1
                "
              >
                {
                  totalData
                }
              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-orange-100
                flex
                items-center
                justify-center
              "
            >

              <FaClipboardList
                className="
                  text-orange-600
                "
              />

            </div>

          </div>

        </div>


        {/* RETUR % */}

        <div
          className="
            rounded-2xl
            bg-purple-50
            border
            border-purple-100
            p-4
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-medium
                  text-purple-600
                "
              >
                Rasio Retur
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-purple-900
                  mt-1
                "
              >

                {
                  (
                    filteredSummary.penjualan >
                    0
                      ? (
                          filteredSummary.retur /
                          filteredSummary.penjualan
                        ) *
                        100
                      : 0
                  ).toFixed(2)
                }%

              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-purple-100
                flex
                items-center
                justify-center
              "
            >

              <FaPercentage
                className="
                  text-purple-600
                "
              />

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* MINI INFO */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >

        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-gray-50
            border
            border-gray-200
            text-xs
            text-gray-600
          "
        >

          <FaWallet
            className="
              text-green-600
            "
          />

          Pencairan:

          <span
            className="
              font-bold
              text-gray-800
            "
          >
            {
              formatCurrency(
                filteredSummary.pencairan
              )
            }
          </span>

        </div>


        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-gray-50
            border
            border-gray-200
            text-xs
            text-gray-600
          "
        >

          <FaUndoAlt
            className="
              text-red-500
            "
          />

          Retur:

          <span
            className="
              font-bold
              text-gray-800
            "
          >
            {
              formatCurrency(
                filteredSummary.retur
              )
            }
          </span>

        </div>

      </div>


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="flex justify-end">
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
          <IoSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Cari transaksi / customer / principal / sales..."
            className="grow outline-none"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
          />
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

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              font-semibold
                            "
                          >

                            <span>
                              {
                                h.icon
                              }
                            </span>

                            {
                              h.label
                            }

                          </div>

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

                        <FaChartLine
                          className="
                            text-4xl
                            text-gray-300
                            mx-auto
                            mb-3
                          "
                        />

                        <p
                          className="
                            font-medium
                          "
                        >
                          {loading ? "Memuat data report sales..." : "Tidak ada data sales"}
                        </p>

                        <p
                          className="
                            text-xs
                            mt-1
                          "
                        >
                          Coba ubah pencarian
                          atau filter.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    paginatedData.map(
                      (
                        v,
                        i
                      ) => {

                        const netSales =
                          Number(
                            v.penjualan ||
                            0
                          ) -
                          Number(
                            v.retur ||
                            0
                          );

                        const sisaPencairan =
                          Number(
                            v.sisaPencairan ??
                            (netSales - Number(v.pencairan || 0))
                          );

                        return (

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


                            {/* SALES */}

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
                                  text-gray-700
                                "
                              >

                                <FaUserTie
                                  className="
                                    text-gray-400
                                  "
                                />

                                {
                                  v.sales
                                }

                              </div>

                            </td>


                            {/* PENJUALAN */}

                            <td
                              className="
                                px-4
                                py-3
                                whitespace-nowrap
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  openDetailPenjualan(
                                    v
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  px-2.5
                                  py-1
                                  rounded-full
                                  bg-blue-50
                                  border
                                  border-blue-200
                                  text-blue-700
                                  hover:bg-blue-100
                                  hover:border-blue-300
                                  hover:text-blue-900
                                  font-semibold
                                  text-xs
                                  cursor-pointer
                                  transition
                                  duration-150
                                "
                                title="Klik untuk melihat detail produk per invoice"
                              >

                                <FaFileInvoice
                                  className="
                                    text-blue-500
                                  "
                                />

                                {
                                  formatCurrency(
                                    v.penjualan
                                  )
                                }

                                <span
                                  className="
                                    text-[9px]
                                    font-bold
                                    opacity-70
                                  "
                                >
                                  Detail
                                </span>

                              </button>

                            </td>


                            {/* RETUR */}

                            <td
                              className="
                                px-4
                                py-3
                                whitespace-nowrap
                              "
                            >

                              {Number(v.retur || 0) > 0 ? (

                                <button
                                  type="button"
                                  onClick={() =>
                                    openDetailMetric(
                                      v,
                                      "RETUR"
                                    )
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-2.5
                                    py-1
                                    rounded-full
                                    bg-red-50
                                    border
                                    border-red-200
                                    text-red-600
                                    hover:bg-red-100
                                    hover:border-red-300
                                    hover:text-red-700
                                    font-semibold
                                    text-xs
                                    cursor-pointer
                                    transition
                                    duration-150
                                  "
                                  title="Klik untuk melihat detail retur"
                                >

                                  <FaUndoAlt
                                    className="
                                      text-red-500
                                    "
                                  />

                                  {
                                    formatCurrency(
                                      v.retur
                                    )
                                  }

                                </button>

                              ) : (

                                <span
                                  className="
                                    text-gray-400
                                    font-medium
                                  "
                                >
                                  -
                                </span>

                              )}

                            </td>


                            {/* NET SALES */}

                            <td
                              className="
                                px-4
                                py-3
                                whitespace-nowrap
                              "
                            >

                              <span
                                className="
                                  font-bold
                                  text-indigo-700
                                "
                              >
                                {
                                  formatCurrency(
                                    netSales
                                  )
                                }
                              </span>

                            </td>


                            {/* PENCAIRAN */}

                            <td
                              className="
                                px-4
                                py-3
                                whitespace-nowrap
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  openDetailMetric(
                                    v,
                                    "PENCAIRAN"
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  px-2.5
                                  py-1
                                  rounded-full
                                  bg-green-50
                                  border
                                  border-green-200
                                  text-green-700
                                  hover:bg-green-100
                                  hover:border-green-300
                                  hover:text-green-800
                                  font-semibold
                                  text-xs
                                  cursor-pointer
                                  transition
                                  duration-150
                                "
                                title="Klik untuk melihat detail pencairan"
                              >

                                <FaMoneyBillWave
                                  className="
                                    text-green-500
                                  "
                                />

                                {
                                  formatCurrency(
                                    v.pencairan
                                  )
                                }

                                <span
                                  className="
                                    text-[9px]
                                    font-bold
                                    opacity-70
                                  "
                                >
                                  Detail
                                </span>

                              </button>

                            </td>


                            {/* SISA PENCAIRAN */}

                            <td
                              className="
                                px-4
                                py-3
                                whitespace-nowrap
                              "
                            >

                              <span
                                className={`
                                  font-semibold
                                  ${
                                    sisaPencairan > 0
                                      ? "text-orange-600"
                                      : sisaPencairan < 0
                                        ? "text-red-600"
                                        : "text-gray-600"
                                  }
                                `}
                              >
                                {
                                  formatCurrency(
                                    sisaPencairan
                                  )
                                }
                              </span>

                            </td>

                          </tr>

                        );

                      }
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

              {/* INFO */}

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


                {/* ROW */}

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


              {/* PAGINATION */}

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
      {/* MODAL DETAIL RETUR / PENCAIRAN */}
      {/* ================================================= */}

      {
        isMetricModalOpen &&
        selectedMetric && (

          <div
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/50
              backdrop-blur-sm
              p-4
            "
            onClick={
              closeDetailMetric
            }
          >

            <div
              className="
                bg-white
                w-full
                max-w-7xl
                max-h-[92vh]
                rounded-2xl
                shadow-2xl
                overflow-hidden
                flex
                flex-col
              "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div
                className={`
                  px-6
                  py-4
                  text-white
                  flex
                  items-start
                  justify-between
                  gap-4
                  ${
                    selectedMetric.type ===
                    "RETUR"
                      ? "bg-red-600"
                      : "bg-green-600"
                  }
                `}
              >

                <div
                  className="
                    min-w-0
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
                      selectedMetric.type ===
                      "RETUR" ? (
                        <FaUndoAlt />
                      ) : (
                        <FaMoneyBillWave />
                      )
                    }

                    <h3
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      {
                        selectedMetric.type ===
                        "RETUR"
                          ? "Detail Retur"
                          : "Detail Pencairan"
                      }
                    </h3>
                    {selectedMetric.loading && (
                      <span className="text-xs text-white/80 animate-pulse">
                        Memuat detail dari API...
                      </span>
                    )}

                  </div>


                  <div
                    className="
                      mt-2
                      flex
                      flex-wrap
                      gap-x-5
                      gap-y-1
                      text-sm
                      text-white/90
                    "
                  >

                    <span>

                      Invoice:

                      <strong
                        className="
                          ml-1
                        "
                      >
                        {
                          selectedMetric
                            .item
                            .no_transaksi
                        }
                      </strong>

                    </span>


                    <span>

                      Customer:

                      <strong
                        className="
                          ml-1
                        "
                      >
                        {
                          selectedMetric
                            .item
                            .customer
                        }
                      </strong>

                    </span>


                    <span>

                      Sales:

                      <strong
                        className="
                          ml-1
                        "
                      >
                        {
                          selectedMetric
                            .item
                            .sales
                        }
                      </strong>

                    </span>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    closeDetailMetric
                  }
                  className="
                    w-9
                    h-9
                    shrink-0
                    rounded-full
                    bg-white/10
                    hover:bg-white/20
                    flex
                    items-center
                    justify-center
                    transition
                  "
                  title="Tutup"
                >
                  <FaTimes />
                </button>

              </div>


              {/* MODAL SUMMARY */}

              <div
                className="
                  p-5
                  border-b
                  border-gray-200
                  bg-slate-50
                "
              >

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-3
                  "
                >

                  {/* NILAI METRIC */}

                  <div
                    className={`
                      bg-white
                      border
                      rounded-xl
                      p-4
                      ${
                        selectedMetric.type ===
                        "RETUR"
                          ? "border-red-100"
                          : "border-green-100"
                      }
                    `}
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {
                        selectedMetric.type ===
                        "RETUR"
                          ? "Total Retur"
                          : "Total Pencairan"
                      }
                    </p>

                    <p
                      className={`
                        mt-1
                        text-lg
                        font-bold
                        ${
                          selectedMetric.type ===
                          "RETUR"
                            ? "text-red-700"
                            : "text-green-700"
                        }
                      `}
                    >
                      {
                        formatCurrency(
                          selectedMetric.type ===
                          "RETUR"
                            ? selectedMetric.item.retur
                            : selectedMetric.item.pencairan
                        )
                      }
                    </p>

                  </div>


                  {/* JUMLAH DETAIL */}

                  <div
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Jumlah Data
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {
                        selectedMetric
                          .detailData
                          ?.length || 0
                      }
                    </p>

                  </div>


                  {/* PRINCIPAL */}

                  <div
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Principal
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {
                        selectedMetric
                          .item
                          .principal
                      }
                    </p>

                  </div>


                  {/* TANGGAL */}

                  <div
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Tanggal
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {
                        formatDate(
                          selectedMetric
                            .item
                            .tanggal
                        )
                      }
                    </p>

                  </div>

                </div>

              </div>


              {/* DETAIL TABLE */}

              <div
                className="
                  flex-1
                  overflow-auto
                "
              >

                {
                  selectedMetric
                    .detailData
                    ?.length > 0 ? (

                    selectedMetric.type === "PENCAIRAN" ? (
                      <table className="table w-full">
                        <thead className="sticky top-0 z-20 text-white text-xs">
                          <tr className="bg-green-600">
                            <th className="px-4 py-3 whitespace-nowrap">No</th>
                            <th className="px-4 py-3 whitespace-nowrap">Billing No</th>
                            <th className="px-4 py-3 whitespace-nowrap">No Faktur</th>
                            <th className="px-4 py-3 whitespace-nowrap">Customer</th>
                            <th className="px-4 py-3 whitespace-nowrap">Sales</th>
                            <th className="px-4 py-3 whitespace-nowrap">Tanggal Pelunasan</th>
                            <th className="px-4 py-3 whitespace-nowrap text-right">Total Pembayaran</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedMetric.detailData.map((detail, index) => (
                            <tr key={`${detail["Billing No"] || detail.no_billing || index}-${index}`} className="border-b border-gray-100 hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-gray-600">{detail.No ?? index + 1}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-primary whitespace-nowrap">{detail["Billing No"] ?? detail.no_billing ?? "-"}</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">{detail["No Faktur"] ?? detail.no_faktur ?? "-"}</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">{detail["Bill to party"] ?? detail.bill_to_party ?? detail.customer ?? "-"}</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">{detail["Name Salesman"] ?? detail.nama_sales ?? detail.sales ?? "-"}</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">{formatDate(detail["Tanggal Pelunasan"] ?? detail.tanggal_pelunasan)}</td>
                              <td className="px-4 py-3 text-sm text-right font-bold text-green-700 whitespace-nowrap">{formatCurrency(detail["Total Pembayaran"] ?? detail.total_pembayaran ?? detail.nominal_bayar ?? 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="sticky bottom-0 bg-slate-100 border-t-2 border-gray-200">
                          <tr>
                            <td colSpan={6} className="px-4 py-4 text-right font-bold text-gray-700">Total Pembayaran</td>
                            <td className="px-4 py-4 text-right font-bold text-green-800 whitespace-nowrap">
                              {formatCurrency(selectedMetric.detailData.reduce((sum, detail) => sum + Number(detail["Total Pembayaran"] ?? detail.total_pembayaran ?? detail.nominal_bayar ?? 0), 0))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                    <table
                      className="
                        table
                        w-full
                      "
                    >

                      <thead
                        className="
                          sticky
                          top-0
                          z-20
                          text-white
                          text-xs
                        "
                      >

                        <tr
                          className={
                            selectedMetric.type ===
                            "RETUR"
                              ? "bg-red-600"
                              : "bg-green-600"
                          }
                        >

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >
                            No
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >
                            Billing No
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >
                            Posting Date
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              min-w-[260px]
                            "
                          >
                            Produk
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                              text-right
                            "
                          >
                            Qty
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                              text-right
                            "
                          >
                            Harga Unit
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                              text-right
                            "
                          >
                            Disc.
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                              text-right
                            "
                          >
                            {
                              selectedMetric.type ===
                              "RETUR"
                                ? "Total Retur"
                                : "Total Pencairan"
                            }
                          </th>

                          <th
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >
                            Principal
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {
                          selectedMetric
                            .detailData
                            .map(
                              (
                                detail,
                                index
                              ) => (

                                <tr
                                  key={`
                                    ${detail["Billing No"]}
                                    -
                                    ${detail.Material}
                                    -
                                    ${index}
                                  `}
                                  className="
                                    border-b
                                    border-gray-100
                                    hover:bg-slate-50
                                    transition
                                  "
                                >

                                  {/* NO */}

                                  <td
                                    className="
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      text-gray-600
                                    "
                                  >
                                    {
                                      index + 1
                                    }
                                  </td>


                                  {/* BILLING */}

                                  <td
                                    className="
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      text-primary
                                      whitespace-nowrap
                                    "
                                  >
                                    {
                                      detail[
                                        "Billing No"
                                      ]
                                    }
                                  </td>


                                  {/* DATE */}

                                  <td
                                    className="
                                      px-4
                                      py-3
                                      text-sm
                                      text-gray-600
                                      whitespace-nowrap
                                    "
                                  >
                                    {
                                      formatDate(
                                        detail[
                                          "Posting Date"
                                        ]
                                      )
                                    }
                                  </td>


                                  {/* PRODUCT */}

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
                                        min-w-[230px]
                                      "
                                    >

                                      <div
                                        className={`
                                          w-9
                                          h-9
                                          shrink-0
                                          rounded-lg
                                          flex
                                          items-center
                                          justify-center
                                          ${
                                            selectedMetric.type ===
                                            "RETUR"
                                              ? "bg-red-50 text-red-600"
                                              : "bg-green-50 text-green-600"
                                          }
                                        `}
                                      >

                                        <FaBoxOpen />

                                      </div>


                                      <div
                                        className="
                                          min-w-0
                                        "
                                      >

                                        <p
                                          className="
                                            font-semibold
                                            text-gray-800
                                          "
                                        >
                                          {
                                            detail[
                                              "Text Material"
                                            ]
                                          }
                                        </p>

                                        <p
                                          className="
                                            text-xs
                                            text-gray-500
                                          "
                                        >
                                          Material:{" "}

                                          {
                                            detail[
                                              "Material"
                                            ]
                                          }

                                        </p>

                                        <p
                                          className="
                                            text-xs
                                            text-gray-400
                                          "
                                        >
                                          {
                                            detail[
                                              "Prod. Hierarchy3"
                                            ]
                                          }
                                        </p>

                                      </div>

                                    </div>

                                  </td>


                                  {/* QTY */}

                                  <td
                                    className="
                                      px-4
                                      py-3
                                      text-sm
                                      text-right
                                      whitespace-nowrap
                                    "
                                  >

                                    <span
                                      className="
                                        font-semibold
                                      "
                                    >
                                      {
                                        detail[
                                          "Quantity"
                                        ]
                                      }
                                    </span>

                                    {" "}

                                    <span
                                      className="
                                        text-gray-400
                                      "
                                    >
                                      {
                                        detail[
                                          "Sales Unit"
                                        ]
                                      }
                                    </span>

                                  </td>


                                  {/* UNIT PRICE */}

                                  <td
                                    className="
                                      px-4
                                      py-3
                                      text-sm
                                      text-right
                                      whitespace-nowrap
                                    "
                                  >
                                    {
                                      formatCurrency(
                                        detail[
                                          "Unit Price Penjualan"
                                        ]
                                      )
                                    }
                                  </td>


                                  {/* DISCOUNT */}

                                  <td
                                    className="
                                      px-4
                                      py-3
                                      text-sm
                                      text-right
                                      whitespace-nowrap
                                    "
                                  >

                                    <div
                                      className="
                                        font-semibold
                                        text-red-600
                                      "
                                    >
                                      {
                                        formatCurrency(
                                          detail[
                                            "Total Discount"
                                          ]
                                        )
                                      }
                                    </div>

                                    <div
                                      className="
                                        text-xs
                                        text-gray-400
                                      "
                                    >
                                      ZD03:{" "}

                                      {
                                        detail[
                                          "Dis% (ZD03)"
                                        ]
                                      }%

                                    </div>

                                  </td>


                                  {/* TOTAL METRIC */}

                                  <td
                                    className={`
                                      px-4
                                      py-3
                                      text-right
                                      whitespace-nowrap
                                      font-bold
                                      ${
                                        selectedMetric.type ===
                                        "RETUR"
                                          ? "text-red-700"
                                          : "text-green-700"
                                      }
                                    `}
                                  >
                                    {
                                      formatCurrency(
                                        selectedMetric.type ===
                                        "RETUR"
                                          ? detail[
                                              "Total Retur"
                                            ]
                                          : detail[
                                              "Total Pencairan"
                                            ]
                                      )
                                    }
                                  </td>


                                  {/* PRINCIPAL */}

                                  <td
                                    className="
                                      px-4
                                      py-3
                                      text-sm
                                      whitespace-nowrap
                                    "
                                  >

                                    <p
                                      className="
                                        font-semibold
                                        text-gray-700
                                      "
                                    >
                                      {
                                        detail[
                                          "Name Principle"
                                        ]
                                      }
                                    </p>

                                    <p
                                      className="
                                        text-xs
                                        text-gray-400
                                      "
                                    >
                                      {
                                        detail[
                                          "Principle"
                                        ]
                                      }
                                    </p>

                                  </td>

                                </tr>

                              )
                            )
                        }

                      </tbody>


                      {/* DETAIL FOOTER */}

                      <tfoot
                        className="
                          sticky
                          bottom-0
                          bg-slate-100
                          border-t-2
                          border-gray-200
                        "
                      >

                        <tr>

                          <td
                            colSpan={7}
                            className="
                              px-4
                              py-4
                              text-right
                              font-bold
                              text-gray-700
                            "
                          >
                            Total
                          </td>

                          <td
                            className={`
                              px-4
                              py-4
                              text-right
                              font-bold
                              whitespace-nowrap
                              ${
                                selectedMetric.type ===
                                "RETUR"
                                  ? "text-red-800"
                                  : "text-green-800"
                              }
                            `}
                          >
                            {
                              formatCurrency(
                                selectedMetric
                                  .detailData
                                  .reduce(
                                    (
                                      sum,
                                      item
                                    ) =>
                                      sum +
                                      Number(
                                        selectedMetric.type ===
                                        "RETUR"
                                          ? item[
                                              "Total Retur"
                                            ] || 0
                                          : item[
                                              "Total Pencairan"
                                            ] || 0
                                      ),
                                    0
                                  )
                              )
                            }
                          </td>

                          <td />

                        </tr>

                      </tfoot>

                    </table>
                    )

                  ) : (

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        min-h-[280px]
                        text-gray-400
                        p-6
                      "
                    >

                      {
                        selectedMetric.type ===
                        "RETUR" ? (
                          <FaUndoAlt
                            className="
                              text-4xl
                              mb-3
                              text-red-300
                            "
                          />
                        ) : (
                          <FaMoneyBillWave
                            className="
                              text-4xl
                              mb-3
                              text-green-300
                            "
                          />
                        )
                      }

                      <p
                        className="
                          font-semibold
                          text-gray-500
                        "
                      >
                        Tidak ada detail data
                      </p>

                      <p
                        className="
                          text-xs
                          mt-1
                        "
                      >
                        Data billing belum tersedia.
                      </p>

                    </div>

                  )
                }

              </div>


              {/* MODAL FOOTER */}

              <div
                className="
                  px-6
                  py-3
                  border-t
                  border-gray-200
                  bg-white
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                "
              >

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >

                  <FaUser
                    className="
                      inline
                      mr-1
                    "
                  />

                  {
                    selectedMetric
                      .item
                      .sales
                  }

                  <span
                    className="
                      mx-2
                    "
                  >
                    •
                  </span>

                  <FaMapMarkerAlt
                    className="
                      inline
                      mr-1
                    "
                  />

                  {
                    selectedMetric
                      .item
                      .customer
                  }

                </div>


                <button
                  type="button"
                  onClick={
                    closeDetailMetric
                  }
                  className="
                    btn
                    btn-sm
                    rounded-full
                    bg-primary
                    hover:bg-primary/90
                    text-white
                    border-0
                    px-5
                  "
                >
                  Tutup
                </button>

              </div>

            </div>

          </div>

        )
      }


      {/* ================================================= */}
      {/* MODAL DETAIL PENJUALAN */}
      {/* ================================================= */}

      {
        isDetailModalOpen &&
        selectedPenjualan && (

          <div
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/50
              backdrop-blur-sm
              p-4
            "
            onClick={
              closeDetailPenjualan
            }
          >

            <div
              className="
                bg-white
                w-full
                max-w-7xl
                max-h-[92vh]
                rounded-2xl
                shadow-2xl
                overflow-hidden
                flex
                flex-col
              "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div
                className="
                  px-6
                  py-4
                  bg-primary
                  text-white
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div
                  className="
                    min-w-0
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <FaFileInvoice />

                    <h3
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      Detail Penjualan
                    </h3>

                  </div>


                  <div
                    className="
                      mt-2
                      flex
                      flex-wrap
                      gap-x-5
                      gap-y-1
                      text-sm
                      text-white/90
                    "
                  >

                    <span>

                      Invoice:

                      <strong
                        className="
                          ml-1
                        "
                      >
                        {
                          selectedPenjualan
                            .no_transaksi
                        }
                      </strong>

                    </span>


                    <span>

                      Customer:

                      <strong
                        className="
                          ml-1
                        "
                      >
                        {
                          selectedPenjualan
                            .customer
                        }
                      </strong>

                    </span>


                    <span>

                      Sales:

                      <strong
                        className="
                          ml-1
                        "
                      >
                        {
                          selectedPenjualan
                            .sales
                        }
                      </strong>

                    </span>

                  </div>

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                    shrink-0
                  "
                >

                  <button
                    type="button"
                    onClick={
                      exportDetailPenjualanToExcel
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-white
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-primary
                      shadow-sm
                      hover:bg-slate-50
                      transition
                    "
                    title="Export detail penjualan ke Excel"
                  >

                    <FaFileExcel />

                    Export Excel

                  </button>


                  <button
                    type="button"
                    onClick={
                      closeDetailPenjualan
                    }
                    className="
                      w-9
                      h-9
                      shrink-0
                      rounded-full
                      bg-white/10
                      hover:bg-white/20
                      flex
                      items-center
                      justify-center
                      transition
                    "
                    title="Tutup"
                  >

                    <FaTimes />

                  </button>

                </div>

              </div>


              {/* MODAL SUMMARY */}

              <div
                className="
                  p-5
                  border-b
                  border-gray-200
                  bg-slate-50
                "
              >

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-3
                  "
                >

                  {/* TOTAL PENJUALAN */}

                  <div
                    className="
                      bg-white
                      border
                      border-blue-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Total Penjualan
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-blue-700
                      "
                    >
                      {
                        formatCurrency(
                          selectedPenjualan
                            .penjualan
                        )
                      }
                    </p>

                  </div>


                  {/* JUMLAH DETAIL */}

                  <div
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Jumlah Data
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {
                        selectedPenjualan
                          .detailPenjualan
                          ?.length ||
                        0
                      }
                    </p>

                  </div>


                  {/* PRINCIPAL */}

                  <div
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Principal
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {
                        selectedPenjualan
                          .principal
                      }
                    </p>

                  </div>


                  {/* TANGGAL */}

                  <div
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Tanggal
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {
                        formatDate(
                          selectedPenjualan
                            .tanggal
                        )
                      }
                    </p>

                  </div>

                </div>

              </div>


              {/* DETAIL TABLE */}

              <div
                className="
                  flex-1
                  overflow-auto
                "
              >

                <table className="table w-full">
  <thead className="sticky top-0 z-10 bg-blue-900 text-white">
    <tr>
      {[
        "No",
        "Billing No",
        "No Faktur",
        "Document Type",
        "Bill to Party",
        "Salesman",
        "Name Salesman",
        "Cabang",
        "Principal",
        "Posting Date",
        "Jatuh Tempo",
        "Total Penjualan",
        "Tax Amount",
        "PPH",
        "Aging",
      ].map((column) => (
        <th key={column} className="px-4 py-3 whitespace-nowrap text-xs font-semibold">
          {column}
        </th>
      ))}
    </tr>
  </thead>

  <tbody>
    {(selectedPenjualan.detailPenjualan || []).map((detail, index) => (
      <tr
        key={`${detail["Billing No"] || index}-${index}`}
        className="border-b border-gray-100 hover:bg-blue-50 transition"
      >
        <td className="px-4 py-3 text-sm">{detail["No"] ?? index + 1}</td>
        <td className="px-4 py-3 text-sm font-semibold text-blue-700 whitespace-nowrap">
          {detail["Billing No"] || "-"}
        </td>
        <td className="px-4 py-3 text-sm whitespace-nowrap">{detail["No Faktur"] || "-"}</td>
        <td className="px-4 py-3 text-sm">{detail["Document Type"] || "-"}</td>
        <td className="px-4 py-3 text-sm">{detail["Bill to party"] || "-"}</td>
        <td className="px-4 py-3 text-sm">{detail["Salesman"] || "-"}</td>
        <td className="px-4 py-3 text-sm">{detail["Name Salesman"] || "-"}</td>
        <td className="px-4 py-3 text-sm">{detail["Desc. S.Office"] || "-"}</td>
        <td className="px-4 py-3 text-sm">{detail["Name Principle"] || "-"}</td>
        <td className="px-4 py-3 text-sm whitespace-nowrap">{formatDate(detail["Posting Date"])}</td>
        <td className="px-4 py-3 text-sm whitespace-nowrap">{formatDate(detail["Jatuh Tempo"])}</td>
        <td className="px-4 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">
          {formatCurrency(detail["Total Penjualan"])}
        </td>
        <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
          {formatCurrency(detail["Tax Amount"])}
        </td>
        <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
          {formatCurrency(detail["PPH"])}
        </td>
        <td className="px-4 py-3 text-sm text-right">{detail["Aging"] ?? "-"}</td>
      </tr>
    ))}
  </tbody>

  <tfoot className="sticky bottom-0 bg-slate-100 border-t-2 border-gray-200">
    <tr>
      <td colSpan={11} className="px-4 py-4 text-right font-bold text-gray-700">
        Total
      </td>
      <td className="px-4 py-4 text-right font-bold text-blue-800 whitespace-nowrap">
        {formatCurrency((selectedPenjualan.detailPenjualan || []).reduce(
          (sum, item) => sum + Number(item["Total Penjualan"] || 0), 0
        ))}
      </td>
      <td className="px-4 py-4 text-right font-semibold whitespace-nowrap">
        {formatCurrency((selectedPenjualan.detailPenjualan || []).reduce(
          (sum, item) => sum + Number(item["Tax Amount"] || 0), 0
        ))}
      </td>
      <td className="px-4 py-4 text-right font-semibold whitespace-nowrap">
        {formatCurrency((selectedPenjualan.detailPenjualan || []).reduce(
          (sum, item) => sum + Number(item["PPH"] || 0), 0
        ))}
      </td>
      <td />
    </tr>
  </tfoot>
</table>

              </div>


              {/* ================================================= */}
              {/* MODAL FOOTER */}
              {/* ================================================= */}

              <div
                className="
                  px-6
                  py-3
                  border-t
                  border-gray-200
                  bg-white
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                "
              >

                <div
                  className="
                    text-xs
                    text-gray-500
                  "
                >

                  <FaUser
                    className="
                      inline
                      mr-1
                    "
                  />

                  {
                    selectedPenjualan
                      .sales
                  }

                  <span
                    className="
                      mx-2
                    "
                  >
                    •
                  </span>

                  <FaMapMarkerAlt
                    className="
                      inline
                      mr-1
                    "
                  />

                  {
                    selectedPenjualan
                      .customer
                  }

                </div>


                <button
                  type="button"
                  onClick={
                    closeDetailPenjualan
                  }
                  className="
                    btn
                    btn-sm
                    rounded-full
                    bg-primary
                    hover:bg-primary/90
                    text-white
                    border-0
                    px-5
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


export default TableReportSales;