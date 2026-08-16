import React, {
  useEffect,
  useState,
} from "react";

import {
  FaEllipsisV,
  FaHashtag,
  FaFileInvoiceDollar,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaUser,
} from "react-icons/fa";

import ReactPaginate from "react-paginate";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  IoSearch,
} from "react-icons/io5";

import storeSchema from "global/store";
import { swal } from "global/helper/swal";


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
// COMPONENT
// =====================================================

const TableDaftarTugasHarian = ({
  dimensionScreenW,
  check,
  loginAccess,
}) => {

  const navigation = useNavigate();
  const location = useLocation();


  // ===================================================
  // STATE
  // ===================================================

  const [allData, setAllData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [totalPage, setTotalPage] = useState(0);

  const [totalData, setTotalData] = useState(0);


  // ===================================================
  // HEADER TABLE
  // ===================================================

  const headerTable = [

    {
      label: "Aksi",
      icon: <FaEllipsisV />,
    },

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
      label: "Jatuh Tempo",
      icon: <FaCalendarAlt />,
    },

    {
      label: "Status",
      icon: <FaTruck />,
    },

  ];


  // ===================================================
  // GET DATA
  // ===================================================

  const getListTugasHarian = async () => {

    try {

      setLoading(true);

      /*
       * TODO:
       * Ganti dengan API/action yang sebenarnya.
       *
       * Contoh:
       *
       * storeSchema.actions.getListTugasHarian({
       *   page: currentPage,
       *   limit: perPage,
       *   keyword,
       * })
       */

      const response =
        await storeSchema.actions.getListTugasHarian({
          page: currentPage,
          limit: perPage,
          keyword: keyword,
        });


      if (response?.status === true) {

        setAllData(
          response?.data?.list_data || []
        );

        setTotalData(
          response?.data?.total_data || 0
        );

        setTotalPage(
          response?.data?.total_halaman || 0
        );

      } else {

        setAllData([]);

        setTotalData(0);

        setTotalPage(0);

      }

    } catch (error) {

      console.error(
        "Error fetching tugas harian:",
        error
      );

      swal.error(
        "Gagal mengambil data tugas harian"
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // INITIAL / PAGINATION
  // ===================================================

  useEffect(() => {

    getListTugasHarian();

    // eslint-disable-next-line
  }, [
    currentPage,
    perPage,
  ]);


  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = async (e) => {

    e.preventDefault();

    setCurrentPage(1);

    getListTugasHarian();

  };


  // ===================================================
  // PAGE
  // ===================================================

  const changePage = (e) => {

    const newPage =
      e.selected + 1;

    setCurrentPage(newPage);

  };


  // ===================================================
  // PER PAGE
  // ===================================================

  const changePerPage = (e) => {

    const newPerPage =
      parseInt(e.target.value);

    setPerPage(newPerPage);

    setCurrentPage(1);

  };


  // ===================================================
  // ANTAR FAKTUR
  // ===================================================

  const handleAntarFaktur = async (data) => {

    const result =
      await swal.confirm(
        "Antar Faktur",
        `Apakah faktur ${data.no_faktur} akan diantar?`
      );

    if (!result) return;


    try {

      setLoading(true);

      /*
       * TODO:
       *
       * Panggil API update status pengantaran
       *
       * await storeSchema.actions.antarkanFaktur({
       *   faktur_id: data.id,
       * });
       */

      await storeSchema.actions.antarkanFaktur({
        faktur_id: data.id,
      });


      swal.success(
        "Faktur berhasil diproses untuk pengantaran"
      );


      getListTugasHarian();

    } catch (error) {

      console.error(error);

      swal.error(
        "Gagal memproses pengantaran faktur"
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex =
    allData?.length > 0
      ? (currentPage - 1) * perPage + 1
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
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row gap-4 justify-between">

        <form
          onSubmit={handleSearch}
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
            lg:w-[350px]
          "
        >

          <IoSearch
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari nomor faktur / customer..."
            className="grow"
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            value={keyword}
          />

        </form>


        {/* TOTAL TUGAS */}

        <div
          className="
            flex
            items-center
            gap-3
            px-4
            py-2
            rounded-xl
            bg-orange-50
            border
            border-orange-100
          "
        >

          <div
            className="
              w-9
              h-9
              rounded-lg
              bg-orange-500
              flex
              items-center
              justify-center
            "
          >

            <FaTruck
              className="text-white"
            />

          </div>

          <div>

            <p className="text-xs text-gray-500">
              Total Tugas
            </p>

            <p className="font-bold text-orange-600">
              {totalData} Faktur
            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div
        className={
          dimensionScreenW < 768 && check
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

            {/* LOADING */}

            {loading && (

              <div
                className="
                  absolute
                  inset-0
                  z-50
                  flex
                  items-center
                  justify-center
                  bg-white/70
                  backdrop-blur-[1px]
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

                  <span
                    className="
                      loading
                      loading-spinner
                      loading-lg
                      text-blue-900
                    "
                  />

                  <span className="text-sm text-gray-600">
                    Memuat daftar tugas...
                  </span>

                </div>

              </div>

            )}


            <div
              className="
                overflow-auto
                rounded-2xl
                max-h-[65vh]
              "
            >

              <table className="table w-full">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <thead
                  className="
                    bg-blue-900
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

                            <span className="text-sm">
                              {h.icon}
                            </span>

                            {h.label}

                          </div>

                        </th>

                      )
                    )}

                  </tr>

                </thead>


                {/* ================================================= */}
                {/* BODY */}
                {/* ================================================= */}

                <tbody>


                  {allData.length === 0 ? (

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

                          <FaClipboardList
                            className="
                              text-4xl
                              text-gray-300
                            "
                          />

                          <span>
                            Tidak ada tugas pengantaran
                          </span>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    allData.map(
                      (v, i) => (

                        <tr
                          key={
                            v.id || i
                          }
                          className="
                            hover:bg-blue-50
                            transition
                            duration-200
                            border-b
                          "
                        >


                          {/* ============================== */}
                          {/* AKSI */}
                          {/* ============================== */}

                          <td className="px-4 py-3">

                            <button
                              type="button"
                              onClick={() =>
                                handleAntarFaktur(v)
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-full
                                bg-blue-900
                                text-white
                                text-xs
                                font-semibold
                                hover:bg-blue-800
                                hover:scale-[1.02]
                                transition
                                shadow-sm
                                whitespace-nowrap
                              "
                            >

                              <FaTruck />

                              Antar Faktur

                            </button>

                          </td>


                          {/* ============================== */}
                          {/* NO */}
                          {/* ============================== */}

                          <td
                            className="
                              px-4
                              py-3
                              font-semibold
                              text-gray-700
                            "
                          >

                            {
                              (currentPage - 1)
                              * perPage
                              + i
                              + 1
                            }

                          </td>


                          {/* ============================== */}
                          {/* NO FAKTUR */}
                          {/* ============================== */}

                          <td
                            className="
                              px-4
                              py-3
                              font-semibold
                              text-blue-900
                              whitespace-nowrap
                            "
                          >

                            {v.no_faktur || "-"}

                          </td>


                          {/* ============================== */}
                          {/* CUSTOMER */}
                          {/* ============================== */}

                          <td className="px-4 py-3">

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
                                  rounded-full
                                  bg-blue-50
                                  text-blue-900
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
                                  {v.nama_customer || "-"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* ============================== */}
                          {/* ALAMAT */}
                          {/* ============================== */}

                          <td className="px-4 py-3 min-w-[250px]">

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
                                {v.alamat || "-"}
                              </span>

                            </div>

                          </td>


                          {/* ============================== */}
                          {/* JATUH TEMPO */}
                          {/* ============================== */}

                          <td className="px-4 py-3">

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                whitespace-nowrap
                              "
                            >

                              <FaCalendarAlt
                                className="text-blue-700"
                              />

                              <span>
                                {formatDate(
                                  v.jatuh_tempo
                                )}
                              </span>

                            </div>

                          </td>


                          {/* ============================== */}
                          {/* STATUS */}
                          {/* ============================== */}

                          <td className="px-4 py-3">

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-1.5
                                rounded-full
                                bg-orange-100
                                text-orange-700
                                text-xs
                                font-semibold
                                whitespace-nowrap
                              "
                            >

                              <FaClock />

                              Belum Diantar

                            </span>

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

                <div className="text-sm text-gray-600">

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


                <div className="flex items-center gap-2">

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
                    onChange={changePerPage}
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

                    <option value="100">
                      100
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

                    pageCount={totalPage}

                    onPageChange={changePage}

                    forcePage={
                      currentPage - 1
                    }

                    className="
                      flex
                      items-center
                      gap-2
                    "

                    activeClassName="
                      !bg-blue-900
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

    </div>
  );
};

export default TableDaftarTugasHarian;