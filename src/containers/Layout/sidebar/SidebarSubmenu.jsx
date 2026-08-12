import React from 'react'
import { FaFileAlt, FaUser } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom'

function SidebarSubmenu({ id, name, path, parent, submenu, icon }) {
  const location = useLocation();

  return (
    <>
      <details open={location.state?.menu?.submenu?.parent === id}>

        <summary
          className={
            location.state?.menu?.submenu?.parent === id
              ? 'bg-white font-semibold text-black rounded-br-none pl-3'
              : 'font-normal pl-3'
          }
        >

          <div className='flex gap-2 items-center'>
            <FaFileAlt size={18} />
            {name}
          </div>

        </summary>

        <ul className='pl-1'>
          {submenu.map((v, i) => {
            return (
              <li key={i} className='border-s-2 border-white pl-0'>

                <NavLink
                  to={v.path}
                  className={({ isActive }) =>
                    `mt-1 ${isActive
                      ? 'bg-white font-semibold text-blue-900'
                      : 'font-normal text-white'
                    }`
                  }
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
                  <div className='flex gap-2 items-center'>
                    {v.name}
                  </div>

                </NavLink>

              </li>
            )
          })}
        </ul>

      </details>
    </>
  )
}

export default SidebarSubmenu