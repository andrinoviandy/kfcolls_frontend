import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import SidebarSubmenu from './SidebarSubmenu';

import { useSelector } from 'react-redux';
import { getCookies } from 'global/helper/cookie';
import { decodeData } from 'global/helper/jwt';

import { dummyMenu } from './dummyMenu';

// ICONS
import {
  FaTachometerAlt,
  FaFileAlt,
  FaChartBar,
  FaDatabase,
  FaBook,
  FaUserAlt,
  FaUserCheck,
  FaUsersCog,
  FaWallet,
  FaCalculator,
  FaReceipt,
  FaFileInvoiceDollar,
  FaCheckDouble
} from 'react-icons/fa';

import { FaRoute } from 'react-icons/fa6';

import { Signature } from 'lucide-react';

const normalizePath = (path) => {
  if (!path) return '/';

  const cleaned = path.trim();

  if (!cleaned || cleaned === '/') return '/';

  return cleaned.replace(/\/+$/, '');
};

const isRouteActive = (targetPath, currentPath) => {
  const normalizedTarget = normalizePath(targetPath);
  const normalizedCurrent = normalizePath(currentPath);

  if (!normalizedTarget || normalizedTarget === '/') {
    return normalizedCurrent === '/';
  }

  return (
    normalizedCurrent === normalizedTarget ||
    normalizedCurrent.startsWith(`${normalizedTarget}/`)
  );
};

const Sidebar = () => {

  const [loginAccess, setLoginAccess] = useState();

  const location = useLocation();

  const isPathActive = (path) => {
    if (!path) return false;

    const current = (location.pathname || '/').replace(/\/+$/, '') || '/';
    const target = path.trim().replace(/\/+$/, '') || '/';

    if (target === '/') return current === '/';

    return current === target || current.startsWith(`${target}/`);
  };

  const { toggleSidebar, menu } = useSelector(
    state => state.global
  );


  // =====================================================
  // GET LOGIN ACCESS
  // =====================================================

  useEffect(() => {

    const get = async () => {

      const decoded = await decodeData(
        getCookies('accountAccess')
      );

      setLoginAccess(decoded);

    };

    get();

  }, []);


  // =====================================================
  // MENU FILTER
  // =====================================================

  const menuList = dummyMenu

    .map((menu) => {

      // Filter submenu berdasarkan role
      if (menu.submenu?.length > 0) {

        const submenu = menu.submenu.filter(
          (sub) =>
            !sub.roles ||
            sub.roles.includes(loginAccess?.role_id) ||
            sub.roles.includes(loginAccess?.nip)
        );

        return {
          ...menu,
          submenu,
        };

      }

      return menu;

    })

    .filter((menu) => {

      // Kalau memiliki submenu
      if (menu.submenu?.length > 0) {

        return menu.submenu.length > 0;

      }

      // Tidak ada role = bebas
      if (!menu.roles) return true;

      return menu.roles.includes(
        loginAccess?.role_id
      );

    });


  // =====================================================
  // WINDOW SIZE
  // =====================================================

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });


  useEffect(() => {

    function handleResize() {

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

    }

    window.addEventListener(
      'resize',
      handleResize
    );

    handleResize();

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );

  }, [toggleSidebar]);


  // =====================================================
  // SIDEBAR STYLE
  // =====================================================

  const sidebarBackground = {

    background: `
      radial-gradient(
        circle at 100% 0%,
        rgba(255, 145, 0, 0.10),
        transparent 35%
      ),
      radial-gradient(
        circle at 0% 100%,
        rgba(0, 70, 160, 0.08),
        transparent 35%
      ),
      #ffffff
    `,

    boxShadow:
      '4px 0 25px rgba(15, 23, 42, 0.06)',

    position: 'relative',

    overflow: 'hidden'
  };

  const [menuActive, setMenuActive] = useState('')
  useEffect(() => {
    setMenuActive(location?.pathname)
  }, [location?.pathname])

  return (

    <div className="drawer-side z-50 shadow-xl">

      {/* Overlay */}
      <label
        htmlFor="left-sidebar-drawer"
        className="drawer-overlay"
      />


      <ul
        className={`
          menu
          pt-3
          ${windowSize.width <= 767
            ? "w-60"
            : (
              toggleSidebar
                ? "w-60"
                : "w-0 p-0"
            )
          }
          min-h-full
          text-base-content
          border-r
          border-gray-100
        `}
        style={sidebarBackground}
      >


        {/* ================================================= */}
        {/* DECORATIVE TOP ORANGE LINE */}
        {/* ================================================= */}

        <div
          className="
            absolute
            top-0
            left-0
            w-full
            h-[4px]
            bg-gradient-to-r
            from-orange-400
            via-orange-500
            to-blue-600
          "
        />


        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="h-full scrollsidebar overflow-y-auto">


          {/* ================================================= */}
          {/* LOGO */}
          {/* ================================================= */}

          <li className="mb-5 mt-2">

            <Link
              to="/dashboard"
              className="
                flex
                flex-col
                items-center
                justify-center
                hover:bg-transparent
                active:bg-transparent
                focus:bg-transparent
                p-2
              "
            >

              {toggleSidebar &&
                windowSize.width >= 767 ? (

                <>

                  {/* LOGO TEXT */}

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


                  {/* SUBTITLE */}

                  <div
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.25em]
                      text-gray-400
                      mt-1
                    "
                  >
                    Collection Faktur
                  </div>


                  {/* DECORATIVE LINE */}

                  <div className="flex items-center gap-1 mt-3">

                    <div
                      className="
                        h-[3px]
                        w-8
                        rounded-full
                        bg-orange-400
                      "
                    />

                    <div
                      className="
                        h-[3px]
                        w-12
                        rounded-full
                        bg-blue-600
                      "
                    />

                    <div
                      className="
                        h-[3px]
                        w-3
                        rounded-full
                        bg-orange-400
                      "
                    />

                  </div>

                </>

              ) : (

                <div className="h-16" />

              )}

            </Link>

          </li>


          {/* ================================================= */}
          {/* SECTION LABEL */}
          {/* ================================================= */}

          {toggleSidebar &&
            windowSize.width >= 767 && (

              <div
                className="
                px-4
                mb-3
                flex
                items-center
                gap-2
              "
              >

                <div
                  className="
                  w-1
                  h-4
                  rounded-full
                  bg-orange-400
                "
                />

                <span
                  className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-gray-400
                "
                >
                  Navigasi
                </span>

              </div>

            )}


          {/* ================================================= */}
          {/* MENU */}
          {/* ================================================= */}

          {menuList?.map((route, k) => {
            const Icon = route.icon;

            return (
              <li
                key={k}
                className="mt-1 px-2"
              >

                {route.submenu?.length > 0 ? (

                  <SidebarSubmenu {...route} />

                ) : (

                  <NavLink
                    to={route.path}
                    end={route.path === '/'}

                    onClick={(e) => {
                      if (route.path === "/manual-book") {
                        e.preventDefault();

                        window.open(
                          `${process.env.REACT_APP_BASE_URL_LOCAL}/files/MANUAL_BOOK.pdf`,
                          "_blank",
                          "noopener,noreferrer"
                        );

                        return;
                      }
                    }}

                    className={({ isActive }) => {
                      const active = isActive || isPathActive(route.path);

                      return `
                    group
                    flex
                    items-center
                    rounded-xl
                    px-3
                    py-2.5
                    transition-all
                    duration-200
                    ease-out

                    ${active
                        ? `
                          bg-blue-50
                          text-primary
                          font-semibold
                          border-l-4
                          border-orange-400
                          shadow-sm
                          scale-[1.01]
                        `
                        : `
                          text-gray-600
                          hover:bg-orange-50
                          hover:text-blue-500
                          hover:scale-[1.01]
                        `
                      }
                    `;
                    }}

                    state={{
                      menu: {
                        id: route?.id,
                        name: route?.name,
                        path: route?.path,
                        parent: route?.parent,
                        submenu: route?.submenu,
                        actions: route?.actions,
                      },
                    }}
                  >

                    <div className="flex items-center gap-3">

                      {/* ICON */}
                      {Icon && (
                        <div
                          className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  bg-blue-50
                  group-hover:bg-orange-100
                  transition-all
                  duration-200
                "
                        >
                          <Icon
                            size={17}
                            className="
                    text-blue-600
                    group-hover:text-orange-500
                    transition-colors
                    duration-200
                  "
                          />
                        </div>
                      )}

                      {/* MENU NAME */}
                      <span className="text-sm">
                        {route.name}
                      </span>

                    </div>

                  </NavLink>

                )}

              </li>
            );
          })}


          {/* ================================================= */}
          {/* BOTTOM DECORATION */}
          {/* ================================================= */}

          <div className="px-4 mt-8 mb-5">

            <div
              className="
                h-px
                w-full
                bg-gradient-to-r
                from-orange-200
                via-blue-200
                to-transparent
              "
            />

            {toggleSidebar &&
              windowSize.width >= 767 && (

                <div
                  className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-4
                "
                >

                  <span
                    className="
                    text-[9px]
                    text-gray-300
                  "
                  >
                    KFCOLLS
                  </span>

                  <span
                    className="
                    text-[9px]
                    text-gray-300
                  "
                  >
                    •
                  </span>

                  <span
                    className="
                    text-[9px]
                    text-gray-300
                  "
                  >
                    Collection System
                  </span>

                </div>

              )}

          </div>


        </div>

      </ul>

    </div>

  );

};


export default Sidebar;