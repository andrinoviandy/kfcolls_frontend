import React, {
  useEffect,
  useState,
} from "react";

import {
  FaChartLine,
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

import TableReportSales from "./components/TableReportSales";


// =====================================================
// COMPONENT
// =====================================================

const ReportSales = () => {

  const location = useLocation();


  // ===================================================
  // GLOBAL
  // ===================================================

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
  // LOGIN ACCESS
  // ===================================================

  useEffect(() => {

    const getLoginAccess = async () => {

      try {

        const accountAccess =
          getCookies(
            "accountAccess"
          );

        if (!accountAccess) {
          return;
        }

        const decoded =
          await decodeData(
            accountAccess
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


    getLoginAccess();

  }, []);


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

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* ================================================= */}
          {/* ICON */}
          {/* ================================================= */}

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-blue-100
              flex
              items-center
              justify-center
              text-primary
              shadow-md
            "
          >

            <FaChartLine />

          </div>


          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

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
              Report Sales
            </h1>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Laporan dan analisis penjualan
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
      {/* TABLE REPORT SALES */}
      {/* ================================================= */}

      <TableReportSales
        check={
          check
        }
        dimensionScreenW={
          dimensionScreenW
        }
        loginAccess={
          loginAccess
        }
      />

    </div>

  );

};


export default ReportSales;