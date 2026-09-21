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
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate from "react-paginate";


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
// DUMMY DATA
// =====================================================

const dummyData = [

  {
    id: 1,
    no_faktur: "10000271521",
    customer_id: "CUST001",
    nama_customer: "Dinas Kesehatan Kota Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Gatot Subroto No. 125, Medan",

    nominal_tagihan: 140000000,
    total_dibayar: 0,
    sisa_tagihan: 140000000,

    posting_date: "2026-08-01",
    due_date: "2026-08-22",

    sales: "Andri Noviandy",

    status: "MENUNGGU_PEMBAYARAN",
  },

  {
    id: 2,
    no_faktur: "10000271522",
    customer_id: "CUST002",
    nama_customer: "Apotek Maju Djaya",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Sisingamangaraja No. 88, Medan",

    nominal_tagihan: 85000000,
    total_dibayar: 0,
    sisa_tagihan: 85000000,

    posting_date: "2026-08-02",
    due_date: "2026-08-25",

    sales: "Budi Santoso",

    status: "MENUNGGU_PEMBAYARAN",
  },

  {
    id: 3,
    no_faktur: "10000271523",
    customer_id: "CUST001",
    nama_customer: "Dinas Kesehatan Kota Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Gatot Subroto No. 125, Medan",

    nominal_tagihan: 140000000,
    total_dibayar: 0,
    sisa_tagihan: 140000000,

    posting_date: "2026-08-03",
    due_date: "2026-08-27",

    sales: "Citra Lestari",

    status: "MENUNGGU_PEMBAYARAN",
  },

  {
    id: 4,
    no_faktur: "10000271524",
    customer_id: "CUST003",
    nama_customer: "RSUD Pasuruan",
    nama_penagih: "KFTD Pasuruan",
    alamat: "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",

    nominal_tagihan: 175000000,
    total_dibayar: 0,
    sisa_tagihan: 175000000,

    posting_date: "2026-08-04",
    due_date: "2026-08-29",

    sales: "Dimas Pratama",

    status: "MENUNGGU_PEMBAYARAN",
  },

  {
    id: 5,
    no_faktur: "10000271525",
    customer_id: "CUST004",
    nama_customer: "RS Hermina Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Asrama No. 12, Medan",

    nominal_tagihan: 95000000,
    total_dibayar: 0,
    sisa_tagihan: 95000000,

    posting_date: "2026-08-05",
    due_date: "2026-08-30",

    sales: "Andri Noviandy",

    status: "MENUNGGU_PEMBAYARAN",
  },

  {
    id: 6,
    no_faktur: "10000271526",
    customer_id: "CUST003",
    nama_customer: "RSUD Pasuruan",
    nama_penagih: "KFTD Pasuruan",
    alamat: "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",

    nominal_tagihan: 65000000,
    total_dibayar: 0,
    sisa_tagihan: 65000000,

    posting_date: "2026-08-06",
    due_date: "2026-09-01",

    sales: "Budi Santoso",

    status: "MENUNGGU_PEMBAYARAN",
  },

  {
    id: 7,
    no_faktur: "10000271527",
    customer_id: "CUST004",
    nama_customer: "RS Hermina Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Asrama No. 12, Medan",

    nominal_tagihan: 72500000,
    total_dibayar: 0,
    sisa_tagihan: 72500000,

    posting_date: "2026-08-07",
    due_date: "2026-09-03",

    sales: "Citra Lestari",

    status: "BELUM_DIBAYAR",
  },

  {
    id: 8,
    no_faktur: "10000271528",
    customer_id: "CUST001",
    nama_customer: "Dinas Kesehatan Kota Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Gatot Subroto No. 125, Medan",

    nominal_tagihan: 210000000,
    total_dibayar: 0,
    sisa_tagihan: 210000000,

    posting_date: "2026-08-08",
    due_date: "2026-09-05",

    sales: "Dimas Pratama",

    status: "BELUM_DIBAYAR",
  },

  {
    id: 9,
    no_faktur: "10000271529",
    customer_id: "CUST003",
    nama_customer: "RSUD Pasuruan",
    nama_penagih: "KFTD Pasuruan",
    alamat: "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",

    nominal_tagihan: 125000000,
    total_dibayar: 0,
    sisa_tagihan: 125000000,

    posting_date: "2026-08-09",
    due_date: "2026-09-07",

    sales: "Andri Noviandy",

    status: "BELUM_DIBAYAR",
  },

  {
    id: 10,
    no_faktur: "10000271530",
    customer_id: "CUST004",
    nama_customer: "RS Hermina Medan",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Asrama No. 12, Medan",

    nominal_tagihan: 45000000,
    total_dibayar: 0,
    sisa_tagihan: 45000000,

    posting_date: "2026-08-10",
    due_date: "2026-09-10",

    sales: "Budi Santoso",

    status: "BELUM_DIBAYAR",
  },

  {
    id: 11,
    no_faktur: "10000271531",
    customer_id: "CUST002",
    nama_customer: "Apotek Maju Djaya",
    nama_penagih: "KFTD Medan",
    alamat: "Jl. Sisingamangaraja No. 88, Medan",

    nominal_tagihan: 185000000,
    total_dibayar: 0,
    sisa_tagihan: 185000000,

    posting_date: "2026-08-11",
    due_date: "2026-09-12",

    sales: "Citra Lestari",

    status: "BELUM_DIBAYAR",
  },

  {
    id: 12,
    no_faktur: "10000271532",
    customer_id: "CUST003",
    nama_customer: "RSUD Pasuruan",
    nama_penagih: "KFTD Pasuruan",
    alamat: "Jl. Wahidin Sudirohusodo No. 10, Pasuruan",

    nominal_tagihan: 55000000,
    total_dibayar: 0,
    sisa_tagihan: 55000000,

    posting_date: "2026-08-12",
    due_date: "2026-09-15",

    sales: "Dimas Pratama",

    status: "BELUM_DIBAYAR",
  },

];


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

  const [allData, setAllData] =
    useState(dummyData);

  const [keyword, setKeyword] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(10);

  const [selectedData, setSelectedData] =
    useState(null);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [paymentMethod, setPaymentMethod] =
    useState("GIRO");

  const [dueDateGiro, setDueDateGiro] =
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


  // ===================================================
  // CUSTOMER OPTIONS FOR PARTIAL PAYMENT
  // ===================================================

  const partialCustomerOptions =
    useMemo(() => {

      const customers =
        allData.filter(
          item =>
            (
              item.status ===
              "BELUM_DIBAYAR"
              ||
              item.status ===
              "PARTIAL"
            )
            &&
            Number(
              item.sisa_tagihan ??
              item.nominal_tagihan ??
              0
            ) > 0
        );

      const map =
        new Map();

      customers.forEach(
        item => {

          if (
            !map.has(
              item.customer_id
            )
          ) {

            map.set(
              item.customer_id,
              {
                customer_id:
                  item.customer_id,

                nama_customer:
                  item.nama_customer,

                nama_penagih:
                  item.nama_penagih,

                jumlah_faktur: 0,

                total_sisa_tagihan: 0,
              }
            );

          }

          const customer =
            map.get(
              item.customer_id
            );

          customer.jumlah_faktur +=
            1;

          customer.total_sisa_tagihan +=
            Number(
              item.sisa_tagihan ??
              item.nominal_tagihan ??
              0
            );

        }
      );

      return Array.from(
        map.values()
      );

    }, [
      allData
    ]);


  // ===================================================
  // SUMMARY
  // ===================================================

  const summaryData =
    useMemo(() => {

      const belumDibayar =
        allData.filter(
          x =>
            x.status ===
            "BELUM_DIBAYAR"
        );

      const partial =
        allData.filter(
          x =>
            x.status ===
            "PARTIAL"
        );

      const sudahDibayar =
        allData.filter(
          x =>
            x.status ===
            "SUDAH_DIBAYAR"
        );

      return {

        total:
          allData.length,

        belum_dibayar:
          belumDibayar.length,

        partial:
          partial.length,

        sudah_dibayar:
          sudahDibayar.length,

        total_nominal:
          allData
            .filter(
              x =>
                x.status !==
                "SUDAH_DIBAYAR"
            )
            .reduce(
              (
                sum,
                x
              ) =>
                sum +
                Number(
                  x.sisa_tagihan ??
                  x.nominal_tagihan ??
                  0
                ),
              0
            ),

      };

    }, [
      allData
    ]);


  // ===================================================
  // FILTER
  // ===================================================

  const filteredData =
    useMemo(() => {

      let data =
        [...allData];


      if (
        selectedStatus !==
        "ALL"
      ) {

        data =
          data.filter(
            item =>
              item.status ===
              selectedStatus
          );

      }


      if (
        keyword.trim()
      ) {

        const search =
          keyword.toLowerCase();


        data =
          data.filter(
            item =>

              item.no_faktur
                ?.toLowerCase()
                .includes(search)

              ||

              item.nama_customer
                ?.toLowerCase()
                .includes(search)

              ||

              item.nama_penagih
                ?.toLowerCase()
                .includes(search)

              ||

              item.sales
                ?.toLowerCase()
                .includes(search)

          );

      }


      return data;

    }, [
      allData,
      selectedStatus,
      keyword,
    ]);


  // ===================================================
  // PAGINATION
  // ===================================================

  const totalData =
    filteredData.length;

  const totalPage =
    Math.ceil(
      totalData /
      perPage
    );

  const paginatedData =
    filteredData.slice(
      (
        currentPage -
        1
      ) *
      perPage,

      currentPage *
      perPage
    );


  useEffect(() => {

    setCurrentPage(1);

  }, [
    keyword,
    selectedStatus,
    perPage,
  ]);


  // ===================================================
  // SELECT CHECKBOX
  // ===================================================

  const handleSelectOne = (
    id
  ) => {

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

  const currentPageIds =
    paginatedData.map(
      item =>
        item.id
    );


  const isAllSelected =
    currentPageIds.length >
    0 &&
    currentPageIds.every(
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
              !currentPageIds.includes(
                id
              )
          )
      );

    } else {

      setSelectedIds(
        prev => [

          ...new Set([
            ...prev,
            ...currentPageIds,
          ]),

        ]
      );

    }

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
      "GIRO"
    );

    setPaymentAllocationMode("MANUAL");
    setPaymentAllocation({});

    setDueDateGiro(
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

  const handlePayment = () => {
    if (paymentMethod === "PARTIAL_PAYMENT") {
      if (!canUsePartialPayment) {
        alert(
          "Partial Payment hanya dapat digunakan jika minimal 2 faktur yang dipilih berasal dari 1 customer yang sama."
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

      setAllData((prev) =>
        prev.map((item) => {
          const payment = Number(
            paymentAllocation[
              item?.no_faktur
            ] || 0
          );

          if (
            !payment ||
            String(item?.customer_id) !==
              String(selectedPaymentCustomer)
          ) {
            return item;
          }

          const invoiceAmount =
            Number(
              item?.nominal_tagihan || 0
            );

          const currentPaid =
            Number(
              item?.total_dibayar || 0
            );

          const currentRemaining =
            Number(
              item?.sisa_tagihan ??
              invoiceAmount
            );

          const remaining =
            Math.max(
              0,
              currentRemaining -
                payment
            );

          return {
            ...item,
            nominal_tagihan:
              invoiceAmount,
            total_dibayar:
              currentPaid + payment,
            sisa_tagihan:
              remaining,
            status:
              remaining <= 0
                ? "SUDAH_DIBAYAR"
                : "PARTIAL",
            tanggal_pembayaran:
              new Date().toISOString(),
            metode_pembayaran:
              "PARTIAL_PAYMENT",
          };
        })
      );

      setSelectedIds((prev) =>
        prev.filter(
          (id) =>
            !selectedPaymentInvoices.some(
              (invoice) =>
                invoice.id === id &&
                Number(
                  paymentAllocation[
                    invoice.no_faktur
                  ] || 0
                ) > 0
            )
        )
      );

      closePayment();
      return;
    }



    const dataToPay =
      Array.isArray(
        selectedData
      )
        ? selectedData
        : [
          selectedData,
        ];


    const ids =
      dataToPay.map(
        item =>
          item.id
      );


    setAllData(
      prev =>
        prev.map(
          item => {

            if (
              !ids.includes(
                item.id
              )
            ) {

              return item;

            }


            return {

              ...item,

              total_dibayar:
                Number(
                  item.nominal_tagihan ||
                  0
                ),

              sisa_tagihan:
                0,

              status:
                "SUDAH_DIBAYAR",

              tanggal_pembayaran:
                new Date()
                  .toISOString(),

              metodo_pembayaran:
                paymentMethod,

            };

          }
        )
    );


    setSelectedIds(
      prev =>
        prev.filter(
          id =>
            !ids.includes(id)
        )
    );


    closePayment();

  };


  // ===================================================
  // OPEN PARTIAL PAYMENT
  // =====================================================

  const openPartialPayment = (
    data = null
  ) => {

    setPartialPaymentAmount("");

    setPartialPaymentMethod(
      "MANUAL"
    );

    setPartialSelectedIds([]);

    setPartialAllocation([]);

    setSelectedCustomerId(
      data?.customer_id
        ? data.customer_id
        : ""
    );

    setShowPartialPaymentModal(
      true
    );

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

    return allData.filter(
      item =>

        String(
          item.customer_id
        ) ===
        String(
          selectedCustomerId
        )

        &&

        (
          item.status ===
          "BELUM_DIBAYAR"

          ||

          item.status ===
          "PARTIAL"
        )

        &&

        Number(
          item.sisa_tagihan ??
          item.nominal_tagihan ??
          0
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
          invoice.sisa_tagihan ??
          invoice.nominal_tagihan ??
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
      allData
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
          invoice.sisa_tagihan ??
          invoice.nominal_tagihan ??
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

  const canUsePartialPayment =
    paymentSelection.length > 1 &&
    !!selectedPaymentCustomer;

  const selectedPaymentInvoices = useMemo(() => {
    return paymentSelection.filter(
      (item) =>
        String(item?.customer_id) ===
          String(selectedPaymentCustomer) &&
        Number(
          item?.sisa_tagihan ??
          item?.nominal_tagihan ??
          0
        ) > 0
    );
  }, [paymentSelection, selectedPaymentCustomer]);

  const totalSelectedPayment = useMemo(() => {
    return selectedPaymentInvoices.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.sisa_tagihan ??
          item?.nominal_tagihan ??
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
    setPaymentMethod("GIRO");
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
      setPaymentMethod("GIRO");
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
    status
  ) => {

    const config =
      statusConfig[
        status
      ];


    if (
      !config
    ) {

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
  // HEADER TABLE
  // ===================================================

  const headerTable = [

    {
      label: "No",
      icon: <FaHashtag />,
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
      label: "Nominal Tagihan",
      icon:
        <FaMoneyBillWave />,
    },

    {
      label: "Sudah Dibayar",
      icon:
        <FaMoneyBillWave />,
    },

    {
      label: "Sisa Tagihan",
      icon:
        <FaMoneyBillWave />,
    },

    {
      label: "Posting Date",
      icon:
        <FaCalendarAlt />,
    },

    {
      label: "Due Date",
      icon:
        <FaCalendarAlt />,
    },

    {
      label: "Status",
      icon:
        <FaInfoCircle />,
    },

    {
      label: "Aksi",
      icon:
        <FaEllipsisV />,
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
          item.sisa_tagihan ??
          item.nominal_tagihan ??
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

    <div
      className="
        flex
        flex-col
        gap-5
      "
    >


      {/* ================================================= */}
      {/* SEARCH + ACTION */}
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
            lg:w-[380px]
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
              Cari faktur / customer / penagih...
            "
            className="grow"
            value={
              keyword
            }
            onChange={
              e =>
                setKeyword(
                  e.target.value
                )
            }
          />

        </div>


        {/* RIGHT ACTION */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
          "
        >

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
              Status:
            </span>

            <select
              className="
                select
                select-sm
                select-bordered
                rounded-full
                bg-white
                min-w-[180px]
              "
              value={
                selectedStatus
              }
              onChange={
                e =>
                  setSelectedStatus(
                    e.target.value
                  )
              }
            >

              <option value="ALL">
                Semua Status
              </option>

              <option value="BELUM_DIBAYAR">
                Belum Dibayar
              </option>

              <option value="PARTIAL">
                Partial Payment
              </option>

              <option value="MENUNGGU_PEMBAYARAN">
                Menunggu Pembayaran
              </option>

              <option value="SUDAH_DIBAYAR">
                Sudah Dibayar
              </option>

            </select>

          </div>


          {/* PARTIAL BUTTON */}

          <button
            type="button"
            onClick={
              openPartialPayment
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-2
              rounded-full
              bg-orange-500
              text-white
              text-sm
              font-semibold
              hover:bg-orange-600
              transition
              shadow-md
              whitespace-nowrap
            "
          >

            <FaCreditCard />

            Partial Payment

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
          lg:grid-cols-4
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
                Total Faktur
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

              <FaClipboardList
                className="
                  text-blue-600
                "
              />

            </div>

          </div>

        </div>


        {/* BELUM DIBAYAR */}

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
                Belum Dibayar
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-amber-900
                "
              >
                {
                  summaryData.belum_dibayar
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


        {/* PARTIAL */}

        <div
          className="
            rounded-2xl
            bg-orange-50
            p-4
            border
            border-orange-100
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
                  text-orange-700
                "
              >
                Partial Payment
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-orange-900
                "
              >
                {
                  summaryData.partial
                }
              </p>

            </div>

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-orange-100
                flex
                items-center
                justify-center
              "
            >

              <FaCreditCard
                className="
                  text-orange-600
                "
              />

            </div>

          </div>

        </div>


        {/* TOTAL TAGIHAN */}

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
                Total Sisa Tagihan
              </p>

              <p
                className="
                  text-xl
                  font-bold
                  text-green-900
                "
              >
                {
                  formatRupiah(
                    summaryData.total_nominal
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

              <FaMoneyBillWave
                className="
                  text-green-600
                "
              />

            </div>

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
                      checked={
                        isAllSelected
                      }
                      onChange={
                        handleSelectAll
                      }
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
                  0 ? (

                    <tr>

                      <td
                        colSpan={
                          headerTable.length +
                          1
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

                        Tidak ada data faktur

                      </td>

                    </tr>

                  ) : (

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
                              checked={
                                selectedIds.includes(
                                  v.id
                                )
                              }
                              disabled={
                                v.status ===
                                "SUDAH_DIBAYAR"
                              }
                              onChange={() =>
                                handleSelectOne(
                                  v.id
                                )
                              }
                            />

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
                              i +
                              1
                            }

                          </td>


                          {/* FAKTUR */}

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
                                  w-9
                                  h-9
                                  rounded-lg
                                  bg-blue-50
                                  flex
                                  items-center
                                  justify-center
                                "
                              >

                                <FaFileInvoiceDollar
                                  className="
                                    text-primary
                                  "
                                />

                              </div>

                              <span
                                className="
                                  font-semibold
                                  text-primary
                                "
                              >
                                {
                                  v.no_faktur
                                }
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
                                  ID: {
                                    v.customer_id
                                  }
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


                          {/* NOMINAL TAGIHAN */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            <span
                              className="
                                font-bold
                                text-gray-700
                              "
                            >
                              {
                                formatRupiah(
                                  v.nominal_tagihan
                                )
                              }
                            </span>

                          </td>


                          {/* SUDAH DIBAYAR */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            <span
                              className="
                                font-semibold
                                text-green-600
                              "
                            >
                              {
                                formatRupiah(
                                  v.total_dibayar ||
                                  0
                                )
                              }
                            </span>

                          </td>


                          {/* SISA TAGIHAN */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            <span
                              className="
                                font-bold
                                text-orange-600
                              "
                            >
                              {
                                formatRupiah(
                                  v.sisa_tagihan ??
                                  v.nominal_tagihan
                                )
                              }
                            </span>

                          </td>


                          {/* POSTING DATE */}

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


                          {/* DUE DATE */}

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
                                text-sm
                                text-gray-600
                              "
                            >

                              <FaCalendarAlt
                                className="
                                  text-orange-500
                                "
                              />

                              {
                                formatDate(
                                  v.due_date
                                )
                              }

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
                                v.status
                              )
                            }

                          </td>


                          {/* AKSI */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            {
                              v.status !==
                              "SUDAH_DIBAYAR" ? (

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >

                                  {/* FULL PAYMENT */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openPayment(
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

                                    <FaMoneyBillWave />

                                    Bayar

                                  </button>


                                  {/* PARTIAL */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openPartialPayment(
                                        v
                                      )
                                    }
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

                                <span
                                  className="
                                    text-xs
                                    text-gray-400
                                  "
                                >
                                  Sudah dibayar
                                </span>

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
                        ${
                          paymentMethod ===
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


                    {/* GIRO */}

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          "GIRO"
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
                        ${
                          paymentMethod ===
                          "GIRO"
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
                            bg-orange-50
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <FaCreditCard
                            className="
                              text-orange-500
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
                            Giro
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            Cek diserahkan ke Collector
                          </p>

                        </div>

                      </div>


                      {
                        paymentMethod ===
                        "GIRO" && (

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
                        ${
                          paymentMethod ===
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
                        ${
                          paymentMethod ===
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
                          ${
                            paymentMethod ===
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
                                ${
                                  paymentAllocationMode === "MANUAL"
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
                                ${
                                  paymentAllocationMode === "SYSTEM"
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
                                      Total Sisa Tagihan
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

                        setSelectedCustomerId(
                          e.target.value
                        );

                        setPartialSelectedIds([]);

                        setPartialAllocation([]);

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
                                    Total Sisa Tagihan
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
                                        customer.total_sisa_tagihan
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
                          ${
                            partialPaymentMethod ===
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
                          ${
                            partialPaymentMethod ===
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