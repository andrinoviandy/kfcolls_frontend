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
import * as XLSX from "xlsx";


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
// ATTACH DETAIL TO EVERY TRANSACTION
// =====================================================

const dummyData =
  baseData.map(
    (item, index) => ({

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

      detailPenjualan:
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
        }),

    })
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
  // STATE
  // ===================================================

  const [
    allData,
    setAllData,
  ] = useState(
    dummyData
  );

  const [
    keyword,
    setKeyword,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    perPage,
    setPerPage,
  ] = useState(10);

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


  const openDetailPenjualan =
    (item) => {

      setSelectedPenjualan(
        item
      );

      setIsDetailModalOpen(
        true
      );
    };


  const closeDetailPenjualan =
    () => {

      setIsDetailModalOpen(
        false
      );

      setSelectedPenjualan(
        null
      );
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
  // FILTER STATE
  // ===================================================

  const initialFilter = {
    cabang: "Semua Cabang",
    principal: "Semua Principal",
    channel: "Semua Channel",
    customer: "Semua Customer",
    produk: "Semua Produk",
  };

  const [
    filter,
    setFilter,
  ] = useState(initialFilter);

  const [
    appliedFilter,
    setAppliedFilter,
  ] = useState(initialFilter);


  const handleFilterChange = (
    key,
    value
  ) => {
    setFilter((previous) => {
      const next = {
        ...previous,
        [key]: value,
      };

      // Jika channel berubah, customer dikembalikan ke semua customer
      // agar tidak membawa pilihan customer dari channel sebelumnya.
      if (key === "channel") {
        next.customer = "Semua Customer";
      }

      return next;
    });
  };


  const applyFilter = () => {
    setAppliedFilter({
      ...filter,
    });

    setCurrentPage(1);
  };


  const resetFilter = () => {
    setFilter({
      ...initialFilter,
    });

    setAppliedFilter({
      ...initialFilter,
    });

    setCurrentPage(1);
  };


  // ===================================================
  // FILTER OPTIONS
  // ===================================================

  const principalOptions =
    useMemo(
      () => [
        "Semua Principal",
        ...new Set(
          allData
            .map(
              (item) =>
                item.principal
            )
            .filter(Boolean)
        ),
      ],
      [
        allData,
      ]
    );


  const cabangOptions =
    useMemo(
      () => [
        "Semua Cabang",
        ...new Set(
          allData
            .map(
              (item) =>
                item.cabang
            )
            .filter(Boolean)
        ),
      ],
      [
        allData,
      ]
    );


  const channelOptions =
    useMemo(
      () => [
        "Semua Channel",
        ...new Set(
          allData
            .map(
              (item) =>
                item.channel
            )
            .filter(Boolean)
        ),
      ],
      [
        allData,
      ]
    );


  const customerOptions =
    useMemo(
      () => {
        const source =
          filter.channel ===
          "Semua Channel"
            ? allData
            : allData.filter(
                (item) =>
                  item.channel ===
                  filter.channel
              );

        return [
          "Semua Customer",
          ...new Set(
            source
              .map(
                (item) =>
                  item.customer
              )
              .filter(Boolean)
          ),
        ];
      },
      [
        allData,
        filter.channel,
      ]
    );


  const productOptions =
    useMemo(
      () => {
        const products = [];

        allData.forEach(
          (item) => {
            (item.detailPenjualan || [])
              .forEach(
                (detail) => {
                  const product =
                    detail[
                      "Text Material"
                    ];

                  if (product) {
                    products.push(product);
                  }
                }
              );
          }
        );

        return [
          "Semua Produk",
          ...new Set(products),
        ];
      },
      [
        allData,
      ]
    );


  // ===================================================
  // SUMMARY
  // ===================================================

  const summaryData =
    useMemo(
      () => {

        const totalPenjualan =
          allData.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.penjualan ||
                0
              ),
            0
          );

        const totalRetur =
          allData.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.retur ||
                0
              ),
            0
          );

        const totalPencairan =
          allData.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.pencairan ||
                0
              ),
            0
          );

        const netSales =
          totalPenjualan -
          totalRetur;

        const totalSisaPencairan =
          netSales -
          totalPencairan;

        const totalTransaksi =
          allData.length;

        const totalCustomer =
          new Set(
            allData
              .map(
                item =>
                  item.customer
              )
              .filter(Boolean)
          ).size;

        const totalReturPersentase =
          totalPenjualan > 0
            ? (
                totalRetur /
                totalPenjualan
              ) * 100
            : 0;

        return {

          totalPenjualan,

          totalRetur,

          totalPencairan,

          totalSisaPencairan,

          netSales,

          totalTransaksi,

          totalCustomer,

          totalReturPersentase,

        };

      },
      [
        allData,
      ]
    );


  // ===================================================
  // FILTER DATA
  // ===================================================

  const filteredData =
    useMemo(
      () => {
        let data = [
          ...allData,
        ];

        if (
          appliedFilter.cabang !==
          "Semua Cabang"
        ) {
          data = data.filter(
            (item) =>
              item.cabang ===
              appliedFilter.cabang
          );
        }

        if (
          appliedFilter.principal !==
          "Semua Principal"
        ) {
          data = data.filter(
            (item) =>
              item.principal ===
              appliedFilter.principal
          );
        }

        if (
          appliedFilter.channel !==
          "Semua Channel"
        ) {
          data = data.filter(
            (item) =>
              item.channel ===
              appliedFilter.channel
          );
        }

        if (
          appliedFilter.customer !==
          "Semua Customer"
        ) {
          data = data.filter(
            (item) =>
              item.customer ===
              appliedFilter.customer
          );
        }

        if (
          appliedFilter.produk !==
          "Semua Produk"
        ) {
          data = data.filter(
            (item) =>
              (item.detailPenjualan || [])
                .some(
                  (detail) =>
                    detail[
                      "Text Material"
                    ] ===
                    appliedFilter.produk
                )
          );
        }

        // Search tetap bekerja seperti sebelumnya.
        if (
          keyword.trim()
        ) {
          const search =
            keyword
              .toLowerCase()
              .trim();

          data = data.filter(
            (item) =>
              item.no_transaksi
                ?.toLowerCase()
                .includes(search)
              ||
              item.customer
                ?.toLowerCase()
                .includes(search)
              ||
              item.principal
                ?.toLowerCase()
                .includes(search)
              ||
              item.sales
                ?.toLowerCase()
                .includes(search)
              ||
              item.cabang
                ?.toLowerCase()
                .includes(search)
              ||
              item.channel
                ?.toLowerCase()
                .includes(search)
          );
        }

        return data;
      },
      [
        allData,
        keyword,
        appliedFilter,
      ]
    );


  // ===================================================
  // FILTERED SUMMARY
  // ===================================================

  const filteredSummary =
    useMemo(
      () => {

        const totalPenjualan =
          filteredData.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.penjualan ||
                0
              ),
            0
          );

        const totalRetur =
          filteredData.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.retur ||
                0
              ),
            0
          );

        const totalPencairan =
          filteredData.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.pencairan ||
                0
              ),
            0
          );

        const netSales =
          totalPenjualan -
          totalRetur;

        const sisaPencairan =
          netSales -
          totalPencairan;

        return {

          penjualan:
            totalPenjualan,

          retur:
            totalRetur,

          pencairan:
            totalPencairan,

          sisaPencairan,

          netSales,

        };

      },
      [
        filteredData,
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
      ) * perPage,

      currentPage *
      perPage
    );


  // ===================================================
  // RESET PAGE
  // ===================================================

  useEffect(
    () => {

      setCurrentPage(
        1
      );

    },
    [
      keyword,
      appliedFilter,
      perPage,
    ]
  );


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

          <span
            className="
              w-1.5
              h-1.5
              rounded-full
              bg-current
            "
          />

          {
            config.label
          }

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
            onChange={
              (e) =>
                setKeyword(
                  e.target.value
                )
            }
          />

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
                Object.values(
                  appliedFilter
                ).every(
                  (value) =>
                    !value ||
                    value.startsWith?.("Semua ")
                )
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
            <label
              className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Cabang
            </label>

            <select
              value={
                filter.cabang
              }
              onChange={(e) =>
                handleFilterChange(
                  "cabang",
                  e.target.value
                )
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            >
              {cabangOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>


          {/* PRINCIPAL */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Principal
            </label>

            <select
              value={
                filter.principal
              }
              onChange={(e) =>
                handleFilterChange(
                  "principal",
                  e.target.value
                )
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            >
              {principalOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>


          {/* CHANNEL */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Channel
            </label>

            <select
              value={
                filter.channel
              }
              onChange={(e) =>
                handleFilterChange(
                  "channel",
                  e.target.value
                )
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            >
              {channelOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>


          {/* CUSTOMER */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Customer
            </label>

            <select
              value={
                customerOptions.includes(
                  filter.customer
                )
                  ? filter.customer
                  : "Semua Customer"
              }
              onChange={(e) =>
                handleFilterChange(
                  "customer",
                  e.target.value
                )
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            >
              {customerOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            {
              filter.channel !==
                "Semua Channel" && (
                <p
                  className="
                    text-[9px]
                    text-blue-500
                    mt-1
                  "
                >
                  Customer mengikuti Channel {" "}
                  <span className="font-bold">
                    {filter.channel}
                  </span>
                </p>
              )
            }
          </div>


          {/* PRODUK */}
          <div>
            <label
              className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Produk
            </label>

            <select
              value={
                filter.produk
              }
              onChange={(e) =>
                handleFilterChange(
                  "produk",
                  e.target.value
                )
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-gray-200
                bg-white
                text-sm
                text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            >
              {productOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
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
            {appliedFilter.cabang}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-semibold">
            {appliedFilter.principal}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-semibold">
            {appliedFilter.channel}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold max-w-[250px] truncate">
            {appliedFilter.customer}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-semibold max-w-[250px] truncate">
            {appliedFilter.produk}
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
                title={
                  formatCurrency(
                    filteredSummary.penjualan
                  )
                }
              >
                {
                  formatCurrency(
                    filteredSummary.penjualan
                  )
                }
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
                {
                  formatCurrency(
                    filteredSummary.retur
                  )
                }
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
                {
                  formatCurrency(
                    filteredSummary.pencairan
                  )
                }
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
                {
                  formatCurrency(
                    filteredSummary.netSales
                  )
                }
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
                  filteredData.length
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
                          Tidak ada data sales
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
                          netSales -
                          Number(
                            v.pencairan ||
                            0
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
                                  font-semibold
                                  text-blue-700
                                  hover:text-blue-900
                                  hover:underline
                                  cursor-pointer
                                  transition
                                  duration-150
                                "
                                title="
                                  Klik untuk melihat
                                  detail produk per invoice
                                "
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

                              <span
                                className="
                                  font-semibold
                                  text-red-600
                                "
                              >

                                {
                                  Number(
                                    v.retur ||
                                    0
                                  ) > 0
                                    ? formatCurrency(
                                        v.retur
                                      )
                                    : "-"
                                }

                              </span>

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

                              <span
                                className="
                                  font-semibold
                                  text-green-700
                                "
                              >
                                {
                                  formatCurrency(
                                    v.pencairan
                                  )
                                }
                              </span>

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
                      Jumlah Detail Produk
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
                      bg-primary
                      text-white
                      text-xs
                    "
                  >

                    <tr>

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
                        Total Penjualan
                      </th>

                      <th
                        className="
                          px-4
                          py-3
                          whitespace-nowrap
                          text-right
                        "
                      >
                        Tax
                      </th>

                      <th
                        className="
                          px-4
                          py-3
                          whitespace-nowrap
                          text-right
                        "
                      >
                        COGS
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
                      (
                        selectedPenjualan
                          .detailPenjualan ||
                        []
                      ).map(
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
                              hover:bg-blue-50
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
                                  className="
                                    w-9
                                    h-9
                                    shrink-0
                                    rounded-lg
                                    bg-blue-50
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                  "
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


                            {/* TOTAL */}

                            <td
                              className="
                                px-4
                                py-3
                                text-right
                                whitespace-nowrap
                              "
                            >

                              <span
                                className="
                                  font-bold
                                  text-blue-700
                                "
                              >
                                {
                                  formatCurrency(
                                    detail[
                                      "Total Penjualan"
                                    ]
                                  )
                                }
                              </span>

                            </td>


                            {/* TAX */}

                            <td
                              className="
                                px-4
                                py-3
                                text-right
                                whitespace-nowrap
                                text-sm
                                text-gray-600
                              "
                            >
                              {
                                formatCurrency(
                                  detail[
                                    "Tax Amount"
                                  ]
                                )
                              }
                            </td>


                            {/* COGS */}

                            <td
                              className="
                                px-4
                                py-3
                                text-right
                                whitespace-nowrap
                                text-sm
                                text-gray-600
                              "
                            >
                              {
                                formatCurrency(
                                  detail[
                                    "Total COGS"
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

                                    {/* ================================================= */}
                  {/* DETAIL FOOTER */}
                  {/* ================================================= */}

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


                      {/* TOTAL PENJUALAN */}

                      <td
                        className="
                          px-4
                          py-4
                          text-right
                          font-bold
                          text-blue-800
                          whitespace-nowrap
                        "
                      >

                        {
                          formatCurrency(
                            (
                              selectedPenjualan
                                .detailPenjualan ||
                              []
                            ).reduce(
                              (
                                sum,
                                item
                              ) =>
                                sum +
                                Number(
                                  item[
                                    "Total Penjualan"
                                  ] ||
                                  0
                                ),
                              0
                            )
                          )
                        }

                      </td>


                      {/* TOTAL TAX */}

                      <td
                        className="
                          px-4
                          py-4
                          text-right
                          font-semibold
                          text-gray-700
                          whitespace-nowrap
                        "
                      >

                        {
                          formatCurrency(
                            (
                              selectedPenjualan
                                .detailPenjualan ||
                              []
                            ).reduce(
                              (
                                sum,
                                item
                              ) =>
                                sum +
                                Number(
                                  item[
                                    "Tax Amount"
                                  ] ||
                                  0
                                ),
                              0
                            )
                          )
                        }

                      </td>


                      {/* TOTAL COGS */}

                      <td
                        className="
                          px-4
                          py-4
                          text-right
                          font-semibold
                          text-gray-700
                          whitespace-nowrap
                        "
                      >

                        {
                          formatCurrency(
                            (
                              selectedPenjualan
                                .detailPenjualan ||
                              []
                            ).reduce(
                              (
                                sum,
                                item
                              ) =>
                                sum +
                                Number(
                                  item[
                                    "Total COGS"
                                  ] ||
                                  0
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