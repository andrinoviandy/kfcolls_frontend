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
  FaEye,
  FaTimes,
  FaSearch,
  FaFilter,
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";

import ReactPaginate from "react-paginate";

import { swal } from "global/helper/swal";
import storeSchema from "global/store";

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

  // Fallback:
  // hitung dari posting_date + 7 hari
  const postingDate = normalizeDate(
    item?.posting_date ||
    item?.tanggal_faktur
  );

  if (!postingDate) {
    return null;
  }

  const dueDate = new Date(postingDate);

  dueDate.setDate(
    dueDate.getDate() + 7
  );

  dueDate.setHours(0, 0, 0, 0);

  return dueDate;
};

// =====================================================
// JUMLAH HARI MENUJU JATUH TEMPO
// =====================================================

const getDaysToDue = (item) => {
  const dueDate =
    getCalculatedDueDate(item);

  if (!dueDate) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (
      dueDate.getTime() -
      today.getTime()
    ) /
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
//    Sudah ada pembayaran,
//    tetapi masih ada outstanding
//
// 3. LUNAS
//    Outstanding <= 0
// =====================================================

const getPiutangStatus = (item) => {
  const totalPiutang = firstNumber(
    item?.total_piutang
  );

  const dibayar = firstNumber(
    item?.dibayar,
    item?.sudah_dibayar
  );

  let outstanding = firstNumber(
    item?.outstanding
  );

  // Kalau backend belum memberikan outstanding,
  // hitung dari total - dibayar
  if (
    item?.outstanding === null ||
    item?.outstanding === undefined ||
    item?.outstanding === ""
  ) {
    outstanding =
      totalPiutang - dibayar;
  }

  // =================================================
  // SUDAH LUNAS
  // =================================================

  if (outstanding <= 0) {
    return "LUNAS";
  }

  // =================================================
  // BELUM ADA PEMBAYARAN
  // =================================================

  if (dibayar <= 0) {
    return "OUTSTANDING";
  }

  // =================================================
  // SUDAH ADA PEMBAYARAN,
  // TAPI MASIH ADA SISA
  // =================================================

  return "BELUM_LUNAS";
};

// =====================================================
// CEK AKAN JATUH TEMPO
//
// Hanya untuk piutang yang:
// - belum lunas
// - jatuh tempo > hari ini
// - jatuh tempo <= 7 hari dari hari ini
//
// Catatan:
// Jatuh tempo sendiri berasal dari:
// posting_date + 7 hari
// =====================================================

const isAkanJatuhTempo = (item) => {
  const status =
    getPiutangStatus(item);

  if (status === "LUNAS") {
    return false;
  }

  const days = getDaysToDue(item);

  if (days === null) {
    return false;
  }

  return (
    days >= 0 &&
    days <= 7
  );
};

// =====================================================
// CEK SUDAH JATUH TEMPO
// =====================================================

const isSudahJatuhTempo = (item) => {
  const status =
    getPiutangStatus(item);

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
  const status =
    getPiutangStatus(item);

  const akanJatuhTempo =
    isAkanJatuhTempo(item);

  const sudahJatuhTempo =
    isSudahJatuhTempo(item);

  // =================================================
  // SUDAH LUNAS
  // =================================================

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

  // =================================================
  // BELUM LUNAS
  // =================================================

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

  // =================================================
  // OUTSTANDING
  // =================================================

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

  const [filterStatus, setFilterStatus] =
    useState("ALL");

  const [filterCabang, setFilterCabang] =
    useState("ALL");

  const [filterChannel, setFilterChannel] =
    useState("ALL");

  const [filterPrinciple, setFilterPrinciple] =
    useState("ALL");

  const [filterCustomer, setFilterCustomer] =
    useState("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(10);

  const [loading, setLoading] =
    useState(false);

  const [options, setOptions] =
    useState({
      cabang: [],
      channel: [],
      principle: [],
    });

  const [selectedData, setSelectedData] =
    useState(null);

  const [showDetail, setShowDetail] =
    useState(false);

  // ===================================================
  // STATUS OPTIONS
  // HANYA 3 STATUS
  // ===================================================

  const statusOptions = useMemo(
    () => [
      {
        label: "Outstanding",
        value: "OUTSTANDING",
      },
      {
        label: "Belum Lunas",
        value: "BELUM_LUNAS",
      },
      {
        label: "Sudah Lunas",
        value: "LUNAS",
      },
    ],
    []
  );

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
  // GET DATA PIUTANG
  // ===================================================

  const getDataPiutang = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        limit: perPage,

        keyword:
          keyword.trim(),

        status:
          filterStatus,

        sales_office:
          filterCabang,

        channel:
          filterChannel,

        principle:
          filterPrinciple,

        customer:
          filterCustomer,
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
    const timer =
      setTimeout(
        () => {
          getDataPiutang();
        },
        keyword.trim()
          ? 400
          : 0
      );

    return () =>
      clearTimeout(timer);

  }, [
    currentPage,
    perPage,
    keyword,
    filterStatus,
    filterCabang,
    filterChannel,
    filterPrinciple,
    filterCustomer,
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

  const resetFilter = () => {
    setKeyword("");
    setFilterStatus("ALL");
    setFilterCabang("ALL");
    setFilterChannel("ALL");
    setFilterPrinciple("ALL");
    setFilterCustomer("ALL");

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
  // DETAIL
  // ===================================================

  const handleDetail = (
    item
  ) => {
    setSelectedData(item);
    setShowDetail(true);
  };

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

          <div className="input input-sm input-bordered flex items-center gap-2 bg-white rounded-full border-gray-200 shadow-sm w-full lg:w-[460px]">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Cari billing / customer / sales..."
              className="grow"
              value={keyword}
              onChange={(e) => {
                setCurrentPage(1);

                setKeyword(
                  e.target.value
                );
              }}
            />

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

          {/* STATUS */}

          <select
            className="select select-sm select-bordered rounded-full bg-white min-w-[200px]"
            value={filterStatus}
            onChange={(e) => {
              setCurrentPage(1);

              setFilterStatus(
                e.target.value
              );
            }}
          >

            <option value="ALL">
              Semua Status
            </option>

            {statusOptions.map(
              (item) => (
                <option
                  key={
                    item.value
                  }
                  value={
                    item.value
                  }
                >
                  {item.label}
                </option>
              )
            )}

          </select>

          {/* CABANG */}

          <select
            className="select select-sm select-bordered rounded-full bg-white min-w-[190px]"
            value={filterCabang}
            onChange={(e) => {
              setCurrentPage(1);

              setFilterCabang(
                e.target.value
              );
            }}
          >

            <option value="ALL">
              Semua Cabang
            </option>

            {options?.cabang?.map(
              (item) => (
                <option
                  key={
                    item?.value
                  }
                  value={
                    item?.value
                  }
                >
                  {item?.label}
                </option>
              )
            )}

          </select>

          {/* CHANNEL */}

          <select
            className="select select-sm select-bordered rounded-full bg-white min-w-[180px]"
            value={filterChannel}
            onChange={(e) => {
              setCurrentPage(1);

              setFilterChannel(
                e.target.value
              );
            }}
          >

            <option value="ALL">
              Semua Channel
            </option>

            {options?.channel?.map(
              (item) => (
                <option
                  key={
                    item?.value
                  }
                  value={
                    item?.value
                  }
                >
                  {item?.label}
                </option>
              )
            )}

          </select>

          {/* PRINCIPLE */}

          <select
            className="select select-sm select-bordered rounded-full bg-white min-w-[200px]"
            value={filterPrinciple}
            onChange={(e) => {
              setCurrentPage(1);

              setFilterPrinciple(
                e.target.value
              );
            }}
          >

            <option value="ALL">
              Semua Principle
            </option>

            {options?.principle?.map(
              (item) => (
                <option
                  key={
                    item?.value
                  }
                  value={
                    item?.value
                  }
                >
                  {item?.label}
                </option>
              )
            )}

          </select>

          {/* CUSTOMER */}

          <select
            className="select select-sm select-bordered rounded-full bg-gray-100 min-w-[200px] text-gray-400 cursor-not-allowed"
            value={filterCustomer}
            disabled
            title="Filter Customer belum diaktifkan"
          >

            <option value="ALL">
              Customer
            </option>

          </select>

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
                {formatRupiah(
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
                Sudah Dibayar
              </p>

              <p className="text-xl font-bold text-green-900">
                {formatRupiah(
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
                {formatRupiah(
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
                {formatRupiah(
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
                {formatRupiah(
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
                {formatRupiah(
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
                  <th className="px-4 py-3 whitespace-nowrap text-center">
                    Aksi
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-semibold">
                      <FaHashtag />
                      No
                    </div>
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    No. Billing
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    No. Faktur
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Tanggal Faktur
                    </div>
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Customer
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Sales
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Sales Office
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Channel
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Principle
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Lini Penjualan
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    TOP
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Posting Date
                    </div>
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      Jatuh Tempo
                    </div>
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap text-right">
                    Total Piutang
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap text-right">
                    Dibayar
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap text-right">
                    Outstanding
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap text-center">
                    Aging
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap text-center">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* ========================================= */}
                {/* EMPTY DATA */}
                {/* ========================================= */}

                {tableData.length === 0 ? (

                  <tr>

                    <td
                      colSpan={19}
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

                  tableData.map(
                    (item, index) => {

                      const rowNumber =
                        (currentPage - 1) *
                        perPage +
                        index +
                        1;

                      const status =
                        getPiutangStatus(
                          item
                        );

                      const akanJatuhTempo =
                        isAkanJatuhTempo(
                          item
                        );

                      const sudahJatuhTempo =
                        isSudahJatuhTempo(
                          item
                        );

                      const daysToDue =
                        getDaysToDue(
                          item
                        );

                      return (

                        <tr
                          key={
                            `${item?.billing_no || "billing"}-${item?.principle || "principle"}-${index}`
                          }
                          className="border-b hover:bg-blue-50 transition duration-200"
                        >

                          {/* ================================= */}
                          {/* AKSI */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-center">

                            <div className="dropdown dropdown-right">

                              <div
                                tabIndex={0}
                                role="button"
                                className="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition"
                              >

                                <FaEllipsisV />

                              </div>

                              <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow-xl bg-white rounded-box border border-gray-100 w-40 z-[20]"
                              >

                                <li>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDetail(
                                        item
                                      )
                                    }
                                  >

                                    <FaEye />

                                    Detail

                                  </button>

                                </li>

                              </ul>

                            </div>

                          </td>

                          {/* ================================= */}
                          {/* NO */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {rowNumber}
                          </td>

                          {/* ================================= */}
                          {/* BILLING */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap">

                            <div>

                              <p className="font-semibold text-gray-700">
                                {displayValue(
                                  item?.billing_no
                                )}
                              </p>

                              <p className="text-[11px] text-gray-400 mt-0.5">
                                Billing
                              </p>

                            </div>

                          </td>

                          {/* ================================= */}
                          {/* NO FAKTUR */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            -
                          </td>

                          {/* ================================= */}
                          {/* TANGGAL FAKTUR */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaCalendarAlt className="text-gray-400" />
                              -
                            </div>
                          </td>

                          {/* ================================= */}
                          {/* CUSTOMER */}
                          {/* ================================= */}

                          <td className="px-4 py-3 min-w-[240px]">

                            <div className="flex items-start gap-2">

                              <div className="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">

                                <FaBuilding className="text-sm" />

                              </div>

                              <div className="min-w-0">

                                <p
                                  className="font-semibold text-gray-700 truncate max-w-[240px]"
                                  title={String(
                                    item?.name_bill_to ||
                                    "-"
                                  )}
                                >

                                  {displayValue(
                                    item?.name_bill_to
                                  )}

                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">

                                  {displayValue(
                                    item?.bill_to_party
                                  )}

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ================================= */}
                          {/* SALES */}
                          {/* ================================= */}

                          <td className="px-4 py-3 min-w-[220px]">

                            <div className="flex items-start gap-2">

                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">

                                <FaUser className="text-gray-400 text-xs" />

                              </div>

                              <div>

                                <p className="font-semibold text-gray-700 text-sm">

                                  {displayValue(
                                    item?.name_salesman
                                  )}

                                </p>

                                <p className="text-xs text-gray-400">

                                  {displayValue(
                                    item?.salesman
                                  )}

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ================================= */}
                          {/* SALES OFFICE */}
                          {/* ================================= */}

                          <td className="px-4 py-3 min-w-[180px]">

                            <p className="font-semibold text-gray-700 text-sm">

                              {displayValue(
                                item?.desc_s_office
                              )}

                            </p>

                            <p className="text-xs text-gray-400">

                              {displayValue(
                                item?.sales_office
                              )}

                            </p>

                          </td>

                          {/* ================================= */}
                          {/* CHANNEL */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap">

                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">

                              {displayValue(
                                item?.desc_cust_grp4
                              )}

                            </span>

                          </td>

                          {/* ================================= */}
                          {/* PRINCIPLE */}
                          {/* ================================= */}

                          <td className="px-4 py-3 min-w-[180px]">

                            <p className="font-semibold text-gray-700 text-sm">

                              {displayValue(
                                item?.name_principle
                              )}

                            </p>

                            <p className="text-xs text-gray-400">

                              {displayValue(
                                item?.principle
                              )}

                            </p>

                          </td>

                          {/* ================================= */}
                          {/* LINI PENJUALAN */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            -
                          </td>

                          {/* ================================= */}
                          {/* TOP */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            -
                          </td>

                          {/* ================================= */}
                          {/* POSTING DATE */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap">

                            <div className="flex items-center gap-2 text-sm text-gray-600">

                              <FaCalendarAlt className="text-primary" />

                              {formatDate(
                                item?.posting_date
                              )}

                            </div>

                          </td>

                          {/* ================================= */}
                          {/* JATUH TEMPO */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap">

                            <div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">

                                <FaCalendarAlt className="text-primary" />

                                {formatDate(
                                  item?.jatuh_tempo
                                )}

                              </div>

                              {/* ================================= */}
                              {/* AKAN JATUH TEMPO */}
                              {/* ================================= */}

                              {akanJatuhTempo && (
                                <div className="flex items-center gap-1 mt-1">

                                  <FaClock className="text-yellow-500 text-[10px]" />

                                  <span className="text-[10px] font-semibold text-yellow-600">

                                    Akan Jatuh Tempo

                                    {daysToDue !==
                                      null && (
                                        <>
                                          {" "}
                                          (
                                          {daysToDue}{" "}
                                          hari)
                                        </>
                                      )}

                                  </span>

                                </div>
                              )}

                              {/* ================================= */}
                              {/* SUDAH JATUH TEMPO */}
                              {/* ================================= */}

                              {sudahJatuhTempo && (
                                <div className="flex items-center gap-1 mt-1">

                                  <FaExclamationCircle className="text-red-500 text-[10px]" />

                                  <span className="text-[10px] font-semibold text-red-600">

                                    Sudah Jatuh Tempo

                                  </span>

                                </div>
                              )}

                            </div>

                          </td>

                          {/* ================================= */}
                          {/* TOTAL PIUTANG */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-right">

                            <span className="font-bold text-gray-700">

                              {formatRupiah(
                                item?.total_piutang
                              )}

                            </span>

                          </td>

                          {/* ================================= */}
                          {/* DIBAYAR */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-right">

                            <span className="font-bold text-green-600">

                              {formatRupiah(
                                item?.dibayar ??
                                item?.sudah_dibayar
                              )}

                            </span>

                          </td>

                          {/* ================================= */}
                          {/* OUTSTANDING */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-right">

                            <span
                              className={`font-bold ${Number(
                                item?.outstanding ||
                                0
                              ) > 0
                                ? "text-red-600"
                                : "text-gray-500"
                                }`}
                            >

                              {formatRupiah(
                                item?.outstanding
                              )}

                            </span>

                          </td>

                          {/* ================================= */}
                          {/* AGING */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-center">

                            {Number(
                              item?.aging ||
                              0
                            ) <= 0 ? (

                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">

                                Current

                              </span>

                            ) : (

                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${Number(
                                  item?.aging ||
                                  0
                                ) <= 7
                                  ? "bg-yellow-50 text-yellow-600"
                                  : Number(
                                    item?.aging ||
                                    0
                                  ) <= 30
                                    ? "bg-orange-50 text-orange-600"
                                    : "bg-red-50 text-red-600"
                                  }`}
                              >

                                {formatNumber(
                                  item?.aging
                                )}{" "}
                                Hari

                              </span>

                            )}

                          </td>

                          {/* ================================= */}
                          {/* STATUS */}
                          {/* ================================= */}

                          <td className="px-4 py-3 whitespace-nowrap text-center">

                            {renderStatus(
                              item
                            )}

                          </td>

                        </tr>

                      );

                    }
                  )

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

              {/* ============================================= */}
              {/* PAGINATION */}
              {/* ============================================= */}

              {totalPage > 0 && (

                <ReactPaginate
                  breakLabel="..."
                  previousLabel="←"
                  nextLabel="→"

                  pageCount={
                    totalPage
                  }

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
                    onClick={
                      closeDetail
                    }
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

                            </strong>

                            .

                          </p>

                          <p className="text-[11px] text-yellow-600 mt-1">

                            Jatuh tempo dihitung{" "}
                            <strong>
                              7 hari setelah tanggal faktur
                            </strong>
                            .

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
                            </strong>
                            .

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
                  onClick={
                    closeDetail
                  }
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