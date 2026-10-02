import React, {
  useEffect,
  useState,
} from "react";

import BGLEAF from "assets/panduan-cost-tracking.jpg";
import PROFILE_DEFAULT from "assets/profile-default.jpg";

import {
  IoPerson,
  IoBriefcase,
  IoSendSharp,
  IoMail,
  IoPersonCircle,
  IoPeopleCircle,
  IoShieldCheckmark,
  IoTimeOutline,
  IoGrid,
  IoLink,
  IoChevronForward,
} from "react-icons/io5";

import {
  getCookies,
} from "global/helper/cookie";

import {
  decodeData,
} from "global/helper/jwt";

import {
  formatDate,
} from "global/helper/formatDate";

import ResetPassword from "./ResetPassword";

import {
  FaTag,
} from "react-icons/fa";


// =====================================================
// INFO ITEM
// =====================================================

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div
      className="
        flex
        items-start
        gap-4
        p-3
        rounded-2xl
        hover:bg-blue-50/60
        transition-all
        duration-300
        group
      "
    >

      {/* ICON */}

      <div
        className="
          w-11
          h-11
          rounded-xl
          bg-blue-50
          flex
          items-center
          justify-center
          text-blue-600
          text-xl
          shrink-0
          group-hover:bg-blue-600
          group-hover:text-white
          transition-all
          duration-300
        "
      >
        {icon}
      </div>


      {/* CONTENT */}

      <div className="flex-1 min-w-0">

        <p
          className="
            text-xs
            text-gray-400
            mb-1
          "
        >
          {label}
        </p>

        <p
          className="
            text-sm
            font-semibold
            text-gray-800
            break-words
          "
        >
          {value || "-"}
        </p>

      </div>

    </div>
  );
};


// =====================================================
// MAIN COMPONENT
// =====================================================

const UbahPassword = () => {

  const [
    activeMenu,
    setActiveMenu,
  ] = useState("profile");

  const [
    dataUser,
    setDataUser,
  ] = useState();


  // ===================================================
  // GET USER DATA
  // ===================================================

  useEffect(() => {

    const getUserData = async () => {

      try {

        const loginData =
          getCookies(
            "accountAccess"
          );

        const decode =
          await decodeData(
            loginData
          );

        setDataUser(
          decode
        );

      } catch (error) {

        console.error(
          "ERROR GET USER DATA:",
          error
        );

      }

    };

    getUserData();

  }, []);


  // ===================================================
  // ACTIVITIES
  // ===================================================

  const activities = [
    {
      description:
        "Create a new project for client",

      subDescription:
        "Darren Schmitt II",

      iconColor:
        "bg-green-500",

      timestamp:
        "2025-04-18T14:30:00",
    },

    {
      description:
        "Public Meeting",

      subDescription:
        "",

      iconColor:
        "bg-orange-500",

      timestamp:
        "2024-09-30T08:00:00",
    },

    {
      description:
        "Order #37745 from September",

      subDescription:
        "",

      iconColor:
        "bg-yellow-500",

      timestamp:
        "2025-01-10T09:00:00",
    },

    {
      description:
        "8 Invoices have been paid",

      subDescription:
        "",

      iconColor:
        "bg-red-500",

      timestamp:
        "2025-02-12T10:00:00",
    },
  ];


  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#fffaf0]
        pb-10
      "
    >

      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}

      <div
        className="
          relative
          h-[280px]
          lg:h-[320px]
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            `url(${BGLEAF})`,
        }}
      >

        {/* OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/65
            via-black/45
            to-black/30
          "
        />


        {/* HERO CONTENT */}

        <div
          className="
            relative
            z-10
            flex
            flex-col
            lg:flex-row
            items-center
            lg:items-end
            justify-between
            h-full
            px-5
            sm:px-8
            lg:px-10
            pb-8
          "
        >

          {/* LEFT */}

          <div
            className="
              flex
              flex-col
              lg:flex-row
              items-center
              gap-5
              mt-8
              lg:mt-0
            "
          >

            {/* PROFILE */}

            <div className="relative">

              <div
                className="
                  p-1
                  rounded-full
                  bg-white/20
                  backdrop-blur-sm
                "
              >

                <img
                  src={PROFILE_DEFAULT}
                  alt="avatar"
                  className="
                    w-28
                    h-28
                    lg:w-32
                    lg:h-32
                    rounded-full
                    border-4
                    border-white
                    shadow-2xl
                    object-cover
                  "
                />

              </div>


              {/* ONLINE */}

              <div
                className="
                  absolute
                  bottom-2
                  right-2
                  w-5
                  h-5
                  rounded-full
                  bg-green-500
                  border-2
                  border-white
                  shadow
                "
              />

            </div>


            {/* USER INFO */}

            <div
              className="
                text-white
                text-center
                lg:text-left
              "
            >

              <h1
                className="
                  text-2xl
                  lg:text-3xl
                  font-bold
                  tracking-tight
                "
              >
                {dataUser?.NAMA ||
                  dataUser?.nama ||
                  "-"}
              </h1>


              <p
                className="
                  text-gray-200
                  text-sm
                  mt-1
                "
              >
                {dataUser?.NAMA_SUB ||
                  dataUser?.nama_sub ||
                  "-"}
              </p>


              {/* BADGES */}

              <div
                className="
                  flex
                  flex-wrap
                  justify-center
                  lg:justify-start
                  gap-2
                  mt-4
                "
              >

                <div
                  className="
                    bg-white/15
                    backdrop-blur-md
                    border
                    border-white/20
                    px-4
                    py-2
                    rounded-xl
                    text-xs
                    font-medium
                  "
                >
                  {dataUser?.HAKAKSES_DESC ||
                    "-"}
                </div>


                <div
                  className="
                    bg-white/15
                    backdrop-blur-md
                    border
                    border-white/20
                    px-4
                    py-2
                    rounded-xl
                    text-xs
                    font-medium
                  "
                >
                  {dataUser?.NAMA_CABANG ||
                    "-"}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* MENU */}
      {/* ================================================= */}

      <div
        className="
          px-4
          lg:px-10
          -mt-8
          relative
          z-20
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            border
            border-gray-100
            p-2.5
            flex
            flex-wrap
            gap-2
          "
        >

          {/* PROFILE */}

          <button
            type="button"
            onClick={() =>
              setActiveMenu(
                "profile"
              )
            }
            className={`
              px-5
              py-3
              rounded-2xl
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              transition-all
              duration-300

              ${
                activeMenu ===
                "profile"
                  ? `
                    bg-blue-600
                    text-white
                    shadow-md
                    shadow-blue-600/20
                  `
                  : `
                    text-gray-600
                    hover:bg-blue-50
                    hover:text-blue-600
                  `
              }
            `}
          >

            <IoPersonCircle
              className="text-xl"
            />

            Profil dan Ubah Password

          </button>


          {/* ACTIVITY */}

          {/*
          <button
            type="button"
            onClick={() =>
              setActiveMenu(
                "activity"
              )
            }
            className={`
              px-5
              py-3
              rounded-2xl
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              transition-all
              duration-300

              ${
                activeMenu ===
                "activity"
                  ? `
                    bg-blue-600
                    text-white
                    shadow-md
                  `
                  : `
                    text-gray-600
                    hover:bg-blue-50
                    hover:text-blue-600
                  `
              }
            `}
          >
            <IoGrid className="text-xl" />
            Activity
          </button>
          */}


          {/* CONNECTIONS */}

          {/*
          <button
            type="button"
            onClick={() =>
              setActiveMenu(
                "connections"
              )
            }
            className={`
              px-5
              py-3
              rounded-2xl
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              transition-all
              duration-300

              ${
                activeMenu ===
                "connections"
                  ? `
                    bg-blue-600
                    text-white
                    shadow-md
                  `
                  : `
                    text-gray-600
                    hover:bg-blue-50
                    hover:text-blue-600
                  `
              }
            `}
          >
            <IoLink className="text-xl" />
            Connections
          </button>
          */}

        </div>

      </div>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-12
          gap-6
          px-4
          lg:px-10
          py-7
        "
      >

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <div
          className="
            xl:col-span-4
          "
        >

          <div
            className="
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-100
              p-5
              lg:p-6
            "
          >

            {/* CARD HEADER */}

            <div
              className="
                flex
                items-center
                gap-3
                mb-5
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                "
              >

                <IoShieldCheckmark
                  className="
                    text-blue-600
                    text-2xl
                  "
                />

              </div>


              <div>

                <h2
                  className="
                    font-bold
                    text-lg
                    text-gray-800
                  "
                >
                  Tentang User
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-0.5
                  "
                >
                  Informasi Personal
                </p>

              </div>

            </div>


            {/* DIVIDER */}

            <div
              className="
                h-px
                bg-gray-100
                mb-3
              "
            />


            {/* USER INFORMATION */}

            <div
              className="
                space-y-1
              "
            >

              <InfoItem
                icon={
                  <FaTag />
                }
                label="NIP"
                value={
                  dataUser?.nip
                }
              />


              <InfoItem
                icon={
                  <IoPerson />
                }
                label="Nama Lengkap"
                value={
                  dataUser?.nama
                }
              />


              <InfoItem
                icon={
                  <IoBriefcase />
                }
                label="Profit Center"
                value={
                  dataUser?.cabang
                }
              />


              <InfoItem
                icon={
                  <IoMail />
                }
                label="Email"
                value={
                  dataUser?.email
                }
              />


              <InfoItem
                icon={
                  <IoSendSharp />
                }
                label="Role"
                value={
                  dataUser?.role
                }
              />

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <div
          className="
            xl:col-span-8
            min-w-0
          "
        >

          {/* ================================================= */}
          {/* PROFILE */}
          {/* ================================================= */}

          {activeMenu ===
            "profile" && (
            <div
              className="
                bg-white
                rounded-3xl
                shadow-sm
                border
                border-gray-100
                p-5
                lg:p-6
              "
            >

              <ResetPassword
                dataUser={
                  dataUser
                }
              />

            </div>
          )}


          {/* ================================================= */}
          {/* ACTIVITY */}
          {/* ================================================= */}

          {activeMenu ===
            "activity" && (
            <div
              className="
                bg-white
                rounded-3xl
                shadow-sm
                border
                border-gray-100
                p-6
              "
            >

              <div className="mb-8">

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
                      rounded-2xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <IoGrid
                      className="
                        text-blue-600
                        text-xl
                      "
                    />

                  </div>


                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                        text-gray-800
                      "
                    >
                      Recent Activity
                    </h2>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      Aktivitas terbaru kamu
                    </p>

                  </div>

                </div>

              </div>


              {/* TIMELINE */}

              <div
                className="
                  relative
                  border-l-2
                  border-blue-100
                  ml-5
                "
              >

                {activities.map(
                  (
                    activity,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        mb-8
                        ml-8
                        relative
                      "
                    >

                      {/* DOT */}

                      <div
                        className={`
                          absolute
                          -left-[42px]
                          top-1
                          w-5
                          h-5
                          rounded-full
                          border-4
                          border-white
                          shadow
                          ${activity.iconColor}
                        `}
                      />


                      {/* ACTIVITY CARD */}

                      <div
                        className="
                          bg-gray-50
                          rounded-2xl
                          p-4
                          border
                          border-gray-100
                          hover:shadow-md
                          hover:border-blue-100
                          transition-all
                          duration-300
                        "
                      >

                        <div
                          className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-3
                          "
                        >

                          <div>

                            <h3
                              className="
                                font-semibold
                                text-gray-800
                                text-sm
                              "
                            >
                              {
                                activity.description
                              }
                            </h3>


                            {activity.subDescription && (
                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                  mt-1
                                "
                              >
                                Client :{" "}
                                {
                                  activity.subDescription
                                }
                              </p>
                            )}

                          </div>


                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-xs
                              text-gray-500
                            "
                          >

                            <IoTimeOutline
                              className="
                                text-blue-600
                              "
                            />

                            {formatDate(
                              activity.timestamp
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>
          )}


          {/* ================================================= */}
          {/* CONNECTIONS */}
          {/* ================================================= */}

          {activeMenu ===
            "connections" && (
            <div
              className="
                bg-white
                rounded-3xl
                shadow-sm
                border
                border-gray-100
                p-10
                text-center
              "
            >

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-4
                "
              >

                <IoPeopleCircle
                  className="
                    text-4xl
                    text-blue-600
                  "
                />

              </div>


              <h2
                className="
                  text-xl
                  font-bold
                  text-gray-800
                "
              >
                Connections
              </h2>


              <p
                className="
                  text-sm
                  text-gray-500
                  mt-2
                "
              >
                Feature is under development
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};


export default UbahPassword;