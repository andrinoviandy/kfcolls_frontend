
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  FaFileExcel,
  FaDownload,
  FaUpload,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";
import Swal from "sweetalert2";

import { Modal } from "components/atoms";
import { setToggleModal } from "../../../../redux/n2n/global";
import storeSchema from "global/store";

const TEMPLATE_HEADERS = [
  "periode",
  "company_code",
  "plant",
  "Profit Center Desc.",
  "document_no",
  "posting_date",
  "document_type",
  "billing_no",
  "customer_no",
  "customer name",
  "Lini I",
  "LINI II",
  "document_date",
  "amount",
  "net_due_date",
  "text_information",
  "TOP",
  "AGING STANDAR",
  "30/09/2026",
  "AGING TOP",
  "30/09/2026",
  "Ket Target Cabang",
  "TARGET CABANG",
];

// Mapping berdasarkan posisi kolom Excel.
// Kolom tanggal ke-1 dan ke-2 mempunyai nama yang sama,
// tetapi disimpan ke field database yang berbeda.
const HEADER_MAPPING = [
  "periode",
  "company_code",
  "plant",
  "profit_center_desc",
  "document_no",
  "posting_date",
  "document_type",
  "billing_no",
  "customer_no",
  "customer_name",
  "lini_i",
  "lini_ii",
  "document_date",
  "amount",
  "net_due_date",
  "text_information",
  "top",
  "aging_standar",
  "nilai_aging_periode",
  "aging_top",
  "nilai_aging_top_periode",
  "ket_target_cabang",
  "target_cabang",
];

const DATE_HEADERS = [
  "posting_date",
  "document_date",
  "net_due_date",
];

const NUMERIC_HEADERS = [
  "amount",
  "top",
  "aging_standar",
  "nilai_aging_periode",
  "aging_top",
  "nilai_aging_top_periode",
  "target_cabang",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const formatPreviewValue = (value) => {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) {
    return value.toLocaleDateString("id-ID");
  }

  return String(value);
};

const parseExcelDate = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);

    if (parsed) {
      const month = String(parsed.m).padStart(2, "0");
      const day = String(parsed.d).padStart(2, "0");

      return `${parsed.y}-${month}-${day}`;
    }
  }

  const text = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (match) {
    const [, day, month, year] = match;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return text;
};

const normalizeExcelRow = (row) => {
  const result = {};

  HEADER_MAPPING.forEach((header) => {
    let value = row[header];

    if (DATE_HEADERS.includes(header)) {
      value = parseExcelDate(value);
    }

    if (
      NUMERIC_HEADERS.includes(header) &&
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      if (typeof value === "string") {
        value = value.trim();
      }
    }

    result[header] = value ?? "";
  });

  return result;
};

const ModalUploadTarget = ({ reloadData, setReloadData }) => {
  const dispatch = useDispatch();
  const toggleModal = useSelector(
    (state) => state.global?.toggleModal
  );

  const fileInputRef = useRef(null);

  const [fileExcel, setFileExcel] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isOpen = toggleModal?.modal === "modalUploadTarget";

  const resetForm = () => {
    setFileExcel(null);
    setPreviewData([]);
    setPreviewHeaders([]);
    setErrorMessage("");
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setErrorMessage("");
    setPreviewData([]);
    setPreviewHeaders([]);
    setFileExcel(null);

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      setErrorMessage("File harus berformat .xlsx atau .xls.");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Ukuran file maksimal 25 MB.");

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, {
          type: "array",
          cellDates: true,
        });

        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          throw new Error("Sheet Excel tidak ditemukan.");
        }

        const worksheet = workbook.Sheets[sheetName];

        // Gunakan array supaya dua header 30/09/2026
        // tidak digabung atau saling menimpa.
        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          raw: true,
        });

        if (!rows.length || !rows[0]?.length) {
          throw new Error("File Excel kosong.");
        }

        const excelHeaders = rows[0].map((header) =>
          String(header ?? "").trim()
        );

        const actualHeaders = excelHeaders.map(normalizeHeader);
        const expectedHeaders = TEMPLATE_HEADERS.map(normalizeHeader);

        const headerValid =
          actualHeaders.length === expectedHeaders.length &&
          expectedHeaders.every(
            (header, index) => actualHeaders[index] === header
          );

        if (!headerValid) {
          setErrorMessage(
            "Header Excel tidak sesuai template Master Target. " +
              "Pastikan nama dan urutan 23 kolom sudah benar."
          );

          event.target.value = "";
          return;
        }

        const normalizedData = rows
          .slice(1)
          .map((row) => {
            const mappedRow = {};

            HEADER_MAPPING.forEach((key, index) => {
              let value = row[index] ?? "";

              if (DATE_HEADERS.includes(key) && value !== "") {
                value = parseExcelDate(value);
              }

              if (
                NUMERIC_HEADERS.includes(key) &&
                typeof value === "string"
              ) {
                value = value.trim();
              }

              mappedRow[key] = value;
            });

            return normalizeExcelRow(mappedRow);
          })
          .filter((row) =>
            HEADER_MAPPING.some(
              (key) =>
                row[key] !== "" &&
                row[key] !== null &&
                row[key] !== undefined
            )
          );

        if (normalizedData.length === 0) {
          setErrorMessage(
            "File Excel tidak memiliki data untuk di-upload."
          );

          event.target.value = "";
          return;
        }

        setFileExcel(file);
        setPreviewHeaders(TEMPLATE_HEADERS);
        setPreviewData(normalizedData.slice(0, 100));
      } catch (error) {
        console.error("Gagal membaca Excel:", error);

        setErrorMessage(
          error?.message ||
            "File Excel tidak dapat dibaca. Periksa format file."
        );

        event.target.value = "";
      }
    };

    reader.onerror = () => {
      setErrorMessage("Gagal membaca file Excel.");
      event.target.value = "";
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      TEMPLATE_HEADERS,
      Array(TEMPLATE_HEADERS.length).fill(""),
    ]);

    worksheet["!cols"] = TEMPLATE_HEADERS.map((header) => ({
      wch: Math.max(String(header).length + 4, 18),
    }));

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Master Target"
    );

    XLSX.writeFile(workbook, "template-master-target.xlsx");
  };

  const handleClose = () => {
    resetForm();

    dispatch(
      setToggleModal({
        isOpen: false,
        modal: "",
      })
    );
  };

  const handleSubmit = async () => {
    if (!fileExcel) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Silakan pilih file Excel terlebih dahulu.",
      });

      return;
    }

    if (previewData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Data Kosong",
        text: "File Excel tidak memiliki data yang dapat di-upload.",
      });

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", fileExcel);

      // Action ini harus tersedia di global/store.
      const uploadAction = storeSchema.actions?.uploadMasterTarget;

      if (typeof uploadAction !== "function") {
        throw new Error(
          "Action uploadMasterTarget belum tersedia di storeSchema."
        );
      }

      const response = await uploadAction(formData);

      if (
        response?.status === false ||
        response?.success === false
      ) {
        throw new Error(
          response?.message || "Upload Master Target gagal."
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Upload Berhasil",
        text:
          response?.message ||
          "Data Master Target berhasil di-upload.",
        confirmButtonText: "OK",
      });

      if (typeof setReloadData === "function") {
        setReloadData(!reloadData);
      }

      handleClose();
    } catch (error) {
      console.error("Upload Master Target gagal:", error);

      Swal.fire({
        icon: "error",
        title: "Upload Gagal",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Terjadi kesalahan saat upload Master Target.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      modal="modalUploadTarget"
      title="Upload Master Target"
      size="xl"
      buttonFooter={
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !fileExcel ||
              previewData.length === 0
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaUpload />

            {loading ? "Sedang Upload..." : "Upload Target"}
          </button>
        </div>
      }
    >
      <div className="space-y-5 p-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mt-1 text-sm text-slate-500">
              Upload file Excel sesuai template. Maksimal 25 MB.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <FaDownload />
            Download Template
          </button>
        </div>

        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <FaFileExcel size={26} />
            </div>

            <p className="font-medium text-slate-700">
              Pilih file Excel Master Target
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Format .xlsx atau .xls
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFile}
              className="mt-4 block w-full max-w-md cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {fileExcel && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex min-w-0 items-center gap-3">
              <FaCheckCircle className="shrink-0 text-green-600" />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {fileExcel.name}
                </p>

                <p className="text-xs text-slate-500">
                  {(fileExcel.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFileExcel(null);
                setPreviewData([]);
                setPreviewHeaders([]);
                setErrorMessage("");

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              <FaTimes />
              Hapus File
            </button>
          </div>
        )}

        {previewData.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <FaEye className="text-blue-600" />

                <h4 className="font-semibold text-slate-800">
                  Preview Data Excel
                </h4>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Menampilkan {previewData.length} baris pertama
              </span>
            </div>

            <div className="max-h-[350px] overflow-auto">
              <table className="min-w-max w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-100">
                  <tr>
                    <th className="border-b border-r border-slate-200 px-3 py-3">
                      No
                    </th>

                    {previewHeaders.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="whitespace-nowrap border-b border-r border-slate-200 px-3 py-3 font-semibold text-slate-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {previewData.map((row, rowIndex) => (
                    <tr
                      key={`${rowIndex}-${row.document_no || "row"}`}
                      className="hover:bg-blue-50"
                    >
                      <td className="border-b border-r border-slate-100 px-3 py-2 text-slate-500">
                        {rowIndex + 1}
                      </td>

                      {previewHeaders.map((header, columnIndex) => {
                        const field = HEADER_MAPPING[columnIndex];
                        const value = formatPreviewValue(row[field]);

                        return (
                          <td
                            key={`${header}-${columnIndex}`}
                            className="max-w-[250px] truncate whitespace-nowrap border-b border-r border-slate-100 px-3 py-2 text-slate-600"
                            title={value}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalUploadTarget;
