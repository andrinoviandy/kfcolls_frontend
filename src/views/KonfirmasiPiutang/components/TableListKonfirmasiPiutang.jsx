import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaFileInvoiceDollar,
  FaBuilding,
  FaUser,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisV,
  FaHashtag,
  FaInfoCircle,
  FaWhatsapp,
  FaEnvelope,
  FaEye,
  FaFileAlt,
  FaPaperPlane,
  FaSpinner,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate
  from "react-paginate";

import storeSchema from "global/store";
import { swal } from "global/helper/swal";


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (
  date
) => {

  if (!date) {
    return "-";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
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

const formatRupiah = (
  value
) => {

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
  ).format(
    value
  );

};


// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {

  MENUNGGU_KONFIRMASI: {

    label:
      "Menunggu Konfirmasi",

    icon:
      FaClock,

    className:
      "bg-amber-100 text-amber-700",

  },


  DISETUJUI_CUSTOMER: {

    label:
      "Disetujui Customer",

    icon:
      FaCheckCircle,

    className:
      "bg-green-100 text-green-700",

  },


  DITOLAK_CUSTOMER: {

    label:
      "Ditolak Customer",

    icon:
      FaTimesCircle,

    className:
      "bg-red-100 text-red-700",

  },


  DISETUJUI_OTOMATIS: {

    label:
      "Disetujui Otomatis",

    icon:
      FaCheckCircle,

    className:
      "bg-blue-100 text-blue-700",

  },

};

// Normalisasi kode status dari backend ke status yang dipakai UI.
// Kode singkat dapat disesuaikan dengan nilai aktual d_status.kd_status.
const normalizeStatusKonfirmasi = (status) => {
  if (!status) return null;

  const value = String(status).trim().toUpperCase();

  const statusMap = {
    MK: "MENUNGGU_KONFIRMASI",
    MENUNGGU_KONFIRMASI: "MENUNGGU_KONFIRMASI",
    STJ: "DISETUJUI_CUSTOMER",
    DISETUJUI_CUSTOMER: "DISETUJUI_CUSTOMER",
    TLK: "DITOLAK_CUSTOMER",
    DITOLAK_CUSTOMER: "DITOLAK_CUSTOMER",
    OTO: "DISETUJUI_OTOMATIS",
    DISETUJUI_OTOMATIS: "DISETUJUI_OTOMATIS",
  };

  return statusMap[value] || value;
};


// =====================================================
// DUMMY DATA
// =====================================================

const dummyData = [

  {
    id:
      1,

    no_faktur:
      "10000271521",

    no_billing:
      "BILL-202608-000001",

    customer_id:
      "CUST001",

    nama_customer:
      "Dinas Kesehatan Kota Medan",

    alamat:
      "Jl. Gatot Subroto No. 125, Medan",

    nama_penagih:
      "KFTD Medan",

    nominal_tagihan:
      140000000,

    posting_date:
      "2026-08-01",

    tanggal_kirim_konfirmasi:
      "2026-08-02",

    batas_konfirmasi:
      "2026-08-16",

    tanggal_konfirmasi:
      null,

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567890",

    email_customer:
      "customer.medan@example.com",

    sales:
      "Andri Noviandy",

    status:
      "MENUNGGU_KONFIRMASI",

  },


  {
    id:
      2,

    no_faktur:
      "10000271522",

    no_billing:
      "BILL-202608-000002",

    customer_id:
      "CUST002",

    nama_customer:
      "Apotek Maju Djaya",

    alamat:
      "Jl. Sisingamangaraja No. 88, Medan",

    nama_penagih:
      "KFTD Medan",

    nominal_tagihan:
      85000000,

    posting_date:
      "2026-08-02",

    tanggal_kirim_konfirmasi:
      "2026-08-03",

    batas_konfirmasi:
      "2026-08-17",

    tanggal_konfirmasi:
      "2026-08-07",

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567891",

    email_customer:
      "customer.maju@example.com",

    sales:
      "Budi Santoso",

    status:
      "DISETUJUI_CUSTOMER",

  },


  {
    id:
      3,

    no_faktur:
      "10000271523",

    no_billing:
      "BILL-202607-000003",

    customer_id:
      "CUST003",

    nama_customer:
      "Apotek Rusli",

    alamat:
      "Jl. Iskandar Muda No. 45, Medan",

    nama_penagih:
      "KFTD Medan",

    nominal_tagihan:
      140000000,

    posting_date:
      "2026-07-20",

    tanggal_kirim_konfirmasi:
      "2026-07-21",

    batas_konfirmasi:
      "2026-08-04",

    tanggal_konfirmasi:
      null,

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567892",

    email_customer:
      "customer.rusli@example.com",

    sales:
      "Citra Lestari",

    status:
      "DISETUJUI_OTOMATIS",

  },


  {
    id:
      4,

    no_faktur:
      "10000271524",

    no_billing:
      "BILL-202608-000004",

    customer_id:
      "CUST004",

    nama_customer:
      "RSUD Pasuruan",

    alamat:
      "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",

    nama_penagih:
      "KFTD Pasuruan",

    nominal_tagihan:
      175000000,

    posting_date:
      "2026-08-04",

    tanggal_kirim_konfirmasi:
      "2026-08-05",

    batas_konfirmasi:
      "2026-08-19",

    tanggal_konfirmasi:
      "2026-08-10",

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567893",

    email_customer:
      "customer.pasuruan@example.com",

    sales:
      "Dimas Pratama",

    status:
      "DITOLAK_CUSTOMER",

  },


  {
    id:
      5,

    no_faktur:
      "10000271525",

    no_billing:
      "BILL-202608-000005",

    customer_id:
      "CUST005",

    nama_customer:
      "RS Hermina Medan",

    alamat:
      "Jl. Asrama No. 12, Medan",

    nama_penagih:
      "KFTD Medan",

    nominal_tagihan:
      95000000,

    posting_date:
      "2026-08-05",

    tanggal_kirim_konfirmasi:
      "2026-08-06",

    batas_konfirmasi:
      "2026-08-20",

    tanggal_konfirmasi:
      null,

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567894",

    email_customer:
      "customer.hermina@example.com",

    sales:
      "Andri Noviandy",

    status:
      "MENUNGGU_KONFIRMASI",

  },


  {
    id:
      6,

    no_faktur:
      "10000271526",

    no_billing:
      "BILL-202608-000006",

    customer_id:
      "CUST006",

    nama_customer:
      "Apotek Sehat Sentosa",

    alamat:
      "Jl. Kelapa Gading Raya No. 21, Jakarta",

    nama_penagih:
      "KFTD Jakarta",

    nominal_tagihan:
      65000000,

    posting_date:
      "2026-08-06",

    tanggal_kirim_konfirmasi:
      "2026-08-07",

    batas_konfirmasi:
      "2026-08-21",

    tanggal_konfirmasi:
      null,

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567895",

    email_customer:
      "customer.sehat@example.com",

    sales:
      "Budi Santoso",

    status:
      "MENUNGGU_KONFIRMASI",

  },


  {
    id:
      7,

    no_faktur:
      "10000271527",

    no_billing:
      "BILL-202608-000007",

    customer_id:
      "CUST007",

    nama_customer:
      "RSUP H. Adam Malik",

    alamat:
      "Jl. Bunga Lau No. 17, Medan",

    nama_penagih:
      "KFTD Medan",

    nominal_tagihan:
      225000000,

    posting_date:
      "2026-08-07",

    tanggal_kirim_konfirmasi:
      "2026-08-08",

    batas_konfirmasi:
      "2026-08-22",

    tanggal_konfirmasi:
      "2026-08-12",

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567896",

    email_customer:
      "customer.adam@example.com",

    sales:
      "Citra Lestari",

    status:
      "DISETUJUI_CUSTOMER",

  },


  {
    id:
      8,

    no_faktur:
      "10000271528",

    no_billing:
      "BILL-202608-000008",

    customer_id:
      "CUST008",

    nama_customer:
      "Apotek Karya Sehat",

    alamat:
      "Jl. Pemuda No. 45, Jakarta",

    nama_penagih:
      "KFTD Jakarta",

    nominal_tagihan:
      72500000,

    posting_date:
      "2026-08-08",

    tanggal_kirim_konfirmasi:
      "2026-08-09",

    batas_konfirmasi:
      "2026-08-23",

    tanggal_konfirmasi:
      null,

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567897",

    email_customer:
      "customer.karya@example.com",

    sales:
      "Dimas Pratama",

    status:
      "MENUNGGU_KONFIRMASI",

  },


  {
    id:
      9,

    no_faktur:
      "10000271529",

    no_billing:
      "BILL-202608-000009",

    customer_id:
      "CUST009",

    nama_customer:
      "Dinas Kesehatan Kota Bogor",

    alamat:
      "Jl. Pajajaran No. 21, Bogor",

    nama_penagih:
      "KFTD Bogor",

    nominal_tagihan:
      185000000,

    posting_date:
      "2026-08-09",

    tanggal_kirim_konfirmasi:
      "2026-08-10",

    batas_konfirmasi:
      "2026-08-24",

    tanggal_konfirmasi:
      "2026-08-15",

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567898",

    email_customer:
      "customer.bogor@example.com",

    sales:
      "Dimas Pratama",

    status:
      "DITOLAK_CUSTOMER",

  },


  {
    id:
      10,

    no_faktur:
      "10000271530",

    no_billing:
      "BILL-202608-000010",

    customer_id:
      "CUST010",

    nama_customer:
      "RSUD Cibinong",

    alamat:
      "Jl. KSR Dadi Kusmayadi No. 27, Bogor",

    nama_penagih:
      "KFTD Bogor",

    nominal_tagihan:
      310000000,

    posting_date:
      "2026-08-10",

    tanggal_kirim_konfirmasi:
      "2026-08-11",

    batas_konfirmasi:
      "2026-08-25",

    tanggal_konfirmasi:
      null,

    media_wa:
      true,

    media_email:
      true,

    no_wa_customer:
      "6281234567899",

    email_customer:
      "customer.cibinong@example.com",

    sales:
      "Andri Noviandy",

    status:
      "MENUNGGU_KONFIRMASI",

  },

];


// =====================================================
// COMPONENT
// =====================================================

const TableListKonfirmasiPiutang = ({
  dimensionScreenW,
  check,
  loginAccess,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [
    allData,
    setAllData,
  ] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [apiTotalData, setApiTotalData] = useState(0);
  const [apiTotalPage, setApiTotalPage] = useState(0);
  const [apiSummaryData, setApiSummaryData] = useState({});


  const [
    keyword,
    setKeyword,
  ] = useState(
    ""
  );


  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState(
    "ALL"
  );


  const [
    currentPage,
    setCurrentPage,
  ] = useState(
    1
  );


  const [
    perPage,
    setPerPage,
  ] = useState(
    10
  );


  const [
    selectedData,
    setSelectedData,
  ] = useState(
    null
  );


  const [
    showDetail,
    setShowDetail,
  ] = useState(
    false
  );


  // ===================================================
  // TAMBAHAN STATE KIRIM KONFIRMASI
  // ===================================================

  const [
    showSendConfirmation,
    setShowSendConfirmation,
  ] = useState(
    false
  );


  const [
    sendData,
    setSendData,
  ] = useState(
    null
  );

  // Billing yang dipilih untuk konfirmasi sekaligus (dibatasi satu customer).
  const [selectedBillingIds, setSelectedBillingIds] = useState([]);
  const [sendItems, setSendItems] = useState([]);

  // Modal khusus memilih customer lalu memilih billing yang belum dikonfirmasi.
  const [showCustomerBillingModal, setShowCustomerBillingModal] = useState(false);
  const [selectedBulkCustomer, setSelectedBulkCustomer] = useState("");
  const [customerBillingRows, setCustomerBillingRows] = useState([]);
  const [selectedCustomerBillingIds, setSelectedCustomerBillingIds] = useState([]);
  const [loadingCustomerBillings, setLoadingCustomerBillings] = useState(false);
  const [customerBillingSearch, setCustomerBillingSearch] = useState("");
  const [bulkCustomerOptions, setBulkCustomerOptions] = useState([]);


  const [
    sendViaWhatsApp,
    setSendViaWhatsApp,
  ] = useState(
    true
  );


  const [
    sendViaEmail,
    setSendViaEmail,
  ] = useState(
    true
  );


  // Email penerima dapat diubah user, baik email customer sudah tersedia maupun belum.
  const [emailRecipient, setEmailRecipient] = useState("");


  const [
    isSendingConfirmation,
    setIsSendingConfirmation,
  ] = useState(
    false
  );


  const [
    sendResult,
    setSendResult,
  ] = useState(
    null
  );


  // ===================================================
  // SUMMARY
  // ===================================================

  const summaryData = useMemo(() => {
    const rows = Array.isArray(allData) ? allData : [];
    const apiSummary = apiSummaryData || {};

    return {
      total: Number(apiSummary.total ?? apiSummary.total_data ?? apiTotalData ?? rows.length),
      belum_dikirim: Number(
        apiSummary.belum_dikirim ??
        rows.filter(item => item.status_pengiriman_konfirmasi === "BELUM_DIKIRIM").length
      ),
      menunggu: Number(
        apiSummary.menunggu ??
        apiSummary.menunggu_konfirmasi ??
        rows.filter(item => item.status_konfirmasi === "MENUNGGU_KONFIRMASI").length
      ),
      disetujui: Number(
        apiSummary.disetujui ??
        apiSummary.disetujui_customer ??
        rows.filter(item => item.status_konfirmasi === "DISETUJUI_CUSTOMER").length
      ),
      ditolak: Number(
        apiSummary.ditolak ??
        apiSummary.ditolak_customer ??
        rows.filter(item => item.status_konfirmasi === "DITOLAK_CUSTOMER").length
      ),
      otomatis: Number(
        apiSummary.otomatis ??
        apiSummary.disetujui_otomatis ??
        rows.filter(item => item.status_konfirmasi === "DISETUJUI_OTOMATIS").length
      ),
    };
  }, [allData, apiSummaryData, apiTotalData]);

  // GET DATA KONFIRMASI PIUTANG
  // ===================================================

  const getDataKonfirmasiPiutang = async (overrides = {}) => {
    setLoading(true);
    try {
      const payload = {
        page: overrides.page ?? currentPage,
        limit: overrides.limit ?? perPage,
        keyword: (overrides.keyword ?? keyword).trim(),
        status: (overrides.status ?? selectedStatus) === "ALL"
          ? ""
          : (overrides.status ?? selectedStatus),
      };

      const res = await storeSchema.actions.getDataKonfirmasiPiutang(payload);
      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal mengambil data konfirmasi piutang.");
      }

      const responseData = res?.data || {};
      const list = Array.isArray(responseData?.list_data)
        ? responseData.list_data
        : Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(res?.data)
            ? res.data
            : [];

      setAllData(list.map((item, index) => {
        const tanggalKirim =
          item?.tgl_kirim_konfirmasi ??
          item?.tanggal_kirim_konfirmasi ??
          null;

        const statusPengiriman =
          item?.status_pengiriman_konfirmasi ??
          (item?.k_piutang_id || tanggalKirim
            ? "SUDAH_DIKIRIM"
            : "BELUM_DIKIRIM");

        const rawStatus =
          item?.kode_singkat_status ??
          item?.status_konfirmasi ??
          item?.kd_status ??
          item?.status ??
          null;

        const tanggalBatas =
          item?.batas_konfirmasi ??
          (tanggalKirim
            ? new Date(new Date(tanggalKirim).getTime() + 14 * 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10)
            : null);

        return {
          ...item,
          id: item?.piutang_id ?? item?.id ?? item?.k_piutang_id ??
            item?.no_billing ?? item?.no_faktur ?? `${payload.page}-${index}`,
          customer_id: item?.customer_id ?? item?.customer ?? item?.kode_customer ?? "-",
          nama_customer: item?.nama_customer ?? item?.customer_name ?? item?.name ?? "-",
          alamat: item?.alamat ?? item?.alamat_customer ?? "-",
          nama_penagih: item?.nama_penagih ?? item?.petugas ?? item?.nama_petugas ?? "-",
          nominal_piutang: Number(item?.dpp ?? item?.nominal_piutang ?? 0),
          dpp: Number(item?.dpp ?? item?.DPP ?? item?.nominal_piutang ?? 0),
          ppn: Number(item?.ppn ?? item?.PPN ?? 0),
          pph: Number(item?.pph ?? item?.PPH ?? 0),
          total_invoice: Number(
            item?.total_invoice ?? item?.total_tagihan ?? item?.nominal_invoice ??
            (Number(item?.dpp ?? item?.DPP ?? item?.nominal_piutang ?? 0) + Number(item?.ppn ?? item?.PPN ?? 0))
          ),
          status_pengiriman_konfirmasi: statusPengiriman,
          status_konfirmasi: normalizeStatusKonfirmasi(rawStatus),
          tgl_kirim_konfirmasi: tanggalKirim,
          batas_konfirmasi: tanggalBatas,
          sales: item?.nama_sales ?? item?.sales ?? "-",
        };
      }));

      setApiSummaryData(responseData?.summary || {});
      setApiTotalData(Number(responseData?.total_data ?? responseData?.total ?? list.length));
      setApiTotalPage(Number(responseData?.total_halaman ?? responseData?.total_page ?? Math.ceil(Number(responseData?.total_data ?? list.length) / payload.limit)));
    } catch (error) {
      console.error("ERROR GET DATA KONFIRMASI PIUTANG:", error);
      setAllData([]);
      setApiTotalData(0);
      setApiTotalPage(0);
      setApiSummaryData({});
      await swal.error(error?.message || "Gagal mengambil data konfirmasi piutang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataKonfirmasiPiutang();
    // Initial fetch; subsequent fetches are triggered by search/filter/page actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================================================
  // FILTER / PAGINATION SERVER SIDE
  // ===================================================

  const filteredData = allData;
  const totalData = apiTotalData;
  const totalPage = apiTotalPage;
  const paginatedData = allData;

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(1);
    getDataKonfirmasiPiutang({ page: 1, keyword: searchInput });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    getDataKonfirmasiPiutang({ page: 1, status });
  };

  const handlePageChange = ({ selected }) => {
    const nextPage = selected + 1;
    setCurrentPage(nextPage);
    getDataKonfirmasiPiutang({ page: nextPage });
  };

  const handleRefresh = () => {
    setSearchInput(keyword);
    getDataKonfirmasiPiutang();
  };

  // ===================================================
  // STATUS
  // ===================================================

  const renderStatus = (status) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500 whitespace-nowrap">
          <FaInfoCircle />
          Belum Ada Status
        </span>
      );
    }

    const config = statusConfig[status];

    if (!config) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
          <FaInfoCircle />
          {String(status).replaceAll("_", " ")}
        </span>
      );
    }

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}>
        <Icon />
        {config.label}
      </span>
    );
  };

  const renderStatusPengiriman = (status) => {
    const sudahDikirim = status === "SUDAH_DIKIRIM";

    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
        sudahDikirim ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      }`}>
        {sudahDikirim ? <FaCheckCircle /> : <FaClock />}
        {sudahDikirim ? "Sudah Dikirim" : "Belum Dikirim"}
      </span>
    );
  };


  // ===================================================
  // OPEN DETAIL
  // ===================================================

  const openDetail =
    (
      item
    ) => {

      setSelectedData(
        item
      );

      setShowDetail(
        true
      );

    };


  // ===================================================
  // CLOSE DETAIL
  // ===================================================

  const closeDetail =
    () => {

      setSelectedData(
        null
      );

      setShowDetail(
        false
      );

    };


  // ===================================================
  // SELEKSI BILLING MULTI-BILLING PER CUSTOMER
  // ===================================================

  const getRowId = (item) => String(item?.piutang_id ?? item?.id ?? item?.k_piutang_id ?? item?.no_billing ?? item?.no_faktur ?? "");
  const getCustomerKey = (item) => String(item?.customer ?? item?.customer_id ?? item?.kode_customer ?? item?.nama_customer ?? "").trim();
  const selectedBillings = allData.filter((item) => selectedBillingIds.includes(getRowId(item)));
  const selectedCustomerName = selectedBillings[0]?.nama_customer || "";

  const toggleBillingSelection = (item) => {
    if (item?.status_pengiriman_konfirmasi !== "BELUM_DIKIRIM") return;
    const rowId = getRowId(item);
    const exists = selectedBillingIds.includes(rowId);

    if (exists) {
      setSelectedBillingIds((prev) => prev.filter((id) => id !== rowId));
      return;
    }

    const currentSelected = allData.filter((row) => selectedBillingIds.includes(getRowId(row)));
    if (currentSelected.length && getCustomerKey(currentSelected[0]) !== getCustomerKey(item)) {
      swal.error("Pilih billing dari customer yang sama. Untuk customer berbeda, proses konfirmasi secara terpisah.");
      return;
    }

    setSelectedBillingIds((prev) => [...prev, rowId]);
  };

  const selectAllBillingForCustomer = () => {
    if (!selectedBillings.length) return;
    const customerKey = getCustomerKey(selectedBillings[0]);
    const customerRows = allData.filter((item) =>
      item.status_pengiriman_konfirmasi === "BELUM_DIKIRIM" && getCustomerKey(item) === customerKey
    );
    setSelectedBillingIds(customerRows.map(getRowId));
  };

  const clearBillingSelection = () => setSelectedBillingIds([]);

  const openBulkSendConfirmation = () => {
    const rows = allData.filter((item) => selectedBillingIds.includes(getRowId(item)));
    if (!rows.length) {
      swal.error("Checklist minimal satu billing yang belum dikirim.");
      return;
    }
    const customerKeys = [...new Set(rows.map(getCustomerKey))];
    if (customerKeys.length !== 1) {
      swal.error("Billing yang dipilih harus berasal dari satu customer.");
      return;
    }
    const first = rows[0];
    setSendItems(rows);
    setSendData(first);
    setEmailRecipient(String(first?.email_customer || ""));
    setSendViaWhatsApp(false);
    setSendViaEmail(false);
    setSendResult(null);
    setShowSendConfirmation(true);
  };

  const customerOptions = bulkCustomerOptions;

  const openCustomerBillingModal = async () => {
    setSelectedBulkCustomer("");
    setCustomerBillingRows([]);
    setSelectedCustomerBillingIds([]);
    setCustomerBillingSearch("");
    setShowCustomerBillingModal(true);
    setLoadingCustomerBillings(true);
    try {
      // Ambil daftar customer dari API, bukan hanya baris pada halaman tabel saat ini.
      const res = await storeSchema.actions.getDataKonfirmasiPiutang({
        page: 1,
        limit: 1000,
        keyword: "",
        status: "",
      });
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil daftar customer.");
      const data = res?.data || {};
      const rows = Array.isArray(data?.list_data) ? data.list_data
        : Array.isArray(data?.data) ? data.data
        : Array.isArray(res?.data) ? res.data : [];
      const map = new Map();
      rows.forEach((item) => {
        const key = String(item?.customer ?? item?.customer_id ?? item?.kode_customer ?? item?.nama_customer ?? item?.customer_name ?? "").trim();
        if (!key || key === "-") return;
        const name = item?.nama_customer ?? item?.customer_name ?? item?.name ?? key;
        if (!map.has(key)) map.set(key, { value: key, label: `${name} (${key})` });
      });
      setBulkCustomerOptions(Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "id")));
    } catch (error) {
      console.error("ERROR LOAD CUSTOMER OPTIONS:", error);
      await swal.error(error?.message || "Gagal mengambil daftar customer.");
    } finally {
      setLoadingCustomerBillings(false);
    }
  };

  const loadBillingsForCustomer = async (customerKey) => {
    setSelectedBulkCustomer(customerKey);
    setSelectedCustomerBillingIds([]);
    setCustomerBillingRows([]);
    if (!customerKey) return;

    setLoadingCustomerBillings(true);
    try {
      // Ambil ulang dari API dengan keyword customer; limit besar agar billing customer
      // tidak terbatas pada halaman tabel utama.
      const res = await storeSchema.actions.getDataKonfirmasiPiutang({
        page: 1,
        limit: 1000,
        keyword: customerKey,
        status: "",
      });
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil billing customer.");
      const data = res?.data || {};
      const rows = Array.isArray(data?.list_data) ? data.list_data
        : Array.isArray(data?.data) ? data.data
        : Array.isArray(res?.data) ? res.data : [];

      const normalized = rows.map((item, index) => {
        const tanggalKirim = item?.tgl_kirim_konfirmasi ?? item?.tanggal_kirim_konfirmasi ?? null;
        const statusPengiriman = item?.status_pengiriman_konfirmasi ?? (item?.k_piutang_id || tanggalKirim ? "SUDAH_DIKIRIM" : "BELUM_DIKIRIM");
        return {
          ...item,
          id: item?.piutang_id ?? item?.id ?? item?.k_piutang_id ?? item?.no_billing ?? item?.no_faktur ?? `customer-${index}`,
          customer_id: item?.customer_id ?? item?.customer ?? item?.kode_customer ?? "-",
          nama_customer: item?.nama_customer ?? item?.customer_name ?? item?.name ?? "-",
          dpp: Number(item?.dpp ?? item?.DPP ?? item?.nominal_piutang ?? 0),
          ppn: Number(item?.ppn ?? item?.PPN ?? 0),
          pph: Number(item?.pph ?? item?.PPH ?? 0),
          total_invoice: Number(item?.total_invoice ?? item?.total_tagihan ?? item?.nominal_invoice ?? (Number(item?.dpp ?? item?.DPP ?? item?.nominal_piutang ?? 0) + Number(item?.ppn ?? item?.PPN ?? 0))),
          status_pengiriman_konfirmasi: statusPengiriman,
        };
      });

      // Hanya billing customer yang dipilih dan belum pernah dikirim konfirmasinya.
      const filtered = normalized.filter((item) =>
        getCustomerKey(item) === String(customerKey) && item.status_pengiriman_konfirmasi === "BELUM_DIKIRIM"
      );
      setCustomerBillingRows(filtered);
      if (!filtered.length) {
        await swal.error("Tidak ditemukan billing yang belum dikirim konfirmasinya untuk customer ini.");
      }
    } catch (error) {
      console.error("ERROR LOAD BILLING CUSTOMER:", error);
      await swal.error(error?.message || "Gagal mengambil billing customer.");
    } finally {
      setLoadingCustomerBillings(false);
    }
  };

  const toggleCustomerBilling = (item) => {
    const id = getRowId(item);
    setSelectedCustomerBillingIds((prev) => prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]);
  };

  const selectAllCustomerBillings = () => {
    const rows = customerBillingRows.filter((item) => {
      const search = customerBillingSearch.trim().toLowerCase();
      return !search || `${item.no_billing || ""} ${item.no_faktur || ""}`.toLowerCase().includes(search);
    });
    setSelectedCustomerBillingIds(rows.map(getRowId));
  };

  const submitCustomerBillingSelection = () => {
    const rows = customerBillingRows.filter((item) => selectedCustomerBillingIds.includes(getRowId(item)));
    if (!rows.length) {
      swal.error("Checklist minimal satu billing terlebih dahulu.");
      return;
    }
    const first = rows[0];
    setSendItems(rows);
    setSendData(first);
    setEmailRecipient(String(first?.email_customer || ""));
    setSendViaWhatsApp(false);
    setSendViaEmail(false);
    setSendResult(null);
    setShowCustomerBillingModal(false);
    setShowSendConfirmation(true);
  };

  // ===================================================
  // OPEN SEND CONFIRMATION
  // ===================================================

  const openSendConfirmation =
    (
      item
    ) => {

      setSendData(
        item
      );
      setSendItems([item]);
      setEmailRecipient(String(item?.email_customer || ""));

      // Pengiriman WhatsApp dinonaktifkan sementara.
      setSendViaWhatsApp(false);

      // Email harus dicentang manual setiap kali modal dibuka.
      setSendViaEmail(false);

      setSendResult(
        null
      );

      setShowSendConfirmation(
        true
      );

    };


  // ===================================================
  // CLOSE SEND CONFIRMATION
  // ===================================================

  const closeSendConfirmation =
    () => {

      if (
        isSendingConfirmation
      ) {

        return;

      }

      setShowSendConfirmation(
        false
      );

      setSendData(
        null
      );
      setSendItems([]);
      setEmailRecipient("");

      setSendResult(
        null
      );

    };


  // ===================================================
  // SEND WHATSAPP
  // ===================================================

  const sendConfirmationWhatsApp =
    async (
      item
    ) => {

      console.log(
        "Kirim konfirmasi WhatsApp:",
        item
      );


      /*
       * =================================================
       * GANTI BAGIAN INI DENGAN API BACKEND ANDA
       * =================================================
       *
       * Contoh:
       *
       * const response = await fetch(
       *   "/api/piutang/kirim-konfirmasi-whatsapp",
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     body: JSON.stringify({
       *       id: item.id,
       *       no_faktur: item.no_faktur,
       *       no_billing: item.no_billing,
       *       customer_id: item.customer_id,
       *       nama_customer: item.nama_customer,
       *       nomor_whatsapp: item.no_wa_customer,
       *       nominal_tagihan: item.nominal_tagihan,
       *     }),
       *   }
       * );
       *
       * if (!response.ok) {
       *   throw new Error(
       *     "Gagal mengirim WhatsApp"
       *   );
       * }
       *
       * return await response.json();
       */


      // SIMULASI API
      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );


      return {
        success:
          true,

        message:
          "Konfirmasi berhasil dikirim melalui WhatsApp.",
      };

    };


  // ===================================================
  // SEND EMAIL
  // ===================================================

  const sendConfirmationEmail =
    async (
      item
    ) => {

      console.log(
        "Kirim konfirmasi Email:",
        item
      );


      /*
       * =================================================
       * GANTI BAGIAN INI DENGAN API BACKEND ANDA
       * =================================================
       *
       * Contoh:
       *
       * const response = await fetch(
       *   "/api/piutang/kirim-konfirmasi-email",
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     body: JSON.stringify({
       *       id: item.id,
       *       no_faktur: item.no_faktur,
       *       no_billing: item.no_billing,
       *       customer_id: item.customer_id,
       *       nama_customer: item.nama_customer,
       *       email: item.email_customer,
       *       nominal_tagihan: item.nominal_tagihan,
       *     }),
       *   }
       * );
       *
       * if (!response.ok) {
       *   throw new Error(
       *     "Gagal mengirim Email"
       *   );
       * }
       *
       * return await response.json();
       */


      // SIMULASI API
      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );


      return {
        success:
          true,

        message:
          "Konfirmasi berhasil dikirim melalui Email.",
      };

    };


  // ===================================================
  // SEND CONFIRMATION
  // ===================================================

  const handleSendConfirmation =
    (
      item
    ) => {

      console.log(
        "Kirim konfirmasi piutang:",
        item
      );


      openSendConfirmation(
        item
      );

    };


  // ===================================================
  // PROCESS SEND CONFIRMATION - SINGLE API CALL
  // ===================================================

  const processSendConfirmation = async () => {
    if (!sendData || !sendItems.length || isSendingConfirmation) return;

    if (!sendViaEmail) {
      setSendResult({ type: "error", message: "Centang pilihan Email terlebih dahulu sebelum mengirim konfirmasi." });
      return;
    }

    const recipientEmail = String(emailRecipient || "").trim();
    if (!recipientEmail) {
      setSendResult({ type: "error", message: "Email penerima wajib diisi." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setSendResult({ type: "error", message: "Format email penerima tidak valid." });
      return;
    }

    const customerKeys = [...new Set(sendItems.map((item) => getCustomerKey(item)))];
    if (customerKeys.length !== 1) {
      setSendResult({ type: "error", message: "Billing yang dipilih harus berasal dari satu customer." });
      return;
    }

    const noBilling = [...new Set(
      sendItems.map((item) => String(item?.no_billing || "").trim()).filter(Boolean)
    )];
    if (!noBilling.length) {
      setSendResult({ type: "error", message: "Nomor billing tidak ditemukan pada data yang dipilih." });
      return;
    }

    const piutangIds = [...new Set(
      sendItems
        .map((item) => item?.piutang_id ?? item?.id)
        .filter((id) => id !== null && id !== undefined && id !== "")
        .map(String)
    )];
    if (piutangIds.length !== noBilling.length) {
      setSendResult({ type: "error", message: "Jumlah ID piutang tidak sesuai dengan jumlah billing yang dipilih." });
      return;
    }

    const payload = {
      piutang_ids: piutangIds,
      no_billing: noBilling,
      customer: sendData?.customer ?? sendData?.customer_id ?? sendData?.kode_customer ?? "",
      nama_customer: sendData?.nama_customer ?? "",
      media_wa: false,
      media_email: true,
      no_wa_customer: sendData?.no_wa_customer ?? "",
      email_customer: recipientEmail,
    };

    setIsSendingConfirmation(true);
    setSendResult(null);

    try {
      console.log("Payload konfirmasi piutang (satu request):", payload);

      // Satu kali hit API untuk seluruh billing yang dipilih.
      const res = await storeSchema.actions.konfirmasiPiutang(payload);
      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal mengirim konfirmasi piutang.");
      }

      await getDataKonfirmasiPiutang();
      setSelectedBillingIds([]);
      setSelectedCustomerBillingIds([]);
      setSendResult({
        type: "success",
        message: `Konfirmasi berhasil dikirim dalam satu email untuk ${noBilling.length} billing customer ${sendData?.nama_customer || ""}.`,
      });
      setShowSendConfirmation(false);
      setSendData(null);
      setSendItems([]);
      setEmailRecipient("");
      await swal.success(`Konfirmasi berhasil dikirim untuk ${noBilling.length} billing dalam satu email.`);
    } catch (error) {
      console.error("ERROR KONFIRMASI PIUTANG:", error);
      setSendResult({ type: "error", message: error?.message || "Konfirmasi piutang gagal diproses." });
      await swal.error(error?.message || "Konfirmasi piutang gagal diproses.");
    } finally {
      setIsSendingConfirmation(false);
    }
  };


  // ===================================================
  // HEADER TABLE
  // ===================================================

  const headerTable = [

    {
      label: "Pilih Billing",
      icon: <FaCheckCircle />,
    },

    {
      label:
        "Aksi",

      icon:
        <FaEllipsisV />,
    },

    {
      label:
        "Pengiriman Konfirmasi",

      icon:
        <FaPaperPlane />,
    },

    {
      label:
        "Status Konfirmasi",

      icon:
        <FaInfoCircle />,
    },

    {
      label:
        "Tanggal Kirim",

      icon:
        <FaCalendarAlt />,
    },

    {
      label:
        "No",

      icon:
        <FaHashtag />,
    },

    {
      label:
        "No. Billing",

      icon:
        <FaFileAlt />,
    },

    {
      label:
        "Customer",

      icon:
        <FaBuilding />,
    },

    {
      label:
        "Penagih",

      icon:
        <FaUser />,
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
      label:
        "Posting Date",

      icon:
        <FaCalendarAlt />,
    },

    {
      label:
        "Batas Konfirmasi",

      icon:
        <FaClock />,
    },

    {
      label:
        "Sales",

      icon:
        <FaUser />,
    }

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
              Cari faktur / billing / customer / penagih...
            "
            className="
              grow
            "
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button type="button" className="btn btn-ghost btn-xs" onClick={handleSearch} aria-label="Cari">
            <IoSearch className="text-lg" />
          </button>

        </div>


        {/* STATUS */}

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
              text-gray-500
            "
          >
            Status Konfirmasi:
          </span>


          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[220px]
            "
            value={
              selectedStatus
            }
            onChange={e => handleStatusChange(e.target.value)}
          >

            <option value="ALL">
              Semua Status Konfirmasi
            </option>

            <option value="MENUNGGU_KONFIRMASI">
              Menunggu Konfirmasi
            </option>

            <option value="DISETUJUI_CUSTOMER">
              Disetujui Customer
            </option>

            <option value="DITOLAK_CUSTOMER">
              Ditolak Customer
            </option>

            <option value="DISETUJUI_OTOMATIS">
              Disetujui Otomatis
            </option>

          </select>

          <button
            type="button"
            onClick={openCustomerBillingModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 whitespace-nowrap"
          >
            <FaUsers /> Konfirmasi per Customer
          </button>

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
          2xl:grid-cols-6
          gap-4
        "
      >

        {/* TOTAL */}

        <div
          className="
            rounded-2xl
            bg-blue-50
            p-4
            border
            border-blue-100
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
                Total Konfirmasi
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-blue-900
                "
              >
                {
                  summaryData.total
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

              <FaFileInvoiceDollar
                className="
                  text-blue-600
                "
              />

            </div>

          </div>

        </div>


        {/* BELUM DIKIRIM */}

        <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-rose-700">Belum Dikirim</p>
              <p className="text-2xl font-bold text-rose-900">
                {summaryData.belum_dikirim}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center">
              <FaPaperPlane className="text-rose-600" />
            </div>
          </div>
        </div>

        {/* WAITING */}

        <div
          className="
            rounded-2xl
            bg-amber-50
            p-4
            border
            border-amber-100
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
                  text-amber-700
                "
              >
                Menunggu Konfirmasi
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-amber-900
                "
              >
                {
                  summaryData.menunggu
                }
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
                className="
                  text-amber-600
                "
              />

            </div>

          </div>

        </div>


        {/* APPROVED */}

        <div
          className="
            rounded-2xl
            bg-green-50
            p-4
            border
            border-green-100
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
                Disetujui
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-green-900
                "
              >
                {
                  summaryData.disetujui
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


        {/* REJECTED */}

        <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-red-700">Ditolak Customer</p>
              <p className="text-2xl font-bold text-red-900">
                {summaryData.ditolak}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
              <FaTimesCircle className="text-red-600" />
            </div>
          </div>
        </div>

        {/* AUTO */}

        <div
          className="
            rounded-2xl
            bg-indigo-50
            p-4
            border
            border-indigo-100
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
                  text-indigo-700
                "
              >
                Otomatis 14 Hari
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-indigo-900
                "
              >
                {
                  summaryData.otomatis
                }
              </p>

            </div>


            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-indigo-100
                flex
                items-center
                justify-center
              "
            >

              <FaClock
                className="
                  text-indigo-600
                "
              />

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* INFO */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-start
          gap-3
          bg-blue-50
          border
          border-blue-200
          rounded-xl
          px-4
          py-3
        "
      >

        <FaInfoCircle
          className="
            text-blue-500
            mt-0.5
          "
        />


        <div>

          <p
            className="
              text-sm
              font-semibold
              text-blue-900
            "
          >
            Ketentuan Konfirmasi Piutang
          </p>


          <p
            className="
              text-xs
              text-blue-700
              mt-1
            "
          >
            Customer menerima permintaan konfirmasi melalui
            WhatsApp dan email. Apabila tidak memberikan
            tanggapan dalam waktu 14 hari kalender sejak
            konfirmasi dikirim, faktur akan dianggap telah
            disetujui sebagai piutang.
          </p>

        </div>

      </div>


      {/* PILIH BILLING INDIVIDUAL DI TABEL UTAMA */}
      <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-indigo-900">
          <p className="font-bold">Pilih billing dari tabel</p>
          <p className="mt-1 text-xs text-indigo-700">Untuk pilihan di tabel, billing harus berasal dari customer yang sama. {selectedBillingIds.length > 0 ? `${selectedBillingIds.length} billing dipilih${selectedCustomerName ? ` untuk ${selectedCustomerName}` : ""}.` : "Pilih billing yang belum dikirim konfirmasinya."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={clearBillingSelection} disabled={!selectedBillingIds.length || isSendingConfirmation} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 disabled:opacity-40">Hapus pilihan</button>
          <button type="button" onClick={openBulkSendConfirmation} disabled={!selectedBillingIds.length || isSendingConfirmation} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-40"><FaPaperPlane /> Kirim {selectedBillingIds.length || ""} Billing Terpilih</button>
        </div>
      </div>

      {/* ================================================= */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
          <FaSpinner className="animate-spin" /> Memuat data konfirmasi piutang...
        </div>
      )}

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
                border-collapse
                border-spacing-0
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
                        i
                      ) => (

                        <th
                          key={
                            i
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

                            <span>
                              {
                                h.icon
                              }
                            </span>

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
                  paginatedData.length ===
                    0
                    ? (

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

                          <FaFileInvoiceDollar
                            className="
                              text-4xl
                              text-gray-300
                              mx-auto
                              mb-3
                            "
                          />

                          Tidak ada data piutang yang sesuai dengan filter

                        </td>

                      </tr>

                    )
                    : (

                      paginatedData.map(
                        (
                          v,
                          i
                        ) => (

                          <tr
                            key={
                              v.id
                            }
                            className="
                              hover:bg-blue-50
                              transition
                              duration-200
                              border-b
                            "
                          >

                            {/* PILIH BILLING INDIVIDUAL */}
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm"
                                checked={selectedBillingIds.includes(getRowId(v))}
                                disabled={v.status_pengiriman_konfirmasi !== "BELUM_DIKIRIM" || (selectedBillings.length > 0 && !selectedBillingIds.includes(getRowId(v)) && getCustomerKey(v) !== getCustomerKey(selectedBillings[0]))}
                                onChange={() => toggleBillingSelection(v)}
                                aria-label={`Pilih billing ${v.no_billing || v.no_faktur || ""}`}
                              />
                            </td>

                            {/* AKSI */}

                            <td
                              className="
                                px-4
                                py-2
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

                                {
                                  v.status_pengiriman_konfirmasi ===
                                    "BELUM_DIKIRIM"
                                    ? (

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSendConfirmation(
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

                                        <FaWhatsapp />

                                        Kirim Konfirmasi

                                      </button>

                                    )
                                    : (

                                      <button
                                        type="button"
                                        onClick={() =>
                                          openDetail(
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
                                          border
                                          border-gray-200
                                          bg-white
                                          text-gray-600
                                          text-xs
                                          font-semibold
                                          hover:bg-gray-50
                                        "
                                      >

                                        <FaEye />

                                        Detail

                                      </button>

                                    )
                                }

                              </div>

                            </td>

                            {/* STATUS PENGIRIMAN */}

                            <td className="px-4 py-2">
                              {renderStatusPengiriman(v.status_pengiriman_konfirmasi)}
                            </td>

                            {/* STATUS KONFIRMASI */}

                            <td className="px-4 py-2">
                              {renderStatus(v.status_konfirmasi)}
                            </td>

                            {/* TANGGAL KIRIM KONFIRMASI */}

                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCalendarAlt className="text-primary" />
                                {formatDate(v.tgl_kirim_konfirmasi)}
                              </div>
                            </td>

                            {/* NO */}

                            <td
                              className="
                                px-4
                                py-2
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
                                i +
                                1
                              }

                            </td>


                            {/* NO BILLING */}

                            <td
                              className="
                                px-4
                                py-2
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
                                    bg-orange-50
                                    flex
                                    items-center
                                    justify-center
                                  "
                                >

                                  <FaFileAlt
                                    className="
                                      text-orange-500
                                    "
                                  />

                                </div>


                                <div>

                                  <span
                                    className="
                                      font-semibold
                                      text-gray-700
                                    "
                                  >
                                    {
                                      v.no_billing ||
                                      "-"
                                    }
                                  </span>


                                  <p
                                    className="
                                      text-xs
                                      text-gray-400
                                    "
                                  >
                                    Nomor Billing
                                  </p>

                                </div>

                              </div>

                            </td>


                            {/* CUSTOMER */}

                            <td
                              className="
                                px-4
                                py-2
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-3
                                  min-w-[250px]
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
                                    {
                                      v.nama_customer
                                    }
                                  </p>


                                  <p
                                    className="
                                      text-xs
                                      text-gray-400
                                    "
                                  >
                                    {
                                      v.alamat
                                    }
                                  </p>

                                </div>

                              </div>

                            </td>


                            {/* PENAGIH */}

                            <td
                              className="
                                px-4
                                py-2
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
                                  {
                                    v.nama_penagih
                                  }
                                </span>

                              </div>

                            </td>


                            {/* DPP */}
                            <td className="px-4 py-2 whitespace-nowrap font-semibold text-gray-700">
                              {formatRupiah(v.dpp)}
                            </td>

                            {/* PPN */}
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                              {formatRupiah(v.ppn)}
                            </td>

                            {/* PPH */}
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                              {formatRupiah(v.pph)}
                            </td>

                            {/* TOTAL INVOICE */}
                            <td className="px-4 py-2 whitespace-nowrap font-bold text-primary">
                              {formatRupiah(v.total_invoice)}
                            </td>


                            {/* POSTING DATE */}

                            <td
                              className="
                                px-4
                                py-2
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

                                {
                                  formatDate(
                                    v.posting_date
                                  )
                                }

                              </div>

                            </td>


                            {/* BATAS KONFIRMASI */}

                            <td
                              className="
                                px-4
                                py-2
                                whitespace-nowrap
                              "
                            >

                              <div>

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                  "
                                >

                                  <FaClock
                                    className="
                                      text-amber-500
                                    "
                                  />

                                  {
                                    formatDate(
                                      v.batas_konfirmasi
                                    )
                                  }

                                </div>


                                <p
                                  className="
                                    text-[11px]
                                    text-gray-400
                                    mt-1
                                  "
                                >
                                  14 hari sejak pengiriman
                                </p>

                              </div>

                            </td>


                            {/* SALES */}

                            <td
                              className="
                                px-4
                                py-2
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
                                    bg-blue-50
                                    flex
                                    items-center
                                    justify-center
                                  "
                                >

                                  <FaUser
                                    className="
                                      text-blue-500
                                    "
                                  />

                                </div>


                                <span
                                  className="
                                    text-sm
                                    text-gray-700
                                    font-medium
                                  "
                                >
                                  {
                                    (v.nama_sales ?? v.sales ?? "-")
                                  }
                                </span>

                              </div>

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
          {/* FOOTER TABLE */}
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
                    onChange={e => {
                      const limit = parseInt(e.target.value, 10);
                      setPerPage(limit);
                      setCurrentPage(1);
                      getDataKonfirmasiPiutang({ page: 1, limit });
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
                    onPageChange={handlePageChange}
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
      {/* DETAIL MODAL */}
      {/* ================================================= */}

      {
        showDetail &&
        selectedData && (

          <div
            className="
              fixed
              inset-0
              z-[500]
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
                max-w-4xl
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

                      <FaFileInvoiceDollar />

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >
                        Detail Konfirmasi Piutang
                      </h3>


                      <p
                        className="
                          text-xs
                          text-blue-100
                        "
                      >
                        {
                          selectedData.no_faktur
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

                    <FaTimesCircle />

                  </button>

                </div>

              </div>


              {/* BODY */}

              <div
                className="
                  p-6
                  flex
                  flex-col
                  gap-5
                "
              >

                {/* STATUS */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    flex-wrap
                    gap-3
                  "
                >

                  <div className="flex flex-wrap items-center gap-2">
                    {renderStatusPengiriman(selectedData.status_pengiriman_konfirmasi)}
                    {renderStatus(selectedData.status_konfirmasi)}
                  </div>

                  <div className="text-sm text-gray-500">
                    Tanggal kirim konfirmasi:
                    {" "}
                    <span className="font-semibold text-gray-700">
                      {formatDate(selectedData.tgl_kirim_konfirmasi)}
                    </span>
                  </div>

                  <div
                    className="
                      text-sm
                      text-gray-500
                    "
                  >

                    Batas konfirmasi:
                    {" "}

                    <span
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      {
                        formatDate(
                          selectedData.batas_konfirmasi
                        )
                      }
                    </span>

                  </div>

                </div>


                {/* DETAIL GRID */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  {/* NO BILLING */}

                  <div
                    className="
                      bg-orange-50
                      border
                      border-orange-100
                      rounded-xl
                      p-4
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
                          rounded-lg
                          bg-white
                          text-orange-500
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <FaFileAlt />

                      </div>


                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mb-1
                          "
                        >
                          No. Billing
                        </p>


                        <p
                          className="
                            font-bold
                            text-gray-700
                          "
                        >
                          {
                            selectedData.no_billing ||
                            "-"
                          }
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* CUSTOMER */}

                  <div
                    className="
                      bg-gray-50
                      border
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      Customer
                    </p>


                    <p
                      className="
                        font-bold
                        text-gray-700
                      "
                    >
                      {
                        selectedData.nama_customer
                      }
                    </p>


                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      {
                        selectedData.alamat
                      }
                    </p>

                  </div>


                  {/* RINCIAN NOMINAL INVOICE */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "DPP", value: selectedData.dpp },
                      { label: "PPN", value: selectedData.ppn },
                      { label: "PPh", value: selectedData.pph },
                      { label: "Total Invoice", value: selectedData.total_invoice, total: true },
                    ].map((amount) => (
                      <div key={amount.label} className={`bg-gray-50 border rounded-xl p-4 ${amount.total ? "border-primary/30" : ""}`}>
                        <p className="text-xs text-gray-400 mb-1">{amount.label}</p>
                        <p className={`text-lg font-bold ${amount.total ? "text-primary" : "text-gray-700"}`}>
                          {formatRupiah(amount.value)}
                        </p>
                      </div>
                    ))}
                  </div>


                  {/* PENAGIH */}

                  <div
                    className="
                      bg-gray-50
                      border
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      Penagih
                    </p>


                    <p
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      {
                        selectedData.nama_penagih
                      }
                    </p>

                  </div>


                  {/* SALES */}

                  <div
                    className="
                      bg-gray-50
                      border
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
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


                  {/* POSTING DATE */}

                  <div
                    className="
                      bg-gray-50
                      border
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      Posting Date
                    </p>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <FaCalendarAlt
                        className="
                          text-primary
                        "
                      />

                      <p
                        className="
                          font-semibold
                          text-gray-700
                        "
                      >
                        {
                          formatDate(
                            selectedData.posting_date
                          )
                        }
                      </p>

                    </div>

                  </div>


                  {/* BATAS KONFIRMASI */}

                  <div
                    className="
                      bg-amber-50
                      border
                      border-amber-100
                      rounded-xl
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      Batas Konfirmasi
                    </p>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <FaClock
                        className="
                          text-amber-500
                        "
                      />

                      <p
                        className="
                          font-semibold
                          text-gray-700
                        "
                      >
                        {
                          formatDate(
                            selectedData.batas_konfirmasi
                          )
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* MEDIA KONFIRMASI */}

                <div
                  className="
                    bg-blue-50
                    border
                    border-blue-100
                    rounded-xl
                    p-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-blue-900
                      mb-3
                    "
                  >
                    Media Konfirmasi
                  </p>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-3
                    "
                  >

                    {
                      selectedData.media_wa &&
                      (

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            bg-white
                            rounded-full
                            border
                            border-green-200
                            text-green-700
                            text-sm
                            font-semibold
                          "
                        >

                          <FaWhatsapp />

                          WhatsApp

                        </span>

                      )
                    }


                    {
                      selectedData.media_email &&
                      (

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            bg-white
                            rounded-full
                            border
                            border-blue-200
                            text-blue-700
                            text-sm
                            font-semibold
                          "
                        >

                          <FaEnvelope />

                          Email

                        </span>

                      )
                    }

                  </div>

                </div>


                {/* INFO 14 HARI */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    bg-amber-50
                    border
                    border-amber-200
                    rounded-xl
                    p-4
                  "
                >

                  <FaClock
                    className="
                      text-amber-500
                      mt-0.5
                    "
                  />


                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-amber-800
                      "
                    >
                      Ketentuan 14 Hari
                    </p>


                    <p
                      className="
                        text-xs
                        text-amber-700
                        mt-1
                      "
                    >
                      Apabila customer tidak memberikan
                      tanggapan sampai dengan{" "}
                      <b>
                        {
                          formatDate(
                            selectedData.batas_konfirmasi
                          )
                        }
                      </b>
                      , sistem dapat menetapkan faktur
                      sebagai piutang yang telah disetujui
                      secara otomatis.
                    </p>

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

                {
                  selectedData.status_pengiriman_konfirmasi ===
                  "BELUM_DIKIRIM" &&
                  (

                    <button
                      type="button"
                      onClick={() =>
                        handleSendConfirmation(
                          selectedData
                        )
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
                        inline-flex
                        items-center
                        gap-2
                      "
                    >

                      <FaPaperPlane />

                      Kirim Ulang Konfirmasi

                    </button>

                  )
                }


                <button
                  type="button"
                  onClick={
                    closeDetail
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

                  Tutup

                </button>

              </div>

            </div>

          </div>

        )

      }


      {/* ================================================= */}
      {/* MODAL PILIH CUSTOMER & BILLING */}
      {showCustomerBillingModal && (
        <div className="fixed inset-0 z-[490] flex items-center justify-center bg-black/50 p-4" onClick={() => !loadingCustomerBillings && setShowCustomerBillingModal(false)}>
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Konfirmasi Piutang per Customer</h3>
                <p className="mt-1 text-xs text-gray-500">Pilih customer, lalu checklist billing yang belum dikirim konfirmasinya.</p>
              </div>
              <button type="button" className="rounded-full p-2 text-gray-500 hover:bg-gray-100" disabled={loadingCustomerBillings} onClick={() => setShowCustomerBillingModal(false)}><FaTimes /></button>
            </div>

            <div className="space-y-4 overflow-y-auto p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Customer</label>
                <select className="select select-bordered w-full bg-white" value={selectedBulkCustomer} disabled={loadingCustomerBillings} onChange={(e) => loadBillingsForCustomer(e.target.value)}>
                  <option value="">-- Pilih customer --</option>
                  {customerOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <p className="mt-1 text-xs text-gray-500">Pilihan customer mengikuti data yang tersedia pada tabel. Jika customer tidak muncul, cari customer tersebut pada tabel utama terlebih dahulu.</p>
              </div>

              {selectedBulkCustomer && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-blue-900">Billing belum dikirim</p>
                      <p className="mt-1 text-xs text-blue-700">{selectedCustomerBillingIds.length} dari {customerBillingRows.length} billing dipilih</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={selectAllCustomerBillings} disabled={loadingCustomerBillings || !customerBillingRows.length} className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 disabled:opacity-40">Pilih semua</button>
                      <button type="button" onClick={() => setSelectedCustomerBillingIds([])} disabled={!selectedCustomerBillingIds.length} className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 disabled:opacity-40">Hapus pilihan</button>
                    </div>
                  </div>
                  <input type="text" value={customerBillingSearch} onChange={(e) => setCustomerBillingSearch(e.target.value)} placeholder="Cari nomor billing / faktur..." className="input input-sm input-bordered mt-3 w-full bg-white" />
                </div>
              )}

              {loadingCustomerBillings ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500"><FaSpinner className="animate-spin" /> Mengambil billing customer dari API...</div>
              ) : selectedBulkCustomer ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="table table-sm w-full">
                    <thead className="bg-slate-50 text-gray-600"><tr><th className="w-12">Pilih</th><th>No. Billing</th><th>No. Faktur</th><th className="text-right">DPP</th><th className="text-right">PPN</th><th className="text-right">Total Invoice</th></tr></thead>
                    <tbody>
                      {customerBillingRows.filter((item) => { const q = customerBillingSearch.trim().toLowerCase(); return !q || `${item.no_billing || ""} ${item.no_faktur || ""}`.toLowerCase().includes(q); }).map((item) => (
                        <tr key={getRowId(item)} className="hover:bg-blue-50">
                          <td><input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={selectedCustomerBillingIds.includes(getRowId(item))} onChange={() => toggleCustomerBilling(item)} /></td>
                          <td className="font-semibold">{item.no_billing || "-"}</td>
                          <td>{item.no_faktur || "-"}</td>
                          <td className="text-right whitespace-nowrap">{formatRupiah(item.dpp)}</td>
                          <td className="text-right whitespace-nowrap">{formatRupiah(item.ppn)}</td>
                          <td className="text-right whitespace-nowrap font-bold text-primary">{formatRupiah(item.total_invoice)}</td>
                        </tr>
                      ))}
                      {!customerBillingRows.filter((item) => { const q = customerBillingSearch.trim().toLowerCase(); return !q || `${item.no_billing || ""} ${item.no_faktur || ""}`.toLowerCase().includes(q); }).length && (
                        <tr><td colSpan={6} className="py-10 text-center text-sm text-gray-500">Tidak ada billing yang cocok atau semua billing sudah dikirim konfirmasinya.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">Pilih customer untuk menampilkan daftar billing yang belum dikirim.</div>
              )}
            </div>

            <div className="flex justify-between gap-3 border-t bg-gray-50 px-6 py-4">
              <p className="self-center text-xs text-gray-500">Pengiriman dilakukan melalui API untuk setiap billing yang dipilih.</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCustomerBillingModal(false)} disabled={loadingCustomerBillings} className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600">Batal</button>
                <button type="button" onClick={submitCustomerBillingSelection} disabled={!selectedCustomerBillingIds.length || loadingCustomerBillings} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"><FaPaperPlane /> Lanjutkan ({selectedCustomerBillingIds.length})</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* SEND CONFIRMATION MODAL */}
      {/* ================================================= */}

      {
        showSendConfirmation &&
        sendData && (

          <div
            className="
    fixed
    inset-0
    z-[500]
    bg-black/50
    flex
    items-center
    justify-center
    p-4
    overflow-hidden
  "
            onClick={closeSendConfirmation}
          >

            <div
              className="
      bg-white
      rounded-2xl
      shadow-2xl
      w-full
      max-w-lg
      max-h-[calc(100vh-2rem)]
      flex
      flex-col
      overflow-hidden
    "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* ========================================= */}
              {/* HEADER */}
              {/* ========================================= */}

              <div
                className="
        bg-primary
        px-6
        py-5
        text-white
        shrink-0
      "
              >

                <div
                  className="
          flex
          items-center
          justify-between
          gap-3
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

                      <FaPaperPlane />

                    </div>


                    <div>

                      <h3
                        className="
                text-lg
                font-bold
              "
                      >
                        Kirim Konfirmasi Piutang
                      </h3>


                      <p
                        className="
                text-xs
                text-blue-100
                mt-0.5
              "
                      >
                        Pilih media pengiriman ke customer
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    disabled={
                      isSendingConfirmation
                    }
                    onClick={
                      closeSendConfirmation
                    }
                    className="
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            hover:bg-white/10
            disabled:opacity-50
            shrink-0
          "
                  >

                    <FaTimes />

                  </button>

                </div>

              </div>


              {/* ========================================= */}
              {/* BODY - SCROLL */}
              {/* ========================================= */}

              <div
                className="
        flex-1
        min-h-0
        overflow-y-auto
        p-6
        flex
        flex-col
        gap-5
      "
              >

                {/* ======================================= */}
                {/* CUSTOMER INFO */}
                {/* ======================================= */}

                <div
                  className="
          bg-gray-50
          border
          border-gray-200
          rounded-xl
          p-4
        "
                >

                  <div
                    className="
            flex
            items-start
            gap-3
          "
                  >

                    <div
                      className="
              w-10
              h-10
              rounded-lg
              bg-blue-100
              text-primary
              flex
              items-center
              justify-center
              shrink-0
            "
                    >

                      <FaBuilding />

                    </div>


                    <div
                      className="
              min-w-0
            "
                    >

                      <p
                        className="
                text-sm
                font-bold
                text-gray-800
              "
                      >
                        {
                          sendData.nama_customer
                        }
                      </p>


                      <p
                        className="
                text-xs
                text-gray-500
                mt-1
              "
                      >
                        {
                          sendData.alamat
                        }
                      </p>

                      {sendItems.length > 1 && (
                        <p className="mt-2 text-xs font-semibold text-blue-700">{sendItems.length} billing dipilih untuk customer ini</p>
                      )}

                    </div>

                  </div>

                </div>


                {/* ======================================= */}
                {/* DETAIL TAGIHAN */}
                {/* ======================================= */}

                <div
                  className="
          grid
          grid-cols-2
          gap-3
        "
                >

                  <div className="col-span-2 border border-orange-100 bg-orange-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-500 mb-2">Billing yang akan dikonfirmasi ({sendItems.length})</p>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {sendItems.map((item) => (
                        <div key={getRowId(item)} className="flex items-center justify-between gap-3 rounded-lg bg-white border border-orange-100 px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-700 break-all">{item.no_billing || "-"}</p>
                            {item.no_faktur && <p className="text-xs text-gray-500">Faktur: {item.no_faktur}</p>}
                          </div>
                          <p className="text-xs text-gray-500 whitespace-nowrap">{formatRupiah(item.total_invoice)}</p>
                        </div>
                      ))}
                    </div>
                  </div>


                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    {[
                      { label: "Total DPP", value: sendItems.reduce((sum, item) => sum + Number(item.dpp || 0), 0) },
                      { label: "Total PPN", value: sendItems.reduce((sum, item) => sum + Number(item.ppn || 0), 0) },
                      { label: "Total PPh", value: sendItems.reduce((sum, item) => sum + Number(item.pph || 0), 0) },
                      { label: "Total Invoice", value: sendItems.reduce((sum, item) => sum + Number(item.total_invoice || 0), 0), total: true },
                    ].map((amount) => (
                      <div key={amount.label} className={`border rounded-xl p-3 ${amount.total ? "border-primary/30 bg-blue-50" : "border-gray-200 bg-white"}`}>
                        <p className="text-[11px] text-gray-500">{amount.label}</p>
                        <p className={`text-base font-bold mt-1 ${amount.total ? "text-primary" : "text-gray-800"}`}>
                          {formatRupiah(amount.value)}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>


                {/* ======================================= */}
                {/* MEDIA */}
                {/* ======================================= */}

                <div>

                  <p
                    className="
            text-sm
            font-bold
            text-gray-700
            mb-3
          "
                  >
                    Kirim melalui
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Pilih Email untuk mengaktifkan tombol Kirim Konfirmasi. Pengiriman WhatsApp sementara dinonaktifkan.
                  </p>


                  <div
                    className="
            flex
            flex-col
            gap-3
          "
                  >

                    {/* WHATSAPP */}

                    {/* {
                      sendData.media_wa !== false && (

                        <label
                          className={`
                  flex
                  items-center
                  justify-between
                  gap-3
                  border
                  rounded-xl
                  p-4
                  cursor-pointer
                  transition
                  ${sendViaWhatsApp
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                            }
                `}
                        >

                          <div
                            className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                  "
                          >

                            <div
                              className="
                      w-11
                      h-11
                      rounded-xl
                      bg-green-100
                      text-green-600
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                            >

                              <FaWhatsapp
                                className="
                        text-xl
                      "
                              />

                            </div>


                            <div
                              className="
                      min-w-0
                    "
                            >

                              <p
                                className="
                        text-sm
                        font-bold
                        text-gray-800
                      "
                              >
                                WhatsApp
                              </p>


                              <p
                                className="
                        text-xs
                        text-gray-500
                        truncate
                      "
                              >
                                {
                                  sendData.no_wa_customer ||
                                  "Nomor belum tersedia"
                                }
                              </p>

                            </div>

                          </div>


                          <input
                            type="checkbox"
                            className="
                    checkbox
                    checkbox-success
                  "
                            checked={
                              sendViaWhatsApp
                            }
                            onChange={
                              e =>
                                setSendViaWhatsApp(
                                  e.target.checked
                                )
                            }
                            disabled={
                              isSendingConfirmation
                            }
                          />

                        </label>

                      )
                    } */}


                    {/* EMAIL */}

                    {
                      sendData.media_email !== false && (

                        <div
                          className={`
                  flex
                  items-center
                  justify-between
                  gap-3
                  border
                  rounded-xl
                  p-4
                  cursor-pointer
                  transition
                  ${sendViaEmail
                              ? "border-blue-300 bg-blue-50"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                            }
                `}
                        >

                          <div
                            className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                  "
                          >

                            <div
                              className="
                      w-11
                      h-11
                      rounded-xl
                      bg-blue-100
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                            >

                              <FaEnvelope
                                className="
                        text-xl
                      "
                              />

                            </div>


                            <div
                              className="
                      min-w-0
                    "
                            >

                              <p
                                className="
                        text-sm
                        font-bold
                        text-gray-800
                      "
                              >
                                Email
                              </p>


                              <p className="text-xs text-gray-500 mb-2">
                                Email penerima (bisa diubah)
                              </p>
                              <input
                                type="email"
                                value={emailRecipient}
                                onChange={(e) => {
                                  setEmailRecipient(e.target.value);
                                  if (sendResult?.type === "error") setSendResult(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder="Masukkan email penerima"
                                className="input input-bordered input-sm w-full min-w-[220px] bg-white text-sm"
                                disabled={isSendingConfirmation}
                                autoComplete="email"
                              />

                            </div>

                          </div>


                          <input
                            type="checkbox"
                            className="
                    checkbox
                    checkbox-primary
                  "
                            checked={
                              sendViaEmail
                            }
                            onChange={
                              e =>
                                setSendViaEmail(
                                  e.target.checked
                                )
                            }
                            disabled={
                              isSendingConfirmation
                            }
                          />

                        </div>

                      )
                    }

                  </div>

                </div>


                {/* ======================================= */}
                {/* INFO */}
                {/* ======================================= */}

                <div
                  className="
          flex
          items-start
          gap-3
          bg-amber-50
          border
          border-amber-200
          rounded-xl
          p-3
        "
                >

                  <FaInfoCircle
                    className="
            text-amber-500
            mt-0.5
            shrink-0
          "
                  />


                  <p
                    className="
            text-xs
            text-amber-700
          "
                  >
                    Setelah konfirmasi berhasil dikirim,
                    batas waktu customer untuk memberikan
                    tanggapan akan dihitung selama 14 hari
                    kalender sejak tanggal pengiriman.
                  </p>

                </div>


                {/* ======================================= */}
                {/* RESULT */}
                {/* ======================================= */}

                {
                  sendResult && (

                    <div
                      className={`
              rounded-xl
              border
              px-4
              py-3
              flex
              items-start
              gap-3
              ${sendResult.type ===
                          "success"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-red-50 border-red-200 text-red-700"
                        }
            `}
                    >

                      {
                        sendResult.type ===
                          "success"
                          ? (
                            <FaCheckCircle
                              className="
                      mt-0.5
                      shrink-0
                    "
                            />
                          )
                          : (
                            <FaTimesCircle
                              className="
                      mt-0.5
                      shrink-0
                    "
                            />
                          )
                      }


                      <p
                        className="
                text-xs
                font-medium
              "
                      >
                        {
                          sendResult.message
                        }
                      </p>

                    </div>

                  )
                }

              </div>


              {/* ========================================= */}
              {/* FOOTER */}
              {/* ========================================= */}

              <div
                className="
        border-t
        bg-gray-50
        px-6
        py-4
        flex
        justify-end
        gap-3
        shrink-0
      "
              >

                <button
                  type="button"
                  disabled={
                    isSendingConfirmation
                  }
                  onClick={
                    closeSendConfirmation
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
          disabled:opacity-50
        "
                >

                  {
                    sendResult?.type ===
                      "success"
                      ? "Tutup"
                      : "Batal"
                  }

                </button>


                {
                  sendResult?.type !==
                  "success" && (

                    <button
                      type="button"
                      onClick={
                        processSendConfirmation
                      }
                      disabled={
                        isSendingConfirmation || !sendViaEmail
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
              disabled:opacity-40
              disabled:cursor-not-allowed
              inline-flex
              items-center
              gap-2
            "
                    >

                      {
                        isSendingConfirmation
                          ? (

                            <>

                              <FaSpinner
                                className="
                        animate-spin
                      "
                              />

                              Mengirim...

                            </>

                          )
                          : (

                            <>

                              <FaPaperPlane />

                              Kirim {sendItems.length > 1 ? `${sendItems.length} Billing` : "Konfirmasi"}

                            </>

                          )
                      }

                    </button>

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


export default TableListKonfirmasiPiutang;