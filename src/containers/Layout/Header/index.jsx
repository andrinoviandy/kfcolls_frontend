import React, { useEffect, useRef, useState } from "react";
import {
  setDimensionHeight,
  setToggleModal,
  setToggleSidebar,
} from "../../../redux/n2n/global";
import { useDispatch, useSelector } from "react-redux";
import { decodeData } from "global/helper/jwt";
import { getCookies, removeCookies, setCookies } from "global/helper/cookie";
import { IoPersonSharp, IoPersonCircleSharp, IoReader, IoNotifications, IoCalendarOutline, IoCheckmarkDone, IoCheckmarkDoneOutline, IoNotificationsOutline, IoNotificationsSharp } from "react-icons/io5";
import storeSchema from "global/store";
import { swal } from "global/helper/swal";
import { useLocation, useNavigate } from "react-router-dom";
import { Label, Modal } from "components/atoms";
import { FaArrowRight, FaBell, FaCheckDouble, FaChevronDown, FaChevronLeft, FaChevronRight, FaCogs, FaFileAlt, FaInbox, FaTags, FaUser, FaUserAlt, FaUserSlash } from "react-icons/fa";
import { formatDateJam } from "global/helper/formatDate";

const Header = (props) => {
  // const { listNotif } = props
  const dispatch = useDispatch();
  const { toggleModal } = useSelector(state => state.global);
  const navigation = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  const notificationListRef = useRef(null);
  const { dimensionComponent, dimensionScreenW, toggleSidebar, check } =
    useSelector((state) => state.global);
  const [loginData, setLoginData] = useState({});
  const dummyListNotif = [
    {
      notifikasi_push_id: "NTF001",
      no_pengajuan: "280000992",
      title: "Faktur berhasil diantar",
      body: "Faktur 280000992 berhasil diantarkan ke Dinkes Kota Medan.",
      created_at: "2026-08-16T09:31:00",
      is_read: "T",
    },

    {
      notifikasi_push_id: "NTF002",
      no_pengajuan: "280009812",
      title: "Faktur berhasil diantar",
      body: "Faktur 280009812 berhasil diantarkan ke Apotek Madju Djaya.",
      created_at: "2026-08-16T09:35:00",
      is_read: "T",
    },

    {
      notifikasi_push_id: "NTF003",
      no_pengajuan: "28000912",
      title: "Pembayaran tunai berhasil diterima",
      body: "Rp140.000.000 berhasil diterima untuk pembayaran tunai faktur 28000912 oleh Apotek Rusli.",
      created_at: "2026-08-16T09:20:00",
      is_read: "F",
    },

    {
      notifikasi_push_id: "NTF004",
      no_pengajuan: "2800091281",
      title: "Pembayaran transfer berhasil diterima",
      body: "Rp140.000.000 berhasil diterima untuk pembayaran transfer faktur 2800091281 oleh RSUD Pasuruan.",
      created_at: "2026-08-16T09:15:00",
      is_read: "F",
    },

    {
      notifikasi_push_id: "NTF005",
      no_pengajuan: "280009134",
      title: "Faktur berhasil diantar",
      body: "Faktur 280009134 berhasil diantarkan ke Klinik Sehat Medika.",
      created_at: "2026-08-16T08:55:00",
      is_read: "T",
    },

    {
      notifikasi_push_id: "NTF006",
      no_pengajuan: "280009155",
      title: "Faktur berhasil diantar",
      body: "Faktur 280009155 berhasil diantarkan ke Rumah Sakit Harapan Bunda.",
      created_at: "2026-08-16T08:40:00",
      is_read: "F",
    },

    {
      notifikasi_push_id: "NTF007",
      no_pengajuan: "280009167",
      title: "Pembayaran tunai berhasil diterima",
      body: "Rp85.500.000 berhasil diterima untuk pembayaran tunai faktur 280009167 oleh Apotek Sejahtera.",
      created_at: "2026-08-16T08:25:00",
      is_read: "F",
    },

    {
      notifikasi_push_id: "NTF008",
      no_pengajuan: "280009188",
      title: "Pembayaran transfer berhasil diterima",
      body: "Rp215.000.000 berhasil diterima untuk pembayaran transfer faktur 280009188 oleh RSUD Dr. Soetomo.",
      created_at: "2026-08-16T08:10:00",
      is_read: "T",
    },
  ];

  const [listNotif, setListNotif] = useState(dummyListNotif);
  const [role, setRole] = useState({});
  const [access, setAccess] = useState({});
  const [loginAccess, setLoginAccess] = useState()
  const PAGE_LIMIT = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const get = async () => {
      const decoded = await decodeData(getCookies('accountAccess'))
      setLoginAccess(decoded)
    }
    get()
  }, [])


  // const getListNotification = async () => {
  //   try {
  //     const res = await storeSchema.actions.getListNotification({

  //     })
  //     if (res.status) {
  //       setListNotif(res?.data);
  //     } else {
  //       setListNotif([])
  //     }
  //   } catch (error) {
  //     console.log('ERROR', error);
  //     setListNotif([])
  //   }
  // }
  // const getListNotification = async (pageNumber = 1, mode = "replace") => {
  //   const isLoadMore = pageNumber > 1;

  //   if (isLoadMore && loadingMore) return;
  //   if (!isLoadMore && refreshing) return;

  //   if (isLoadMore) {
  //     setLoadingMore(true);
  //   } else {
  //     setRefreshing(true);
  //   }

  //   try {
  //     const res = await storeSchema.actions.getListNotification({
  //       page: pageNumber,
  //       limit: PAGE_LIMIT,
  //     });

  //     const nextData = Array.isArray(res?.data) ? res.data : [];

  //     setListNotif(prev => {
  //       if (pageNumber === 1 || mode === "replace") {
  //         return nextData;
  //       }

  //       return [...prev, ...nextData];
  //     });

  //     setHasMore(nextData.length >= PAGE_LIMIT);
  //     setPage(pageNumber);
  //   } finally {
  //     if (isLoadMore) {
  //       setLoadingMore(false);
  //     } else {
  //       setRefreshing(false);
  //     }
  //   }
  // };

  const refreshNotifications = async () => {
    // await getListNotification(1, "replace");
  };

  const handleScroll = (e) => {
    const container = notificationListRef.current || e.currentTarget;

    if (!container) return;

    const isBottomReached = container.scrollTop + container.clientHeight >= container.scrollHeight - 5;

    if (!isBottomReached || !hasMore || loadingMore || refreshing) return;

    const nextPage = page + 1;
    // getListNotification(nextPage, "append");
  };

  useEffect(() => {
    if (contentRef.current) {
      function handleResize() {
        dispatch(setDimensionHeight(contentRef.current.offsetHeight));
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [dispatch, toggleSidebar]);

  const handleLogout = async () => {
    try {
      swal.loading()
      const res = await storeSchema.actions.logout(getCookies("loginData"));
      if (res?.status) {
        swal.close()
        removeCookies("loginData");
        removeCookies("accountAccess");
        window.location.href = "/login";
      } else {
        swal.error("Gagal Logout !");
      }
    } catch (error) {
      swal.error(error);
    }
  };

  const handleRole = (e) => {
    setRole(JSON.parse(e.target.value))
  };

  const handleFlag = async (status_id, no_pengajuan) => {
    const payload = {
      notifikasi_push_id: status_id,
      is_read: 'Y'
    }
    const res = await storeSchema.actions.updateNotifikasiPush(payload)
    if (res?.status) {
      refreshNotifications()
      navigation(loginAccess?.role_id === 'RL01' ? '/data-pengajuan' : '/approval-pengajuan', {
        state: {
          ...location.state,
          project: loginAccess?.role_id === 'RL01' ? 'Data Pengajuan' : 'Approval Pengajuan',
          no_pengajuan: no_pengajuan,
        },
      });
    }
  }

  const handleReadAll = async () => {
    const res = await storeSchema.actions.readAllNotification()
    if (res?.status) {
      refreshNotifications()
    }
  }

  useEffect(() => {
    if (!loginAccess?.role_id || loginAccess.role_id === 'RL00') return undefined;

    const interval = window.setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loginAccess?.role_id]);

  const getInitials = (name) => {
    if (!name) return "";

    const words = name.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  useEffect(() => {
    const get = async () => {
      const decoded = await decodeData(getCookies('accountAccess'))
      setAccess(decoded)
    }
    get()
    refreshNotifications()
  }, [])

  return (
    <div className="z-50">
      <div
        ref={contentRef}
        className={`${dimensionScreenW < 768 && check ? "bringToBack" : "z-20"
          } fixed py-2 px-6 bg-base-100 shadow-lg`}
        style={{ width: dimensionComponent.width }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex gap-5">
            {/* <label
              htmlFor="left-sidebar-drawer"
              className="btn drawer-button"
              onClick={() => dispatch(setToggleSidebar(!toggleSidebar))}
            >
              <div>
                <div className="burger-icon"></div>
                <div className="burger-icon"></div>
                <div className="burger-icon"></div>
              </div>
            </label> */}
            <button
              type="button"
              className="
                w-12 h-12
                flex items-center justify-center
                rounded-xl
                bg-blue-50
                text-primary
                hover:bg-blue-100
                hover:text-orange-500
                transition-all duration-200
                shadow-lg
              "
              onClick={() => dispatch(setToggleSidebar(!toggleSidebar))}
              title={toggleSidebar ? "Tutup Sidebar" : "Buka Sidebar"}
            >
              {toggleSidebar ? (
                <FaChevronLeft className="text-xl" />
              ) : (
                <FaChevronRight className="text-xl" />
              )}
            </button>
            {(!toggleSidebar || dimensionScreenW <= 767) && (
              <div className="flex items-center">
                <div
                  className="
                      text-[30px]
                      font-extrabold
                      tracking-wide
                      leading-none
                      select-none
                    "
                >

                  <span className="text-orange-500">
                    KF
                  </span>

                  <span className="text-primary">
                    COLLS
                  </span>

                </div>
              </div>
            )}
          </div>
          {/* <h1 className="text-2xl font-semibold ml-2">{"pageTitle"}</h1> */}

          <div className="flex gap-4 items-center">

            {/* notification */}
            {access?.role_id !== 'RL00' && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="m-1 relative">
                  {/* <IoNotifications className="text-3xl text-primary" />
                  {listNotif && listNotif.length > 0 && listNotif.filter(a => a.is_read === 'T').length > 0 && (
                    <span className="bg-red-500 w-4 h-4 text-white rounded-full absolute left-0 top-0 text-[8px] text-center animate-bounce">
                      {listNotif.filter(a => a.is_read === 'T').length > 99 ? '99+' : listNotif.filter(a => a.is_read === 'T').length}
                    </span>
                  )} */}
                  <div
                    className="
    relative
    w-11 h-11
    flex items-center justify-center
    rounded-full
    bg-blue-50
    text-primary
    hover:bg-blue-100
    hover:text-orange-500
    transition-all duration-200
    cursor-pointer
  "
                  >
                    <FaBell className="text-xl" />

                    {listNotif &&
                      listNotif.length > 0 &&
                      listNotif.filter(a => a.is_read === 'T').length > 0 && (
                        <span
                          className="
          absolute
          -top-1
          -right-1
          min-w-[18px]
          h-[18px]
          px-1
          flex items-center justify-center
          bg-orange-500
          text-white
          rounded-full
          text-[9px]
          font-bold
          border-2 border-white
        "
                        >
                          {listNotif.filter(a => a.is_read === 'T').length > 99
                            ? '99+'
                            : listNotif.filter(a => a.is_read === 'T').length}
                        </span>
                      )}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[290px] lg:w-[350px] shadow-sm divide-y-2 divide-base-200/70 shadow-blue-700 border overflow-x-auto"
                >
                  <div className="flex justify-between">
                    <span className="text-lg font-bold mx-3 py-3 items-center gap-2 flex text-primary flex-row">
                      <div className="bg-blue-200 rounded-full p-1">
                        <IoNotificationsSharp />
                      </div>
                      Notifikasi
                    </span>
                    <div className="flex items-center">
                      <div className="flex justify-center mr-3">
                        <button
                          onClick={handleReadAll}
                          className="
                            inline-flex
                            items-center
                            py-1
                            px-1.5
                            gap-2 
                            rounded-full
                            bg-primary
                            hover:bg-blue-800
                            text-white
                            shadow-md
                            transition-all
                            duration-200
                            hover:scale-105
                          "
                        >
                          <FaCheckDouble className="text-xs" />
                          Semua Terbaca
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-t-4 w-full"></div>
                  <div
                    ref={notificationListRef}
                    style={{ maxHeight: 250, overflowY: "auto" }}
                    onScroll={handleScroll}
                  >
                    {dummyListNotif && dummyListNotif.length > 0 ? dummyListNotif.map((item, index) => (
                      <React.Fragment key={index}>
                        <li className="text-sm relative">
                          <a onClick={() => handleFlag(item?.notifikasi_push_id, item?.no_pengajuan)}>
                            {item?.is_read === 'T' ? (
                              <div className="absolute top-1 right-1">
                                <span className="relative flex size-3">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                                </span>
                              </div>
                            ) : (
                              <div className="absolute top-1 right-1">
                                <IoCheckmarkDoneOutline className="text-gray-500 text-lg" />
                              </div>
                            )}

                            <div className="flex flex-col w-full">
                              <div className="flex flex-wrap text-wrap font-bold gap-3 items-center">

                                <div className="text-orange-500 flex items-center gap-1">
                                  <FaTags />
                                  {item?.no_pengajuan}
                                </div>

                                {/* <div className="text-orange-600 flex items-center gap-1">
                                  <FaUserAlt />
                                  {item?.NAMA}
                                </div> */}
                                {/* {item?.STATUS === 'APPROVE' && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    APPROVED
                                  </span>
                                )} */}

                                {/* {item?.STATUS === 'REJECT' && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                    REJECTED
                                  </span>
                                )} */}

                                {/* {!item?.STATUS && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    PENDING
                                  </span>
                                )} */}

                              </div>
                              <div className="font-semibold text-black">
                                {item?.title}
                              </div>
                              <div className="flex w-full">
                                <div className="relative group inline-block w-max">
                                  <div className="truncate">
                                    {item?.body?.substring(0, 37) + '...' || '-'}
                                  </div>

                                  <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-md hidden group-hover:block z-50 w-70 whitespace-normal text-justify">
                                    {item?.body || '-'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex w-[220px] lg:w-[300px] items-center justify-end gap-1 text-xs text-gray-500">
                                <IoCalendarOutline className="p-0 m-0" />
                                {formatDateJam(item?.created_at)}
                              </div>

                            </div>
                          </a>
                        </li>

                        <div className="border-t-2 w-full"></div>
                      </React.Fragment>
                    )) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-6 text-center">
                        <div
                          className="
                                        flex h-24 w-24 items-center justify-center
                                        rounded-full
                                        bg-blue-50
                                        border border-blue-100
                                        shadow-sm
                                      "
                        >
                          <FaInbox className="text-5xl text-blue-400" />
                        </div>

                        <h3 className="mt-6 text-lg font-semibold text-gray-700">
                          Tidak ada notifikasi
                        </h3>

                      </div>
                    )}
                  </div>
                </ul>
              </div>
            )}

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="flex gap-3">
                {/* <div className="">
                  <div className="rounded-full items-center flex justify-center">
                    <IoPersonCircleSharp className="text-5xl text-primary" />
                    
                  </div>
                </div> */}
                <div className="relative">
                  <div
                    className="
      w-11 h-11
      rounded-full
      bg-primary
      flex items-center justify-center
      text-white
      shadow-sm
      border-2 border-blue-100
    "
                  >
                    <FaUser className="text-lg" />
                  </div>

                  {/* Online indicator */}
                  <span
                    className="
      absolute
      bottom-0
      right-0
      w-3
      h-3
      bg-green-500
      rounded-full
      border-2
      border-white
    "
                  />
                </div>
                {dimensionScreenW > 767 && (
                  <div className="items-center flex gap-3">
                    <div>
                      {/* <p className="font-semibold">{loginData?.NAMA}</p> */}
                      <div className="font-semibold">
                        {access?.cabang_id !== '2000' ? access?.cabang : access?.unit_kerja ?? access?.nama}
                      </div>
                      <div className="text-xs font-medium flex flex-row gap-2">
                        {/* {loginData?.NAMA_SUB} */}
                        {/* <div>
                          {access?.nip}
                        </div> */}
                        <div className="flex flex-col gap-[-5px]">
                          <div>
                            {access?.cabang_id !== '2000' ? access?.jabatan : access?.role_id === 'RL17' ? access?.jabatan : (access?.jenis_user ?? (access?.role_id === 'RL16' ? access?.role : (access?.role_id === 'RL17' ? access?.jabatan : 'Pemohon')))}
                          </div>
                          {/* <div>
                            {access?.cabang}
                          </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      {/* <BtnDropdown /> */}
                      <div
                        className="
    w-8 h-8
    rounded-full
    bg-gray-100
    flex items-center justify-center
    text-blue-700
    hover:bg-blue-50
    transition-all
  "
                      >
                        <FaChevronDown className="text-sm" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                {/* USER INFO CARD */}
                {dimensionScreenW <= 767 && (
                  <li className="mb-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-base-200">

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold uppercase">
                        {access?.username?.charAt(0) || "U"}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm leading-tight">
                          {access?.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {access?.role}
                        </p>
                      </div>
                    </div>
                  </li>
                )}

                <li onClick={() => navigation('/ubah-password')}>
                  <p className="justify-between">
                    Ubah Password
                    <span className="badge badge-primary badge-sm">
                      <FaCogs />
                    </span>
                  </p>
                </li>

                {/* {listAccess?.length > 1 && (
                  <li>
                    <p
                      onClick={() => {
                        dispatch(setToggleModal({
                          isOpen: !toggleModal.isOpen,
                          modal: "selectRole"
                        }))
                      }}
                    >
                      Change Roles
                    </p>
                  </li>
                )} */}

                <li>
                  <p onClick={handleLogout} className="text-error">
                    Logout
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
