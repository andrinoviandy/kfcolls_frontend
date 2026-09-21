import React, {
  useEffect,
  useState,
} from "react";

import {
  FaExchangeAlt,
  FaCheck,
} from "react-icons/fa";

import {
  useSelector,
} from "react-redux";

import {
  decodeData,
} from "global/helper/jwt";

import {
  getCookies,
} from "global/helper/cookie";

import TableVerifikasiTukarFaktur from "./components/TableVerifikasiTukarFaktur";

// =====================================================
// COMPONENT
// =====================================================

const VerifikasiTukarFaktur = () => {
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

  useEffect(() => {
    const getLoginAccess = async () => {
      try {
        const decoded = await decodeData(
          getCookies("accountAccess")
        );

        setLoginAccess(decoded);
      } catch (error) {
        console.error(
          "Error decode accountAccess:",
          error
        );
      }
    };

    getLoginAccess();
  }, []);

  // ===================================================
  // VERIFIKASI TUKAR FAKTUR
  // ===================================================
  //
  // Callback ini diteruskan ke TableVerifikasiTukarFaktur.
  // Silakan hubungkan ke Redux action / API project Anda.
  //
  // Contoh:
  //
  // const response =
  //   await storeSchema.actions.verifikasiTukarFaktur(payload);
  //
  // if (!response?.success) {
  //   throw new Error(
  //     response?.message ||
  //     "Gagal melakukan verifikasi tukar faktur."
  //   );
  // }

  const handleVerifikasiTukarFaktur = async (payload) => {
    console.log(
      "VERIFIKASI TUKAR FAKTUR",
      payload
    );

    return {
      success: true,
      data: payload,
    };
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
            gap-3
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
              Verifikasi Tukar Faktur
            </h1>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Kelola proses verifikasi pertukaran dokumen faktur
            </p>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DIVIDER */}
      {/* ================================================= */}

      <hr className="my-5" />

      {/* ================================================= */}
      {/* INFO */}
      {/* ================================================= */}

      <div
        className="
          mb-5
          rounded-xl
          border
          border-orange-100
          bg-orange-50
          px-4
          py-3
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            w-8
            h-8
            rounded-lg
            bg-white
            text-orange-500
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <FaCheck />
        </div>

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-700
            "
          >
            Verifikasi Tukar Faktur
          </p>

          <p
            className="
              text-xs
              text-gray-500
              mt-0.5
            "
          >
            Periksa data tukar faktur kemudian pilih Terima atau Tolak.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* TABLE VERIFIKASI */}
      {/* ================================================= */}

      <TableVerifikasiTukarFaktur
        check={check}
        dimensionScreenW={dimensionScreenW}
        loginAccess={loginAccess}
        onVerifikasiTukarFaktur={
          handleVerifikasiTukarFaktur
        }
      />
    </div>
  );
};

export default VerifikasiTukarFaktur;