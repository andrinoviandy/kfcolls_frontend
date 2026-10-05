import React, { useEffect, useState } from "react";

import {
  FaMoneyBillWave,
  FaPlusCircle,
  FaCalendarAlt,
  FaTimes,
  FaSave,
  FaFileInvoice,
} from "react-icons/fa";

import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { decodeData } from "global/helper/jwt";
import { getCookies } from "global/helper/cookie";

import TableDataCod from "./components/TableDataCod";

// SESUAIKAN PATH INI DENGAN STORE DI PROJECT ANDA
import storeSchema from "global/store";
import { swal } from "global/helper/swal";
import CurrencyInput from "components/atoms/CurrencyInput";

const getToday = () => new Date().toISOString().slice(0, 10);

const DataCod = () => {
  const navigation = useNavigate();
  const location = useLocation();

  const { dimensionScreenW, check } = useSelector(
    (state) => state.global
  );

  const [loginAccess, setLoginAccess] = useState();
  const [reloadData, setReloadData] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    no_billing: "",
    tanggal_pelunasan: getToday(),
    nominal_billing: "",
  });

  // =========================================================
  // GET LOGIN ACCESS
  // =========================================================
  useEffect(() => {
    const getLoginAccess = async () => {
      try {
        const decoded = await decodeData(
          getCookies("accountAccess")
        );

        setLoginAccess(decoded);
      } catch (error) {
        console.error(
          "Gagal mendapatkan login access:",
          error
        );
      }
    };

    getLoginAccess();
  }, []);

  // =========================================================
  // OPEN MODAL INPUT DATA COD
  // =========================================================
  const openInput = () => {
    setFormData({
      no_billing: "",
      tanggal_pelunasan: getToday(),
      nominal_billing: "",
    });

    setShowInput(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeInput = () => {
    if (loadingSubmit) return;

    setShowInput(false);
  };

  // =========================================================
  // HANDLE CHANGE FORM
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT DATA COD
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loadingSubmit) return;

    const billing = String(
      formData.no_billing || ""
    ).trim();

    const nominal = Number(
      String(formData.nominal_billing || "").replace(
        /[^0-9]/g,
        ""
      )
    );

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!billing) {
      swal.error("Nomor Billing wajib diisi.");
      return;
    }

    if (!formData.tanggal_pelunasan) {
      swal.error("Tanggal Pelunasan wajib diisi.");
      return;
    }

    if (!nominal || nominal <= 0) {
      swal.error("Nominal Billing harus lebih dari 0.");
      return;
    }

    // =======================================================
    // PAYLOAD
    // =======================================================

    const payload = {
      no_billing: billing,
      tanggal_penjualan: getToday(),
      tanggal_pelunasan:
        formData.tanggal_pelunasan,
      nominal_billing: nominal,
    };

    console.log(
      "PAYLOAD INSERT DATA COD:",
      payload
    );

    try {
      setLoadingSubmit(true);

      // =====================================================
      // HIT API INSERT DATA COD
      // =====================================================

      const response =
        await storeSchema.actions.insertDataCod(
          payload
        );

      console.log(
        "RESPONSE INSERT DATA COD:",
        response
      );

      // =====================================================
      // RESPONSE SUCCESS
      // =====================================================

      if (response?.status === true) {
        // Tutup modal
        setShowInput(false);
        
        await swal.success('Data Berhasil Disimpan !')

        // Reset form
        setFormData({
          no_billing: "",
          tanggal_pelunasan: getToday(),
          nominal_billing: "",
        });

        // Refresh table
        setReloadData(
          (prev) => !prev
        );
      } else {
        swal.error(
          response?.message ||
            "Data COD gagal disimpan."
        );
      }
    } catch (error) {
      console.error(
        "ERROR INSERT DATA COD:",
        error
      );

      swal.error(
        error?.response?.data?.message ||
          error?.message ||
          "Terjadi kesalahan saat menyimpan Data COD."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      {/* ===================================================== */}
      {/* MODAL INPUT DATA COD */}
      {/* ===================================================== */}

      {showInput && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/50
            p-4
            flex
            items-center
            justify-center
            overflow-y-auto
          "
          onClick={closeInput}
        >
          {/* ================================================= */}
          {/* MODAL */}
          {/* ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              w-full
              max-w-lg
              max-h-[90vh]
              flex
              flex-col
              overflow-hidden
              my-auto
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* =============================================== */}
            {/* HEADER MODAL */}
            {/* =============================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                border-gray-200
                flex-shrink-0
              "
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Input Data COD
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Input penjualan hari ini yang
                  lunas hari ini
                </p>
              </div>

              <button
                type="button"
                onClick={closeInput}
                disabled={loadingSubmit}
                className="
                  btn
                  btn-sm
                  btn-circle
                  bg-gray-100
                  border-none
                  text-gray-500
                  hover:bg-gray-200
                "
              >
                <FaTimes />
              </button>
            </div>

            {/* =============================================== */}
            {/* FORM */}
            {/* =============================================== */}

            <form
              onSubmit={handleSubmit}
              className="
                flex
                flex-col
                min-h-0
              "
            >
              {/* ============================================= */}
              {/* CONTENT FORM - OVERFLOW */}
              {/* ============================================= */}

              <div
                className="
                  p-6
                  space-y-4
                  overflow-y-auto
                  flex-1
                "
              >
                {/* =========================================== */}
                {/* NOMOR BILLING */}
                {/* =========================================== */}

                <div>
                  <label
                    className="
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                      mb-2
                    "
                  >
                    Nomor Billing{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="no_billing"
                    value={
                      formData.no_billing
                    }
                    onChange={handleChange}
                    placeholder="Contoh: 2809361541"
                    className="
                      input
                      input-bordered
                      w-full
                      rounded-xl
                      bg-white
                    "
                    autoFocus
                    disabled={loadingSubmit}
                  />
                </div>

                {/* =========================================== */}
                {/* TANGGAL PELUNASAN */}
                {/* =========================================== */}

                <div>
                  <label
                    className="
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                      mb-2
                    "
                  >
                    Tanggal Pelunasan{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <FaCalendarAlt
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="date"
                      name="tanggal_pelunasan"
                      value={
                        formData.tanggal_pelunasan
                      }
                      onChange={handleChange}
                      className="
                        input
                        input-bordered
                        w-full
                        rounded-xl
                        bg-white
                        pl-11
                      "
                      disabled={loadingSubmit}
                    />
                  </div>
                </div>

                {/* =========================================== */}
                {/* NOMINAL BILLING */}
                {/* =========================================== */}

                <div>
                  <label
                    className="
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                      mb-2
                    "
                  >
                    Nominal Billing{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <CurrencyInput
                    name="nominal_billing"
                    value={formData.nominal_billing}
                    onChange={(value, name) =>
                      handleChange({ target: { name, value } })
                    }
                    disabled={loadingSubmit}
                  />
                </div>

                {/* =========================================== */}
                {/* SPACING TAMBAHAN */}
                {/* =========================================== */}

                <div className="h-2" />
              </div>

              {/* ============================================= */}
              {/* FOOTER MODAL */}
              {/* ============================================= */}

              <div
                className="
                  flex
                  justify-end
                  gap-2
                  px-6
                  py-4
                  border-t
                  border-gray-200
                  flex-shrink-0
                  bg-white
                "
              >
                <button
                  type="button"
                  onClick={closeInput}
                  disabled={loadingSubmit}
                  className="
                    btn
                    rounded-full
                    bg-white
                    border
                    border-gray-300
                    text-gray-600
                    px-6
                  "
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="
                    btn
                    rounded-full
                    bg-primary
                    text-white
                    px-6
                    gap-2
                    min-w-[160px]
                  "
                >
                  {loadingSubmit ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Simpan Data COD
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div className="bg-white px-6 pt-10 pb-5 min-h-full">
        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

        <div className="flex flex-col lg:flex-row justify-between gap-5">
          {/* ================================================ */}
          {/* TITLE */}
          {/* ================================================ */}

          <div className="flex flex-row gap-3 items-center">
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-100
                flex
                items-center
                justify-center
                text-blue-600
                shadow-md
              "
            >
              <FaFileInvoice />
            </div>

            <div className="flex flex-col gap-0">
              <h1 className="text-xl font-bold text-gray-800">
                Data COD
              </h1>

              <p className="text-xs text-gray-400">
                Kelola Data Penjualan COD Hari Ini
              </p>
            </div>
          </div>

          {/* ================================================ */}
          {/* BUTTON INPUT COD */}
          {/* ================================================ */}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={openInput}
              className="
                btn
                rounded-full
                bg-primary
                text-white
                hover:opacity-90
                px-5
                gap-2
                shadow-md
              "
            >
              <FaPlusCircle />
              Input Data COD
            </button>
          </div>
        </div>

        {/* =================================================== */}
        {/* DIVIDER */}
        {/* =================================================== */}

        <hr className="my-5" />

        {/* =================================================== */}
        {/* TABLE DATA COD */}
        {/* =================================================== */}

        <TableDataCod
          navigation={navigation}
          location={location}
          dimensionScreenW={dimensionScreenW}
          check={check}
          loginAccess={loginAccess}
          reloadData={reloadData}
          setReloadData={setReloadData}
        />
      </div>
    </>
  );
};

export default DataCod;