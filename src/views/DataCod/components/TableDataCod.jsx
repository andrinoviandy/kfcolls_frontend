import React, { useEffect, useState } from "react";

import {
  FaSearch,
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
  FaExclamationTriangle,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import storeSchema from "global/store";
import { swal } from "global/helper/swal";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // EDIT DATA COD
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    cod_id: "",
    no_billing: "",
    tanggal_pelunasan: getToday(),
    nominal_billing: "",
  });
  const [loadingEdit, setLoadingEdit] = useState(false);

  // DELETE DATA COD
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // =====================================================
  // GET DATA COD
  // =====================================================
  const loadData = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        limit,
        keyword: searchKeyword.trim(),
      };

      console.log("PAYLOAD GET LIST DATA COD:", payload);

      const response = await storeSchema.actions.getListDataCod(payload);

      console.log("RESPONSE GET LIST DATA COD:", response);

      if (response?.status !== true) {
        throw new Error(
          response?.message || "Gagal mengambil data COD"
        );
      }

      const responseData = response?.data || {};
      const listData =
        responseData?.list_data ||
        responseData?.listData ||
        responseData?.data ||
        [];

      const normalizedData = listData.map((item, index) => ({
        ...item,
        id:
          item?.id ||
          item?.cod_id ||
          item?.data_cod_id ||
          item?.billing_id ||
          item?.no_billing ||
          index,
        no_billing:
          item?.no_billing ||
          item?.nomor_billing ||
          item?.billing_no ||
          item?.billing_number ||
          item?.noBilling ||
          "-",
        tanggal_penjualan:
          item?.tanggal_penjualan ||
          item?.tgl_penjualan ||
          item?.posting_date ||
          item?.tanggal_penjualan_cod ||
          null,
        tanggal_pelunasan:
          item?.tanggal_pelunasan ||
          item?.tgl_pelunasan ||
          item?.payment_date ||
          item?.tanggal_bayar ||
          null,
        nominal_billing:
          item?.nominal_billing ??
          item?.nilai_billing ??
          item?.amount ??
          item?.nominal ??
          0,
        status: String(
          item?.status ||
            item?.status_cod ||
            item?.status_pelunasan ||
            "LUNAS_HARI_INI"
        ).toUpperCase(),
        No: (currentPage - 1) * limit + index + 1,
      }));

      setData(normalizedData);

      setTotalData(
        Number(
          responseData?.total_data ??
            responseData?.total ??
            responseData?.count ??
            0
        )
      );

      setTotalPage(
        Number(
          responseData?.total_halaman ??
            responseData?.total_page ??
            responseData?.total_pages ??
            0
        )
      );
    } catch (error) {
      console.error("ERROR GET LIST DATA COD:", error);
      setData([]);
      setTotalData(0);
      setTotalPage(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, limit, searchKeyword, reloadData]);

  // =====================================================
  // SEARCH
  // =====================================================
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(search.trim());
  };

  const handleRefresh = () => {
    loadData();
  };

  // =====================================================
  // FORMAT
  // =====================================================
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

  // =====================================================
  // OPEN DELETE CONFIRMATION
  // =====================================================
  const handleDelete = (item) => {
    if (!item) return;

    setDeleteData(item);
    setShowDeleteConfirm(true);
  };

  // =====================================================
  // CLOSE DELETE CONFIRMATION
  // =====================================================
  const closeDeleteConfirm = () => {
    if (loadingDelete) return;

    setShowDeleteConfirm(false);
    setDeleteData(null);
  };

  // =====================================================
  // CONFIRM DELETE DATA COD
  // =====================================================
  const confirmDelete = async () => {
    if (!deleteData || loadingDelete) return;

    try {
      setLoadingDelete(true);

      const response =
        await storeSchema.actions.deleteDataCod(deleteData?.id);

      console.log("RESPONSE DELETE DATA COD:", response);

      if (response?.status !== true) {
        swal.error(
          response?.message ||
            "Data COD gagal dihapus."
        );
        return;
      }

      setShowDeleteConfirm(false);
      await swal.success(
        response?.message ||
          "Data COD berhasil dihapus."
      );

      setDeleteData(null);

      // Refresh table setelah delete berhasil
      setReloadData((prev) => !prev);
    } catch (error) {
      console.error(
        "ERROR DELETE DATA COD:",
        error
      );

      swal.error(
        error?.response?.data?.message ||
          error?.message ||
          "Terjadi kesalahan saat menghapus Data COD."
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================
  const handleEdit = (item) => {
    setEditData({
      cod_id: item?.cod_id || item?.data_cod_id || item?.id || "",
      no_billing: item?.no_billing || "",
      tanggal_pelunasan:
        item?.tanggal_pelunasan || getToday(),
      nominal_billing: item?.nominal_billing ?? "",
    });

    setShowEdit(true);
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================
  const closeEdit = () => {
    if (loadingEdit) return;
    setShowEdit(false);
  };

  // =====================================================
  // CHANGE EDIT FORM
  // =====================================================
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (loadingEdit) return;

    const noBilling = String(editData.no_billing || "").trim();
    const nominal = Number(
      String(editData.nominal_billing || "").replace(/[^0-9]/g, "")
    );

    if (!noBilling) {
      await swal.warning("Nomor Billing wajib diisi.");
      return;
    }

    if (!editData.tanggal_pelunasan) {
      await swal.warning("Tanggal Pelunasan wajib diisi.");
      return;
    }

    if (!nominal || nominal <= 0) {
      await swal.warning("Nominal Billing harus lebih dari 0.");
      return;
    }

    const payload = {
      cod_id: editData.cod_id,
      no_billing: noBilling,
      tanggal_pelunasan: editData.tanggal_pelunasan,
      nominal_billing: nominal,
    };

    console.log("PAYLOAD UPDATE DATA COD:", payload);

    try {
      setLoadingEdit(true);

      // Sesuaikan nama action jika action update di store Anda berbeda.
      const response = await storeSchema.actions.editDataCod(payload);

      console.log("RESPONSE UPDATE DATA COD:", response);

      if (response?.status !== true) {
        swal.error(
          response?.message || "Data COD gagal diperbarui."
        );
        return;
      }
      
      setShowEdit(false);
      await swal.success(
        response?.message || "Data COD berhasil diperbarui."
      );

      setEditData({
        cod_id: "",
        no_billing: "",
        tanggal_pelunasan: getToday(),
        nominal_billing: "",
      });

      setReloadData((prev) => !prev);
    } catch (error) {
      console.error("ERROR UPDATE DATA COD:", error);

      swal.error(
        error?.response?.data?.message ||
          error?.message ||
          "Terjadi kesalahan saat memperbarui Data COD."
      );
    } finally {
      setLoadingEdit(false);
    }
  };

  const renderStatus = () => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
      <FaCheckCircle />
      Lunas Hari Ini
    </span>
  );

  const startIndex =
    totalData > 0 ? (currentPage - 1) * limit + 1 : 0;

  const endIndex = Math.min(currentPage * limit, totalData);

  const summaryNominal = data.reduce(
    (total, item) => total + Number(item?.nominal_billing || 0),
    0
  );

  return (
    <div className="w-full">
      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}
      <div className="mb-5">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Total Penjualan COD Hari Ini
              </p>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(summaryNominal)}
              </p>
              <p className="text-[10px] text-blue-600 mt-1">
                {totalData} Billing
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Cari Nomor Billing..."
            className="input input-bordered w-full pl-11 pr-12 rounded-full bg-white"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90"
            title="Cari"
          >
            <FaSearch className="text-xs" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="btn rounded-full bg-white border border-gray-300 text-gray-600 gap-2"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* Tanggal Penjualan & Status DIHAPUS */}
      {/* ================================================= */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-xs">
              <th className="whitespace-nowrap text-center">Aksi</th>
              <th>No</th>
              <th className="whitespace-nowrap">Nomor Billing</th>
              <th className="whitespace-nowrap">Tanggal Pelunasan</th>
              <th className="whitespace-nowrap text-right">Nominal Billing</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  <span className="loading loading-spinner loading-md text-primary" />
                  <p className="text-sm text-gray-400 mt-2">
                    Memuat data...
                  </p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  <FaMoneyBillWave className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Data COD tidak ditemukan
                  </p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
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
          Menampilkan <span className="font-semibold text-gray-700">{startIndex}</span>
          {" - "}
          <span className="font-semibold text-gray-700">{endIndex}</span>
          {" dari "}
          <span className="font-semibold text-gray-700">{totalData}</span> data
        </div>

        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="select select-bordered select-sm rounded-lg"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <button
            type="button"
            disabled={loading || currentPage <= 1}
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            className="btn btn-sm btn-circle bg-white border border-gray-300 disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>

          <span className="text-xs font-semibold text-gray-600 min-w-[70px] text-center">
            {currentPage} / {Math.max(totalPage, 1)}
          </span>

          <button
            type="button"
            disabled={
              loading ||
              currentPage >= Math.max(totalPage, 1)
            }
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.max(totalPage, 1))
              )
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
          className="fixed inset-0 z-[9999] bg-black/50 p-4 flex items-center justify-center overflow-y-auto"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
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

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Nomor Billing</p>
                <p className="text-sm font-semibold text-gray-700">
                  {selectedData.no_billing}
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

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
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

      {/* ================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================= */}
      {showDeleteConfirm && deleteData && (
        <div
          className="fixed inset-0 z-[11000] bg-black/50 p-4 flex items-center justify-center overflow-y-auto"
          onClick={closeDeleteConfirm}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FaExclamationTriangle />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Konfirmasi Hapus
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Hapus Data COD
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={loadingDelete}
                className="btn btn-sm btn-circle bg-gray-100 border-none text-gray-500 hover:bg-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <p className="text-sm text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus Data COD dengan Nomor Billing
                <span className="font-bold text-gray-800 mx-1">
                  {deleteData.no_billing}
                </span>
                ?
              </p>

              <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs text-red-700 font-semibold">
                  Perhatian
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Data yang sudah dihapus tidak dapat ditampilkan kembali pada tabel.
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={loadingDelete}
                className="btn rounded-full bg-white border border-gray-300 text-gray-600 px-6"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={loadingDelete}
                className="btn rounded-full bg-red-600 hover:bg-red-700 border-none text-white px-6 gap-2 min-w-[130px]"
              >
                {loadingDelete ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Ya, Yakin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* EDIT DATA COD MODAL */}
      {/* ================================================= */}
      {showEdit && (
        <div
          className="fixed inset-0 z-[10000] bg-black/50 p-4 flex items-center justify-center overflow-y-auto"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Edit Data COD
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Perbarui data penjualan COD
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={loadingEdit}
                className="btn btn-sm btn-circle bg-gray-100 border-none text-gray-500 hover:bg-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmitEdit}
              className="flex flex-col min-h-0"
            >
              {/* CONTENT OVERFLOW */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* NOMOR BILLING */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Nomor Billing <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="no_billing"
                    value={editData.no_billing}
                    onChange={handleEditChange}
                    placeholder="Contoh: 2809361541"
                    className="input input-bordered w-full rounded-xl bg-white"
                    disabled={loadingEdit}
                    autoFocus
                  />
                </div>

                {/* TANGGAL PELUNASAN */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Tanggal Pelunasan <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="date"
                      name="tanggal_pelunasan"
                      value={editData.tanggal_pelunasan}
                      onChange={handleEditChange}
                      className="input input-bordered w-full rounded-xl bg-white pl-11"
                      disabled={loadingEdit}
                    />
                  </div>
                </div>

                {/* NOMINAL BILLING */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Nominal Billing <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="nominal_billing"
                    value={editData.nominal_billing}
                    onChange={handleEditChange}
                    placeholder="Contoh: 12500000"
                    min="1"
                    className="input input-bordered w-full rounded-xl bg-white"
                    disabled={loadingEdit}
                  />

                  <p className="text-[10px] text-gray-400 mt-1">
                    Masukkan nominal tanpa titik atau koma.
                  </p>
                </div>

                {/* INFO */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaEdit className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-700">
                        Edit Data COD
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Perubahan data akan disimpan melalui API.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-white">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={loadingEdit}
                  className="btn rounded-full bg-white border border-gray-300 text-gray-600 px-6"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loadingEdit}
                  className="btn rounded-full bg-primary text-white px-6 gap-2 min-w-[160px]"
                >
                  {loadingEdit ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableDataCod;