import React, {
  useEffect,
  useState,
} from "react";

import * as XLSX from "xlsx";

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
  FaPlus,
  FaFileExcel,
  FaDownload,
  FaUpload,
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
  const flagAktif = String(item?.flag_aktif ?? "Y").toUpperCase();
  return {
    ...item,
    id: item?.customer_id || item?.id,
    customer_id: item?.customer_id || item?.id || "-",
    kode_customer: item?.kode_customer || "",
    nama_customer: item?.name || item?.nama_customer || "-",
    name: item?.name || item?.nama_customer || "",
    cabang: item?.plant || item?.cabang || "",
    plant: item?.plant || item?.cabang || "",
    customer_groups_1: item?.customer_groups_1 || "",
    customer_groups_1_description: item?.customer_groups_1_description || "-",
    customer_groups_2: item?.customer_groups_2 || "",
    customer_groups_2_description: item?.customer_groups_2_description || "-",
    customer_groups_3: item?.customer_groups_3 || item?.channel_id || "",
    customer_groups_3_description: item?.customer_groups_3_description || item?.channel_description || "-",
    customer_groups_4: item?.customer_groups_4 || "",
    customer_groups_4_description: item?.customer_groups_4_description || "-",
    alamat: item?.street || "-",
    kota: item?.city || "-",
    no_npwp: item?.nik_npwp_16 || "-",
    status: flagAktif === "Y" ? "AKTIF" : "NONAKTIF",
  };
};


const InputPelanggan = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="input input-bordered w-full rounded-xl bg-white" />
  </div>
);

const SelectPelanggan = ({ label, value, options = [], onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="select select-bordered w-full rounded-xl bg-white">
      <option value="">Pilih {label}</option>
      {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select>
  </div>
);

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
    searchKeyword,
    setSearchKeyword,
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


  const [cabangOptions, setCabangOptions] = useState([]);
  const [customerGroup1Options, setCustomerGroup1Options] = useState([]);
  const [customerGroup2Options, setCustomerGroup2Options] = useState([]);
  const [customerGroup3Options, setCustomerGroup3Options] = useState([]);
  const [customerGroup4Options, setCustomerGroup4Options] = useState([]);


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

  const emptyPelanggan = {
    kode_customer: "", name: "", plant: "",
    customer_groups_1: "", customer_groups_1_description: "",
    customer_groups_2: "", customer_groups_2_description: "",
    customer_groups_3: "", customer_groups_3_description: "",
    customer_groups_4: "", customer_groups_4_description: "",
    street: "", city: "", postal_code: "", tax_number: "",
    telephone: "", mobile_phone: "", email: "", nik_npwp_16: "",
    flag_aktif: "Y",
  };
  const [showInsert, setShowInsert] = useState(false);
  const [insertData, setInsertData] = useState(emptyPelanggan);
  const [savingInsert, setSavingInsert] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedExcelFile, setSelectedExcelFile] = useState(null);


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
  // GET REFERENSI PELANGGAN
  // ===================================================

  const mapReferensi = (items = []) => items.map((item) => ({
    label: item?.ur_ref || item?.description || item?.name || "",
    value: item?.kd_ref || item?.code || "",
  }));

  const getReferensiPelanggan = async () => {
    const referenceRequests = [
      { jenis: "cabang_id", setter: setCabangOptions },
      { jenis: "cust_grp_1", setter: setCustomerGroup1Options },
      { jenis: "cust_grp_2", setter: setCustomerGroup2Options },
      { jenis: "channel_id", setter: setCustomerGroup3Options },
      { jenis: "cust_grp_4", setter: setCustomerGroup4Options },
    ];

    await Promise.all(referenceRequests.map(async ({ jenis, setter }) => {
      try {
        const response = await storeSchema.actions.getReferensiByJenis(jenis);
        if (response?.status === true) setter(mapReferensi(response?.data || []));
      } catch (error) {
        console.error(`ERROR GET REFERENSI ${jenis}:`, error);
      }
    }));
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
          searchKeyword.trim(),

        status:
          selectedStatus === "ALL"
            ? ""
            : selectedStatus === "AKTIF"
              ? "Y"
              : "T",

        plant:
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

    getReferensiPelanggan();

  }, []);


  // ===================================================
  // SERVER SIDE SEARCH / FILTER / PAGINATION
  // ===================================================

  useEffect(() => {

    getDataPelanggan();

  }, [

    currentPage,

    perPage,

    searchKeyword,

    selectedStatus,

    selectedCabang,

  ]);


  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = () => {

    setSearchKeyword(
      keyword.trim()
    );

    setCurrentPage(
      1
    );

  };


  // ===================================================
  // RESET FILTER
  // ===================================================

  const resetFilter = () => {

    setKeyword("");

    setSearchKeyword("");

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
  // PAYLOAD PELANGGAN SESUAI public.m_customer
  // ===================================================

  const buildPelangganPayload = (data = {}) => ({
    kode_customer: data?.kode_customer || "",
    name: data?.name || data?.nama_customer || "",
    plant: data?.plant || data?.cabang || "",
    customer_groups_1: data?.customer_groups_1 || "",
    customer_groups_1_description: data?.customer_groups_1_description || "",
    customer_groups_2: data?.customer_groups_2 || "",
    customer_groups_2_description: data?.customer_groups_2_description || "",
    customer_groups_3: data?.customer_groups_3 || "",
    customer_groups_3_description: data?.customer_groups_3_description || "",
    customer_groups_4: data?.customer_groups_4 || "",
    customer_groups_4_description: data?.customer_groups_4_description || "",
    street: data?.street || data?.alamat || "",
    city: data?.city || data?.kota || "",
    postal_code: data?.postal_code || "",
    tax_number: data?.tax_number || "",
    telephone: data?.telephone || "",
    mobile_phone: data?.mobile_phone || "",
    email: data?.email || "",
    nik_npwp_16: data?.nik_npwp_16 || data?.no_npwp || "",
    flag_aktif: data?.flag_aktif || ((data?.status === "NONAKTIF" || data?.status === "T") ? "T" : "Y"),
  });

  const validatePelanggan = (data) => {
    if (!String(data?.name || data?.nama_customer || "").trim()) return "Nama pelanggan wajib diisi.";
    if (!String(data?.plant || data?.cabang || "").trim()) return "Cabang wajib diisi.";
    if (!String(data?.street || data?.alamat || "").trim()) return "Alamat wajib diisi.";
    return null;
  };

  // ===================================================
  // INSERT PELANGGAN
  // ===================================================

  const closeInsert = () => {
    setShowInsert(false);
    setInsertData({ ...emptyPelanggan });
  };

  const handleSaveInsert = async () => {
    const validation = validatePelanggan(insertData);
    if (validation) { await swal.warning(validation); return; }

    try {
      setSavingInsert(true);
      const response = await storeSchema.actions.insertPelanggan(buildPelangganPayload(insertData));
      if (response?.status !== true) throw new Error(response?.message || "Gagal menambahkan pelanggan.");
      closeInsert();
      await swal.success(response?.message || "Pelanggan berhasil ditambahkan.");
      await getDataPelanggan();
    } catch (error) {
      await swal.error(error?.message || "Gagal menambahkan pelanggan.");
    } finally {
      setSavingInsert(false);
    }
  };

  // ===================================================
  // SAVE EDIT - API editPelanggan
  // ===================================================

  const handleSaveEdit = async () => {
    const validation = validatePelanggan(editData);
    if (validation) { await swal.warning(validation); return; }

    try {
      const payload = {
        customer_id: editData?.customer_id,
        ...buildPelangganPayload(editData),
      };
      swal.loading();
      const response = await storeSchema.actions.editPelanggan(payload);
      if (response?.status !== true) throw new Error(response?.message || "Gagal memperbarui pelanggan.");
      closeEdit();
      await swal.success(response?.message || "Data pelanggan berhasil diperbarui.");
      await getDataPelanggan();
    } catch (error) {
      await swal.error(error?.message || "Gagal memperbarui pelanggan.");
    }
  };

  // ===================================================
  // UPLOAD EXCEL PELANGGAN (MAKSIMAL 100 DATA)
  // ===================================================

  const normalizeExcelKey = (value) => String(value || "")
    .trim().toLowerCase().replace(/[\s_-]+/g, "");

  const getExcelField = (row, aliases) => {
    const keys = Object.keys(row || {});
    const found = keys.find((key) => aliases.includes(normalizeExcelKey(key)));
    return found ? row[found] : "";
  };

  const downloadTemplatePelanggan = () => {
    const headers = [
      "kode_customer", "name", "plant",
      "customer_groups_1", "customer_groups_1_description",
      "customer_groups_2", "customer_groups_2_description",
      "customer_groups_3", "customer_groups_3_description",
      "customer_groups_4", "customer_groups_4_description",
      "street", "city", "postal_code", "tax_number",
      "telephone", "mobile_phone", "email", "nik_npwp_16", "flag_aktif",
    ];
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    worksheet["!cols"] = headers.map((header) => ({ wch: Math.max(header.length + 3, 18) }));
    const instructionRows = [
      ["PETUNJUK UPLOAD DATA PELANGGAN"],
      ["1. Isi data pelanggan pada sheet Template Pelanggan."],
      ["2. Maksimal 100 baris data pelanggan dalam satu kali upload."],
      ["3. Kolom wajib: name, plant, dan street."],
      ["4. flag_aktif diisi Y untuk Aktif atau T untuk Nonaktif. Jika kosong, sistem mengisi Y."],
      ["5. customer_groups_1 sampai customer_groups_4 diisi dengan kode referensi yang sesuai."],
      ["6. customer_groups_3 menggunakan referensi channel_id."],
      ["7. Baris pertama pada sheet Template Pelanggan adalah header, jangan diubah."],
    ];
    const instructionSheet = XLSX.utils.aoa_to_sheet(instructionRows);
    instructionSheet["!cols"] = [{ wch: 105 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Pelanggan");
    XLSX.utils.book_append_sheet(workbook, instructionSheet, "Petunjuk");
    XLSX.writeFile(workbook, "Template_Upload_Pelanggan.xlsx");
  };

  const handleUploadExcel = async (fileOrEvent) => {
    const file = fileOrEvent?.target ? fileOrEvent.target.files?.[0] : fileOrEvent;
    if (fileOrEvent?.target) fileOrEvent.target.value = "";
    if (!file) return;

    try {
      setUploadingExcel(true);
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "", raw: false });
      const dataRows = rows.filter((row) => Object.values(row).some((value) => String(value ?? "").trim() !== ""));

      if (dataRows.length === 0) throw new Error("File Excel tidak memiliki data pelanggan.");
      if (dataRows.length > 100) throw new Error(`Upload maksimal 100 data pelanggan. File berisi ${dataRows.length} data.`);

      const mappedRows = dataRows.map((row, index) => {
        const data = {
          kode_customer: getExcelField(row, ["kodecustomer"]),
          name: getExcelField(row, ["name", "namapelanggan", "namacustomer", "customername"]),
          plant: getExcelField(row, ["plant", "cabang"]),
          customer_groups_1: getExcelField(row, ["customergroups1"]),
          customer_groups_1_description: getExcelField(row, ["customergroups1description"]),
          customer_groups_2: getExcelField(row, ["customergroups2"]),
          customer_groups_2_description: getExcelField(row, ["customergroups2description"]),
          customer_groups_3: getExcelField(row, ["channelid", "customergroups3"]),
          customer_groups_3_description: getExcelField(row, ["channeldescription", "customergroups3description"]),
          customer_groups_4: getExcelField(row, ["custgrp4", "customergroups4"]),
          customer_groups_4_description: getExcelField(row, ["custgrp4description", "customergroups4description"]),
          street: getExcelField(row, ["street", "alamat"]),
          city: getExcelField(row, ["city", "kota"]),
          postal_code: getExcelField(row, ["postalcode", "kodepos"]),
          tax_number: getExcelField(row, ["taxnumber"]),
          telephone: getExcelField(row, ["telephone", "telepon"]),
          mobile_phone: getExcelField(row, ["mobilephone", "nohp"]),
          email: getExcelField(row, ["email"]),
          nik_npwp_16: getExcelField(row, ["niknpwp16", "npwp", "nonpwp"]),
          flag_aktif: String(getExcelField(row, ["flagaktif", "status"]) || "Y").toUpperCase() === "T" || String(getExcelField(row, ["flagaktif", "status"]) || "").toUpperCase() === "NONAKTIF" ? "T" : "Y",
        };
        const validation = validatePelanggan(data);
        return { rowNumber: index + 2, data, validation };
      });

      const invalidRows = mappedRows.filter((item) => item.validation);
      if (invalidRows.length) {
        const detail = invalidRows.slice(0, 10).map((item) => `Baris ${item.rowNumber}: ${item.validation}`).join("\n");
        throw new Error(`Terdapat ${invalidRows.length} baris yang belum valid.\n${detail}`);
      }

      const confirm = await swal.confirm(
        "Upload Data Pelanggan",
        `Anda akan mengirim ${mappedRows.length} data pelanggan. Data akan diproses satu per satu. Lanjutkan?`
      );
      if (!confirm) return;

      let successCount = 0;
      const failedRows = [];
      for (const item of mappedRows) {
        try {
          const response = await storeSchema.actions.insertPelanggan(buildPelangganPayload(item.data));
          if (response?.status === true) successCount += 1;
          else failedRows.push({ row: item.rowNumber, message: response?.message || "Gagal insert" });
        } catch (error) {
          failedRows.push({ row: item.rowNumber, message: error?.message || "Gagal insert" });
        }
      }

      await getDataPelanggan();
      setSelectedExcelFile(null);
      setShowUploadModal(false);
      if (failedRows.length) {
        const failedInfo = failedRows.slice(0, 10).map((item) => `Baris ${item.row}: ${item.message}`).join("\n");
        await swal.warning(`Upload selesai. Berhasil: ${successCount}, gagal: ${failedRows.length}.\n${failedInfo}`);
      } else {
        await swal.success(`Berhasil mengupload ${successCount} data pelanggan.`);
      }
    } catch (error) {
      await swal.error(error?.message || "Gagal membaca file Excel.");
    } finally {
      setUploadingExcel(false);
    }
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
    { label: "Aksi", icon: <FaEllipsisV /> },
    { label: "No", icon: <FaHashtag /> },
    { label: "Customer", icon: <FaUsers /> },
    { label: "Customer Groups 1", icon: <FaBuilding /> },
    { label: "Customer Groups 2", icon: <FaBuilding /> },
    { label: "Customer Groups 3 (Channel)", icon: <FaBuilding /> },
    { label: "Customer Groups 4", icon: <FaBuilding /> },
    { label: "Cabang", icon: <FaStore /> },
    { label: "Alamat", icon: <FaMapMarkerAlt /> },
    { label: "NPWP", icon: <FaClipboardList /> },
    { label: "Status", icon: <FaClipboardList /> },
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
            flex
            items-center
            w-full
            lg:w-[420px]
            h-10
            px-1
            bg-white
            border
            border-gray-200
            rounded-full
            shadow-sm
            focus-within:border-primary
            focus-within:ring-1
            focus-within:ring-primary/20
          "
        >

          <input
            type="text"
            placeholder="Cari customer / kode / NPWP..."
            value={
              keyword
            }
            onChange={
              (e) => {

                setKeyword(
                  e.target.value
                );

              }
            }
            onKeyDown={
              (e) => {

                if (
                  e.key === "Enter"
                ) {

                  handleSearch();

                }

              }
            }
            className="
              flex-1
              min-w-0
              h-full
              px-4
              bg-transparent
              border-none
              outline-none
              text-sm
              text-gray-700
              placeholder:text-gray-400
            "
          />


          <button
            type="button"
            onClick={
              handleSearch
            }
            title="Cari"
            className="
              flex
              items-center
              justify-center
              shrink-0
              w-8
              h-8
              mr-0.5
              rounded-full
              bg-primary
              text-white
              hover:bg-primary/90
              active:scale-95
              transition-all
            "
          >

            <IoSearch
              className="
                text-[17px]
              "
            />

          </button>

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

      {/* AKSI PELANGGAN */}
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => setShowUploadModal(true)} disabled={uploadingExcel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
          <FaFileExcel /> Upload Pelanggan
        </button>
        <button type="button" onClick={() => setShowInsert(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90">
          <FaPlus /> Tambah Pelanggan
        </button>
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


                                {/* <li>

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

                                </li> */}

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


                          {/* CUSTOMER GROUPS 1 */}
                          <td className="px-4 py-3 min-w-[190px]">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-gray-700">{displayValue(item?.customer_groups_1_description)}</span>
                              <span className="text-xs text-gray-400">{displayValue(item?.customer_groups_1)}</span>
                            </div>
                          </td>

                          {/* CUSTOMER GROUPS 2 */}
                          <td className="px-4 py-3 min-w-[190px]">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-gray-700">{displayValue(item?.customer_groups_2_description)}</span>
                              <span className="text-xs text-gray-400">{displayValue(item?.customer_groups_2)}</span>
                            </div>
                          </td>

                          {/* CUSTOMER GROUPS 3 / CHANNEL */}
                          <td className="px-4 py-3 min-w-[190px]">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-gray-700">{displayValue(item?.customer_groups_3_description)}</span>
                              <span className="text-xs text-gray-400">{displayValue(item?.customer_groups_3)}</span>
                            </div>
                          </td>

                          {/* CUSTOMER GROUPS 4 */}
                          <td className="px-4 py-3 min-w-[190px]">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-gray-700">{displayValue(item?.customer_groups_4_description)}</span>
                              <span className="text-xs text-gray-400">{displayValue(item?.customer_groups_4)}</span>
                            </div>
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
      {/* UPLOAD PELANGGAN MODAL */}
      {/* ================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { if (!uploadingExcel) { setShowUploadModal(false); setSelectedExcelFile(null); } }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-primary px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><FaFileExcel /></div>
                <div><h3 className="font-bold text-lg">Upload Pelanggan</h3><p className="text-xs text-blue-100">Upload data pelanggan melalui file Excel</p></div>
              </div>
              <button type="button" disabled={uploadingExcel} onClick={() => { setShowUploadModal(false); setSelectedExcelFile(null); }} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center disabled:opacity-50"><FaTimes /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <FaDownload className="text-primary mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Download Template Excel</p>
                    <p className="text-sm text-gray-500 mt-1">Gunakan template agar susunan kolom dan nama header sesuai dengan format upload.</p>
                    <button type="button" onClick={downloadTemplatePelanggan} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90"><FaDownload /> Download Template</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih File Excel</label>
                <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center ${uploadingExcel ? "bg-gray-100 border-gray-200" : "bg-gray-50 border-gray-300 hover:border-primary cursor-pointer"}`}>
                  <FaUpload className="text-2xl text-primary" />
                  <span className="text-sm font-semibold text-gray-700">{selectedExcelFile?.name || "Klik untuk memilih file Excel"}</span>
                  <span className="text-xs text-gray-400">Format .xlsx atau .xls · Maksimal 100 data</span>
                  <input type="file" accept=".xlsx,.xls" className="hidden" disabled={uploadingExcel} onChange={(e) => { setSelectedExcelFile(e.target.files?.[0] || null); e.target.value = ""; }} />
                </label>
                <p className="text-xs text-gray-500 mt-2">Data akan divalidasi terlebih dahulu, kemudian dikirim satu per satu.</p>
              </div>
            </div>

            <div className="border-t bg-gray-50 px-5 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowUploadModal(false); setSelectedExcelFile(null); }} disabled={uploadingExcel} className="px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold disabled:opacity-50">Batal</button>
              <button type="button" onClick={() => handleUploadExcel(selectedExcelFile)} disabled={!selectedExcelFile || uploadingExcel} className="px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50">
                {uploadingExcel ? <span className="loading loading-spinner loading-xs" /> : <FaUpload />}
                {uploadingExcel ? "Memproses Excel..." : "Upload Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* INSERT MODAL */}
      {/* ================================================= */}
      {showInsert && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeInsert}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-primary px-6 py-4 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><FaPlus /></div><div><h3 className="font-bold text-lg">Tambah Pelanggan</h3><p className="text-xs text-blue-100">Lengkapi data sesuai master pelanggan</p></div></div>
              <button type="button" onClick={closeInsert} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center"><FaTimes /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputPelanggan label="Kode Customer" value={insertData.kode_customer} onChange={(value) => setInsertData((prev) => ({ ...prev, kode_customer: value }))} />
              <InputPelanggan label="Nama Pelanggan *" value={insertData.name} onChange={(value) => setInsertData((prev) => ({ ...prev, name: value }))} />
              <SelectPelanggan label="Cabang / Plant *" value={insertData.plant} options={cabangOptions} onChange={(value) => setInsertData((prev) => ({ ...prev, plant: value }))} />
              {[
                ["customer_groups_1", "customer_groups_1_description", "Customer Groups 1", customerGroup1Options],
                ["customer_groups_2", "customer_groups_2_description", "Customer Groups 2", customerGroup2Options],
                ["customer_groups_3", "customer_groups_3_description", "Customer Groups 3", customerGroup3Options],
                ["customer_groups_4", "customer_groups_4_description", "Customer Groups 4", customerGroup4Options],
              ].map(([key, descriptionKey, label, options]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                  <select value={insertData[key]} onChange={(e) => { const selected = options.find((item) => String(item.value) === e.target.value); setInsertData((prev) => ({ ...prev, [key]: e.target.value, [descriptionKey]: selected?.label || "" })); }} className="select select-bordered w-full rounded-xl bg-white">
                    <option value="">Pilih {label}</option>{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
              ))}
              <InputPelanggan label="Kota" value={insertData.city} onChange={(value) => setInsertData((prev) => ({ ...prev, city: value }))} />
              <InputPelanggan label="Kode Pos" value={insertData.postal_code} onChange={(value) => setInsertData((prev) => ({ ...prev, postal_code: value }))} />
              <InputPelanggan label="Tax Number" value={insertData.tax_number} onChange={(value) => setInsertData((prev) => ({ ...prev, tax_number: value }))} />
              <InputPelanggan label="NPWP 16 Digit" value={insertData.nik_npwp_16} onChange={(value) => setInsertData((prev) => ({ ...prev, nik_npwp_16: value }))} />
              <InputPelanggan label="Telepon" value={insertData.telephone} onChange={(value) => setInsertData((prev) => ({ ...prev, telephone: value }))} />
              <InputPelanggan label="Mobile Phone" value={insertData.mobile_phone} onChange={(value) => setInsertData((prev) => ({ ...prev, mobile_phone: value }))} />
              <InputPelanggan label="Email" value={insertData.email} onChange={(value) => setInsertData((prev) => ({ ...prev, email: value }))} />
              <div className="md:col-span-2 lg:col-span-3"><label className="block text-sm font-semibold text-gray-700 mb-2">Alamat / Street *</label><textarea value={insertData.street} onChange={(e) => setInsertData((prev) => ({ ...prev, street: e.target.value }))} className="textarea textarea-bordered w-full min-h-[90px] rounded-xl" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Status</label><select value={insertData.flag_aktif} onChange={(e) => setInsertData((prev) => ({ ...prev, flag_aktif: e.target.value }))} className="select select-bordered w-full rounded-xl bg-white"><option value="Y">Aktif</option><option value="T">Nonaktif</option></select></div>
            </div>
            <div className="border-t bg-gray-50 px-5 py-4 flex justify-end gap-3"><button type="button" onClick={closeInsert} disabled={savingInsert} className="px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold">Batal</button><button type="button" onClick={handleSaveInsert} disabled={savingInsert} className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-md inline-flex items-center gap-2 disabled:opacity-60">{savingInsert ? <span className="loading loading-spinner loading-xs" /> : <FaSave />} {savingInsert ? "Menyimpan..." : "Simpan Pelanggan"}</button></div>
          </div>
        </div>
      )}

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
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Customer ID</label><input value={editData?.customer_id || ""} disabled className="input input-bordered w-full bg-gray-100 rounded-xl" /></div>
                <InputPelanggan label="Kode Customer" value={editData?.kode_customer || ""} onChange={(value) => setEditData((prev) => ({ ...prev, kode_customer: value }))} />
                <InputPelanggan label="Nama Pelanggan *" value={editData?.name || editData?.nama_customer || ""} onChange={(value) => setEditData((prev) => ({ ...prev, name: value, nama_customer: value }))} />
                <SelectPelanggan label="Cabang / Plant *" value={editData?.plant || editData?.cabang || ""} options={cabangOptions} onChange={(value) => setEditData((prev) => ({ ...prev, plant: value, cabang: value }))} />
                {[
                  ["customer_groups_1", "customer_groups_1_description", "Customer Groups 1", customerGroup1Options],
                  ["customer_groups_2", "customer_groups_2_description", "Customer Groups 2", customerGroup2Options],
                  ["customer_groups_3", "customer_groups_3_description", "Customer Groups 3", customerGroup3Options],
                  ["customer_groups_4", "customer_groups_4_description", "Customer Groups 4", customerGroup4Options],
                ].map(([key, descriptionKey, label, options]) => (
                  <div key={key}><label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label><select value={editData?.[key] || ""} onChange={(e) => { const selected = options.find((item) => String(item.value) === e.target.value); setEditData((prev) => ({ ...prev, [key]: e.target.value, [descriptionKey]: selected?.label || "" })); }} className="select select-bordered w-full rounded-xl bg-white"><option value="">Pilih {label}</option>{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
                ))}
                <InputPelanggan label="Kota" value={editData?.city || editData?.kota || ""} onChange={(value) => setEditData((prev) => ({ ...prev, city: value, kota: value }))} />
                <InputPelanggan label="Kode Pos" value={editData?.postal_code || ""} onChange={(value) => setEditData((prev) => ({ ...prev, postal_code: value }))} />
                <InputPelanggan label="Tax Number" value={editData?.tax_number || ""} onChange={(value) => setEditData((prev) => ({ ...prev, tax_number: value }))} />
                <InputPelanggan label="NPWP 16 Digit" value={editData?.nik_npwp_16 || editData?.no_npwp || ""} onChange={(value) => setEditData((prev) => ({ ...prev, nik_npwp_16: value, no_npwp: value }))} />
                <InputPelanggan label="Telepon" value={editData?.telephone || ""} onChange={(value) => setEditData((prev) => ({ ...prev, telephone: value }))} />
                <InputPelanggan label="Mobile Phone" value={editData?.mobile_phone || ""} onChange={(value) => setEditData((prev) => ({ ...prev, mobile_phone: value }))} />
                <InputPelanggan label="Email" value={editData?.email || ""} onChange={(value) => setEditData((prev) => ({ ...prev, email: value }))} />
                <div className="md:col-span-2 lg:col-span-3"><label className="block text-sm font-semibold text-gray-700 mb-2">Alamat / Street *</label><textarea value={editData?.street || editData?.alamat || ""} onChange={(e) => setEditData((prev) => ({ ...prev, street: e.target.value, alamat: e.target.value }))} className="textarea textarea-bordered w-full min-h-[90px] rounded-xl" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Status</label><select value={editData?.flag_aktif || (editData?.status === "NONAKTIF" ? "T" : "Y")} onChange={(e) => setEditData((prev) => ({ ...prev, flag_aktif: e.target.value, status: e.target.value === "Y" ? "AKTIF" : "NONAKTIF" }))} className="select select-bordered w-full rounded-xl bg-white"><option value="Y">Aktif</option><option value="T">Nonaktif</option></select></div>
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