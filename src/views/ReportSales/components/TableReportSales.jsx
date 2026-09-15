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
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {

  if (!date) {
    return "-";
  }

  const parsedDate =
    new Date(date);

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
// DUMMY DATA REPORT SALES
// =====================================================
//
// Nanti dummyData ini bisa langsung diganti
// dengan response API / Redux action.
//
// Field utama:
//
// penjualan
// retur
// pencairan
//
// =====================================================

const dummyData = [

  {
    id: 1,
    tanggal: "2026-09-01",
    no_transaksi: "SAL-2026-00001",
    customer: "Dinas Kesehatan Kota Medan",
    principal: "BIOFARMA",
    sales: "Andi",
    penjualan: 150000000,
    retur: 10000000,
    pencairan: 125000000,
    status: "SELESAI",
  },

  {
    id: 2,
    tanggal: "2026-09-02",
    no_transaksi: "SAL-2026-00002",
    customer: "RSUD Pasuruan",
    principal: "KIMIA FARMA",
    sales: "Budi",
    penjualan: 225000000,
    retur: 15000000,
    pencairan: 180000000,
    status: "SELESAI",
  },

  {
    id: 3,
    tanggal: "2026-09-03",
    no_transaksi: "SAL-2026-00003",
    customer: "Apotek Maju Djaya",
    principal: "PHAPROS",
    sales: "Citra",
    penjualan: 85000000,
    retur: 5000000,
    pencairan: 65000000,
    status: "SELESAI",
  },

  {
    id: 4,
    tanggal: "2026-09-04",
    no_transaksi: "SAL-2026-00004",
    customer: "RS Hermina Medan",
    principal: "AMAROX",
    sales: "Dedi",
    penjualan: 175000000,
    retur: 20000000,
    pencairan: 135000000,
    status: "PROSES",
  },

  {
    id: 5,
    tanggal: "2026-09-05",
    no_transaksi: "SAL-2026-00005",
    customer: "Apotek Sehat Sentosa",
    principal: "SANBE",
    sales: "Eko",
    penjualan: 95000000,
    retur: 7500000,
    pencairan: 70000000,
    status: "SELESAI",
  },

  {
    id: 6,
    tanggal: "2026-09-06",
    no_transaksi: "SAL-2026-00006",
    customer: "Klinik Medika Utama",
    principal: "BIOFARMA",
    sales: "Andi",
    penjualan: 120000000,
    retur: 0,
    pencairan: 95000000,
    status: "SELESAI",
  },

  {
    id: 7,
    tanggal: "2026-09-07",
    no_transaksi: "SAL-2026-00007",
    customer: "RS Siloam Medan",
    principal: "KIMIA FARMA",
    sales: "Budi",
    penjualan: 275000000,
    retur: 25000000,
    pencairan: 210000000,
    status: "SELESAI",
  },

  {
    id: 8,
    tanggal: "2026-09-08",
    no_transaksi: "SAL-2026-00008",
    customer: "Dinas Kesehatan Deli Serdang",
    principal: "PHAPROS",
    sales: "Citra",
    penjualan: 145000000,
    retur: 10000000,
    pencairan: 110000000,
    status: "PROSES",
  },

  {
    id: 9,
    tanggal: "2026-09-09",
    no_transaksi: "SAL-2026-00009",
    customer: "Apotek Kimia Sehat",
    principal: "AMAROX",
    sales: "Dedi",
    penjualan: 65000000,
    retur: 5000000,
    pencairan: 45000000,
    status: "SELESAI",
  },

  {
    id: 10,
    tanggal: "2026-09-10",
    no_transaksi: "SAL-2026-00010",
    customer: "RSUD Kota Bogor",
    principal: "SANBE",
    sales: "Eko",
    penjualan: 195000000,
    retur: 12000000,
    pencairan: 150000000,
    status: "SELESAI",
  },

  {
    id: 11,
    tanggal: "2026-09-11",
    no_transaksi: "SAL-2026-00011",
    customer: "Apotek Berkah Farma",
    principal: "BIOFARMA",
    sales: "Andi",
    penjualan: 110000000,
    retur: 8000000,
    pencairan: 85000000,
    status: "SELESAI",
  },

  {
    id: 12,
    tanggal: "2026-09-12",
    no_transaksi: "SAL-2026-00012",
    customer: "RS Jakarta Sehat",
    principal: "KIMIA FARMA",
    sales: "Budi",
    penjualan: 310000000,
    retur: 18000000,
    pencairan: 250000000,
    status: "PROSES",
  },

];


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
    selectedPrincipal,
    setSelectedPrincipal,
  ] = useState("ALL");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("ALL");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    perPage,
    setPerPage,
  ] = useState(10);


  // ===================================================
  // PRINCIPAL OPTIONS
  // ===================================================

  const principalOptions =
    useMemo(
      () => {

        return [
          ...new Set(
            allData
              .map(
                item =>
                  item.principal
              )
              .filter(Boolean)
          ),
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
              ) *
              100
            : 0;


        return {

          totalPenjualan,

          totalRetur,

          totalPencairan,

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


        // =============================================
        // PRINCIPAL
        // =============================================

        if (
          selectedPrincipal !==
          "ALL"
        ) {

          data =
            data.filter(
              item =>
                item.principal ===
                selectedPrincipal
            );

        }


        // =============================================
        // STATUS
        // =============================================

        if (
          selectedStatus !==
          "ALL"
        ) {

          data =
            data.filter(
              item =>
                item.status ===
                selectedStatus
            );

        }


        // =============================================
        // SEARCH
        // =============================================

        if (
          keyword.trim()
        ) {

          const search =
            keyword
              .toLowerCase()
              .trim();


          data =
            data.filter(
              item =>

                item.no_transaksi
                  ?.toLowerCase()
                  .includes(
                    search
                  )

                ||

                item.customer
                  ?.toLowerCase()
                  .includes(
                    search
                  )

                ||

                item.principal
                  ?.toLowerCase()
                  .includes(
                    search
                  )

                ||

                item.sales
                  ?.toLowerCase()
                  .includes(
                    search
                  )

            );

        }


        return data;

      },
      [
        allData,
        keyword,
        selectedPrincipal,
        selectedStatus,
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


        return {

          penjualan:
            totalPenjualan,

          retur:
            totalRetur,

          pencairan:
            totalPencairan,

          netSales:
            totalPenjualan -
            totalRetur,

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
      ) *
      perPage,

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
      selectedPrincipal,
      selectedStatus,
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
      icon: <FaHashtag />,
    },

    // {
    //   label: "Tanggal",
    //   icon: <FaCalendarAlt />,
    // },

    // {
    //   label: "No. Transaksi",
    //   icon: <FaClipboardList />,
    // },

    // {
    //   label: "Customer",
    //   icon: <FaBuilding />,
    // },

    // {
    //   label: "Principal",
    //   icon: <FaChartLine />,
    // },

    {
      label: "Sales",
      icon: <FaUserTie />,
    },

    {
      label: "Penjualan",
      icon: <FaShoppingCart />,
    },

    {
      label: "Retur",
      icon: <FaUndoAlt />,
    },

    {
      label: "Net Sales",
      icon: <FaChartLine />,
    },

    {
      label: "Pencairan",
      icon: <FaMoneyBillWave />,
    },

    // {
    //   label: "Status",
    //   icon: <FaClipboardList />,
    // },

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

      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-4
          items-stretch
          lg:items-center
        "
      >

        {/* SEARCH */}

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
              e =>
                setKeyword(
                  e.target.value
                )
            }
          />

        </div>


        {/* FILTER */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <span
            className="
              text-sm
              text-gray-500
            "
          >
            Filter:
          </span>


          {/* PRINCIPAL */}

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[160px]
            "
            value={
              selectedPrincipal
            }
            onChange={
              e =>
                setSelectedPrincipal(
                  e.target.value
                )
            }
          >

            <option value="ALL">
              Semua Principal
            </option>

            {
              principalOptions.map(
                principal => (

                  <option
                    key={
                      principal
                    }
                    value={
                      principal
                    }
                  >
                    {
                      principal
                    }
                  </option>

                )
              )
            }

          </select>


          {/* STATUS */}

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[150px]
            "
            value={
              selectedStatus
            }
            onChange={
              e =>
                setSelectedStatus(
                  e.target.value
                )
            }
          >

            <option value="ALL">
              Semua Status
            </option>

            <option value="SELESAI">
              Selesai
            </option>

            <option value="PROSES">
              Proses
            </option>

          </select>

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

        {/* ================================================= */}
        {/* PENJUALAN */}
        {/* ================================================= */}

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


        {/* ================================================= */}
        {/* RETUR */}
        {/* ================================================= */}

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
                title={
                  formatCurrency(
                    filteredSummary.retur
                  )
                }
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


        {/* ================================================= */}
        {/* PENCAIRAN */}
        {/* ================================================= */}

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
                title={
                  formatCurrency(
                    filteredSummary.pencairan
                  )
                }
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


        {/* ================================================= */}
        {/* NET SALES */}
        {/* ================================================= */}

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
                title={
                  formatCurrency(
                    filteredSummary.netSales
                  )
                }
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


        {/* ================================================= */}
        {/* TRANSAKSI */}
        {/* ================================================= */}

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


        {/* ================================================= */}
        {/* RETUR % */}
        {/* ================================================= */}

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

              {/* ================================================= */}
              {/* HEADER */}
              {/* ================================================= */}

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
                          key={
                            i
                          }
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


              {/* ================================================= */}
              {/* BODY */}
              {/* ================================================= */}

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
                          Coba ubah pencarian atau filter.
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


                            {/* TANGGAL */}

                            {/* <td
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
                                    v.tanggal
                                  )
                                }

                              </div>

                            </td> */}


                            {/* NO TRANSAKSI */}

                            {/* <td
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

                                  <FaClipboardList
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
                                    v.no_transaksi
                                  }
                                </span>

                              </div>

                            </td> */}


                            {/* CUSTOMER */}

                            {/* <td
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
                                    shrink-0
                                  "
                                >

                                  <FaBuilding />

                                </div>


                                <p
                                  className="
                                    font-semibold
                                    text-gray-700
                                  "
                                >
                                  {
                                    v.customer
                                  }
                                </p>

                              </div>

                            </td> */}


                            {/* PRINCIPAL */}

                            {/* <td
                              className="
                                px-4
                                py-3
                                whitespace-nowrap
                              "
                            >

                              <span
                                className="
                                  inline-flex
                                  items-center
                                  px-3
                                  py-1.5
                                  rounded-full
                                  bg-blue-50
                                  text-primary
                                  text-xs
                                  font-semibold
                                "
                              >
                                {
                                  v.principal
                                }
                              </span>

                            </td> */}


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

                              <span
                                className="
                                  font-semibold
                                  text-blue-700
                                "
                              >
                                {
                                  formatCurrency(
                                    v.penjualan
                                  )
                                }
                              </span>

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


                            {/* STATUS */}

                            {/* <td
                              className="
                                px-4
                                py-3
                              "
                            >

                              {
                                renderStatus(
                                  v.status
                                )
                              }

                            </td> */}

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

    </div>

  );

};


export default TableReportSales;