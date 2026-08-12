import React, { useEffect, useState } from 'react'
// import UnderConstruction from 'views/UnderConstruction';
import { ReactComponent as Dashboard2 } from 'assets/Dashboard2.svg'
import { getCookies } from 'global/helper/cookie';
import { decodeData } from 'global/helper/jwt';
import chart from 'assets/chart.png'
import graph from 'assets/graph.png'
import dashboard from 'assets/dashboard.png'
import { formatCurrency } from 'global/helper/formatCurrency';
import { IoAddOutline, IoBarChartSharp, IoBookmark, IoBusinessOutline, IoCalendar, IoCalendarOutline, IoCheckmarkCircle, IoCubeOutline, IoMegaphoneOutline, IoMegaphoneSharp, IoNewspaperOutline, IoNewspaperSharp, IoPeopleOutline, IoPersonOutline, IoReader, IoRibbon, IoRibbonOutline, IoStarOutline, IoTodayOutline, IoTrendingUpOutline, IoPieChartOutline, IoStatsChartOutline } from 'react-icons/io5';
import { ReactComponent as Icon } from 'assets/icons/coin.svg'
import storeSchema from 'global/store';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AsyncSelect, Label } from 'components/atoms';
import { swal } from 'global/helper/swal';
import { BsFilter } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosPerson } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { setToggleModal } from '../../redux/n2n/global';
import ModalTask from './Modal/ModalTask';
import ModalTaskEdit from './Modal/ModalTaskEdit';
import { formatDate, formatDateUS } from 'global/helper/formatDate';
import work_people from 'assets/work_people.png'
import no_data from 'assets/no_data.png'
import CalendarComponent from './Components/Calendar';
import { HiOutlineChartPie, HiOutlineChartSquareBar } from 'react-icons/hi';
import MonitoringPengajuanCabang from './Components/Chart/MonitoringPengajuanCabang';
import VendorBillingRealization from './Components/Chart/VendorBillingRealization';
import StatusBilling from './Components/Chart/StatusBilling';
import InboxForm from './Components/Chart/inbox';
import { FaBriefcase, FaBuilding, FaBullseye, FaCalculator, FaChartLine, FaChartPie, FaCheckCircle, FaDollarSign, FaFileAlt, FaFileInvoiceDollar, FaFilter, FaHourglassHalf, FaMoneyBillWave, FaMoneyCheckAlt, FaPercentage, FaPlusCircle, FaRegCheckCircle, FaShoppingCart, FaStore, FaTimes, FaTruck, FaUserAlt, FaUserCheck, FaUserTie } from 'react-icons/fa';
import BG_SIDEBAR from 'assets/BG_SIDEBAR.png'
import TaskAktif from './Components/Chart/TaskAktif';
import ModalCard1 from './Modal/ModalCard1';
import { FaDownLeftAndUpRightToCenter, FaListCheck } from 'react-icons/fa6';
import MonitoringPengajuanPusat from './Components/Chart/MonitoringPengajuanPusat';
import PengajuanPusat from './Components/Chart/PengajuanPusat';
import PengajuanCabang from './Components/Chart/PengajuanCabang';
import KPIPerformanceCard from './Components/Chart/KPIPerformanceCard';
import SLAPerformanceCard from './Components/Chart/SLAPerformanceCard';
import ModalFilter1 from './Modal/ModalFilter1';
import ModalFilter2 from './Modal/ModalFilter2';
import ModalSLA from './Modal/ModalSLA';
import { formatNominalSingkat } from 'global/helper/functionOption';
import OmsetCard from './Components/Chart/OmsetCard';
import ModalFilterOmset from './Modal/ModalFilterOmset';
import DashboardPerCOA from './Components/Chart/DashboardPerCoa';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { toggleModal, dimensionScreenW, check } = useSelector((state) => state.global);
  const [loginAccess, setLoginAccess] = useState({});
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [search, setSearch] = useState('');
  const [dataOmset, setDataOmset] = useState();
  const [colorDetailTask, setColorDetailTask] = useState({ header: 'bg-blue-400', detail: 'blue-500' });
  const [dataTotal, setDataTotal] = useState({
    overall: '',
    pymad: '',
    piutang: '',
    cashin: '',
    persen: {
      btnOverall: '',
      overall: '',
      btnPymad: '',
      pymad: '',
      btnPiutang: '',
      piutang: '',
      btnCashin: '',
      cashin: ''
    }
  });
  const [projectData, setProjectData] = useState({});
  const [listTask, setListTask] = useState([]);
  const [detailTask, setDetailTask] = useState({});
  const [activeTask, setActiveTask] = useState();
  const [nilaiKontak, setNilaiKontrak] = useState([]);
  const [yearArea, setYearArea] = useState(`${new Date().getFullYear()}`);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summary, setSummary] = useState({});
  const [dataSlaOverview, setDataSlaOverview] = useState();
  const [dataSlaPerformance, setDataSlaPerformance] = useState([]);
  const [loadingSummaryPengajuan, setLoadingSummaryPengajuan] = useState(true);
  const [loadingSLAPerformance, setLoadingSLAPerformance] = useState(true);
  const [summaryPengajuan, setSummaryPengajuan] = useState({});
  const [loadingSummaryOmset, setLoadingSummaryOmset] = useState(true);
  const [summaryOmset, setSummaryOmset] = useState({});
  const [loadingSummaryMonitoring, setLoadingSummaryMonitoring] = useState(true);
  const [summaryMonitoring, setSummaryMonitoring] = useState({});
  const [kategori, setKategori] = useState('')
  const [detailFilter, setDetailFilter] = useState([])
  const [periode, setPeriode] = useState('')
  const [ytd, setYtd] = useState(false)
  const [filterKPI, setFilterKPI] = useState()
  const [filterCabang, setFilterCabang] = useState([])
  const [dataFilterOmset, setDataFilterOmset] = useState({
    cabang: null,
    periode: '',
    ytd: false
  })

  const SummaryCardSkeleton = () => (
    <div className="animate-pulse rounded-[10px] bg-white border shadow-md p-4 min-h-[120px]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-200"></div>

        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-100 rounded w-24"></div>
        </div>
      </div>

      <div className="mt-6 h-7 bg-gray-200 rounded w-40"></div>
    </div>
  );

  const getDashboardSummary = async () => {
    try {
      setLoadingSummary(true);

      const response = await storeSchema.actions.getDashboardSummary({
        kategori: kategori,
        detailFilter: detailFilter,
        periode: periode,
        ytd: ytd
      });

      if (response.status) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error(err);
      swal.error("Gagal mengambil data dashboard");
    } finally {
      setLoadingSummary(false);
    }
  };

  const getPengajuanSummary = async () => {
    try {
      setLoadingSummaryPengajuan(true);

      const response = await storeSchema.actions.getPengajuanSummary({
        kategori: kategori,
        detailFilter: detailFilter,
        periode: periode,
        ytd: ytd
      });

      if (response.status) {
        setSummaryPengajuan(response.data);
      }
    } catch (err) {
      console.error(err);
      swal.error("Gagal mengambil data dashboard");
    } finally {
      setLoadingSummaryPengajuan(false);
    }
  };

  const getSLAOverview = async () => {
    try {
      // setLoadingSummaryPengajuan(true);

      const response = await storeSchema.actions.getSLAOverview();

      if (response.status) {
        setDataSlaOverview(response.data);
      }
    } catch (err) {
      console.error(err);
      swal.error("Gagal mengambil data dashboard");
    } finally {
      // setLoadingSummaryPengajuan(false);
    }
  };

  const getSLAPerformance = async () => {
    try {
      setLoadingSLAPerformance(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await storeSchema.actions.getSLAPerformance({
        periode: filterKPI?.periode
      });

      if (response.status) {
        setDataSlaPerformance(response.data);
      }

    } catch (err) {
      console.error(err);
      swal.error("Gagal mengambil data dashboard");
    } finally {
      setLoadingSLAPerformance(false);
    }
  };

  const handleChangeFilterKPI = (e) => {
    setFilterKPI({
      ...filterKPI,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (filterKPI) {
      getSLAPerformance()
    }
  }, [filterKPI])

  const getPengajuanOmset = async () => {
    try {
      setLoadingSummaryOmset(true);

      const response = await storeSchema.actions.getListCoaDetailDashboard({
        cabang_id: dataFilterOmset?.cabang ? dataFilterOmset?.cabang : [{ label: '', value: loginAccess?.cabang_id }],
        // coa_detail_id: dataFilterOmset?.coa_detail?.value ?? '',
        // periode: dataFilterOmset?.periode ? dataFilterOmset?.periode : `${new Date().getFullYear()}-${String(
        //   new Date().getMonth() + 1
        // ).padStart(2, '0')}`,
        periode: dataFilterOmset?.periode ? dataFilterOmset?.periode : '',
        ytd: dataFilterOmset?.ytd
      });

      if (response.status) {
        setSummaryOmset(response.data);
      }
    } catch (err) {
      console.error(err);
      swal.error("Gagal mengambil data dashboard");
    } finally {
      setLoadingSummaryOmset(false);
    }
  };

  const getMonitoringSummary = async () => {
    try {
      setLoadingSummaryMonitoring(true);

      const response = await storeSchema.actions.getMonitoringSummary({
        kategori: kategori,
        detailFilter: detailFilter,
        periode: periode,
        ytd: ytd
      });

      if (response.status) {
        setSummaryMonitoring(response.data);
      }
    } catch (err) {
      console.error(err);
      swal.error("Gagal mengambil data dashboard");
    } finally {
      setLoadingSummaryMonitoring(false);
    }
  };

  useEffect(() => {
    getDashboardSummary();
    getPengajuanSummary();
    getMonitoringSummary();
    getPengajuanOmset()
    getSLAOverview()
    getSLAPerformance()
  }, [loginAccess]);

  const handleTerapkanFilter = async () => {
    await getDashboardSummary()
    await getPengajuanSummary()
    await getMonitoringSummary()
  }

  const resetFilterOmset = (e) => {
    e.preventDefault()
    setFilterCabang([])
    setDataFilterOmset({
      cabang: [],
      periode: '',
      ytd: false
    })
  }

  const resetFilter1 = (e) => {
    e.preventDefault()
    setDetailFilter([])
    setKategori('')
    setPeriode('')
  }

  useEffect(() => {
    if (dataFilterOmset?.cabang?.length === 0) {
      getPengajuanOmset()
    }
  }, [dataFilterOmset])

  useEffect(() => {
    if (detailFilter?.length === 0 && !kategori && !periode) {
      getPengajuanSummary()
      getDashboardSummary()
      getMonitoringSummary()
    }
  }, [detailFilter, kategori, periode])

  const handleTerapkanFilterOmset = async () => {
    if (!dataFilterOmset?.cabang || !dataFilterOmset?.periode) {
      swal.warning('Mohon Lengkapi Isian Data !')
      return
    } else {
      await getPengajuanOmset()
    }
  }

  console.log(detailFilter, 'detailFilter');

  // =========================
  // INFORMASI PENJUALAN (NEW)
  // =========================
  const salesInfo = {
    totalPenjualan: 1250000000,
    targetPenjualan: 2000000000,
    penjualanBulanIni: 185000000,
    penjualanBulanLalu: 150000000,
  };

  const salesGrowth =
    salesInfo.penjualanBulanLalu === 0
      ? 0
      : ((salesInfo.penjualanBulanIni - salesInfo.penjualanBulanLalu) /
        salesInfo.penjualanBulanLalu) *
      100;

  const progressTarget =
    salesInfo.targetPenjualan === 0
      ? 0
      : (salesInfo.totalPenjualan / salesInfo.targetPenjualan) * 100;

  const headerTablePeople = ["NO", "NIK", "NAMA", "EMAIL"];

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500"
  ];

  const [chartData, setChartData] = useState();

  function formatRupiahShort(value) {
    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(1)}M`; // Miliar
    } else if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)} JT`; // Juta
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  }

  function formatRupiahForArea(value) {
    if (value >= 1_000_000_000_000) {
      return `Rp ${(value / 1_000_000_000_000).toFixed(2)}T`; // Miliar
    } else if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(2)}M`; // Miliar
    } else if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(2)}JT`; // Juta
    } else if (value >= 1_000) {
      return `Rp ${(value / 1_000).toFixed(2)}RB`; // Juta
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  }

  useEffect(() => {
    const get = async () => {
      const decoded = await decodeData(getCookies('accountAccess'))
      setLoginAccess(decoded)
    }
    get()
  }, [])

  const formatDate = (isoString) => {
    return isoString.split("T")[0]; // Ambil hanya bagian "2025-02-24"
  }

  const getListTask = async (keyword) => {
    const result = await storeSchema.actions.getListTask(keyword);
    if (result?.status) {
      const listData = result?.data?.map((item, index) => {
        // return ({
        //   project_id: data.PROJECT_ID,
        //   name: data.TITLE_TASK,
        //   desc: data.TASK_DETAIL,
        //   status: 'To do',
        //   people: data.CREATED_BY,
        //   dueDate: formatDateUS(data.CREATED_AT),
        //   category: data.TASK_CATEGORY,
        //   color: colors[Math.floor(Math.random() * colors.length)]
        // });
        return ({
          id: item.TASK_ID ? item.TASK_ID : index,
          title: item.TITLE_TASK,
          description: item.TASK_DETAIL,
          status: 'To do',
          people: item.CREATED_BY,
          start: item.START_DATE ? formatDate(item.START_DATE) : formatDate(item.CREATED_AT),
          end: item.END_DATE ? formatDate(item.END_DATE) : formatDate(item.CREATED_AT),
          category: item.TASK_CATEGORY,
          customColor: item.TASK_CATEGORY === 'Agenda' ?
            "linear-gradient(90deg, rgba(44,129,227,0.4724483543417367) 27%, rgba(48,48,152,1) 65%, rgba(0,212,255,1) 100%)" :
            "linear-gradient(90deg, rgba(8,127,129,0.4724483543417367) 0%, rgba(251,255,251,1) 100%)",
          textColor: "black",
          backgroundColor: "white",
          border: 'none'
          // classNames: ["bg-blue-gradient"]
          // color: colors[Math.floor(Math.random() * colors.length)],
        });
      })
      setListTask(listData);
    } else {
      setListTask([]);
    }
  }

  useEffect(() => {
    if (search) getListTask(search);
  }, [search]);

  const handleFilterTask = async (kategori) => {
    if (kategori === 'All') {
      getListTask(search)
    } else {
      swal.loading()
      const data = await storeSchema.actions.getListTask(search);
      if (data.status) {
        const listData = await data?.data?.filter((item) => item.TASK_CATEGORY === kategori)?.map((data, index) => {
          return ({
            // project_id: data.PROJECT_ID,
            // name: data.TITLE_TASK,
            // desc: data.TASK_DETAIL,
            // status: 'To do',
            // people: data.CREATED_BY,
            // dueDate: formatDateUS(data.CREATED_AT),
            // category: data.TASK_CATEGORY,
            // color: colors[Math.floor(Math.random() * colors.length)]
            id: data.TASK_ID ? data.TASK_ID : index,
            title: data.TITLE_TASK,
            description: data.TASK_DETAIL,
            status: 'To do',
            people: data.CREATED_BY,
            start: data.START_DATE ? formatDate(data.START_DATE) : formatDate(data.CREATED_AT),
            end: data.END_DATE ? formatDate(data.END_DATE) : formatDate(data.CREATED_AT),
            category: data.TASK_CATEGORY,
            customColor: data.TASK_CATEGORY === 'Agenda' ?
              "linear-gradient(90deg, rgba(44,129,227,0.4724483543417367) 27%, rgba(48,48,152,1) 65%, rgba(0,212,255,1) 100%)" :
              "linear-gradient(90deg, rgba(8,127,129,0.4724483543417367) 0%, rgba(251,255,251,1) 100%)",
            textColor: "black",
            backgroundColor: "white",
            border: 'none'
          });
        })
        setListTask(listData);
        swal.close()
      }
    }
  }

  const handleSubmitDelete = async (e) => {
    // e.preventDefault();
    try {
      let getListAssign = []
      // if (selectedOptions?.length) {
      //   const assignList = selectedOptions.map((a) => {
      //     getListAssign.push(a?.value);
      //     return 1;
      //   })
      // }
      // console.log("GETDELSASA", detailTask?.task_id)
      // console.log("GETDEL",getListAssign)
      // console.log("GETDEL",data?.title_task)
      if (detailTask?.task_id) {
        swal.loading();
        const res = await storeSchema.actions.deleteTask(detailTask?.task_id)
        if (res?.status === true) {
          swal.success('Berhasil Dihapus !');
        } else {
          swal.error(res?.message);
        };
        getListTask()
      } else {
        swal.warning('Tolong Lengkapi Pengisian Data !')
      }
    } catch (error) {
      console.error(error);
    };
  };

  const features = [
    {
      title: "Paperless",
      desc: "Dokumen digital, aman & mudah diakses",
      icon: <FaCheckCircle />,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Transparan",
      desc: "Tracking real-time setiap tahap",
      icon: <FaCheckCircle />,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Real-Time",
      desc: "Data terkini, mudah dipantau",
      icon: <FaCheckCircle />,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Terintegrasi",
      desc: "Data terpusat, mudah diaudit",
      icon: <FaCheckCircle />,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const legendItems = [
    { label: 'Cabang / Pemohon', color: 'bg-[#15A24F]' }, // Menggunakan RGB 21, 162, 79
    { label: 'Biaya Umum / Pajak / Anggaran / SDM', color: 'bg-yellow-500' },
    { label: 'Bag. Ficon', color: 'bg-orange-500' },
    { label: 'Manajer / Manager Keuangan', color: 'bg-purple-500' },
    { label: 'Direktur', color: 'bg-pink-500' },
    { label: 'Bag. Treasury', color: 'bg-blue-500' },
  ];

  const handleClickCard1 = (tipe) => {
    dispatch(setToggleModal({ isOpen: !toggleModal.isOpen, modal: "modalCard1", tipe_card: tipe }));
  }

  const percen = {
    pengajuan_baru: ((105 / 914) * 100).toFixed(2),
    menunggu_verifikasi: ((124 / 914) * 100).toFixed(2),
    sudah_dibayarkan: ((235 / 914) * 100).toFixed(2),
    menunggu_pembayaran: ((450 / 914) * 100).toFixed(2),
  }

  const getDataOmset = async () => {
    try {
      swal.loading()
      const res = await storeSchema.actions.getDataOmset()
      if (res?.status === true) {
        swal.close()
        setDataOmset(res?.data)
      } else {
        swal.error(res?.message || 'Gagal mendapatkan data pengajuan')
      }
    } catch (error) {
      swal.error('Terjadi kesalahan saat mendapatkan data pengajuan')
      console.error('Error fetching detail pengajuan:', error)
    }
  }

  useEffect(() => {
    if (loginAccess?.role_id && !['RL01', 'RL00', 'RL16', 'RL17'].includes(loginAccess?.role_id)) {
      dispatch(setToggleModal({ isOpen: !toggleModal.isOpen, modal: "modalTask" }));
    }
  }, [loginAccess?.role_id])

  return (
    <>
      <ModalTask dispatch={dispatch} setToggleModal={setToggleModal} toggleModal={toggleModal} />
      <ModalTaskEdit getListTask={getListTask} detailTask={detailTask} search={search} />
      <ModalCard1 />
      <ModalFilter1 loginAccess={loginAccess} resetFilter1={resetFilter1} kategori={kategori} setKategori={setKategori} detailFilter={detailFilter} setDetailFilter={setDetailFilter} periode={periode} setPeriode={setPeriode} handleTerapkanFilter={handleTerapkanFilter} ytd={ytd} setYtd={setYtd} />
      <ModalFilter2 kategori={kategori} setKategori={setKategori} detailFilter={detailFilter} setDetailFilter={setDetailFilter} periode={periode} setPeriode={setPeriode} handleTerapkanFilter={handleTerapkanFilter} />
      <ModalFilterOmset filterCabang={filterCabang} setFilterCabang={setFilterCabang} setDataFilterOmset={setDataFilterOmset} dataFilterOmset={dataFilterOmset} handleTerapkanFilter={handleTerapkanFilterOmset} resetFilterOmset={resetFilterOmset} />
      <ModalSLA />
      <div className='flex flex-col gap-4 m-4'>

        <div className='flex min-[1280px]:flex-row min-[320px]:flex-wrap'>
          <div className='flex flex-wrap lg:flex-nowrap w-full gap-3'>
            <div className={`flex flex-row gap-3 ${['RL06', 'RL08', 'RL10', 'RL11', 'RL00', 'RL16']?.includes(loginAccess?.role_id) ? 'lg:w-1/5 w-full' : 'lg:w-1/3 w-full'}`}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 from-[70%] to-blue-500 p-5 text-white shadow-lg flex justify-between items-center flex-1">
                {/* Konten Teks */}
                <div className="z-10 max-w-md">
                  <h1 className="text-4xl font-bold mb-2 text-center">👋</h1>
                  {/* {dimensionScreenW > 450 && ( */}
                  <p className="text-slate-300 text-sm text-center">
                    Halo <strong>{loginAccess?.nama?.split(" ")[0]}</strong> ! Mari kita periksa status pengajuan biaya hari ini.
                  </p>
                  {/* )} */}
                </div>

                {/* Ilustrasi SVG Abstrak */}
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-40 select-none">
                  <img src={BG_SIDEBAR} className="h-full w-full object-cover" />
                </div>
              </div>

            </div>

            <div className={`grid grid-cols-2 ${['RL06', 'RL08', 'RL10', 'RL11', 'RL00', 'RL16']?.includes(loginAccess?.role_id) ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 items-center w-full lg:flex-1`}>
              {loadingSummary ? (

                Array.from({ length: 8 }).map((_, index) => (
                  <SummaryCardSkeleton key={index} />
                ))

              ) : (
                <>
                  {['RL06', 'RL08', 'RL10', 'RL11', 'RL00', 'RL16'].includes(loginAccess?.role_id) && (
                    <>
                      <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-teal-700 to-teal-500 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition'>
                        <div className="absolute right-1 bottom-0 opacity-[0.7]">

                          <FaStore className='text-5xl' />

                        </div>

                        {/* CONTENT */}
                        <div className='relative z-10 text-md flex flex-row gap-2 lg:gap-3 text-nowrap'>
                          <div className='rounded-lg bg-white p-1'>
                            <FaStore className='text-blue-600' />
                          </div>
                          Sisa Anggaran Cabang
                        </div>

                        <div className='relative z-10 text-lg font-bold'>
                          {formatNominalSingkat(summary?.sisa_anggaran_cabang)}
                        </div>

                      </div>
                      <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-cyan-700 to-cyan-500 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition'>
                        <div className="absolute right-1 bottom-0 opacity-[0.7]">

                          <FaBuilding className='text-5xl' />

                        </div>

                        {/* CONTENT */}
                        <div className='relative z-10 text-md flex flex-row gap-2 lg:gap-3 text-nowrap'>
                          <div className='rounded-lg bg-white p-1'>
                            <FaBuilding className='text-blue-600' />
                          </div>
                          Sisa Anggaran Pusat
                        </div>

                        <div className='relative z-10 text-lg font-bold'>
                          {formatNominalSingkat(summary?.sisa_anggaran_pusat)}
                        </div>

                      </div>
                    </>
                  )}
                  <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-blue-900 to-blue-600 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition cursor-pointer' onClick={() => handleClickCard1('total_pengajuan')}>
                    <div className="absolute right-1 bottom-0 opacity-[0.7]">

                      <FaListCheck className='text-5xl' />

                    </div>

                    {/* CONTENT */}
                    <div className='relative z-10 text-md flex flex-row gap-2 lg:gap-3 text-nowrap'>
                      <div className='rounded-lg bg-white p-1'>
                        <FaPlusCircle className='text-blue-600' />
                      </div>
                      Total Pengajuan
                    </div>

                    <div className='relative z-10 text-lg font-bold'>
                      {formatNominalSingkat(summary?.total_nominal_pengajuan)}
                    </div>

                  </div>
                  <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-green-700 to-green-500 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition cursor-pointer' onClick={() => handleClickCard1('sudah_dibayarkan')}>
                    {/* BACKGROUND IMAGE */}
                    {/* <img
                src={graph}
                alt="bg"
                className="absolute right-0 bottom-3 w-24 pointer-events-none"
              /> */}
                    <div className="absolute right-2 bottom-1.5 w-[70px] h-[70px] opacity-[0.7]">

                      {/* BACKGROUND 100% */}
                      <div
                        className="
                    radial-progress
                    text-white/20
                    absolute inset-0
                  "
                        style={{
                          "--value": 100,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                      />

                      {/* ACTIVE PROGRESS */}
                      <div
                        className="
                    radial-progress
                    text-white
                    font-bold
                    absolute inset-0
                    drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]
                  "
                        style={{
                          "--value": summary?.persen_sudah_dibayarkan,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                        role="progressbar"
                      >
                        <div className='flex flex-col items-center justify-center leading-none'>
                          <span className='text-white text-[12px] font-black'>
                            {summary?.persen_sudah_dibayarkan}
                          </span>

                          <span className='text-white/80 text-[10px] font-bold'>
                            %
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className='relative z-10 text-md flex flex-row gap-2 lg:gap-3 text-nowrap'>
                      <div className='rounded-lg bg-white p-1'>
                        <FaMoneyBillWave className='text-green-600' />
                      </div>
                      Sudah Dibayarkan
                    </div>

                    <div className='relative z-10 text-lg font-bold'>
                      {formatNominalSingkat(summary?.nominal_sudah_dibayarkan)}
                    </div>

                  </div>
                  <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-sky-700 to-sky-500 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition cursor-pointer' onClick={() => handleClickCard1('pengajuan_baru')}>
                    {/* BACKGROUND IMAGE */}
                    {/* <img
                src={graph}
                alt="bg"
                className="absolute right-0 bottom-3 w-24 pointer-events-none"
              /> */}
                    <div className="absolute right-2 bottom-1.5 w-[70px] h-[70px] opacity-[0.7]">

                      {/* BACKGROUND 100% */}
                      <div
                        className="
                    radial-progress
                    text-white/20
                    absolute inset-0
                  "
                        style={{
                          "--value": 100,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                      />

                      {/* ACTIVE PROGRESS */}
                      <div
                        className="
                    radial-progress
                    text-white
                    font-bold
                    absolute inset-0
                    drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]
                  "
                        style={{
                          "--value": summary?.persen_pengajuan_baru,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                        role="progressbar"
                      >
                        <div className='flex flex-col items-center justify-center leading-none'>
                          <span className='text-white text-[12px] font-black'>
                            {summary?.persen_pengajuan_baru}
                          </span>

                          <span className='text-white/80 text-[10px] font-bold'>
                            %
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className='relative z-10 text-md flex flex-row gap-2 lg:gap-3 text-nowrap'>
                      <div className='rounded-lg bg-white p-1'>
                        <FaPlusCircle className='text-blue-600' />
                      </div>
                      Pengajuan Baru
                    </div>

                    <div className='relative z-10 text-lg font-bold'>
                      {formatNominalSingkat(summary?.nominal_pengajuan_baru)}
                    </div>

                  </div>
                  <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-yellow-700 to-yellow-500 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition cursor-pointer' onClick={() => handleClickCard1('menunggu_verifikasi')}>
                    {/* BACKGROUND IMAGE */}
                    {/* <img
                src={chart}
                alt="bg"
                className="absolute right-0 bottom-0 w-24 pointer-events-none"
              /> */}
                    <div className="absolute right-2 bottom-1.5 w-[70px] h-[70px] opacity-[0.7]">

                      {/* BACKGROUND 100% */}
                      <div
                        className="
                    radial-progress
                    text-white/20
                    absolute inset-0
                  "
                        style={{
                          "--value": 100,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                      />

                      {/* ACTIVE PROGRESS */}
                      <div
                        className="
                    radial-progress
                    text-white
                    font-bold
                    absolute inset-0
                    drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]
                  "
                        style={{
                          "--value": summary?.persen_menunggu_verifikasi,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                        role="progressbar"
                      >
                        <div className='flex flex-col items-center justify-center leading-none'>
                          <span className='text-white text-[12px] font-black'>
                            {summary?.persen_menunggu_verifikasi}
                          </span>

                          <span className='text-white/80 text-[10px] font-bold'>
                            %
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className='relative z-10 text-md flex flex-row gap-2 lg:gap-3 text-nowrap'>
                      <div className='rounded-lg bg-white p-1'>
                        <FaHourglassHalf className='text-yellow-600' />
                      </div>
                      Menunggu Verifikasi
                    </div>

                    <div className='relative z-10 text-lg font-bold'>
                      {formatNominalSingkat(summary?.nominal_menunggu_verifikasi)}
                    </div>
                  </div>
                  <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-orange-500 to-yellow-500 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition cursor-pointer' onClick={() => handleClickCard1('menunggu_pembayaran')}>
                    {/* BACKGROUND IMAGE */}
                    {/* <img
                src={graph}
                alt="bg"
                className="absolute right-0 bottom-3 w-24 pointer-events-none"
              /> */}
                    <div className="absolute right-2 bottom-1.5 w-[70px] h-[70px] opacity-[0.7]">

                      {/* BACKGROUND 100% */}
                      <div
                        className="
                    radial-progress
                    text-white/20
                    absolute inset-0
                  "
                        style={{
                          "--value": 100,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                      />

                      {/* ACTIVE PROGRESS */}
                      <div
                        className="
                    radial-progress
                    text-white
                    font-bold
                    absolute inset-0
                    drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]
                  "
                        style={{
                          "--value": summary?.persen_menunggu_pembayaran,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                        role="progressbar"
                      >
                        <div className='flex flex-col items-center justify-center leading-none'>
                          <span className='text-white text-[12px] font-black'>
                            {summary?.persen_menunggu_pembayaran}
                          </span>

                          <span className='text-white/80 text-[10px] font-bold'>
                            %
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className='relative z-10 text-sm flex flex-row gap-2 lg:gap-2 text-nowrap'>
                      <div className='rounded-lg bg-white p-1'>
                        <FaHourglassHalf className='text-orange-500' />
                      </div>
                      Menunggu Pembayaran
                    </div>

                    <div className='relative z-10 text-lg font-bold'>
                      {formatNominalSingkat(summary?.nominal_menunggu_pembayaran)}
                    </div>
                  </div>
                  <div className='relative p-3 lg:p-4 text-white gap-2 flex flex-col rounded-[10px] bg-gradient-to-r from-red-800 to-red-600 min-w-[150px] shadow-md overflow-hidden hover:scale-105 transition cursor-pointer' onClick={() => handleClickCard1('ditolak')}>
                    {/* BACKGROUND IMAGE */}
                    {/* <img
                src={graph}
                alt="bg"
                className="absolute right-0 bottom-3 w-24 pointer-events-none"
              /> */}
                    <div className="absolute right-2 bottom-1.5 w-[70px] h-[70px] opacity-[0.7]">

                      {/* BACKGROUND 100% */}
                      <div
                        className="
                    radial-progress
                    text-white/20
                    absolute inset-0
                  "
                        style={{
                          "--value": 100,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                      />

                      {/* ACTIVE PROGRESS */}
                      <div
                        className="
                    radial-progress
                    text-white
                    font-bold
                    absolute inset-0
                    drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]
                  "
                        style={{
                          "--value": summary?.persen_ditolak,
                          "--size": "70px",
                          "--thickness": "8px"
                        }}
                        role="progressbar"
                      >
                        <div className='flex flex-col items-center justify-center leading-none'>
                          <span className='text-white text-[12px] font-black'>
                            {summary?.persen_ditolak}
                          </span>

                          <span className='text-white/80 text-[10px] font-bold'>
                            %
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className='relative z-10 text-md flex flex-row gap-2 lg:gap-3 text-nowrap'>
                      <div className='rounded-lg bg-white p-1'>
                        <FaTimes className='text-red-600' />
                      </div>
                      Ditolak
                    </div>

                    <div className='relative z-10 text-lg font-bold'>
                      {formatNominalSingkat(summary?.nominal_ditolak)}
                    </div>

                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-wrap lg:flex-nowrap min-h-max w-full lg:gap-4 gap-y-6'>
          <div className='min-[1280px]:w-[70%] min-[320px]:w-full flex flex-col gap-3'>
            <PengajuanPusat dataX={summaryPengajuan} loading={loadingSummaryPengajuan} />
            {/* <PengajuanCabang yearArea={yearArea} setYearArea={setYearArea} projectData={projectData} /> */}
          </div>
          <div className='w-full flex flex-col gap-3 h-full'>
            <MonitoringPengajuanPusat dataX={summaryMonitoring} dimensionScreenW={dimensionScreenW} loading={loadingSummaryPengajuan} />
            {/* <MonitoringPengajuanCabang yearArea={yearArea} setYearArea={setYearArea} formatRupiahForArea={formatRupiahForArea} dimensionScreenW={dimensionScreenW} /> */}
          </div>
        </div>
        {['RL10', 'RL11', 'RL06', 'RL08', 'RL00'].includes(loginAccess?.role_id) && (
          <div className='rounded-lg'>
            <DashboardPerCOA loginAccess={loginAccess} summaryOmset={summaryOmset} dataFilterOmset={dataFilterOmset} />
          </div>
        )}
        {/* Informasi Penjualan */}
        {/* {['RL10', 'RL11', 'RL06', 'RL00'].includes(loginAccess?.role_id) && (
          <OmsetCard dataOmset={summaryOmset} dimensionScreenW={dimensionScreenW} loading={loadingSummaryOmset} />
        )} */}
        <div className='flex flex-col lg:flex-row gap-3 w-full'>
          {['RL11', 'RL10', 'RL06', 'RL00', 'RL16'].includes(loginAccess?.role_id) && (
            <div className='w-full lg:w-1/2 overflow-auto h-full'>
              <SLAPerformanceCard dispatch={dispatch} setToggleModal={setToggleModal} data={dataSlaOverview} />
            </div>
          )}
          {!['RL01', 'RL02', 'RL17'].includes(loginAccess?.role_id) && (
            <div className='w-full overflow-auto'>
              <KPIPerformanceCard dispatch={dispatch} setToggleModal={setToggleModal} data={dataSlaPerformance} handleChangeFilterKPI={handleChangeFilterKPI} filterKPI={filterKPI} loading={loadingSLAPerformance} />
            </div>
          )}
        </div>
        {!['RL01', 'RL00', 'RL16', 'RL17'].includes(loginAccess?.role_id) && (
          <div className='border border-gray-300 bg-white shadow-md rounded-xl'>
            <TaskAktif loginAccess={loginAccess} />
          </div>
        )}
        {/* Notification */}
        {/* {["4384", "4386", "5097", "4380"].includes(accountAccess?.kode) && ( */}
        <div className='flex flex-wrap lg:flex-nowrap w-full lg:gap-4 gap-y-6'>
          <div className='w-full'>
            <InboxForm loginAccess={loginAccess} />
          </div>
        </div>
        {/* )} */}
        {/* Close Notification */}

        <div className='flex flex-wrap lg:flex-nowrap w-full lg:gap-4 gap-y-6'>
          <div className='w-full p-4 rounded-md bg-white shadow-md'>
            <h2 className="text-lg font-semibold mb-5">Keunggulan Sistem</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl ${item.bg}`}
                >
                  <div className={`text-xl mt-1 ${item.iconColor}`}>
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex flex-wrap lg:flex-nowrap w-full lg:gap-4 gap-y-6'>
          <div className='w-full p-4 rounded-md bg-white shadow-md'>
            {/* Keterangan Penting */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3">Keterangan Penting:</h4>
              <ul className="space-y-2">
                {/* <li className="flex items-start text-sm text-gray-500">
                  <span className="mr-2 opacity-50">•</span>
                  <p>
                    <span className="text-nowrap font-bold text-lg text-red-500">* Door To Door = CITO *</span> artinya, tidak sama dengan reguler
                  </p>
                </li> */}
                <li className="flex items-start text-sm text-gray-500">
                  <span className="mr-2 opacity-50">•</span>
                  <p>Setiap langkah memiliki status yang dapat dimonitor secara real-time</p>
                </li>
                <li className="flex items-start text-sm text-gray-500">
                  <span className="mr-2 opacity-50">•</span>
                  <p>Semua proses tercentralisasi dan dilakukan secara real-time</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const CardStyle = {
  backgroundImage: `url(${chart})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right bottom'
};

// const Card = ({ title, amount, icon, change, arrow, color }) => {
//   return (
//     <div className={`flex flex-col items-center p-2 rounded-lg text-white transition-transform transform hover:scale-105 ${color} w-48`}>
//       <div className="flex items-center mb-4">
//         <img src={icon} alt={title} className="w-6 h-6 mr-2" />
//         <span className="text-sm font-bold">{title}</span>
//       </div>
//       <p className="text-md mb-2">{amount}</p>
//       <div className="flex items-center">
//         <span className={`text-lg ${arrow === 'up' ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
//         <span className={`ml-2 ${arrow === 'up' ? 'arrow-up' : 'arrow-down'}`}></span>
//       </div>
//     </div>
//   );
// };

export default Dashboard