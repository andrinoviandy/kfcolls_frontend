import React, {
  useEffect,
  useState,
} from "react";

import {
  FaCalendarAlt,
  FaBuilding,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaFileAlt,
} from "react-icons/fa";

import ReactPaginate from "react-paginate";

import Select, {
  components as selectComponents,
} from "react-select";

import {
  swal,
} from "global/helper/swal";

import storeSchema from "global/store";


// =====================================================
// FILTER COMPONENTS
// =====================================================

const FilterOption = (props) => (
  <selectComponents.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      readOnly
      className="checkbox checkbox-primary checkbox-xs mr-2"
    />
    {props.label}
  </selectComponents.Option>
);

const FilterMultiValue = () => null;

const FilterValueContainer = ({
  children,
  ...props
}) => {
  const selectedCount = props.getValue().length;

  return (
    <selectComponents.ValueContainer {...props}>
      {selectedCount > 0
        ? `${selectedCount} dipilih`
        : children[0]}
      {children[1]}
    </selectComponents.ValueContainer>
  );
};

const filterSelectComponents = {
  Option: FilterOption,
  MultiValue: FilterMultiValue,
  ValueContainer: FilterValueContainer,
};


// =====================================================
// SELECT STYLES
// =====================================================

const filterSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    borderRadius: 9999,
    borderColor: state.isFocused
      ? "#2563eb"
      : "#d1d5db",
    boxShadow: "none",
    fontSize: "0.875rem",
    ":hover": {
      borderColor: "#2563eb",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: 36,
  }),

  menu: (base) => ({
    ...base,
    zIndex: 50,
  }),
};


// =====================================================
// HELPERS
// =====================================================

const getSelectedFilterOptions = (
  options,
  selectedValues
) => {
  return options.filter((option) =>
    selectedValues.some(
      (value) =>
        String(value) === String(option.value)
    )
  );
};

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


// =====================================================
// COMPONENT
// =====================================================

const TableDataDoar = ({
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

  const [tableData, setTableData] = useState([]);

  const [totalData, setTotalData] = useState(0);

  const [totalPage, setTotalPage] = useState(0);

  const [keyword, setKeyword] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");

  const [filterCabang, setFilterCabang] = useState([]);

  const [filterCustomer, setFilterCustomer] = useState([]);

  const [filterChannel, setFilterChannel] = useState([]);

  const [filterPrinciple, setFilterPrinciple] = useState([]);

  const [filterStartDate, setFilterStartDate] = useState("");

  const [filterEndDate, setFilterEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState({
    cabang: [],
    customer: [],
    channel: [],
    principle: [],
  });


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

      if (refCabang?.status === true) {
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

      if (refChannel?.status === true) {
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
        "ERROR GET REFERENSI DOAR:",
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

      if (res?.status === true) {
        const data = (
          res?.data?.list_data || []
        ).map((item) => ({
          label: item?.nama_principle,
          value: item?.principle,
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
  // GET DATA CUSTOMER BERDASARKAN CABANG
  // ===================================================

  useEffect(() => {
    let isMounted = true;

    const getDataCustomer = async () => {

      if (!filterCabang.length) {
        setOptions((prev) => ({
          ...prev,
          customer: [],
        }));

        setFilterCustomer([]);

        return;
      }

      try {
        const res =
          await storeSchema.actions.getDataPelanggan({
            page: 1,
            limit: 9999,
            cabang_id: filterCabang,
          });

        if (res?.status !== true) {
          throw new Error(
            res?.message ||
            "Gagal mengambil data customer"
          );
        }

        const responseData = res?.data;

        const listData = Array.isArray(responseData)
          ? responseData
          : responseData?.list_data ||
          responseData?.data ||
          responseData?.rows ||
          [];

        const customerOptions = listData
          .map((item) => {
            const kodeCustomer = item?.kode_customer;
            const namaCustomer = item?.name;

            return {
              label: `${kodeCustomer ?? ""}${namaCustomer
                  ? ` - ${namaCustomer}`
                  : ""
                }`,
              value: kodeCustomer,
            };
          })
          .filter(
            (item) =>
              item.value !== null &&
              item.value !== undefined &&
              String(item.value).trim() !== ""
          );

        if (isMounted) {
          setOptions((prev) => ({
            ...prev,
            customer: customerOptions,
          }));

          setFilterCustomer((prev) =>
            prev.filter((value) =>
              customerOptions.some(
                (option) =>
                  String(option.value) === String(value)
              )
            )
          );
        }

      } catch (error) {
        console.error(
          "ERROR GET DATA CUSTOMER DOAR:",
          error
        );

        if (isMounted) {
          setOptions((prev) => ({
            ...prev,
            customer: [],
          }));

          setFilterCustomer([]);

          await swal.error(
            error?.message ||
            "Gagal mengambil data customer"
          );
        }
      }
    };

    getDataCustomer();

    return () => {
      isMounted = false;
    };

  }, [filterCabang]);


  // ===================================================
  // GET DATA DOAR
  // ===================================================

  const getDataDoar = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        limit: perPage,

        keyword: searchKeyword,

        // Filter tetap sama seperti Data Piutang
        sales_office: filterCabang.length
          ? filterCabang
          : "ALL",

        customer: filterCustomer.length
          ? filterCustomer
          : "ALL",

        customer_group: filterChannel.length
          ? filterChannel
          : "ALL",

        principle: filterPrinciple.length
          ? filterPrinciple
          : "ALL",

        start_date: filterStartDate,

        end_date: filterEndDate,
      };

      // ===============================================
      // API DOAR
      // ===============================================

      const res =
        await storeSchema.actions.getDataDoar(
          payload
        );

      if (res?.status !== true) {
        throw new Error(
          res?.message ||
          "Gagal mengambil data DOAR"
        );
      }

      const responseData = res?.data || {};

      const listData =
        responseData?.list_data || [];

      // ===============================================
      // TABLE DATA
      // ===============================================

      setTableData(
        listData.map((item, index) => ({
          ...item,

          No:
            (currentPage - 1) *
            perPage +
            index +
            1,
        }))
      );

      // ===============================================
      // PAGINATION
      // ===============================================

      setTotalData(
        Number(
          responseData?.total_data || 0
        )
      );

      setTotalPage(
        Number(
          responseData?.total_halaman || 0
        )
      );

    } catch (error) {
      console.error(
        "ERROR GET DATA DOAR:",
        error
      );

      setTableData([]);

      setTotalData(0);

      setTotalPage(0);

      await swal.error(
        error?.message ||
        "Gagal mengambil data DOAR"
      );

    } finally {
      setLoading(false);
    }
  };


  // ===================================================
  // SERVER SIDE FILTER + PAGINATION
  // ===================================================

  useEffect(() => {
    getDataDoar();

  }, [
    currentPage,
    perPage,
    searchKeyword,
    filterCabang,
    filterCustomer,
    filterChannel,
    filterPrinciple,
    filterStartDate,
    filterEndDate,
  ]);


  // ===================================================
  // RELOAD
  // ===================================================

  useEffect(() => {
    if (!reloadData) {
      return;
    }

    if (currentPage === 1) {
      getDataDoar();
    } else {
      setCurrentPage(1);
    }

    if (setReloadData) {
      setReloadData(false);
    }

  }, [reloadData]);


  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };


  // ===================================================
  // RESET FILTER
  // ===================================================

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");

    setFilterCabang([]);
    setFilterCustomer([]);
    setFilterChannel([]);
    setFilterPrinciple([]);

    setFilterStartDate("");
    setFilterEndDate("");

    setCurrentPage(1);
  };


  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {
    setCurrentPage(1);

    if (setReloadData) {
      setReloadData((prev) => !prev);
    } else {
      getDataDoar();
    }
  };


  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex =
    totalData > 0
      ? (currentPage - 1) * perPage + 1
      : 0;

  const endIndex = Math.min(
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

      <div className="flex flex-col gap-4">

        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">

          {/* SEARCH INPUT */}

          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">

            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />

            <input
              type="text"
              placeholder="Cari Profit Center / Customer..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={keyword}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />

            <button
              type="button"
              onClick={handleSearch}
              title="Cari"
              aria-label="Cari"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90"
            >
              <FaSearch className="text-sm" />
            </button>

          </div>


          {/* ACTION */}

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

          {/* CABANG */}

          <div className="w-full min-w-[190px] sm:w-[220px]">

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Cabang
            </label>

            <Select
              isMulti
              options={options?.cabang || []}
              value={getSelectedFilterOptions(
                options?.cabang || [],
                filterCabang
              )}
              onChange={(selected) => {
                setCurrentPage(1);

                setFilterCabang(
                  (selected || []).map(
                    (item) => item.value
                  )
                );

                setFilterCustomer([]);
              }}
              placeholder="Semua Cabang"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />

          </div>


          {/* CHANNEL */}

          <div className="w-full min-w-[180px] sm:w-[210px]">

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Lini
            </label>

            <Select
              isMulti
              options={options?.channel || []}
              value={getSelectedFilterOptions(
                options?.channel || [],
                filterChannel
              )}
              onChange={(selected) => {
                setCurrentPage(1);

                setFilterChannel(
                  (selected || []).map(
                    (item) => item.value
                  )
                );
              }}
              placeholder="Semua Channel"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />

          </div>


          {/* PRINCIPLE */}

          <div className="w-full min-w-[180px] sm:w-[210px]">

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Principle
            </label>

            <Select
              isMulti
              options={options?.principle || []}
              value={getSelectedFilterOptions(
                options?.principle || [],
                filterPrinciple
              )}
              onChange={(selected) => {
                setCurrentPage(1);

                setFilterPrinciple(
                  (selected || []).map(
                    (item) => item.value
                  )
                );
              }}
              placeholder="Semua Principle"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />

          </div>


          {/* CUSTOMER */}

          <div className="w-full min-w-[180px] sm:w-[210px]">

            <label className="mb-1 block text-xs font-medium text-gray-600">
              Customer
            </label>

            <Select
              isMulti
              isDisabled={!filterCabang.length}
              options={options?.customer || []}
              value={getSelectedFilterOptions(
                options?.customer || [],
                filterCustomer
              )}
              onChange={(selected) => {
                setCurrentPage(1);

                setFilterCustomer(
                  (selected || []).map(
                    (item) => item.value
                  )
                );
              }}
              placeholder={
                !filterCabang.length
                  ? "Pilih cabang dahulu"
                  : "Semua Customer"
              }
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />

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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

          <div className="relative overflow-auto rounded-2xl max-h-[65vh]">

            {/* LOADING */}

            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">

                <div className="flex flex-col items-center gap-3">

                  <span className="loading loading-spinner loading-lg text-primary" />

                  <span className="text-sm text-gray-600">
                    Memuat data DOAR...
                  </span>

                </div>

              </div>
            )}


            {/* TABLE */}

            <table className="table w-full">
              <thead className="bg-primary text-white sticky top-0 text-[13px] z-10">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">
                    Profit Center
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Cabang
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Customer Code
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Nama Customer
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Kode Principle
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Nama Principle
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Lini
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap text-center">
                    DOAR
                  </th>
                </tr>
              </thead>

              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-16 text-gray-500"
                    >
                      <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-3" />

                      <p className="font-medium">
                        Tidak ada data DOAR
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Silakan ubah filter atau kata pencarian
                      </p>
                    </td>
                  </tr>
                ) : (
                  tableData.map((item, index) => (
                    <tr
                      key={
                        item?.id ||
                        `${item?.customer || item?.customer_code || "customer"}-${index}`
                      }
                      className="border-b hover:bg-blue-50 transition duration-200"
                    >
                      {/* PROFIT CENTER */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-gray-700 text-sm">
                          {displayValue(
                            item?.cabang ??
                            item?.profit_center ??
                            item?.sales_office
                          )}
                        </span>
                      </td>

                      {/* CABANG */}
                      <td className="px-4 py-3 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                            <FaBuilding className="text-xs" />
                          </div>

                          <span className="font-semibold text-gray-700 text-sm">
                            {displayValue(
                              item?.name_cabang ??
                              item?.nama_cabang ??
                              item?.cabang_name
                            )}
                          </span>
                        </div>
                      </td>

                      {/* CUSTOMER CODE */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-gray-700 text-sm">
                          {displayValue(
                            item?.customer ??
                            item?.customer_code ??
                            item?.kode_customer
                          )}
                        </span>
                      </td>

                      {/* NAMA CUSTOMER */}
                      <td className="px-4 py-3 min-w-[220px]">
                        <p
                          className="font-semibold text-gray-700 text-sm truncate max-w-[260px]"
                          title={String(
                            item?.customer_name ||
                            item?.nama_customer ||
                            "-"
                          )}
                        >
                          {displayValue(
                            item?.customer_name ??
                            item?.nama_customer ??
                            item?.name
                          )}
                        </p>
                      </td>

                      {/* KODE PRINCIPLE */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-gray-700 text-sm">
                          {displayValue(
                            item?.principle ??
                            item?.kode_principle
                          )}
                        </span>
                      </td>

                      {/* NAMA PRINCIPLE */}
                      <td className="px-4 py-3 min-w-[200px]">
                        <span className="font-semibold text-gray-700 text-sm">
                          {displayValue(
                            item?.name_principle ??
                            item?.nama_principle
                          )}
                        </span>
                      </td>

                      {/* LINI */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {displayValue(
                            item?.lini ??
                            item?.desc_cust_grp4 ??
                            item?.customer_group
                          )}
                        </span>
                      </td>

                      {/* DOAR */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                          {formatNumber(item?.doar)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>


          {/* ================================================= */}
          {/* PAGINATION */}
          {/* ================================================= */}

          <div className="border-t border-gray-200 px-5 py-4">

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

              {/* INFO */}

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


                {/* ROWS */}

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

                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>

                  </select>

                </div>

              </div>


              {/* PAGINATION */}

              {totalPage > 0 && (

                <ReactPaginate
                  breakLabel="..."
                  previousLabel="←"
                  nextLabel="→"

                  pageCount={totalPage}

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

    </div>
  );
};

export default TableDataDoar;