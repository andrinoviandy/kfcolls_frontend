
import React, { useEffect, useState } from "react";

import {
  FaBullseye,
  FaCloudUploadAlt,
} from "react-icons/fa";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  setToggleModal,
} from "../../redux/n2n/global";

import {
  decodeData,
} from "global/helper/jwt";

import {
  getCookies,
} from "global/helper/cookie";

import ModalUploadTarget from "./components/Modal/ModalUploadTarget";
import TableMasterTarget from "./components/TableMasterTarget";

// =====================================================
// COMPONENT
// =====================================================

const MasterTarget = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const location = useLocation();

  const {
    dimensionScreenW,
    check,
  } = useSelector((state) => state.global);

  const [loginAccess, setLoginAccess] = useState(null);
  const [reloadData, setReloadData] = useState(false);

  // ===================================================
  // LOGIN ACCESS
  // ===================================================

  useEffect(() => {
    let isMounted = true;

    const getLoginAccess = async () => {
      try {
        const decoded = await decodeData(
          getCookies("accountAccess")
        );

        if (isMounted) {
          setLoginAccess(decoded);
        }
      } catch (error) {
        console.error(
          "Gagal mengambil login access:",
          error
        );

        if (isMounted) {
          setLoginAccess(null);
        }
      }
    };

    getLoginAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  // ===================================================
  // UPLOAD TARGET
  // ===================================================

  const handleUploadTarget = (e) => {
    e.preventDefault();

    dispatch(
      setToggleModal({
        isOpen: true,
        modal: "modalUploadTarget",
      })
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      {/* ================================================= */}
      {/* MODAL UPLOAD TARGET */}
      {/* ================================================= */}

      <ModalUploadTarget
        reloadData={reloadData}
        setReloadData={setReloadData}
      />

      {/* ================================================= */}
      {/* PAGE MASTER TARGET */}
      {/* ================================================= */}

      <div className="min-h-full bg-white px-4 pt-6 pb-5 sm:px-6 sm:pt-10">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          {/* TITLE */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm">
              <FaBullseye size={20} />
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-800">
                Master Target
              </h1>

              <p className="text-xs text-gray-400">
                Kelola Data Master Target di sini
              </p>
            </div>
          </div>

          {/* ACTION */}

          <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
            <button
              type="button"
              onClick={handleUploadTarget}
              className="
                btn
                min-h-10
                rounded-full
                border
                border-primary
                bg-white
                px-5
                text-primary
                shadow-sm
                transition
                hover:bg-blue-50
              "
            >
              <FaCloudUploadAlt size={17} />
              <span>Upload Target</span>
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <hr className="my-5 border-gray-200" />

        {/* ================================================= */}
        {/* TABLE MASTER TARGET */}
        {/* ================================================= */}

        <TableMasterTarget
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

export default MasterTarget;
