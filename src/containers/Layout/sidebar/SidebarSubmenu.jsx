import React from 'react'
import { FaFileAlt } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom'

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

function SidebarSubmenu({
  id,
  name,
  path,
  parent,
  submenu,
  icon: Icon
}) {
  const location = useLocation();

  const isPathActive = (targetPath) => {
    if (!targetPath) return false;

    const current = (location.pathname || '/').replace(/\/+$/, '') || '/';
    const target = targetPath.trim().replace(/\/+$/, '') || '/';

    if (target === '/') return current === '/';

    return current === target || current.startsWith(`${target}/`);
  };

  // Cek apakah salah satu submenu sedang aktif
  const isSubmenuActive = submenu?.some((item) => isPathActive(item.path));

  return (
    <details
      open={isSubmenuActive}
      className="group"
    >
      <summary
        className={`
          flex
          items-center
          rounded-xl
          px-3
          py-2.5
          cursor-pointer
          list-none
          transition-all
          duration-200
          ease-out
          ${isSubmenuActive
            ? `
              bg-blue-50
              text-blue-700
              font-semibold
              border-l-4
              border-orange-400
              shadow-sm
              scale-[1.01]
            `
            : `
              text-gray-600
              hover:bg-orange-50
              hover:text-blue-700
              hover:scale-[1.01]
            `
          }
        `}
      >
        <div className="flex items-center gap-3 w-full">

          {/* ICON */}
          <div
            className={`
              w-8
              h-8
              rounded-lg
              flex
              items-center
              justify-center
              transition-all
              duration-200
              ${isSubmenuActive
                ? 'bg-orange-100'
                : 'bg-blue-50 group-hover:bg-orange-100'
              }
            `}
          >
            {Icon ? (
              <Icon
                size={17}
                className={`
                  transition-colors
                  duration-200
                  ${isSubmenuActive
                    ? 'text-orange-500'
                    : 'text-blue-600 group-hover:text-orange-500'
                  }
                `}
              />
            ) : (
              <FaFileAlt
                size={17}
                className={`
                  ${isSubmenuActive
                    ? 'text-orange-500'
                    : 'text-blue-600 group-hover:text-orange-500'
                  }
                `}
              />
            )}
          </div>

          {/* MENU NAME */}
          <span className="text-sm">
            {name}
          </span>

        </div>
      </summary>

      {/* SUBMENU */}
      <ul className="ml-4 mt-1 pl-2 border-l-2 border-orange-200">

        {submenu?.map((v, i) => (
          <li key={i} className="mt-1">

            <NavLink
              to={v.path}
              className={({ isActive }) => {
                const active = isActive || isPathActive(v.path);

                return `
                  group
                  flex
                  items-center
                  rounded-lg
                  px-3
                  py-2
                  transition-all
                  duration-200

                  ${active
                    ? `
                      bg-blue-50
                      text-blue-700
                      font-semibold
                      border-l-2
                      border-orange-400
                    `
                    : `
                      text-gray-500
                      hover:bg-orange-50
                      hover:text-blue-700
                    `
                  }
                `;
              }}
              state={{
                menu: {
                  id: id,
                  name: name,
                  path: path,
                  parent: parent,
                  submenu: v,
                },
              }}
            >
              <div className="flex items-center gap-2">

                {/* titik kecil submenu */}
                <span
                  className={`
                    w-1.5
                    h-1.5
                    rounded-full
                    transition-all
                    duration-200
                    ${isPathActive(v.path)
                      ? 'bg-orange-500 scale-125'
                      : 'bg-blue-300 group-hover:bg-orange-400'
                    }
                  `}
                />

                <span className="text-sm">
                  {v.name}
                </span>

              </div>
            </NavLink>

          </li>
        ))}

      </ul>
    </details>
  )
}

export default SidebarSubmenu