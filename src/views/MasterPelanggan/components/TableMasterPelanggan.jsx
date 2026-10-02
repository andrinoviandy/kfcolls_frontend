import React, {
  useEffect,
  useState,
} from "react";

import {
  FaEllipsisV,
  FaHashtag,
  FaUsers,
  FaBuilding,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPencilAlt,
  FaTrash,
  FaFilter,
  FaTimes,
  FaSave,
  FaClipboardList,
  FaStore,
  FaSyncAlt,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";

import {
  swal,
} from "global/helper/swal";

import storeSchema from "global/store";


// =====================================================
// STATUS
// =====================================================

const statusConfig = {

  AKTIF: {
    label: "Aktif",
    icon: FaCheckCircle,
    className:
      "bg-green-100 text-green-700",
  },

  NONAKTIF: {
    label: "Nonaktif",
    icon: FaTimesCircle,
    className:
      "bg-red-100 text-red-700",
  },

};


// =====================================================
// HELPER
// =====================================================

const displayValue = (value) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return String(value);

};


// =====================================================
// NORMALIZE DATA API
// =====================================================

const normalizePelanggan = (item = {}) => {

  return {

    ...item,

    id:
      item?.customer_id ||
      item?.id,

    customer_id:
      item?.customer_id ||
      item?.id ||
      "-",

    kode_customer:
      item?.kode_customer ||
      item?.customer_code ||
      "-",

    nama_customer:
      item?.nama_customer ||
      item?.name ||
      item?.nama ||
      "-",

    jenis_customer:
      item?.jenis_customer ||
      item?.customer_groups_1_description ||
      item?.customer_group ||
      "-",

    cabang:
      item?.cabang ||
      item?.sales_office_description ||
      item?.sales_office ||
      "-",

    alamat:
      item?.alamat ||
      item?.address ||
      "-",

    kota:
      item?.kota ||
      item?.city ||
      "-",

    provinsi:
      item?.provinsi ||
      item?.province ||
      "-",

    no_npwp:
      item?.no_npwp ||
      "-",

    nama_npwp:
      item?.nama_npwp ||
      "-",

    status:
      String(
        item?.status ||
        item?.status_outlet ||
        "NONAKTIF"
      ).toUpperCase(),

  };

};


// =====================================================
// COMPONENT
// =====================================================

const TableMasterPelanggan = ({
  dimensionScreenW,
  check,
  loginAccess,
}) => {


  // ===================================================
  // STATE
  // ===================================================

  const [
    tableData,
    setTableData,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    keyword,
    setKeyword,
  ] = useState("");


  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("ALL");


  const [
    selectedCabang,
    setSelectedCabang,
  ] = useState("ALL");


  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const [
    perPage,
    setPerPage,
  ] = useState(10);


  const [
    totalData,
    setTotalData,
  ] = useState(0);


  const [
    totalPage,
    setTotalPage,
  ] = useState(0);


  const [
    cabangOptions,
    setCabangOptions,
  ] = useState([]);


  const [
    selectedData,
    setSelectedData,
  ] = useState(null);


  const [
    showDetail,
    setShowDetail,
  ] = useState(false);


  const [
    showEdit,
    setShowEdit,
  ] = useState(false);


  const [
    editData,
    setEditData,
  ] = useState(null);


  // ===================================================
  // SUMMARY
  // ===================================================

  const [
    summaryData,
    setSummaryData,
  ] = useState({

    total: 0,

    aktif: 0,

    nonaktif: 0,

    cabang: 0,

  });


  // ===================================================
  // GET REFERENSI CABANG
  // ===================================================

  const getReferensiCabang = async () => {

    try {

      const response =
        await storeSchema.actions.getReferensiByJenis(
          "cabang_id"
        );


      if (
        response?.status === true
      ) {

        const data =
          (
            response?.data ||
            []
          ).map(
            (item) => ({

              label:
                item?.ur_ref,

              value:
                item?.kd_ref,

            })
          );


        setCabangOptions(data);

      }

    } catch (error) {

      console.error(
        "ERROR GET REFERENSI CABANG:",
        error
      );

    }

  };


  // ===================================================
  // GET DATA PELANGGAN
  // ===================================================

  const getDataPelanggan = async () => {

    try {

      setLoading(true);


      const payload = {

        page:
          currentPage,

        limit:
          perPage,

        keyword:
          keyword.trim(),

        status:
          selectedStatus === "ALL"
            ? ""
            : selectedStatus,

        sales_office:
          selectedCabang === "ALL"
            ? ""
            : selectedCabang,

      };


      console.log(
        "PAYLOAD GET DATA PELANGGAN:",
        payload
      );


      const res =
        await storeSchema.actions.getDataPelanggan(
          payload
        );


      console.log(
        "RESPONSE GET DATA PELANGGAN:",
        res
      );


      if (
        res?.status !== true
      ) {

        throw new Error(
          res?.message ||
          "Gagal mengambil data pelanggan"
        );

      }


      const responseData =
        res?.data || {};


      const listData =
        responseData?.list_data || [];


      // =================================================
      // TABLE DATA
      // =================================================

      const normalizedData =
        listData.map(
          (
            item,
            index
          ) => ({

            ...normalizePelanggan(
              item
            ),

            No:
              (
                currentPage -
                1
              ) *
                perPage +
              index +
              1,

          })
        );


      setTableData(
        normalizedData
      );


      // =================================================
      // PAGINATION
      // =================================================

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


      // =================================================
      // SUMMARY
      // =================================================

      const summary =
        responseData?.summary ||
        {};


      setSummaryData({

        total:
          Number(
            summary?.total ||
            summary?.total_pelanggan ||
            summary?.total_data ||
            responseData?.total_data ||
            0
          ),

        aktif:
          Number(
            summary?.aktif ||
            summary?.total_aktif ||
            summary?.pelanggan_aktif ||
            0
          ),

        nonaktif:
          Number(
            summary?.nonaktif ||
            summary?.total_nonaktif ||
            summary?.pelanggan_nonaktif ||
            0
          ),

        cabang:
          Number(
            summary?.cabang ||
            summary?.total_cabang ||
            0
          ),

      });


    } catch (error) {

      console.error(
        "ERROR GET DATA PELANGGAN:",
        error
      );


      setTableData([]);

      setTotalData(0);

      setTotalPage(0);


      setSummaryData({

        total: 0,

        aktif: 0,

        nonaktif: 0,

        cabang: 0,

      });


      await swal.error(
        error?.message ||
        "Gagal mengambil data pelanggan"
      );


    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // INITIAL LOAD REFERENSI
  // ===================================================

  useEffect(() => {

    getReferensiCabang();

  }, []);


  // ===================================================
  // SERVER SIDE SEARCH / FILTER / PAGINATION
  // ===================================================

  useEffect(() => {

    const timer =
      setTimeout(
        () => {

          getDataPelanggan();

        },
        keyword.trim()
          ? 400
          : 0
      );


    return () => {

      clearTimeout(timer);

    };

  }, [

    currentPage,

    perPage,

    keyword,

    selectedStatus,

    selectedCabang,

  ]);


  // ===================================================
  // RESET FILTER
  // ===================================================

  const resetFilter = () => {

    setKeyword("");

    setSelectedStatus(
      "ALL"
    );

    setSelectedCabang(
      "ALL"
    );

    setCurrentPage(1);

  };


  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {

    setCurrentPage(1);

    getDataPelanggan();

  };


  // ===================================================
  // DETAIL
  // ===================================================

  const handleDetail = (
    data
  ) => {

    setSelectedData(
      data
    );

    setShowDetail(
      true
    );

  };


  const closeDetail = () => {

    setShowDetail(false);

    setSelectedData(null);

  };


  // ===================================================
  // EDIT
  // ===================================================

  const handleEdit = (
    data
  ) => {

    setEditData({
      ...data,
    });

    setShowEdit(true);

  };


  const closeEdit = () => {

    setEditData(null);

    setShowEdit(false);

  };


  // ===================================================
  // SAVE EDIT
  // ===================================================

  const handleSaveEdit = async () => {

    if (
      !editData?.nama_customer ||
      !String(
        editData?.nama_customer
      ).trim()
    ) {

      await swal.warning(
        "Nama pelanggan wajib diisi."
      );

      return;

    }


    if (
      !editData?.cabang ||
      !String(
        editData?.cabang
      ).trim()
    ) {

      await swal.warning(
        "Cabang wajib diisi."
      );

      return;

    }


    if (
      !editData?.alamat ||
      !String(
        editData?.alamat
      ).trim()
    ) {

      await swal.warning(
        "Alamat wajib diisi."
      );

      return;

    }


    /*
     * API UPDATE BELUM DIBERIKAN.
     *
     * Kalau nanti sudah ada:
     *
     * await storeSchema.actions.updatePelanggan(
     *   editData
     * );
     *
     * Setelah berhasil:
     *
     * closeEdit();
     * getDataPelanggan();
     */


    closeEdit();

    await swal.success(
      "Data berhasil divalidasi."
    );

  };


  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (
    data
  ) => {

    const result =
      await swal.confirm(
        "Hapus Pelanggan",
        `Apakah pelanggan "${displayValue(
          data?.nama_customer
        )}" akan dihapus?`
      );


    if (!result) {

      return;

    }


    /*
     * API DELETE BELUM DIBERIKAN.
     *
     * Nanti dapat dihubungkan:
     *
     * await storeSchema.actions.deletePelanggan({
     *   customer_id:
     *     data.customer_id
     * });
     *
     * Kemudian:
     *
     * getDataPelanggan();
     */


    await swal.success(
      "Silakan hubungkan aksi hapus dengan API delete pelanggan."
    );

  };


  // ===================================================
  // STATUS
  // ===================================================

  const renderStatus = (
    status
  ) => {

    const normalizedStatus =
      String(
        status ||
        ""
      ).toUpperCase();


    const config =
      statusConfig[
        normalizedStatus
      ];


    if (!config) {

      return (

        <span
          className="
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            bg-gray-100
            text-gray-600
          "
        >

          {displayValue(
            status
          )}

        </span>

      );

    }


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
  // HEADER TABLE
  // ===================================================

  const headerTable = [

    {
      label:
        "Aksi",

      icon:
        <FaEllipsisV />,

    },

    {
      label:
        "No",

      icon:
        <FaHashtag />,

    },

    {
      label:
        "Customer",

      icon:
        <FaUsers />,

    },

    {
      label:
        "Jenis",

      icon:
        <FaBuilding />,

    },

    {
      label:
        "Cabang",

      icon:
        <FaStore />,

    },

    {
      label:
        "Alamat",

      icon:
        <FaMapMarkerAlt />,

    },

    {
      label:
        "NPWP",

      icon:
        <FaClipboardList />,

    },

    {
      label:
        "Status",

      icon:
        <FaClipboardList />,

    },

  ];


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
      {/* SEARCH + FILTER */}
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
            lg:w-[420px]
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
              Cari customer / kode / NPWP...
            "
            className="grow"
            value={
              keyword
            }
            onChange={
              (e) => {

                setKeyword(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }
            }
          />

        </div>


        {/* FILTER */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* STATUS */}

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[170px]
            "
            value={
              selectedStatus
            }
            onChange={
              (e) => {

                setSelectedStatus(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }
            }
          >

            <option value="ALL">
              Semua Status
            </option>

            <option value="AKTIF">
              Aktif
            </option>

            <option value="NONAKTIF">
              Nonaktif
            </option>

          </select>


          {/* CABANG */}

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[200px]
            "
            value={
              selectedCabang
            }
            onChange={
              (e) => {

                setSelectedCabang(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }
            }
          >

            <option value="ALL">
              Semua Cabang
            </option>


            {
              cabangOptions.map(
                (cabang) => (

                  <option
                    key={
                      cabang.value
                    }
                    value={
                      cabang.value
                    }
                  >

                    {
                      cabang.label
                    }

                  </option>

                )
              )
            }

          </select>


          {/* REFRESH */}

          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              loading
            }
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-gray-200
              bg-white
              text-gray-600
              text-sm
              font-semibold
              hover:bg-gray-50
              disabled:opacity-50
            "
          >

            <FaSyncAlt
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>


          {/* RESET */}

          <button
            type="button"
            onClick={
              resetFilter
            }
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-gray-200
              bg-white
              text-gray-600
              text-sm
              font-semibold
              hover:bg-gray-50
            "
          >

            <FaFilter />

            Reset

          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* SUMMARY CARD */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >

        {/* TOTAL */}

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
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-blue-700
                "
              >
                Total Pelanggan
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-blue-900
                "
              >

                {
                  Number(
                    summaryData.total ||
                    0
                  ).toLocaleString(
                    "id-ID"
                  )
                }

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

              <FaUsers
                className="
                  text-blue-600
                "
              />

            </div>

          </div>

        </div>


        {/* AKTIF */}

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
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-green-700
                "
              >
                Pelanggan Aktif
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-green-900
                "
              >

                {
                  Number(
                    summaryData.aktif ||
                    0
                  ).toLocaleString(
                    "id-ID"
                  )
                }

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

              <FaCheckCircle
                className="
                  text-green-600
                "
              />

            </div>

          </div>

        </div>


        {/* NONAKTIF */}

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
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-red-700
                "
              >
                Pelanggan Nonaktif
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-red-900
                "
              >

                {
                  Number(
                    summaryData.nonaktif ||
                    0
                  ).toLocaleString(
                    "id-ID"
                  )
                }

              </p>

            </div>


            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-red-100
                flex
                items-center
                justify-center
              "
            >

              <FaTimesCircle
                className="
                  text-red-600
                "
              />

            </div>

          </div>

        </div>


        {/* CABANG */}

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
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-purple-700
                "
              >
                Cabang
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-purple-900
                "
              >

                {
                  Number(
                    summaryData.cabang ||
                    0
                  ).toLocaleString(
                    "id-ID"
                  )
                }

              </p>

            </div>


            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-purple-100
                flex
                items-center
                justify-center
              "
            >

              <FaStore
                className="
                  text-purple-600
                "
              />

            </div>

          </div>

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
                        index
                      ) => (

                        <th
                          key={
                            index
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

                            {
                              h.icon
                            }

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
                  loading ? (

                    <tr>

                      <td
                        colSpan={
                          headerTable.length
                        }
                        className="
                          text-center
                          py-16
                        "
                      >

                        <div
                          className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-3
                          "
                        >

                          <span
                            className="
                              loading
                              loading-spinner
                              loading-md
                              text-primary
                            "
                          />

                          <span
                            className="
                              text-sm
                              text-gray-400
                            "
                          >
                            Memuat data pelanggan...
                          </span>

                        </div>

                      </td>

                    </tr>

                  ) : tableData.length === 0 ? (

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

                        <FaUsers
                          className="
                            text-4xl
                            text-gray-300
                            mx-auto
                            mb-3
                          "
                        />

                        Tidak ada data pelanggan

                      </td>

                    </tr>

                  ) : (

                    tableData.map(
                      (
                        item,
                        index
                      ) => (

                        <tr
                          key={
                            item?.id ||
                            item?.customer_id ||
                            index
                          }
                          className="
                            border-b
                            hover:bg-blue-50
                            transition
                          "
                        >

                          {/* AKSI */}

                          <td
                            className="
                              px-4
                              py-3
                            "
                          >

                            <div
                              className="
                                dropdown
                                dropdown-right
                              "
                            >

                              <div
                                tabIndex={
                                  0
                                }
                                role="button"
                                className="
                                  w-9
                                  h-9
                                  rounded-full
                                  bg-blue-50
                                  text-primary
                                  flex
                                  items-center
                                  justify-center
                                  cursor-pointer
                                  hover:bg-primary
                                  hover:text-white
                                  transition
                                "
                              >

                                <FaEllipsisV />

                              </div>


                              <ul
                                tabIndex={
                                  0
                                }
                                className="
                                  dropdown-content
                                  menu
                                  p-2
                                  shadow-xl
                                  bg-white
                                  rounded-box
                                  border
                                  border-gray-100
                                  w-48
                                  z-[30]
                                "
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


                                <li>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        item
                                      )
                                    }
                                  >

                                    <FaPencilAlt />

                                    Edit Data

                                  </button>

                                </li>


                                <li>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        item
                                      )
                                    }
                                    className="
                                      text-red-500
                                    "
                                  >

                                    <FaTrash />

                                    Hapus

                                  </button>

                                </li>

                              </ul>

                            </div>

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

                            {
                              (
                                currentPage -
                                1
                              ) *
                                perPage +
                              index +
                              1
                            }

                          </td>


                          {/* CUSTOMER */}

                          <td
                            className="
                              px-4
                              py-3
                              min-w-[280px]
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


                              <div>

                                <p
                                  className="
                                    font-semibold
                                    text-gray-700
                                  "
                                >

                                  {
                                    displayValue(
                                      item?.nama_customer
                                    )
                                  }

                                </p>


                                <p
                                  className="
                                    text-xs
                                    text-gray-400
                                  "
                                >

                                  {
                                    displayValue(
                                      item?.kode_customer
                                    )
                                  }

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* JENIS */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            <span
                              className="
                                inline-flex
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
                                displayValue(
                                  item?.jenis_customer
                                )
                              }

                            </span>

                          </td>


                          {/* CABANG */}

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

                              <FaStore
                                className="
                                  text-orange-500
                                "
                              />

                              <span
                                className="
                                  text-sm
                                  font-semibold
                                  text-gray-700
                                "
                              >

                                {
                                  displayValue(
                                    item?.cabang
                                  )
                                }

                              </span>

                            </div>

                          </td>


                          {/* ALAMAT */}

                          <td
                            className="
                              px-4
                              py-3
                              min-w-[280px]
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                gap-2
                                text-sm
                                text-gray-600
                              "
                            >

                              <FaMapMarkerAlt
                                className="
                                  text-orange-500
                                  mt-1
                                  shrink-0
                                "
                              />

                              <span>

                                {
                                  displayValue(
                                    item?.alamat
                                  )
                                }

                              </span>

                            </div>

                          </td>


                          {/* NPWP */}

                          <td
                            className="
                              px-4
                              py-3
                              min-w-[240px]
                            "
                          >

                            <div
                              className="
                                flex
                                flex-col
                                gap-1
                              "
                            >

                              <div
                                className="
                                  text-sm
                                  font-semibold
                                  text-gray-700
                                "
                              >

                                {
                                  displayValue(
                                    item?.no_npwp
                                  )
                                }

                              </div>

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >

                                {
                                  displayValue(
                                    item?.nama_npwp
                                  )
                                }

                              </div>

                            </div>

                          </td>


                          {/* STATUS */}

                          <td
                            className="
                              px-4
                              py-3
                            "
                          >

                            {
                              renderStatus(
                                item?.status
                              )
                            }

                          </td>

                        </tr>

                      )
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
                      (e) => {

                        setPerPage(
                          Number(
                            e.target.value
                          )
                        );

                        setCurrentPage(
                          1
                        );

                      }
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

                    <option value="100">
                      100
                    </option>

                  </select>

                </div>

              </div>


              {
                totalPage > 0 && (

                  <ReactPaginate

                    breakLabel="..."

                    previousLabel="←"

                    nextLabel="→"

                    pageCount={
                      totalPage
                    }

                    onPageChange={
                      (e) => {

                        setCurrentPage(
                          e.selected + 1
                        );

                      }
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
      {/* DETAIL MODAL */}
      {/* ================================================= */}

      {
        showDetail &&
        selectedData && (

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
              closeDetail
            }
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={
                (e) =>
                  e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div
                className="
                  bg-primary
                  px-6
                  py-4
                  text-white
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
                        bg-white/10
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <FaUsers />

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >
                        Detail Pelanggan
                      </h3>

                      <p
                        className="
                          text-xs
                          text-blue-100
                        "
                      >

                        {
                          displayValue(
                            selectedData?.customer_id
                          )
                        }

                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      closeDetail
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


              {/* BODY */}

              <div
                className="
                  p-6
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-5
                "
              >

                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Customer ID
                  </p>

                  <p className="
                    font-bold
                    text-primary
                  ">

                    {
                      displayValue(
                        selectedData?.customer_id
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Kode Customer
                  </p>

                  <p className="
                    font-semibold
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.kode_customer
                      )
                    }

                  </p>

                </div>


                <div
                  className="
                    sm:col-span-2
                  "
                >

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Nama Pelanggan
                  </p>

                  <p className="
                    font-semibold
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.nama_customer
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Jenis Customer
                  </p>

                  <p className="
                    font-semibold
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.jenis_customer
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Cabang
                  </p>

                  <p className="
                    font-semibold
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.cabang
                      )
                    }

                  </p>

                </div>


                <div
                  className="
                    sm:col-span-2
                  "
                >

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Alamat
                  </p>

                  <p className="
                    text-sm
                    text-gray-600
                  ">

                    {
                      displayValue(
                        selectedData?.alamat
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Kota
                  </p>

                  <p className="
                    font-medium
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.kota
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Provinsi
                  </p>

                  <p className="
                    font-medium
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.provinsi
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    No. NPWP
                  </p>

                  <p className="
                    font-medium
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.no_npwp
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Nama NPWP
                  </p>

                  <p className="
                    font-medium
                    text-gray-700
                  ">

                    {
                      displayValue(
                        selectedData?.nama_npwp
                      )
                    }

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    Status
                  </p>

                  <div className="mt-1">

                    {
                      renderStatus(
                        selectedData?.status
                      )
                    }

                  </div>

                </div>

              </div>


              {/* FOOTER */}

              <div
                className="
                  border-t
                  bg-gray-50
                  px-5
                  py-4
                  flex
                  justify-end
                "
              >

                <button
                  type="button"
                  onClick={
                    closeDetail
                  }
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    bg-primary
                    text-white
                    text-sm
                    font-semibold
                    hover:opacity-90
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
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {
        showEdit &&
        editData && (

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
              closeEdit
            }
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-3xl
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={
                (e) =>
                  e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div
                className="
                  bg-primary
                  px-6
                  py-4
                  text-white
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
                        bg-white/10
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <FaPencilAlt />

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >
                        Edit Pelanggan
                      </h3>

                      <p
                        className="
                          text-xs
                          text-blue-100
                        "
                      >

                        {
                          displayValue(
                            editData?.customer_id
                          )
                        }

                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      closeEdit
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


              {/* FORM */}

              <div
                className="
                  p-6
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >

                {/* CUSTOMER ID */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Customer ID
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.customer_id ||
                      ""
                    }
                    disabled
                    className="
                      input
                      input-bordered
                      w-full
                      bg-gray-100
                      rounded-xl
                    "
                  />

                </div>


                {/* KODE */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Kode Customer
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.kode_customer ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            kode_customer:
                              e.target.value,

                          })
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


                {/* NAMA */}

                <div
                  className="
                    md:col-span-2
                  "
                >

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Nama Pelanggan
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.nama_customer ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            nama_customer:
                              e.target.value,

                          })
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


                {/* JENIS */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Jenis Customer
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.jenis_customer ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            jenis_customer:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      input
                      input-bordered
                      w-full
                      rounded-xl
                      bg-white
                    "
                  />

                </div>


                {/* CABANG */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Cabang
                  </label>

                  <select
                    value={
                      editData?.cabang ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            cabang:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      select
                      select-bordered
                      w-full
                      rounded-xl
                      bg-white
                    "
                  >

                    <option value="">
                      Pilih Cabang
                    </option>


                    {
                      cabangOptions.map(
                        (cabang) => (

                          <option
                            key={
                              cabang.value
                            }
                            value={
                              cabang.value
                            }
                          >

                            {
                              cabang.label
                            }

                          </option>

                        )
                      )
                    }

                  </select>

                </div>


                {/* KOTA */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Kota
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.kota ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            kota:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      input
                      input-bordered
                      w-full
                      rounded-xl
                    "
                  />

                </div>


                {/* PROVINSI */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Provinsi
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.provinsi ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            provinsi:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      input
                      input-bordered
                      w-full
                      rounded-xl
                    "
                  />

                </div>


                {/* ALAMAT */}

                <div
                  className="
                    md:col-span-2
                  "
                >

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Alamat
                  </label>

                  <textarea
                    value={
                      editData?.alamat ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            alamat:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      textarea
                      textarea-bordered
                      w-full
                      min-h-[100px]
                      rounded-xl
                    "
                  />

                </div>


                {/* NO NPWP */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    No. NPWP
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.no_npwp ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            no_npwp:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      input
                      input-bordered
                      w-full
                      rounded-xl
                    "
                  />

                </div>


                {/* NAMA NPWP */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Nama NPWP
                  </label>

                  <input
                    type="text"
                    value={
                      editData?.nama_npwp ||
                      ""
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            nama_npwp:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      input
                      input-bordered
                      w-full
                      rounded-xl
                    "
                  />

                </div>


                {/* STATUS */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >
                    Status
                  </label>

                  <select
                    value={
                      editData?.status ||
                      "AKTIF"
                    }
                    onChange={
                      (e) =>
                        setEditData(
                          (prev) => ({

                            ...prev,

                            status:
                              e.target.value,

                          })
                        )
                    }
                    className="
                      select
                      select-bordered
                      w-full
                      rounded-xl
                      bg-white
                    "
                  >

                    <option value="AKTIF">
                      Aktif
                    </option>

                    <option value="NONAKTIF">
                      Nonaktif
                    </option>

                  </select>

                </div>

              </div>


              {/* FOOTER */}

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
                    closeEdit
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
                    handleSaveEdit
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

                  <FaSave />

                  Simpan Perubahan

                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

};


export default TableMasterPelanggan;