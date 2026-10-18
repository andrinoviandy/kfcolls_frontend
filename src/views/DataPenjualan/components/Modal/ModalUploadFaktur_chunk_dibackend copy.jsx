import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import * as XLSX from "xlsx";

import {
  Modal,
} from "components/atoms";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaCheckCircle,
  FaCloudUploadAlt,
  FaFileExcel,
  FaTrash,
  FaUpload,
  FaDownload,
  FaFileInvoiceDollar,
  FaBuilding,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";

import {
  IoCloudUploadOutline,
} from "react-icons/io5";

import {
  swal,
} from "global/helper/swal";

import {
  setToggleModal,
} from "../../../../redux/n2n/global";
import Swal from "sweetalert2";
import storeSchema from "global/store";


// =====================================================
// REQUIRED HEADERS
// SESUAI DENGAN EXCEL DATA PENJUALAN
// =====================================================

const REQUIRED_HEADERS = [
  "Sales Office",
  "Desc. S.Office",
  "Posting Date",
  "Billing No",
  "Posting Status",
  "Bill.Cancel",
  "Bill to party",
  "Name Bill to",
  "Address",
  "Material",
  "Material Group 1",
  "Desc Material Group 1",
  "Text Material",
  "Quantity",
  "Sales Unit",
  "Unit Price Penjualan",
  "Dis% (ZD01)",
  "DisAmt (ZD01)",
  "Dis% (ZD02)",
  "DisAmt (ZD02)",
  "Dis% (ZD03)",
  "DisAmt (ZD03)",
  "Dis% (ZD04)",
  "DisAmt (ZD04)",
  "Dis% (ZD05)",
  "DisAmt (ZD05)",
  "Dis% (ZD06)",
  "DisAmt (ZD06)",
  "Disc. Upfront % (ZD07)",
  "Disc. Upfront Amt (ZD07)",
  "Disc. Beban KFTD Upf % (ZD08)",
  "Disc. Beban KFTD Upf Amt (ZD08)",
  "Disc. Beban Principle Upf % (ZD09)",
  "Disc. Beban Principle Upf Amt (ZD09)",
  "Disc. Pengembalian Upf % (ZD10)",
  "Disc. Pengembalian Upf Amt (ZD10)",
  "Dis% (ZD12)",
  "DisAmt (ZD12)",
  "Dis% (ZD14)",
  "DisAmt (ZD14)",
  "Dis% (ZD15)",
  "DisAmt (ZD15)",
  "Total Discount",
  "Total Penjualan",
  "Tax Amount",
  "Total COGS",
  "Unit Price Pembelian",
  "Bill Qty in SKU",
  "UoM SKU",
  "Code Pelayanan",
  "Dec. Pelayanan",
  "Prod. Hierarchy3",
  "Principle",
  "Name Principle",
  "Desc. Cust. Grp4",
  "Salesman",
  "Name Salesman",
  "PO Number",
  "Quotation Number",
];


// =====================================================
// REQUIRED DATA
// KOLOM YANG WAJIB TERISI
// =====================================================

const REQUIRED_DATA_HEADERS = [
  "Sales Office",
  "Posting Date",
  "Billing No",
  "Material",
  "Quantity",
  "Sales Unit",
  "Unit Price Penjualan",
  "Total Penjualan",
];


// =====================================================
// NUMERIC COLUMNS
// =====================================================

const NUMERIC_HEADERS = [
  "Quantity",
  "Unit Price Penjualan",

  "Dis% (ZD01)",
  "DisAmt (ZD01)",

  "Dis% (ZD02)",
  "DisAmt (ZD02)",

  "Dis% (ZD03)",
  "DisAmt (ZD03)",

  "Dis% (ZD04)",
  "DisAmt (ZD04)",

  "Dis% (ZD05)",
  "DisAmt (ZD05)",

  "Dis% (ZD06)",
  "DisAmt (ZD06)",

  "Disc. Upfront % (ZD07)",
  "Disc. Upfront Amt (ZD07)",

  "Disc. Beban KFTD Upf % (ZD08)",
  "Disc. Beban KFTD Upf Amt (ZD08)",

  "Disc. Beban Principle Upf % (ZD09)",
  "Disc. Beban Principle Upf Amt (ZD09)",

  "Disc. Pengembalian Upf % (ZD10)",
  "Disc. Pengembalian Upf Amt (ZD10)",

  "Dis% (ZD12)",
  "DisAmt (ZD12)",

  "Dis% (ZD14)",
  "DisAmt (ZD14)",

  "Dis% (ZD15)",
  "DisAmt (ZD15)",

  "Total Discount",
  "Total Penjualan",
  "Tax Amount",
  "Total COGS",
  "Unit Price Pembelian",
  "Bill Qty in SKU",
];


// =====================================================
// NORMALIZE HEADER
// =====================================================

const normalizeHeader = (
  value = ""
) => {

  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      "_"
    )
    .replace(
      /[^a-z0-9_]/g,
      ""
    );

};


// =====================================================
// GET EXCEL VALUE
// =====================================================

const getExcelValue = (
  row,
  header
) => {

  const normalizedHeader =
    normalizeHeader(header);

  const key =
    Object.keys(row).find(
      item =>
        normalizeHeader(item) ===
        normalizedHeader
    );

  return key !== undefined
    ? row[key]
    : "";

};


// =====================================================
// STRING
// =====================================================

const toStringValue = (
  value
) => {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();

};


// =====================================================
// NUMERIC
// =====================================================

const toNumeric = (
  value
) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value === "number"
  ) {

    return Number.isFinite(value)
      ? value
      : null;

  }

  let cleaned =
    String(value)
      .trim()
      .replace(/\s/g, "")
      .replace(
        /[^0-9,.\-]/g,
        ""
      );

  if (!cleaned) {
    return null;
  }

  const hasComma =
    cleaned.includes(",");

  const hasDot =
    cleaned.includes(".");


  // ===================================================
  // 1.234.567,89
  // ===================================================

  if (
    hasComma &&
    hasDot
  ) {

    if (
      cleaned.lastIndexOf(",") >
      cleaned.lastIndexOf(".")
    ) {

      cleaned =
        cleaned
          .replace(/\./g, "")
          .replace(",", ".");

    } else {

      // 1,234,567.89

      cleaned =
        cleaned.replace(
          /,/g,
          ""
        );

    }

  }


  // ===================================================
  // 1.234
  // ===================================================

  else if (
    hasDot &&
    !hasComma
  ) {

    const parts =
      cleaned.split(".");

    if (
      parts.length > 2 ||
      (
        parts.length === 2 &&
        parts[1].length === 3 &&
        parts[0].length <= 3
      )
    ) {

      cleaned =
        cleaned.replace(
          /\./g,
          ""
        );

    }

  }


  // ===================================================
  // 1,234
  // ===================================================

  else if (
    hasComma &&
    !hasDot
  ) {

    const parts =
      cleaned.split(",");

    if (
      parts.length > 2 ||
      (
        parts.length === 2 &&
        parts[1].length === 3 &&
        parts[0].length <= 3
      )
    ) {

      cleaned =
        cleaned.replace(
          /,/g,
          ""
        );

    } else {

      cleaned =
        cleaned.replace(
          ",",
          "."
        );

    }

  }


  const numberValue =
    Number(cleaned);

  return Number.isFinite(
    numberValue
  )
    ? numberValue
    : null;

};


// =====================================================
// DATE
// =====================================================

const parseExcelDate = (
  value
) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }


  // ===================================================
  // EXCEL SERIAL DATE
  // ===================================================

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {

    const excelEpoch =
      new Date(
        Date.UTC(
          1899,
          11,
          30
        )
      );

    const date =
      new Date(
        excelEpoch.getTime() +
        value * 86400000
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {

      return date
        .toISOString()
        .slice(
          0,
          10
        );

    }

  }


  const stringValue =
    String(value).trim();


  // ===================================================
  // YYYY-MM-DD
  // ===================================================

  if (
    /^\d{4}-\d{2}-\d{2}$/
      .test(stringValue)
  ) {

    return stringValue;

  }


  // ===================================================
  // DD-MM-YYYY
  // ===================================================

  if (
    /^\d{2}-\d{2}-\d{4}$/
      .test(stringValue)
  ) {

    const [
      day,
      month,
      year,
    ] =
      stringValue.split("-");

    const date =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

    if (
      date.getFullYear() ===
      Number(year) &&
      date.getMonth() ===
      Number(month) - 1 &&
      date.getDate() ===
      Number(day)
    ) {

      return `${year}-${month}-${day}`;

    }

  }


  // ===================================================
  // DD/MM/YYYY
  // ===================================================

  if (
    /^\d{2}\/\d{2}\/\d{4}$/
      .test(stringValue)
  ) {

    const [
      day,
      month,
      year,
    ] =
      stringValue.split("/");

    const date =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

    if (
      date.getFullYear() ===
      Number(year) &&
      date.getMonth() ===
      Number(month) - 1 &&
      date.getDate() ===
      Number(day)
    ) {

      return `${year}-${month}-${day}`;

    }

  }


  // ===================================================
  // DEFAULT DATE
  // ===================================================

  const date =
    new Date(stringValue);

  if (
    !Number.isNaN(
      date.getTime()
    )
  ) {

    return date
      .toISOString()
      .slice(
        0,
        10
      );

  }

  return null;

};


// =====================================================
// HAS VALUE
// =====================================================

const hasValue = (
  value
) => {

  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );

};


// =====================================================
// COMPONENT
// =====================================================

const ModalUploadFaktur = ({ reloadData,
  setReloadData }) => {

  const dispatch =
    useDispatch();

  const {
    toggleModal,
  } =
    useSelector(
      state =>
        state.global
    );


  const fileInputRef =
    useRef(null);


  const [
    fileExcel,
    setFileExcel,
  ] =
    useState(null);


  const [
    excelData,
    setExcelData,
  ] =
    useState([]);


  const [
    showTable,
    setShowTable,
  ] =
    useState(false);


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  // ===================================================
  // RESET
  // ===================================================

  const resetUpload =
    () => {

      setFileExcel(null);

      setExcelData([]);

      setShowTable(false);

      setLoading(false);


      if (
        fileInputRef.current
      ) {

        fileInputRef
          .current
          .value = "";

      }

    };


  // ===================================================
  // OPEN MODAL
  // ===================================================

  useEffect(
    () => {

      if (
        toggleModal?.isOpen &&
        toggleModal?.modal ===
        "modalUploadFaktur"
      ) {

        resetUpload();

      }

    },
    [
      toggleModal?.isOpen,
      toggleModal?.modal,
    ]
  );


  // ===================================================
  // FILE
  // FRONTEND TIDAK MEMBACA / MEMVALIDASI EXCEL
  // File hanya disimpan di state. Seluruh proses Excel dilakukan backend.
  // ===================================================

  const handleFile =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase();

      if (
        !["xlsx", "xls"].includes(extension)
      ) {
        swal.error(
          "Format file harus .xlsx atau .xls"
        );

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return;
      }

      setFileExcel(file);
      setExcelData([]);
      setShowTable(false);
    };


  // ===================================================
  // DOWNLOAD TEMPLATE
  // ===================================================

  const handleDownloadTemplate =
    () => {

      try {

        const data = [
          Object.fromEntries(
            REQUIRED_HEADERS.map(
              header => [
                header,
                "",
              ]
            )
          ),
        ];


        const worksheet =
          XLSX.utils.json_to_sheet(
            data,
            {
              header:
                REQUIRED_HEADERS,
            }
          );


        const workbook =
          XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Data Penjualan"
        );


        worksheet["!cols"] =
          REQUIRED_HEADERS.map(
            header => ({
              wch:
                Math.max(
                  header.length + 3,
                  15
                ),
            })
          );


        XLSX.writeFile(
          workbook,
          "template-penjualan.xlsx"
        );

      } catch (
      error
      ) {

        console.error(
          "ERROR TEMPLATE:",
          error
        );

        swal.error(
          "Gagal membuat template Excel"
        );

      }

    };


  // ===================================================
  // SUBMIT
  // Semua proses baca Excel + validation + insert dilakukan backend.
  // Frontend hanya mengirim File object menggunakan FormData.
  // ===================================================

  const handleSubmit = async () => {
    if (!fileExcel) {
      swal.error(
        "File Excel belum dipilih, silakan pilih file terlebih dahulu."
      );
      return;
    }

    setLoading(true);
    swal.loading("Mengupload dan memproses file Excel...");

    try {
      const formData = new FormData();
      formData.append("file", fileExcel);

      const res =
        await storeSchema.actions.uploadPenjualanExcel(
          formData
        );

      if (res?.status !== true) {
        throw new Error(
          res?.data?.message ||
          res?.data?.data ||
          res?.message ||
          "Gagal memproses file Excel di server."
        );
      }

      const responseData =
        res?.data || {};

      const dataError =
        Array.isArray(responseData?.data_error)
          ? responseData.data_error
          : [];

      const preview =
        Array.isArray(responseData?.preview)
          ? responseData.preview.slice(0, 100)
          : Array.isArray(responseData?.preview_data)
            ? responseData.preview_data.slice(0, 100)
            : [];

      const totalError =
        Number(
          responseData?.total_error ??
          dataError.length
        );

      const totalSuccess =
        Number(
          responseData?.total_success ??
          responseData?.success ??
          0
        );

      const totalData =
        Number(
          responseData?.total ??
          responseData?.total_data ??
          totalSuccess + totalError
        );

      setExcelData(preview);
      setShowTable(preview.length > 0);

      swal.close();

      if (
        totalSuccess > 0 &&
        totalError === 0
      ) {
        await swal.success(
          `Semua Data Berhasil Disimpan !\n\n${totalSuccess.toLocaleString(
            "id-ID"
          )} data berhasil disimpan.`
        );

        setReloadData(true);

        await dispatch(
          setToggleModal({
            isOpen: false,
            modal: "",
          })
        );

        return;
      }

      if (
        totalSuccess === 0 &&
        totalError === 0
      ) {
        await swal.error(
          responseData?.message ||
          "Tidak ada data yang berhasil diproses."
        );
        return;
      }

      const result =
        await Swal.fire({
          title: `Berhasil: ${totalSuccess.toLocaleString(
            "id-ID"
          )}, Gagal: ${totalError.toLocaleString(
            "id-ID"
          )}`,
          text:
            `Total data: ${totalData.toLocaleString(
              "id-ID"
            )}. Data yang gagal dapat dilihat pada detail data error.`,
          icon: "warning",
          confirmButtonText: "Lihat Data Yang Gagal",
          cancelButtonText: "Tutup",
          showCancelButton: true,
          customClass: {
            confirmButton:
              "bg-red-500 hover:bg-red-600 text-white px-4 py-2 mx-3 rounded",
            cancelButton:
              "bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded",
          },
          buttonsStyling: false,
        });

      if (result.isConfirmed) {
        await dispatch(
          setToggleModal({
            isOpen: true,
            modal: "modalGagal",
            data: dataError,
          })
        );
      }
    } catch (error) {
      console.error(
        "ERROR UPLOAD PENJUALAN:",
        error
      );

      swal.close();

      await swal.error(
        error?.message ||
        "Terjadi kesalahan saat memproses file Excel"
      );
    } finally {
      setLoading(false);
    }
  };


  // ===================================================
  // SUMMARY
  // Tidak melakukan reduce terhadap seluruh data Excel di frontend.
  // Summary detail berasal dari response backend.
  // ===================================================

  const formatCurrency =
    value => {

      return new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }
      ).format(
        Number(value || 0)
      );

    };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <Modal

      title="Upload Data Penjualan"

      iconTitle={
        <IoCloudUploadOutline
          className="
            text-primary
            text-3xl
          "
        />
      }

      modal="modalUploadFaktur"

      size="w-11/12 max-w-7xl"

      scroll={false}

      buttonFooter={

        <div
          className="
            flex
            justify-end
            gap-3
          "
        >

          <button

            type="button"

            onClick={() =>
              dispatch(
                setToggleModal({
                  isOpen:
                    false,
                  modal:
                    "",
                })
              )
            }

            className="
              btn
              border-none
              bg-gray-200
              text-gray-700
              rounded-full
              px-6
            "
          >

            Batal

          </button>


          <button

            type="button"

            onClick={
              handleSubmit
            }

            disabled={
              !fileExcel || loading
            }

            className="
              btn
              border-none
              bg-primary
              text-white
              rounded-full
              px-6
              disabled:bg-gray-300
            "
          >

            <FaCheckCircle />

            Simpan Data

          </button>

        </div>
      }
    >

      <div>

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            bg-blue-50
            border
            border-blue-100
            rounded-3xl
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-blue-900
                "
              >

                Upload Data Penjualan

              </h2>


              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >

                Import data penjualan
                menggunakan file Excel.

              </p>

            </div>


            <FaCloudUploadAlt
              className="
                text-5xl
                text-primary
                opacity-30
              "
            />

          </div>

        </div>


        {/* =================================================
            UPLOAD BOX
        ================================================== */}

        <div
          className="
            mt-6
            bg-white
            border
            rounded-3xl
            p-6
          "
        >

          <div
            className="
              border-2
              border-dashed
              border-blue-200
              rounded-3xl
              p-10
              flex
              flex-col
              items-center
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-full
                bg-blue-50
                flex
                items-center
                justify-center
              "
            >

              <FaFileExcel
                className="
                  text-4xl
                  text-green-600
                "
              />

            </div>


            <h3
              className="
                mt-4
                font-bold
                text-lg
              "
            >

              Upload File Excel

            </h3>


            <p
              className="
                text-sm
                text-gray-500
              "
            >

              .xlsx / .xls

            </p>


            <p
              className="
                text-xs
                text-gray-400
                mt-1
                text-center
              "
            >

              Template berisi 59 kolom
              sesuai struktur data penjualan.

            </p>


            <div
              className="
                flex
                flex-wrap
                justify-center
                gap-3
                mt-5
              "
            >

              {/* TEMPLATE */}

              <button

                type="button"

                onClick={
                  handleDownloadTemplate
                }

                className="
                  px-5
                  py-3
                  rounded-full
                  bg-gray-700
                  text-white
                  flex
                  items-center
                  gap-2
                "
              >

                <FaDownload />

                Template

              </button>


              {/* UPLOAD */}

              <label
                className="
                  cursor-pointer
                  px-5
                  py-3
                  rounded-full
                  bg-primary
                  text-white
                  flex
                  items-center
                  gap-2
                "
              >

                <FaUpload />

                Pilih Excel

                <input

                  ref={
                    fileInputRef
                  }

                  type="file"

                  accept="
                    .xlsx,
                    .xls
                  "

                  className="
                    hidden
                  "

                  onChange={
                    handleFile
                  }

                />

              </label>

            </div>


            {/* LOADING */}

            {
              loading && (

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-primary
                    text-sm
                  "
                >

                  <span
                    className="
                      loading
                      loading-spinner
                      loading-sm
                    "
                  />

                  Memproses file di server...

                </div>

              )
            }


            {/* FILE */}

            {
              fileExcel && (

                <div
                  className="
                    mt-5
                    bg-green-50
                    border
                    border-green-200
                    rounded-2xl
                    p-4
                    flex
                    items-center
                    gap-3
                  "
                >

                  <FaFileExcel
                    className="
                      text-green-600
                      text-xl
                    "
                  />


                  <div>

                    <p
                      className="
                        font-semibold
                        text-sm
                      "
                    >

                      {
                        fileExcel.name
                      }

                    </p>


                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >

                      {
                        (
                          fileExcel.size /
                          1024 /
                          1024
                        ).toFixed(2)
                      } MB

                    </p>

                  </div>


                  <button

                    type="button"

                    onClick={
                      resetUpload
                    }

                    className="
                      ml-auto
                      text-red-500
                    "
                  >

                    <FaTrash />

                  </button>

                </div>

              )
            }

          </div>

        </div>


        {/* =================================================
            SUMMARY
        ================================================== */}

        {
          fileExcel && (

            <div className="mt-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FaFileInvoiceDollar className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status File</p>
                      <p className="text-sm font-bold text-blue-900">Siap Diproses</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <FaCheckCircle className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Validasi</p>
                      <p className="text-sm font-bold text-green-700">Dilakukan di Backend</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FaCloudUploadAlt className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preview</p>
                      <p className="text-sm font-bold text-purple-900">Maksimal 100 Data</p>
                    </div>
                  </div>
                </div>
              </div>

              {showTable && excelData.length > 0 && (
                <>
                  {/* =================================================
                  PREVIEW
              ================================================== */}

                  <div className="flex
                  justify-between
                  items-center
                  mb-4
                "
                  >

                    <div>

                      <h3
                        className="
                      text-lg
                      font-bold
                      text-gray-700
                    "
                      >

                        Preview Data

                      </h3>


                      <p
                        className="
                      text-sm
                      text-gray-500
                    "
                      >

                        {
                          excelData.length
                        } data

                      </p>

                    </div>


                    <span
                      className="
                    px-4
                    py-2
                    rounded-full
                    bg-green-100
                    text-green-700
                    text-sm
                    font-semibold
                  "
                    >

                      Siap Disimpan

                    </span>

                  </div>


                  {/* TABLE */}

                  <div
                    className="
                  overflow-auto
                  max-h-[500px]
                  border
                  rounded-3xl
                "
                  >

                    <table
                      className="
                    table
                    w-full
                    min-w-[3500px]
                  "
                    >

                      <thead
                        className="
                      bg-primary
                      text-white
                      sticky
                      top-0
                      z-20
                    "
                      >
                        <tr>
                          <th className="sticky left-0 z-30 bg-primary min-w-[60px]">No</th>
                          <th>Sales Office</th>
                          <th>Desc. S.Office</th>
                          <th>Posting Date</th>
                          <th>Billing No</th>
                          <th>Posting Status</th>
                          <th>Bill.Cancel</th>
                          <th>Bill to party</th>
                          <th>Name Bill to</th>
                          <th>Address</th>
                          <th>Material</th>
                          <th>Material Group 1</th>
                          <th>Desc Material Group 1</th>
                          <th>Text Material</th>
                          <th>Quantity</th>
                          <th>Sales Unit</th>
                          <th>Unit Price Penjualan</th>
                          <th>Dis% (ZD01)</th>
                          <th>DisAmt (ZD01)</th>
                          <th>Dis% (ZD02)</th>
                          <th>DisAmt (ZD02)</th>
                          <th>Dis% (ZD03)</th>
                          <th>DisAmt (ZD03)</th>
                          <th>Dis% (ZD04)</th>
                          <th>DisAmt (ZD04)</th>
                          <th>Dis% (ZD05)</th>
                          <th>DisAmt (ZD05)</th>
                          <th>Dis% (ZD06)</th>
                          <th>DisAmt (ZD06)</th>
                          <th>Disc. Upfront % (ZD07)</th>
                          <th>Disc. Upfront Amt (ZD07)</th>
                          <th>Disc. Beban KFTD Upf % (ZD08)</th>
                          <th>Disc. Beban KFTD Upf Amt (ZD08)</th>
                          <th>Disc. Beban Principle Upf % (ZD09)</th>
                          <th>Disc. Beban Principle Upf Amt (ZD09)</th>
                          <th>Disc. Pengembalian Upf % (ZD10)</th>
                          <th>Disc. Pengembalian Upf Amt (ZD10)</th>
                          <th>Dis% (ZD12)</th>
                          <th>DisAmt (ZD12)</th>
                          <th>Dis% (ZD14)</th>
                          <th>DisAmt (ZD14)</th>
                          <th>Dis% (ZD15)</th>
                          <th>DisAmt (ZD15)</th>
                          <th>Total Discount</th>
                          <th>Total Penjualan</th>
                          <th>Tax Amount</th>
                          <th>Total COGS</th>
                          <th>Unit Price Pembelian</th>
                          <th>Bill Qty in SKU</th>
                          <th>UoM SKU</th>
                          <th>Code Pelayanan</th>
                          <th>Dec. Pelayanan</th>
                          <th>Prod. Hierarchy3</th>
                          <th>Principle</th>
                          <th>Name Principle</th>
                          <th>Desc. Cust. Grp4</th>
                          <th>Salesman</th>
                          <th>Name Salesman</th>
                          <th>PO Number</th>
                          <th>Quotation Number</th>
                        </tr>
                      </thead>

                      <tbody>
                        {excelData.slice(0, 100).map((item, index) => (
                          <tr key={item.id} className="hover:bg-blue-50">
                            <td className="sticky left-0 z-10 bg-white font-semibold">{index + 1}</td>
                            <td>
                              {
                                item.sales_office || "-"
                              }
                            </td>

                            <td>
                              {
                                item.desc_s_office || "-"
                              }
                            </td>

                            <td>
                              {
                                item.posting_date || "-"
                              }
                            </td>

                            <td>
                              {
                                item.billing_no || "-"
                              }
                            </td>

                            <td>
                              {
                                item.posting_status || "-"
                              }
                            </td>

                            <td>
                              {
                                item.bill_cancel || "-"
                              }
                            </td>

                            <td>
                              {
                                item.bill_to_party || "-"
                              }
                            </td>

                            <td>
                              {
                                item.name_bill_to || "-"
                              }
                            </td>

                            <td>
                              {
                                item.address || "-"
                              }
                            </td>

                            <td>
                              {
                                item.material || "-"
                              }
                            </td>

                            <td>
                              {
                                item.material_group_1 || "-"
                              }
                            </td>

                            <td>
                              {
                                item.desc_material_group_1 || "-"
                              }
                            </td>

                            <td>
                              {
                                item.text_material || "-"
                              }
                            </td>

                            <td>
                              {
                                Number(item.quantity || 0).toLocaleString("id-ID")
                              }
                            </td>

                            <td>
                              {
                                item.sales_unit || "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.unit_price_penjualan)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd01 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd01)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd02 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd02)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd03 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd03)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd04 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd04)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd05 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd05)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd06 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd06)
                              }
                            </td>

                            <td>
                              {
                                item.disc_upfront_pct_zd07 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.disc_upfront_amt_zd07)
                              }
                            </td>

                            <td>
                              {
                                item.disc_beban_kftd_upf_pct_zd08 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.disc_beban_kftd_upf_amt_zd08)
                              }
                            </td>

                            <td>
                              {
                                item.disc_beban_principle_upf_pct_zd09 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.disc_beban_principle_upf_amt_zd09)
                              }
                            </td>

                            <td>
                              {
                                item.disc_pengembalian_upf_pct_zd10 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.disc_pengembalian_upf_amt_zd10)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd12 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd12)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd14 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd14)
                              }
                            </td>

                            <td>
                              {
                                item.dis_pct_zd15 ?? "-"
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.dis_amt_zd15)
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.total_discount)
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.total_penjualan)
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.tax_amount)
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.total_cogs)
                              }
                            </td>

                            <td>
                              {
                                formatCurrency(item.unit_price_pembelian)
                              }
                            </td>

                            <td>
                              {
                                Number(item.bill_qty_in_sku || 0).toLocaleString("id-ID")
                              }
                            </td>

                            <td>
                              {
                                item.uom_sku || "-"
                              }
                            </td>

                            <td>
                              {
                                item.code_pelayanan || "-"
                              }
                            </td>

                            <td>
                              {
                                item.dec_pelayanan || "-"
                              }
                            </td>

                            <td>
                              {
                                item.prod_hierarchy3 || "-"
                              }
                            </td>

                            <td>
                              {
                                item.principle || "-"
                              }
                            </td>

                            <td>
                              {
                                item.name_principle || "-"
                              }
                            </td>

                            <td>
                              {
                                item.desc_cust_grp4 || "-"
                              }
                            </td>

                            <td>
                              {
                                item.salesman || "-"
                              }
                            </td>

                            <td>
                              {
                                item.name_salesman || "-"
                              }
                            </td>

                            <td>
                              {
                                item.po_number || "-"
                              }
                            </td>

                            <td>
                              {
                                item.quotation_number || "-"
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>

                  </div>


                  {
                    excelData.length >
                    100 && (

                      <p
                        className="
                      text-xs
                      text-gray-500
                      mt-2
                    "
                      >

                        Menampilkan 100 data
                        pertama dari{" "}
                        {
                          excelData.length
                        } data.

                      </p>

                    )
                  }
                </>

              )}

            </div>

          )
        }

      </div>

    </Modal>

  );

};


export default ModalUploadFaktur;