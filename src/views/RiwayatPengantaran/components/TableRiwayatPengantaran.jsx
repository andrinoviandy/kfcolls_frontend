import React, {
  useEffect,
  useState,
} from "react";

import {
  FaTruck,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFileInvoiceDollar,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaEllipsisV,
  FaHashtag,
  FaEye,
  FaInfoCircle,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

import ReactPaginate from "react-paginate";

import {
  swal,
} from "global/helper/swal";

import storeSchema from "global/store";


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
// STATUS CONFIG
// =====================================================

const statusConfig = {
  BELUM_DIANTAR: {
    label: "Belum Diantar",
    icon: FaClock,
    className: "bg-amber-100 text-amber-700",
  },

  SEDANG_DIANTAR: {
    label: "Sedang Diantar",
    icon: FaTruck,
    className: "bg-blue-100 text-blue-700",
  },

  SUDAH_DIANTAR: {
    label: "Sudah Diantar",
    icon: FaCheckCircle,
    className: "bg-green-100 text-green-700",
  },

  GAGAL_DIANTAR: {
    label: "Gagal Diantar",
    icon: FaTimesCircle,
    className: "bg-red-100 text-red-700",
  },
};


// =====================================================
// COMPONENT
// =====================================================

const TableRiwayatPengantaran = ({
  dimensionScreenW,
  check,
  loginAccess,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totalData, setTotalData] = useState(0);

  const [totalPage, setTotalPage] = useState(0);

  // keyword = isi input yang sedang diketik
  const [keyword, setKeyword] = useState("");

  // searchKeyword = keyword yang benar-benar dikirim ke API
  const [searchKeyword, setSearchKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [selectedData, setSelectedData] = useState(null);


  // ===================================================
  // SUMMARY
  // ===================================================

  const [summaryData, setSummaryData] = useState({
    total: 0,
    belum_diantar: 0,
    sedang_diantar: 0,
    sudah_diantar: 0,
    gagal_diantar: 0,
  });


  // ===================================================
  // GET DATA RIWAYAT PENGANTARAN
  // ===================================================

  const getDataRiwayatPengantaran = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword.trim(),
      };

      console.log(
        "PAYLOAD GET RIWAYAT PENGANTARAN:",
        payload
      );

      const res =
        await storeSchema.actions.GetListRiwayatPengantaran(
          payload
        );

      console.log(
        "RESPONSE GET RIWAYAT PENGANTARAN:",
        res
      );

      if (res?.status !== true) {
        throw new Error(
          res?.message ||
          "Gagal mengambil data riwayat pengantaran"
        );
      }

      const responseData = res?.data || {};

      const listData =
        responseData?.list_data || [];

      // =================================================
      // TABLE DATA
      // =================================================

      const normalizedData =
        listData.map(
          (item, index) => ({
            ...item,

            id:
              item?.id ||
              item?.id_pengantaran ||
              item?.pengantaran_id ||
              item?.riwayat_pengantaran_id ||
              index,

            no_faktur:
              item?.no_faktur ||
              item?.no_invoice ||
              item?.invoice ||
              "-",

            nama_customer:
              item?.nama_customer ||
              item?.customer_name ||
              item?.customer ||
              "-",

            alamat:
              item?.alamat ||
              item?.address ||
              "-",

            sales:
              item?.sales ||
              item?.nama_sales ||
              item?.sales_name ||
              "-",

            tanggal_penugasan:
              item?.tanggal_penugasan ||
              item?.tgl_penugasan ||
              item?.assignment_date ||
              null,

            tanggal_pengantaran:
              item?.tanggal_pengantaran ||
              item?.tgl_pengantaran ||
              item?.delivery_date ||
              null,

            status:
              String(
                item?.status ||
                item?.status_pengantaran ||
                "BELUM_DIANTAR"
              ).toUpperCase(),

            No:
              (currentPage - 1) *
              perPage +
              index +
              1,
          })
        );

      setTableData(normalizedData);


      // =================================================
      // PAGINATION
      // =================================================

      setTotalData(
        Number(
          responseData?.total_data ||
          responseData?.total ||
          0
        )
      );

      setTotalPage(
        Number(
          responseData?.total_halaman ||
          responseData?.total_page ||
          responseData?.total_pages ||
          0
        )
      );


      // =================================================
      // SUMMARY
      // =================================================
      //
      // Mengikuti pola response getListManajemenUser:
      // responseData.summary
      //
      // Jika backend mengirim summary, gunakan summary.
      // Jika field summary tidak tersedia, total memakai
      // total_data. Count status tidak dihitung dari
      // halaman karena data tabel adalah server-side.
      // =================================================

      const summary =
        responseData?.summary || {};

      setSummaryData({
        total:
          Number(
            summary?.total ||
            summary?.total_pengantaran ||
            summary?.total_data ||
            responseData?.total_data ||
            0
          ),

        belum_diantar:
          Number(
            summary?.belum_diantar ||
            summary?.total_belum_diantar ||
            summary?.belum_diantarkan ||
            0
          ),

        sedang_diantar:
          Number(
            summary?.sedang_diantar ||
            summary?.total_sedang_diantar ||
            0
          ),

        sudah_diantar:
          Number(
            summary?.sudah_diantar ||
            summary?.total_sudah_diantar ||
            0
          ),

        gagal_diantar:
          Number(
            summary?.gagal_diantar ||
            summary?.total_gagal_diantar ||
            0
          ),
      });

    } catch (error) {
      console.error(
        "ERROR GET RIWAYAT PENGANTARAN:",
        error
      );

      setTableData([]);

      setTotalData(0);

      setTotalPage(0);

      setSummaryData({
        total: 0,
        belum_diantar: 0,
        sedang_diantar: 0,
        sudah_diantar: 0,
        gagal_diantar: 0,
      });

      await swal.error(
        error?.message ||
        "Gagal mengambil data riwayat pengantaran"
      );

    } finally {
      setLoading(false);
    }
  };


  // ===================================================
  // INITIAL LOAD + SERVER SIDE SEARCH / PAGINATION
  // ===================================================

  useEffect(() => {
    getDataRiwayatPengantaran();
  }, [
    currentPage,
    perPage,
    searchKeyword,
  ]);


  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = () => {
    setCurrentPage(1);

    setSearchKeyword(
      keyword.trim()
    );
  };


  // ===================================================
  // ENTER SEARCH
  // ===================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {
    getDataRiwayatPengantaran();
  };


  // ===================================================
  // PAGINATION
  // ===================================================

  const changePage = (e) => {
    setCurrentPage(
      e.selected + 1
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
      icon: <FaFileInvoiceDollar />,
    },

    {
      label: "Customer",
      icon: <FaBuilding />,
    },

    {
      label: "Alamat",
      icon: <FaMapMarkerAlt />,
    },

    {
      label: "Sales",
      icon: <FaUser />,
    },

    {
      label: "Tgl Penugasan",
      icon: <FaCalendarAlt />,
    },

    {
      label: "Tgl Pengantaran",
      icon: <FaTruck />,
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
  // CARDS
  // ===================================================

  const cards = [
    {
      title: "Total Pengantaran",
      value: summaryData.total,
      description: "Semua riwayat faktur",
      icon: FaClipboardList,

      color: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: "text-blue-500",
      },
    },

    {
      title: "Belum Diantar",
      value: summaryData.belum_diantar,
      description: "Menunggu pengantaran",
      icon: FaClock,

      color: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: "text-amber-500",
      },
    },

    {
      title: "Sedang Diantar",
      value: summaryData.sedang_diantar,
      description: "Dalam proses pengantaran",
      icon: FaTruck,

      color: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: "text-blue-500",
      },
    },

    {
      title: "Sudah Diantar",
      value: summaryData.sudah_diantar,
      description: "Faktur telah diterima",
      icon: FaCheckCircle,

      color: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: "text-green-500",
      },
    },

    {
      title: "Gagal Diantar",
      value: summaryData.gagal_diantar,
      description: "Pengantaran gagal",
      icon: FaTimesCircle,

      color: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: "text-red-500",
      },
    },
  ];


  // ===================================================
  // RENDER STATUS
  // ===================================================

  const renderStatus = (status) => {
    const config =
      statusConfig[status];

    if (!config) {
      return (
        <span
          className="
            inline-flex
            items-center
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            bg-gray-100
            text-gray-600
          "
        >
          {status || "-"}
        </span>
      );
    }

    const Icon = config.icon;

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
  // DETAIL
  // ===================================================

  const handleDetail = (data) => {
    setSelectedData(data);
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
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-5
          gap-4
        "
      >
        {cards.map(
          (card, index) => {
            const Icon =
              card.icon;

            return (
              <div
                key={index}
                className={`
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  shadow-sm
                  p-5
                  ${card.color.bg}
                `}
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
                        text-sm
                        font-medium
                        text-gray-500
                      "
                    >
                      {card.title}
                    </p>

                    <p
                      className={`
                        mt-2
                        text-2xl
                        font-bold
                        ${card.color.text}
                      `}
                    >
                      {card.value}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                      "
                    >
                      {card.description}
                    </p>
                  </div>

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-white
                      flex
                      items-center
                      justify-center
                      shadow-sm
                    "
                  >
                    <Icon
                      className={`
                        text-xl
                        ${card.color.icon}
                      `}
                    />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          gap-3
          justify-between
          items-stretch
          lg:items-center
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-2
            w-full
            lg:w-auto
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
            <FaSearch
              className="
                text-gray-400
                text-sm
              "
            />

            <input
              type="text"
              placeholder="
                Cari faktur / customer / sales...
              "
              className="grow"
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
            />
          </div>


          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-2
              rounded-full
              bg-primary
              text-white
              text-sm
              font-semibold
              hover:bg-blue-800
              disabled:opacity-60
              transition
            "
          >
            <FaSearch />
            Search
          </button>

        </div>


        {/* REFRESH */}

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-white
            border
            border-gray-200
            text-gray-600
            text-sm
            font-semibold
            hover:bg-blue-50
            hover:text-blue-700
            disabled:opacity-60
            transition
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

          <div className="relative">

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

                {/* =============================== */}
                {/* HEADER */}
                {/* =============================== */}

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
                            <span
                              className="
                                text-sm
                              "
                            >
                              {h.icon}
                            </span>

                            {h.label}
                          </div>
                        </th>
                      )
                    )}

                  </tr>
                </thead>


                {/* =============================== */}
                {/* BODY */}
                {/* =============================== */}

                <tbody>

                  {loading ? (

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
                        <div
                          className="
                            flex
                            flex-col
                            items-center
                            gap-3
                          "
                        >
                          <FaSyncAlt
                            className="
                              text-3xl
                              text-blue-500
                              animate-spin
                            "
                          />

                          <span>
                            Memuat data...
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
                        <div
                          className="
                            flex
                            flex-col
                            items-center
                            gap-3
                          "
                        >
                          <FaTruck
                            className="
                              text-4xl
                              text-gray-300
                            "
                          />

                          <span>
                            Tidak ada riwayat
                            pengantaran
                          </span>
                        </div>
                      </td>
                    </tr>

                  ) : (

                    tableData.map(
                      (v, i) => (

                        <tr
                          key={
                            v.id ||
                            `${v.no_faktur}-${i}`
                          }
                          className="
                            hover:bg-blue-50
                            transition
                            duration-200
                            border-b
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
                            {(currentPage - 1)
                              * perPage
                              + i
                              + 1}
                          </td>


                          {/* NO FAKTUR */}

                          <td
                            className="
                              px-4
                              py-3
                              font-semibold
                              text-blue-900
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
                                  rounded-lg
                                  bg-blue-50
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <FaFileInvoiceDollar
                                  className="
                                    text-blue-700
                                  "
                                />
                              </div>

                              {v.no_faktur}
                            </div>
                          </td>


                          {/* CUSTOMER */}

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
                                min-w-[180px]
                              "
                            >
                              <div
                                className="
                                  w-9
                                  h-9
                                  rounded-full
                                  bg-blue-50
                                  text-blue-900
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
                                    v.nama_customer
                                  }
                                </p>
                              </div>
                            </div>
                          </td>


                          {/* ALAMAT */}

                          <td
                            className="
                              px-4
                              py-3
                              min-w-[250px]
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                gap-2
                                text-gray-600
                                text-sm
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
                                {v.alamat}
                              </span>
                            </div>
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
                                {v.sales}
                              </span>
                            </div>
                          </td>


                          {/* TANGGAL PENUGASAN */}

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
                              <FaCalendarAlt
                                className="
                                  text-blue-700
                                "
                              />

                              <span
                                className="
                                  text-sm
                                  text-gray-600
                                "
                              >
                                {formatDate(
                                  v.tanggal_penugasan
                                )}
                              </span>
                            </div>
                          </td>


                          {/* TANGGAL PENGANTARAN */}

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
                              <FaTruck
                                className="
                                  text-orange-500
                                "
                              />

                              <span
                                className="
                                  text-sm
                                  text-gray-600
                                "
                              >
                                {formatDate(
                                  v.tanggal_pengantaran
                                )}
                              </span>
                            </div>
                          </td>


                          {/* STATUS */}

                          <td
                            className="
                              px-4
                              py-3
                            "
                          >
                            {renderStatus(
                              v.status
                            )}
                          </td>


                          {/* AKSI */}

                          <td
                            className="
                              px-4
                              py-3
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleDetail(v)
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-full
                                bg-blue-50
                                text-blue-700
                                text-xs
                                font-semibold
                                hover:bg-primary
                                hover:text-white
                                transition
                              "
                            >
                              <FaEye />
                              Detail
                            </button>
                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

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
                    {startIndex}
                  </span>

                  {" "}to{" "}

                  <span
                    className="
                      font-semibold
                    "
                  >
                    {endIndex}
                  </span>

                  {" "}of{" "}

                  <span
                    className="
                      font-semibold
                    "
                  >
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
                    onChange={(e) => {
                      setCurrentPage(1);

                      setPerPage(
                        parseInt(
                          e.target.value,
                          10
                        )
                      );
                    }}
                    value={perPage}
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

              {totalPage > 0 && (
                <div
                  className="
                    overflow-auto
                    pb-1
                    flex
                    justify-center
                  "
                >
                  <ReactPaginate
                    breakLabel="..."
                    previousLabel="←"
                    nextLabel="→"

                    pageCount={
                      totalPage
                    }

                    onPageChange={
                      changePage
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
                      !border-blue-900
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
                      transition-all
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
                      hover:bg-blue-50
                      transition-all
                    "

                    nextClassName="
                      min-w-9
                      h-9
                      border
                      border-gray-300
                      rounded-full
                      bg-white
                      hover:bg-blue-50
                      transition-all
                    "

                    previousLinkClassName="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                      px-3
                    "

                    nextLinkClassName="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                      px-3
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
                </div>
              )}

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* DETAIL MODAL */}
      {/* ================================================= */}

      {selectedData && (
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
          onClick={() =>
            setSelectedData(null)
          }
        >

          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              w-full
              max-w-lg
              overflow-hidden
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div
              className="
                bg-primary
                px-5
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
                    <FaTruck />
                  </div>

                  <div>
                    <h3
                      className="
                        font-bold
                      "
                    >
                      Detail Pengantaran
                    </h3>

                    <p
                      className="
                        text-xs
                        text-blue-100
                      "
                    >
                      Informasi faktur
                    </p>
                  </div>
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedData(null)
                  }
                  className="
                    text-white
                    text-xl
                    hover:text-orange-300
                  "
                >
                  ×
                </button>

              </div>
            </div>


            {/* MODAL BODY */}

            <div className="p-5">

              <div
                className="
                  flex
                  flex-col
                  gap-4
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
                      text-blue-900
                    "
                  >
                    {
                      selectedData.no_faktur
                    }
                  </p>
                </div>


                <div>
                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Customer
                  </p>

                  <p
                    className="
                      font-semibold
                      text-gray-700
                    "
                  >
                    {
                      selectedData.nama_customer
                    }
                  </p>
                </div>


                <div>
                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Alamat
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-600
                    "
                  >
                    {
                      selectedData.alamat
                    }
                  </p>
                </div>


                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                  "
                >

                  <div>
                    <p
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      Sales
                    </p>

                    <p
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      {
                        selectedData.sales
                      }
                    </p>
                  </div>


                  <div>
                    <p
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      Status
                    </p>

                    <div className="mt-1">
                      {renderStatus(
                        selectedData.status
                      )}
                    </div>
                  </div>

                </div>


                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                  "
                >

                  <div>
                    <p
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      Tanggal Penugasan
                    </p>

                    <p
                      className="
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      {formatDate(
                        selectedData.tanggal_penugasan
                      )}
                    </p>
                  </div>


                  <div>
                    <p
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      Tanggal Pengantaran
                    </p>

                    <p
                      className="
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      {formatDate(
                        selectedData.tanggal_pengantaran
                      )}
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div
              className="
                px-5
                py-4
                bg-gray-50
                border-t
                flex
                justify-end
              "
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedData(null)
                }
                className="
                  px-5
                  py-2
                  rounded-full
                  bg-primary
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-blue-800
                  transition
                "
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


export default TableRiwayatPengantaran;