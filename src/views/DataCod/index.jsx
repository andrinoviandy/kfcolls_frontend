import React, { useEffect, useState } from "react";

import {
  FaMoneyBillWave,
  FaPlusCircle,
  FaCalendarAlt,
  FaTimes,
  FaSave,
  FaFileInvoiceDollar,
  FaFileInvoice,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { setToggleModal } from "../../redux/n2n/global";
import { decodeData } from "global/helper/jwt";
import { getCookies } from "global/helper/cookie";

import TableDataCod from "./components/TableDataCod";

const getToday = () => new Date().toISOString().slice(0, 10);

const DataCod = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const location = useLocation();

  const { dimensionScreenW, check } = useSelector(
    (state) => state.global
  );

  const [loginAccess, setLoginAccess] = useState();
  const [reloadData, setReloadData] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const [formData, setFormData] = useState({
    no_billing: "",
    tanggal_pelunasan: getToday(),
    nominal_billing: "",
  });

  useEffect(() => {
    const getLoginAccess = async () => {
      const decoded = await decodeData(getCookies("accountAccess"));
      setLoginAccess(decoded);
    };

    getLoginAccess();
  }, []);

  const openInput = () => {
    setFormData({
      no_billing: "",
      tanggal_pelunasan: getToday(),
      nominal_billing: "",
    });
    setShowInput(true);
  };

  const closeInput = () => {
    setShowInput(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const billing = formData.no_billing.trim();
    const nominal = Number(
      String(formData.nominal_billing).replace(/[^0-9]/g, "")
    );

    if (!billing) {
      window.alert("Nomor Billing wajib diisi.");
      return;
    }

    if (!formData.tanggal_pelunasan) {
      window.alert("Tanggal Pelunasan wajib diisi.");
      return;
    }

    if (!nominal || nominal <= 0) {
      window.alert("Nominal Billing harus lebih dari 0.");
      return;
    }

    const currentData = JSON.parse(
      localStorage.getItem("dataCod") || "[]"
    );

    const newData = {
      id: `COD-${Date.now()}`,
      no_billing: billing,
      tanggal_penjualan: getToday(),
      tanggal_pelunasan: formData.tanggal_pelunasan,
      nominal_billing: nominal,
      status: "LUNAS_HARI_INI",
    };

    localStorage.setItem(
      "dataCod",
      JSON.stringify([newData, ...currentData])
    );

    setShowInput(false);
    setReloadData((prev) => !prev);
  };

  return (
    <>
      {/* ================================================= */}
      {/* INPUT DATA COD */}
      {/* ================================================= */}
      {showInput && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50 p-4 flex items-center justify-center"
          onClick={closeInput}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Input Data COD
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Input penjualan hari ini yang lunas hari ini
                </p>
              </div>

              <button
                type="button"
                onClick={closeInput}
                className="btn btn-sm btn-circle bg-gray-100 border-none text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Nomor Billing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="no_billing"
                    value={formData.no_billing}
                    onChange={handleChange}
                    placeholder="Contoh: 2809361541"
                    className="input input-bordered w-full rounded-xl bg-white"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Tanggal Pelunasan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="tanggal_pelunasan"
                      value={formData.tanggal_pelunasan}
                      onChange={handleChange}
                      className="input input-bordered w-full rounded-xl bg-white pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Nominal Billing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="nominal_billing"
                    value={formData.nominal_billing}
                    onChange={handleChange}
                    placeholder="Contoh: 12500000"
                    min="1"
                    className="input input-bordered w-full rounded-xl bg-white"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Masukkan nominal tanpa titik atau koma.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaMoneyBillWave className="text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-green-700">
                        Data COD
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Tanggal Penjualan otomatis menggunakan hari ini dan
                        status akan dicatat sebagai Lunas Hari Ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeInput}
                  className="btn rounded-full bg-white border border-gray-300 text-gray-600 px-6"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn rounded-full bg-primary text-white px-6 gap-2"
                >
                  <FaSave />
                  Simpan Data COD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white px-6 pt-10 pb-5 min-h-full">
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="flex flex-row gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-md">
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

          {/* INPUT COD SEJAJAR DENGAN TITLE */}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={openInput}
              className="btn rounded-full bg-primary text-white hover:opacity-90 px-5 gap-2 shadow-md"
            >
              <FaPlusCircle />
              Input Data COD
            </button>
          </div>
        </div>

        <hr className="my-5" />

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