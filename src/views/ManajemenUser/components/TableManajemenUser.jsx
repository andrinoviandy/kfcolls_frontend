import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaEllipsisV,
  FaHashtag,
  FaUser,
  FaBuilding,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPencilAlt,
  FaTrash,
  FaFilter,
  FaIdCard,
  FaUserShield,
  FaUsersCog,
  FaLock,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

import {
  IoSearch,
} from "react-icons/io5";

import ReactPaginate
  from "react-paginate";

import {
  swal,
} from "global/helper/swal";

import storeSchema from "global/store";

const createEmptyUserForm = () => ({
  id: "",
  username: "",
  password: "",
  nip: "",
  nama: "",
  email: "",
  no_telepon: "",
  role_id: "",
  role: "",
  cabang_id: "",
  cabang: "",
  status: "AKTIF",
});


// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {

  AKTIF: {

    label:
      "Aktif",

    icon:
      FaCheckCircle,

    className:
      "bg-green-100 text-green-700",

  },


  NONAKTIF: {

    label:
      "Nonaktif",

    icon:
      FaTimesCircle,

    className:
      "bg-red-100 text-red-700",

  },

};


// =====================================================
// ROLE CONFIG
// =====================================================

const roleConfig = {

  "Admin Pusat":
    "bg-purple-50 text-purple-700",

  "Inkaso Cabang":
    "bg-blue-50 text-blue-700",

  "Salesman":
    "bg-orange-50 text-orange-700",

};


// =====================================================
// COMPONENT
// =====================================================

const TableManajemenUser = ({
  showAddUser,
  setShowAddUser,
  dimensionScreenW,
  check,
  loginAccess,
}) => {


  // ===================================================
  // STATE
  // ===================================================

  const [
    tableData,
    setTableData,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    totalData,
    setTotalData,
  ] = useState(0);


  const [
    totalPage,
    setTotalPage,
  ] = useState(0);


  const [
    keyword,
    setKeyword,
  ] = useState(
    ""
  );


  // keyword yang benar-benar digunakan
  // untuk request API
  const [
    searchKeyword,
    setSearchKeyword,
  ] = useState(
    ""
  );


  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState(
    "ALL"
  );


  const [
    selectedRole,
    setSelectedRole,
  ] = useState(
    "ALL"
  );


  const [
    selectedCabang,
    setSelectedCabang,
  ] = useState(
    "ALL"
  );


  const [
    currentPage,
    setCurrentPage,
  ] = useState(
    1
  );


  const [
    perPage,
    setPerPage,
  ] = useState(
    10
  );


  const [
    selectedData,
    setSelectedData,
  ] = useState(
    null
  );


  const [
    showDetail,
    setShowDetail,
  ] = useState(
    false
  );


  const [
    editData,
    setEditData,
  ] = useState(
    null
  );


  const [
    showEdit,
    setShowEdit,
  ] = useState(
    false
  );

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  const [
    deleteData,
    setDeleteData,
  ] = useState(null);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  useEffect(() => {
    if (!showAddUser) return;

    setEditData(createEmptyUserForm());
    setShowEdit(true);
  }, [showAddUser]);


  // ===================================================
  // ROLE & CABANG OPTIONS
  // ===================================================

  const [
    roleOptions,
    setRoleOptions,
  ] = useState([]);


  const [
    cabangOptions,
    setCabangOptions,
  ] = useState([]);


  // ===================================================
  // GET REFERENSI ROLE & CABANG
  // ===================================================

  const getReferensi = async () => {
    try {
      const [
        refRole,
        refCabang,
      ] = await Promise.all([

        storeSchema.actions.getReferensiByJenis(
          "role_id"
        ),

        storeSchema.actions.getReferensiByJenis(
          "cabang_id"
        ),
      ]);

      if (refRole?.status === true) {
        const dataRole = (refRole?.data || []).map(item => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));
        setRoleOptions(dataRole);
      }

      if (refCabang?.status === true) {
        const dataCabang = (refCabang?.data || []).map(item => ({
          label: item?.ur_ref,
          value: item?.kd_ref,
        }));
        setCabangOptions(dataCabang);
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI ROLE & CABANG:", error);
    }
  };

  useEffect(() => {
    getReferensi();
  }, []);

  // ===================================================
  // GET DATA USER
  // ===================================================

  const getDataUser = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword.trim(),
        status: selectedStatus === "ALL" ? "" : selectedStatus,
        role_id: selectedRole === "ALL" ? "" : selectedRole,
        cabang_id: selectedCabang === "ALL" ? "" : selectedCabang,
      };

      const res = await storeSchema.actions.getListUserManagement(payload);

      if (res?.status !== true) {
        throw new Error(res?.message || "Gagal mengambil data user");
      }

      const responseData = res?.data || {};
      const listData = responseData?.list_data || [];
      const normalizedData = listData.map((item, index) => ({
        ...item,
        id: item?.id || item?.user_id || item?.userid || index,
        username: item?.username || item?.user_name || "-",
        nama: item?.nama || item?.nama_user || item?.name || "-",
        nip: item?.nip || item?.NIP || "-",
        email: item?.email || item?.email_user || "-",
        no_telepon:
          item?.no_telepon ||
          item?.no_telp ||
          item?.phone ||
          item?.telephone ||
          "-",
        role_id: item?.role_id || item?.roleId || "",
        role: item?.role || item?.role_name || "-",
        cabang_id: item?.cabang_id || item?.cabangId || "",
        cabang:
          item?.cabang ||
          item?.cabang_name ||
          item?.sales_office_description ||
          item?.sales_office ||
          "-",
        status: String(
          item?.status || item?.status_user || "NONAKTIF"
        ).toUpperCase(),
        No: (currentPage - 1) * perPage + index + 1,
      }));

      setTableData(normalizedData);
      setTotalData(
        Number(responseData?.total_data || responseData?.total || 0)
      );
      setTotalPage(
        Number(
          responseData?.total_halaman ||
            responseData?.total_page ||
            responseData?.total_pages ||
            0
        )
      );
    } catch (error) {
      console.error("ERROR GET DATA USER:", error);
      setTableData([]);
      setTotalData(0);
      setTotalPage(0);
      await swal.error(error?.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };


  // ===================================================
  // SERVER SIDE SEARCH / FILTER / PAGINATION
  // ===================================================

  useEffect(() => {

    getDataUser();

  }, [
    currentPage,
    perPage,
    searchKeyword,
    selectedStatus,
    selectedRole,
    selectedCabang,
  ]);


  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = () => {

    setSearchKeyword(
      keyword.trim()
    );

    setCurrentPage(
      1
    );

  };


  // ===================================================
  // PAGINATION INFO
  // ===================================================

  const startIndex =
    totalData > 0
      ? (currentPage - 1) *
      perPage +
      1
      : 0;


  const endIndex =
    Math.min(
      currentPage * perPage,
      totalData
    );


  // ===================================================
  // STATUS
  // ===================================================

  const renderStatus =
    (
      status
    ) => {

      const config =
        statusConfig[
        status
        ];


      if (
        !config
      ) {

        return "-";

      }


      const Icon =
        config.icon;


      return (

        <span
          className={`
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            whitespace-nowrap
            ${config.className}
          `}
        >

          <Icon />

          {
            config.label
          }

        </span>

      );

    };


  // ===================================================
  // ROLE
  // ===================================================

  const renderRole =
    (
      role
    ) => {

      return (

        <span
          className={`
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            whitespace-nowrap
            ${roleConfig[role] ||
            "bg-gray-50 text-gray-700"
            }
          `}
        >

          <FaUserShield />

          {
            role
          }

        </span>

      );

    };


  // ===================================================
  // DETAIL
  // ===================================================

  const handleDetail =
    (
      data
    ) => {

      setSelectedData(
        data
      );

      setShowDetail(
        true
      );

    };


  // ===================================================
  // EDIT
  // ===================================================

  const handleEdit =
    (
      data
    ) => {

      setShowAddUser(false);

      const roleValue =
        data?.role_id ||
        roleOptions.find(
          item =>
            String(item?.label).trim() ===
            String(data?.role).trim()
        )?.value ||
        "";

      const cabangValue =
        data?.cabang_id ||
        cabangOptions.find(
          item =>
            String(item?.label).trim() ===
            String(data?.cabang).trim()
        )?.value ||
        "";

      setEditData(
        {
          ...data,
          role_id: roleValue,
          cabang_id: cabangValue,
        }
      );

      setShowEdit(
        true
      );

    };


  // ===================================================
  // CLOSE EDIT
  // ===================================================

  const closeEdit =
    () => {

      if (isSaving) return;

      setEditData(
        null
      );

      setShowEdit(
        false
      );

      if (showAddUser) {
        setShowAddUser(false);
      }

    };


  // ===================================================
  // SAVE EDIT
  // ===================================================

  const handleSaveEdit = async () => {
    if (!editData?.username?.trim()) {
      await swal.warning("Username wajib diisi.");
      return;
    }

    if (!editData?.nama?.trim()) {
      await swal.warning("Nama user wajib diisi.");
      return;
    }

    if (!editData?.role_id) {
      await swal.warning("Role wajib dipilih.");
      return;
    }

    if (!editData?.cabang_id) {
      await swal.warning("Cabang wajib dipilih.");
      return;
    }

    if (showAddUser && !editData?.password?.trim()) {
      await swal.warning("Password wajib diisi.");
      return;
    }

    const selectedRole = roleOptions.find(
      item => String(item?.value) === String(editData.role_id)
    );
    const selectedCabang = cabangOptions.find(
      item => String(item?.value) === String(editData.cabang_id)
    );
    const isActive = editData.status === "AKTIF";
    const payload = {
      username: editData.username.trim(),
      nip: editData.nip || "",
      nama: editData.nama.trim(),
      email: editData.email || "",
      no_telepon: editData.no_telepon || "",
      role_id: editData.role_id,
      ur_role_id: selectedRole?.label || editData.role || "",
      cabang_id: editData.cabang_id,
      ur_cabang_id: selectedCabang?.label || editData.cabang || "",
      flag_aktif: isActive ? "Y" : "T",
      ur_flag_aktif: isActive ? "Aktif" : "Non Aktif",
      tipe_user: editData.tipe_user || "2",
      ur_tipe_user: editData.ur_tipe_user || "User Login",
    };

    try {
      setIsSaving(true);
      const response = showAddUser
        ? await storeSchema.actions.insertUser({
            ...payload,
            password: editData.password,
          })
        : await storeSchema.actions.updateUser({
            ...payload,
            user_id: editData.user_id || editData.id,
          });

      if (response?.status !== true) {
        await swal.error(
          response?.message ||
            response?.data?.message ||
            `Data user gagal ${showAddUser ? "ditambahkan" : "diperbarui"}.`
        );
        return;
      }

      const successMessage = showAddUser
        ? "Data user berhasil ditambahkan."
        : "Data user berhasil diperbarui.";
      setShowEdit(false);
      setShowAddUser(false);
      setEditData(null);
      await getDataUser();
      await swal.success(response?.message || successMessage);
    } catch (error) {
      await swal.error(
        error?.response?.data?.message ||
          error?.message ||
          `Terjadi kesalahan saat ${showAddUser ? "menambahkan" : "memperbarui"} user.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = data => {
    setDeleteData(data);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    if (isDeleting) return;
    setShowDeleteConfirm(false);
    setDeleteData(null);
  };

  const confirmDelete = async () => {
    if (!deleteData || isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await storeSchema.actions.deleteUser(
        deleteData?.user_id || deleteData?.id
      );

      if (response?.status !== true) {
        await swal.error(
          response?.message ||
            response?.data?.message ||
            "Data user gagal dihapus."
        );
        return;
      }

      setShowDeleteConfirm(false);
      setDeleteData(null);
      await getDataUser();
      await swal.success(response?.message || "Data user berhasil dihapus.");
    } catch (error) {
      await swal.error(
        error?.response?.data?.message ||
          error?.message ||
          "Terjadi kesalahan saat menghapus user."
      );
    } finally {
      setIsDeleting(false);
    }
  };


  // ===================================================
  // HEADER TABLE
  // ===================================================

  const headerTable = [

    {
      label:
        "Aksi",

      icon:
        <FaEllipsisV />,
    },


    {
      label:
        "No",

      icon:
        <FaHashtag />,
    },


    {
      label:
        "Username",

      icon:
        <FaUser />,
    },


    {
      label:
        "NIP",

      icon:
        <FaIdCard />,
    },


    {
      label:
        "Nama",

      icon:
        <FaUser />,
    },


    {
      label:
        "Role",

      icon:
        <FaUserShield />,
    },


    {
      label:
        "Cabang",

      icon:
        <FaStore />,
    },


    {
      label:
        "Kontak",

      icon:
        <FaPhone />,
    },


    {
      label:
        "Status",

      icon:
        <FaCheckCircle />,
    },

  ];


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div
      className="
        flex
        flex-col
        gap-5
      "
    >

      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-4
          items-stretch
          lg:items-center
        "
      >

        {/* SEARCH */}

        <div
          className="
    flex
    items-center
    w-full
    lg:w-[420px]
    h-10
    px-1
    bg-white
    border
    border-gray-200
    rounded-full
    shadow-sm
    focus-within:border-primary
    focus-within:ring-1
    focus-within:ring-primary/20
  "
        >
          <input
            type="text"
            placeholder="Cari username / nama / NIP / email..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="
      flex-1
      min-w-0
      h-full
      px-4
      bg-transparent
      border-none
      outline-none
      text-sm
      text-gray-700
      placeholder:text-gray-400
    "
          />

          <button
            type="button"
            onClick={handleSearch}
            title="Cari"
            className="
      flex
      items-center
      justify-center
      shrink-0
      w-8
      h-8
      mr-0.5
      rounded-full
      bg-primary
      text-white
      hover:bg-primary/90
      active:scale-95
      transition-all
    "
          >
            <IoSearch className="text-[17px]" />
          </button>
        </div>


        {/* FILTER */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* STATUS */}

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[150px]
            "
            value={
              selectedStatus
            }
            onChange={
              e => {

                setSelectedStatus(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }
            }
          >

            <option value="ALL">
              Semua Status
            </option>

            <option value="AKTIF">
              Aktif
            </option>

            <option value="NONAKTIF">
              Nonaktif
            </option>

          </select>


          {/* ROLE */}

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[170px]
            "
            value={
              selectedRole
            }
            onChange={
              e => {

                setSelectedRole(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }
            }
          >

            <option value="ALL">
              Semua Role
            </option>

            {
              roleOptions.map(
                role => (

                  <option
                    key={
                      role.value
                    }
                    value={
                      role.value
                    }
                  >

                    {
                      role.label
                    }

                  </option>

                )
              )
            }

          </select>


          {/* CABANG */}

          <select
            className="
              select
              select-sm
              select-bordered
              rounded-full
              bg-white
              min-w-[180px]
            "
            value={
              selectedCabang
            }
            onChange={
              e => {

                setSelectedCabang(
                  e.target.value
                );

                setCurrentPage(
                  1
                );

              }
            }
          >

            <option value="ALL">
              Semua Cabang
            </option>

            {
              cabangOptions.map(
                cabang => (

                  <option
                    key={
                      cabang.value
                    }
                    value={
                      cabang.value
                    }
                  >

                    {
                      cabang.label
                    }

                  </option>

                )
              )
            }

          </select>


          {/* RESET */}

          <button
            type="button"
            onClick={() => {

              setKeyword(
                ""
              );

              setSearchKeyword(
                ""
              );

              setSelectedStatus(
                "ALL"
              );

              setSelectedRole(
                "ALL"
              );

              setSelectedCabang(
                "ALL"
              );

              setCurrentPage(
                1
              );

            }}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-gray-200
              bg-white
              text-gray-600
              text-sm
              font-semibold
              hover:bg-gray-50
            "
          >

            <FaFilter />

            Reset

          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div
        className={
          dimensionScreenW <
            768 &&
            check
            ? "bringToBack"
            : ""
        }
      >

        <div
          className="
            bg-white
            rounded-2xl
            shadow-xl
            overflow-hidden
            border
            border-gray-200
          "
        >

          <div
            className="
              overflow-auto
              rounded-2xl
              max-h-[65vh]
            "
          >

            <table
              className="
                table
                w-full
              "
            >

              {/* HEADER */}

              <thead
                className="
                  bg-primary
                  text-white
                  sticky
                  top-0
                  text-[13px]
                  z-10
                "
              >

                <tr>

                  {
                    headerTable.map(
                      (
                        h,
                        index
                      ) => (

                        <th
                          key={
                            index
                          }
                          className="
                            px-4
                            py-3
                            whitespace-nowrap
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              font-semibold
                            "
                          >

                            {
                              h.icon
                            }

                            {
                              h.label
                            }

                          </div>

                        </th>

                      )
                    )
                  }

                </tr>

              </thead>


              {/* BODY */}

              <tbody>

                {
                  tableData.length ===
                    0 ? (

                    <tr>

                      <td
                        colSpan={
                          headerTable.length
                        }
                        className="
                          text-center
                          py-16
                          text-gray-500
                        "
                      >

                        <FaUsersCog
                          className="
                            text-4xl
                            text-gray-300
                            mx-auto
                            mb-3
                          "
                        />

                        Tidak ada data user

                      </td>

                    </tr>

                  ) : (

                    tableData.map(
                      (
                        item,
                        index
                      ) => (

                        <tr
                          key={
                            item.id
                          }
                          className="
                            border-b
                            hover:bg-blue-50
                            transition
                          "
                        >

                          {/* AKSI */}

                          <td
                            className="
                              px-4
                              py-3
                            "
                          >

                            <div
                              className="
                                dropdown
                                dropdown-right
                              "
                            >

                              <div
                                tabIndex={
                                  0
                                }
                                role="button"
                                className="
                                  w-9
                                  h-9
                                  rounded-full
                                  bg-blue-50
                                  text-primary
                                  flex
                                  items-center
                                  justify-center
                                  cursor-pointer
                                  hover:bg-primary
                                  hover:text-white
                                  transition
                                "
                              >

                                <FaEllipsisV />

                              </div>


                              <ul
                                tabIndex={
                                  0
                                }
                                className="
                                  dropdown-content
                                  menu
                                  p-2
                                  shadow-xl
                                  bg-white
                                  rounded-box
                                  border
                                  border-gray-100
                                  w-48
                                  z-[30]
                                "
                              >

                                <li>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDetail(
                                        item
                                      )
                                    }
                                  >

                                    <FaEye />

                                    Detail

                                  </button>

                                </li>


                                <li>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        item
                                      )
                                    }
                                  >

                                    <FaPencilAlt />

                                    Edit Data

                                  </button>

                                </li>


                                <li>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        item
                                      )
                                    }
                                    className="
                                      text-red-500
                                    "
                                  >

                                    <FaTrash />

                                    Hapus

                                  </button>

                                </li>

                              </ul>

                            </div>

                          </td>


                          {/* NO */}

                          <td
                            className="
                              px-4
                              py-3
                              font-semibold
                              text-gray-700
                            "
                          >

                            {
                              (
                                currentPage -
                                1
                              ) *
                              perPage +
                              index +
                              1
                            }

                          </td>


                          {/* USER */}

                          <td
                            className="
                              px-4
                              py-3
                              min-w-[280px]
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >

                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-xl
                                  bg-blue-50
                                  text-primary
                                  flex
                                  items-center
                                  justify-center
                                  shrink-0
                                "
                              >

                                <FaUser />

                              </div>


                              <div>

                                <p
                                  className="
                                    font-semibold
                                    text-gray-700
                                  "
                                >

                                  {
                                    item.username
                                  }

                                </p>

                              </div>

                            </div>

                          </td>


                          {/* NIP */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <FaIdCard
                                className="
                                  text-blue-500
                                "
                              />

                              <span
                                className="
                                  font-medium
                                  text-gray-700
                                "
                              >

                                {
                                  item.nip
                                }

                              </span>

                            </div>

                          </td>


                          {/* NAMA */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                              font-medium
                              text-gray-700
                            "
                          >
                            {item.nama}
                          </td>


                          {/* ROLE */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            {
                              renderRole(
                                item.role
                              )
                            }

                          </td>


                          {/* CABANG */}

                          <td
                            className="
                              px-4
                              py-3
                              whitespace-nowrap
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <FaStore
                                className="
                                  text-orange-500
                                "
                              />

                              <span
                                className="
                                  text-sm
                                  font-semibold
                                  text-gray-700
                                "
                              >

                                {
                                  item.cabang
                                }

                              </span>

                            </div>

                          </td>


                          {/* KONTAK */}

                          <td
                            className="
                              px-4
                              py-3
                              min-w-[230px]
                            "
                          >

                            <div
                              className="
                                flex
                                flex-col
                                gap-1
                              "
                            >

                              {/* <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  text-sm
                                "
                              >

                                <FaPhone
                                  className="
                                    text-primary
                                  "
                                />

                                {
                                  item.no_telepon
                                }

                              </div> */}


                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  text-xs
                                  text-gray-500
                                "
                              >

                                <FaEnvelope />

                                {
                                  item.email
                                }

                              </div>

                            </div>

                          </td>


                          {/* STATUS */}

                          <td
                            className="
                              px-4
                              py-3
                            "
                          >

                            {
                              renderStatus(
                                item.status
                              )
                            }

                          </td>

                        </tr>

                      )
                    )

                  )
                }

              </tbody>

            </table>

          </div>


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <div
            className="
              border-t
              border-gray-100
              bg-slate-50
              py-4
              px-5
            "
          >

            <div
              className="
                flex
                flex-col
                lg:flex-row
                gap-4
                lg:items-center
                lg:justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-5
                  flex-wrap
                "
              >

                <div
                  className="
                    text-sm
                    text-gray-600
                  "
                >

                  Showing{" "}

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {
                      startIndex
                    }

                  </span>

                  {" "}to{" "}

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {
                      endIndex
                    }

                  </span>

                  {" "}of{" "}

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {
                      totalData
                    }

                  </span>

                  {" "}entries

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      text-sm
                      text-gray-600
                    "
                  >

                    Rows:

                  </span>


                  <select
                    className="
                      select
                      select-bordered
                      select-sm
                      bg-white
                      rounded-full
                    "
                    value={
                      perPage
                    }
                    onChange={
                      e =>
                        setPerPage(
                          parseInt(
                            e.target.value
                          )
                        )
                    }
                  >

                    <option value="5">
                      5
                    </option>

                    <option value="10">
                      10
                    </option>

                    <option value="25">
                      25
                    </option>

                    <option value="50">
                      50
                    </option>

                  </select>

                </div>

              </div>


              {
                totalPage >
                0 && (

                  <ReactPaginate
                    breakLabel="..."
                    previousLabel="←"
                    nextLabel="→"
                    pageCount={
                      totalPage
                    }
                    onPageChange={
                      e =>
                        setCurrentPage(
                          e.selected +
                          1
                        )
                    }
                    forcePage={Math.min(
                      currentPage - 1,
                      Math.max(
                        totalPage - 1,
                        0
                      )
                    )}
                    className="
                      flex
                      items-center
                      gap-2
                    "
                    activeClassName="
                      !bg-primary
                      !text-white
                      !border-primary
                    "
                    pageClassName="
                      min-w-9
                      h-9
                      border
                      border-gray-300
                      rounded-full
                      flex
                      items-center
                      justify-center
                      bg-white
                      hover:bg-blue-50
                    "
                    pageLinkClassName="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                    "
                    previousClassName="
                      min-w-9
                      h-9
                      border
                      border-gray-300
                      rounded-full
                      bg-white
                    "
                    nextClassName="
                      min-w-9
                      h-9
                      border
                      border-gray-300
                      rounded-full
                      bg-white
                    "
                    previousLinkClassName="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                    "
                    nextLinkClassName="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                    "
                    breakClassName="
                      px-2
                      text-gray-500
                    "
                    disabledClassName="
                      opacity-50
                      cursor-not-allowed
                    "
                  />

                )
              }

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* DETAIL MODAL */}
      {/* ================================================= */}

      {
        showDetail &&
        selectedData && (

          <div
            className="
              fixed
              inset-0
              z-[999]
              bg-black/40
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
            onClick={() => {

              setShowDetail(
                false
              );

              setSelectedData(
                null
              );

            }}
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
              "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div
                className="
                  bg-primary
                  px-6
                  py-4
                  text-white
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-white/10
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <FaUser />

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >

                        Detail User

                      </h3>


                      <p
                        className="
                          text-xs
                          text-blue-100
                        "
                      >

                        {
                          selectedData.username
                        }

                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() => {

                      setShowDetail(
                        false
                      );

                      setSelectedData(
                        null
                      );

                    }}
                    className="
                      w-9
                      h-9
                      rounded-full
                      hover:bg-white/10
                      flex
                      items-center
                      justify-center
                    "
                  >

                    ×

                  </button>

                </div>

              </div>


              {/* BODY */}

              <div
                className="
                  p-6
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-5
                "
              >

                <div
                  className="
                    sm:col-span-2
                  "
                >

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Nama User
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mt-1
                    "
                  >

                    <p
                      className="
                        font-bold
                        text-gray-700
                      "
                    >

                      {
                        selectedData.nama
                      }

                    </p>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-2.5
                        py-1
                        rounded-full
                        bg-blue-50
                        text-primary
                        text-xs
                        font-semibold
                      "
                    >

                      <FaUser />

                      @{selectedData.username}

                    </span>

                  </div>

                </div>


                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    NIP
                  </p>

                  <p
                    className="
                      font-semibold
                      text-gray-700
                    "
                  >

                    {
                      selectedData.nip
                    }

                  </p>

                </div>





                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Role
                  </p>

                  <div
                    className="
                      mt-1
                    "
                  >

                    {
                      renderRole(
                        selectedData.role
                      )
                    }

                  </div>

                </div>


                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Cabang
                  </p>

                  <p
                    className="
                      font-semibold
                      text-gray-700
                    "
                  >

                    {
                      selectedData.cabang
                    }

                  </p>

                </div>


                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Telepon
                  </p>

                  <p
                    className="
                      font-medium
                      text-gray-700
                    "
                  >

                    {
                      selectedData.no_telepon
                    }

                  </p>

                </div>


                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Email
                  </p>

                  <p
                    className="
                      font-medium
                      text-gray-700
                    "
                  >

                    {
                      selectedData.email
                    }

                  </p>

                </div>


                <div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    Status
                  </p>

                  <div
                    className="
                      mt-1
                    "
                  >

                    {
                      renderStatus(
                        selectedData.status
                      )
                    }

                  </div>

                </div>

              </div>


              {/* FOOTER */}

              <div
                className="
                  border-t
                  bg-gray-50
                  px-5
                  py-4
                  flex
                  justify-end
                "
              >

                <button
                  type="button"
                  onClick={() => {

                    setShowDetail(
                      false
                    );

                    setSelectedData(
                      null
                    );

                  }}
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    bg-primary
                    text-white
                    text-sm
                    font-semibold
                    hover:opacity-90
                  "
                >

                  Tutup

                </button>

              </div>

            </div>

          </div>

        )
      }


      {/* ================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================= */}

      {showDeleteConfirm && deleteData && (
        <div
          className="fixed inset-0 z-[1050] bg-black/50 p-4 flex items-center justify-center overflow-y-auto"
          onClick={closeDeleteConfirm}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FaExclamationTriangle />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Konfirmasi Hapus
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Hapus Data User
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
                className="btn btn-sm btn-circle bg-gray-100 border-none text-gray-500 hover:bg-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <p className="text-sm text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus user
                <span className="font-bold text-gray-800 mx-1">
                  {deleteData.nama || deleteData.username}
                </span>
                ?
              </p>

              <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs text-red-700 font-semibold">
                  Perhatian
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Data user yang dihapus tidak dapat ditampilkan kembali pada tabel.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
                className="btn rounded-full bg-white border border-gray-300 text-gray-600 px-6"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="btn rounded-full bg-red-600 hover:bg-red-700 border-none text-white px-6 gap-2 min-w-[130px]"
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Ya, Yakin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {
        showEdit &&
        editData && (

          <div
            className="
              fixed
              inset-0
              z-[999]
              bg-black/40
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
            onClick={
              closeEdit
            }
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-3xl
                max-h-[90vh]
                flex
                flex-col
                overflow-hidden
              "
              onClick={
                e =>
                  e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div
                className="
                  bg-primary
                  px-6
                  py-4
                  text-white
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-white/10
                        flex
                        items-center
                        justify-center
                      "
                    >

                      {showAddUser ? <FaUser /> : <FaPencilAlt />}

                    </div>


                    <div>

                      <h3
                        className="
                          font-bold
                          text-lg
                        "
                      >

                        {showAddUser ? "Tambah User" : "Edit User"}

                      </h3>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      closeEdit
                    }
                    disabled={isSaving}
                    aria-label="Tutup modal"
                    className="
                      w-9
                      h-9
                      shrink-0
                      rounded-full
                      hover:bg-white/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaTimes />

                  </button>

                </div>

              </div>


              {/* FORM */}

              <div
                className="
                  p-6
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                  overflow-y-auto
                  flex-1
                  min-h-0
                "
              >

                {/* USERNAME */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    Username

                  </label>


                  <div className="relative">
                    <FaUser
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />
                    <input
                      type="text"
                      value={
                        editData.username ||
                        ""
                      }
                      onChange={
                        e =>
                          setEditData(
                            prev => ({
                              ...prev,
                              username:
                                e.target.value,
                            })
                          )
                      }
                      className="
                        input
                        input-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    />
                  </div>

                </div>


                {showAddUser && (
                  <div>

                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                        mb-2
                      "
                    >

                      Password

                    </label>

                    <div className="relative">
                      <FaLock
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                        "
                      />
                      <input
                        type="password"
                        value={editData.password || ""}
                        onChange={e =>
                          setEditData(prev => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="input input-bordered w-full rounded-xl pl-11"
                        disabled={isSaving}
                      />
                    </div>

                  </div>
                )}


                {/* NIP */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    NIP

                  </label>


                  <div className="relative">
                    <FaIdCard
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />
                    <input
                      type="text"
                      value={
                        editData.nip ||
                        ""
                      }
                      onChange={
                        e =>
                          setEditData(
                            prev => ({
                              ...prev,
                              nip:
                                e.target.value,
                            })
                          )
                      }
                      className="
                        input
                        input-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    />
                  </div>

                </div>


                {/* NAMA */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    Nama User

                  </label>


                  <div className="relative">
                    <FaUser
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />
                    <input
                      type="text"
                      value={
                        editData.nama ||
                        ""
                      }
                      onChange={
                        e =>
                          setEditData(
                            prev => ({
                              ...prev,
                              nama:
                                e.target.value,
                            })
                          )
                      }
                      className="
                        input
                        input-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    />
                  </div>

                </div>


                {/* EMAIL */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    Email

                  </label>


                  <div className="relative">
                    <FaEnvelope
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />
                    <input
                      type="email"
                      value={
                        editData.email ||
                        ""
                      }
                      onChange={
                        e =>
                          setEditData(
                            prev => ({
                              ...prev,
                              email:
                                e.target.value,
                            })
                          )
                      }
                      className="
                        input
                        input-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    />
                  </div>

                </div>


                {/* TELEPON */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    No. Telepon

                  </label>


                  <div className="relative">
                    <FaPhone
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />
                    <input
                      type="text"
                      value={
                        editData.no_telepon ||
                        ""
                      }
                      onChange={
                        e =>
                          setEditData(
                            prev => ({
                              ...prev,
                              no_telepon:
                                e.target.value,
                            })
                          )
                      }
                      className="
                        input
                        input-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    />
                  </div>

                </div>


                {/* ROLE */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    Role

                  </label>


                  <div className="relative">
                    <FaUserShield
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        z-10
                      "
                    />

                    <select
                      value={
                        editData.role_id ||
                        ""
                      }
                      onChange={
                        e => {
                          const value =
                            e.target.value;

                          const selected =
                            roleOptions.find(
                              item =>
                                String(item?.value) ===
                                String(value)
                            );

                          setEditData(
                            prev => ({
                              ...prev,
                              role_id:
                                value,
                              role:
                                selected?.label ||
                                "",
                            })
                          );
                        }
                      }
                      className="
                        select
                        select-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    >

                      <option value="">
                        Pilih Role
                      </option>

                      {
                        roleOptions.map(
                          item => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </option>
                          )
                        )
                      }

                    </select>
                  </div>

                </div>


                {/* CABANG */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    Cabang

                  </label>


                  <div className="relative">
                    <FaStore
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        z-10
                      "
                    />

                    <select
                      value={
                        editData.cabang_id ||
                        ""
                      }
                      onChange={
                        e => {
                          const value =
                            e.target.value;

                          const selected =
                            cabangOptions.find(
                              item =>
                                String(item?.value) ===
                                String(value)
                            );

                          setEditData(
                            prev => ({
                              ...prev,
                              cabang_id:
                                value,
                              cabang:
                                selected?.label ||
                                "",
                            })
                          );
                        }
                      }
                      className="
                        select
                        select-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    >

                      <option value="">
                        Pilih Cabang
                      </option>

                      {
                        cabangOptions.map(
                          item => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </option>
                          )
                        )
                      }

                    </select>
                  </div>

                </div>


                {/* STATUS */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-gray-700
                      mb-2
                    "
                  >

                    Status

                  </label>


                  <div className="relative">
                    <FaCheckCircle
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        z-10
                      "
                    />

                    <select
                      value={
                        editData.status ||
                        ""
                      }
                      onChange={
                        e =>
                          setEditData(
                            prev => ({
                              ...prev,
                              status:
                                e.target.value,
                            })
                          )
                      }
                      className="
                        select
                        select-bordered
                        w-full
                        rounded-xl
                        pl-11
                      "
                    >

                      <option value="AKTIF">
                        Aktif
                      </option>

                      <option value="NONAKTIF">
                        Nonaktif
                      </option>

                    </select>
                  </div>

                </div>

              </div>


              {/* FOOTER */}

              <div
                className="
                  border-t
                  bg-gray-50
                  px-6
                  py-4
                  flex
                  justify-end
                  gap-3
                  flex-shrink-0
                "
              >

                <button
                  type="button"
                  onClick={
                    closeEdit
                  }
                  disabled={isSaving}
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    bg-gray-200
                    text-gray-700
                    text-sm
                    font-semibold
                  "
                >

                  Batal

                </button>


                <button
                  type="button"
                  onClick={
                    handleSaveEdit
                  }
                  disabled={isSaving}
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    bg-primary
                    text-white
                    text-sm
                    font-semibold
                  "
                >

                  {isSaving
                    ? "Menyimpan..."
                    : showAddUser
                      ? "Tambah User"
                      : "Simpan"}

                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

};


export default TableManajemenUser;