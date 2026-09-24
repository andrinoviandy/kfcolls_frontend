import React, { useEffect, useMemo, useState } from "react";

import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaSyncAlt,
} from "react-icons/fa";

const getToday = () => new Date().toISOString().slice(0, 10);

const TableDataCod = ({
  navigation,
  location,
  dimensionScreenW,
  check,
  loginAccess,
  reloadData,
  setReloadData,
}) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const dummyData = useMemo(() => {
    const today = getToday();

    return [
      { id: 1, no_billing: "2809361541", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 12500000, status: "LUNAS_HARI_INI" },
      { id: 2, no_billing: "2809361542", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 8750000, status: "LUNAS_HARI_INI" },
      { id: 3, no_billing: "2809361543", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 15350000, status: "LUNAS_HARI_INI" },
      { id: 4, no_billing: "2809361544", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 6250000, status: "LUNAS_HARI_INI" },
      { id: 5, no_billing: "2809361545", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 21800000, status: "LUNAS_HARI_INI" },
      { id: 6, no_billing: "2809361546", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 9750000, status: "LUNAS_HARI_INI" },
      { id: 7, no_billing: "2809361547", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 3250000, status: "LUNAS_HARI_INI" },
      { id: 8, no_billing: "2809361548", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 18750000, status: "LUNAS_HARI_INI" },
      { id: 9, no_billing: "2809361549", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 11250000, status: "LUNAS_HARI_INI" },
      { id: 10, no_billing: "2809361550", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 4500000, status: "LUNAS_HARI_INI" },
      { id: 11, no_billing: "2809361551", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 26750000, status: "LUNAS_HARI_INI" },
      { id: 12, no_billing: "2809361552", tanggal_penjualan: today, tanggal_pelunasan: today, nominal_billing: 7300000, status: "LUNAS_HARI_INI" },
    ];
  }, []);

  useEffect(() => {
    loadData();
  }, [reloadData]);

  const loadData = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const savedData = JSON.parse(
        localStorage.getItem("dataCod") || "[]"
      );

      const mergedData = [...savedData, ...dummyData];

      const uniqueData = mergedData.filter(
        (item, index, array) =>
          index ===
          array.findIndex(
            (row) => String(row.id) === String(item.id)
          )
      );

      setData(uniqueData);
    } catch (error) {
      console.error("Error load data COD:", error);
      setData(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredData = useMemo(() => {
    let result = [...data];
    const keyword = search.toLowerCase().trim();

    if (keyword) {
      result = result.filter((item) =>
        String(item.no_billing || "")
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (filterStatus !== "ALL") {
      result = result.filter(
        (item) => item.status === filterStatus
      );
    }

    return result;
  }, [data, search, filterStatus]);

  const totalData = filteredData.length;
  const totalPage = Math.max(1, Math.ceil(totalData / limit));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, limit]);

  const summary = useMemo(() => {
    return data.reduce(
      (result, item) => {
        result.totalData += 1;
        result.totalNominal += Number(item.nominal_billing || 0);
        return result;
      },
      { totalData: 0, totalNominal: 0 }
    );
  }, [data]);

  const handleRefresh = () => {
    setReloadData((prev) => !prev);
  };

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus Billing ${item.no_billing}?`
    );

    if (!confirmed) return;

    const savedData = JSON.parse(
      localStorage.getItem("dataCod") || "[]"
    );

    const updatedSavedData = savedData.filter(
      (row) => String(row.id) !== String(item.id)
    );

    localStorage.setItem(
      "dataCod",
      JSON.stringify(updatedSavedData)
    );

    setData((prev) =>
      prev.filter((row) => String(row.id) !== String(item.id))
    );
  };

  const handleEdit = (item) => {
    window.alert(
      `Edit Data COD untuk Billing ${item.no_billing} dapat dihubungkan ke form edit berikutnya.`
    );
  };

  const renderStatus = () => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
      <FaCheckCircle />
      Lunas Hari Ini
    </span>
  );

  return (
    <div className="w-full">
      {/* ================================================= */}
      {/* SUMMARY - HANYA 1 CARD */}
      {/* ================================================= */}
      <div className="mb-5">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Total Penjualan COD Hari Ini
              </p>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(summary.totalNominal)}
              </p>
              <p className="text-[10px] text-blue-600 mt-1">
                {summary.totalData} Billing Lunas Hari Ini
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FaMoneyBillWave />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* TOOLBAR */}
      {/* ================================================= */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between mb-4">
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nomor Billing..."
            className="input input-bordered w-full pl-11 rounded-full bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="btn rounded-full bg-white border border-gray-300 text-gray-600 gap-2"
          >
            <FaFilter />
            Filter
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="btn rounded-full bg-white border border-gray-300 text-gray-600 gap-2"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}
      {showFilter && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <div className="max-w-sm">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-bordered w-full rounded-xl bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="LUNAS_HARI_INI">Lunas Hari Ini</option>
            </select>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-xs">
              <th className="whitespace-nowrap text-center">Aksi</th>
              <th>No</th>
              <th className="whitespace-nowrap">Nomor Billing</th>
              <th className="whitespace-nowrap">Tanggal Penjualan</th>
              <th className="whitespace-nowrap">Tanggal Pelunasan</th>
              <th className="whitespace-nowrap text-right">Nominal Billing</th>
              <th className="whitespace-nowrap text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <span className="loading loading-spinner loading-md text-primary" />
                  <p className="text-sm text-gray-400 mt-2">
                    Memuat data...
                  </p>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <FaMoneyBillWave className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Data COD tidak ditemukan
                  </p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const rowNumber =
                  (currentPage - 1) * limit + index + 1;

                return (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedData(item);
                            setShowDetail(true);
                          }}
                          className="btn btn-sm btn-circle bg-blue-50 border-none text-blue-600 hover:bg-blue-100"
                          title="Detail"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="btn btn-sm btn-circle bg-yellow-50 border-none text-yellow-600 hover:bg-yellow-100"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="btn btn-sm btn-circle bg-red-50 border-none text-red-600 hover:bg-red-100"
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>

                    <td className="text-xs text-gray-500">
                      {rowNumber}
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FaMoneyBillWave />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                          {item.no_billing}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {formatDate(item.tanggal_penjualan)}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <FaCalendarAlt className="text-green-500" />
                        <span className="text-xs font-semibold text-gray-700">
                          {formatDate(item.tanggal_pelunasan)}
                        </span>
                      </div>
                    </td>

                    <td className="text-right">
                      <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
                        {formatCurrency(item.nominal_billing)}
                      </span>
                    </td>

                    <td className="text-center">
                      {renderStatus(item)}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================================================= */}
      {/* PAGINATION */}
      {/* ================================================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
        <div className="text-xs text-gray-500">
          Menampilkan{" "}
          <span className="font-semibold text-gray-700">
            {totalData === 0 ? 0 : (currentPage - 1) * limit + 1}
          </span>
          {" - "}
          <span className="font-semibold text-gray-700">
            {Math.min(currentPage * limit, totalData)}
          </span>
          {" dari "}
          <span className="font-semibold text-gray-700">
            {totalData}
          </span>{" "}
          data
        </div>

        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="select select-bordered select-sm rounded-lg"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            className="btn btn-sm btn-circle bg-white border border-gray-300 disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>

          <span className="text-xs font-semibold text-gray-600 min-w-[70px] text-center">
            {currentPage} / {totalPage}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPage}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPage))
            }
            className="btn btn-sm btn-circle bg-white border border-gray-300 disabled:opacity-40"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* DETAIL MODAL */}
      {/* ================================================= */}
      {showDetail && selectedData && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50 p-4 flex items-center justify-center"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Detail Data COD
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Billing {selectedData.no_billing}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="btn btn-sm btn-circle bg-gray-100 border-none text-gray-500"
              >
                <FaTimesCircle />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Nomor Billing</p>
                <p className="text-sm font-semibold text-gray-700">
                  {selectedData.no_billing}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                {renderStatus(selectedData)}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">
                  Tanggal Penjualan
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatDate(selectedData.tanggal_penjualan)}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">
                  Tanggal Pelunasan
                </p>
                <p className="text-sm font-semibold text-green-700">
                  {formatDate(selectedData.tanggal_pelunasan)}
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 md:col-span-2">
                <p className="text-xs text-gray-400 mb-1">
                  Nominal Billing
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(selectedData.nominal_billing)}
                </p>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="btn rounded-full bg-primary text-white px-6"
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

export default TableDataCod;