import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaUpload,
  FaTimes,
  FaCheck,
  FaEye,
  FaFilePdf,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

import {
  useSelector,
} from "react-redux";

import {
  useLocation,
} from "react-router-dom";

import {
  decodeData,
} from "global/helper/jwt";

import {
  getCookies,
} from "global/helper/cookie";
import TableTukarFaktur from "./components/TableTukarFaktur";


// =====================================================
// COMPONENT
// =====================================================

const TukarFaktur = () => {

  const location = useLocation();

  const fileInputRef =
    useRef(null);

  const {
    dimensionScreenW,
    check,
  } = useSelector(
    (state) => state.global
  );


  // ===================================================
  // LOGIN ACCESS
  // ===================================================

  const [
    loginAccess,
    setLoginAccess,
  ] = useState();


  // ===================================================
  // MODAL
  // ===================================================

  const [
    showModal,
    setShowModal,
  ] = useState(false);


  // ===================================================
  // SELECTED FAKTUR
  // ===================================================

  const [
    selectedFaktur,
    setSelectedFaktur,
  ] = useState(null);


  // ===================================================
  // FILE
  // ===================================================

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);


  // ===================================================
  // SUBMIT
  // ===================================================

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  // ===================================================
  // ERROR
  // ===================================================

  const [
    fileError,
    setFileError,
  ] = useState("");


  // ===================================================
  // SUCCESS
  // ===================================================

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  // ===================================================
  // LOGIN ACCESS
  // ===================================================

  useEffect(() => {

    const get =
      async () => {

        try {

          const decoded =
            await decodeData(
              getCookies(
                "accountAccess"
              )
            );

          setLoginAccess(
            decoded
          );

        } catch (
          error
        ) {

          console.error(
            "Error decode accountAccess:",
            error
          );

        }

      };

    get();

  }, []);


  // ===================================================
  // OPEN MODAL
  // ===================================================

  const handleOpenTukarFaktur = (
    faktur
  ) => {

    if (!faktur) {
      return;
    }

    setSelectedFaktur(
      faktur
    );

    setSelectedFile(
      null
    );

    setFileError(
      ""
    );

    setSuccessMessage(
      ""
    );

    setShowModal(
      true
    );

  };


  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const handleCloseModal = () => {

    if (
      isSubmitting
    ) {
      return;
    }

    setShowModal(
      false
    );

    setSelectedFaktur(
      null
    );

    setSelectedFile(
      null
    );

    setFileError(
      ""
    );

    setSuccessMessage(
      ""
    );

    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }

  };


  // ===================================================
  // FILE CHANGE
  // ===================================================

  const handleFileChange = (
    event
  ) => {

    const file =
      event?.target?.files?.[0];

    setFileError(
      ""
    );

    if (!file) {

      setSelectedFile(
        null
      );

      return;

    }


    // =================================================
    // EXTENSION
    // =================================================

    const allowedExtensions = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
    ];

    const fileName =
      String(
        file?.name || ""
      ).toLowerCase();

    const extension =
      fileName
        .split(".")
        .pop();


    if (
      !allowedExtensions.includes(
        extension
      )
    ) {

      setFileError(
        "Format dokumen harus PDF, JPG, JPEG atau PNG."
      );

      if (
        fileInputRef.current
      ) {

        fileInputRef.current.value =
          "";

      }

      setSelectedFile(
        null
      );

      return;

    }


    // =================================================
    // MAX SIZE 25 MB
    // =================================================

    const maxSize =
      25 *
      1024 *
      1024;

    if (
      file.size >
      maxSize
    ) {

      setFileError(
        "Ukuran dokumen maksimal 25 MB."
      );

      if (
        fileInputRef.current
      ) {

        fileInputRef.current.value =
          "";

      }

      setSelectedFile(
        null
      );

      return;

    }


    setSelectedFile(
      file
    );

  };


  // ===================================================
  // REMOVE FILE
  // ===================================================

  const handleRemoveFile = () => {

    if (
      isSubmitting
    ) {
      return;
    }

    setSelectedFile(
      null
    );

    setFileError(
      ""
    );

    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }

  };


  // ===================================================
  // SUBMIT TUKAR FAKTUR
  // ===================================================

  const handleTukarFaktur = async () => {

    setFileError(
      ""
    );

    setSuccessMessage(
      ""
    );


    // =================================================
    // VALIDASI DATA
    // =================================================

    if (
      !selectedFaktur
    ) {

      setFileError(
        "Data faktur tidak ditemukan."
      );

      return;

    }


    // =================================================
    // CEK STATUS
    // =================================================

    const status =
      getStatusFaktur(
        selectedFaktur
      );

    if (
      status === "Sudah Ditukar"
    ) {

      setFileError(
        "Faktur ini sudah ditukar."
      );

      return;

    }


    // =================================================
    // VALIDASI FILE
    // =================================================

    if (
      !selectedFile
    ) {

      setFileError(
        "Dokumen faktur pengganti wajib diupload."
      );

      return;

    }


    try {

      setIsSubmitting(
        true
      );


      // =================================================
      // FORMDATA
      // =================================================

      const formData =
        new FormData();


      // ID FAKTUR

      formData.append(
        "faktur_id",
        selectedFaktur?.id ??
        selectedFaktur?.faktur_id ??
        ""
      );


      // NO FAKTUR

      formData.append(
        "no_faktur",
        selectedFaktur?.no_faktur ??
        selectedFaktur?.nomor_faktur ??
        selectedFaktur?.noFaktur ??
        ""
      );


      // FILE

      formData.append(
        "file",
        selectedFile
      );


      // =================================================
      // LOGIN USER
      // =================================================

      if (
        loginAccess?.user_id
      ) {

        formData.append(
          "user_id",
          loginAccess.user_id
        );

      }


      if (
        loginAccess?.nip
      ) {

        formData.append(
          "nip",
          loginAccess.nip
        );

      }


      // =================================================
      // TODO:
      // HUBUNGKAN KE API / REDUX ACTION ANDA
      //
      // Contoh:
      //
      // const response =
      //   await storeSchema.actions.tukarFaktur(
      //     formData
      //   );
      //
      // if (!response?.success) {
      //   throw new Error(
      //     response?.message ||
      //     "Gagal melakukan tukar faktur."
      //   );
      // }
      // =================================================


      console.log(
        "SUBMIT TUKAR FAKTUR",
        {
          faktur:
            selectedFaktur,
          file:
            selectedFile,
          user:
            loginAccess,
          formData,
        }
      );


      // =================================================
      // SIMULASI SUCCESS
      // =================================================

      setSuccessMessage(
        "Faktur berhasil ditukar."
      );


      // =================================================
      // UPDATE DATA LOCAL
      // =================================================

      setSelectedFaktur(
        (prev) => {

          if (!prev) {
            return prev;
          }

          return {
            ...prev,

            status_tukar_faktur:
              "Sudah Ditukar",

            status:
              "Sudah Ditukar",

            sudah_ditukar:
              true,

            dokumen_tukar_faktur:
              selectedFile?.name,

          };

        }
      );


      // =================================================
      // TUTUP SETELAH BERHASIL
      // =================================================

      setTimeout(
        () => {

          setShowModal(
            false
          );

          setSelectedFaktur(
            null
          );

          setSelectedFile(
            null
          );

          setSuccessMessage(
            ""
          );

        },
        1000
      );

    } catch (
      error
    ) {

      console.error(
        "Error Tukar Faktur:",
        error
      );

      setFileError(
        error?.message ||
        "Gagal melakukan tukar faktur."
      );

    } finally {

      setIsSubmitting(
        false
      );

    }

  };


  // ===================================================
  // STATUS FAKTUR
  // ===================================================

  const getStatusFaktur = (
    faktur
  ) => {

    if (!faktur) {
      return "Belum Ditukar";
    }


    const status =
      String(
        faktur?.status_tukar_faktur ??
        faktur?.status_tukar ??
        faktur?.status ??
        ""
      )
        .trim()
        .toLowerCase();


    if (
      faktur?.sudah_ditukar === true ||
      faktur?.sudah_ditukar === 1 ||
      faktur?.sudah_ditukar === "1" ||
      status === "sudah ditukar" ||
      status === "sudah_ditukar" ||
      status === "ditukar"
    ) {

      return "Sudah Ditukar";

    }


    return "Belum Ditukar";

  };


  // ===================================================
  // STATUS BADGE
  // ===================================================

  const StatusBadge = ({
    faktur,
  }) => {

    const status =
      getStatusFaktur(
        faktur
      );


    if (
      status === "Sudah Ditukar"
    ) {

      return (

        <span
          className="
            inline-flex
            items-center
            gap-1.5
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            bg-green-50
            text-green-600
            border
            border-green-100
          "
        >

          <FaCheck
            className="
              text-[10px]
            "
          />

          Sudah Ditukar

        </span>

      );

    }


    return (

      <span
        className="
          inline-flex
          items-center
          gap-1.5
          px-3
          py-1.5
          rounded-full
          text-xs
          font-semibold
          bg-orange-50
          text-orange-600
          border
          border-orange-100
        "
      >

        <FaExchangeAlt
          className="
            text-[10px]
          "
        />

        Belum Ditukar

      </span>

    );

  };


  // ===================================================
  // FORMAT CURRENCY
  // ===================================================

  const formatCurrency = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "-";

    }


    const number =
      Number(
        String(
          value
        )
          .replace(
            /[^\d.-]/g,
            ""
          )
      ) || 0;


    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(
      number
    );

  };


  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (
    value
  ) => {

    if (!value) {
      return "-";
    }


    const date =
      new Date(
        value
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

  };


  // ===================================================
  // GET FIELD
  // ===================================================

  const getNoFaktur = (
    faktur
  ) => {

    return (
      faktur?.no_faktur ??
      faktur?.nomor_faktur ??
      faktur?.noFaktur ??
      "-"
    );

  };


  const getNoBilling = (
    faktur
  ) => {

    return (
      faktur?.no_billing ??
      faktur?.billing_id ??
      faktur?.billingId ??
      "-"
    );

  };


  const getCustomer = (
    faktur
  ) => {

    return (
      faktur?.customer ??
      faktur?.nama_customer ??
      faktur?.customer_name ??
      "-"
    );

  };


  const getSales = (
    faktur
  ) => {

    return (
      faktur?.sales ??
      faktur?.nama_sales ??
      faktur?.collector ??
      faktur?.nama_collector ??
      "-"
    );

  };


  const getTanggalFaktur = (
    faktur
  ) => {

    return formatDate(
      faktur?.tanggal_faktur ??
      faktur?.tgl_faktur ??
      faktur?.invoice_date
    );

  };


  const getTotalFaktur = (
    faktur
  ) => {

    return formatCurrency(
      faktur?.total_faktur ??
      faktur?.total_piutang ??
      faktur?.grand_total ??
      faktur?.nominal
    );

  };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div
      className="
        bg-white
        px-6
        pt-10
        pb-5
        min-h-full
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          lg:flex-row
          flex-col
          justify-between
          gap-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* ICON */}

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-orange-100
              flex
              items-center
              justify-center
              text-orange-500
              shadow-md
            "
          >

            <FaExchangeAlt />

          </div>


          {/* TITLE */}

          <div
            className="
              flex
              flex-col
              gap-0
            "
          >

            <h1
              className="
                text-xl
                font-bold
                text-gray-800
              "
            >
              Tukar Faktur
            </h1>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Kelola proses pertukaran dokumen faktur
            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* DIVIDER */}
      {/* ================================================= */}

      <hr
        className="
          my-5
        "
      />


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <TableTukarFaktur
        check={
          check
        }
        dimensionScreenW={
          dimensionScreenW
        }
        loginAccess={
          loginAccess
        }
        onTukarFaktur={
          handleOpenTukarFaktur
        }
      />


      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-[1px]
            p-4
          "
        >

          <div
            className="
              bg-white
              w-full
              max-w-3xl
              rounded-2xl
              shadow-2xl
              overflow-hidden
              max-h-[90vh]
              flex
              flex-col
            "
          >

            {/* ================================================= */}
            {/* MODAL HEADER */}
            {/* ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                border-gray-100
                bg-white
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
                    bg-orange-100
                    text-orange-500
                    flex
                    items-center
                    justify-center
                  "
                >

                  <FaExchangeAlt />

                </div>


                <div>

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-gray-800
                    "
                  >
                    Tukar Faktur
                  </h2>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Upload dokumen faktur pengganti
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                disabled={
                  isSubmitting
                }
                className="
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:bg-gray-100
                  hover:text-gray-700
                  transition
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >

                <FaTimes />

              </button>

            </div>


            {/* ================================================= */}
            {/* MODAL BODY */}
            {/* ================================================= */}

            <div
              className="
                p-6
                overflow-y-auto
              "
            >

              {/* ================================================= */}
              {/* INFO STATUS */}
              {/* ================================================= */}

              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-blue-100
                  bg-blue-50
                  p-4
                  flex
                  gap-3
                "
              >

                <FaInfoCircle
                  className="
                    mt-0.5
                    text-primary
                    shrink-0
                  "
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-700
                    "
                  >
                    Informasi Tukar Faktur
                  </p>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      mt-1
                      leading-relaxed
                    "
                  >
                    Pastikan dokumen faktur pengganti yang
                    diupload sudah benar sebelum melakukan
                    proses tukar faktur.
                  </p>

                </div>

              </div>


              {/* ================================================= */}
              {/* INFORMASI FAKTUR */}
              {/* ================================================= */}

              <div
                className="
                  bg-gray-50
                  rounded-xl
                  border
                  border-gray-100
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mb-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <FaFileInvoiceDollar
                      className="
                        text-primary
                      "
                    />

                    <h3
                      className="
                        font-semibold
                        text-gray-800
                      "
                    >
                      Informasi Faktur
                    </h3>

                  </div>


                  <StatusBadge
                    faktur={
                      selectedFaktur
                    }
                  />

                </div>


                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-x-6
                    gap-y-5
                  "
                >

                  {/* NO FAKTUR */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      No. Faktur
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                        break-all
                      "
                    >
                      {
                        getNoFaktur(
                          selectedFaktur
                        )
                      }
                    </p>

                  </div>


                  {/* NO BILLING */}

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
                        text-sm
                        font-semibold
                        text-gray-800
                        break-all
                      "
                    >
                      {
                        getNoBilling(
                          selectedFaktur
                        )
                      }
                    </p>

                  </div>


                  {/* CUSTOMER */}

                  <div>

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
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      {
                        getCustomer(
                          selectedFaktur
                        )
                      }
                    </p>

                  </div>


                  {/* SALES / KOLEKTOR */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      Sales / Kolektor
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      {
                        getSales(
                          selectedFaktur
                        )
                      }
                    </p>

                  </div>


                  {/* TANGGAL */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      Tanggal Faktur
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      {
                        getTanggalFaktur(
                          selectedFaktur
                        )
                      }
                    </p>

                  </div>


                  {/* TOTAL */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mb-1
                      "
                    >
                      Total Faktur
                    </p>

                    <p
                      className="
                        text-sm
                        font-bold
                        text-primary
                      "
                    >
                      {
                        getTotalFaktur(
                          selectedFaktur
                        )
                      }
                    </p>

                  </div>

                </div>

              </div>


              {/* ================================================= */}
              {/* DOKUMEN PENGGANTI */}
              {/* ================================================= */}

              <div
                className="
                  mt-5
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
                  Dokumen Faktur Pengganti

                  <span
                    className="
                      text-red-500
                      ml-1
                    "
                  >
                    *
                  </span>

                </label>


                {!selectedFile ? (

                  <label
                    className="
                      block
                      cursor-pointer
                    "
                  >

                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      className="
                        hidden
                      "
                      accept="
                        .pdf,
                        .jpg,
                        .jpeg,
                        .png
                      "
                      onChange={
                        handleFileChange
                      }
                      disabled={
                        isSubmitting
                      }
                    />


                    <div
                      className="
                        border-2
                        border-dashed
                        border-gray-200
                        rounded-xl
                        p-7
                        text-center
                        hover:border-primary
                        hover:bg-blue-50/30
                        transition
                      "
                    >

                      <div
                        className="
                          w-14
                          h-14
                          mx-auto
                          rounded-xl
                          bg-blue-100
                          text-primary
                          flex
                          items-center
                          justify-center
                          mb-3
                        "
                      >

                        <FaUpload
                          className="
                            text-xl
                          "
                        />

                      </div>


                      <p
                        className="
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Klik untuk upload dokumen
                      </p>


                      <p
                        className="
                          text-xs
                          text-gray-400
                          mt-1
                        "
                      >
                        PDF, JPG, JPEG atau PNG
                        {" "}
                        •
                        {" "}
                        Maksimal 25 MB
                      </p>

                    </div>

                  </label>

                ) : (

                  <div
                    className="
                      rounded-xl
                      border
                      border-green-200
                      bg-green-50
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
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
                            rounded-lg
                            bg-white
                            border
                            border-green-100
                            flex
                            items-center
                            justify-center
                            text-red-500
                            shrink-0
                          "
                        >

                          {
                            selectedFile
                              ?.type ===
                              "application/pdf"
                              ? (
                                <FaFilePdf />
                              )
                              : (
                                <FaFileInvoiceDollar />
                              )
                          }

                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-gray-800
                              truncate
                            "
                            title={
                              selectedFile?.name
                            }
                          >
                            {
                              selectedFile?.name
                            }
                          </p>

                          <p
                            className="
                              text-xs
                              text-green-600
                              mt-1
                            "
                          >
                            Dokumen siap diupload
                          </p>

                        </div>

                      </div>


                      <button
                        type="button"
                        onClick={
                          handleRemoveFile
                        }
                        disabled={
                          isSubmitting
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-red-500
                          hover:bg-red-100
                          transition
                          shrink-0
                          disabled:opacity-50
                        "
                        title="Hapus dokumen"
                      >

                        <FaTrash />

                      </button>

                    </div>

                  </div>

                )}


                {/* ERROR */}

                {fileError && (

                  <div
                    className="
                      mt-3
                      rounded-lg
                      bg-red-50
                      border
                      border-red-100
                      px-4
                      py-3
                      text-xs
                      text-red-600
                    "
                  >
                    {fileError}
                  </div>

                )}


                {/* SUCCESS */}

                {successMessage && (

                  <div
                    className="
                      mt-3
                      rounded-lg
                      bg-green-50
                      border
                      border-green-100
                      px-4
                      py-3
                      text-xs
                      text-green-600
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <FaCheck />

                    {successMessage}

                  </div>

                )}

              </div>

            </div>


            {/* ================================================= */}
            {/* MODAL FOOTER */}
            {/* ================================================= */}

            <div
              className="
                px-6
                py-4
                border-t
                border-gray-100
                flex
                justify-end
                gap-3
                bg-gray-50
              "
            >

              {/* BATAL */}

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                disabled={
                  isSubmitting
                }
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-600
                  text-sm
                  font-semibold
                  hover:bg-gray-100
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Batal
              </button>


              {/* TUKAR FAKTUR */}

              <button
                type="button"
                onClick={
                  handleTukarFaktur
                }
                disabled={
                  isSubmitting ||
                  getStatusFaktur(
                    selectedFaktur
                  ) === "Sudah Ditukar"
                }
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-primary
                  text-white
                  text-sm
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:opacity-90
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  min-w-[145px]
                "
              >

                {isSubmitting ? (

                  <>

                    <span
                      className="
                        loading
                        loading-spinner
                        loading-sm
                      "
                    />

                    Memproses...

                  </>

                ) : (

                  <>

                    <FaExchangeAlt />

                    Tukar Faktur

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default TukarFaktur;