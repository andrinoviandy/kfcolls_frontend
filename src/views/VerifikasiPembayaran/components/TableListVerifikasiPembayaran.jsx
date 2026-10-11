import { swal } from "global/helper/swal";
import storeSchema from "global/store";
import React, {
  useEffect,
  useState,
} from "react";
import {
  FaMoneyBillWave,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaFileInvoiceDollar,
  FaBuilding,
  FaCalendarAlt,
  FaUser,
  FaEllipsisV,
  FaHashtag,
  FaInfoCircle,
  FaTimes,
  FaEye,
  FaFileAlt,
  FaUniversity,
  FaCreditCard,
  FaCashRegister,
  FaExclamationTriangle,
  FaCheck,
  FaSearch,
  FaFilter,
  FaSyncAlt,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import Select, {
  components as selectComponents,
} from "react-select";

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
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

const formatRupiah = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Rp0";
  }
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    return "Rp0";
  }
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }
  ).format(numberValue);
};

// =====================================================
// FIRST VALUE
// =====================================================

const firstValue = (
  item,
  ...keys
) => {
  for (const key of keys) {
    if (
      item?.[key] !== undefined &&
      item?.[key] !== null &&
      item?.[key] !== ""
    ) {
      return item[key];
    }
  }
  return null;
};

// =====================================================
// FILTER OPTION HELPER
// =====================================================

const getSelectedFilterOptions = (
  options,
  selectedValues
) => {
  return options.filter((option) =>
    selectedValues.includes(
      option.value
    )
  );
};

// =====================================================
// FILTER SELECT COMPONENT
// =====================================================

const FilterOption = (
  props
) => (
  <selectComponents.Option
    {...props}
  >
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
  const selectedCount =
    props.getValue().length;
  return (
    <selectComponents.ValueContainer
      {...props}
    >
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
  ValueContainer:
    FilterValueContainer,
};

const filterSelectStyles = {
  control: (
    base,
    state
  ) => ({
    ...base,
    minHeight: 36,
    borderRadius: 9999,
    borderColor:
      state.isFocused
        ? "#2563eb"
        : "#d1d5db",
    boxShadow: "none",
    fontSize: ".875rem",
    ":hover": {
      borderColor: "#2563eb",
    },
  }),
  valueContainer: (
    base
  ) => ({
    ...base,
    padding: "0 10px",
  }),
  indicatorsContainer: (
    base
  ) => ({
    ...base,
    height: 36,
  }),
  menu: (
    base
  ) => ({
    ...base,
    zIndex: 50,
  }),
};

// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {
  MENUNGGU_VERIFIKASI: {
    label:
      "Menunggu Verifikasi",
    icon: FaClock,
    className:
      "bg-amber-100 text-amber-700",
  },
  PEMBAYARAN_DITERIMA: {
    label:
      "Pembayaran Diterima",
    icon: FaCheckCircle,
    className:
      "bg-green-100 text-green-700",
  },
  PEMBAYARAN_DITOLAK: {
    label:
      "Pembayaran Ditolak",
    icon: FaTimes,
    className:
      "bg-red-100 text-red-700",
  },
};

// =====================================================
// PAYMENT METHOD
// =====================================================

const paymentMethodConfig = {
  DIRECT_TRANSFER: {
    label:
      "Direct Transfer",
    icon: FaUniversity,
    className:
      "text-blue-600",
  },
  GIRO: {
    label: "Giro",
    icon: FaCreditCard,
    className:
      "text-orange-500",
  },
  SSP: {
    label:
      "Surat Setor Pajak",
    icon:
      FaFileInvoiceDollar,
    className:
      "text-purple-500",
  },
  CASH: {
    label: "Cash",
    icon:
      FaCashRegister,
    className:
      "text-green-500",
  },
};

// =====================================================
// COMPONENT
// =====================================================

const TableVerifikasiPembayaran = ({
  dimensionScreenW,
  check,
  loginAccess,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [tableData, setTableData] =
    useState([]);

  const [summaryData, setSummaryData] =
    useState({
      total: 0,
      menunggu_verifikasi: 0,
      pembayaran_diterima: 0,
      pembayaran_ditolak: 0,
      total_nominal_menunggu: 0,
    });

  const [totalData, setTotalData] =
    useState(0);

  const [totalPage, setTotalPage] =
    useState(0);

  const [keyword, setKeyword] =
    useState("");

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [filterCabang, setFilterCabang] =
    useState([]);

  const [filterCustomer, setFilterCustomer] =
    useState([]);

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [filterStartDate, setFilterStartDate] =
    useState("");

  const [filterEndDate, setFilterEndDate] =
    useState("");

  const [customerOptions, setCustomerOptions] =
    useState([]);

  const [cabangOptions, setCabangOptions] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(10);

  const [loading, setLoading] =
    useState(false);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [selectedData, setSelectedData] =
    useState(null);

  const [
    showVerificationModal,
    setShowVerificationModal,
  ] = useState(false);

  const [
    verificationDescription,
    setVerificationDescription,
  ] = useState("");

  const [
    verificationAction,
    setVerificationAction,
  ] = useState(null);

  const [
    verificationBillingData,
    setVerificationBillingData,
  ] = useState([]);

  // ===================================================
  // FILTER OPTIONS
  // ===================================================

  const getReferensi = async () => {
    try {
      const refCabang =
        await storeSchema.actions.getReferensiByJenis(
          "cabang_id"
        );

      if (
        refCabang?.status === true
      ) {
        setCabangOptions(
          (refCabang?.data || []).map(
            (item) => ({
              label:
                item?.ur_ref,
              value:
                item?.kd_ref,
            })
          )
        );
      }
    } catch (error) {
      console.error(
        "ERROR GET REFERENSI CABANG:",
        error
      );
    }
  };

  const loadCustomerOptions =
    async () => {
      try {
        const res =
          await storeSchema.actions.getDataVerifikasiPembayaran(
            {
              page: 1,
              limit: 9999,
              keyword: "",
              sales_office: "ALL",
              customer: "ALL",
              status: "ALL",
              start_date: "",
              end_date: "",
            }
          );

        if (
          res?.status === true
        ) {
          const list =
            res?.data?.list_data ||
            [];

          const unique = [
            ...new Map(
              list.map((item) => {
                const value =
                  firstValue(
                    item,
                    "customer",
                    "kode_customer",
                    "customer_id",
                    "nama_customer"
                  );

                const label =
                  firstValue(
                    item,
                    "nama_customer",
                    "customer_name",
                    "customer",
                    "kode_customer"
                  );

                return [
                  String(
                    value ||
                    label ||
                    ""
                  ),
                  {
                    label:
                      label ||
                      "-",
                    value:
                      value ||
                      label ||
                      "",
                  },
                ];
              })
            ).values(),
          ].filter(
            (item) =>
              item.value
          );

          setCustomerOptions(
            unique
          );
        }
      } catch (error) {
        console.error(
          "ERROR GET CUSTOMER OPTIONS:",
          error
        );
      }
    };

  useEffect(() => {
    getReferensi();
    loadCustomerOptions();
  }, []);

  // ===================================================
  // GET DATA VERIFIKASI PEMBAYARAN
  // ===================================================

  const getDataVerifikasiPembayaran =
    async () => {
      try {
        setLoading(true);

        const payload = {
          page: currentPage,
          limit: perPage,
          keyword: searchKeyword,
          sales_office:
            filterCabang.length
              ? filterCabang
              : "ALL",
          customer:
            filterCustomer.length
              ? filterCustomer
              : "ALL",
          status:
            selectedStatus,
          start_date:
            filterStartDate,
          end_date:
            filterEndDate,
        };

        const res =
          await storeSchema.actions.getDataVerifikasiPembayaran(
            payload
          );

        if (
          res?.status !== true
        ) {
          throw new Error(
            res?.message ||
            "Gagal mengambil data Verifikasi Pembayaran"
          );
        }

        const responseData =
          res?.data || {};

        const list =
          responseData?.list_data ||
          [];

        setTableData(
          list.map(
            (item) => ({
              ...item,
              id:
                firstValue(
                  item,
                  "id",
                  "pembayaran_id",
                  "piutang_id",
                  "faktur_id"
                ),
              no_faktur:
                firstValue(
                  item,
                  "no_faktur",
                  "no_billing",
                  "nomor_faktur"
                ) || "-",
              customer_id:
                firstValue(
                  item,
                  "customer_id",
                  "kode_customer",
                  "customer"
                ) || "-",
              nama_customer:
                firstValue(
                  item,
                  "nama_customer",
                  "customer_name",
                  "customer"
                ) || "-",
              nama_penagih:
                firstValue(
                  item,
                  "nama_penagih",
                  "penagih",
                  "collector"
                ) || "-",
              alamat:
                firstValue(
                  item,
                  "alamat",
                  "alamat_customer",
                  "customer_address"
                ) || "-",
              nominal_tagihan:
                Number(
                  firstValue(
                    item,
                    "nominal_tagihan",
                    "nominal",
                    "dpp",
                    "nominal_bayar",
                    "saldo_piutang"
                  ) || 0
                ),
              tanggal_pembayaran:
                firstValue(
                  item,
                  "tanggal_pembayaran",
                  "tanggal",
                  "payment_date"
                ),
              metode_pembayaran:
                firstValue(
                  item,
                  "metode_pembayaran",
                  "metode"
                ),
              status:
                firstValue(
                  item,
                  "status",
                  "status_verifikasi"
                ) ||
                "MENUNGGU_VERIFIKASI",
              bukti_pembayaran:
                firstValue(
                  item,
                  "bukti_pembayaran",
                  "file_bukti",
                  "file_url"
                ),
              keterangan_pembayaran:
                firstValue(
                  item,
                  "keterangan_pembayaran",
                  "keterangan"
                ),
              tanggal_verifikasi:
                firstValue(
                  item,
                  "tanggal_verifikasi",
                  "verification_date"
                ),
              keterangan_verifikasi:
                firstValue(
                  item,
                  "keterangan_verifikasi",
                  "verification_description"
                ),
              sales:
                firstValue(
                  item,
                  "sales",
                  "nama_sales",
                  "sales_name"
                ) || "-",
              create_document_number:
                firstValue(
                  item,
                  "create_document_number",
                  "document_number"
                ) || "",
            })
          )
        );

        const totalDataResponse =
          Number(
            responseData?.total_data ||
            0
          );

        setTotalData(
          totalDataResponse
        );

        setTotalPage(
          Number(
            responseData?.total_halaman ||
            Math.ceil(
              totalDataResponse /
              perPage
            ) ||
            0
          )
        );

        const summary =
          responseData?.summary ||
          {};

        setSummaryData({
          total: Number(
            summary?.total_verifikasi ??
            summary?.total_pembayaran ??
            summary?.total ??
            totalDataResponse
          ),
          menunggu_verifikasi:
            Number(
              summary?.menunggu_verifikasi ??
              summary?.menunggu ??
              0
            ),
          pembayaran_diterima:
            Number(
              summary?.pembayaran_diterima ??
              summary?.diterima ??
              0
            ),
          pembayaran_ditolak:
            Number(
              summary?.pembayaran_ditolak ??
              summary?.ditolak ??
              0
            ),
          total_nominal_menunggu:
            Number(
              summary?.total_nominal_menunggu ??
              summary?.nominal_menunggu ??
              0
            ),
        });
      } catch (error) {
        console.error(
          "ERROR GET DATA VERIFIKASI PEMBAYARAN:",
          error
        );

        setTableData([]);
        setTotalData(0);
        setTotalPage(0);

        setSummaryData({
          total: 0,
          menunggu_verifikasi: 0,
          pembayaran_diterima: 0,
          pembayaran_ditolak: 0,
          total_nominal_menunggu: 0,
        });

        await swal.error(
          error?.message ||
          "Gagal mengambil data Verifikasi Pembayaran"
        );
      } finally {
        setLoading(false);
      }
    };

  // ===================================================
  // API DEPENDENCY
  // ===================================================

  useEffect(() => {
    getDataVerifikasiPembayaran();
  }, [
    currentPage,
    perPage,
    searchKeyword,
    filterCabang,
    filterCustomer,
    selectedStatus,
    filterStartDate,
    filterEndDate,
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
  // RESET FILTER
  // ===================================================

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setSelectedStatus("ALL");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {
    if (currentPage === 1) {
      getDataVerifikasiPembayaran();
    } else {
      setCurrentPage(1);
    }
  };

  // ===================================================
  // CURRENT PAGE SELECTABLE IDS
  // ===================================================

  const currentPageIds =
    tableData
      .filter(
        (item) =>
          item.status ===
          "MENUNGGU_VERIFIKASI"
      )
      .map(
        (item) =>
          item.id
      );

  const isAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every(
      (id) =>
        selectedIds.includes(id)
    );

  // ===================================================
  // SELECT ALL
  // ===================================================

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(
        (prev) =>
          prev.filter(
            (id) =>
              !currentPageIds.includes(
                id
              )
          )
      );
    } else {
      setSelectedIds(
        (prev) => [
          ...new Set([
            ...prev,
            ...currentPageIds,
          ]),
        ]
      );
    }
  };

  // ===================================================
  // SELECT ONE
  // ===================================================

  const handleSelectOne = (
    id
  ) => {
    setSelectedIds(
      (prev) => {
        if (
          prev.includes(id)
        ) {
          return prev.filter(
            (x) => x !== id
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
  // OPEN VERIFICATION
  // ===================================================

  const openVerification = (
    data = null
  ) => {
    let selected;

    if (data) {
      selected = data;
    } else {
      selected =
        tableData.filter(
          (item) =>
            selectedIds.includes(
              item.id
            )
        );
    }

    if (
      !selected ||
      (
        Array.isArray(selected) &&
        selected.length === 0
      )
    ) {
      return;
    }

    const selectedItems =
      Array.isArray(selected)
        ? selected
        : [selected];

    setSelectedData(
      selected
    );

    setVerificationBillingData(
      selectedItems.map(
        (item) => ({
          id: item.id,
          no_faktur:
            item.no_faktur,
          create_document_number:
            item.create_document_number ||
            "",
        })
      )
    );

    setVerificationDescription(
      ""
    );

    setVerificationAction(
      null
    );

    setShowVerificationModal(
      true
    );
  };

  // ===================================================
  // CLOSE VERIFICATION
  // ===================================================

  const closeVerification = () => {
    setShowVerificationModal(
      false
    );

    setSelectedData(
      null
    );

    setVerificationDescription(
      ""
    );

    setVerificationAction(
      null
    );

    setVerificationBillingData(
      []
    );
  };

  // ===================================================
  // DOCUMENT CHANGE
  // ===================================================

  const handleVerificationBillingChange =
    (
      id,
      field,
      value
    ) => {
      setVerificationBillingData(
        (prev) =>
          prev.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    [field]:
                      value,
                  }
                : item
          )
      );
    };

  // ===================================================
  // HANDLE VERIFICATION
  // ===================================================

  const handleVerification = async (
    action
  ) => {
    const dataToVerify =
      Array.isArray(
        selectedData
      )
        ? selectedData
        : [selectedData];

    const itemsToVerify =
      dataToVerify.filter(
        (item) =>
          item &&
          item.status ===
            "MENUNGGU_VERIFIKASI"
      );

    if (itemsToVerify.length === 0) {
      return;
    }

    const invalidBilling =
      itemsToVerify.find((item) => {
        const billingDocument =
          verificationBillingData.find(
            (doc) =>
              doc.id ===
              item.id
          );

        return !billingDocument?.create_document_number?.trim();
      });

    if (invalidBilling) {
      await swal.error(
        `Nomor Create Document wajib diisi untuk billing ${invalidBilling.no_faktur}.`
      );
      return;
    }

    const kdStatus =
      action === "TERIMA"
        ? "S"
        : "T";

    try {
      setVerificationAction(
        action
      );

      const resultList =
        await Promise.all(
          itemsToVerify.map(
            async (item) => {
              const billingDocument =
                verificationBillingData.find(
                  (doc) =>
                    doc.id ===
                    item.id
                );

              const payload = {
                pembayaran_id:
                  item?.pembayaran_id ||
                  item?.id ||
                  null,
                piutang_id:
                  item?.piutang_id ||
                  null,
                no_faktur:
                  item?.no_faktur ||
                  null,
                no_billing:
                  item?.no_billing ||
                  null,
                kd_status:
                  kdStatus,
                keterangan:
                  verificationDescription ||
                  "",
                create_document_number:
                  billingDocument
                    ?.create_document_number
                    ?.trim() ||
                  "",
                user_id:
                  loginAccess?.user_id ||
                  null,
                nip:
                  loginAccess?.nip ||
                  null,
              };

              const res =
                await storeSchema.actions.verifikasiBayarFaktur(
                  payload
                );

              if (
                res?.status !== true
              ) {
                throw new Error(
                  res?.message ||
                  `Gagal melakukan verifikasi pembayaran ${item?.no_faktur || item?.no_billing || ""}.`
                );
              }

              return res;
            }
          )
        );

      const successMessages =
        resultList
          .map(
            (res) =>
              res?.message
          )
          .filter(Boolean);

      await swal.success(
        successMessages[0] ||
        (
          action === "TERIMA"
            ? "Pembayaran berhasil diverifikasi."
            : "Pembayaran berhasil ditolak."
        )
      );

      setSelectedIds(
        (prev) =>
          prev.filter(
            (id) =>
              !itemsToVerify.some(
                (item) =>
                  item.id ===
                  id
              )
          )
      );

      closeVerification();

      await getDataVerifikasiPembayaran();
    } catch (error) {
      console.error(
        "ERROR VERIFIKASI BAYAR FAKTUR:",
        error
      );

      await swal.error(
        error?.message ||
        "Gagal melakukan verifikasi pembayaran."
      );
    } finally {
      setVerificationAction(
        null
      );
    }
  };

  // ===================================================
  // RENDER STATUS
  // ===================================================

  const renderStatus = (
    status
  ) => {
    const config =
      statusConfig[
        status
      ];

    if (!config) {
      return "-";
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
  // PAYMENT METHOD
  // ===================================================

  const renderPaymentMethod = (
    method
  ) => {
    const config =
      paymentMethodConfig[
        method
      ];

    if (!config) {
      return method || "-";
    }

    const Icon =
      config.icon;

    return (
      <div
        className="
          flex
          items-center
          gap-2
          text-sm
        "
      >
        <Icon
          className={
            config.className
          }
        />
        <span
          className="
            font-medium
            text-gray-700
          "
        >
          {config.label}
        </span>
      </div>
    );
  };

  // ===================================================
  // HEADER TABLE
  // ===================================================

  const headerTable = [
    {
      label: "Pilih",
      icon: null,
    },
    {
      label: "Aksi",
      icon:
        <FaEllipsisV />,
    },
    {
      label: "No",
      icon:
        <FaHashtag />,
    },
    {
      label: "No. Faktur",
      icon:
        <FaFileInvoiceDollar />,
    },
    {
      label: "Customer",
      icon:
        <FaBuilding />,
    },
    {
      label: "Penagih",
      icon:
        <FaUser />,
    },
    {
      label: "Nominal",
      icon:
        <FaMoneyBillWave />,
    },
    {
      label:
        "Tgl. Pembayaran",
      icon:
        <FaCalendarAlt />,
    },
    {
      label:
        "Metode Pembayaran",
      icon:
        <FaUniversity />,
    },
    {
      label: "Status",
      icon:
        <FaInfoCircle />,
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
  // SELECTED ITEMS
  // ===================================================

  const verificationItems =
    Array.isArray(
      selectedData
    )
      ? selectedData
      : selectedData
        ? [selectedData]
        : [];

  const totalVerification =
    verificationItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.nominal_tagihan ||
          0
        ),
      0
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
      {/* SEARCH & FILTER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          {/* SEARCH */}
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input
              type="text"
              placeholder="Cari no faktur / customer / penagih..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={
                keyword
              }
              onKeyDown={(
                e
              ) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  handleSearch();
                }
              }}
              onChange={(
                e
              ) =>
                setKeyword(
                  e.target.value
                )
              }
            />
            <button
              type="button"
              onClick={
                handleSearch
              }
              title="Cari"
              aria-label="Cari"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90"
            >
              <FaSearch className="text-sm" />
            </button>
          </div>

          {/* ACTION FILTER */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                resetFilter
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"
            >
              <FaFilter />
              Reset Filter
            </button>
            <button
              type="button"
              onClick={
                handleRefresh
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap items-center gap-3">
          {/* CABANG */}
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Cabang
            </label>
            <Select
              isMulti
              options={
                cabangOptions
              }
              value={getSelectedFilterOptions(
                cabangOptions,
                filterCabang
              )}
              onChange={(
                selected
              ) => {
                setCurrentPage(
                  1
                );
                setFilterCabang(
                  (
                    selected ||
                    []
                  ).map(
                    (item) =>
                      item.value
                  )
                );
              }}
              placeholder="Semua Cabang"
              closeMenuOnSelect={
                false
              }
              hideSelectedOptions={
                false
              }
              components={
                filterSelectComponents
              }
              styles={
                filterSelectStyles
              }
            />
          </div>

          {/* CUSTOMER */}
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Customer
            </label>
            <Select
              isMulti
              options={
                customerOptions
              }
              value={getSelectedFilterOptions(
                customerOptions,
                filterCustomer
              )}
              onChange={(
                selected
              ) => {
                setCurrentPage(
                  1
                );
                setFilterCustomer(
                  (
                    selected ||
                    []
                  ).map(
                    (item) =>
                      item.value
                  )
                );
              }}
              placeholder="Semua Customer"
              closeMenuOnSelect={
                false
              }
              hideSelectedOptions={
                false
              }
              components={
                filterSelectComponents
              }
              styles={
                filterSelectStyles
              }
            />
          </div>

          {/* STATUS */}
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Status
            </label>
            <Select
              options={[
                {
                  label:
                    "Semua Status",
                  value:
                    "ALL",
                },
                {
                  label:
                    "Menunggu Verifikasi",
                  value:
                    "MENUNGGU_VERIFIKASI",
                },
                {
                  label:
                    "Pembayaran Diterima",
                  value:
                    "PEMBAYARAN_DITERIMA",
                },
                {
                  label:
                    "Pembayaran Ditolak",
                  value:
                    "PEMBAYARAN_DITOLAK",
                },
              ]}
              value={[
                {
                  label:
                    "Semua Status",
                  value:
                    "ALL",
                },
                {
                  label:
                    "Menunggu Verifikasi",
                  value:
                    "MENUNGGU_VERIFIKASI",
                },
                {
                  label:
                    "Pembayaran Diterima",
                  value:
                    "PEMBAYARAN_DITERIMA",
                },
                {
                  label:
                    "Pembayaran Ditolak",
                  value:
                    "PEMBAYARAN_DITOLAK",
                },
              ].find(
                (item) =>
                  item.value ===
                  selectedStatus
              )}
              onChange={(
                selected
              ) => {
                setCurrentPage(
                  1
                );
                setSelectedStatus(
                  selected?.value ||
                  "ALL"
                );
              }}
              placeholder="Semua Status"
              styles={
                filterSelectStyles
              }
            />
          </div>

          {/* DOCUMENT DATE */}
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Document Date
            </label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm">
              <FaCalendarAlt className="text-primary text-sm" />
              <input
                type="date"
                value={
                  filterStartDate
                }
                max={
                  filterEndDate ||
                  undefined
                }
                onChange={(
                  e
                ) => {
                  setCurrentPage(
                    1
                  );
                  setFilterStartDate(
                    e.target.value
                  );
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
              <span className="text-gray-300">
                -
              </span>
              <input
                type="date"
                value={
                  filterEndDate
                }
                min={
                  filterStartDate ||
                  undefined
                }
                onChange={(
                  e
                ) => {
                  setCurrentPage(
                    1
                  );
                  setFilterEndDate(
                    e.target.value
                  );
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
            </div>
          </div>
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
          lg:grid-cols-4
          gap-4
        "
      >
        {/* TOTAL */}
        <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-blue-700">
                Total Pembayaran
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {
                  summaryData.total
                }
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaClipboardList className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* WAITING */}
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-amber-700">
                Menunggu Verifikasi
              </p>
              <p className="text-2xl font-bold text-amber-900">
                {
                  summaryData.menunggu_verifikasi
                }
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaClock className="text-amber-600" />
            </div>
          </div>
        </div>

        {/* ACCEPTED */}
        <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-green-700">
                Pembayaran Diterima
              </p>
              <p className="text-2xl font-bold text-green-900">
                {
                  summaryData.pembayaran_diterima
                }
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-green-600" />
            </div>
          </div>
        </div>

        {/* REJECTED */}
        <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-red-700">
                Pembayaran Ditolak
              </p>
              <p className="text-2xl font-bold text-red-900">
                {
                  summaryData.pembayaran_ditolak
                }
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
              <FaTimes className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* BULK ACTION */}
      {/* ================================================= */}

      {
        selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-blue-900">
              <FaCheckCircle />
              <span>
                <b>
                  {
                    selectedIds.length
                  }
                </b>{" "}
                pembayaran dipilih
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedIds([])
                }
                className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() =>
                  openVerification()
                }
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition shadow-md"
              >
                <FaCheckCircle />
                Verifikasi Pembayaran (
                {
                  selectedIds.length
                }
                )
              </button>
            </div>
          </div>
        )
      }

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-auto rounded-2xl max-h-[65vh]">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-primary text-white sticky top-0 text-[13px] z-10">
              <tr>
                {
                  headerTable.map(
                    (
                      header,
                      index
                    ) => (
                      <th
                        key={`${header.label}-${index}`}
                        className={`
                          px-4
                          py-3
                          whitespace-nowrap
                          ${
                            header.label ===
                              "No" ||
                            header.label ===
                              "Aksi" ||
                            header.label ===
                              "Pilih"
                              ? "text-center"
                              : "text-left"
                          }
                        `}
                      >
                        <div
                          className={`
                            flex
                            items-center
                            gap-2
                            ${
                              header.label ===
                                "No" ||
                              header.label ===
                                "Aksi" ||
                              header.label ===
                                "Pilih"
                                ? "justify-center"
                                : ""
                            }
                          `}
                        >
                          <span>
                            {
                              header.icon
                            }
                          </span>
                          <span>
                            {
                              header.label
                            }
                          </span>
                        </div>
                      </th>
                    )
                  )
                }

              </tr>
            </thead>

            <tbody>
                            {
                loading ? (
                  <tr>
                    <td
                      colSpan={
                        headerTable.length +
                        1
                      }
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                        <span className="text-sm text-gray-500">
                          Memuat data pembayaran...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : tableData.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={
                        headerTable.length +
                        1
                      }
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaFileInvoiceDollar className="text-gray-400 text-xl" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">
                            Data tidak ditemukan
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Belum ada data pembayaran yang sesuai dengan filter.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tableData.map(
                    (
                      item,
                      index
                    ) => {
                      const rowNumber =
                        (
                          currentPage -
                          1
                        ) *
                          perPage +
                        index +
                        1;

                      const isWaiting =
                        item.status ===
                        "MENUNGGU_VERIFIKASI";

                      const isSelected =
                        selectedIds.includes(
                          item.id
                        );

                      return (
                        <tr
                          key={
                            item.id ||
                            index
                          }
                          className="hover:bg-blue-50 transition duration-200 border-b"
                        >
                          {/* CHECKBOX - KOLOM PERTAMA */}
                          <td className="px-4 py-3 text-center">
                            {
                              isWaiting ? (
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm checkbox-primary"
                                  checked={
                                    isSelected
                                  }
                                  onChange={() =>
                                    handleSelectOne(
                                      item.id
                                    )
                                  }
                                />
                              ) : (
                                <span className="text-gray-300">
                                  -
                                </span>
                              )
                            }
                          </td>

                          {/* AKSI */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openVerification(
                                    item
                                  )
                                }
                                title="Lihat Detail"
                                className="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center hover:bg-blue-100 transition"
                              >
                                <FaEye />
                              </button>

                              {
                                isWaiting && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openVerification(
                                        item
                                      )
                                    }
                                    title="Verifikasi"
                                    className="px-3 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 transition shadow-sm"
                                  >
                                    Verifikasi
                                  </button>
                                )
                              }
                            </div>
                          </td>

                          {/* NO */}
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-semibold text-gray-600">
                              {
                                rowNumber
                              }
                            </span>
                          </td>

                          {/* NO FAKTUR */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                <FaFileInvoiceDollar className="text-primary text-sm" />
                              </div>
                              <div>
                                <p className="font-semibold text-primary text-sm whitespace-nowrap">
                                  {
                                    item.no_faktur ||
                                    "-"
                                  }
                                </p>
                                {
                                  item.create_document_number && (
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                      CD:{" "}
                                      {
                                        item.create_document_number
                                      }
                                    </p>
                                  )
                                }
                              </div>
                            </div>
                          </td>

                          {/* CUSTOMER */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                <FaBuilding className="text-indigo-500 text-sm" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 text-sm">
                                  {
                                    item.nama_customer ||
                                    "-"
                                  }
                                </p>
                                {
                                  item.customer_id && (
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                      {
                                        item.customer_id
                                      }
                                    </p>
                                  )
                                }
                              </div>
                            </div>
                          </td>

                          {/* PENAGIH */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <FaUser className="text-gray-500 text-xs" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {
                                  item.nama_penagih ||
                                  "-"
                                }
                              </span>
                            </div>
                          </td>

                          {/* NOMINAL */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                                <FaMoneyBillWave className="text-green-600 text-xs" />
                              </div>
                              <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                                {
                                  formatRupiah(
                                    item.nominal_tagihan
                                  )
                                }
                              </span>
                            </div>
                          </td>

                          {/* TANGGAL PEMBAYARAN */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-primary text-sm" />
                              <span className="text-sm text-gray-600 whitespace-nowrap">
                                {
                                  formatDate(
                                    item.tanggal_pembayaran
                                  )
                                }
                              </span>
                            </div>
                          </td>

                          {/* METODE PEMBAYARAN */}
                          <td className="px-4 py-3">
                            {
                              renderPaymentMethod(
                                item.metode_pembayaran
                              )
                            }
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3">
                            {
                              renderStatus(
                                item.status
                              )
                            }
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

        {/* FOOTER */}
        <div className="border-t border-gray-100 bg-slate-50 py-4 px-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* INFO */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-500">
              <span>
                Menampilkan{" "}
                <b className="text-gray-700">
                  {
                    startIndex
                  }
                </b>
                {" - "}
                <b className="text-gray-700">
                  {
                    endIndex
                  }
                </b>
                {" dari "}
                <b className="text-gray-700">
                  {
                    totalData
                  }
                </b>
                {" data"}
              </span>

              <div className="flex items-center gap-2">
                <span>
                  Tampilkan
                </span>

                <select
                  className="select select-sm border border-gray-300 rounded-full bg-white focus:border-primary focus:outline-none"
                  value={
                    perPage
                  }
                  onChange={(
                    e
                  ) => {
                    setCurrentPage(
                      1
                    );
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
                  onPageChange={(
                    e
                  ) =>
                    setCurrentPage(
                      e.selected +
                      1
                    )
                  }
                  forcePage={
                    currentPage -
                    1
                  }
                  className="flex items-center gap-2"
                  activeClassName="!bg-primary !text-white !border-primary"
                  pageClassName="min-w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center bg-white hover:bg-blue-50"
                  pageLinkClassName="w-full h-full flex items-center justify-center px-3"
                  previousClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white"
                  nextClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white"
                  previousLinkClassName="w-full h-full flex items-center justify-center"
                  nextLinkClassName="w-full h-full flex items-center justify-center"
                  breakClassName="px-2 text-gray-500"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              )
            }
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* VERIFICATION MODAL */}
      {/* ================================================= */}
            {
        showVerificationModal && (
          <div
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={
              closeVerification
            }
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              {/* HEADER */}
              <div className="bg-primary px-6 py-4 text-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        Verifikasi Pembayaran
                      </h3>
                      <p className="text-xs text-blue-100">
                        {
                          verificationItems.length
                        }{" "}
                        pembayaran dipilih
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      closeVerification
                    }
                    className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="p-5 flex flex-col gap-5">
                {/* TOTAL */}
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <p className="text-sm text-blue-700">
                        Total Pembayaran
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {
                          formatRupiah(
                            totalVerification
                          )
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <FaClipboardList />
                      {
                        verificationItems.length
                      }{" "}
                      faktur
                    </div>
                  </div>
                </div>

                {/* DETAIL */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaFileInvoiceDollar className="text-primary" />
                    <h3 className="font-bold text-gray-700">
                      Detail Pembayaran
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {
                      verificationItems.map(
                        (
                          item
                        ) => (
                          <div
                            key={
                              item.id
                            }
                            className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                          >
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                              {/* LEFT */}
                              <div className="flex gap-3">
                                <div className="w-11 h-11 rounded-xl bg-white border flex items-center justify-center">
                                  <FaFileInvoiceDollar className="text-primary" />
                                </div>

                                <div>
                                  <p className="text-xs text-gray-400">
                                    No. Faktur
                                  </p>

                                  <p className="font-bold text-primary">
                                    {
                                      item.no_faktur
                                    }
                                  </p>

                                  <p className="text-sm text-gray-600 mt-1">
                                    {
                                      item.nama_customer
                                    }
                                  </p>
                                </div>
                              </div>

                              {/* RIGHT */}
                              <div className="text-left lg:text-right">
                                <p className="text-xs text-gray-400">
                                  Nominal Pembayaran
                                </p>

                                <p className="text-lg font-bold text-primary">
                                  {
                                    formatRupiah(
                                      item.nominal_tagihan
                                    )
                                  }
                                </p>
                              </div>
                            </div>

                            {/* DETAIL GRID */}
                            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* TANGGAL */}
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  Tanggal Pembayaran
                                </p>

                                <p className="text-sm font-semibold text-gray-700">
                                  {
                                    formatDate(
                                      item.tanggal_pembayaran
                                    )
                                  }
                                </p>
                              </div>

                              {/* METODE */}
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  Metode Pembayaran
                                </p>

                                {
                                  renderPaymentMethod(
                                    item.metode_pembayaran
                                  )
                                }
                              </div>

                              {/* BUKTI */}
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  Bukti Pembayaran
                                </p>

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                                  onClick={() =>
                                    alert(
                                      `Buka bukti: ${item.bukti_pembayaran || "-"}`
                                    )
                                  }
                                >
                                  <FaFileAlt />
                                  Lihat Bukti
                                </button>
                              </div>

                              {/* SALES */}
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  Sales
                                </p>

                                <p className="text-sm font-semibold text-gray-700">
                                  {
                                    item.sales ||
                                    "-"
                                  }
                                </p>
                              </div>
                            </div>

                            {/* CREATE DOCUMENT */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <label className="block text-xs font-semibold text-gray-600 mb-2">
                                Nomor Create Document
                                {
                                  item.status ===
                                    "MENUNGGU_VERIFIKASI" && (
                                    <span className="text-red-500 ml-1">
                                      *
                                    </span>
                                  )
                                }
                              </label>

                              {
                                item.status ===
                                "MENUNGGU_VERIFIKASI"
                                  ? (
                                    <input
                                      type="text"
                                      className="input input-bordered input-sm w-full bg-white rounded-xl border-gray-200 focus:border-primary focus:outline-none"
                                      placeholder="Masukkan Nomor Create Document"
                                      value={
                                        verificationBillingData.find(
                                          (
                                            data
                                          ) =>
                                            data.id ===
                                            item.id
                                        )?.create_document_number ||
                                        ""
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        handleVerificationBillingChange(
                                          item.id,
                                          "create_document_number",
                                          e.target.value
                                        )
                                      }
                                    />
                                  )
                                  : (
                                    <div className="min-h-[36px] flex items-center px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700">
                                      {
                                        item.create_document_number ||
                                        "-"
                                      }
                                    </div>
                                  )
                              }
                            </div>

                            {/* KETERANGAN PEMBAYARAN */}
                            {
                              item.keterangan_pembayaran && (
                                <div className="mt-4 bg-white rounded-xl p-3 border border-gray-100">
                                  <p className="text-xs text-gray-400 mb-1">
                                    Keterangan Pembayaran
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    {
                                      item.keterangan_pembayaran
                                    }
                                  </p>
                                </div>
                              )
                            }

                            {/* KETERANGAN VERIFIKASI */}
                            {
                              item.keterangan_verifikasi && (
                                <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                                  <p className="text-xs text-blue-500 mb-1">
                                    Keterangan Verifikasi
                                  </p>

                                  <p className="text-sm text-blue-800">
                                    {
                                      item.keterangan_verifikasi
                                    }
                                  </p>
                                </div>
                              )
                            }
                          </div>
                        )
                      )
                    }
                  </div>
                </div>

                {/* KETERANGAN */}
                {
                  verificationItems.some(
                    (item) =>
                      item.status ===
                      "MENUNGGU_VERIFIKASI"
                  ) && (
                    <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Keterangan Verifikasi
                        <span className="text-gray-400 font-normal">
                          {" "}
                          (opsional)
                        </span>
                      </label>

                      <textarea
                        className="textarea textarea-bordered w-full bg-white rounded-xl min-h-[110px]"
                        placeholder="Contoh: Bukti pembayaran sesuai dengan nominal faktur."
                        value={
                          verificationDescription
                        }
                        onChange={(
                          e
                        ) =>
                          setVerificationDescription(
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )
                }

                {/* WARNING */}
                {
                  verificationItems.some(
                    (item) =>
                      item.status !==
                      "MENUNGGU_VERIFIKASI"
                  ) && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <FaExclamationTriangle className="text-amber-500 mt-0.5" />

                      <div>
                        <p className="text-sm font-semibold text-amber-800">
                          Pembayaran telah diverifikasi
                        </p>

                        <p className="text-xs text-amber-700 mt-1">
                          Data pembayaran yang sudah
                          diterima atau ditolak hanya
                          dapat dilihat detailnya.
                        </p>
                      </div>
                    </div>
                  )
                }
              </div>

              {/* FOOTER */}
              <div className="border-t bg-gray-50 px-5 py-4 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={
                    closeVerification
                  }
                  className="px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100"
                >
                  Tutup
                </button>

                {
                  verificationItems.some(
                    (item) =>
                      item.status ===
                      "MENUNGGU_VERIFIKASI"
                  ) && (
                    <>
                      {/* TOLAK */}
                      <button
                        type="button"
                        onClick={() =>
                          handleVerification(
                            "TOLAK"
                          )
                        }
                        className="px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 shadow-md inline-flex items-center justify-center gap-2"
                      >
                        <FaTimes />
                        Tolak Pembayaran
                      </button>

                      {/* TERIMA */}
                      <button
                        type="button"
                        onClick={() =>
                          handleVerification(
                            "TERIMA"
                          )
                        }
                        className="px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-md inline-flex items-center justify-center gap-2"
                      >
                        <FaCheck />
                        Terima Pembayaran
                      </button>
                    </>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default TableVerifikasiPembayaran;