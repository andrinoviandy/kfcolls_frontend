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
  FaCalendarAlt,
  FaUser,
  FaEllipsisV,
  FaHashtag,
  FaInfoCircle,
  FaUniversity,
  FaCashRegister,
  FaFileUpload,
  FaCamera,
  FaTimes,
  FaCreditCard,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import { swal } from "global/helper/swal";
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

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }
  ).format(Number(value) || 0);

};


// =====================================================
// PARSE NOMINAL
// =====================================================

const parseNominal = (value) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  return Number(
    String(value)
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/\D/g, "")
  ) || 0;

};


// =====================================================
// FORMAT INPUT NOMINAL
// =====================================================

const formatInputNominal = (value) => {

  const nominal =
    parseNominal(value);

  if (!nominal) {
    return "";
  }

  return new Intl.NumberFormat(
    "id-ID"
  ).format(nominal);

};


// =====================================================
// DATA HELPER
// =====================================================

const firstValue = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") return item[key];
  }
  return null;
};

const normalizeStatus = (item, saldoPiutang = 0, dpp = 0) => {
  if (saldoPiutang <= 0) return "SUDAH_DIBAYAR";
  if (saldoPiutang >= 0 && saldoPiutang < dpp) return "SUDAH_DIBAYAR";
  return "BELUM_DIBAYAR";
};

const normalizeBayarFakturRow = (item, index, page = 1, limit = 10) => {
  const dpp = Number(item?.dpp || 0);
  const collections = Number(item?.collections ?? item?.total_dibayar ?? 0);
  const saldoPiutang = Number(item?.saldo_piutang ?? (dpp - collections));
  const status = normalizeStatus(item, saldoPiutang, dpp);
  const statusLunas = saldoPiutang <= 0 ? "SUDAH_LUNAS" : "BELUM_LUNAS";
  const statusLunasLabel = saldoPiutang <= 0 ? "Sudah Lunas" : "Belum Lunas";

  return {
    ...item,
    id: item?.piutang_id ?? `${page}-${index}`,
    piutang_id: item?.piutang_id ?? null,
    no_faktur: item?.no_faktur || "-",
    no_billing: item?.no_billing || "-",
    customer: item?.customer || "",
    customer_id: item?.customer || "",
    nama_customer: item?.nama_customer || "-",
    petugas: item?.petugas || "-",
    nama_penagih: item?.petugas || "-",
    cabang: item?.cabang || "",
    nama_cabang: item?.nama_cabang || "-",
    principle: item?.principle || "",
    nama_principle: item?.nama_principle || "-",
    collections,
    total_dibayar: collections,
    saldo_piutang: saldoPiutang,
    sisa_tagihan: saldoPiutang,
    posting_date: item?.posting_date || null,
    due_date: item?.jatuh_tempo || null,
    jatuh_tempo: item?.jatuh_tempo || null,
    sales: item?.sales || "-",
    status,
    status_label: status === "BELUM_DIBAYAR" ? "Belum Dibayar" : "Sudah Dibayar",
    status_lunas: statusLunas,
    status_lunas_label: statusLunasLabel,
  };
};

const getHistoryPembayaran = (item) => {
  const history = item?.h_pembayaran ?? item?.history_pembayaran ?? [];
  const result = [];

  const addHistory = (rows, source) => {
    if (!Array.isArray(rows)) return;
    rows.forEach((row, index) => {
      if (!row) return;
      const tanggal = firstValue(row, "tanggal_pembayaran", "tanggal_bayar", "tanggal", "payment_date", "created_at", "tgl_bayar");
      const nominal = firstValue(row, "nominal_bayar", "nominal_pembayaran", "nominal", "amount", "nominal_billing");
      const metode = source === "COD"
        ? "COD"
        : firstValue(row, "metode_pembayaran", "payment_method", "metode", "method") || "-";
      const statusVerifikasi = firstValue(row, "status_verifikasi", "verification_status", "status_verifikasi_pembayaran", "status") || "-";
      const tanggalVerifikasi = firstValue(row, "tanggal_verifikasi", "verification_date", "verified_at");

      result.push({
        id: row?.id ?? row?.pembayaran_id ?? `${source}-${index}`,
        tanggal,
        nominal: Number(nominal || 0),
        metode,
        status_verifikasi: statusVerifikasi,
        tanggal_verifikasi: tanggalVerifikasi,
        source,
      });
    });
  };

  if (Array.isArray(history)) {
    history.forEach((row, index) => {
      if (!row) return;

      const source = String(
        firstValue(row, "source", "asal", "jenis", "sumber", "table", "from") || ""
      ).toUpperCase();

      if (source === "COD" || source === "D_COD") {
        addHistory([row], "COD");
      } else {
        addHistory([row], "D_PEMBAYARAN");
      }
    });
  } else if (history && typeof history === "object") {
    addHistory(history?.d_cod, "COD");
    addHistory(history?.d_pembayaran, "D_PEMBAYARAN");
    addHistory(history?.cod, "COD");
    addHistory(history?.pembayaran, "D_PEMBAYARAN");

    if (result.length === 0 && Array.isArray(history?.data)) {
      history.data.forEach((row, index) => {
        const source = String(
          firstValue(row, "source", "asal", "jenis", "sumber", "table", "from") || ""
        ).toUpperCase();
        addHistory([row], source === "COD" || source === "D_COD" ? "COD" : "D_PEMBAYARAN");
      });
    }
  }

  return result;
};

const getDisplayInvoiceAmounts = (item) => {
  const dpp = Number(item?.dpp || 0);
  const ppn = Number(item?.ppn || 0);
  const pph = Number(item?.pph || 0);
  const totalInvoice = dpp + ppn;

  return {
    dpp,
    ppn,
    pph,
    totalInvoice,
  };
};

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

const FilterValueContainer = ({ children, ...props }) => {
  const selectedCount = props.getValue().length;

  return (
    <selectComponents.ValueContainer {...props}>
      {selectedCount > 0 ? `${selectedCount} dipilih` : children[0]}
      {children[1]}
    </selectComponents.ValueContainer>
  );
};

const filterSelectComponents = {
  Option: FilterOption,
  MultiValue: FilterMultiValue,
  ValueContainer: FilterValueContainer,
};

const filterSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    borderRadius: 9999,
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
    boxShadow: "none",
    fontSize: ".875rem",
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

const getSelectedFilterOptions = (options, selectedValues) =>
  options.filter((option) => selectedValues.includes(option.value));


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

  PARTIAL: {
    label: "Partial Payment",
    icon: FaCreditCard,
    className:
      "bg-orange-100 text-orange-700",
  },

  MENUNGGU_PEMBAYARAN: {
    label: "Menunggu Pembayaran",
    icon: FaMoneyBillWave,
    className:
      "bg-blue-100 text-blue-700",
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

  const [allData, setAllData] = useState([]);
  const [summaryData, setSummaryData] = useState({ total: 0, belum_dibayar: 0, partial: 0, menunggu_pembayaran: 0, sudah_dibayar: 0, total_nominal: 0, total_collections: 0, total_saldo_piutang: 0 });
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCabang, setFilterCabang] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedStatusVerifikasi, setSelectedStatusVerifikasi] = useState("ALL");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [selectedData, setSelectedData] =
    useState(null);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [expandedRows, setExpandedRows] =
    useState({});

  const [paymentMethod, setPaymentMethod] =
    useState("DIRECT_TRANSFER");

  const [dueDateGiro, setDueDateGiro] =
    useState("");

  // Tanggal khusus metode Menunggu Pembayaran
  const [plannedPaymentDate, setPlannedPaymentDate] =
    useState("");

  const [paymentFile, setPaymentFile] =
    useState(null);

  const [description, setDescription] =
    useState("");

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  // State khusus alokasi Partial Payment di Modal Bayar Faktur
  const [paymentAllocationMode, setPaymentAllocationMode] =
    useState("MANUAL");

  const [paymentAllocation, setPaymentAllocation] =
    useState({});

  const [paymentPartialAmount, setPaymentPartialAmount] =
    useState("");

  const [showPaymentAllocation, setShowPaymentAllocation] =
    useState(false);



  // ===================================================
  // PARTIAL PAYMENT STATE
  // ===================================================

  const [
    showPartialPaymentModal,
    setShowPartialPaymentModal
  ] = useState(false);

  const [
    partialPaymentAmount,
    setPartialPaymentAmount
  ] = useState("");

  const [
    partialPaymentMethod,
    setPartialPaymentMethod
  ] = useState("MANUAL");

  const [
    partialSelectedIds,
    setPartialSelectedIds
  ] = useState([]);

  const [
    partialAllocation,
    setPartialAllocation
  ] = useState([]);

  const [
    selectedCustomerId,
    setSelectedCustomerId
  ] = useState("");

  const [
    partialInvoiceData,
    setPartialInvoiceData
  ] = useState([]);


  // ===================================================
  // CUSTOMER OPTIONS FOR PARTIAL PAYMENT
  // ===================================================

  const partialCustomerOptions = customerOptions;


  // ===================================================
  // API DATA + FILTER
  // ===================================================

  const getReferensi = async () => {
    try {
      const refCabang = await storeSchema.actions.getReferensiByJenis("cabang_id");
      if (refCabang?.status === true) {
        setCabangOptions((refCabang?.data || []).map((item) => ({ label: item?.ur_ref, value: item?.kd_ref })));
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI CABANG:", error);
    }
  };

  const loadCustomerOptions = async () => {
    try {
      const res = await storeSchema.actions.getDataBayarFaktur({
        page: 1,
        limit: 9999,
        keyword: "",
        sales_office: "ALL",
        customer: "ALL",
        status: "ALL",
        start_date: "",
        end_date: "",
      });
      if (res?.status === true) {
        const list = (res?.data?.list_data || []).map((item, index) => normalizeBayarFakturRow(item, index, 1, 9999));
        const map = new Map();

        list.forEach((item) => {
          const value = item?.customer || "";
          const label = item?.nama_customer || value;
          if (!value) return;

          if (!map.has(String(value))) {
            map.set(String(value), {
              label: label || "-",
              value,
              customer_id: value,
              nama_customer: label || "-",
              jumlah_faktur: 0,
              total_saldo_piutang: 0,
            });
          }

          const customer = map.get(String(value));
          customer.jumlah_faktur += 1;
          customer.total_saldo_piutang += Number(item?.saldo_piutang ?? item?.sisa_tagihan ?? 0);
        });

        setCustomerOptions(Array.from(map.values()));
      }
    } catch (error) {
      console.error("ERROR GET CUSTOMER OPTIONS:", error);
    }
  };

  const getDataBayarFaktur = async () => {
    try {
      setLoading(true);
      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        sales_office: filterCabang.length ? filterCabang : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        status: selectedStatus,
        status_verifikasi: selectedStatusVerifikasi,
        start_date: filterStartDate,
        end_date: filterEndDate,
      };
      const res = await storeSchema.actions.getDataBayarFaktur(payload);
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data Bayar Faktur");
      const responseData = res?.data || {};
      const list = responseData?.list_data || [];
      const normalized = list.map((item, index) => normalizeBayarFakturRow(item, index, currentPage, perPage));
      setAllData(normalized);
      setSelectedIds([]);
      setExpandedRows({});
      const totalDataResponse = Number(responseData?.total_data || 0);
      setTotalData(totalDataResponse);
      setTotalPage(Number(responseData?.total_halaman || Math.ceil(totalDataResponse / perPage) || 0));
      const summary = responseData?.summary || {};
      setSummaryData({
        total: Number(summary?.total_faktur ?? summary?.total ?? totalDataResponse),
        belum_dibayar: Number(summary?.belum_dibayar ?? summary?.belum ?? 0),
        partial: Number(summary?.partial ?? summary?.partial_payment ?? 0),
        menunggu_pembayaran: Number(summary?.menunggu_pembayaran ?? summary?.menunggu ?? 0),
        sudah_dibayar: Number(summary?.sudah_dibayar ?? summary?.sudah ?? 0),
        total_nominal: Number(summary?.total_dpp ?? 0),
        total_collections: Number(summary?.total_collections ?? 0),
        total_saldo_piutang: Number(summary?.total_saldo_piutang ?? 0),
      });
    } catch (error) {
      console.error("ERROR GET DATA BAYAR FAKTUR:", error);
      setAllData([]);
      setTotalData(0);
      setTotalPage(0);
      setSummaryData({ total: 0, belum_dibayar: 0, partial: 0, menunggu_pembayaran: 0, sudah_dibayar: 0, total_nominal: 0, total_collections: 0, total_saldo_piutang: 0 });
      await swal.error(error?.message || "Gagal mengambil data Bayar Faktur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReferensi();
    loadCustomerOptions();
  }, []);

  useEffect(() => {
    getDataBayarFaktur();
  }, [currentPage, perPage, searchKeyword, filterCabang, filterCustomer, selectedStatus, selectedStatusVerifikasi, filterStartDate, filterEndDate]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };

  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setSelectedStatus("ALL");
    setSelectedStatusVerifikasi("ALL");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    if (currentPage === 1) getDataBayarFaktur();
    else setCurrentPage(1);
  };

  // ===================================================
  // PAGINATION
  // ===================================================

  const filteredData = allData;
  const paginatedData = allData;
  const totalDataLocal = totalData;
  const totalPageLocal = totalPage;

  // ===================================================
  // SELECT CHECKBOX
  // ===================================================

  const isSelectableInvoice = (item) => {
    const saldoPiutang = Number(item?.saldo_piutang ?? 0);
    return saldoPiutang > 0;
  };

  const handleSelectOne = (
    id
  ) => {

    const item = paginatedData.find(
      row => row.id === id
    );

    if (!item || !isSelectableInvoice(item)) {
      return;
    }

    setSelectedIds(
      prev => {

        if (
          prev.includes(id)
        ) {

          return prev.filter(
            x =>
              x !== id
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

  const currentPageSelectableIds =
    paginatedData
      .filter(isSelectableInvoice)
      .map(
        item =>
          item.id
      );


  const isAllSelected =
    currentPageSelectableIds.length >
    0 &&
    currentPageSelectableIds.every(
      id =>
        selectedIds.includes(id)
    );


  const handleSelectAll = () => {

    if (
      isAllSelected
    ) {

      setSelectedIds(
        prev =>
          prev.filter(
            id =>
              !currentPageSelectableIds.includes(
                id
              )
          )
      );

    } else {

      setSelectedIds(
        prev => [

          ...new Set([
            ...prev,
            ...currentPageSelectableIds,
          ]),

        ]
      );

    }

  };


  // ===================================================
  // EXPAND HISTORY PEMBAYARAN
  // ===================================================

  const toggleHistoryPembayaran = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
      "DIRECT_TRANSFER"
    );

    setPaymentAllocationMode("MANUAL");
    setPaymentAllocation({});

    setDueDateGiro(
      ""
    );

    setPlannedPaymentDate(
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

    setPaymentPartialAmount("");
    setPaymentAllocation({});
    setShowPaymentAllocation(false);
    setPaymentAllocationMode("MANUAL");

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

    setPaymentPartialAmount("");
    setPaymentAllocation({});
    setShowPaymentAllocation(false);
    setPaymentAllocationMode("MANUAL");

  };


  // ===================================================
  // PROCESS FULL PAYMENT
  // ===================================================

  const handlePayment = async () => {
  if (!paymentFile) {
    alert("File bukti pembayaran wajib diupload.");
    return;
  }

  if (paymentMethod === "PARTIAL_PAYMENT") {
    if (!canUsePartialPayment) {
      alert(
        "Partial Payment hanya dapat digunakan untuk faktur dari 1 customer yang sama."
      );
      return;
    }

    const paymentAmount =
      parseNominal(paymentPartialAmount);

    if (paymentAmount <= 0) {
      alert(
        "Masukkan nominal pembayaran terlebih dahulu."
      );
      return;
    }

    if (!showPaymentAllocation) {
      alert(
        "Klik Tampilkan Alokasi Pembayaran terlebih dahulu."
      );
      return;
    }

    if (allocatedPaymentTotal <= 0) {
      alert(
        "Minimal 1 faktur harus memiliki alokasi pembayaran."
      );
      return;
    }

    if (allocatedPaymentTotal > paymentAmount) {
      alert(
        "Total alokasi tidak boleh melebihi nominal pembayaran."
      );
      return;
    }

    if (allocatedPaymentTotal > totalSelectedPayment) {
      alert(
        "Total alokasi tidak boleh melebihi total sisa tagihan."
      );
      return;
    }

    const selectedInvoices =
      selectedPaymentInvoices.filter(
        invoice =>
          Number(
            paymentAllocation?.[
              invoice?.no_faktur
            ] || 0
          ) > 0
      );

    if (selectedInvoices.length === 0) {
      alert(
        "Minimal 1 faktur harus memiliki alokasi pembayaran."
      );
      return;
    }

    try {
      const formData =
        new FormData();

      const payload = {
        jenis_pembayaran:
          "PARTIAL_PAYMENT",

        metode_pembayaran:
          paymentMethod,

        nominal_bayar:
          paymentAmount,

        keterangan:
          description || "",

        user_id:
          loginAccess?.user_id || null,

        nip:
          loginAccess?.nip || null,

        faktur:
          selectedInvoices.map(
            invoice => ({
              piutang_id:
                invoice?.piutang_id ||
                invoice?.id ||
                null,

              no_faktur:
                invoice?.no_faktur ||
                null,

              no_billing:
                invoice?.no_billing ||
                null,

              customer:
                invoice?.customer_id ||
                invoice?.customer ||
                null,

              total_bayar:
                Number(
                  invoice?.saldo_piutang ??
                  invoice?.sisa_tagihan ??
                  invoice?.nominal_tagihan ??
                  0
                ),

              saldo_piutang:
                Number(
                  invoice?.saldo_piutang ??
                  invoice?.sisa_tagihan ??
                  0
                ),

              nominal_pembayaran:
                Number(
                  paymentAllocation?.[
                    invoice?.no_faktur
                  ] || 0
                ),
            })
          ),
      };

      formData.append(
        "payload",
        JSON.stringify(payload)
      );

      formData.append(
        "lampiran",
        paymentFile,
        paymentFile.name
      );

      const res =
        await storeSchema.actions.insertBayarFaktur(
          formData
        );

      if (res?.status !== true) {
        throw new Error(
          res?.message ||
          "Gagal menyimpan pembayaran."
        );
      }

      alert(
        res?.message ||
        "Pembayaran berhasil disimpan."
      );

      closePayment();

      setSelectedIds([]);

      await getDataBayarFaktur();

    } catch (error) {

      console.error(
        "ERROR INSERT BAYAR FAKTUR:",
        error
      );

      alert(
        error?.message ||
        "Gagal menyimpan pembayaran."
      );
    }

    return;
  }

  const dataToPay =
    Array.isArray(selectedData)
      ? selectedData
      : [selectedData];

  if (
    !dataToPay.length ||
    !dataToPay.some(Boolean)
  ) {
    alert(
      "Tidak ada faktur yang dipilih."
    );
    return;
  }

  try {

    const formData =
      new FormData();

    const payload = {
      jenis_pembayaran:
        "FULL_PAYMENT",

      metode_pembayaran:
        paymentMethod,

      nominal_bayar:
        totalPayment,

      keterangan:
        description || "",

      user_id:
        loginAccess?.user_id || null,

      nip:
        loginAccess?.nip || null,

      faktur:
        dataToPay
          .filter(Boolean)
          .map(
            item => ({
              piutang_id:
                item?.piutang_id ||
                item?.id ||
                null,

              no_faktur:
                item?.no_faktur ||
                null,

              no_billing:
                item?.no_billing ||
                null,

              customer:
                item?.customer_id ||
                item?.customer ||
                null,

              total_bayar:
                Number(
                  item?.saldo_piutang ??
                  item?.sisa_tagihan ??
                  item?.nominal_tagihan ??
                  0
                ),

              saldo_piutang:
                Number(
                  item?.saldo_piutang ??
                  item?.sisa_tagihan ??
                  0
                ),
            })
          ),
    };

    formData.append(
      "payload",
      JSON.stringify(payload)
    );

    formData.append(
      "lampiran",
      paymentFile,
      paymentFile.name
    );

    const res =
      await storeSchema.actions.insertBayarFaktur(
        formData
      );

    if (res?.status !== true) {
      throw new Error(
        res?.message ||
        "Gagal menyimpan pembayaran."
      );
    }

    alert(
      res?.message ||
      "Pembayaran berhasil disimpan."
    );

    closePayment();

    setSelectedIds([]);

    await getDataBayarFaktur();

  } catch (error) {

    console.error(
      "ERROR INSERT BAYAR FAKTUR:",
      error
    );

    alert(
      error?.message ||
      "Gagal menyimpan pembayaran."
    );
  }
};

  // ===================================================
  // OPEN PARTIAL PAYMENT
  // =====================================================

  const openPartialPayment = async (
    data = null
  ) => {
    const customerId = data?.customer_id ? data.customer_id : "";
    setPartialPaymentAmount("");
    setPartialPaymentMethod("MANUAL");
    setPartialSelectedIds([]);
    setPartialAllocation([]);
    setSelectedCustomerId(customerId);
    setPartialInvoiceData([]);
    setShowPartialPaymentModal(true);
    if (customerId) {
      await loadPartialInvoices(customerId);
    }
  };

  const loadPartialInvoices = async (customerId) => {
    if (!customerId) {
      setPartialInvoiceData([]);
      return;
    }
    try {
      const res = await storeSchema.actions.getDataBayarFaktur({
        page: 1,
        limit: 9999,
        keyword: "",
        sales_office: "ALL",
        customer: [customerId],
        status: "ALL",
        start_date: "",
        end_date: "",
      });
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil faktur customer");
      const list = res?.data?.list_data || [];
      setPartialInvoiceData(list.map((item, index) => normalizeBayarFakturRow(item, index, 1, 9999)));
    } catch (error) {
      console.error("ERROR GET FAKTUR CUSTOMER:", error);
      setPartialInvoiceData([]);
      await swal.error(error?.message || "Gagal mengambil faktur customer");
    }
  };


  // ===================================================
  // CLOSE PARTIAL PAYMENT
  // =====================================================

  const closePartialPayment = () => {

    setShowPartialPaymentModal(
      false
    );

    setPartialPaymentAmount("");

    setPartialPaymentMethod(
      "MANUAL"
    );

    setPartialSelectedIds([]);

    setPartialAllocation([]);

    setSelectedCustomerId("");
    setPartialInvoiceData([]);

  };


  // ===================================================
  // SELECT PARTIAL INVOICE
  // =====================================================

  const handlePartialSelectOne = (
    id
  ) => {

    setPartialSelectedIds(
      prev => {

        if (
          prev.includes(id)
        ) {

          return prev.filter(
            x =>
              x !== id
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
  // GET UNPAID INVOICES
  // ===================================================

  const getPayableInvoices = () => {

    if (
      !selectedCustomerId
    ) {

      return [];

    }

    return partialInvoiceData.filter(
      item =>

        String(
          item.customer_id
        ) ===
        String(
          selectedCustomerId
        )

        &&

        Number(
          item.saldo_piutang ??
          (Number(item?.dpp || 0) - Number(item?.collections || item?.total_dibayar || 0))
        ) > 0
    );

  };


  // ===================================================
  // SYSTEM ALLOCATION
  // ===================================================

  const generateSystemAllocation = () => {

    const paymentAmount =
      parseNominal(
        partialPaymentAmount
      );


    if (
      paymentAmount <= 0
    ) {

      setPartialAllocation([]);

      return;

    }


    let remaining =
      paymentAmount;


    /*
     * Sistem hanya mengambil faktur
     * yang masih memiliki sisa tagihan.
     *
     * Urutan:
     * nominal terkecil -> terbesar
     */

    const payableInvoices =
      getPayableInvoices()
        .sort(
          (
            a,
            b
          ) =>
            Number(
              a.sisa_tagihan ??
              a.nominal_tagihan ??
              0
            )
            -
            Number(
              b.sisa_tagihan ??
              b.nominal_tagihan ??
              0
            )
        );


    const allocation = [];


    for (
      const invoice
      of payableInvoices
    ) {

      if (
        remaining <= 0
      ) {

        break;

      }


      const invoiceRemaining =
        Number(
          invoice.saldo_piutang ??
          Math.max(0, Number(invoice?.dpp || 0) - Number(invoice?.collections || invoice?.total_dibayar || 0)) ??
          0
        );


      if (
        invoiceRemaining <= 0
      ) {

        continue;

      }


      const payment =
        Math.min(
          remaining,
          invoiceRemaining
        );


      allocation.push({

        ...invoice,

        nominal_pembayaran:
          payment,

        sisa_tagihan_setelah_bayar:
          invoiceRemaining -
          payment,

        status_pembayaran:
          payment >=
            invoiceRemaining
            ? "LUNAS"
            : "PARTIAL",

      });


      remaining -= payment;

    }


    setPartialAllocation(
      allocation
    );

  };


  // ===================================================
  // MANUAL ALLOCATION
  // ===================================================

  const generateManualAllocation = () => {

    const paymentAmount =
      parseNominal(
        partialPaymentAmount
      );


    if (
      paymentAmount <= 0
    ) {

      setPartialAllocation([]);

      return;

    }


    const selectedInvoices =
      partialInvoiceData
        .filter(
          item =>
            partialSelectedIds.includes(
              item.id
            )
            &&
            (
              item.status ===
              "BELUM_DIBAYAR"

              ||

              item.status ===
              "PARTIAL"
            )
        );


    let remaining =
      paymentAmount;


    const allocation = [];


    for (
      const invoice
      of selectedInvoices
    ) {

      if (
        remaining <= 0
      ) {

        break;

      }


      const invoiceRemaining =
        Number(
          invoice.saldo_piutang ??
          Math.max(0, Number(invoice?.dpp || 0) - Number(invoice?.collections || invoice?.total_dibayar || 0)) ??
          0
        );


      if (
        invoiceRemaining <= 0
      ) {

        continue;

      }


      const payment =
        Math.min(
          remaining,
          invoiceRemaining
        );


      allocation.push({

        ...invoice,

        nominal_pembayaran:
          payment,

        sisa_tagihan_setelah_bayar:
          invoiceRemaining -
          payment,

        status_pembayaran:
          payment >=
            invoiceRemaining
            ? "LUNAS"
            : "PARTIAL",

      });


      remaining -= payment;

    }


    setPartialAllocation(
      allocation
    );

  };


  // ===================================================
  // GENERATE PARTIAL ALLOCATION
  // ===================================================

  const generatePartialAllocation = () => {

    if (
      !selectedCustomerId
    ) {

      alert(
        "Pilih customer terlebih dahulu."
      );

      return;

    }

    const paymentAmount =
      parseNominal(
        partialPaymentAmount
      );


    if (
      paymentAmount <= 0
    ) {

      alert(
        "Masukkan nominal pembayaran terlebih dahulu."
      );

      return;

    }


    if (
      partialPaymentMethod ===
      "MANUAL"
    ) {

      if (
        partialSelectedIds.length ===
        0
      ) {

        alert(
          "Pilih minimal 1 faktur."
        );

        return;

      }


      generateManualAllocation();

    } else {

      generateSystemAllocation();

    }

  };


  // ===================================================
  // HANDLE PARTIAL PAYMENT
  // ===================================================

  const handlePartialPayment = () => {

    if (
      !selectedCustomerId
    ) {

      alert(
        "Pilih customer terlebih dahulu."
      );

      return;

    }

    if (
      partialAllocation.length ===
      0
    ) {

      return;

    }


    setAllData(
      prev => {

        return prev.map(
          item => {

            const allocation =
              partialAllocation.find(
                x =>
                  x.id ===
                  item.id
              );


            if (
              !allocation
            ) {

              return item;

            }


            const invoiceAmount =
              Number(
                item.nominal_tagihan ||
                0
              );


            const currentPaid =
              Number(
                item.total_dibayar ||
                0
              );


            const currentRemaining =
              Number(
                item.sisa_tagihan ??
                invoiceAmount
              );


            const payment =
              Number(
                allocation.nominal_pembayaran ||
                0
              );


            const totalPaid =
              currentPaid +
              payment;


            const remaining =
              Math.max(
                0,
                currentRemaining -
                payment
              );


            return {

              ...item,

              /*
               * Nilai asli faktur
               * tidak berubah.
               */
              nominal_tagihan:
                invoiceAmount,

              /*
               * Akumulasi pembayaran.
               */
              total_dibayar:
                totalPaid,

              /*
               * Sisa piutang.
               */
              sisa_tagihan:
                remaining,

              status:
                remaining <= 0
                  ? "SUDAH_DIBAYAR"
                  : "PARTIAL",

              tanggal_pembayaran:
                new Date()
                  .toISOString(),

              metode_pembayaran:
                "PARTIAL_PAYMENT",

            };

          }
        );

      }
    );


    setSelectedIds(
      prev =>
        prev.filter(
          id =>
            !partialAllocation.some(
              x =>
                x.id === id
            )
        )
    );


    closePartialPayment();

  };


  // ===================================================
  // RENDER STATUS
  // ===================================================


  // ============================================================
  // PARTIAL PAYMENT DI MODAL BAYAR SEKARANG
  // Hanya tersedia jika minimal 2 faktur dipilih dan semua faktur
  // tersebut dimiliki oleh 1 customer yang sama.
  // ============================================================

  const paymentSelection = useMemo(() => {
    if (Array.isArray(selectedData)) return selectedData;
    return selectedData ? [selectedData] : [];
  }, [selectedData]);

  const selectedPaymentCustomer = useMemo(() => {
    const customers = [
      ...new Set(
        paymentSelection
          .map((item) => item?.customer_id)
          .filter(Boolean)
      ),
    ];

    return customers.length === 1 ? customers[0] : null;
  }, [paymentSelection]);

  const selectedPaymentCustomerName = useMemo(() => {
    const item = paymentSelection.find(
      (v) =>
        String(v?.customer_id) ===
        String(selectedPaymentCustomer)
    );

    return item?.nama_customer || "-";
  }, [paymentSelection, selectedPaymentCustomer]);

  // Partial Payment dapat digunakan untuk 1 faktur maupun
  // beberapa faktur, selama faktur yang dipilih berasal
  // dari customer yang sama.
  const canUsePartialPayment =
    paymentSelection.length > 0 &&
    !!selectedPaymentCustomer;

  const selectedPaymentInvoices = useMemo(() => {
    return paymentSelection.filter(
      (item) =>
        String(item?.customer_id) ===
        String(selectedPaymentCustomer) &&
        Number(
          item?.saldo_piutang ??
          Math.max(0, Number(item?.dpp || 0) - Number(item?.collections || item?.total_dibayar || 0)) ??
          0
        ) > 0
    );
  }, [paymentSelection, selectedPaymentCustomer]);

  const totalSelectedPayment = useMemo(() => {
    return selectedPaymentInvoices.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.saldo_piutang ??
          Math.max(0, Number(item?.dpp || 0) - Number(item?.collections || item?.total_dibayar || 0)) ??
          0
        ),
      0
    );
  }, [selectedPaymentInvoices]);

  const allocatedPaymentTotal = useMemo(() => {
    return Object.values(paymentAllocation || {}).reduce(
      (sum, value) =>
        sum + Number(value || 0),
      0
    );
  }, [paymentAllocation]);

  const resetPaymentMethodState = () => {
    setPaymentMethod("DIRECT_TRANSFER");
    setDueDateGiro("");
    setPlannedPaymentDate("");
    setPaymentAllocationMode("MANUAL");
    setPaymentAllocation({});
    setPaymentPartialAmount("");
    setShowPaymentAllocation(false);
  };

  const handleSelectPaymentMethod = (method) => {
    if (
      method === "PARTIAL_PAYMENT" &&
      !canUsePartialPayment
    ) {
      return;
    }

    setPaymentMethod(method);

    if (method !== "PARTIAL_PAYMENT") {
      setPaymentAllocationMode("MANUAL");
      setPaymentAllocation({});
      setPaymentPartialAmount("");
      setShowPaymentAllocation(false);
    }
  };

  const handleAutoAllocatePayment = () => {
    const paymentAmount = Math.min(
      parseNominal(paymentPartialAmount),
      totalSelectedPayment
    );

    let remaining = paymentAmount;
    const allocation = {};

    selectedPaymentInvoices.forEach((invoice) => {
      const noFaktur = invoice?.no_faktur;
      const sisa = Number(
        invoice?.sisa_tagihan ??
        invoice?.nominal_tagihan ??
        0
      );

      const allocated =
        remaining > 0
          ? Math.min(remaining, sisa)
          : 0;

      allocation[noFaktur] = allocated;
      remaining -= allocated;
    });

    setPaymentAllocation(allocation);
  };

  const handleShowPaymentAllocation = () => {
    const paymentAmount =
      parseNominal(paymentPartialAmount);

    if (paymentAmount <= 0) {
      alert(
        "Masukkan nominal pembayaran terlebih dahulu."
      );
      return;
    }

    setShowPaymentAllocation(true);

    if (paymentAllocationMode === "SYSTEM") {
      handleAutoAllocatePayment();
    }
  };

  const handleManualAllocationChange = (
    noFaktur,
    value
  ) => {
    const invoice =
      selectedPaymentInvoices.find(
        (item) =>
          item?.no_faktur === noFaktur
      );

    const maxValue = Number(
      invoice?.sisa_tagihan ??
      invoice?.nominal_tagihan ??
      0
    );

    setPaymentAllocation((prev) => ({
      ...prev,
      [noFaktur]: Math.min(
        Math.max(0, Number(value || 0)),
        maxValue
      ),
    }));
  };

  useEffect(() => {
    if (
      paymentMethod === "PARTIAL_PAYMENT" &&
      !canUsePartialPayment
    ) {
      setPaymentMethod("DIRECT_TRANSFER");
      setPaymentAllocation({});
      setPaymentPartialAmount("");
      setShowPaymentAllocation(false);
      setPaymentAllocationMode("MANUAL");
    }
  }, [
    paymentMethod,
    canUsePartialPayment,
  ]);

  const renderStatus = (
    item
  ) => {

    const config =
      statusConfig[
      item?.status
      ];

    if (!config) {
      return "-";
    }

    const Icon = config.icon;
    const isLunas = item?.status_lunas === "SUDAH_LUNAS";

    return (
      <div className="flex flex-col items-start gap-1.5">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}>
          <Icon />
          {config.label}
        </span>

        {item?.status === "SUDAH_DIBAYAR" && (
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${isLunas ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            <FaCheckCircle />
            {isLunas ? "Sudah Lunas" : "Belum Lunas"}
          </span>
        )}
      </div>
    );
  };


  // ===================================================
  // HEADER TABLE
  // ===================================================

  const headerTable = [
    {
      label: "History",
      icon: <FaClipboardList />,
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
      label: "Penagih",
      icon: <FaUser />,
    },
    {
      label: "DPP",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "PPN",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "PPh",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Total Invoice",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Collections",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Saldo Piutang",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Document Date",
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
        ? [
          selectedData,
        ]
        : [];


  const totalPayment =
    paymentItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.saldo_piutang ??
          Math.max(0, Number(item?.dpp || 0) - Number(item?.collections || item?.total_dibayar || 0)) ??
          0
        ),
      0
    );


  // ===================================================
  // PARTIAL SUMMARY
  // ===================================================

  const partialTotalDana =
    parseNominal(
      partialPaymentAmount
    );


  const partialTotalAllocated =
    partialAllocation.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.nominal_pembayaran ||
          0
        ),
      0
    );


  const partialRemainingDana =
    Math.max(
      0,
      partialTotalDana -
      partialTotalAllocated
    );


  // ===================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex flex-col gap-5">
      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input type="text" placeholder="Cari no faktur / billing / customer / penagih..." className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0" value={keyword} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} onChange={(e) => setKeyword(e.target.value)} />
            <button type="button" onClick={handleSearch} title="Cari" aria-label="Cari" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90">
              <FaSearch className="text-sm" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={resetFilter} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50">
              <FaFilter /> Reset Filter
            </button>
            <button type="button" onClick={handleRefresh} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50">
              <FaSyncAlt /> Refresh
            </button>
            <button type="button" onClick={openPartialPayment} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm whitespace-nowrap">
              <FaCreditCard /> Partial Payment
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Cabang</label>
            <Select isMulti options={cabangOptions} value={getSelectedFilterOptions(cabangOptions, filterCabang)} onChange={(selected) => { setCurrentPage(1); setFilterCabang((selected || []).map((item) => item.value)); }} placeholder="Semua Cabang" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Customer</label>
            <Select isMulti options={customerOptions} value={getSelectedFilterOptions(customerOptions, filterCustomer)} onChange={(selected) => { setCurrentPage(1); setFilterCustomer((selected || []).map((item) => item.value)); }} placeholder="Semua Customer" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Status Pembayaran</label>
            <Select options={[{ label: "Semua Status", value: "ALL" }, { label: "Belum Dibayar", value: "BELUM_DIBAYAR" }, { label: "Partial Payment", value: "PARTIAL" }, { label: "Menunggu Pembayaran", value: "MENUNGGU_PEMBAYARAN" }, { label: "Sudah Dibayar", value: "SUDAH_DIBAYAR" }]} value={[{ label: "Semua Status", value: "ALL" }, { label: "Belum Dibayar", value: "BELUM_DIBAYAR" }, { label: "Partial Payment", value: "PARTIAL" }, { label: "Menunggu Pembayaran", value: "MENUNGGU_PEMBAYARAN" }, { label: "Sudah Dibayar", value: "SUDAH_DIBAYAR" }].find((item) => item.value === selectedStatus)} onChange={(selected) => { setCurrentPage(1); setSelectedStatus(selected?.value || "ALL"); }} placeholder="Semua Status" styles={filterSelectStyles} />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">Status Verifikasi</label>
            <Select options={[{ label: "Semua Status Verifikasi", value: "ALL" }, { label: "Belum Diverifikasi", value: "BELUM_DIVERIFIKASI" }, { label: "Terverifikasi", value: "VERIFIED" }]} value={[{ label: "Semua Status Verifikasi", value: "ALL" }, { label: "Belum Diverifikasi", value: "BELUM_DIVERIFIKASI" }, { label: "Terverifikasi", value: "VERIFIED" }].find((item) => item.value === selectedStatusVerifikasi)} onChange={(selected) => { setCurrentPage(1); setSelectedStatusVerifikasi(selected?.value || "ALL"); }} placeholder="Semua Status Verifikasi" styles={filterSelectStyles} />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">Document Date</label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm">
              <FaCalendarAlt className="text-primary text-sm" />
              <input type="date" value={filterStartDate} max={filterEndDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterStartDate(e.target.value); }} className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]" />
              <span className="text-gray-300">-</span>
              <input type="date" value={filterEndDate} min={filterStartDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterEndDate(e.target.value); }} className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]" />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Faktur</p>
              <p className="text-2xl font-bold text-blue-900">{summaryData.total}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center"><FaClipboardList className="text-blue-600" /></div>
          </div>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-amber-700">Belum Dibayar</p>
              <p className="text-2xl font-bold text-amber-900">{summaryData.belum_dibayar}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center"><FaClock className="text-amber-600" /></div>
          </div>
        </div>
        <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-orange-700">Partial Payment</p>
              <p className="text-2xl font-bold text-orange-900">{summaryData.partial}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center"><FaCreditCard className="text-orange-600" /></div>
          </div>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
          <div className="flex justify-between">
            <div className="min-w-0">
              <p className="text-sm text-green-700">Total Saldo Piutang</p>
              <p className="text-xl font-bold text-green-900 truncate">{formatRupiah(summaryData.total_saldo_piutang ?? 0)}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center"><FaMoneyBillWave className="text-green-600" /></div>
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
                {
                  selectedIds.length
                }
              </b>

              {" "}faktur dipilih

            </span>

          </div>


          <div
            className="
              flex
              gap-2
            "
          >

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
              {
                selectedIds.length
              }
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

                  {/* AKSI PALING PERTAMA */}

                  <th
                    className="
                      px-4
                      py-3
                      whitespace-nowrap
                      text-center
                    "
                  >
                    <div className="flex items-center justify-center gap-2 font-semibold">
                      <FaEllipsisV />
                      Aksi
                    </div>
                  </th>

                  {/* CHECKBOX */}

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
                      checked={isAllSelected}
                      disabled={currentPageSelectableIds.length === 0}
                      onChange={handleSelectAll}
                    />

                  </th>

                  {
                    headerTable.map(
                      (
                        h,
                        i
                      ) => (

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
                    )
                  }

                </tr>

              </thead>


              {/* BODY */}

              <tbody>

                {
                  paginatedData.length === 0 ? (

                    <tr>

                      <td
                        colSpan={headerTable.length + 2}
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
                      (
                        v,
                        i
                      ) => {

                        const invoiceAmounts =
                          getDisplayInvoiceAmounts(v);
                        const historyPembayaran =
                          getHistoryPembayaran(v);
                        const isHistoryExpanded =
                          !!expandedRows[v.id];

                        return (
                          <React.Fragment key={v.id}>
                            <tr
                              className="
                              hover:bg-blue-50
                              transition
                              duration-200
                              border-b
                            "
                            >

                              {/* AKSI - PALING PERTAMA */}

                              <td
                                className="
                                px-4
                                py-3
                                whitespace-nowrap
                                text-center
                              "
                              >

                                {
                                  Number(v?.saldo_piutang ?? 0) > 0 ? (

                                    <div className="flex items-center justify-center gap-2">

                                      <button
                                        type="button"
                                        onClick={() => openPayment(v)}
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

                                        Bayar

                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => openPartialPayment(v)}
                                        className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-full
                                        bg-orange-50
                                        text-orange-600
                                        hover:bg-orange-100
                                        transition
                                      "
                                        title="Partial Payment"
                                      >

                                        <FaCreditCard />

                                      </button>

                                    </div>

                                  ) : (

                                    <span className="text-xs text-gray-400">
                                      Sudah dibayar
                                    </span>

                                  )
                                }

                              </td>


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
                                  checked={selectedIds.includes(v.id)}
                                  disabled={!isSelectableInvoice(v)}
                                  onChange={() => handleSelectOne(v.id)}
                                />

                              </td>

                              {/* HISTORY PEMBAYARAN */}

                              <td
                                className="
                                px-4
                                py-3
                                whitespace-nowrap
                                text-center
                              "
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleHistoryPembayaran(v.id)}
                                  className="
                                  inline-flex
                                  items-center
                                  justify-center
                                  w-9
                                  h-9
                                  rounded-full
                                  bg-blue-50
                                  text-primary
                                  hover:bg-blue-100
                                  transition
                                "
                                  title={
                                    isHistoryExpanded
                                      ? "Tutup History Pembayaran"
                                      : "Lihat History Pembayaran"
                                  }
                                >
                                  {isHistoryExpanded ? (
                                    <FaChevronUp />
                                  ) : (
                                    <FaChevronDown />
                                  )}
                                </button>
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

                                {(currentPage - 1) * perPage + i + 1}

                              </td>


                              {/* FAKTUR */}

                              <td
                                className="
                                px-4
                                py-3
                                whitespace-nowrap
                              "
                              >

                                <div className="flex items-center gap-2">

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

                                    <FaFileInvoiceDollar className="text-primary" />

                                  </div>

                                  <span className="font-semibold text-primary">
                                    {v.no_faktur}
                                  </span>

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

                                    <p className="font-semibold text-gray-700">
                                      {v.nama_customer}
                                    </p>

                                    <p className="text-xs text-gray-400">
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

                                <div className="flex items-center gap-2">

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

                                    <FaUser className="text-orange-500" />

                                  </div>

                                  <span className="text-sm font-medium text-gray-700">
                                    {v.nama_penagih}
                                  </span>

                                </div>

                              </td>


                              {/* DPP */}

                              <td className="px-4 py-3 whitespace-nowrap text-right">

                                <span className="font-semibold text-gray-700">
                                  {formatRupiah(invoiceAmounts.dpp)}
                                </span>

                              </td>


                              {/* PPN */}

                              <td className="px-4 py-3 whitespace-nowrap text-right">

                                <span className="font-semibold text-gray-700">
                                  {formatRupiah(invoiceAmounts.ppn)}
                                </span>

                              </td>


                              {/* PPH */}

                              <td className="px-4 py-3 whitespace-nowrap text-right">

                                <span className="font-semibold text-gray-700">
                                  {formatRupiah(invoiceAmounts.pph)}
                                </span>

                              </td>


                              {/* TOTAL INVOICE */}

                              <td className="px-4 py-3 whitespace-nowrap text-right">

                                <span className="font-bold text-gray-700">
                                  {formatRupiah(invoiceAmounts.totalInvoice)}
                                </span>

                              </td>


                              {/* COLLECTIONS */}

                              <td className="px-4 py-3 whitespace-nowrap text-right">

                                <span className="font-semibold text-green-600">
                                  {formatRupiah(v.collections || 0)}
                                </span>

                              </td>


                              {/* SALDO PIUTANG */}

                              <td className="px-4 py-3 whitespace-nowrap text-right">

                                <span className="font-bold text-orange-600">
                                  {formatRupiah(v.saldo_piutang ?? 0)}
                                </span>

                              </td>


                              {/* DOCUMENT DATE */}

                              <td className="px-4 py-3 whitespace-nowrap">

                                <div
                                  className="
                                  flex
                                  items-center
                                  gap-2
                                  text-sm
                                  text-gray-600
                                "
                                >

                                  <FaCalendarAlt className="text-primary" />

                                  {formatDate(v.posting_date)}

                                </div>

                              </td>


                              {/* DUE DATE */}

                              <td className="px-4 py-3 whitespace-nowrap">

                                <div
                                  className="
                                  flex
                                  items-center
                                  gap-2
                                  text-sm
                                  text-gray-600
                                "
                                >

                                  <FaCalendarAlt className="text-orange-500" />

                                  {formatDate(v.due_date)}

                                </div>

                              </td>


                              {/* STATUS */}

                              <td className="px-4 py-3">

                                {renderStatus(v)}

                              </td>

                            </tr>

                            {isHistoryExpanded && (
                              <tr className="bg-slate-50 border-b border-blue-100">
                                <td
                                  colSpan={headerTable.length + 2}
                                  className="px-5 py-4"
                                >
                                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border-b border-blue-100">
                                      <FaClipboardList className="text-primary" />
                                      <span className="text-sm font-semibold text-blue-900">
                                        History Pembayaran
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        ({historyPembayaran.length} transaksi)
                                      </span>
                                    </div>

                                    {historyPembayaran.length === 0 ? (
                                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                                        Belum ada history pembayaran.
                                      </div>
                                    ) : (
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead className="bg-gray-50">
                                            <tr>
                                              <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                                                Tanggal
                                              </th>
                                              <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">
                                                Nominal
                                              </th>
                                              <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                                                Metode
                                              </th>
                                              <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                                                Status Verifikasi
                                              </th>
                                              <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                                                Tanggal Verifikasi
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {historyPembayaran.map((history, historyIndex) => {
                                              const verification = String(history?.status_verifikasi || "").toUpperCase();
                                              const isVerified =
                                                verification === "VERIFIED" ||
                                                verification === "SUDAH_DIVERIFIKASI" ||
                                                verification === "TERVERIFIKASI" ||
                                                verification === "APPROVED" ||
                                                verification === "SUDAH_VERIFIKASI";

                                              return (
                                                <tr
                                                  key={history?.id ?? `${v.id}-history-${historyIndex}`}
                                                  className="border-t border-gray-100 hover:bg-blue-50/50"
                                                >
                                                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                                    {formatDate(history?.tanggal)}
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-green-600">
                                                    {formatRupiah(history?.nominal || 0)}
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                                      {history?.metode || "-"}
                                                    </span>
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isVerified
                                                          ? "bg-green-100 text-green-700"
                                                          : "bg-amber-100 text-amber-700"
                                                        }`}
                                                    >
                                                      <FaCheckCircle />
                                                      {history?.status_verifikasi || "-"}
                                                    </span>
                                                  </td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                    {history?.tanggal_verifikasi || "-"}
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}

                          </React.Fragment>
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


      {/* ================================================= */}
      {/* FULL PAYMENT MODAL */}
      {/* ================================================= */}

      {
        showPaymentModal && (

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

              {/* HEADER */}

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

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >
                        Bayar Sekarang
                      </h3>

                      <p
                        className="
                          text-xs
                          text-blue-100
                        "
                      >

                        {
                          paymentItems.length >
                            1
                            ? `${paymentItems.length} faktur dipilih`
                            : "Pembayaran faktur"
                        }

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


              {/* BODY */}

              <div
                className="
                  p-5
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-5
                "
              >

                {/* LEFT */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                  "
                >

                  {/* DETAIL */}

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


                    {
                      paymentItems.length ===
                        1 ? (

                        <div
                          className="
                            grid
                            grid-cols-2
                            gap-y-3
                            text-sm
                          "
                        >

                          <span
                            className="
                              text-gray-500
                            "
                          >
                            Nomor Faktur
                          </span>

                          <span
                            className="
                              text-right
                              font-semibold
                              text-gray-700
                            "
                          >
                            {
                              paymentItems[0]
                                .no_faktur
                            }
                          </span>


                          <span
                            className="
                              text-gray-500
                            "
                          >
                            Customer ID
                          </span>

                          <span
                            className="
                              text-right
                              font-semibold
                              text-gray-700
                            "
                          >
                            {
                              paymentItems[0]
                                .customer_id
                            }
                          </span>


                          <span
                            className="
                              text-gray-500
                            "
                          >
                            Nama Customer
                          </span>

                          <span
                            className="
                              text-right
                              font-semibold
                              text-gray-700
                            "
                          >
                            {
                              paymentItems[0]
                                .nama_customer
                            }
                          </span>


                          <span
                            className="
                              text-gray-500
                            "
                          >
                            Nominal Tagihan
                          </span>

                          <span
                            className="
                              text-right
                              font-bold
                              text-primary
                            "
                          >
                            {
                              formatRupiah(
                                paymentItems[0]
                                  .sisa_tagihan ??
                                paymentItems[0]
                                  .nominal_tagihan
                              )
                            }
                          </span>

                        </div>

                      ) : (

                        <div
                          className="
                            flex
                            flex-col
                            gap-3
                          "
                        >

                          {
                            paymentItems.map(
                              item => (

                                <div
                                  key={
                                    item.id
                                  }
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
                                        {
                                          item.no_faktur
                                        }
                                      </p>

                                    </div>

                                    <div
                                      className="
                                        text-right
                                      "
                                    >

                                      <p
                                        className="
                                          text-xs
                                          text-gray-400
                                        "
                                      >
                                        Sisa Tagihan
                                      </p>

                                      <p
                                        className="
                                          font-bold
                                          text-gray-700
                                        "
                                      >
                                        {
                                          formatRupiah(
                                            item.sisa_tagihan ??
                                            item.nominal_tagihan
                                          )
                                        }
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
                                    {
                                      item.nama_customer
                                    }
                                  </p>

                                </div>

                              )
                            )
                          }

                        </div>

                      )
                    }

                  </div>


                  {/* PENAGIH */}

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

                      <span
                        className="
                          text-gray-500
                        "
                      >
                        Nama
                      </span>

                      <span
                        className="
                          font-semibold
                          text-gray-700
                        "
                      >
                        {
                          paymentItems.length ===
                            1
                            ? paymentItems[0]
                              .nama_penagih
                            : "Multi Faktur"
                        }
                      </span>

                    </div>

                  </div>


                  {/* PAYMENT METHOD */}

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


                    {/* DIRECT */}

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

                        <div
                          className="
                            text-left
                          "
                        >

                          <p
                            className="
                              font-semibold
                              text-gray-700
                            "
                          >
                            Direct Transfer
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            Pilih bank tujuan
                          </p>

                        </div>

                      </div>


                      {
                        paymentMethod ===
                        "DIRECT_TRANSFER" && (

                          <FaCheckCircle
                            className="
                              text-orange-500
                            "
                          />

                        )
                      }

                    </button>


                    {/* SSP */}

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          "SSP"
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
                          "SSP"
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

                        <div
                          className="
                            text-left
                          "
                        >

                          <p
                            className="
                              font-semibold
                              text-gray-700
                            "
                          >
                            Surat Setor Pajak
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            Pembayaran melalui Surat Setor Pajak
                          </p>

                        </div>

                      </div>


                      {
                        paymentMethod ===
                        "SSP" && (

                          <FaCheckCircle
                            className="
                              text-orange-500
                            "
                          />

                        )
                      }

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

                        <div
                          className="
                            text-left
                          "
                        >

                          <p
                            className="
                              font-semibold
                              text-gray-700
                            "
                          >
                            Cash
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            Uang tunai diserahkan ke Collector
                          </p>

                        </div>

                      </div>


                      {
                        paymentMethod ===
                        "CASH" && (

                          <FaCheckCircle
                            className="
                              text-orange-500
                            "
                          />

                        )
                      }

                    </button>

                    {/* PARTIAL PAYMENT */}
                    {canUsePartialPayment && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectPaymentMethod(
                            "PARTIAL_PAYMENT"
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
                          mt-3
                          transition
                          ${paymentMethod ===
                            "PARTIAL_PAYMENT"
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-200 bg-white"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
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
                            <FaCreditCard className="text-orange-500" />
                          </div>

                          <div className="text-left">
                            <p className="font-semibold text-gray-700">
                              Partial Payment
                            </p>
                            <p className="text-xs text-gray-400">
                              Pembayaran sebagian untuk customer yang sama
                            </p>
                          </div>
                        </div>

                        {paymentMethod === "PARTIAL_PAYMENT" && (
                          <FaCheckCircle className="text-orange-500" />
                        )}
                      </button>
                    )}

                    {paymentSelection.length > 1 &&
                      !canUsePartialPayment && (
                        <div
                          className="
                            mt-3
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            px-4
                            py-3
                          "
                        >
                          <p className="text-xs font-semibold text-amber-700">
                            Partial Payment tidak tersedia
                          </p>

                          <p className="text-xs text-amber-600 mt-1">
                            Faktur yang dipilih berasal dari customer
                            yang berbeda. Pilih faktur dari 1 customer
                            yang sama.
                          </p>
                        </div>
                      )}

                    {paymentMethod === "PARTIAL_PAYMENT" &&
                      canUsePartialPayment && (
                        <div
                          className="
                            mt-4
                            rounded-2xl
                            border
                            border-orange-100
                            bg-orange-50
                            p-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                              mb-4
                            "
                          >
                            <div>
                              <p className="font-bold text-gray-700">
                                Alokasi Pembayaran
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                Customer:{" "}
                                <span className="font-semibold">
                                  {selectedPaymentCustomerName}
                                </span>
                              </p>
                            </div>

                            <span
                              className="
                                text-xs
                                font-semibold
                                px-3
                                py-1
                                rounded-full
                                bg-white
                                text-orange-600
                                border
                                border-orange-200
                              "
                            >
                              {selectedPaymentInvoices.length} Faktur
                            </span>
                          </div>

                          <label className="block text-xs font-semibold text-gray-600 mb-2">
                            Nominal Pembayaran
                          </label>

                          <div className="relative mb-4">
                            <span
                              className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                                font-semibold
                              "
                            >
                              Rp
                            </span>

                            <input
                              type="text"
                              inputMode="numeric"
                              value={formatInputNominal(
                                paymentPartialAmount
                              )}
                              onChange={(e) => {
                                const value =
                                  e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );

                                setPaymentPartialAmount(value);
                                setPaymentAllocation({});
                                setShowPaymentAllocation(false);
                              }}
                              placeholder="0"
                              className="
                                input
                                input-bordered
                                w-full
                                bg-white
                                rounded-xl
                                pl-12
                                font-bold
                                text-primary
                              "
                            />
                          </div>

                          <div
                            className="
                              grid
                              grid-cols-2
                              gap-3
                              mb-4
                            "
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentAllocationMode("MANUAL");
                                setPaymentAllocation({});
                                setShowPaymentAllocation(false);
                              }}
                              className={`
                                rounded-xl
                                border
                                px-4
                                py-3
                                text-left
                                transition
                                ${paymentAllocationMode === "MANUAL"
                                  ? "border-primary bg-blue-50"
                                  : "border-gray-200 bg-white"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-700 text-sm">
                                  Manual
                                </span>

                                {paymentAllocationMode === "MANUAL" && (
                                  <FaCheckCircle className="text-primary" />
                                )}
                              </div>

                              <p className="text-[11px] text-gray-500 mt-1">
                                Atur nominal per faktur
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setPaymentAllocationMode("SYSTEM");
                                setPaymentAllocation({});
                                setShowPaymentAllocation(false);
                              }}
                              className={`
                                rounded-xl
                                border
                                px-4
                                py-3
                                text-left
                                transition
                                ${paymentAllocationMode === "SYSTEM"
                                  ? "border-primary bg-blue-50"
                                  : "border-gray-200 bg-white"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-700 text-sm">
                                  Otomatis
                                </span>

                                {paymentAllocationMode === "SYSTEM" && (
                                  <FaCheckCircle className="text-primary" />
                                )}
                              </div>

                              <p className="text-[11px] text-gray-500 mt-1">
                                Alokasi otomatis berdasarkan urutan faktur
                              </p>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleShowPaymentAllocation}
                            className="
                              w-full
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              px-4
                              py-3
                              rounded-xl
                              bg-primary
                              text-white
                              text-sm
                              font-semibold
                              hover:opacity-90
                              transition
                              shadow-sm
                            "
                          >
                            <FaCreditCard />
                            Tampilkan Alokasi Pembayaran
                          </button>

                          {showPaymentAllocation && (
                            <div
                              className="
                                mt-4
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                overflow-hidden
                              "
                            >
                              <div
                                className="
                                  px-4
                                  py-3
                                  bg-gray-50
                                  border-b
                                  border-gray-200
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
                                "
                              >
                                <div>
                                  <p className="text-sm font-bold text-gray-700">
                                    Detail Alokasi
                                  </p>

                                  <p className="text-[11px] text-gray-500">
                                    {paymentAllocationMode === "MANUAL"
                                      ? "Atur nominal pembayaran pada setiap faktur."
                                      : "Pembayaran dialokasikan otomatis dari faktur teratas."}
                                  </p>
                                </div>

                                {paymentAllocationMode === "SYSTEM" && (
                                  <button
                                    type="button"
                                    onClick={handleAutoAllocatePayment}
                                    className="text-xs font-semibold text-primary hover:underline"
                                  >
                                    Hitung Ulang
                                  </button>
                                )}
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                                        No. Faktur
                                      </th>

                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                        Sisa Tagihan
                                      </th>

                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                        Alokasi
                                      </th>

                                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                        Sisa Setelah Bayar
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {selectedPaymentInvoices.map((invoice) => {
                                      const sisa = Number(
                                        invoice?.sisa_tagihan ??
                                        invoice?.nominal_tagihan ??
                                        0
                                      );

                                      const allocated = Number(
                                        paymentAllocation[
                                        invoice.no_faktur
                                        ] || 0
                                      );

                                      return (
                                        <tr
                                          key={invoice.id}
                                          className="border-t border-gray-100"
                                        >
                                          <td className="px-4 py-3">
                                            <p className="font-semibold text-primary">
                                              {invoice.no_faktur}
                                            </p>
                                          </td>

                                          <td className="px-4 py-3 text-right font-semibold text-gray-700">
                                            {formatRupiah(sisa)}
                                          </td>

                                          <td className="px-4 py-3">
                                            <input
                                              type="text"
                                              inputMode="numeric"
                                              disabled={
                                                paymentAllocationMode === "SYSTEM"
                                              }
                                              value={formatInputNominal(
                                                allocated
                                              )}
                                              onChange={(e) =>
                                                handleManualAllocationChange(
                                                  invoice.no_faktur,
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                  )
                                                )
                                              }
                                              className="input input-bordered input-sm w-full min-w-[150px] bg-white text-right font-semibold"
                                            />
                                          </td>

                                          <td className="px-4 py-3 text-right font-bold text-orange-600">
                                            {formatRupiah(
                                              Math.max(
                                                0,
                                                sisa - allocated
                                              )
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              <div
                                className="
                                  border-t
                                  border-gray-200
                                  bg-gray-50
                                  p-4
                                "
                              >
                                <div
                                  className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-3
                                    gap-3
                                  "
                                >
                                  <div className="rounded-xl bg-white border border-gray-200 p-3">
                                    <p className="text-[11px] text-gray-500">
                                      Total Saldo Piutang
                                    </p>
                                    <p className="font-bold text-gray-700 mt-1">
                                      {formatRupiah(
                                        totalSelectedPayment
                                      )}
                                    </p>
                                  </div>

                                  <div className="rounded-xl bg-white border border-gray-200 p-3">
                                    <p className="text-[11px] text-gray-500">
                                      Total Alokasi
                                    </p>
                                    <p className="font-bold text-primary mt-1">
                                      {formatRupiah(
                                        allocatedPaymentTotal
                                      )}
                                    </p>
                                  </div>

                                  <div className="rounded-xl bg-white border border-gray-200 p-3">
                                    <p className="text-[11px] text-gray-500">
                                      Sisa Dana
                                    </p>
                                    <p className="font-bold text-green-600 mt-1">
                                      {formatRupiah(
                                        Math.max(
                                          0,
                                          parseNominal(
                                            paymentPartialAmount
                                          ) -
                                          allocatedPaymentTotal
                                        )
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}


                  </div>

                </div>


                {/* RIGHT */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                  "
                >

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


                    <div
                      className="
                        flex
                        justify-between
                        text-sm
                        mb-4
                      "
                    >

                      <span
                        className="
                          text-gray-500
                        "
                      >
                        Metode Pembayaran
                      </span>

                      <span
                        className="
                          font-semibold
                        "
                      >
                        {
                          paymentMethod ===
                            "DIRECT_TRANSFER"
                            ? "Direct Transfer"
                            : paymentMethod ===
                              "GIRO"
                              ? "Giro"
                              : paymentMethod ===
                                "MENUNGGU_PEMBAYARAN"
                                ? "Menunggu Pembayaran"
                                : paymentMethod ===
                                  "SSP"
                                  ? "Surat Setor Pajak"
                                  : "Cash"
                        }
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        justify-between
                        text-sm
                        mb-4
                      "
                    >

                      <span
                        className="
                          text-gray-500
                        "
                      >
                        Jumlah Bayar
                      </span>

                      <span
                        className="
                          font-bold
                          text-primary
                        "
                      >
                        {
                          formatRupiah(
                            totalPayment
                          )
                        }
                      </span>

                    </div>


                    {/* GIRO DATE */}

                    {
                      paymentMethod ===
                      "GIRO" && (

                        <div
                          className="
                            mb-4
                          "
                        >

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

                      )
                    }


                    {/* RENCANA PEMBAYARAN */}

                    {
                      paymentMethod ===
                      "MENUNGGU_PEMBAYARAN" && (
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 mb-2 block">
                            Tanggal Rencana Pembayaran
                          </label>
                          <input
                            type="date"
                            value={plannedPaymentDate}
                            onChange={(e) =>
                              setPlannedPaymentDate(e.target.value)
                            }
                            className="input input-bordered w-full bg-white rounded-xl"
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            Tanggal rencana pembayaran oleh customer.
                          </p>
                        </div>
                      )
                    }


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

                      {
                        paymentFile ? (

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
                              {
                                paymentFile.name
                              }
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

                        )
                      }


                      <input
                        type="file"
                        accept="
                          image/*
                          ,.pdf
                        "
                        className="
                          hidden
                        "
                        onChange={
                          e =>
                            setPaymentFile(
                              e.target.files?.[0]
                            )
                        }
                      />

                    </label>


                    {/* DESCRIPTION */}

                    <div
                      className="
                        mt-4
                      "
                    >

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

                  {
                    paymentItems.length >
                      1
                      ? `Bayar ${paymentItems.length} Faktur`
                      : "Bayar Sekarang"
                  }

                </button>

              </div>

            </div>

          </div>

        )
      }


      {/* ================================================= */}
      {/* PARTIAL PAYMENT MODAL */}
      {/* ================================================= */}

      {
        showPartialPaymentModal && (

          <div
            className="
              fixed
              inset-0
              z-[1000]
              bg-black/40
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
            onClick={
              closePartialPayment
            }
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-6xl
                max-h-[92vh]
                overflow-hidden
                flex
                flex-col
              "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* ================================================= */}
              {/* HEADER */}
              {/* ================================================= */}

              <div
                className="
                  bg-primary
                  px-6
                  py-4
                  text-white
                  flex
                  items-center
                  justify-between
                  shrink-0
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
                      w-11
                      h-11
                      rounded-xl
                      bg-white/15
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FaCreditCard />

                  </div>

                  <div>

                    <h3
                      className="
                        font-bold
                        text-lg
                      "
                    >
                      Partial Payment
                    </h3>

                    <p
                      className="
                        text-xs
                        text-blue-100
                      "
                    >
                      Pembayaran sebagian faktur
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    closePartialPayment
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


              {/* ================================================= */}
              {/* BODY */}
              {/* ================================================= */}

              <div
                className="
                  p-5
                  overflow-y-auto
                  flex-1
                "
              >

                {/* ================================================= */}
                {/* ================================================= */}
                {/* CUSTOMER */}
                {/* ================================================= */}

                <div
                  className="
                    rounded-2xl
                    bg-indigo-50
                    border
                    border-indigo-100
                    p-5
                    mb-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      mb-3
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-indigo-100
                        text-indigo-600
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
                          text-sm
                          font-bold
                          text-indigo-900
                        "
                      >
                        Pilih Customer Terlebih Dahulu
                      </p>

                      <p
                        className="
                          text-xs
                          text-indigo-700
                          mt-1
                        "
                      >
                        Data faktur hanya akan ditampilkan setelah customer dipilih.
                      </p>
                    </div>

                  </div>

                  <select
                    className="
                      select
                      select-bordered
                      w-full
                      bg-white
                      rounded-xl
                      font-semibold
                      text-gray-700
                    "
                    value={
                      selectedCustomerId
                    }
                    onChange={
                      e => {

                        const customerId = e.target.value;
                        setSelectedCustomerId(customerId);
                        setPartialSelectedIds([]);
                        setPartialAllocation([]);
                        loadPartialInvoices(customerId);

                      }
                    }
                  >

                    <option value="">
                      -- Pilih Customer --
                    </option>

                    {
                      partialCustomerOptions.map(
                        customer => (

                          <option
                            key={
                              customer.customer_id
                            }
                            value={
                              customer.customer_id
                            }
                          >
                            {
                              customer.nama_customer
                            }
                            {" - "}
                            {
                              customer.jumlah_faktur
                            }
                            {" faktur"}
                          </option>

                        )
                      )
                    }

                  </select>

                  {
                    selectedCustomerId && (

                      <div
                        className="
                          mt-3
                          grid
                          grid-cols-1
                          sm:grid-cols-3
                          gap-3
                        "
                      >

                        {
                          (() => {

                            const customer =
                              partialCustomerOptions.find(
                                item =>
                                  String(
                                    item.customer_id
                                  ) ===
                                  String(
                                    selectedCustomerId
                                  )
                              );

                            if (!customer) {
                              return null;
                            }

                            return (
                              <>
                                <div
                                  className="
                                    rounded-xl
                                    bg-white
                                    border
                                    border-indigo-100
                                    px-4
                                    py-3
                                  "
                                >
                                  <p
                                    className="
                                      text-[11px]
                                      text-gray-500
                                    "
                                  >
                                    Customer
                                  </p>

                                  <p
                                    className="
                                      text-sm
                                      font-bold
                                      text-gray-700
                                      mt-0.5
                                    "
                                  >
                                    {
                                      customer.nama_customer
                                    }
                                  </p>
                                </div>

                                <div
                                  className="
                                    rounded-xl
                                    bg-white
                                    border
                                    border-indigo-100
                                    px-4
                                    py-3
                                  "
                                >
                                  <p
                                    className="
                                      text-[11px]
                                      text-gray-500
                                    "
                                  >
                                    Jumlah Faktur
                                  </p>

                                  <p
                                    className="
                                      text-sm
                                      font-bold
                                      text-primary
                                      mt-0.5
                                    "
                                  >
                                    {
                                      customer.jumlah_faktur
                                    }
                                    {" "}Faktur
                                  </p>
                                </div>

                                <div
                                  className="
                                    rounded-xl
                                    bg-white
                                    border
                                    border-indigo-100
                                    px-4
                                    py-3
                                  "
                                >
                                  <p
                                    className="
                                      text-[11px]
                                      text-gray-500
                                    "
                                  >
                                    Total Saldo Piutang
                                  </p>

                                  <p
                                    className="
                                      text-sm
                                      font-bold
                                      text-orange-600
                                      mt-0.5
                                    "
                                  >
                                    {
                                      formatRupiah(
                                        customer.total_saldo_piutang
                                      )
                                    }
                                  </p>
                                </div>
                              </>
                            );

                          })()
                        }

                      </div>

                    )
                  }

                </div>


                {/* NOMINAL + METHOD */}
                {/* ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-5
                    mb-5
                  "
                >

                  {/* NOMINAL */}

                  <div
                    className="
                      rounded-2xl
                      bg-blue-50
                      border
                      border-blue-100
                      p-5
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
                      Nominal Pembayaran
                    </label>

                    <div
                      className="
                        relative
                      "
                    >

                      <span
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-gray-500
                          font-semibold
                        "
                      >
                        Rp
                      </span>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={
                          formatInputNominal(
                            partialPaymentAmount
                          )
                        }
                        onChange={
                          e => {

                            const value =
                              e.target.value
                                .replace(
                                  /\D/g,
                                  ""
                                );

                            setPartialPaymentAmount(
                              value
                            );

                            setPartialAllocation(
                              []
                            );

                          }
                        }
                        placeholder="0"
                        className="
                          input
                          input-bordered
                          w-full
                          bg-white
                          rounded-xl
                          pl-12
                          text-lg
                          font-bold
                          text-primary
                        "
                      />

                    </div>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-2
                      "
                    >
                      Masukkan jumlah dana yang akan dibayarkan.
                    </p>

                  </div>


                  {/* METHOD */}

                  <div
                    className="
                      rounded-2xl
                      bg-gray-50
                      border
                      border-gray-100
                      p-5
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-700
                        mb-3
                      "
                    >
                      Metode Pemilihan Faktur
                    </p>


                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-3
                      "
                    >

                      {/* MANUAL */}

                      <button
                        type="button"
                        onClick={() => {

                          setPartialPaymentMethod(
                            "MANUAL"
                          );

                          setPartialAllocation(
                            []
                          );

                        }}
                        className={`
                          p-4
                          rounded-xl
                          border
                          text-left
                          transition
                          ${partialPaymentMethod ===
                            "MANUAL"
                            ? "border-primary bg-blue-50"
                            : "border-gray-200 bg-white"
                          }
                        `}
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            mb-2
                          "
                        >

                          <span
                            className="
                              font-bold
                              text-gray-700
                            "
                          >
                            Manual
                          </span>

                          {
                            partialPaymentMethod ===
                            "MANUAL" && (

                              <FaCheckCircle
                                className="
                                  text-primary
                                "
                              />

                            )
                          }

                        </div>

                        <p
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          User memilih sendiri faktur yang akan dibayar.
                        </p>

                      </button>


                      {/* SYSTEM */}

                      <button
                        type="button"
                        onClick={() => {

                          setPartialPaymentMethod(
                            "SYSTEM"
                          );

                          setPartialSelectedIds(
                            []
                          );

                          setPartialAllocation(
                            []
                          );

                        }}
                        className={`
                          p-4
                          rounded-xl
                          border
                          text-left
                          transition
                          ${partialPaymentMethod ===
                            "SYSTEM"
                            ? "border-primary bg-blue-50"
                            : "border-gray-200 bg-white"
                          }
                        `}
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            mb-2
                          "
                        >

                          <span
                            className="
                              font-bold
                              text-gray-700
                            "
                          >
                            By Sistem
                          </span>

                          {
                            partialPaymentMethod ===
                            "SYSTEM" && (

                              <FaCheckCircle
                                className="
                                  text-primary
                                "
                              />

                            )
                          }

                        </div>

                        <p
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          Sistem memilih faktur berdasarkan nominal terkecil.
                        </p>

                      </button>

                    </div>

                  </div>

                </div>


                {/* ================================================= */}
                {/* MANUAL */}
                {/* ================================================= */}

                {
                  selectedCustomerId &&
                  partialPaymentMethod ===
                  "MANUAL" && (

                    <div
                      className="
                        rounded-2xl
                        border
                        border-gray-200
                        overflow-hidden
                        mb-5
                      "
                    >

                      <div
                        className="
                          bg-gray-50
                          px-5
                          py-4
                          border-b
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div>

                          <h3
                            className="
                              font-bold
                              text-gray-700
                            "
                          >
                            Pilih Faktur
                          </h3>

                          <p
                            className="
                              text-xs
                              text-gray-500
                            "
                          >
                            Centang faktur yang ingin menerima pembayaran.
                          </p>

                        </div>

                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-blue-100
                            text-primary
                            text-xs
                            font-bold
                          "
                        >
                          {
                            partialSelectedIds.length
                          } dipilih
                        </span>

                      </div>


                      <div
                        className="
                          overflow-auto
                          max-h-[320px]
                        "
                      >

                        <table
                          className="
                            table
                            w-full
                          "
                        >

                          <thead>

                            <tr
                              className="
                                bg-gray-100
                                text-gray-600
                                text-xs
                              "
                            >

                              <th>
                                Pilih
                              </th>

                              <th>
                                No. Faktur
                              </th>

                              <th>
                                Customer
                              </th>

                              <th>
                                Due Date
                              </th>

                              <th>
                                Status
                              </th>

                              <th
                                className="
                                  text-right
                                "
                              >
                                Sisa Tagihan
                              </th>

                            </tr>

                          </thead>


                          <tbody>

                            {
                              !selectedCustomerId ? (

                                <tr>
                                  <td
                                    colSpan={6}
                                    className="
                                      py-12
                                      text-center
                                      text-gray-500
                                    "
                                  >
                                    <div
                                      className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-2
                                      "
                                    >
                                      <FaBuilding
                                        className="
                                          text-3xl
                                          text-indigo-300
                                        "
                                      />

                                      <p
                                        className="
                                          text-sm
                                          font-semibold
                                          text-gray-600
                                        "
                                      >
                                        Silakan pilih customer terlebih dahulu
                                      </p>

                                      <p
                                        className="
                                          text-xs
                                          text-gray-400
                                        "
                                      >
                                        Data faktur customer akan muncul di sini.
                                      </p>
                                    </div>
                                  </td>
                                </tr>

                              ) : getPayableInvoices()
                                .map(
                                  item => (

                                    <tr
                                      key={
                                        item.id
                                      }
                                      className="
                                        hover:bg-blue-50
                                        border-b
                                      "
                                    >

                                      <td>

                                        <input
                                          type="checkbox"
                                          className="
                                            checkbox
                                            checkbox-sm
                                            checkbox-primary
                                          "
                                          checked={
                                            partialSelectedIds.includes(
                                              item.id
                                            )
                                          }
                                          onChange={() =>
                                            handlePartialSelectOne(
                                              item.id
                                            )
                                          }
                                        />

                                      </td>


                                      <td>

                                        <span
                                          className="
                                            font-semibold
                                            text-primary
                                          "
                                        >
                                          {
                                            item.no_faktur
                                          }
                                        </span>

                                      </td>


                                      <td>

                                        <div>

                                          <p
                                            className="
                                              font-medium
                                              text-gray-700
                                            "
                                          >
                                            {
                                              item.nama_customer
                                            }
                                          </p>

                                          <p
                                            className="
                                              text-xs
                                              text-gray-400
                                            "
                                          >
                                            {
                                              item.customer_id
                                            }
                                          </p>

                                        </div>

                                      </td>


                                      <td>

                                        {
                                          formatDate(
                                            item.due_date
                                          )
                                        }

                                      </td>


                                      <td>

                                        {
                                          renderStatus(
                                            item.status
                                          )
                                        }

                                      </td>


                                      <td
                                        className="
                                          text-right
                                          font-bold
                                        "
                                      >

                                        {
                                          formatRupiah(
                                            item.sisa_tagihan ??
                                            item.nominal_tagihan
                                          )
                                        }

                                      </td>

                                    </tr>

                                  )
                                )
                            }

                          </tbody>

                        </table>

                      </div>

                    </div>

                  )
                }


                {/* ================================================= */}
                {/* SYSTEM INFO */}
                {/* ================================================= */}

                {
                  selectedCustomerId &&
                  partialPaymentMethod ===
                  "SYSTEM" && (

                    <div
                      className="
                        rounded-2xl
                        bg-orange-50
                        border
                        border-orange-100
                        p-4
                        mb-5
                        flex
                        gap-3
                      "
                    >

                      <FaInfoCircle
                        className="
                          text-orange-500
                          mt-0.5
                        "
                      />

                      <div>

                        <p
                          className="
                            font-semibold
                            text-orange-800
                            text-sm
                          "
                        >
                          Alokasi Otomatis
                        </p>

                        <p
                          className="
                            text-xs
                            text-orange-700
                            mt-1
                          "
                        >
                          Sistem akan mengurutkan faktur berdasarkan
                          sisa tagihan paling kecil, kemudian membayar
                          faktur tersebut terlebih dahulu. Jika masih
                          ada dana, sistem melanjutkan ke faktur berikutnya.
                        </p>

                      </div>

                    </div>

                  )
                }


                {/* ================================================= */}
                {/* GENERATE */}
                {/* ================================================= */}

                <div
                  className="
                    flex
                    justify-end
                    mb-5
                  "
                >

                  <button
                    type="button"
                    disabled={
                      !selectedCustomerId
                    }
                    onClick={
                      generatePartialAllocation
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
                      rounded-full
                      bg-primary
                      text-white
                      text-sm
                      font-semibold
                      hover:opacity-90
                      shadow-md
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >

                    <FaCreditCard />

                    Tampilkan Alokasi Pembayaran

                  </button>

                </div>


                {/* ================================================= */}
                {/* ALLOCATION RESULT */}
                {/* ================================================= */}

                {
                  partialAllocation.length >
                  0 && (

                    <div
                      className="
                        rounded-2xl
                        border
                        border-gray-200
                        overflow-hidden
                      "
                    >

                      <div
                        className="
                          px-5
                          py-4
                          bg-green-50
                          border-b
                          border-green-100
                        "
                      >

                        <h3
                          className="
                            font-bold
                            text-green-800
                          "
                        >
                          Hasil Alokasi Pembayaran
                        </h3>

                        <p
                          className="
                            text-xs
                            text-green-700
                            mt-1
                          "
                        >
                          Periksa kembali alokasi sebelum diproses.
                        </p>

                      </div>


                      <div
                        className="
                          overflow-auto
                        "
                      >

                        <table
                          className="
                            table
                            w-full
                          "
                        >

                          <thead>

                            <tr
                              className="
                                bg-gray-100
                                text-gray-600
                                text-xs
                              "
                            >

                              <th>
                                No
                              </th>

                              <th>
                                No. Faktur
                              </th>

                              <th>
                                Customer
                              </th>

                              <th>
                                Sisa Sebelum
                              </th>

                              <th>
                                Dibayar
                              </th>

                              <th>
                                Sisa Setelah
                              </th>

                              <th>
                                Status
                              </th>

                            </tr>

                          </thead>


                          <tbody>

                            {
                              partialAllocation.map(
                                (
                                  item,
                                  index
                                ) => (

                                  <tr
                                    key={
                                      item.id
                                    }
                                    className="
                                      border-b
                                      hover:bg-gray-50
                                    "
                                  >

                                    <td>
                                      {
                                        index +
                                        1
                                      }
                                    </td>

                                    <td
                                      className="
                                        font-semibold
                                        text-primary
                                      "
                                    >
                                      {
                                        item.no_faktur
                                      }
                                    </td>

                                    <td>
                                      {
                                        item.nama_customer
                                      }
                                    </td>

                                    <td>
                                      {
                                        formatRupiah(
                                          item.sisa_tagihan ??
                                          item.nominal_tagihan
                                        )
                                      }
                                    </td>

                                    <td
                                      className="
                                        font-bold
                                        text-green-600
                                      "
                                    >
                                      {
                                        formatRupiah(
                                          item.nominal_pembayaran
                                        )
                                      }
                                    </td>

                                    <td
                                      className="
                                        font-semibold
                                        text-orange-500
                                      "
                                    >
                                      {
                                        formatRupiah(
                                          item.sisa_tagihan_setelah_bayar
                                        )
                                      }
                                    </td>

                                    <td>

                                      {
                                        item.status_pembayaran ===
                                          "LUNAS" ? (

                                          <span
                                            className="
                                              inline-flex
                                              items-center
                                              gap-1
                                              px-3
                                              py-1
                                              rounded-full
                                              bg-green-100
                                              text-green-700
                                              text-xs
                                              font-semibold
                                            "
                                          >

                                            <FaCheckCircle />

                                            Lunas

                                          </span>

                                        ) : (

                                          <span
                                            className="
                                              inline-flex
                                              items-center
                                              gap-1
                                              px-3
                                              py-1
                                              rounded-full
                                              bg-orange-100
                                              text-orange-700
                                              text-xs
                                              font-semibold
                                            "
                                          >

                                            <FaClock />

                                            Partial

                                          </span>

                                        )
                                      }

                                    </td>

                                  </tr>

                                )
                              )
                            }

                          </tbody>

                        </table>

                      </div>


                      {/* ALLOCATION SUMMARY */}

                      <div
                        className="
                          bg-gray-50
                          border-t
                          p-5
                          grid
                          grid-cols-1
                          md:grid-cols-3
                          gap-4
                        "
                      >

                        <div>

                          <p
                            className="
                              text-xs
                              text-gray-500
                            "
                          >
                            Total Dana
                          </p>

                          <p
                            className="
                              font-bold
                              text-lg
                            "
                          >
                            {
                              formatRupiah(
                                partialTotalDana
                              )
                            }
                          </p>

                        </div>


                        <div>

                          <p
                            className="
                              text-xs
                              text-gray-500
                            "
                          >
                            Total Dialokasikan
                          </p>

                          <p
                            className="
                              font-bold
                              text-lg
                              text-green-600
                            "
                          >
                            {
                              formatRupiah(
                                partialTotalAllocated
                              )
                            }
                          </p>

                        </div>


                        <div>

                          <p
                            className="
                              text-xs
                              text-gray-500
                            "
                          >
                            Sisa Dana
                          </p>

                          <p
                            className="
                              font-bold
                              text-lg
                              text-orange-500
                            "
                          >
                            {
                              formatRupiah(
                                partialRemainingDana
                              )
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                }

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
                  shrink-0
                "
              >

                <button
                  type="button"
                  onClick={
                    closePartialPayment
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
                  disabled={
                    !selectedCustomerId ||
                    partialAllocation.length ===
                    0
                  }
                  onClick={
                    handlePartialPayment
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
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  <FaCreditCard />

                  Proses Partial Payment

                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

};


export default TableBayarFaktur;