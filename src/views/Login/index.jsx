import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import storeSchema from 'global/store'
import { ReactComponent as POTTER_LOGO } from 'assets/POTTER_LOGO.svg'
import { ReactComponent as LOGO_KFTD } from 'assets/logo_kftd_warna.svg'
import BATIK from 'assets/BATIK_SIDEBAR.png'
import LOGO_LOGIN from 'assets/LOGO_FIX.png'
import BG_LOGIN from 'assets/BG_NEW.png'
import { ReactComponent as BgModal } from 'assets/BgModal.svg';
import KFTD_WARNA from 'assets/logo_kftd_warna.svg'
import KFTD_PUTIH from 'assets/LOGO_PUTIH_FIX.png'
import { decodeData, encodeData } from 'global/helper/jwt'
import { getCookies, setCookies } from 'global/helper/cookie'
import { Label, Modal } from 'components/atoms'
import { setToggleModal } from '../../redux/n2n/global';
import { swal } from 'global/helper/swal';
import { FaArrowRight, FaInfoCircle, FaKey, FaUser, FaUserAlt, FaUserCircle } from "react-icons/fa";
import LOGO_MAINTENANCE from 'assets/logo_maintenance.png';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
  document.title = 'COSTRACK | Login';

  const dispatch = useDispatch();
  const { toggleModal } = useSelector(state => state.global);

  const loginRef = useRef();

  const [isMaintenance, setIsMaintenance] = useState(false);
  // null = loading | true = maintenance | false = normal

  const [dataLogin, setDataLogin] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  // const [role, setRole] = useState({});
  const [role, setRole] = useState();
  const [access, setAccess] = useState([]);

  const [form, setForm] = useState({
    user_name: "",
    user_password: "",
  });

  const getLoginData = getCookies('loginData');
  const getAccountAccess = getCookies('accountAccess');

  // ===============================
  // CHECK MAINTENANCE ON PAGE LOAD
  // ===============================
  // useEffect(() => {
  //   const checkMaintenance = async () => {
  //     try {
  //       const res = await storeSchema.actions.CheckMaintenance();
  //       setIsMaintenance(res?.maintenance === true);
  //     } catch (error) {
  //       // FAIL SAFE
  //       setIsMaintenance(true);
  //     }
  //   };

  //   checkMaintenance();
  // }, []);

  // ===============================
  // GET LOGIN DATA (ROLE MODAL)
  // ===============================
  useEffect(() => {
    const get = async () => {
      const decode = await decodeData(getLoginData);
      setDataLogin(decode);
    };

    if (getLoginData) get();
  }, [getLoginData]);

  useEffect(() => {
    if (getLoginData && getAccountAccess) {
      window.location.href = '/';
      return
    }
  }, [getAccountAccess, getLoginData]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===============================
  // LOGIN (NO MAINTENANCE CHECK HERE)
  // ===============================
  const handleLogin = async (e) => {
    e.preventDefault();
    swal.loading();
    try {
      if (getLoginData && getAccountAccess) {
        window.location.href = '/';
        return
      }
      const dataEncode = await encodeData(form);
      const res = await storeSchema.actions.login(dataEncode);
      swal.close();
      // setAccess([
      //   {
      //     label: "Pemohon",
      //     value: "Pemohon"
      //   },
      //   {
      //     label: "Atasan Pemohon",
      //     value: "Atasan Pemohon"
      //   },
      //   {
      //     label: "Sub Unit SDM & Umum",
      //     value: "Sub Unit SDM & Umum"
      //   },
      //   {
      //     label: "Sub Unit Logistik",
      //     value: "Sub Unit Logistik"
      //   },
      //   {
      //     label: "Sub Unit Pajak",
      //     value: "Sub Unit Pajak"
      //   },
      //   {
      //     label: "Sub Unit Financial Controller",
      //     value: "Sub Unit Financial Controller"
      //   },
      //   {
      //     label: "Sub Unit Akuntansi Kantor Pusat",
      //     value: "Sub Unit Akuntansi Kantor Pusat"
      //   },
      //   {
      //     label: "Sub Unit Anggaran",
      //     value: "Sub Unit Anggaran"
      //   },
      //   {
      //     label: "Manager Keuangan",
      //     value: "Manager Keuangan"
      //   },
      //   {
      //     label: "Direktur Keuangan, Manrisk & Sdm",
      //     value: "Direktur Keuangan, Direktur Keuangan, Manrisk & Sdm"
      //   },
      //   {
      //     label: "Sub Unit Keuangan Treasury",
      //     value: "Sub Unit Keuangan Treasury"
      //   },
      //   {
      //     label: "Super Admin",
      //     value: "Super Admin"
      //   },
      // ]); // ini harus dihapus nanti

      if (res?.status === true) {
        // setCookies('accountAccess', res?.data);
        // setCookies('loginData', dataEncode);
        window.location.href = '/';
        // dispatch(setToggleModal({ isOpen: true, modal: "selectRole" }));
      } else {
        swal.error(res?.data?.data || 'Login gagal');
      }
    } catch (error) {
      swal.close();
      swal.error('Terjadi kesalahan sistem');
    }
    // try {
    //   const dataEncode = await encodeData(form);
    //   const res = await storeSchema.actions.login(dataEncode);
    //   swal.close();

    //   if (res?.status === true) {
    //     if (res?.flag === true) {
    //       setAccess(res?.access);
    //       setCookies('listAccess', res?.access);
    //     } else {
    //       setCookies('accountAccess', JSON.stringify(res?.access[0]));
    //       window.location.href = '/';
    //     }

    //     setCookies('loginData', res?.data);
    //     dispatch(setToggleModal({ isOpen: true, modal: "selectRole" }));
    //   } else {
    //     swal.error(res?.data?.data || 'Login gagal');
    //   }
    // } catch (error) {
    //   swal.close();
    //   swal.error('Terjadi kesalahan sistem');
    // }
  };

  const handleRole = (e) => {
    // setRole(JSON.parse(e.target.value));
    setRole(e.target.value);
  };

  const backgroundStyle = {
    backgroundImage: `
    url(${KFTD_PUTIH}),
    linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    url(${BG_LOGIN})
  `,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `
    20px 20px,              /* kiri atas */
    right calc(100% + 0px),
    center,
    center
  `,
    backgroundSize: window.innerWidth <= 768
      ? '100px, cover, cover'
      : '100px, cover, cover',
  };

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

  // ===============================
  // RENDER
  // ===============================

  return (
    <>
      {/* ================= MODAL ROLE ================= */}
      <Modal
        title="Pilih Unit Anda"
        modal="selectRole"
        buttonFooter={
          <button
            className="btn rounded-[25px] px-5 ml-3 text-white bg-blue-900 border-none"
            onClick={() => {
              // setCookies('accountAccess', JSON.stringify(role));
              setCookies('accountAccess', role);
              dispatch(setToggleModal({ isOpen: false, modal: "" }));
              window.location.href = '/';
            }}
            // disabled={!role?.kode}
            disabled={role === '' || !role}
          >
            Done <FaArrowRight />
          </button>
        }
      >
        <div className="relative">
          {/* <BgModal width="100%" />
          <div className="absolute top-3 left-5 border-l-2 pl-5">
            <h3 className="font-bold text-lg text-white">{dataLogin?.NAMA}</h3>
            <div className="flex gap-3 text-white text-sm">
              <p>{dataLogin?.USERNAME}</p>
              <span>|</span>
              <p>{dataLogin?.NAMA_SUB}</p>
            </div>
          </div> */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-6 text-white">

            {/* SVG Background */}
            <BgModal className="absolute inset-0 w-full h-full object-cover opacity-80" />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-5">

              {/* Avatar */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-black">
                {/* {getInitials(dataLogin?.NAMA)} */}
                {getInitials(form?.user_name)}
              </div>

              {/* Info */}
              <div>
                {/* <p className="text-xl font-semibold">{dataLogin?.NAMA}</p>
                <p className="text-sm opacity-80 mt-1">
                  {dataLogin?.USERNAME} <span className="mx-2">|</span> {dataLogin?.NAMA_SUB}
                </p> */}
                <p className="text-xl font-semibold">{form?.user_name}</p>
                <p className="text-sm opacity-80 mt-1">
                  Development <span className="mx-2">|</span> {form?.user_password}
                </p>
              </div>

            </div>
          </div>
          <div className="flex items-start gap-4 mt-3">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <FaUser className="text-blue-900 text-lg" />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <p className="text-gray-600 font-semibold">
                Choose Your Roles
              </p>
              <p className="text-sm text-gray-500">
                Silakan pilih role yang sesuai dengan pekerjaan Anda.
              </p>
            </div>
          </div>
          <div className="mt-1">
            <Label
              label=""
              children={
                <select
                  className="select select-sm w-full input-bordered border border-blue-900 rounded-[15px]"
                  onChange={handleRole}
                >
                  {/* <option value={JSON.stringify({ kode: '', uraian: '' })}></option> */}
                  <option value=""></option>
                  {/* {access?.map(data => (
                    <option key={data.kode} value={JSON.stringify(data)}>
                      {data.uraian}
                    </option>
                  ))} */}
                  {access?.map((data, i) => (
                    <option key={i} value={data?.value}>
                      {data?.label}
                    </option>
                  ))}
                </select>
              }
            />
          </div>
        </div>
      </Modal>

      {/* ================= LOADING ================= */}
      {isMaintenance === null && (
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* ================= MAINTENANCE PAGE ================= */}
      {/* {isMaintenance === true && (
        <div
          className="flex items-center justify-center min-h-screen px-4"
          style={backgroundStyle}
        >
          <div
            className="
              bg-base-100
              rounded-2xl
              shadow-2xl
              w-full
              max-w-3xl
              p-4
            "
          >
            <img
              src={LOGO_MAINTENANCE}
              alt="Maintenance"
              className="
                w-full
                max-h-[70vh]
                object-contain
                rounded-xl
              "
            />
          </div>
        </div>
      )} */}

      {/* ================= LOGIN FORM ================= */}
      {/* {isMaintenance === false && ( */}
      <div
        ref={loginRef}
        className="flex items-center justify-center min-h-screen px-4"
        style={backgroundStyle}
      >
        <div className="relative">

          {/* Outer Glow */}
          <div
            className="
        absolute
        -inset-3
        rounded-[32px]
        bg-gradient-to-r
        from-blue-500/20
        via-cyan-400/10
        to-orange-500/20
        blur-2xl
      "
          />

          {/* Login Card */}
          {/* <div className="w-full md:max-w-md shadow-all bg-base-100 bg-opacity-40 rounded-xl p-6"> */}

          <div
            className="
        relative
        w-full
        md:w-[450px]
        lg:w-[450px]
        rounded-[32px]
        p-8
        bg-slate-900/40
        backdrop-blur-xl
        border
        border-white/10
        shadow-[0_0_30px_rgba(37,99,235,0.35),0_0_60px_rgba(249,115,22,0.15)]
        overflow-hidden
      "
          >

            {/* Top Highlight */}
            <div
              className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-40
          h-[2px]
          bg-gradient-to-r
          from-transparent
          via-cyan-400
          to-transparent
        "
            />

            {/* Glass Reflection */}
            <div
              className="
          absolute
          top-0
          left-0
          w-full
          h-24
          bg-gradient-to-b
          from-white/10
          to-transparent
          pointer-events-none
        "
            />

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <img
                src={LOGO_LOGIN}
                alt="Logo Cost"
                className="w-64"
              />

              <h1 className="text-3xl font-semibold text-white mt-2">
                Cost Tracking
                <span className="text-orange-400 ml-2">
                  System
                </span>
              </h1>
            </div>

            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">

                {/* Username */}
                <div
                  className="
              flex
              items-center
              rounded-xl
              px-4
              py-3
              border
              border-white/10
              bg-white/5
              focus-within:border-blue-400
              transition-all
            "
                >
                  <FaUserAlt className="text-gray-300 mr-3" />

                  <input
                    name="user_name"
                    placeholder="Username"
                    onChange={handleChange}
                    className="
                w-full
                bg-transparent
                outline-none
                text-white
                placeholder:text-gray-400
              "
                  />
                </div>

                {/* Password */}
                <div
                  className="
              flex
              items-center
              rounded-xl
              px-4
              py-3
              border
              border-white/10
              bg-white/5
              focus-within:border-blue-400
              transition-all
            "
                >
                  <FaKey className="text-gray-300 mr-3" />

                  <input
                    name="user_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={handleChange}
                    className="
                w-full
                bg-transparent
                outline-none
                text-white
                placeholder:text-gray-400
              "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-300 hover:text-white"
                  >
                    {showPassword
                      ? <HiEyeOff className="text-xl" />
                      : <HiEye className="text-xl" />}
                  </button>
                </div>

                {/* Remember */}
                {/* <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Forgot Password?
                  </button>
                </div> */}

                {/* Login Button */}
                <button
                  type="submit"
                  className="
              w-full
              h-12

              rounded-full

              text-white
              font-semibold

              bg-gradient-to-r
              from-blue-700
              via-blue-600
              to-orange-500

              shadow-[0_0_20px_rgba(37,99,235,0.5)]

              hover:scale-[1.02]
              hover:shadow-[0_0_30px_rgba(37,99,235,0.7)]

              transition-all
              duration-300
            "
                >
                  <div className="flex items-center justify-center gap-2">
                    Login
                    <FaArrowRight />
                  </div>
                </button>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 mt-2">
                  © 2026 Kimia Farma Trading & Distribution
                  <br />
                  All rights reserved.
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
};

export default Login;
