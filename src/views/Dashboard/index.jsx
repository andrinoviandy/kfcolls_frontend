import React, { useEffect, useMemo, useState } from 'react';
import storeSchema from 'global/store';
import Select, { components as selectComponents } from 'react-select';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import {
  FaFilter,
  FaSyncAlt,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaClock,
  FaExclamationTriangle,
  FaChartBar,
  FaBuilding,
  FaHospital,
  FaBox,
  FaBoxOpen,
  FaUsers,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaChartLine,
  FaWarehouse,
  FaClipboardList,
} from 'react-icons/fa';


/* =========================================================
   AGING LABELS
========================================================= */

/* =========================================================
   AGING
========================================================= */

const agingLabels = [
  '0 - 30 Hari',
  '31 - 45 Hari',
  '46 - 60 Hari',
  '61 - 90 Hari',
  '91 - 180 Hari',
  '181 - 360 Hari',
  '> 360 Hari',
];


/* =========================================================
   HELPER
========================================================= */

const formatNumber = (value) => {

  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(value || 0);

};


const formatRupiah = (value) => {

  return `Rp ${formatNumber(value)}`;

};


const formatShortRupiah = (value) => {

  if (value >= 1000000000000) {
    return `Rp ${(value / 1000000000000).toFixed(1)} T`;
  }

  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(1)} M`;
  }

  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)} Jt`;
  }

  if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(1)} Rb`;
  }

  return `Rp ${formatNumber(value)}`;

};


const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Default periode: satu bulan kalender ke belakang sampai tanggal hari ini.
const getOneMonthAgoDateString = () => {
  const today = new Date();
  const day = today.getDate();
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  start.setDate(Math.min(day, lastDayOfPreviousMonth));
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const date = String(start.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const formatDate = (date) => {
  if (!date) return '-';

  // Date input biasanya string YYYY-MM-DD, tetapi API dapat mengirim
  // Date object atau ISO datetime. Normalisasi sebelum memformat.
  let dateString = '';
  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) return '-';
    dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } else if (typeof date === 'string') {
    dateString = date.trim().slice(0, 10);
  } else {
    return '-';
  }

  const parts = dateString.split('-');
  if (parts.length !== 3 || parts.some((part) => !part)) return '-';
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};


const getAgingCategory = (aging) => {

  if (aging <= 30) {
    return '0 - 30 Hari';
  }

  if (aging <= 45) {
    return '31 - 45 Hari';
  }

  if (aging <= 60) {
    return '46 - 60 Hari';
  }

  if (aging <= 90) {
    return '61 - 90 Hari';
  }

  if (aging <= 180) {
    return '91 - 180 Hari';
  }

  if (aging <= 360) {
    return '181 - 360 Hari';
  }

  return '> 360 Hari';

};


/* =========================================================
   COLORS
========================================================= */

const chartColors = [
  '#2563eb',
  '#1d4ed8',
  '#3b82f6',
  '#60a5fa',
  '#fb923c',
  '#f97316',
  '#ea580c',
];


/* =========================================================
   DATA GRAFIK TREND

   Nilai mengikuti contoh pada desain/gambar yang diberikan.
   Satuan nominal = Rp juta.
========================================================= */




/* =========================================================
   COMPONENT
========================================================= */


/* =========================================================
   KPI CARD DASHBOARD PIUTANG - 2 BARIS
========================================================= */

const PiutangGaugeCard = ({
  title,
  value,
  delta,
  achievement,
  target = 100,
  color = '#3b82f6',
  targetLabel,
  icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  valueColor = 'text-slate-800',
}) => {
  const numericAchievement = Number(achievement) || 0;
  const gaugePercent = Math.min(100, Math.max(0, numericAchievement));
  const gaugeAngle = gaugePercent * 1.8;
  const targetValue = Number(target) || 0;
  const isAboveTarget = targetValue > 0 && numericAchievement >= targetValue;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className="absolute left-0 right-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
      />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-60" style={{ background: `${color}10` }} />

      <div className="relative flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} shadow-sm`}>
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-700">
              {title}
            </div>
            <div className="mt-0.5 text-[9px] font-medium text-slate-400">
              {targetLabel || `% Ach ${title}`}
            </div>
          </div>
        </div>

        <div className={`rounded-full px-2 py-1 text-[9px] font-bold ${isAboveTarget ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          {isAboveTarget ? 'On Target' : `Target ${target}%`}
        </div>
      </div>

      <div className="relative px-4 pt-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className={`text-[25px] font-extrabold leading-none tracking-tight ${valueColor}`}>
              {value}
            </div>
            {delta && (
              <div className="mt-2 text-[9px] font-semibold text-slate-500">
                {delta}
              </div>
            )}
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-right">
            <div className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">Achievement</div>
            <div className="text-sm font-extrabold" style={{ color }}>
              {numericAchievement.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="mt-2 text-center text-[9px] font-semibold text-slate-400">
          {targetLabel || `% Ach ${title}`}
        </div>

        <div className="relative mt-1 flex justify-center">
          <div className="relative h-[82px] w-[164px] overflow-hidden">
            <div
              className="absolute left-0 top-0 h-[164px] w-[164px] rounded-full"
              style={{
                background: `conic-gradient(from 270deg, ${color} 0deg, ${color} ${gaugeAngle}deg, #e8edf3 ${gaugeAngle}deg, #e8edf3 180deg, transparent 180deg)`,
              }}
            />
            <div className="absolute left-[19px] top-[19px] h-[126px] w-[126px] rounded-full bg-white" />

            <div
              className="absolute bottom-0 left-1/2 h-[59px] w-[3px] origin-bottom rounded-full bg-slate-700 shadow-sm"
              style={{
                transform: `translateX(-50%) rotate(${Math.max(-90, Math.min(90, gaugeAngle - 90))}deg)`,
              }}
            />
            <div className="absolute bottom-[-4px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-slate-700 shadow-md" />

            <div className="absolute bottom-0 left-1 text-[8px] font-bold text-slate-400">0%</div>
            <div className="absolute bottom-0 right-1 text-[8px] font-bold text-slate-400">100%</div>
          </div>
        </div>

      </div>
    </div>
  );
};

const PiutangKpiSimpleCard = ({
  title,
  value,
  delta,
  footer,
  icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  valueColor = 'text-slate-800',
  accentColor = '#3b82f6',
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pt-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="absolute left-0 right-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
      />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            {title}
          </p>

          <div className={`mt-2 text-2xl font-extrabold tracking-tight ${valueColor}`}>
            {value}
          </div>

          {delta && (
            <div className="mt-3 text-[10px] font-semibold text-slate-500">
              {delta}
            </div>
          )}

          {footer && (
            <div className="mt-1 text-[9px] text-slate-400">
              {footer}
            </div>
          )}
        </div>

        {icon && (
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover:scale-105`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};


const unwrapDashboardResponse = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  const data = response?.data;
  if (Array.isArray(data?.list_data)) return data.list_data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(response?.list_data)) return response.list_data;
  return [];
};

const normalizePiutangDashboardItem = (item, index) => ({
  ...item,
  id: item?.id ?? item?.billing_no ?? item?.billingNo ?? item?.no_invoice ?? index,
  tanggal: item?.tanggal ?? item?.document_date ?? item?.posting_date ?? item?.tanggal_dokumen ?? '',
  jatuhTempo: item?.jatuhTempo ?? item?.jatuh_tempo_calc ?? item?.jatuh_tempo ?? item?.due_date ?? '',
  statusJTO: item?.status_jto ?? item?.status_piutang_calc ?? item?.status_piutang ?? '',
  cabang: item?.nama_cabang ?? item?.name_cabang ?? item?.desc_s_office ?? item?.ur_ref ?? item?.cabang ?? item?.sales_office ?? item?.kode_cabang ?? item?.cabang_id ?? '',
  principal: item?.nama_principle ?? item?.name_principle ?? item?.principal_name ?? item?.principal ?? item?.principle ?? item?.principal_id ?? '',
  channel: item?.channel ?? item?.customer_group ?? item?.desc_cust_grp4 ?? '',
  customer: item?.customer ?? item?.name_bill_to ?? item?.nama_customer ?? item?.name ?? '',
  produk: item?.produk ?? item?.namaProduk ?? item?.text_material ?? item?.nama_produk ?? item?.material_desc ?? '',
  sales: Number(item?.sales ?? item?.total_penjualan ?? item?.totalPenjualan ?? 0),
  // Field sumber dari getDetailPiutangDashboard.
  totalPiutang: Number(item?.total_piutang ?? item?.totalPiutang ?? item?.piutang ?? 0),
  totalCollections: Number(item?.total_collections ?? item?.total_collection ?? item?.totalCollections ?? item?.totalCollection ?? item?.collection ?? item?.pembayaran ?? 0),
  piutang: Number(item?.total_piutang ?? item?.totalPiutang ?? item?.piutang ?? item?.outstanding ?? 0),
  collection: Number(item?.total_collections ?? item?.total_collection ?? item?.totalCollections ?? item?.totalCollection ?? item?.collection ?? item?.pembayaran ?? 0),
  // Saldo outstanding dihitung konsisten: total_piutang - total_collections.
  outstanding: Number(item?.total_piutang ?? item?.totalPiutang ?? item?.piutang ?? 0) - Number(item?.total_collections ?? item?.total_collection ?? item?.totalCollections ?? item?.totalCollection ?? item?.collection ?? item?.pembayaran ?? 0),
  invoice: Number(item?.invoice ?? item?.jumlah_invoice ?? item?.jumlahInvoice ?? 1),
  aging: Number(item?.aging ?? item?.aging_hari ?? item?.umur_piutang ?? 0),
});

const getDashboardPayload = (filter) => ({
  cabang: filter.cabang || [],
  principal: filter.principal || [],
  principal_id: filter.principal || [],
  channel: filter.channel || [],
  customer: filter.customer || [],
  produk: filter.produk || [],
  // Periode default selalu ikut dikirim ke API sejak dashboard pertama kali dimuat.
  // Nilai tetap mengikuti pilihan tanggal pengguna jika tanggal diubah.
  tanggal_mulai: filter.tanggalMulai || getOneMonthAgoDateString(),
  tanggal_akhir: filter.tanggalAkhir || getTodayDateString(),
});

// Payload khusus Detail Piutang: pastikan kedua parameter periode selalu ikut
// dikirim, baik untuk tabel berpaginasi maupun data chart.
const getDetailPiutangPayload = (filter) => ({
  ...getDashboardPayload(filter),
  tanggal_mulai: filter?.tanggalMulai || getOneMonthAgoDateString(),
  tanggal_akhir: filter?.tanggalAkhir || getTodayDateString(),
});


const DashboardFilterOption = (props) => (
  <selectComponents.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      readOnly
      className="checkbox checkbox-primary checkbox-xs mr-2"
    />
    {props.label}
  </selectComponents.Option>
);

const DashboardFilterMultiValue = () => null;

const DashboardFilterValueContainer = ({ children, ...props }) => {
  const count = props.getValue().length;
  return (
    <selectComponents.ValueContainer {...props}>
      {count > 0 ? `${count} dipilih` : children[0]}
      {children[1]}
    </selectComponents.ValueContainer>
  );
};

const dashboardFilterSelectComponents = {
  Option: DashboardFilterOption,
  MultiValue: DashboardFilterMultiValue,
  ValueContainer: DashboardFilterValueContainer,
};

const dashboardFilterSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 12,
    borderColor: state.isFocused ? "#60a5fa" : "#e5e7eb",
    boxShadow: "none",
    fontSize: "0.875rem",
    ":hover": { borderColor: "#60a5fa" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 40 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};

const mapRefOptions = (items = [], labelKeys = [], valueKeys = []) =>
  items.map((item) => ({
    label: labelKeys.map((key) => item?.[key]).find((value) => value !== undefined && value !== null && value !== "") ?? "",
    value: valueKeys.map((key) => item?.[key]).find((value) => value !== undefined && value !== null && value !== "") ?? "",
  })).filter((item) => item.label !== "" && item.value !== "");

const Dashboard = () => {

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const defaultFilter = {
    cabang: [],
    principal: [],
    channel: [],
    customer: [],
    produk: [],
    tanggalMulai: getOneMonthAgoDateString(),
    tanggalAkhir: getTodayDateString(),
  };


  const [filter, setFilter] =
    useState(defaultFilter);


  const [appliedFilter, setAppliedFilter] =
    useState(defaultFilter);

  // State tiap API dipisah agar mudah ditelusuri saat debugging.
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [summaryApiData, setSummaryApiData] = useState(null);
  const [trendApiData, setTrendApiData] = useState(null);
  const [salesOpenInvoiceApiData, setSalesOpenInvoiceApiData] = useState(null);
  const [analisisApiData, setAnalisisApiData] = useState(null);
  const [collectionByCustomerApiData, setCollectionByCustomerApiData] = useState(null);
  const [performaProdukApiData, setPerformaProdukApiData] = useState(null);
  const [detailPage, setDetailPage] = useState(1);
  const [detailPageSize, setDetailPageSize] = useState(10);
  const [detailRows, setDetailRows] = useState([]);
  const [detailChartRows, setDetailChartRows] = useState([]);
  const [detailTotal, setDetailTotal] = useState(0);
  const [detailTotalPages, setDetailTotalPages] = useState(0);
  const [detailSummary, setDetailSummary] = useState({ aging: agingLabels.map(() => 0), total_outstanding: 0 });
  const [detailLoading, setDetailLoading] = useState(false);
  const [saldoJatuhTempoApiData, setSaldoJatuhTempoApiData] = useState([
    { name: 'Belum JTO', value: 0 },
    { name: 'Segera JTO', value: 0 },
    { name: 'Sudah JTO', value: 0 },
  ]);
  const [agingPiutangApiData, setAgingPiutangApiData] = useState(
    agingLabels.map((label) => ({ label, value: 0, percentage: 0 }))
  );

  const [apiCustomerOptions, setApiCustomerOptions] = useState([]);
  const [apiProductOptions, setApiProductOptions] = useState([]);
  const [apiCabangOptions, setApiCabangOptions] = useState([]);
  const [apiPrincipalOptions, setApiPrincipalOptions] = useState([]);
  const [apiChannelOptions, setApiChannelOptions] = useState([]);

  // Referensi filter. Customer dimuat setelah cabang dipilih; produk setelah principal dipilih.
  useEffect(() => {
    let active = true;
    const loadReferences = async () => {
      try {
        const [refCabang, refChannel, refPrincipal] = await Promise.all([
          storeSchema.actions.getReferensiByJenis('cabang_id'),
          storeSchema.actions.getReferensiByJenis('channel_id'),
          storeSchema.actions.getListPrinciple({ page: 1, limit: 9999, sortBy: 'ASC' }),
        ]);
        if (!active) return;
        if (refCabang?.status === true) setApiCabangOptions(
          mapRefOptions(refCabang.data || [], ['ur_ref', 'kd_ref'], ['kd_ref', 'cabang_id'])
        );
        if (refChannel?.status === true) setApiChannelOptions(
          mapRefOptions(refChannel.data || [], ['ur_ref', 'kd_ref'], ['kd_ref', 'channel_id'])
        );
        if (refPrincipal?.status === true) setApiPrincipalOptions(
          mapRefOptions(refPrincipal?.data?.list_data || [], ['nama_principle', 'principle'], ['principle', 'principal_id', 'principle_id'])
        );
      } catch (error) {
        console.error('ERROR GET REFERENSI DASHBOARD PIUTANG:', error);
      }
    };
    loadReferences();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadCustomers = async () => {
      if (!filter.cabang.length) {
        setApiCustomerOptions([]);
        setFilter((prev) => prev.customer.length ? ({ ...prev, customer: [] }) : prev);
        return;
      }
      try {
        const res = await storeSchema.actions.getDataPelanggan({ page: 1, limit: 9999, cabang_id: filter.cabang });
        if (res?.status !== true) throw new Error(res?.message || 'Gagal mengambil data customer');
        const rows = unwrapDashboardResponse(res);
        const options = rows.map((x) => ({
          label: `${x?.kode_customer ?? ''}${x?.kode_customer && x?.name ? ' - ' : ''}${x?.name ?? ''}` || String(x?.kode_customer ?? ''),
          value: x?.kode_customer ?? x?.customer_id,
        })).filter((x) => x.value !== undefined && x.value !== null && String(x.value) !== '');
        if (active) setApiCustomerOptions(options);
      } catch (error) {
        console.error('ERROR GET CUSTOMER FILTER DASHBOARD:', error);
        if (active) setApiCustomerOptions([]);
      }
    };
    loadCustomers();
    return () => { active = false; };
  }, [filter.cabang]);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      if (!filter.principal.length) {
        setApiProductOptions([]);
        setFilter((prev) => prev.produk.length ? ({ ...prev, produk: [] }) : prev);
        return;
      }
      try {
        const payload = { ...getDashboardPayload(filter), principal: filter.principal, principal_id: filter.principal };
        const res = await storeSchema.actions.getPerformaPiutangProdukDashboard(payload);
        if (res?.status !== true) throw new Error(res?.message || 'Gagal mengambil data produk');
        const rows = unwrapDashboardResponse(res);
        const options = rows.map((x) => ({
          label: x?.produk ?? x?.nama_produk ?? x?.namaProduk ?? x?.text_material ?? x?.material_desc ?? '',
          value: x?.produk_id ?? x?.material_id ?? x?.material ?? x?.produk ?? x?.nama_produk ?? x?.text_material ?? '',
        })).filter((x) => x.label && x.value !== '');
        if (active) setApiProductOptions(
          options.filter((item, index, all) => all.findIndex((other) => String(other.value) === String(item.value)) === index)
        );
      } catch (error) {
        console.error('ERROR GET PRODUK FILTER DASHBOARD:', error);
        if (active) setApiProductOptions([]);
      }
    };
    loadProducts();
    return () => { active = false; };
  }, [filter.principal]);

  // Setiap API dipanggil dan disimpan secara terpisah.
  // Error di satu API tidak menghalangi API lain untuk mengisi state-nya.
  useEffect(() => {
    let active = true;
    const payload = getDashboardPayload(appliedFilter);

    const loadSummary = async () => {
      try {
        const response = await storeSchema.actions.getSummaryPiutangDashboard(payload);
        if (response?.status === false) throw new Error(response?.message || 'Gagal mengambil Summary Piutang');
        if (active) setSummaryApiData(response);
      } catch (error) {
        console.error('ERROR API getSummaryPiutangDashboard:', error);
        if (active) setSummaryApiData(null);
      }
    };

    const loadTrend = async () => {
      try {
        const response = await storeSchema.actions.getTrendSaldoPiutangDashboard(payload);
        if (response?.status === false) throw new Error(response?.message || 'Gagal mengambil Trend Saldo Piutang');
        if (active) setTrendApiData(response);
      } catch (error) {
        console.error('ERROR API getTrendSaldoPiutangDashboard:', error);
        if (active) setTrendApiData(null);
      }
    };

    const loadSalesOpenInvoice = async () => {
      try {
        const response = await storeSchema.actions.getSalesOpenInvoiceDashboard(payload);
        if (response?.status === false) throw new Error(response?.message || 'Gagal mengambil Sales & Open Invoice');
        if (active) setSalesOpenInvoiceApiData(response);
      } catch (error) {
        console.error('ERROR API getSalesOpenInvoiceDashboard:', error);
        if (active) setSalesOpenInvoiceApiData(null);
      }
    };

    const loadAnalisis = async () => {
      try {
        const response = await storeSchema.actions.getAnalisisPiutangDashboard(payload);
        if (response?.status === false) throw new Error(response?.message || 'Gagal mengambil Analisis Piutang');
        if (active) setAnalisisApiData(response);
      } catch (error) {
        console.error('ERROR API getAnalisisPiutangDashboard:', error);
        if (active) setAnalisisApiData(null);
      }
    };

    const loadCollectionByCustomer = async () => {
      try {
        const response = await storeSchema.actions.getCollectionByCustomerDashboard(payload);
        if (response?.status === false) throw new Error(response?.message || 'Gagal mengambil Collection per Customer');
        if (active) setCollectionByCustomerApiData(response);
      } catch (error) {
        console.error('ERROR API getCollectionByCustomerDashboard:', error);
        if (active) setCollectionByCustomerApiData(null);
      }
    };

    const loadPerformaProduk = async () => {
      try {
        const response = await storeSchema.actions.getPerformaPiutangProdukDashboard(payload);
        if (response?.status === false) throw new Error(response?.message || 'Gagal mengambil Performa Piutang Produk');
        if (active) setPerformaProdukApiData(response);
      } catch (error) {
        console.error('ERROR API getPerformaPiutangProdukDashboard:', error);
        if (active) setPerformaProdukApiData(null);
      }
    };

    setDashboardLoading(true);
    Promise.all([
      loadSummary(),
      loadTrend(),
      loadSalesOpenInvoice(),
      loadAnalisis(),
      loadCollectionByCustomer(),
      loadPerformaProduk(),
    ]).finally(() => {
      if (active) setDashboardLoading(false);
    });

    return () => { active = false; };
  }, [appliedFilter]);

  // Data chart Saldo Piutang by Aging dan Channel diambil dari endpoint
  // getDetailPiutangDashboard yang sama, tanpa membuat API baru.
  // Ambil seluruh baris untuk agregasi chart agar tidak hanya menghitung halaman tabel aktif.
  useEffect(() => {
    let active = true;

    const loadDetailPiutangForCharts = async () => {
      const action = storeSchema.actions.getDetailPiutangDashboard;

      if (typeof action !== 'function') {
        setDetailChartRows([]);
        return;
      }

      try {
        const response = await action({
          ...getDetailPiutangPayload(appliedFilter),
          page: 1,
          limit: 1000000,
        });

        if (response?.status === false) {
          throw new Error(response?.message || 'Gagal mengambil Detail Piutang untuk chart');
        }

        const body = response?.data?.data ?? response?.data ?? response;
        const rows = Array.isArray(body?.list_data)
          ? body.list_data
          : Array.isArray(body?.data)
            ? body.data
            : Array.isArray(body?.rows)
              ? body.rows
              : Array.isArray(body)
                ? body
                : [];

        if (active) {
          setDetailChartRows(rows.map((item, index) => ({
            ...normalizePiutangDashboardItem(item, index),
            id: item?.id ?? item?.penjualan_id ?? `${item?.billing_no ?? 'row'}-${index}`,
            billingNo: item?.billing_no ?? item?.billingNo ?? '',
            tanggal: item?.tanggal ?? item?.document_date ?? item?.posting_date ?? item?.tanggal_dokumen ?? '',
            channel: item?.channel ?? item?.customer_group ?? item?.desc_cust_grp4 ?? item?.desc_customer_group ?? 'Tidak diketahui',
            // Simpan ID dan nama produk/customer dari field API yang sesuai.
            produkId: item?.produk_id ?? item?.product_id ?? item?.material_id ?? item?.material ?? '',
            produk: item?.nama_produk ?? item?.produk ?? item?.namaProduk ?? item?.text_material ?? item?.material_desc ?? item?.material ?? 'Tidak diketahui',
            principal: item?.nama_principle ?? item?.name_principle ?? item?.principal_name ?? item?.principal ?? item?.principle ?? item?.principal_id ?? 'Tidak diketahui',
            customerId: item?.customer_id ?? item?.kode_customer ?? item?.bill_to ?? '',
            customer: item?.name_bill_to ?? item?.customer ?? item?.nama_customer ?? item?.customer_name ?? item?.name ?? 'Tidak diketahui',
            cabang: item?.nama_cabang ?? item?.name_cabang ?? item?.desc_s_office ?? item?.ur_ref ?? item?.cabang ?? item?.sales_office ?? item?.kode_cabang ?? item?.cabang_id ?? 'Tidak diketahui',
            totalPiutang: Number(item?.total_piutang ?? item?.totalPiutang ?? item?.piutang ?? 0),
            totalCollections: Number(item?.total_collections ?? item?.total_collection ?? item?.totalCollections ?? item?.totalCollection ?? item?.collection ?? item?.pembayaran ?? 0),
            piutang: Number(item?.total_piutang ?? item?.totalPiutang ?? item?.piutang ?? 0),
            collection: Number(item?.total_collections ?? item?.total_collection ?? item?.totalCollections ?? item?.totalCollection ?? item?.collection ?? item?.pembayaran ?? 0),
            outstanding: Number(item?.total_piutang ?? item?.totalPiutang ?? item?.piutang ?? 0) - Number(item?.total_collections ?? item?.total_collection ?? item?.totalCollections ?? item?.totalCollection ?? item?.collection ?? item?.pembayaran ?? 0),
            statusJTO: item?.status_jto ?? item?.statusJTO ?? '',
            aging: Number(item?.aging_hari ?? item?.aging ?? 0),
          })));
        }
      } catch (error) {
        console.error('ERROR GET DETAIL PIUTANG UNTUK CHART:', error);
        if (active) setDetailChartRows([]);
      }
    };

    loadDetailPiutangForCharts();
    return () => { active = false; };
  }, [appliedFilter]);

  // Saldo Akhir by Jatuh Tempo menggunakan API tersendiri.
  useEffect(() => {
    let active = true;

    const loadSaldoJatuhTempo = async () => {
      const action = storeSchema.actions.getSaldoAkhirJatuhTempoDashboard;

      if (typeof action !== 'function') {
        console.warn('Action getSaldoAkhirJatuhTempoDashboard belum tersedia.');
        setSaldoJatuhTempoApiData([
          { name: 'Belum JTO', value: 0 },
          { name: 'Segera JTO', value: 0 },
          { name: 'Sudah JTO', value: 0 },
        ]);
        return;
      }

      try {
        const response = await action(getDashboardPayload(appliedFilter));
        if (response?.status === false) {
          throw new Error(response?.message || 'Gagal mengambil Saldo Akhir by Jatuh Tempo');
        }

        const body = response?.data?.data ?? response?.data ?? response;
        let rows = Array.isArray(body)
          ? body
          : Array.isArray(body?.list_data)
            ? body.list_data
            : Array.isArray(body?.data)
              ? body.data
              : Array.isArray(body?.rows)
                ? body.rows
                : Array.isArray(body?.items)
                  ? body.items
                  : null;

        const result = [
          { name: 'Belum JTO', value: 0 },
          { name: 'Segera JTO', value: 0 },
          { name: 'Sudah JTO', value: 0 },
        ];

        const normalizeCategory = (value) => String(value ?? '').trim().toUpperCase();
        const getAmount = (item) => Number(
          item?.value ?? item?.saldo ?? item?.total_outstanding ??
          item?.total_saldo ?? item?.outstanding ?? item?.jumlah ?? 0
        ) || 0;

        if (rows) {
          rows.forEach((item) => {
            const category = normalizeCategory(
              item?.name ?? item?.kategori ?? item?.status_jto ??
              item?.statusJTO ?? item?.status_piutang
            );
            const amount = getAmount(item);

            if (category.includes('BELUM') || category.includes('NOT DUE')) {
              result[0].value += amount;
            } else if (category.includes('SEGERA') || category.includes('DUE_SOON') || category.includes('DUE SOON')) {
              result[1].value += amount;
            } else if (category.includes('SUDAH') || category.includes('OVERDUE') || category.includes('SDH JTO')) {
              result[2].value += amount;
            }
          });
        } else if (body && typeof body === 'object') {
          // Mendukung respons agregat berbentuk object.
          result[0].value = Number(body.belum_jto ?? body.belumJTO ?? body.saldo_belum_jto ?? 0) || 0;
          result[1].value = Number(body.segera_jto ?? body.segeraJTO ?? body.saldo_segera_jto ?? 0) || 0;
          result[2].value = Number(body.sudah_jto ?? body.sudahJTO ?? body.saldo_sudah_jto ?? body.overdue ?? 0) || 0;
        }

        if (active) setSaldoJatuhTempoApiData(result);
      } catch (error) {
        console.error('ERROR API getSaldoAkhirJatuhTempoDashboard:', error);
        if (active) {
          setSaldoJatuhTempoApiData([
            { name: 'Belum JTO', value: 0 },
            { name: 'Segera JTO', value: 0 },
            { name: 'Sudah JTO', value: 0 },
          ]);
        }
      }
    };

    loadSaldoJatuhTempo();
    return () => { active = false; };
  }, [appliedFilter]);

  // Aging Piutang menggunakan API tersendiri, terpisah dari Detail Piutang.
  useEffect(() => {
    let active = true;

    const loadAgingPiutang = async () => {
      const action = storeSchema.actions.getAgingPiutangDashboard;

      if (typeof action !== 'function') {
        console.warn('Action getAgingPiutangDashboard belum tersedia.');
        setAgingPiutangApiData(
          agingLabels.map((label) => ({ label, value: 0, percentage: 0 }))
        );
        return;
      }

      try {
        const response = await action(getDashboardPayload(appliedFilter));

        if (response?.status === false) {
          throw new Error(response?.message || 'Gagal mengambil Aging Piutang');
        }

        const body = response?.data?.data ?? response?.data ?? response;
        const rows = Array.isArray(body)
          ? body
          : Array.isArray(body?.list_data)
            ? body.list_data
            : Array.isArray(body?.data)
              ? body.data
              : Array.isArray(body?.rows)
                ? body.rows
                : Array.isArray(body?.items)
                  ? body.items
                  : [];

        const normalizedRows = agingLabels.map((label) => {
          const row = rows.find((item) => {
            const category = String(
              item?.label ?? item?.name ?? item?.aging ?? item?.kategori ?? item?.kelompok_aging ?? ''
            ).trim().toUpperCase().replace(/\s+/g, ' ');
            return category === label.toUpperCase().replace(/\s+/g, ' ');
          });

          return {
            label,
            value: Number(
              row?.value ?? row?.nominal ?? row?.saldo ?? row?.outstanding ?? row?.total_outstanding ?? 0
            ) || 0,
          };
        });

        const total = normalizedRows.reduce((sum, item) => sum + item.value, 0);
        const result = normalizedRows.map((item) => ({
          ...item,
          percentage: total > 0 ? (item.value / total) * 100 : 0,
        }));

        if (active) setAgingPiutangApiData(result);
      } catch (error) {
        console.error('ERROR API getAgingPiutangDashboard:', error);
        if (active) {
          setAgingPiutangApiData(
            agingLabels.map((label) => ({ label, value: 0, percentage: 0 }))
          );
        }
      }
    };

    loadAgingPiutang();
    return () => { active = false; };
  }, [appliedFilter]);


  // Detail Piutang diambil terpisah agar paging dilakukan di backend.
  useEffect(() => {
    let active = true;

    const loadDetailPiutang = async () => {
      const action = storeSchema.actions.getDetailPiutangDashboard;
      if (typeof action !== 'function') {
        console.warn('Action getDetailPiutangDashboard belum tersedia.');
        setDetailRows([]);
        setDetailTotal(0);
        setDetailTotalPages(0);
        setDetailSummary({ aging: agingLabels.map(() => 0), total_outstanding: 0 });
        return;
      }

      setDetailLoading(true);
      try {
        const response = await action({
          ...getDetailPiutangPayload(appliedFilter),
          page: detailPage,
          limit: detailPageSize,
        });

        if (response?.status === false) {
          throw new Error(response?.message || 'Gagal mengambil Detail Piutang');
        }

        const body = response?.data?.data ?? response?.data ?? response;
        const rows = Array.isArray(body?.list_data)
          ? body.list_data
          : Array.isArray(body?.data)
            ? body.data
            : Array.isArray(body?.rows)
              ? body.rows
              : Array.isArray(body)
                ? body
                : [];

        const total = Number(body?.total_data ?? body?.total ?? rows.length);
        const totalPages = Number(body?.total_halaman ?? Math.ceil(total / detailPageSize));

        if (!active) return;
        setDetailRows(rows.map((item, index) => ({
          ...normalizePiutangDashboardItem(item, index),
          id: item?.id ?? item?.penjualan_id ?? `${item?.billing_no ?? 'row'}-${index}`,
          billingNo: item?.billing_no ?? item?.billingNo ?? '',
          descSalesOffice: item?.nama_cabang ?? item?.ur_ref ?? item?.desc_s_office ?? item?.sales_office ?? '',
          principal: item?.nama_principle ?? item?.principal_name ?? item?.principle ?? '',
          namaProduk: item?.nama_produk ?? item?.text_material ?? item?.namaProduk ?? '',
          customer: item?.customer ?? item?.name_bill_to ?? item?.customer_name ?? '',
          channel: item?.channel ?? item?.desc_cust_grp4 ?? '',
          totalPenjualan: Number(item?.total_penjualan ?? item?.totalPenjualan ?? 0),
          totalCogs: Number(item?.total_cogs ?? item?.totalCogs ?? 0),
          outstanding: Number(item?.outstanding ?? 0),
          aging: Array.isArray(item?.aging)
            ? item.aging
            : agingLabels.map((_, i) => Number(item?.[`aging_${i}`] ?? 0)),
          collections_per_metode:
            item?.collections_per_metode ??
            item?.collectionsPerMetode ??
            item?.collections_by_metode ??
            item?.collectionsByMetode ??
            [],
        })));
        setDetailTotal(total);
        setDetailTotalPages(totalPages);

        const summaryFromApi = body?.summary && typeof body.summary === 'object'
          ? body.summary
          : {};
        const summaryAging = Array.isArray(summaryFromApi.aging)
          ? agingLabels.map((_, i) => Number(summaryFromApi.aging[i] ?? 0))
          : agingLabels.map((_, i) => Number(
            summaryFromApi[`aging_${i}`] ??
            summaryFromApi[`total_aging_${i}`] ??
            summaryFromApi[`aging${i}`] ??
            0
          ));
        const summaryOutstanding = Number(
          summaryFromApi.total_outstanding ??
          summaryFromApi.totalOutstanding ??
          summaryFromApi.total ??
          summaryAging.reduce((sum, value) => sum + value, 0)
        );

        setDetailSummary({
          ...summaryFromApi,
          aging: summaryAging,
          total_outstanding: summaryOutstanding,
        });
      } catch (error) {
        console.error('ERROR GET DETAIL PIUTANG DASHBOARD:', error);
        if (active) {
          setDetailRows([]);
          setDetailTotal(0);
          setDetailTotalPages(0);
          setDetailSummary({ aging: agingLabels.map(() => 0), total_outstanding: 0 });
        }
      } finally {
        if (active) setDetailLoading(false);
      }
    };

    loadDetailPiutang();
    return () => { active = false; };
  }, [appliedFilter, detailPage, detailPageSize]);

  // Kembali ke halaman pertama ketika filter diterapkan.
  useEffect(() => {
    setDetailPage(1);
  }, [appliedFilter, detailPageSize]);

  const [activeTable, setActiveTable] =
    useState('principal');


  /* =======================================================
     PERFORMANCE CHART DIMENSION
  ======================================================= */

  const [
    performanceDimension,
    setPerformanceDimension
  ] = useState('produk');


  /* =======================================================
     COLLECTION CHART DIMENSION
  ======================================================= */

  const [
    collectionDimension,
    setCollectionDimension
  ] = useState('customer');


  /* =======================================================
     FILTER OPTIONS DARI API
  ======================================================= */

  const customerOptions = useMemo(() => apiCustomerOptions, [apiCustomerOptions]);
  const productOptions = useMemo(() => apiProductOptions, [apiProductOptions]);

  // Tampilkan label pilihan filter, bukan value/ID yang dikirim ke API.
  const getSelectedFilterLabels = (options = [], values = []) => {
    const selectedValues = Array.isArray(values) ? values : [];
    return options
      .filter((option) => selectedValues.some((value) => String(value) === String(option.value)))
      .map((option) => option.label)
      .filter(Boolean)
      .join(', ');
  };

  /* =======================================================
     HANDLE FILTER
  ======================================================= */

  const handleFilterChange = (name, selectedOptions) => {
    const values = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : [];

    setFilter((prev) => {
      const next = { ...prev, [name]: values };
      if (name === 'cabang') next.customer = [];
      if (name === 'principal') next.produk = [];
      return next;
    });
  };


  /* =======================================================
     APPLY FILTER
  ======================================================= */

  const applyFilter = () => {

    setAppliedFilter({
      ...filter,
    });

  };


  /* =======================================================
     RESET FILTER
  ======================================================= */

  const resetFilter = () => {

    const newDefaultFilter = {
      cabang: [],
      principal: [],
      channel: [],
      customer: [],
      produk: [],
      tanggalMulai: getOneMonthAgoDateString(),
      tanggalAkhir: getTodayDateString(),
    };


    setFilter(newDefaultFilter);

    setAppliedFilter(
      newDefaultFilter
    );

  };


  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const filteredData = useMemo(
    () => detailRows || [],
    [detailRows]
  );


  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    const salesResponseData =
      salesOpenInvoiceApiData?.data?.data ??
      salesOpenInvoiceApiData?.data ??
      salesOpenInvoiceApiData?.list_data ??
      salesOpenInvoiceApiData;

    const salesSummary = Array.isArray(salesResponseData)
      ? salesResponseData[0]
      : salesResponseData?.summary ?? salesResponseData;

    if (
      salesSummary &&
      typeof salesSummary === 'object' &&
      !Array.isArray(salesSummary) &&
      (
        salesSummary.total_penjualan !== undefined ||
        salesSummary.total_piutang !== undefined ||
        salesSummary.total_collection !== undefined ||
        salesSummary.saldo_piutang !== undefined ||
        salesSummary.jumlah_invoice !== undefined ||
        salesSummary.invoice_outstanding !== undefined
      )
    ) {
      return {
        totalPenjualan: Number(salesSummary.total_penjualan ?? salesSummary.totalPenjualan ?? 0),
        totalPiutang: Number(salesSummary.total_piutang ?? salesSummary.totalPiutang ?? 0),
        totalCollection: Number(salesSummary.total_collection ?? salesSummary.totalCollection ?? 0),
        saldoPiutang: Number(salesSummary.saldo_piutang ?? salesSummary.saldoPiutang ?? salesSummary.total_outstanding ?? 0),
        jumlahInvoice: Number(salesSummary.jumlah_invoice ?? salesSummary.jumlahInvoice ?? 0),
        invoiceOutstanding: Number(salesSummary.invoice_outstanding ?? salesSummary.invoiceOutstanding ?? 0),
      };
    }

    // Fallback jika API Sales & Open Invoice belum memberikan summary.
    const fallbackResponseData =
      summaryApiData?.data?.summary ??
      summaryApiData?.data ??
      summaryApiData?.summary ??
      summaryApiData;

    const fallbackSummary = Array.isArray(fallbackResponseData)
      ? fallbackResponseData[0]
      : fallbackResponseData;

    if (fallbackSummary && typeof fallbackSummary === 'object' && !Array.isArray(fallbackSummary)) {
      return {
        totalPenjualan: Number(fallbackSummary.totalPenjualan ?? fallbackSummary.total_penjualan ?? 0),
        totalPiutang: Number(fallbackSummary.totalPiutang ?? fallbackSummary.total_piutang ?? 0),
        totalCollection: Number(fallbackSummary.totalCollection ?? fallbackSummary.total_collection ?? 0),
        saldoPiutang: Number(fallbackSummary.saldoPiutang ?? fallbackSummary.saldo_piutang ?? fallbackSummary.total_outstanding ?? 0),
        jumlahInvoice: Number(fallbackSummary.jumlahInvoice ?? fallbackSummary.jumlah_invoice ?? 0),
        invoiceOutstanding: Number(fallbackSummary.invoiceOutstanding ?? fallbackSummary.invoice_outstanding ?? 0),
      };
    }

    return filteredData.reduce(
      (acc, item) => {
        acc.totalPenjualan += Number(item.sales || 0);
        acc.totalPiutang += Number(item.piutang || 0);
        acc.totalCollection += Number(item.collection || 0);
        acc.saldoPiutang += Number(item.outstanding || 0);
        acc.jumlahInvoice += Number(item.invoice || 0);
        if (Number(item.outstanding || 0) > 0) {
          acc.invoiceOutstanding += Number(item.invoice || 0);
        }
        return acc;
      },
      {
        totalPenjualan: 0,
        totalPiutang: 0,
        totalCollection: 0,
        saldoPiutang: 0,
        jumlahInvoice: 0,
        invoiceOutstanding: 0,
      }
    );
  }, [salesOpenInvoiceApiData, summaryApiData, filteredData]);


  /* =========================================================
     GRAFIK SALDO PIUTANG BY AGING & CHANNEL
  ========================================================= */

  const channelNames = useMemo(() => {
    return Array.from(
      new Set(
        detailChartRows.map((item) =>
          String(item?.channel || 'Tidak diketahui').trim() || 'Tidak diketahui'
        )
      )
    ).sort((a, b) => a.localeCompare(b, 'id'));
  }, [detailChartRows]);

  const agingChannelData = useMemo(() => {
    const agingKeys = [
      '0 - 30 Hari',
      '31 - 45 Hari',
      '46 - 60 Hari',
      '61 - 90 Hari',
      '91 - 180 Hari',
      '181 - 360 Hari',
      '> 360 Hari',
    ];

    return agingKeys.map((agingLabel, agingIndex) => {
      const row = {
        aging: agingLabel
          .replace(' Hari', '')
          .replace('0 - 30', '0-30')
          .replace('31 - 45', '31-45')
          .replace('46 - 60', '46-60')
          .replace('61 - 90', '61-90')
          .replace('91 - 180', '91-180')
          .replace('181 - 360', '181-360'),
      };

      channelNames.forEach((channel) => {
        row[channel] = 0;
      });

      detailChartRows.forEach((item) => {
        const value = (Number(item?.[`aging_${agingIndex}`]) || 0) / 1000000;
        if (value <= 0) return;

        const channel =
          String(item?.channel || 'Tidak diketahui').trim() || 'Tidak diketahui';
        row[channel] = (row[channel] || 0) + value;
      });

      return row;
    });
  }, [detailChartRows, channelNames]);

  /* =========================================================
     RINGKASAN CHANNEL UNTUK TABEL
     Dibuat menyerupai tabel pada desain:
     Channel | Total | % | 2026 BLM JTO | SDH JTO |
     2025 BLM JTO | SDH JTO | < 2024 SDH JTO | % SDH JTO
  ========================================================= */

  const channelSummaryData = useMemo(() => {
    // Buat satu baris untuk setiap channel aktual dari getDetailPiutangDashboard.
    // Tidak lagi mengelompokkan channel menjadi RS Pemerintah, Instansi Pemerintah, dan Swasta.
    // Gunakan daftar channel yang SAMA dengan card "Saldo Piutang by Aging & Channel".
    // Dengan begitu nama dan urutan channel di tabel ini selalu sinkron dengan legend grafik aging.
    const groups = channelNames.map((channelName) => ({
      label: channelName,
      match: (item) =>
        (String(item?.channel || 'Tidak diketahui').trim() ||
          'Tidak diketahui') === channelName,
    }));

    const totalOutstanding = detailChartRows.reduce(
      (sum, item) => sum + Number(item.outstanding || 0),
      0
    );

    const getRow = (group) => {
      const items = detailChartRows.filter(group.match);

      const total = items.reduce(
        (sum, item) => sum + Number(item.outstanding || 0),
        0
      );

      const currentYear = 2026;

      const blmJto2026 = items
        .filter((item) => Number(item.aging || 0) <= 0)
        .reduce((sum, item) => sum + Number(item.outstanding || 0), 0);

      const sdhJto2026 = items
        .filter((item) => Number(item.aging || 0) > 0)
        .reduce((sum, item) => sum + Number(item.outstanding || 0), 0);

      const blmJto2025 = items
        .filter((item) => {
          const year = Number(
            String(item.tanggal || '').slice(0, 4)
          );
          return year === 2025 && Number(item.aging || 0) <= 0;
        })
        .reduce((sum, item) => sum + Number(item.outstanding || 0), 0);

      const sdhJto2025 = items
        .filter((item) => {
          const year = Number(
            String(item.tanggal || '').slice(0, 4)
          );
          return year === 2025 && Number(item.aging || 0) > 0;
        })
        .reduce((sum, item) => sum + Number(item.outstanding || 0), 0);

      const sdhJtoBefore2025 = items
        .filter((item) => {
          const year = Number(
            String(item.tanggal || '').slice(0, 4)
          );
          return year < currentYear - 1 && Number(item.aging || 0) > 0;
        })
        .reduce((sum, item) => sum + Number(item.outstanding || 0), 0);

      return {
        channel: group.label,
        total,
        percentage:
          totalOutstanding > 0
            ? (total / totalOutstanding) * 100
            : 0,
        blmJto2026,
        sdhJto2026,
        blmJto2025,
        sdhJto2025,
        sdhJtoBefore2025,
        percentageSdhJto:
          total > 0
            ? (sdhJto2026 / total) * 100
            : 0,
      };
    };

    const rows = groups.map(getRow);

    const totalRow = rows.reduce(
      (acc, row) => ({
        channel: 'TOTAL',
        total: acc.total + row.total,
        percentage: acc.percentage + row.percentage,
        blmJto2026: acc.blmJto2026 + row.blmJto2026,
        sdhJto2026: acc.sdhJto2026 + row.sdhJto2026,
        blmJto2025: acc.blmJto2025 + row.blmJto2025,
        sdhJto2025: acc.sdhJto2025 + row.sdhJto2025,
        sdhJtoBefore2025:
          acc.sdhJtoBefore2025 + row.sdhJtoBefore2025,
        percentageSdhJto:
          totalOutstanding > 0
            ? ((acc.sdhJto2026 + row.sdhJto2026) /
              totalOutstanding) *
            100
            : 0,
      }),
      {
        channel: 'TOTAL',
        total: 0,
        percentage: 0,
        blmJto2026: 0,
        sdhJto2026: 0,
        blmJto2025: 0,
        sdhJto2025: 0,
        sdhJtoBefore2025: 0,
        percentageSdhJto: 0,
      }
    );

    return [...rows, totalRow];
  }, [detailChartRows, channelNames]);



  const channelTableRows = useMemo(
    () => channelSummaryData.filter((row) => row.channel !== 'TOTAL'),
    [channelSummaryData]
  );


  const collectionRatio =
    summary.totalPiutang > 0
      ? (
        summary.totalCollection /
        summary.totalPiutang
      ) * 100
      : 0;


  const outstandingRatio =
    summary.totalPiutang > 0
      ? (
        summary.saldoPiutang /
        summary.totalPiutang
      ) * 100
      : 0;


  /* =======================================================
     SALDO AKHIR BY JATUH TEMPO
     Data berasal dari API khusus Saldo Akhir Jatuh Tempo.
  ======================================================= */

  const saldoJatuhTempoData = saldoJatuhTempoApiData;

  const totalSaldoJatuhTempo =
    useMemo(() => {

      return saldoJatuhTempoData.reduce(
        (sum, item) =>
          sum + item.value,
        0
      );

    }, [saldoJatuhTempoData]);


  /* =======================================================
     PERFORMANCE DIMENSION CONFIG
  ======================================================= */

  const performanceDimensionConfig = {

    produk: {
      label: 'Produk',
      field: 'produk',
      idField: 'produkId',
      icon: <FaBox size={13} />,
    },

    principal: {
      label: 'Principal',
      field: 'principal',
      icon: <FaBuilding size={13} />,
    },

    channel: {
      label: 'Channel',
      field: 'channel',
      icon: <FaHospital size={13} />,
    },

    customer: {
      label: 'Customer',
      field: 'customer',
      idField: 'customerId',
      icon: <FaUsers size={13} />,
    },

    cabang: {
      label: 'Cabang',
      field: 'cabang',
      icon: <FaBuilding size={13} />,
    },

  };


  const currentPerformanceConfig =
    performanceDimensionConfig[
    performanceDimension
    ];


  /* =======================================================
     PERFORMANCE CHART DATA
  ======================================================= */

  const performanceChartData =
    useMemo(() => {
      const grouped = {};
      const field = currentPerformanceConfig.field;
      const idField = currentPerformanceConfig.idField;

      // Agregasi menggunakan seluruh baris getDetailPiutangDashboard.
      // Produk dikelompokkan berdasarkan produk_id + nama_produk,
      // sedangkan customer berdasarkan customer_id + name_bill_to.
      detailChartRows.forEach((item) => {
        const label = String(item?.[field] ?? '').trim();
        if (!label || label === 'Tidak diketahui') return;

        const rawId = idField ? item?.[idField] : '';
        const groupKey = idField && rawId !== undefined && rawId !== null && String(rawId).trim() !== ''
          ? `${String(rawId).trim()}::${label}`
          : label;

        if (!grouped[groupKey]) {
          grouped[groupKey] = {
            name: label,
            piutang: 0,
            collection: 0,
            saldo: 0,
          };
        }

        // Nilai piutang berasal dari total_piutang per penjualan.
        grouped[groupKey].piutang += Number(
          item?.total_piutang ??
          item?.totalPiutang ??
          item?.piutang ??
          0
        ) || 0;

        grouped[groupKey].collection += Number(
          item?.total_collections ??
          item?.totalCollections ??
          item?.collection ??
          0
        ) || 0;

        grouped[groupKey].saldo += Number(item?.outstanding ?? 0) || 0;
      });

      return Object.values(grouped).sort((a, b) => b.piutang - a.piutang);
    }, [
      detailChartRows,
      currentPerformanceConfig.field,
      currentPerformanceConfig.idField,
    ]);


  /* =======================================================
     COLLECTION DIMENSION CONFIG
  ======================================================= */

  const collectionDimensionConfig = {

    principal: {
      label: 'Principal',
      field: 'principal',
      icon: <FaBuilding size={13} />,
    },

    channel: {
      label: 'Channel',
      field: 'channel',
      icon: <FaHospital size={13} />,
    },

    customer: {
      label: 'Customer',
      field: 'customer',
      icon: <FaUsers size={13} />,
    },

  };


  const currentCollectionConfig =
    collectionDimensionConfig[
    collectionDimension
    ];


  /* =======================================================
     COLLECTION CHART DATA
  ======================================================= */

  const collectionChartData =
    useMemo(() => {

      const grouped = {};

      const field =
        currentCollectionConfig.field;


      filteredData.forEach((item) => {

        const key =
          item[field];


        if (!key) {
          return;
        }


        if (!grouped[key]) {

          grouped[key] = {
            name: key,
            collection: 0,
          };

        }


        grouped[key].collection +=
          item.collection;

      });


      return Object.values(grouped);

    }, [
      filteredData,
      currentCollectionConfig.field,
    ]);


  /* =======================================================
   COLLECTIONS BY METODE PEMBAYARAN
======================================================= */

  const collectionByMetodeData = useMemo(() => {
    const grouped = {};

    const parseCollections = (value) => {
      if (!value) return [];

      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          console.warn(
            "Gagal membaca collections_per_metode:",
            error
          );
          return [];
        }
      }

      return [];
    };

    (detailRows || []).forEach((item) => {
      const collections = parseCollections(
        item?.collections_per_metode ??
        item?.collectionsPerMetode ??
        item?.collections_by_metode ??
        item?.collectionsByMetode
      );

      collections.forEach((payment) => {
        const metode = String(
          payment?.metode_pembayaran ??
          payment?.metodePembayaran ??
          payment?.metode ??
          payment?.payment_method ??
          payment?.method ??
          "LAINNYA"
        ).trim() || "LAINNYA";

        const nominal = Number(
          payment?.nominal_collection ??
          payment?.nominalCollection ??
          payment?.nominal_bayar ??
          payment?.nominal_pembayaran ??
          payment?.nominal ??
          payment?.amount ??
          0
        ) || 0;

        if (!grouped[metode]) {
          grouped[metode] = {
            name: metode,
            collection: 0,
          };
        }

        grouped[metode].collection += nominal;
      });
    });

    return Object.values(grouped).sort(
      (a, b) => b.collection - a.collection
    );
  }, [detailRows]);


  const topPiutangPrincipalData = useMemo(() => {
    const grouped = {};

    filteredData.forEach((item) => {
      if (!item.principal) {
        return;
      }

      grouped[item.principal] =
        (grouped[item.principal] || 0) + item.outstanding;
    });

    const data = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((first, second) => second.value - first.value);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return data.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }));
  }, [filteredData]);


  /* =======================================================
     CHANNEL CHART
  ======================================================= */

  const customerGroupChartData =
    useMemo(() => {

      const grouped = {};


      detailChartRows.forEach((item) => {

        if (!grouped[item.channel]) {

          grouped[item.channel] = {
            name: item.channel,
            value: 0,
          };

        }


        grouped[item.channel].value +=
          item.outstanding;

      });


      return Object.values(grouped);

    }, [detailChartRows]);


  /* =======================================================
     AGING DATA
     Data berasal dari API khusus Aging Piutang.
  ======================================================= */

  const agingSummary = agingPiutangApiData;



  /* =======================================================
     CUSTOM TOOLTIP
  ======================================================= */

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {

    if (
      !active ||
      !payload ||
      !payload.length
    ) {

      return null;

    }


    return (

      <div className="
        bg-white
        border
        border-gray-100
        rounded-xl
        shadow-xl
        px-4
        py-3
      ">

        <p className="
          text-xs
          font-bold
          text-gray-700
          mb-2
        ">
          {label}
        </p>


        {payload.map(
          (item, index) => (

            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                gap-6
                text-xs
                mb-1
              "
            >

              <span className="text-gray-500">
                {item.name}
              </span>


              <span className="
                font-bold
                text-gray-700
              ">
                {formatShortRupiah(
                  item.value
                )}
              </span>

            </div>

          )
        )}

      </div>

    );

  };


  /* =======================================================
     SUMMARY CARD
  ======================================================= */

  const SummaryCard = ({
    title,
    value,
    label,
    icon,
    iconBg,
    iconColor,
    footer,
    footerColor = 'text-gray-400',
  }) => {

    return (

      <div className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        shadow-sm
        hover:shadow-md
        transition-all
        duration-200
        p-5
        relative
        overflow-hidden
      ">

        <div className="
          absolute
          -right-8
          -top-8
          w-24
          h-24
          rounded-full
          bg-gray-50
        " />


        <div className="relative">

          <div className="
            flex
            items-start
            justify-between
          ">

            <div className={`
              w-11
              h-11
              rounded-xl
              flex
              items-center
              justify-center
              ${iconBg}
              ${iconColor}
            `}>

              {icon}

            </div>


            <span className="
              text-[10px]
              font-bold
              text-gray-400
              uppercase
              tracking-wide
            ">
              {label}
            </span>

          </div>


          <p className="
            text-xs
            text-gray-400
            mt-4
          ">
            {title}
          </p>


          <p className="
            text-xl
            xl:text-2xl
            font-bold
            text-gray-800
            mt-1
            whitespace-nowrap
          ">
            {value}
          </p>


          {footer && (

            <div className={`
              flex
              items-center
              gap-1.5
              mt-2
              text-[11px]
              font-semibold
              ${footerColor}
            `}>

              {footer}

            </div>

          )}

        </div>

      </div>

    );

  };


  /* =======================================================
     AGING TABLE
  ======================================================= */

  const AgingTable = ({
    title,
    icon,
    data,
  }) => {

    return (

      <div className="
        bg-white
        rounded-2xl
        border
        border-gray-100
        shadow-sm
        overflow-hidden
      ">

        <div className="
          px-5
          py-4
          border-b
          border-gray-100
          flex
          items-center
          justify-between
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
              text-blue-600
            ">

              {icon}

            </div>


            <div>

              <h3 className="
                font-bold
                text-gray-800
              ">
                {title}
              </h3>


              <p className="
                text-xs
                text-gray-400
                mt-0.5
              ">
                Ringkasan piutang berdasarkan aging
              </p>

            </div>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="
            w-full
            min-w-[950px]
          ">

            <thead>

              <tr className="
                bg-gray-50
                border-b
                border-gray-100
              ">

                <th className="
                  text-left
                  px-5
                  py-3
                  text-xs
                  font-bold
                  text-gray-500
                ">
                  {title}
                </th>


                {agingLabels.map(
                  (label) => (

                    <th
                      key={label}
                      className="
                        text-right
                        px-3
                        py-3
                        text-[11px]
                        font-bold
                        text-gray-500
                        whitespace-nowrap
                      "
                    >
                      {label}
                    </th>

                  )
                )}


                <th className="
                  text-right
                  px-5
                  py-3
                  text-[11px]
                  font-bold
                  text-gray-500
                ">
                  Total
                </th>

              </tr>

            </thead>


            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan={
                      agingLabels.length + 2
                    }
                    className="
                      px-4
                      py-12
                      text-center
                      text-gray-400
                    "
                  >
                    Tidak ada data
                  </td>

                </tr>

              ) : (

                data.map(
                  (row, index) => {

                    const total =
                      row.aging.reduce(
                        (sum, value) =>
                          sum + value,
                        0
                      );


                    return (

                      <tr
                        key={index}
                        className="
                          border-b
                          border-gray-50
                          hover:bg-blue-50/30
                          transition
                        "
                      >

                        <td className="
                          px-5
                          py-3
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                          ">

                            <div className="
                              w-7
                              h-7
                              rounded-lg
                              bg-blue-50
                              text-blue-600
                              flex
                              items-center
                              justify-center
                              shrink-0
                            ">

                              {title ===
                                'Per Channel'
                                ? (
                                  <FaHospital
                                    size={12}
                                  />
                                )
                                : title ===
                                  'Per Customer'
                                  ? (
                                    <FaUsers
                                      size={12}
                                    />
                                  )
                                  : (
                                    <FaBuilding
                                      size={12}
                                    />
                                  )}

                            </div>


                            <span className="
                              text-xs
                              font-semibold
                              text-gray-700
                              whitespace-nowrap
                            ">
                              {row.name}
                            </span>

                          </div>

                        </td>


                        {row.aging.map(
                          (value, i) => (

                            <td
                              key={i}
                              className="
                                px-3
                                py-3
                                text-right
                                text-xs
                                text-gray-600
                                whitespace-nowrap
                              "
                            >
                              {formatRupiah(
                                value
                              )}
                            </td>

                          )
                        )}


                        <td className="
                          px-5
                          py-3
                          text-right
                          text-xs
                          font-bold
                          text-blue-700
                          whitespace-nowrap
                        ">
                          {formatRupiah(total)}
                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>


            <tfoot>

              <tr className="
                bg-blue-900
                text-white
              ">

                <td className="
                  px-5
                  py-3
                  font-bold
                  text-xs
                ">
                  Grand Total
                </td>


                {agingLabels.map(
                  (_, i) => {

                    const total =
                      data.reduce(
                        (sum, row) =>
                          sum +
                          (
                            row.aging[i] ||
                            0
                          ),
                        0
                      );


                    return (

                      <td
                        key={i}
                        className="
                          px-3
                          py-3
                          text-right
                          font-semibold
                          text-xs
                          whitespace-nowrap
                        "
                      >
                        {formatRupiah(
                          total
                        )}
                      </td>

                    );

                  }
                )}


                <td className="
                  px-5
                  py-3
                  text-right
                  font-bold
                  text-xs
                ">

                  {formatRupiah(
                    data.reduce(
                      (grand, row) =>
                        grand +
                        row.aging.reduce(
                          (sum, value) =>
                            sum + value,
                          0
                        ),
                      0
                    )
                  )}

                </td>

              </tr>

            </tfoot>

          </table>

        </div>

      </div>

    );

  };


  /* =======================================================
     BUILD AGING TABLE DATA
  ======================================================= */

  const buildAgingData = (
    sourceData,
    keyName
  ) => {

    const grouped = {};


    sourceData.forEach((item) => {

      const key =
        item[keyName];


      if (!key) {
        return;
      }


      if (!grouped[key]) {

        grouped[key] = {
          name: key,
          aging: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
        };

      }


      const agingIndex =
        agingLabels.indexOf(
          getAgingCategory(
            item.aging
          )
        );


      if (agingIndex >= 0) {

        grouped[key].aging[
          agingIndex
        ] += item.outstanding;

      }

    });


    return Object.values(
      grouped
    );

  };


  /* =======================================================
     PRODUK TABLE
  ======================================================= */

  const ProdukTable = ({
    data,
  }) => {

    return (

      <div className="
        bg-white
        rounded-2xl
        border
        border-gray-100
        shadow-sm
        overflow-hidden
      ">

        <div className="
          px-5
          py-4
          border-b
          border-gray-100
          flex
          items-center
          gap-3
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-orange-50
            text-orange-500
            flex
            items-center
            justify-center
          ">
            <FaBox />
          </div>


          <div>

            <h3 className="
              font-bold
              text-gray-800
            ">
              Detail Produk
            </h3>


            <p className="
              text-xs
              text-gray-400
            ">
              Detail transaksi berdasarkan produk
            </p>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="
            w-full
            min-w-[1450px]
            text-xs
          ">

            <thead>

              <tr className="
                bg-gray-50
                text-gray-500
              ">

                <th className="px-4 py-3 text-center">
                  No
                </th>

                <th className="px-4 py-3 text-left">
                  Cabang
                </th>

                <th className="px-4 py-3 text-left">
                  Billing No
                </th>

                <th className="px-4 py-3 text-left">
                  Tanggal
                </th>

                <th className="px-4 py-3 text-left">
                  Material
                </th>

                <th className="px-4 py-3 text-left">
                  Nama Produk
                </th>

                <th className="px-4 py-3 text-left">
                  Principal
                </th>

                <th className="px-4 py-3 text-left">
                  Customer
                </th>

                <th className="px-4 py-3 text-left">
                  Channel
                </th>

                <th className="px-4 py-3 text-right">
                  Qty
                </th>

                <th className="px-4 py-3 text-center">
                  Unit
                </th>

                <th className="px-4 py-3 text-right">
                  Harga
                </th>

                <th className="px-4 py-3 text-right">
                  Discount
                </th>

                <th className="px-4 py-3 text-right">
                  Penjualan
                </th>

                <th className="px-4 py-3 text-right">
                  Tax
                </th>

                <th className="px-4 py-3 text-right">
                  COGS
                </th>

                <th className="px-4 py-3 text-center">
                  SLED
                </th>

              </tr>

            </thead>


            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan={17}
                    className="
                      px-4
                      py-12
                      text-center
                      text-gray-400
                    "
                  >
                    Tidak ada data produk
                  </td>

                </tr>

              ) : (

                data.map(
                  (row, index) => (

                    <tr
                      key={row.id}
                      className="
                        border-t
                        border-gray-100
                        hover:bg-blue-50/30
                        transition
                      "
                    >

                      <td className="
                        px-4
                        py-3
                        text-center
                        text-gray-400
                      ">
                        {index + 1}
                      </td>


                      <td className="
                        px-4
                        py-3
                      ">

                        <div className="
                          flex
                          flex-col
                        ">

                          <span className="
                            font-semibold
                            text-gray-700
                          ">
                            {row.descSalesOffice}
                          </span>


                          <span className="
                            text-[10px]
                            text-gray-400
                          ">
                            {row.salesOffice}
                          </span>

                        </div>

                      </td>


                      <td className="
                        px-4
                        py-3
                        font-semibold
                        text-blue-600
                      ">
                        {row.billingNo}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-gray-600
                        whitespace-nowrap
                      ">
                        {formatDate(
                          row.tanggal
                        )}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-gray-600
                      ">
                        {row.material}
                      </td>


                      <td className="
                        px-4
                        py-3
                        font-semibold
                        text-gray-700
                      ">
                        {row.namaProduk}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-gray-600
                      ">
                        {row.principal}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-gray-600
                      ">
                        {row.customer}
                      </td>


                      <td className="px-4 py-3">

                        <span className="
                          px-2
                          py-1
                          rounded-full
                          bg-blue-50
                          text-blue-600
                          font-semibold
                        ">
                          {row.channel}
                        </span>

                      </td>


                      <td className="
                        px-4
                        py-3
                        text-right
                        font-semibold
                      ">
                        {formatNumber(
                          row.quantity
                        )}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-center
                      ">
                        {row.salesUnit}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-right
                        whitespace-nowrap
                      ">
                        {formatRupiah(
                          row.unitPrice
                        )}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-right
                        text-orange-500
                        whitespace-nowrap
                      ">
                        {formatRupiah(
                          row.totalDiscount
                        )}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-right
                        font-bold
                        text-blue-700
                        whitespace-nowrap
                      ">
                        {formatRupiah(
                          row.totalPenjualan
                        )}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-right
                        whitespace-nowrap
                      ">
                        {formatRupiah(
                          row.taxAmount
                        )}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-right
                        whitespace-nowrap
                      ">
                        {formatRupiah(
                          row.totalCogs
                        )}
                      </td>


                      <td className="
                        px-4
                        py-3
                        text-center
                        whitespace-nowrap
                      ">
                        {row.sled}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    );

  };


  const DetailPiutangTable = ({
    data,
    page = 1,
    pageSize = 10,
    total = 0,
    totalPages = 0,
    summary = { aging: agingLabels.map(() => 0), total_outstanding: 0 },
    loading = false,
    onPageChange = () => { },
    onPageSizeChange = () => { },
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <FaMoneyBillWave />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Detail Piutang</h3>
          <p className="text-xs text-gray-400">Detail piutang per produk berdasarkan aging</p>
        </div>
      </div>

      <div className="h-[400px] overflow-auto">
        <table className="w-full min-w-[1250px] text-xs">
          <thead className="sticky top-0 z-20">
            <tr className="bg-gray-50 text-gray-500">
              <th className="px-4 py-3 text-center">No</th>
              <th className="px-4 py-3 text-left">Cabang</th>
              <th className="px-4 py-3 text-left">Principal</th>
              <th className="px-4 py-3 text-left">Nama Produk</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Channel</th>
              {agingLabels.map((label) => (
                <th key={label} className="px-3 py-3 text-right whitespace-nowrap">
                  {label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={agingLabels.length + 8} className="px-4 py-12 text-center text-blue-600">
                  Memuat data Detail Piutang...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={agingLabels.length + 8} className="px-4 py-12 text-center text-gray-400">
                  Tidak ada data Detail Piutang
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const total = row.aging.reduce((sum, value) => sum + value, 0);

                return (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3 text-center text-gray-400">{((page - 1) * pageSize) + index + 1}</td>
                    <td className="px-4 py-3 text-gray-600">{row.descSalesOffice}</td>
                    <td className="px-4 py-3 text-gray-600">{row.principal}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{row.namaProduk}</td>
                    <td className="px-4 py-3 text-gray-600">{row.customer}</td>
                    <td className="px-4 py-3 text-gray-600">{row.channel}</td>
                    {row.aging.map((value, agingIndex) => (
                      <td key={agingIndex} className="px-3 py-3 text-right text-gray-600 whitespace-nowrap">
                        {formatRupiah(value)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-bold text-blue-700 whitespace-nowrap">
                      {formatRupiah(total)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          <tfoot className="sticky bottom-0 z-20">
            <tr className="bg-blue-900 text-white shadow-[0_-2px_6px_rgba(15,23,42,0.12)]">
              <td colSpan={6} className="px-4 py-3 font-bold text-xs whitespace-nowrap">TOTAL SELURUH DATA</td>
              {agingLabels.map((_, agingIndex) => (
                <td key={agingIndex} className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  {formatRupiah(Number(summary?.aging?.[agingIndex] ?? 0))}
                </td>
              ))}
              <td className="px-4 py-3 text-right font-bold whitespace-nowrap">
                {formatRupiah(Number(summary?.total_outstanding ?? summary?.totalOutstanding ?? 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-gray-500">
          Menampilkan {total === 0 ? 0 : ((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} dari {total} data
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-gray-500">Baris:</label>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="select select-bordered select-xs h-8 min-h-0"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="btn btn-xs h-8 min-h-0"
          >Sebelumnya</button>
          <span className="px-2 text-xs text-gray-600">Halaman {totalPages === 0 ? 0 : page} dari {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages || loading || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            className="btn btn-xs h-8 min-h-0"
          >Berikutnya</button>
        </div>
      </div>
    </div>
  );


  /* =======================================================
     FILTERED PRODUCT
  ======================================================= */

  const filteredProdukData = useMemo(() => {
    return unwrapDashboardResponse(performaProdukApiData).map((item, index) => ({
      ...item,
      id: item?.id ?? item?.material_id ?? item?.material ?? index,
      billingNo: item?.billingNo ?? item?.billing_no ?? item?.no_invoice ?? '',
      tanggal: item?.tanggal ?? item?.document_date ?? item?.posting_date ?? '',
      descSalesOffice: item?.nama_cabang ?? item?.name_cabang ?? item?.descSalesOffice ?? item?.desc_s_office ?? item?.cabang ?? item?.sales_office ?? '',
      principal: item?.nama_principle ?? item?.name_principle ?? item?.principal_name ?? item?.principal ?? item?.principle ?? item?.principal_id ?? '',
      customer: item?.customer ?? item?.name_bill_to ?? item?.nama_customer ?? '',
      channel: item?.channel ?? item?.customer_group ?? item?.desc_cust_grp4 ?? '',
      namaProduk: item?.namaProduk ?? item?.nama_produk ?? item?.produk ?? item?.text_material ?? item?.material_desc ?? '',
      totalPenjualan: Number(item?.totalPenjualan ?? item?.total_penjualan ?? item?.sales ?? 0),
      totalCOGS: Number(item?.totalCOGS ?? item?.total_cogs ?? 0),
      outstanding: Number(item?.outstanding ?? item?.saldo_piutang ?? item?.saldoPiutang ?? 0),
      collection: Number(item?.collection ?? item?.total_collection ?? item?.pembayaran ?? 0),
      aging: Array.isArray(item?.aging) ? item.aging : agingLabels.map((_, i) => Number(item?.[`aging_${i}`] ?? 0)),
    }));
  }, [performaProdukApiData]);

  const filteredPiutangProdukData = useMemo(() => filteredProdukData, [filteredProdukData]);


  /* =======================================================
     SUMMARY DATA FROM DETAIL PIUTANG
     ======================================================= */

  const summaryData = useMemo(() => {
    const total = filteredPiutangProdukData.length;

    const totalBilling = new Set(
      filteredPiutangProdukData
        .map((item) => item.billingNo)
        .filter(Boolean)
    ).size;

    const totalPenjualan = filteredPiutangProdukData.reduce(
      (sum, item) => sum + (Number(item.totalPenjualan) || 0),
      0
    );

    const totalCOGS = filteredPiutangProdukData.reduce(
      (sum, item) => sum + (Number(item.totalCogs) || 0),
      0
    );

    const totalMargin = totalPenjualan - totalCOGS;

    return {
      total,
      totalBilling,
      totalPenjualan,
      totalCOGS,
      totalMargin,
    };
  }, [filteredPiutangProdukData]);


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  const EmptyState = () => {

    return (

      <div className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        p-12
        text-center
        shadow-sm
      ">

        <div className="
          w-14
          h-14
          mx-auto
          rounded-2xl
          bg-gray-100
          text-gray-400
          flex
          items-center
          justify-center
          mb-4
        ">
          <FaChartBar size={22} />
        </div>


        <h3 className="
          font-bold
          text-gray-700
        ">
          Data tidak ditemukan
        </h3>


        <p className="
          text-xs
          text-gray-400
          mt-1
        ">
          Silakan ubah kombinasi filter untuk melihat data lainnya.
        </p>

      </div>

    );

  };


  /* =========================================================
     WIDGET 3 KOLOM:
     1. TOP PIUTANG JATUH TEMPO BERDASARKAN CHANNEL
     2. PERINGKAT CABANG BERDASARKAN SKOR KINERJA PIUTANG
     3. SALDO PIUTANG >360 HARI
  ========================================================= */

  const topJatuhTempoChannelData = useMemo(() => {
    const channelConfig = [
      {
        label: 'RS Pemerintah',
        match: (item) =>
          item.channel === 'RS Pemerintah',
      },
      {
        label: 'Swasta',
        match: (item) =>
          item.channel !== 'RS Pemerintah' &&
          item.channel !== 'Dinkes' &&
          item.channel !== 'Puskesmas' &&
          item.customerGroup !== 'Instansi Pemerintah',
      },
      {
        label: 'Instansi Pemerintah',
        match: (item) =>
          item.channel === 'Dinkes' ||
          item.channel === 'Puskesmas' ||
          item.customerGroup === 'Instansi Pemerintah',
      },
    ];

    return channelConfig.map((group) => {
      const rows = filteredData
        .filter(
          (item) =>
            group.match(item) &&
            Number(item.aging || 0) > 0
        )
        .map((item) => ({
          customer: item.customer || '-',
          tahun: String(item.tanggal || '').slice(0, 4) || '-',
          value: Number(item.outstanding || 0),
          aging: Number(item.aging || 0),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      const total = rows.reduce(
        (sum, item) => sum + item.value,
        0
      );

      return {
        ...group,
        rows,
        total,
      };
    });
  }, [filteredData]);



  const branchPiutangBaseData = useMemo(() => {
    const map = {};

    filteredData.forEach((item) => {
      const branch = item.cabang || item.descSalesOffice;
      if (!branch) return;

      if (!map[branch]) {
        map[branch] = {
          branch,
          outstanding: 0,
          overdue: 0,
          overdue360: 0,
        };
      }

      const outstanding = Number(item.outstanding || 0);
      const aging = Number(item.aging || 0);

      map[branch].outstanding += outstanding;

      if (aging > 0) {
        map[branch].overdue += outstanding;
      }

      if (aging > 360) {
        map[branch].overdue360 += outstanding;
      }
    });

    return map;
  }, [filteredData]);

  const branchScoreData = useMemo(() => {
    const rows = Object.values(branchPiutangBaseData).map((item) => ({
      branch: item.branch,
      overdue: Number(item.overdue || 0),
      outstanding: Number(item.outstanding || 0),
    }));
    const maxOverdue = Math.max(...rows.map((item) => item.overdue), 1);
    const minOverdue = Math.min(...rows.map((item) => item.overdue), 0);
    const range = maxOverdue - minOverdue || 1;

    return rows
      .map((item) => ({
        ...item,
        score: Math.round(105 - ((item.overdue - minOverdue) / range) * 88),
      }))
      .sort((a, b) => b.score - a.score || a.overdue - b.overdue)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [branchPiutangBaseData]);

  const piutang360BranchData = useMemo(() => (
    Object.values(branchPiutangBaseData)
      .map((item) => ({ branch: item.branch, value: Number(item.overdue360 || 0) }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
  ), [branchPiutangBaseData]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-orange-50
      to-yellow-50
      p-4
      md:p-5
    ">

      <div className="
        max-w-[1800px]
        mx-auto
      ">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-5
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              w-12
              h-12
              rounded-2xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              shadow-lg
              shadow-blue-200
            ">
              <FaChartBar size={20} />
            </div>


            <div>

              <h1 className="
                text-2xl
                font-bold
                text-gray-800
              ">
                Dashboard
              </h1>


              <p className="
                text-xs
                text-gray-400
                mt-0.5
              ">
                Monitoring penjualan, piutang dan collection
              </p>

            </div>

          </div>


          <div className="
            flex
            items-center
            gap-2
            bg-white
            border
            border-gray-100
            rounded-xl
            px-4 py-2.5
            shadow-sm
          ">

            <FaCalendarAlt
              className="text-blue-500"
              size={13}
            />


            <div>

              <p className="
                text-[10px]
                text-gray-400
              ">
                Periode tanggal
              </p>


              <p className="
                text-xs
                font-bold
                text-gray-700
              ">
                {appliedFilter.tanggalMulai || appliedFilter.tanggalAkhir
                  ? `${formatDate(appliedFilter.tanggalMulai)} - ${formatDate(appliedFilter.tanggalAkhir)}`
                  : 'Semua tanggal'}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            FILTER
        ================================================= */}

        <div className="
          bg-white
          border border-slate-200
          rounded-2xl
          shadow-sm
          p-4 sm:p-5
          mb-5
        ">

          <div className="
            flex flex-col sm:flex-row
            sm:items-center sm:justify-between
            gap-3
            mb-5 pb-4
            border-b border-slate-100
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <div className="
                w-9
                h-9
                rounded-xl
                bg-orange-50
                text-orange-500
                flex
                items-center
                justify-center
              ">
                <FaFilter size={14} />
              </div>


              <div>

                <h2 className="
                  text-sm
                  font-bold
                  text-gray-800
                ">
                  Filter Data
                </h2>


                <p className="
                  text-[11px]
                  text-gray-400
                ">
                  Tentukan parameter data yang ingin ditampilkan
                </p>

              </div>

            </div>


            {/*
            <div className="
              text-[11px]
              text-gray-400
            ">

              Filter aktif:

              <span className="ml-1 font-semibold text-blue-600">
                {[
                  ...(appliedFilter.cabang.length ? [`Cabang: ${getSelectedFilterLabels(apiCabangOptions, appliedFilter.cabang)}`] : []),
                  ...(appliedFilter.principal.length ? [`Principal: ${getSelectedFilterLabels(apiPrincipalOptions, appliedFilter.principal)}`] : []),
                  ...(appliedFilter.channel.length ? [`Channel: ${getSelectedFilterLabels(apiChannelOptions, appliedFilter.channel)}`] : []),
                  ...(appliedFilter.customer.length ? [`Customer: ${getSelectedFilterLabels(apiCustomerOptions, appliedFilter.customer)}`] : []),
                  ...(appliedFilter.produk.length ? [`Produk: ${getSelectedFilterLabels(apiProductOptions, appliedFilter.produk)}`] : []),
                  ...(appliedFilter.tanggal ? [`Tanggal: ${formatDate(appliedFilter.tanggal)}`] : []),
                ].join(' • ') || 'Semua data'}
              </span>

            </div>
            */}

          </div>


          <div className="
            grid grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-x-4 gap-y-4
            items-start
          ">


            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Cabang</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isClearable
                isDisabled={false}
                options={apiCabangOptions}
                value={apiCabangOptions.filter((option) => (filter.cabang || []).some((value) => String(value) === String(option.value)))}
                onChange={(selected) => handleFilterChange('cabang', selected || [])}
                components={dashboardFilterSelectComponents}
                styles={dashboardFilterSelectStyles}
                placeholder="Pilih cabang..."
                noOptionsMessage={() => "Tidak ada data"}
              />
            </div>



            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Principal</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isClearable
                isDisabled={false}
                options={apiPrincipalOptions}
                value={apiPrincipalOptions.filter((option) => (filter.principal || []).some((value) => String(value) === String(option.value)))}
                onChange={(selected) => handleFilterChange('principal', selected || [])}
                components={dashboardFilterSelectComponents}
                styles={dashboardFilterSelectStyles}
                placeholder="Pilih principal..."
                noOptionsMessage={() => "Tidak ada data"}
              />
            </div>



            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Channel</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isClearable
                isDisabled={false}
                options={apiChannelOptions}
                value={apiChannelOptions.filter((option) => (filter.channel || []).some((value) => String(value) === String(option.value)))}
                onChange={(selected) => handleFilterChange('channel', selected || [])}
                components={dashboardFilterSelectComponents}
                styles={dashboardFilterSelectStyles}
                placeholder="Pilih channel..."
                noOptionsMessage={() => "Tidak ada data"}
              />
            </div>



            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Customer</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isClearable
                isDisabled={!filter.cabang.length}
                options={customerOptions}
                value={customerOptions.filter((option) => (filter.customer || []).some((value) => String(value) === String(option.value)))}
                onChange={(selected) => handleFilterChange('customer', selected || [])}
                components={dashboardFilterSelectComponents}
                styles={dashboardFilterSelectStyles}
                placeholder="Pilih customer..."
                noOptionsMessage={() => "Tidak ada data"}
              />
            </div>



            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Produk</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isClearable
                isDisabled={!filter.principal.length}
                options={productOptions}
                value={productOptions.filter((option) => (filter.produk || []).some((value) => String(value) === String(option.value)))}
                onChange={(selected) => handleFilterChange('produk', selected || [])}
                components={dashboardFilterSelectComponents}
                styles={dashboardFilterSelectStyles}
                placeholder="Pilih produk..."
                noOptionsMessage={() => "Tidak ada data"}
              />
            </div>


            {/* RANGE TANGGAL */}
            <div className="w-full min-w-0 sm:col-span-2 xl:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Periode Tanggal
              </label>
              <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 shadow-sm transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <FaCalendarAlt className="shrink-0 text-blue-600 text-sm" />
                <input
                  type="date"
                  value={filter.tanggalMulai || ''}
                  max={filter.tanggalAkhir || undefined}
                  onChange={(e) => setFilter((prev) => ({ ...prev, tanggalMulai: e.target.value }))}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
                  title="Tanggal mulai"
                  aria-label="Tanggal mulai"
                />
                <span className="text-gray-300">-</span>
                <input
                  type="date"
                  value={filter.tanggalAkhir || ''}
                  min={filter.tanggalMulai || undefined}
                  onChange={(e) => setFilter((prev) => ({ ...prev, tanggalAkhir: e.target.value }))}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
                  title="Tanggal akhir"
                  aria-label="Tanggal akhir"
                />
              </div>
            </div>
          </div>


          {/*
          ACTIVE FILTER (dikomentari sesuai permintaan)

          <div className="
            flex
            flex-wrap
            items-center
            gap-2
            mt-4
          ">

            <span className="
              text-[10px]
              text-gray-400
              font-semibold
            ">
              Filter:
            </span>


            <span className="
              px-2.5
              py-1
              rounded-full
              bg-blue-50
              text-blue-600
              text-[10px]
              font-semibold
            ">
              {getSelectedFilterLabels(apiCabangOptions, filter.cabang)}
            </span>


            <span className="
              px-2.5
              py-1
              rounded-full
              bg-indigo-50
              text-indigo-600
              text-[10px]
              font-semibold
            ">
              {getSelectedFilterLabels(apiPrincipalOptions, filter.principal)}
            </span>


            <span className="
              px-2.5
              py-1
              rounded-full
              bg-orange-50
              text-orange-600
              text-[10px]
              font-semibold
            ">
              {getSelectedFilterLabels(apiChannelOptions, filter.channel)}
            </span>


            <span className="
              px-2.5
              py-1
              rounded-full
              bg-emerald-50
              text-emerald-600
              text-[10px]
              font-semibold
              max-w-[250px]
              truncate
            ">
              {getSelectedFilterLabels(apiCustomerOptions, filter.customer)}
            </span>


            <span className="
              px-2.5
              py-1
              rounded-full
              bg-cyan-50
              text-cyan-600
              text-[10px]
              font-semibold
              max-w-[250px]
              truncate
            ">
              {getSelectedFilterLabels(apiProductOptions, filter.produk)}
            </span>


            <span className="
              px-2.5
              py-1
              rounded-full
              bg-gray-100
              text-gray-600
              text-[10px]
              font-semibold
            ">
              {filter.tanggalMulai || filter.tanggalAkhir
                ? `${formatDate(filter.tanggalMulai)} - ${formatDate(filter.tanggalAkhir)}`
                : 'Semua tanggal'}
            </span>

          </div>


          */}

          {/* BUTTON */}

          <div className="
            flex flex-col-reverse sm:flex-row
            sm:justify-end sm:items-center
            gap-2
            mt-5 pt-4
            border-t border-slate-100
          ">

            <button
              type="button"
              onClick={resetFilter}
              className="
                flex
                items-center
                gap-2
                justify-center
                px-4 py-2.5
                rounded-xl
                text-xs
                font-semibold
                text-gray-500
                hover:bg-gray-100
                transition
              "
            >

              <FaSyncAlt size={11} />

              Reset

            </button>


            <button
              type="button"
              onClick={applyFilter}
              className="
                flex
                items-center
                gap-2
                justify-center
                px-5 py-2.5
                rounded-xl
                bg-blue-600
                text-white
                text-xs
                font-bold
                shadow-md
                shadow-blue-100
                hover:bg-blue-700
                transition
              "
            >

              <FaFilter size={11} />

              Terapkan Filter

            </button>

          </div>

        </div>

        {/* =================================================
            KPI PIUTANG - 2 BARIS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

          <PiutangKpiSimpleCard
            title="TOTAL PIUTANG"
            value={formatNumber(summary.totalPiutang)}
            delta="▼ Rp58 M | 44% dari bulan lalu"
            icon={<FaMoneyBillWave size={18} />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            accentColor="#3b82f6"
          />

          <PiutangKpiSimpleCard
            title="DOAR"
            value="60"
            delta="▲ 1 Hari dari bulan lalu"
            footer="Days Outstanding Average Receivable"
            icon={<FaClock size={18} />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            accentColor="#6366f1"
          />

          <PiutangKpiSimpleCard
            title="SKOR PIUTANG *"
            value="103"
            delta="▲ 1 Point dari bulan lalu"
            footer="Rank 6/44 Cabang"
            icon={<FaChartLine size={18} />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            accentColor="#8b5cf6"
          />

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

          <PiutangGaugeCard
            title="PENCAIRAN (MTD)"
            value={formatNumber(summary.totalCollection)}
            delta="▼ Rp119 M | 59% dari bulan lalu"
            achievement={133.1}
            target={100}
            color="#10b981"
            targetLabel="% Ach Pencairan Piutang"
            icon={<FaMoneyBillWave size={18} />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <PiutangGaugeCard
            title="PIUTANG JATUH TEMPO"
            value={formatNumber(
              saldoJatuhTempoData?.find(
                (item) => item.name === 'Sudah JTO'
              )?.value || 0
            )}
            delta="▼ Rp01 M | 10% dari bulan lalu"
            achievement={12.9}
            target={15}
            color="#f59e0b"
            targetLabel="% Piutang Jatuh Tempo"
            icon={<FaExclamationTriangle size={18} />}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />

          <PiutangGaugeCard
            title="PIUTANG >360 HARI"
            value={formatNumber(
              filteredData.reduce(
                (sum, item) =>
                  sum + (
                    Number(item.aging) > 360
                      ? Number(item.outstanding || 0)
                      : 0
                  ),
                0
              )
            )}
            delta="▲ Rp105,019 Jt | 03% dari bulan lalu"
            achievement={5.7}
            target={0}
            color="#ef4444"
            targetLabel="% Piutang >360 Hari"
            icon={<FaExclamationTriangle size={18} />}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />

        </div>


        {/* =================================================
            TREND CHARTS - 2 GRAFIK BERSEBELAHAN
        ================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">

          {/* TREND SALDO PIUTANG & SALDO OVERDUE */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaChartLine size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Trend Saldo Piutang &amp; Saldo Overdue
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Nominal dalam Rp juta dan persentase overdue
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                Rp Juta
              </span>
            </div>

            <div className="w-full h-[270px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={unwrapDashboardResponse(trendApiData).map((x) => ({ ...x, bulan: x.bulan ?? x.month ?? x.periode ?? '', saldoPiutang: Number(x.saldoPiutang ?? x.saldo_piutang ?? x.outstanding ?? 0), saldoOverdue: Number(x.saldoOverdue ?? x.saldo_overdue ?? x.overdue ?? 0), overduePct: Number(x.overduePct ?? x.overdue_pct ?? x.persentase_overdue ?? 0) }))}
                  margin={{
                    top: 22,
                    right: 8,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="bulan"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={false}
                  />

                  <YAxis
                    yAxisId="nominal"
                    orientation="left"
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('id-ID').format(value)
                    }
                  />

                  <YAxis
                    yAxisId="percentage"
                    orientation="right"
                    domain={[0, 14]}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value},0%`}
                  />

                  <Tooltip
                    formatter={(value, name) => {
                      if (name === '% overdue') {
                        return [`${value}%`, name];
                      }

                      return [
                        `${new Intl.NumberFormat('id-ID').format(value)} juta`,
                        name,
                      ];
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    iconType="rect"
                    wrapperStyle={{ fontSize: 10 }}
                  />

                  <Bar
                    yAxisId="nominal"
                    dataKey="saldoPiutang"
                    name="Saldo Piutang"
                    fill="#2563eb"
                    barSize={28}
                  >
                    <LabelList
                      dataKey="saldoPiutang"
                      position="top"
                      formatter={(value) =>
                        new Intl.NumberFormat('id-ID').format(value)
                      }
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        fill: '#374151',
                      }}
                    />
                  </Bar>

                  <Bar
                    yAxisId="nominal"
                    dataKey="saldoOverdue"
                    name="Saldo Overdue"
                    fill="#ef4444"
                    barSize={28}
                  >
                    <LabelList
                      dataKey="saldoOverdue"
                      position="top"
                      formatter={(value) =>
                        new Intl.NumberFormat('id-ID').format(value)
                      }
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        fill: '#374151',
                      }}
                    />
                  </Bar>

                  <Line
                    yAxisId="percentage"
                    type="monotone"
                    dataKey="overduePct"
                    name="% overdue"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f59e0b' }}
                    activeDot={{ r: 5 }}
                  >
                    <LabelList
                      dataKey="overduePct"
                      position="top"
                      offset={8}
                      formatter={(value) => `${value}%`}
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        fill: '#92400e',
                      }}
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* TREND PENCAIRAN PIUTANG */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FaMoneyBillWave size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Trend Pencairan Piutang (Rp juta)
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Realisasi pencairan dan % achievement
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                MTD
              </span>
            </div>

            <div className="w-full h-[270px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={unwrapDashboardResponse(salesOpenInvoiceApiData)}
                  margin={{
                    top: 22,
                    right: 8,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="bulan"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={false}
                  />

                  <YAxis
                    yAxisId="realisasi"
                    orientation="left"
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('id-ID').format(value)
                    }
                  />

                  <YAxis
                    yAxisId="ach"
                    orientation="right"
                    domain={[0, 300]}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />

                  <Tooltip
                    formatter={(value, name) => {
                      if (name === '% Ach Pencairan') {
                        return [`${value}%`, name];
                      }

                      return [
                        `${new Intl.NumberFormat('id-ID').format(value)} juta`,
                        name,
                      ];
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    iconType="rect"
                    wrapperStyle={{ fontSize: 10 }}
                  />

                  <Bar
                    yAxisId="realisasi"
                    dataKey="realisasi"
                    name="Realisasi Pencairan"
                    fill="#ed7d31"
                    barSize={30}
                  >
                    <LabelList
                      dataKey="realisasi"
                      position="top"
                      formatter={(value) =>
                        new Intl.NumberFormat('id-ID').format(value)
                      }
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        fill: '#374151',
                      }}
                    />
                  </Bar>

                  <Line
                    yAxisId="ach"
                    type="monotone"
                    dataKey="achPencairan"
                    name="% Ach Pencairan"
                    stroke="#5b9bd5"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#5b9bd5' }}
                    activeDot={{ r: 5 }}
                  >
                    <LabelList
                      dataKey="achPencairan"
                      position="top"
                      offset={8}
                      formatter={(value) => `${value}%`}
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        fill: '#0369a1',
                      }}
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>


        {/* =================================================
            GRAFIK TAMBAHAN - AGING & TABEL CHANNEL
            Tinggi card dibuat sama agar sejajar.
        ================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">

          {/* ===============================================
              SALDO PIUTANG BY AGING & CHANNEL
          =============================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-[350px]">

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <FaChartBar size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Saldo Piutang by Aging &amp; Channel
                  </h3>
                  <p className="text-[10px] text-slate-400">Distribusi saldo berdasarkan aging</p>
                </div>
              </div>
            </div>

            <div className="w-full h-[285px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agingChannelData}
                  margin={{
                    top: 15,
                    right: 105,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="aging"
                    tick={{
                      fontSize: 9,
                      fill: '#6b7280',
                    }}
                    axisLine={{
                      stroke: '#d1d5db',
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 9,
                      fill: '#6b7280',
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('id-ID').format(
                        value
                      )
                    }
                  />

                  <Tooltip
                    formatter={(value, name) => [
                      `${new Intl.NumberFormat('id-ID').format(
                        value
                      )} juta`,
                      name,
                    ]}
                  />

                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    wrapperStyle={{
                      fontSize: 9,
                      right: 0,
                      maxHeight: 235,
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      paddingLeft: 6,
                      boxSizing: 'border-box',
                    }}
                  />

                  {channelNames.map((channel, index) => (
                    <Bar
                      key={channel}
                      dataKey={channel}
                      name={channel}
                      stackId="aging"
                      fill={chartColors[index % chartColors.length]}
                    >
                      <LabelList
                        dataKey={channel}
                        position="center"
                        formatter={(value) =>
                          value > 0
                            ? new Intl.NumberFormat('id-ID', {
                                maximumFractionDigits: 0,
                              }).format(value)
                            : ''
                        }
                        style={{
                          fontSize: 8,
                          fontWeight: 600,
                          fill: '#ffffff',
                        }}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* ===============================================
              TABEL CHANNEL
              TBODY SAJA YANG SCROLL
          =============================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-[350px] flex flex-col">

            <div className="mb-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaBuilding size={16} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Channel
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Ringkasan piutang berdasarkan channel
                  </p>
                </div>
              </div>
            </div>

            {/* TABLE AREA */}
            <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200">

              {/* 
      Wrapper ini yang mengatur:
      - vertical overflow
      - horizontal overflow
      - tinggi mengikuti sisa card
    */}
              <div className="h-full overflow-auto">

                <table className="min-w-max border-collapse text-[10px]">

                  {/* =========================
            HEADER
        ========================= */}
                  <thead className="sticky top-0 z-20 bg-slate-50 text-slate-500">

                    <tr>
                      <th
                        rowSpan={2}
                        className="px-3 py-2 text-left border-r border-slate-200 whitespace-nowrap bg-slate-50"
                      >
                        Channel
                      </th>

                      <th
                        rowSpan={2}
                        className="px-3 py-2 text-right border-r border-slate-200 whitespace-nowrap bg-slate-50"
                      >
                        TOTAL
                      </th>

                      <th
                        rowSpan={2}
                        className="px-3 py-2 text-right border-r border-slate-200 whitespace-nowrap bg-slate-50"
                      >
                        %
                      </th>

                      <th
                        colSpan={2}
                        className="px-3 py-1 text-center border-r border-slate-200 whitespace-nowrap bg-slate-50"
                      >
                        2026
                      </th>

                      <th
                        colSpan={2}
                        className="px-3 py-1 text-center border-r border-slate-200 whitespace-nowrap bg-slate-50"
                      >
                        2025
                      </th>

                      <th
                        rowSpan={2}
                        className="px-3 py-2 text-right border-r border-slate-200 whitespace-nowrap bg-slate-50"
                      >
                        &lt; 2024
                        <br />
                        SDH JTO
                      </th>

                      <th
                        rowSpan={2}
                        className="px-3 py-2 text-right whitespace-nowrap bg-slate-50"
                      >
                        % SDH
                        <br />
                        JTO
                      </th>
                    </tr>

                    <tr>
                      <th
                        className="px-3 py-1 text-right border-r border-slate-200 bg-slate-100 whitespace-nowrap"
                      >
                        BLM JTO
                      </th>

                      <th
                        className="px-3 py-1 text-right border-r border-slate-200 bg-red-50 text-red-600 whitespace-nowrap"
                      >
                        SDH JTO
                      </th>

                      <th
                        className="px-3 py-1 text-right border-r border-slate-200 bg-slate-100 whitespace-nowrap"
                      >
                        BLM JTO
                      </th>

                      <th
                        className="px-3 py-1 text-right border-r border-slate-200 bg-red-50 text-red-600 whitespace-nowrap"
                      >
                        SDH JTO
                      </th>
                    </tr>

                  </thead>


                  {/* =========================
            BODY
        ========================= */}
                  <tbody className="divide-y divide-slate-100">

                    {channelTableRows.map((row) => {

                      return (
                        <tr
                          key={row.channel}
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-3 py-2 font-semibold whitespace-nowrap border-r border-slate-100">
                            {row.channel}
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap border-r border-slate-100">
                            {formatNumber(row.total)}
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap border-r border-slate-100">
                            {row.percentage.toFixed(1)}%
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap border-r border-slate-100">
                            {formatNumber(row.blmJto2026)}
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap text-red-600 border-r border-slate-100">
                            {row.sdhJto2026 > 0
                              ? `(${formatNumber(row.sdhJto2026)})`
                              : '-'}
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap border-r border-slate-100">
                            {formatNumber(row.blmJto2025)}
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap text-red-600 border-r border-slate-100">
                            {row.sdhJto2025 > 0
                              ? `(${formatNumber(row.sdhJto2025)})`
                              : '-'}
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap border-r border-slate-100">
                            {formatNumber(row.sdhJtoBefore2025)}
                          </td>

                          <td className="px-3 py-2 text-right whitespace-nowrap">
                            {row.percentageSdhJto.toFixed(1)}%
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>


                  {/* =========================
            TOTAL FOOTER
        ========================= */}
                  <tfoot className="sticky bottom-0 z-30">

                    {channelSummaryData
                      .filter((row) => row.channel === 'TOTAL')
                      .map((row) => (

                        <tr
                          key={row.channel}
                          className="font-bold bg-blue-50 border-t-2 border-blue-200"
                        >

                          <td className="px-3 py-2 font-extrabold whitespace-nowrap border-r border-blue-100 text-blue-900">
                            {row.channel}
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap border-r border-blue-100 text-blue-900">
                            {formatNumber(row.total)}
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap border-r border-blue-100 text-blue-900">
                            {row.percentage.toFixed(1)}%
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap border-r border-blue-100 text-blue-900">
                            {formatNumber(row.blmJto2026)}
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap text-red-600 border-r border-blue-100">
                            {row.sdhJto2026 > 0
                              ? `(${formatNumber(row.sdhJto2026)})`
                              : '-'}
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap border-r border-blue-100 text-blue-900">
                            {formatNumber(row.blmJto2025)}
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap text-red-600 border-r border-blue-100">
                            {row.sdhJto2025 > 0
                              ? `(${formatNumber(row.sdhJto2025)})`
                              : '-'}
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap border-r border-blue-100 text-blue-900">
                            {formatNumber(row.sdhJtoBefore2025)}
                          </td>

                          <td className="px-3 py-2 text-right font-extrabold whitespace-nowrap text-blue-900">
                            {row.percentageSdhJto.toFixed(1)}%
                          </td>

                        </tr>

                      ))}

                  </tfoot>

                </table>

              </div>

            </div>

          </div>


        </div>


        {/* =================================================
            3 WIDGET DASHBOARD TAMBAHAN
            Semua dibuat satu baris pada layar xl.
        ================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

          {/* ===============================================
              1. TOP PIUTANG JATUH TEMPO BERDASARKAN CHANNEL
          =============================================== */}

          <div className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            overflow-hidden
            h-[520px]
            flex
            flex-col
          ">

            <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FaExclamationTriangle size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Top Piutang Jatuh Tempo</h3>
                <p className="text-[9px] text-slate-400">Berdasarkan Channel · Rp Ribu</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">

              {topJatuhTempoChannelData.map(
                (group) => (
                  <div key={group.label}>

                    <div className="mx-3 my-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-bold text-red-600">
                      Total Overdue: Rp{' '}
                      {formatNumber(
                        group.total / 1000
                      )}{' '}
                      ({filteredData.length > 0
                        ? (
                          (group.total /
                            Math.max(
                              filteredData.reduce(
                                (sum, item) =>
                                  sum +
                                  Number(
                                    item.outstanding ||
                                    0
                                  ),
                                0
                              ),
                              1
                            )) *
                          100
                        ).toFixed(0)
                        : 0}
                      % dari total Piutang)
                    </div>

                    <div className="
                      grid
                      grid-cols-[minmax(0,1fr)_48px_75px_60px]
                      bg-slate-100
                      text-slate-500
                      text-[9px]
                      font-bold
                      px-2
                      py-1
                      gap-1
                      sticky
                      top-0
                      z-10
                    ">
                      <div>{group.label} (TOP 10 hari)</div>
                      <div className="text-center">Tahun</div>
                      <div className="text-right">Rp Ribu</div>
                      <div className="text-right">Aging</div>
                    </div>

                    {group.rows.map(
                      (row, index) => {
                        const critical =
                          row.aging > 360;

                        return (
                          <div
                            key={`${group.label}-${row.customer}-${index}`}
                            className={`
                              grid
                              grid-cols-[minmax(0,1fr)_48px_75px_60px]
                              px-2
                              py-1
                              gap-1
                              text-[9px]
                              border-b
                              border-slate-100
                              ${index % 2 === 0
                                ? 'bg-white'
                                : 'bg-slate-50'
                              }
                            `}
                          >
                            <div
                              className={`
                                truncate
                                ${critical
                                  ? 'text-red-600 font-bold'
                                  : 'text-gray-700'
                                }
                              `}
                              title={row.customer}
                            >
                              {row.customer}
                            </div>

                            <div
                              className={`
                                text-center
                                ${critical
                                  ? 'text-red-600 font-bold'
                                  : 'text-gray-600'
                                }
                              `}
                            >
                              {row.tahun}
                            </div>

                            <div
                              className={`
                                text-right
                                font-semibold
                                ${critical
                                  ? 'text-red-600'
                                  : 'text-gray-700'
                                }
                              `}
                            >
                              {formatNumber(
                                row.value / 1000
                              )}
                            </div>

                            <div
                              className={`
                                text-right
                                ${critical
                                  ? 'text-red-600 font-bold'
                                  : 'text-gray-600'
                                }
                              `}
                            >
                              {critical
                                ? '>360 hari'
                                : `${row.aging} hari`}
                            </div>
                          </div>
                        );
                      }
                    )}

                    {group.rows.length === 0 && (
                      <div className="px-3 py-5 text-center text-[10px] text-gray-400">
                        Tidak ada data jatuh tempo.
                      </div>
                    )}

                  </div>
                )
              )}

            </div>
          </div>


          {/* ===============================================
              2. PERINGKAT CABANG BERDASARKAN SKOR
          =============================================== */}

          <div className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            p-4
            h-[520px]
            flex
            flex-col
          ">

            <div className="mb-3 flex items-center gap-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FaChartLine size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Peringkat Cabang</h3>
                <p className="text-[10px] text-slate-400">Berdasarkan Skor Kinerja Piutang</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
              <div className="w-full space-y-1">
                {branchScoreData.map((row) => {
                  const width =
                    Math.max(
                      2,
                      Math.min(
                        100,
                        (row.score / 105) * 100
                      )
                    );

                  const isJakarta2 =
                    row.branch.toLowerCase() ===
                    'kftd jakarta 2';

                  return (
                    <div
                      key={row.branch}
                      className="grid grid-cols-[112px_minmax(0,1fr)_32px] items-center gap-2 min-h-[24px]"
                    >
                      <div className="text-[8px] leading-[9px] text-gray-600 text-right whitespace-nowrap overflow-hidden text-ellipsis">
                        {row.branch}
                        <span className="block">
                          [{row.rank}]
                        </span>
                      </div>

                      <div className="w-full h-[9px] relative">
                        <div
                          className={
                            isJakarta2
                              ? "h-full rounded-r-sm bg-yellow-400"
                              : "h-full rounded-r-sm bg-sky-500"
                          }
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>

                      <div className="text-[9px] font-semibold text-gray-700 text-left">
                        {row.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-2 flex-shrink-0 text-[8px]">
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="w-3 h-3 bg-yellow-400 inline-block" />
                Jakarta 2
              </div>
              <div className="flex items-center gap-1 text-sky-500">
                <span className="w-3 h-3 bg-sky-500 inline-block" />
                Skor Piutang
              </div>
            </div>
          </div>


          {/* ===============================================
              3. SALDO PIUTANG >360 HARI
          =============================================== */}

          <div className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            p-4
            h-[520px]
            flex
            flex-col
          ">

            <div className="mb-3 flex items-center gap-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FaExclamationTriangle size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Saldo Piutang &gt;360</h3>
                <p className="text-[10px] text-slate-400">Dalam Rp juta</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
              <div className="w-full space-y-1">
                {piutang360BranchData.map((row) => {
                  const maxValue = Math.max(
                    ...piutang360BranchData.map(
                      (item) => item.value
                    ),
                    1
                  );

                  const width = Math.max(
                    1,
                    Math.min(
                      100,
                      (row.value / maxValue) * 100
                    )
                  );

                  return (
                    <div
                      key={row.branch}
                      className="grid grid-cols-[112px_minmax(0,1fr)_48px] items-center gap-2 min-h-[24px]"
                    >
                      <div className="text-[8px] leading-[9px] text-gray-600 text-right whitespace-nowrap overflow-hidden text-ellipsis">
                        {row.branch}
                      </div>

                      <div className="w-full h-[9px]">
                        <div
                          className="h-full rounded-r-sm bg-red-700"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>

                      <div className="text-[9px] font-semibold text-gray-600 text-left">
                        {formatNumber(
                          row.value / 1000000
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>


        <div className="mb-5">
          <DetailPiutangTable
            data={detailRows}
            page={detailPage}
            pageSize={detailPageSize}
            total={detailTotal}
            totalPages={detailTotalPages}
            summary={detailSummary}
            loading={detailLoading}
            onPageChange={setDetailPage}
            onPageSizeChange={(size) => { setDetailPageSize(size); setDetailPage(1); }}
          />
        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-6
          gap-4
          mb-5
        ">

          <SummaryCard
            title="Total Penjualan"
            label="SALES"
            value={formatShortRupiah(
              summary.totalPenjualan
            )}
            icon={<FaMoneyBillWave />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            footer={
              <>
                <FaArrowUp size={9} />
                Nilai penjualan
              </>
            }
            footerColor="text-blue-500"
          />


          <SummaryCard
            title="Total Piutang"
            label="RECEIVABLE"
            value={formatShortRupiah(
              summary.totalPiutang
            )}
            icon={<FaFileInvoiceDollar />}
            iconBg="bg-orange-50"
            iconColor="text-orange-500"
            footer={
              <>
                <FaUsers size={9} />
                Saldo piutang
              </>
            }
            footerColor="text-orange-500"
          />


          <SummaryCard
            title="Total Collection"
            label="COLLECTION"
            value={formatShortRupiah(
              summary.totalCollection
            )}
            icon={<FaCheckCircle />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            footer={
              <>
                <FaArrowUp size={9} />
                {collectionRatio.toFixed(1)}%
                {' '}
                dari piutang
              </>
            }
            footerColor="text-emerald-600"
          />


          <SummaryCard
            title="Saldo Piutang"
            label="OUTSTANDING"
            value={formatShortRupiah(
              summary.saldoPiutang
            )}
            icon={<FaExclamationTriangle />}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            footer={
              <>
                <FaArrowDown size={9} />
                {outstandingRatio.toFixed(1)}%
                {' '}
                outstanding
              </>
            }
            footerColor="text-red-500"
          />


          <SummaryCard
            title="Jumlah Invoice"
            label="INVOICE"
            value={formatNumber(
              summary.jumlahInvoice
            )}
            icon={<FaFileInvoiceDollar />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            footer={
              <>
                <FaFileInvoiceDollar size={9} />
                Total invoice
              </>
            }
            footerColor="text-indigo-500"
          />


          <SummaryCard
            title="Invoice Outstanding"
            label="OPEN INVOICE"
            value={formatNumber(
              summary.invoiceOutstanding
            )}
            icon={<FaClock />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            footer={
              <>
                <FaClock size={9} />
                Belum lunas
              </>
            }
            footerColor="text-amber-600"
          />

        </div>


        {/* =================================================
            NO DATA
        ================================================= */}

        {filteredData.length === 0 ? (

          <EmptyState />

        ) : (

          <>


            {/* =================================================
                CHART ROW 1
            ================================================= */}

            <div className="
              grid
              grid-cols-1
              xl:grid-cols-3
              gap-5
              mb-5
            ">


              {/* SALDO AKHIR BY JATUH TEMPO */}

              <div className="
                xl:col-span-2
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                p-5
              ">

                <div className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-3
                  mb-2
                ">

                  <div>

                    <div className="
                      flex
                      items-center
                      gap-2
                    ">

                      <div className="
                        w-8
                        h-8
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                        flex
                        items-center
                        justify-center
                      ">
                        <FaClock size={13} />
                      </div>


                      <h2 className="
                        text-sm
                        font-bold
                        text-gray-800
                      ">
                        Saldo Akhir by Jatuh Tempo
                      </h2>

                    </div>


                    <p className="
                      text-[11px]
                      text-gray-400
                      mt-1
                    ">
                      Komposisi saldo akhir berdasarkan status jatuh tempo
                    </p>

                  </div>


                  <div className="
                    bg-gray-50
                    rounded-xl
                    px-3
                    py-2
                    text-right
                  ">

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-wide
                      text-gray-400
                      font-bold
                    ">
                      Total Saldo Akhir
                    </p>


                    <p className="
                      text-sm
                      font-bold
                      text-gray-800
                    ">
                      {formatShortRupiah(
                        totalSaldoJatuhTempo
                      )}
                    </p>

                  </div>

                </div>


                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-3
                  items-center
                ">


                  <div className="h-[300px]">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={
                            saldoJatuhTempoData
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={78}
                          outerRadius={112}
                          paddingAngle={3}
                          stroke="#ffffff"
                          strokeWidth={3}
                        >

                          {saldoJatuhTempoData.map(
                            (entry, index) => (

                              <Cell
                                key={entry.name}
                                fill={[
                                  '#2563eb',
                                  '#f59e0b',
                                  '#ef4444',
                                ][index]}
                              />

                            )
                          )}

                        </Pie>


                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />

                      </PieChart>

                    </ResponsiveContainer>

                  </div>


                  <div className="
                    space-y-3
                    pr-2
                  ">

                    {saldoJatuhTempoData.map(
                      (item, index) => {

                        const percentage =
                          totalSaldoJatuhTempo > 0
                            ? (
                              item.value /
                              totalSaldoJatuhTempo
                            ) * 100
                            : 0;


                        const statusColor =
                          [
                            'bg-blue-500',
                            'bg-amber-500',
                            'bg-red-500',
                          ][index];


                        const statusBg =
                          [
                            'bg-blue-50',
                            'bg-amber-50',
                            'bg-red-50',
                          ][index];


                        const statusText =
                          [
                            'text-blue-600',
                            'text-amber-600',
                            'text-red-600',
                          ][index];


                        const statusDescription =
                          [
                            'Jatuh tempo masih lebih dari 7 hari',
                            'Akan jatuh tempo dalam 7 hari',
                            'Sudah melewati tanggal jatuh tempo',
                          ][index];


                        return (

                          <div
                            key={item.name}
                            className="
                              rounded-xl
                              border
                              border-gray-100
                              p-3.5
                              hover:shadow-sm
                              transition
                            "
                          >

                            <div className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            ">

                              <div className="
                                flex
                                items-start
                                gap-3
                              ">

                                <div className={`
                                  w-9
                                  h-9
                                  rounded-lg
                                  ${statusBg}
                                  flex
                                  items-center
                                  justify-center
                                `}>

                                  <span className={`
                                    w-2.5
                                    h-2.5
                                    rounded-full
                                    ${statusColor}
                                  `} />

                                </div>


                                <div>

                                  <p className="
                                    text-xs
                                    font-bold
                                    text-gray-700
                                  ">
                                    {item.name}
                                  </p>


                                  <p className="
                                    text-[10px]
                                    text-gray-400
                                    mt-0.5
                                  ">
                                    {statusDescription}
                                  </p>

                                </div>

                              </div>


                              <div className="
                                text-right
                              ">

                                <p className="
                                  text-xs
                                  font-bold
                                  text-gray-800
                                  whitespace-nowrap
                                ">
                                  {formatShortRupiah(
                                    item.value
                                  )}
                                </p>


                                <p className={`
                                  text-[10px]
                                  font-bold
                                  ${statusText}
                                `}>
                                  {percentage.toFixed(1)}%
                                </p>

                              </div>

                            </div>


                            <div className="
                              mt-3
                              h-1.5
                              rounded-full
                              bg-gray-100
                              overflow-hidden
                            ">

                              <div
                                className={`
                                  h-full
                                  rounded-full
                                  ${statusColor}
                                `}
                                style={{
                                  width:
                                    `${percentage}%`,
                                }}
                              />

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

              </div>


              {/* AGING */}

              <div className="
                bg-gradient-to-br
                from-blue-500
                via-indigo-500
                to-orange-400
                rounded-2xl
                border
                border-blue-400
                shadow-md
                p-5
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-1
                ">

                  <div className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white/20
                    text-white
                    flex
                    items-center
                    justify-center
                  ">
                    <FaClock size={13} />
                  </div>

                  <h2 className="
                    text-sm
                    font-bold
                    text-white
                  ">
                    Aging Piutang
                  </h2>

                </div>

                <p className="
                  text-[11px]
                  text-white/70
                  mb-4
                ">
                  Distribusi saldo berdasarkan umur piutang
                </p>

                <div className="space-y-3">

                  {agingSummary.map((item, index) => (

                    <div key={item.label}>

                      <div className="
                        flex
                        items-center
                        justify-between
                        mb-1
                      ">

                        <span className="
                          text-[11px]
                          font-medium
                          text-white/80
                        ">
                          {item.label}
                        </span>

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <span className="
                            text-[11px]
                            font-semibold
                            text-white
                          ">
                            {formatShortRupiah(item.value)}
                          </span>

                          <span className="
                            w-10
                            text-right
                            text-[10px]
                            font-bold
                            text-white
                          ">
                            {item.percentage.toFixed(1)}%
                          </span>

                        </div>

                      </div>

                      <div className="
                        h-2
                        bg-white/20
                        rounded-full
                        overflow-hidden
                      ">

                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                            ${index <= 2
                              ? 'bg-white'
                              : index <= 4
                                ? 'bg-yellow-300'
                                : 'bg-red-300'
                            }
                          `}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>


            {/* =================================================
                CHART ROW 2
            ================================================= */}

            <div className="
              grid
              grid-cols-1
              xl:grid-cols-3
              gap-5
              mb-5
            ">


              {/* PERFORMA PIUTANG DINAMIS */}

              <div className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                p-5
                xl:col-span-2
              ">

                <div className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-start
                  md:justify-between
                  gap-3
                  mb-1
                ">

                  <div className="
                    flex
                    items-start
                    gap-2
                  ">

                    <div className="
                      w-8
                      h-8
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      shrink-0
                    ">
                      {currentPerformanceConfig.icon}
                    </div>


                    <div>

                      <h2 className="
                        text-sm
                        font-bold
                        text-gray-800
                      ">
                        Performa Piutang per{' '}
                        {currentPerformanceConfig.label}
                      </h2>


                      <p className="
                        text-[11px]
                        text-gray-400
                        mt-1
                      ">
                        Perbandingan piutang, collection dan saldo berdasarkan{' '}
                        {currentPerformanceConfig.label.toLowerCase()}
                      </p>

                    </div>

                  </div>


                  <div className="
                    flex
                    items-center
                    gap-2
                    shrink-0
                  ">

                    <span className="
                      text-[10px]
                      font-semibold
                      text-gray-400
                      whitespace-nowrap
                    ">
                      Tampilkan per
                    </span>


                    <select
                      value={
                        performanceDimension
                      }
                      onChange={(e) =>
                        setPerformanceDimension(
                          e.target.value
                        )
                      }
                      className="
                        h-9
                        min-w-[145px]
                        px-3
                        pr-8
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        text-xs
                        font-semibold
                        text-gray-700
                        outline-none
                        cursor-pointer
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                        transition
                      "
                    >

                      <option value="produk">
                        Per Produk
                      </option>

                      <option value="principal">
                        Per Principal
                      </option>

                      <option value="channel">
                        Per Channel
                      </option>

                      <option value="customer">
                        Per Customer
                      </option>

                      <option value="cabang">
                        Per Cabang
                      </option>

                    </select>

                  </div>

                </div>


                <div className="
                  w-full
                  overflow-x-auto
                ">

                  <div
                    style={{
                      width: `${Math.max(
                        performanceChartData.length * 120,
                        800
                      )}px`,
                      height: '300px',
                    }}
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={
                          performanceChartData
                        }
                        margin={{
                          top: 10,
                          right: 20,
                          left: 10,
                          bottom:
                            (performanceDimension ===
                              'customer' ||
                              performanceDimension ===
                              'produk')
                              ? 65
                              : 40,
                        }}
                        barCategoryGap={20}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#eef1f6"
                        />


                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 9,
                            fill: '#6b7280',
                          }}
                          interval={0}
                          angle={
                            (performanceDimension ===
                              'customer' ||
                              performanceDimension ===
                              'produk')
                              ? -35
                              : -20
                          }
                          textAnchor="end"
                          height={
                            (performanceDimension ===
                              'customer' ||
                              performanceDimension ===
                              'produk')
                              ? 80
                              : 60
                          }
                        />


                        <YAxis
                          tick={{
                            fontSize: 9,
                            fill: '#9ca3af',
                          }}
                          tickFormatter={
                            formatShortRupiah
                          }
                        />


                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />


                        <Legend
                          wrapperStyle={{
                            fontSize: '10px',
                          }}
                        />


                        <Bar
                          dataKey="piutang"
                          name="Piutang"
                          fill="#2563eb"
                          barSize={32}
                          radius={[
                            4,
                            4,
                            0,
                            0,
                          ]}
                        >
                          <LabelList
                            dataKey="piutang"
                            position="top"
                            formatter={formatShortRupiah}
                            fontSize={9}
                            fill="#2563eb"
                          />
                        </Bar>


                        <Bar
                          dataKey="collection"
                          name="Collection"
                          fill="#60a5fa"
                          barSize={32}
                          radius={[
                            4,
                            4,
                            0,
                            0,
                          ]}
                        >
                          <LabelList
                            dataKey="collection"
                            position="top"
                            formatter={formatShortRupiah}
                            fontSize={9}
                            fill="#2563eb"
                          />
                        </Bar>


                        <Bar
                          dataKey="saldo"
                          name="Saldo Akhir"
                          fill="#f97316"
                          barSize={32}
                          radius={[
                            4,
                            4,
                            0,
                            0,
                          ]}
                        >
                          <LabelList
                            dataKey="saldo"
                            position="top"
                            formatter={formatShortRupiah}
                            fontSize={9}
                            fill="#f97316"
                          />
                        </Bar>

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              </div>


              {/* CHANNEL */}

              <div className="
  bg-white
  rounded-2xl
  border
  border-gray-100
  shadow-sm
  p-5
  xl:col-span-1
">

                <div className="
    flex
    items-center
    gap-2
    mb-1
  ">

                  <div className="
      w-8
      h-8
      rounded-lg
      bg-orange-50
      text-orange-500
      flex
      items-center
      justify-center
    ">
                    <FaHospital size={13} />
                  </div>

                  <h2 className="
      text-sm
      font-bold
      text-gray-800
    ">
                    Outstanding per Channel
                  </h2>

                </div>

                <p className="
    text-[11px]
    text-gray-400
    mb-2
  ">
                  Komposisi saldo berdasarkan kelompok customer
                </p>

                <div className="h-[300px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={customerGroupChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={2}

                        /*
                         * LABEL PERSENTASE DI PIE
                         */
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {

                          const RADIAN = Math.PI / 180;

                          const radius =
                            innerRadius +
                            (outerRadius - innerRadius) * 0.55;

                          const x =
                            cx +
                            radius *
                            Math.cos(-midAngle * RADIAN);

                          const y =
                            cy +
                            radius *
                            Math.sin(-midAngle * RADIAN);

                          return (
                            <g>
                              {/* Background label */}
                              <rect
                                x={x - 18}
                                y={y - 9}
                                width={36}
                                height={18}
                                rx={6}
                                fill="rgba(0,0,0,0.45)"
                              />

                              {/* Persentase */}
                              <text
                                x={x}
                                y={y}
                                fill="#ffffff"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={9}
                                fontWeight={700}
                              >
                                {`${(percent * 100).toFixed(1)}%`}
                              </text>
                            </g>
                          );
                        }}

                        labelLine={false}
                      >

                        {customerGroupChartData.map(
                          (_, index) => (

                            <Cell
                              key={index}
                              fill={
                                chartColors[
                                index %
                                chartColors.length
                                ]
                              }
                            />

                          )
                        )}

                      </Pie>

                      <Tooltip
                        content={
                          <CustomTooltip />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"

                        wrapperStyle={{
                          fontSize: "10px",
                          paddingTop: "5px",
                        }}

                        /*
                         * LEGEND + PERSENTASE
                         */
                        formatter={(value, entry) => {

                          const total =
                            customerGroupChartData.reduce(
                              (sum, item) =>
                                sum + Number(item.value || 0),
                              0
                            );

                          const currentValue =
                            Number(entry?.payload?.value || 0);

                          const percentage =
                            total > 0
                              ? (
                                (currentValue / total) *
                                100
                              ).toFixed(1)
                              : "0.0";

                          return (
                            <span className="
                text-[10px]
                text-gray-600
                font-medium
              ">
                              {value}{" "}
                              <span className="
                  text-gray-400
                  font-semibold
                ">
                                ({percentage}%)
                              </span>
                            </span>
                          );
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>


            {/* =================================================
                COLLECTION BY PRINCIPAL
            ================================================= */}

            <div className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-5
              mb-5
            ">

              <div className="
  bg-white
  rounded-2xl
  border
  border-gray-100
  shadow-sm
  p-5
">

                <div className="
    flex
    flex-col
    md:flex-row
    md:items-start
    md:justify-between
    gap-3
    mb-1
  ">

                  <div className="
      flex
      items-start
      gap-2
    ">

                    <div className="
        w-8
        h-8
        rounded-lg
        bg-emerald-50
        text-emerald-600
        flex
        items-center
        justify-center
        shrink-0
      ">
                      {currentCollectionConfig.icon}
                    </div>

                    <div>

                      <h2 className="
          text-sm
          font-bold
          text-gray-800
        ">
                        Collection by{' '}
                        {currentCollectionConfig.label}
                      </h2>

                      <p className="
          text-[11px]
          text-gray-400
          mt-1
        ">
                        Total collection berdasarkan{' '}
                        {currentCollectionConfig.label.toLowerCase()}
                      </p>

                    </div>

                  </div>

                  {/* DROPDOWN */}

                  <div className="
      flex
      items-center
      gap-2
      shrink-0
    ">

                    <span className="
        text-[10px]
        font-semibold
        text-gray-400
        whitespace-nowrap
      ">
                      Tampilkan per
                    </span>

                    <select
                      value={
                        collectionDimension
                      }
                      onChange={(e) =>
                        setCollectionDimension(
                          e.target.value
                        )
                      }
                      className="
          h-9
          min-w-[145px]
          px-3
          pr-8
          rounded-xl
          border
          border-gray-200
          bg-white
          text-xs
          font-semibold
          text-gray-700
          outline-none
          cursor-pointer
          focus:border-emerald-400
          focus:ring-2
          focus:ring-emerald-100
          transition
        "
                    >

                      <option value="principal">
                        Per Principal
                      </option>

                      <option value="channel">
                        Per Channel
                      </option>

                      <option value="customer">
                        Per Customer
                      </option>

                    </select>

                  </div>

                </div>

                {/* COLLECTION CHART */}

                <div className="
    w-full
    overflow-x-auto
    mt-2
  ">

                  <div
                    style={{
                      width: `${Math.max(
                        collectionChartData.length * 80,
                        500
                      )}px`,
                      height: "400px",
                    }}
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={collectionChartData}
                        margin={{
                          top: 15,
                          right: 20,
                          left: 10,
                          bottom:
                            collectionDimension === "customer"
                              ? 40.
                              : 40,
                        }}
                        barCategoryGap={0}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#eef1f6"
                        />

                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 9,
                            fill: "#6b7280",
                          }}
                          interval={0}
                          angle={
                            collectionDimension === "customer"
                              ? -35
                              : -20
                          }
                          textAnchor="end"
                          height={
                            collectionDimension === "customer"
                              ? 85
                              : 60
                          }
                        />

                        <YAxis
                          tick={{
                            fontSize: 9,
                            fill: "#9ca3af",
                          }}
                          tickFormatter={formatShortRupiah}
                        />

                        <Tooltip
                          content={<CustomTooltip />}
                        />

                        <Bar
                          dataKey="collection"
                          name="Collection"
                          barSize={38}

                          radius={[6, 6, 0, 0]}
                        >

                          <LabelList
                            dataKey="collection"
                            position="top"
                            formatter={formatShortRupiah}
                            fontSize={9}
                            fill="#374151"
                          />

                          {collectionChartData.map(
                            (entry, index) => {

                              const colors = [
                                "#3B82F6",
                                "#F59E0B",
                                "#EF4444",
                                "#8B5CF6",
                                "#EC4899",
                                "#06B6D4",
                                "#F97316",
                                "#6366F1",
                                "#A855F7",
                                "#E11D48",
                              ];

                              return (
                                <Cell
                                  key={`collection-cell-${index}`}
                                  fill={
                                    colors[
                                    index % colors.length
                                    ]
                                  }
                                />
                              );

                            }
                          )}

                        </Bar>

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              </div>


              {/* TOP PIUTANG BY PRINCIPAL */}

              <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              shadow-sm
              p-5
            ">

                <div className="flex items-center gap-2 mb-1">
                  <div className="
                  w-8
                  h-8
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                ">
                    <FaFileInvoiceDollar size={13} />
                  </div>

                  <h2 className="text-sm font-bold text-gray-800">
                    Top Piutang by Principal
                  </h2>
                </div>

                <p className="text-[11px] text-gray-400 mb-3">
                  Saldo piutang seluruh principal, diurutkan dari terbesar
                </p>

                <div className="h-[300px] overflow-y-auto pr-2 space-y-2">
                  {topPiutangPrincipalData.map((item, index) => (
                    <div
                      key={item.name}
                      className="rounded-xl border border-gray-100 p-3 hover:shadow-sm transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="
                          w-7
                          h-7
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          flex
                          items-center
                          justify-center
                          shrink-0
                          text-[10px]
                          font-bold
                        ">
                            {index + 1}
                          </div>

                          <span className="text-xs font-semibold text-gray-700 truncate">
                            {item.name}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                            {formatShortRupiah(item.value)}
                          </p>
                          <p className="text-[10px] font-semibold text-blue-600">
                            {item.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>


            {false && (<>
              {/* =================================================
                TABLE TABS
            ================================================= */}

              <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              shadow-sm
              p-2
              mb-4
            ">

                <div className="
                grid
                grid-cols-2
                md:grid-cols-5
                gap-2
              ">

                  {/* PER PRINCIPAL */}

                  <button
                    onClick={() =>
                      setActiveTable(
                        'principal'
                      )
                    }
                    className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    py-2.5
                    text-xs
                    font-bold
                    transition
                    ${activeTable ===
                        'principal'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }
                  `}
                  >

                    <FaBuilding size={12} />

                    Per Principal

                  </button>


                  {/* PER CABANG */}

                  <button
                    onClick={() =>
                      setActiveTable(
                        'cabang'
                      )
                    }
                    className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    py-2.5
                    text-xs
                    font-bold
                    transition
                    ${activeTable ===
                        'cabang'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }
                  `}
                  >

                    <FaBuilding size={12} />

                    Per Cabang

                  </button>


                  {/* PER CHANNEL */}

                  <button
                    onClick={() =>
                      setActiveTable(
                        'channel'
                      )
                    }
                    className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    py-2.5
                    text-xs
                    font-bold
                    transition
                    ${activeTable ===
                        'channel'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }
                  `}
                  >

                    <FaHospital size={12} />

                    Per Channel

                  </button>


                  {/* PER CUSTOMER */}

                  <button
                    onClick={() =>
                      setActiveTable(
                        'customer'
                      )
                    }
                    className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    py-2.5
                    text-xs
                    font-bold
                    transition
                    ${activeTable ===
                        'customer'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }
                  `}
                  >

                    <FaUsers size={12} />

                    Per Customer

                  </button>


                  {/* PER PRODUK */}

                  <button
                    onClick={() =>
                      setActiveTable(
                        'produk'
                      )
                    }
                    className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    py-2.5
                    text-xs
                    font-bold
                    transition
                    ${activeTable ===
                        'produk'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }
                  `}
                  >

                    <FaBoxOpen size={12} />

                    Per Produk

                  </button>

                </div>

              </div>


              {/* =================================================
                DETAIL TABLE
            ================================================= */}

              {activeTable ===
                'principal' && (

                  <AgingTable
                    title="Per Principal"
                    icon={
                      <FaBuilding
                        size={15}
                      />
                    }
                    data={buildAgingData(
                      filteredData,
                      'principal'
                    )}
                  />

                )}


              {activeTable ===
                'cabang' && (

                  <AgingTable
                    title="Per Cabang"
                    icon={
                      <FaBuilding
                        size={15}
                      />
                    }
                    data={buildAgingData(
                      filteredData,
                      'cabang'
                    )}
                  />

                )}


              {activeTable ===
                'channel' && (

                  <AgingTable
                    title="Per Channel"
                    icon={
                      <FaHospital
                        size={15}
                      />
                    }
                    data={buildAgingData(
                      filteredData,
                      'channel'
                    )}
                  />

                )}


              {activeTable ===
                'customer' && (

                  <AgingTable
                    title="Per Customer"
                    icon={
                      <FaUsers
                        size={15}
                      />
                    }
                    data={buildAgingData(
                      filteredData,
                      'customer'
                    )}
                  />

                )}


              {/* PER PRODUK */}

              {activeTable ===
                'produk' && (

                  <ProdukTable
                    data={
                      filteredProdukData
                    }
                  />

                )}

            </>)}

          </>

        )}

        {/* =================================================
    COLLECTIONS BY METODE PEMBAYARAN
================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FaMoneyBillWave size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Collections By Metode Pembayaran
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Total collection berdasarkan metode pembayaran
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-slate-400">
                Total Collection
              </p>

              <p className="text-base font-bold text-emerald-600">
                {formatRupiah(
                  collectionByMetodeData.reduce(
                    (total, item) => total + item.collection,
                    0
                  )
                )}
              </p>
            </div>

          </div>

          <div className="w-full h-[320px]">

            {collectionByMetodeData.length > 0 ? (

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={collectionByMetodeData}
                  margin={{
                    top: 25,
                    right: 20,
                    left: 10,
                    bottom: 35,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                    tick={{
                      fontSize: 10,
                      fill: "#64748b",
                    }}
                    axisLine={{
                      stroke: "#cbd5e1",
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatShortRupiah}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value) => [
                      formatRupiah(value),
                      "Collection",
                    ]}
                  />

                  <Bar
                    dataKey="collection"
                    name="Collection"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={64}
                  >

                    {collectionByMetodeData.map(
                      (entry, index) => (
                        <Cell
                          key={`metode-${entry.name}-${index}`}
                          fill={[
                            "#2563eb",
                            "#10b981",
                            "#f59e0b",
                            "#8b5cf6",
                            "#06b6d4",
                            "#f43f5e",
                          ][index % 6]}
                        />
                      )
                    )}

                    <LabelList
                      dataKey="collection"
                      position="top"
                      formatter={formatShortRupiah}
                      style={{
                        fontSize: 9,
                        fill: "#475569",
                        fontWeight: 600,
                      }}
                    />

                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="h-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">

                <FaMoneyBillWave
                  size={28}
                  className="text-slate-300 mb-3"
                />

                <p className="text-sm font-semibold text-slate-500">
                  Data metode pembayaran belum tersedia
                </p>

                <p className="text-xs text-slate-400 mt-1 max-w-lg">
                  Periksa respons API Detail Piutang.
                  Data harus berisi collections_per_metode
                  dengan nama metode pembayaran dan nominal collection.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="
          flex
          flex-col
          sm:flex-row
          items-center
          justify-center
          gap-2
          py-7
          text-[10px]
          text-gray-400
        ">

          <span className="
            font-bold
            text-blue-600
          ">
            KFCOLLS
          </span>


          <span className="
            hidden
            sm:block
          ">
            •
          </span>


          <span>
            Sales & Account Receivable Dashboard
          </span>

        </div>

      </div>

    </div>

  );

};


export default Dashboard;