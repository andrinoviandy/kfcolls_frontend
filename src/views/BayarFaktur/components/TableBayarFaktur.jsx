import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaMoneyBillWave,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaFileInvoiceDollar,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaEllipsisV,
  FaHashtag,
  FaEye,
  FaInfoCircle,
  FaWallet,
  FaUniversity,
  FaCashRegister,
  FaFileUpload,
  FaCamera,
  FaTimes,
  FaCreditCard,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {

  if (!date) return "-";

  return new Date(date).toLocaleDateString(
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

const formatRupiah = (value) => {

  if (
    value === null ||
    value === undefined
  ) {
    return "Rp0";
  }

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }
  ).format(value);

};


// =====================================================
// DUMMY DATA
// =====================================================

const dummyData = [

  {
    id: 1,
    no_faktur: "10000271521",
    customer_id: "10000271521",
    nama_customer: "Dinas Kesehatan Kota Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Gatot Subroto No. 125, Medan",
    nominal_tagihan: 140000000,
    posting_date: "2026-08-01",
    due_date: "2026-08-22",
    sales: "Andri Noviandy",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 2,
    no_faktur: "10000271522",
    customer_id: "10000271522",
    nama_customer: "Apotek Maju Djaya",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Sisingamangaraja No. 88, Medan",
    nominal_tagihan: 85000000,
    posting_date: "2026-08-02",
    due_date: "2026-08-25",
    sales: "Budi Santoso",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 3,
    no_faktur: "10000271523",
    customer_id: "10000271523",
    nama_customer: "Apotek Rusli",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Iskandar Muda No. 45, Medan",
    nominal_tagihan: 140000000,
    posting_date: "2026-08-03",
    due_date: "2026-08-27",
    sales: "Citra Lestari",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 4,
    no_faktur: "10000271524",
    customer_id: "10000271524",
    nama_customer: "RSUD Pasuruan",
    nama_penagih: "KFTD Pasuruan",
    alamat: "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",
    nominal_tagihan: 175000000,
    posting_date: "2026-08-04",
    due_date: "2026-08-29",
    sales: "Dimas Pratama",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 5,
    no_faktur: "10000271525",
    customer_id: "10000271525",
    nama_customer: "RS Hermina Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Asrama No. 12, Medan",
    nominal_tagihan: 95000000,
    posting_date: "2026-08-05",
    due_date: "2026-08-30",
    sales: "Andri Noviandy",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 6,
    no_faktur: "10000271526",
    customer_id: "10000271526",
    nama_customer: "Apotek Sehat Sentosa",
    nama_penagih: "KFTD Jakarta",
    alamat: "Jl. Kelapa Gading Raya No. 21, Jakarta",
    nominal_tagihan: 65000000,
    posting_date: "2026-08-06",
    due_date: "2026-09-01",
    sales: "Budi Santoso",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 7,
    no_faktur: "10000271527",
    customer_id: "10000271527",
    nama_customer: "Klinik Medika Utama",
    nama_penagih: "KFTD Jakarta",
    alamat: "Jl. Boulevard Barat No. 30, Jakarta",
    nominal_tagihan: 72500000,
    posting_date: "2026-08-07",
    due_date: "2026-09-03",
    sales: "Citra Lestari",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 8,
    no_faktur: "10000271528",
    customer_id: "10000271528",
    nama_customer: "RS Siloam Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Imam Bonjol No. 5, Medan",
    nominal_tagihan: 210000000,
    posting_date: "2026-08-08",
    due_date: "2026-09-05",
    sales: "Dimas Pratama",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 9,
    no_faktur: "10000271529",
    customer_id: "10000271529",
    nama_customer: "Dinas Kesehatan Deli Serdang",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Negara No. 100, Deli Serdang",
    nominal_tagihan: 125000000,
    posting_date: "2026-08-09",
    due_date: "2026-09-07",
    sales: "Andri Noviandy",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 10,
    no_faktur: "10000271530",
    customer_id: "10000271530",
    nama_customer: "Apotek Kimia Sehat",
    nama_penagih: "KFTD Jakarta",
    alamat: "Jl. Sunter Agung No. 18, Jakarta",
    nominal_tagihan: 45000000,
    posting_date: "2026-08-10",
    due_date: "2026-09-10",
    sales: "Budi Santoso",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 11,
    no_faktur: "10000271531",
    customer_id: "10000271531",
    nama_customer: "RSUD Kota Bogor",
    nama_penagih: "KFTD Bogor",
    alamat: "Jl. Pajajaran No. 50, Bogor",
    nominal_tagihan: 185000000,
    posting_date: "2026-08-11",
    due_date: "2026-09-12",
    sales: "Citra Lestari",
    status: "BELUM_DIBAYAR",
  },

  {
    id: 12,
    no_faktur: "10000271532",
    customer_id: "10000271532",
    nama_customer: "Apotek Berkah Farma",
    nama_penagih: "KFTD Bogor",
    alamat: "Jl. Merdeka No. 12, Bogor",
    nominal_tagihan: 55000000,
    posting_date: "2026-08-12",
    due_date: "2026-09-15",
    sales: "Dimas Pratama",
    status: "BELUM_DIBAYAR",
  },

];


// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {

  BELUM_DIBAYAR: {
    label: "Belum Dibayar",
    icon: FaClock,
    className:
      "bg-amber-100 text-amber-700",
  },

  SUDAH_DIBAYAR: {
    label: "Sudah Dibayar",
    icon: FaCheckCircle,
    className:
      "bg-green-100 text-green-700",
  },

};


// =====================================================
// COMPONENT
// =====================================================

const TableBayarFaktur = ({
  dimensionScreenW,
  check,
  loginAccess,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [allData, setAllData] =
    useState(dummyData);

  const [keyword, setKeyword] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(10);

  const [selectedData, setSelectedData] =
    useState(null);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [paymentMethod, setPaymentMethod] =
    useState("GIRO");

  const [dueDateGiro, setDueDateGiro] =
    useState("");

  const [paymentFile, setPaymentFile] =
    useState(null);

  const [description, setDescription] =
    useState("");

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);


  // ===================================================
  // SUMMARY
  // ===================================================

  const summaryData = useMemo(() => {

    return {

      total:
        allData.length,

      belum_dibayar:
        allData.filter(
          x =>
            x.status ===
            "BELUM_DIBAYAR"
        ).length,

      sudah_dibayar:
        allData.filter(
          x =>
            x.status ===
            "SUDAH_DIBAYAR"
        ).length,

      total_nominal:
        allData
          .filter(
            x =>
              x.status ===
              "BELUM_DIBAYAR"
          )
          .reduce(
            (sum, x) =>
              sum +
              x.nominal_tagihan,
            0
          ),

    };

  }, [allData]);


  // ===================================================
  // FILTER
  // ===================================================

  const filteredData = useMemo(() => {

    let data = [...allData];


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


    if (
      keyword.trim()
    ) {

      const search =
        keyword
          .toLowerCase();

      data =
        data.filter(
          item =>

            item.no_faktur
              ?.toLowerCase()
              .includes(search)

            ||

            item.nama_customer
              ?.toLowerCase()
              .includes(search)

            ||

            item.nama_penagih
              ?.toLowerCase()
              .includes(search)

            ||

            item.sales
              ?.toLowerCase()
              .includes(search)

        );

    }


    return data;

  }, [
    allData,
    selectedStatus,
    keyword,
  ]);


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
      (currentPage - 1) *
      perPage,
      currentPage *
      perPage
    );


  useEffect(() => {

    setCurrentPage(1);

  }, [
    keyword,
    selectedStatus,
    perPage,
  ]);


  // ===================================================
  // SELECT CHECKBOX
  // ===================================================

  const handleSelectOne = (
    id
  ) => {

    setSelectedIds(
      prev => {

        if (
          prev.includes(id)
        ) {

          return prev.filter(
            x => x !== id
          );

        }

        return [
          ...prev,
          id,
        ];

      }
    );

  };


  // ===================================================
  // SELECT ALL
  // ===================================================

  const currentPageIds =
    paginatedData
      .map(
        item =>
          item.id
      );


  const isAllSelected =
    currentPageIds.length >
    0 &&
    currentPageIds.every(
      id =>
        selectedIds.includes(
          id
        )
    );


  const handleSelectAll = () => {

    if (
      isAllSelected
    ) {

      setSelectedIds(
        prev =>
          prev.filter(
            id =>
              !currentPageIds.includes(
                id
              )
          )
      );

    } else {

      setSelectedIds(
        prev => [

          ...new Set([
            ...prev,
            ...currentPageIds,
          ]),

        ]
      );

    }

  };


  // ===================================================
  // OPEN PAYMENT
  // ===================================================

  const openPayment = (
    data = null
  ) => {

    if (data) {

      setSelectedData(
        data
      );

    } else {

      const selected =
        allData.filter(
          item =>
            selectedIds.includes(
              item.id
            )
        );

      setSelectedData(
        selected
      );

    }

    setPaymentMethod(
      "GIRO"
    );

    setDueDateGiro(
      ""
    );

    setPaymentFile(
      null
    );

    setDescription(
      ""
    );

    setShowPaymentModal(
      true
    );

  };


  // ===================================================
  // CLOSE PAYMENT
  // ===================================================

  const closePayment = () => {

    setShowPaymentModal(
      false
    );

    setSelectedData(
      null
    );

  };


  // ===================================================
  // PROCESS PAYMENT
  // ===================================================

  const handlePayment = () => {

    const dataToPay =
      Array.isArray(
        selectedData
      )
        ? selectedData
        : [
          selectedData,
        ];

    const ids =
      dataToPay.map(
        item =>
          item.id
      );

    setAllData(
      prev =>
        prev.map(
          item =>

            ids.includes(
              item.id
            )
              ? {
                ...item,
                status:
                  "SUDAH_DIBAYAR",
                tanggal_pembayaran:
                  new Date()
                    .toISOString(),
                metode_pembayaran:
                  paymentMethod,
              }
              : item
        )
    );

    setSelectedIds(
      prev =>
        prev.filter(
          id =>
            !ids.includes(
              id
            )
        )
    );

    closePayment();

  };


  // ===================================================
  // STATUS
  // ===================================================

  const renderStatus = (
    status
  ) => {

    const config =
      statusConfig[
      status
      ];

    if (!config)
      return "-";

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
      icon: <FaHashtag />,
    },

    {
      label: "No. Faktur",
      icon:
        <FaFileInvoiceDollar />,
    },

    {
      label: "Customer",
      icon: <FaBuilding />,
    },

    {
      label: "Penagih",
      icon: <FaUser />,
    },

    {
      label: "Nominal Tagihan",
      icon: <FaMoneyBillWave />,
    },

    {
      label: "Posting Date",
      icon: <FaCalendarAlt />,
    },

    {
      label: "Due Date",
      icon: <FaCalendarAlt />,
    },

    {
      label: "Status",
      icon: <FaInfoCircle />,
    },

    {
      label: "Aksi",
      icon: <FaEllipsisV />,
    },

  ];


  // ===================================================
  // START END
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
  // PAYMENT DATA
  // ===================================================

  const paymentItems =
    Array.isArray(
      selectedData
    )
      ? selectedData
      : selectedData
        ? [selectedData]
        : [];

  const totalPayment =
    paymentItems.reduce(
      (
        total,
        item
      ) =>
        total +
        item.nominal_tagihan,
      0
    );


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="flex flex-col gap-5">


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          gap-4
          justify-between
          items-stretch
          lg:items-center
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
              text-lg
            "
          />

          <input
            type="text"
            placeholder="
              Cari faktur / customer / penagih...
            "
            className="grow"
            value={keyword}
            onChange={
              e =>
                setKeyword(
                  e.target.value
                )
            }
          />

        </div>


        {/* STATUS */}

        <div className="flex items-center gap-2">

          <span
            className="
              text-sm
              text-gray-500
            "
          >
            Status:
          </span>

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[180px]
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

            <option value="BELUM_DIBAYAR">
              Belum Dibayar
            </option>

            <option value="SUDAH_DIBAYAR">
              Sudah Dibayar
            </option>

          </select>

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

        <div
          className="
            rounded-2xl
            bg-blue-50
            p-4
            border
            border-blue-100
          "
        >

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-blue-700">
                Total Faktur
              </p>

              <p className="text-2xl font-bold text-blue-900">
                {summaryData.total}
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
                className="text-blue-600"
              />

            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            bg-amber-50
            p-4
            border
            border-amber-100
          "
        >

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-amber-700">
                Belum Dibayar
              </p>

              <p className="text-2xl font-bold text-amber-900">
                {summaryData.belum_dibayar}
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
                className="text-amber-600"
              />

            </div>

          </div>

        </div>


        <div
          className="
            rounded-2xl
            bg-green-50
            p-4
            border
            border-green-100
          "
        >

          <div className="flex justify-between">

            <div>

              <p className="text-sm text-green-700">
                Total Tagihan
              </p>

              <p className="text-xl font-bold text-green-900">
                {formatRupiah(
                  summaryData.total_nominal
                )}
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

              <FaMoneyBillWave
                className="text-green-600"
              />

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* BULK ACTION */}
      {/* ================================================= */}

      {selectedIds.length > 0 && (

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
            bg-blue-50
            border
            border-blue-200
            rounded-xl
            px-4
            py-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-blue-900
            "
          >

            <FaCheckCircle />

            <span>

              <b>
                {selectedIds.length}
              </b>

              {" "}faktur dipilih

            </span>

          </div>


          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                setSelectedIds([])
              }
              className="
                px-4
                py-2
                rounded-full
                border
                border-gray-300
                bg-white
                text-gray-600
                text-sm
                font-semibold
                hover:bg-gray-100
              "
            >
              Batal
            </button>


            <button
              type="button"
              onClick={() =>
                openPayment()
              }
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-2
                rounded-full
                bg-primary
                text-white
                text-sm
                font-semibold
                hover:opacity-90
                transition
                shadow-md
              "
            >

              <FaMoneyBillWave />

              Bayar Faktur (
              {selectedIds.length}
              )

            </button>

          </div>

        </div>

      )}


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

            <table className="table w-full">

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

                  {/* CHECK ALL */}

                  <th
                    className="
                      px-4
                      py-3
                      w-12
                    "
                  >

                    <input
                      type="checkbox"
                      className="
                        checkbox
                        checkbox-sm
                        checkbox-white
                      "
                      checked={
                        isAllSelected
                      }
                      onChange={
                        handleSelectAll
                      }
                    />

                  </th>


                  {headerTable.map(
                    (h, i) => (

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
                            {h.icon}
                          </span>

                          {h.label}

                        </div>

                      </th>

                    )
                  )}

                </tr>

              </thead>


              {/* BODY */}

              <tbody>

                {paginatedData.length === 0 ? (

                  <tr>

                    <td
                      colSpan={
                        headerTable.length +
                        1
                      }
                      className="
                        text-center
                        py-16
                        text-gray-500
                      "
                    >

                      <FaFileInvoiceDollar
                        className="
                          text-4xl
                          text-gray-300
                          mx-auto
                          mb-3
                        "
                      />

                      Tidak ada data faktur

                    </td>

                  </tr>

                ) : (

                  paginatedData.map(
                    (v, i) => (

                      <tr
                        key={v.id}
                        className="
                          hover:bg-blue-50
                          transition
                          duration-200
                          border-b
                        "
                      >

                        {/* CHECKBOX */}

                        <td
                          className="
                            px-4
                            py-3
                          "
                        >

                          <input
                            type="checkbox"
                            className="
                              checkbox
                              checkbox-sm
                              checkbox-primary
                            "
                            checked={
                              selectedIds.includes(
                                v.id
                              )
                            }
                            disabled={
                              v.status ===
                              "SUDAH_DIBAYAR"
                            }
                            onChange={() =>
                              handleSelectOne(
                                v.id
                              )
                            }
                          />

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

                          {(currentPage - 1) *
                            perPage +
                            i +
                            1}

                        </td>


                        {/* FAKTUR */}

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
                              {v.no_faktur}
                            </span>

                          </div>

                        </td>


                        {/* CUSTOMER */}

                        <td className="px-4 py-3">

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              min-w-[200px]
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
                                {v.nama_customer}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-gray-400
                                "
                              >
                                ID: {v.customer_id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* PENAGIH */}

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
                                w-8
                                h-8
                                rounded-full
                                bg-orange-50
                                flex
                                items-center
                                justify-center
                              "
                            >

                              <FaUser
                                className="
                                  text-orange-500
                                "
                              />

                            </div>

                            <span
                              className="
                                text-sm
                                font-medium
                                text-gray-700
                              "
                            >
                              {v.nama_penagih}
                            </span>

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
                              font-bold
                              text-gray-700
                            "
                          >
                            {formatRupiah(
                              v.nominal_tagihan
                            )}
                          </span>

                        </td>


                        {/* POSTING DATE */}

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
                              text-gray-600
                            "
                          >

                            <FaCalendarAlt
                              className="
                                text-primary
                              "
                            />

                            {formatDate(
                              v.posting_date
                            )}

                          </div>

                        </td>


                        {/* DUE DATE */}

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
                              text-gray-600
                            "
                          >

                            <FaCalendarAlt
                              className="
                                text-orange-500
                              "
                            />

                            {formatDate(
                              v.due_date
                            )}

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-3">

                          {renderStatus(
                            v.status
                          )}

                        </td>


                        {/* AKSI */}

                        <td
                          className="
                            px-4
                            py-3
                            whitespace-nowrap
                          "
                        >

                          {v.status ===
                            "BELUM_DIBAYAR" ? (

                            <button
                              type="button"
                              onClick={() =>
                                openPayment(
                                  v
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-full
                                bg-primary
                                text-white
                                text-xs
                                font-semibold
                                hover:opacity-90
                                transition
                                shadow-sm
                              "
                            >

                              <FaMoneyBillWave />

                              Bayar Faktur

                            </button>

                          ) : (

                            <span
                              className="
                                text-xs
                                text-gray-400
                              "
                            >
                              Sudah dibayar
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )

                )}

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

                  <span className="font-semibold">
                    {startIndex}
                  </span>

                  {" "}to{" "}

                  <span className="font-semibold">
                    {endIndex}
                  </span>

                  {" "}of{" "}

                  <span className="font-semibold">
                    {totalData}
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

                  <span className="text-sm text-gray-600">
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
                    value={perPage}
                    onChange={
                      e =>
                        setPerPage(
                          parseInt(
                            e.target.value
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


              {totalPage > 0 && (

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
                        e.selected + 1
                      )
                  }
                  forcePage={
                    currentPage - 1
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

              )}

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* PAYMENT MODAL */}
      {/* ================================================= */}

      {showPaymentModal && (

        <div
          className="
            fixed
            inset-0
            z-[999]
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={
            closePayment
          }
        >

          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              w-full
              max-w-5xl
              max-h-[90vh]
              overflow-y-auto
            "
            onClick={
              e =>
                e.stopPropagation()
            }
          >

            {/* ================================================= */}
            {/* MODAL HEADER */}
            {/* ================================================= */}

            <div
              className="
                bg-primary
                px-6
                py-4
                text-white
                sticky
                top-0
                z-10
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
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
                      w-10
                      h-10
                      rounded-xl
                      bg-white/15
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FaMoneyBillWave />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Bayar Sekarang
                    </h3>

                    <p className="text-xs text-blue-100">

                      {paymentItems.length > 1
                        ? `${paymentItems.length} faktur dipilih`
                        : "Pembayaran faktur"}

                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    closePayment
                  }
                  className="
                    w-9
                    h-9
                    rounded-full
                    hover:bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >

                  <FaTimes />

                </button>

              </div>

            </div>


            {/* ================================================= */}
            {/* MODAL BODY */}
            {/* ================================================= */}

            <div
              className="
                p-5
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-5
              "
            >

              {/* ================================================= */}
              {/* LEFT */}
              {/* ================================================= */}

              <div className="flex flex-col gap-4">

                {/* DETAIL FAKTUR */}

                <div
                  className="
                    rounded-2xl
                    bg-gray-50
                    border
                    border-gray-100
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-4
                    "
                  >

                    <FaFileInvoiceDollar
                      className="
                        text-primary
                      "
                    />

                    <h3
                      className="
                        font-bold
                        text-gray-700
                      "
                    >
                      Detail Faktur
                    </h3>

                  </div>


                  {paymentItems.length === 1 ? (

                    <>

                      <div className="grid grid-cols-2 gap-y-3 text-sm">

                        <span className="text-gray-500">
                          Nomor Faktur
                        </span>

                        <span className="text-right font-semibold text-gray-700">
                          {paymentItems[0].no_faktur}
                        </span>


                        <span className="text-gray-500">
                          Customer ID
                        </span>

                        <span className="text-right font-semibold text-gray-700">
                          {paymentItems[0].customer_id}
                        </span>


                        <span className="text-gray-500">
                          Nama Customer
                        </span>

                        <span className="text-right font-semibold text-gray-700">
                          {paymentItems[0].nama_customer}
                        </span>


                        <span className="text-gray-500">
                          Posting Date
                        </span>

                        <span className="text-right font-semibold text-gray-700">
                          {formatDate(
                            paymentItems[0].posting_date
                          )}
                        </span>


                        <span className="text-gray-500">
                          Due Date
                        </span>

                        <span className="text-right font-semibold text-gray-700">
                          {formatDate(
                            paymentItems[0].due_date
                          )}
                        </span>


                        <span className="text-gray-500">
                          Nominal Tagihan
                        </span>

                        <span className="text-right font-bold text-primary">
                          {formatRupiah(
                            paymentItems[0].nominal_tagihan
                          )}
                        </span>

                      </div>

                    </>

                  ) : (

                    <div className="flex flex-col gap-3">

                      {paymentItems.map(
                        item => (

                          <div
                            key={item.id}
                            className="
                              bg-white
                              rounded-xl
                              border
                              p-3
                            "
                          >

                            <div
                              className="
                                flex
                                justify-between
                                gap-3
                              "
                            >

                              <div>

                                <p
                                  className="
                                    text-xs
                                    text-gray-400
                                  "
                                >
                                  No. Faktur
                                </p>

                                <p
                                  className="
                                    font-bold
                                    text-primary
                                  "
                                >
                                  {item.no_faktur}
                                </p>

                              </div>

                              <div className="text-right">

                                <p
                                  className="
                                    text-xs
                                    text-gray-400
                                  "
                                >
                                  Nominal
                                </p>

                                <p className="font-bold text-gray-700">
                                  {formatRupiah(
                                    item.nominal_tagihan
                                  )}
                                </p>

                              </div>

                            </div>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                              "
                            >
                              {item.nama_customer}
                            </p>

                          </div>

                        )
                      )}

                      <div
                        className="
                          border-t
                          pt-3
                          flex
                          justify-between
                        "
                      >

                        <span className="font-semibold">
                          Total Pembayaran
                        </span>

                        <span
                          className="
                            font-bold
                            text-primary
                          "
                        >
                          {formatRupiah(
                            totalPayment
                          )}
                        </span>

                      </div>

                    </div>

                  )}

                </div>


                {/* INFORMASI PENAGIH */}

                <div
                  className="
                    rounded-2xl
                    bg-gray-50
                    border
                    border-gray-100
                    p-5
                  "
                >

                  <h3
                    className="
                      font-bold
                      text-gray-700
                      mb-4
                    "
                  >
                    Informasi Penagih
                  </h3>

                  <div
                    className="
                      flex
                      justify-between
                      text-sm
                    "
                  >

                    <span className="text-gray-500">
                      Nama
                    </span>

                    <span
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      {paymentItems.length === 1
                        ? paymentItems[0].nama_penagih
                        : "Multi Faktur"}
                    </span>

                  </div>

                </div>


                {/* METODE PEMBAYARAN */}

                <div
                  className="
                    rounded-2xl
                    bg-gray-50
                    border
                    border-gray-100
                    p-5
                  "
                >

                  <h3
                    className="
                      font-bold
                      text-gray-700
                      mb-4
                    "
                  >
                    Pilih Metode Pembayaran
                  </h3>


                  {/* DIRECT TRANSFER */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "DIRECT_TRANSFER"
                      )
                    }
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      p-4
                      rounded-xl
                      border
                      mb-3
                      transition
                      ${paymentMethod ===
                        "DIRECT_TRANSFER"
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 bg-white"
                      }
                    `}
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
                          w-10
                          h-10
                          rounded-xl
                          bg-blue-50
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <FaUniversity
                          className="
                            text-primary
                          "
                        />

                      </div>

                      <div className="text-left">

                        <p className="font-semibold text-gray-700">
                          Direct Transfer
                        </p>

                        <p className="text-xs text-gray-400">
                          Pilih bank tujuan
                        </p>

                      </div>

                    </div>

                    {paymentMethod ===
                      "DIRECT_TRANSFER" && (

                        <FaCheckCircle
                          className="
                          text-orange-500
                        "
                        />

                      )}

                  </button>


                  {/* GIRO */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "GIRO"
                      )
                    }
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      p-4
                      rounded-xl
                      border
                      mb-3
                      transition
                      ${paymentMethod ===
                        "GIRO"
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 bg-white"
                      }
                    `}
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
                          w-10
                          h-10
                          rounded-xl
                          bg-orange-50
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <FaCreditCard
                          className="
                            text-orange-500
                          "
                        />

                      </div>

                      <div className="text-left">

                        <p className="font-semibold text-gray-700">
                          Giro
                        </p>

                        <p className="text-xs text-gray-400">
                          Cek diserahkan ke Collector
                        </p>

                      </div>

                    </div>

                    {paymentMethod ===
                      "GIRO" && (

                        <FaCheckCircle
                          className="
                          text-orange-500
                        "
                        />

                      )}

                  </button>

                  {/* SURAT SETOR PAJAK */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod("SSP")
                    }
                    className={`
    w-full
    flex
    items-center
    justify-between
    p-4
    rounded-xl
    border
    mb-3
    transition
    ${paymentMethod === "SSP"
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 bg-white"
                      }
  `}
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
        w-10
        h-10
        rounded-xl
        bg-purple-50
        flex
        items-center
        justify-center
      "
                      >

                        <FaFileInvoiceDollar
                          className="
          text-purple-500
        "
                        />

                      </div>

                      <div className="text-left">

                        <p className="font-semibold text-gray-700">
                          Surat Setor Pajak
                        </p>

                        <p className="text-xs text-gray-400">
                          Pembayaran melalui Surat Setor Pajak
                        </p>

                      </div>

                    </div>

                    {paymentMethod === "SSP" && (

                      <FaCheckCircle
                        className="
        text-orange-500
      "
                      />

                    )}

                  </button>

                  {/* CASH */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "CASH"
                      )
                    }
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      p-4
                      rounded-xl
                      border
                      transition
                      ${paymentMethod ===
                        "CASH"
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 bg-white"
                      }
                    `}
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
                          w-10
                          h-10
                          rounded-xl
                          bg-green-50
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <FaCashRegister
                          className="
                            text-green-500
                          "
                        />

                      </div>

                      <div className="text-left">

                        <p className="font-semibold text-gray-700">
                          Cash
                        </p>

                        <p className="text-xs text-gray-400">
                          Uang tunai diserahkan ke Collector
                        </p>

                      </div>

                    </div>

                    {paymentMethod ===
                      "CASH" && (

                        <FaCheckCircle
                          className="
                          text-orange-500
                        "
                        />

                      )}

                  </button>

                </div>

              </div>


              {/* ================================================= */}
              {/* RIGHT */}
              {/* ================================================= */}

              <div className="flex flex-col gap-4">

                <div
                  className="
                    rounded-2xl
                    bg-gray-50
                    border
                    border-gray-100
                    p-5
                  "
                >

                  <h3
                    className="
                      font-bold
                      text-gray-700
                      mb-4
                    "
                  >
                    Upload Bukti Bayar
                  </h3>


                  {/* METHOD */}

                  <div
                    className="
                      flex
                      justify-between
                      text-sm
                      mb-4
                    "
                  >

                    <span className="text-gray-500">
                      Metode Pembayaran
                    </span>

                    <span className="font-semibold">
                      {paymentMethod === "DIRECT_TRANSFER"
                        ? "Direct Transfer"
                        : paymentMethod === "GIRO"
                          ? "Giro"
                          : paymentMethod === "SSP"
                            ? "Surat Setor Pajak"
                            : "Cash"}
                    </span>

                  </div>


                  {/* TOTAL */}

                  <div
                    className="
                      flex
                      justify-between
                      text-sm
                      mb-4
                    "
                  >

                    <span className="text-gray-500">
                      Jumlah Bayar
                    </span>

                    <span
                      className="
                        font-bold
                        text-primary
                      "
                    >
                      {formatRupiah(
                        totalPayment
                      )}
                    </span>

                  </div>


                  {/* GIRO DATE */}

                  {paymentMethod ===
                    "GIRO" && (

                      <div className="mb-4">

                        <label
                          className="
                          text-sm
                          text-gray-500
                          mb-2
                          block
                        "
                        >
                          Tanggal Jatuh Tempo Giro
                        </label>

                        <input
                          type="date"
                          value={
                            dueDateGiro
                          }
                          onChange={
                            e =>
                              setDueDateGiro(
                                e.target.value
                              )
                          }
                          className="
                          input
                          input-bordered
                          w-full
                          bg-white
                          rounded-xl
                        "
                        />

                      </div>

                    )}


                  {/* UPLOAD */}

                  <label
                    className="
                      border-2
                      border-dashed
                      border-gray-300
                      rounded-xl
                      min-h-[220px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      cursor-pointer
                      hover:bg-blue-50
                      hover:border-primary
                      transition
                    "
                  >

                    {paymentFile ? (

                      <>

                        <FaFileUpload
                          className="
                            text-4xl
                            text-primary
                            mb-3
                          "
                        />

                        <p
                          className="
                            font-semibold
                            text-gray-700
                          "
                        >
                          {paymentFile.name}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mt-1
                          "
                        >
                          Klik untuk mengganti file
                        </p>

                      </>

                    ) : (

                      <>

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                            mb-3
                          "
                        >

                          <FaCamera
                            className="
                              text-xl
                              text-gray-500
                            "
                          />

                        </div>

                        <p
                          className="
                            font-semibold
                            text-gray-600
                          "
                        >
                          Foto bukti pembayaran
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            text-center
                            max-w-[250px]
                            mt-2
                          "
                        >
                          Upload foto atau dokumen
                          bukti pembayaran.
                        </p>

                      </>

                    )}

                    <input
                      type="file"
                      accept="
                        image/*
                        ,.pdf
                      "
                      className="hidden"
                      onChange={
                        e =>
                          setPaymentFile(
                            e.target.files?.[0]
                          )
                      }
                    />

                  </label>


                  {/* KETERANGAN */}

                  <div className="mt-4">

                    <label
                      className="
                        text-sm
                        text-gray-500
                        mb-2
                        block
                      "
                    >
                      Keterangan (opsional)
                    </label>

                    <textarea
                      className="
                        textarea
                        textarea-bordered
                        w-full
                        bg-white
                        rounded-xl
                        min-h-[110px]
                      "
                      placeholder="
                        Contoh: Pembayaran untuk faktur...
                      "
                      value={
                        description
                      }
                      onChange={
                        e =>
                          setDescription(
                            e.target.value
                          )
                      }
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div
              className="
                border-t
                bg-gray-50
                px-5
                py-4
                flex
                justify-end
                gap-3
              "
            >

              <button
                type="button"
                onClick={
                  closePayment
                }
                className="
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
                "
              >
                Batal
              </button>


              <button
                type="button"
                onClick={
                  handlePayment
                }
                className="
                  px-6
                  py-2.5
                  rounded-full
                  bg-primary
                  text-white
                  text-sm
                  font-semibold
                  hover:opacity-90
                  shadow-md
                  inline-flex
                  items-center
                  gap-2
                "
              >

                <FaMoneyBillWave />

                {paymentItems.length > 1
                  ? `Bayar ${paymentItems.length} Faktur`
                  : "Bayar Sekarang"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default TableBayarFaktur;