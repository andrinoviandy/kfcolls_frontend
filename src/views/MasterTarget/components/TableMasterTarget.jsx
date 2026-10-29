import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSearch, FaFilter, FaCalendarAlt, FaBuilding, FaFileInvoiceDollar,
  FaMoneyBillWave, FaChartLine, FaEye, FaTimes, FaClipboardList,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import { swal } from "global/helper/swal";
import storeSchema from "global/store";

const FilterOption = (props) => (
  <selectComponents.Option {...props}>
    <input type="checkbox" checked={props.isSelected} readOnly className="checkbox checkbox-primary checkbox-xs mr-2" />
    {props.label}
  </selectComponents.Option>
);
const FilterMultiValue = () => null;
const FilterValueContainer = ({ children, ...props }) => {
  const count = props.getValue().length;
  return <selectComponents.ValueContainer {...props}>{count ? `${count} dipilih` : children[0]}{children[1]}</selectComponents.ValueContainer>;
};
const filterSelectComponents = { Option: FilterOption, MultiValue: FilterMultiValue, ValueContainer: FilterValueContainer };
const filterSelectStyles = {
  control: (base, state) => ({ ...base, minHeight: 36, borderRadius: 9999, borderColor: state.isFocused ? "#2563eb" : "#d1d5db", boxShadow: "none", fontSize: "0.875rem", ":hover": { borderColor: "#2563eb" } }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 36 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};
const selectedOptions = (options, values) => options.filter((option) => values.some((value) => String(value) === String(option.value)));
const numberValue = (value) => Number(value || 0);
const formatNumber = (value) => new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(numberValue(value));
const formatRupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(numberValue(value));
const formatCompactRupiah = (value) => {
  const amount = numberValue(value);
  if (Math.abs(amount) >= 1e9) return `Rp ${formatNumber(amount / 1e9)} M`;
  if (Math.abs(amount) >= 1e6) return `Rp ${formatNumber(amount / 1e6)} Juta`;
  return formatRupiah(amount);
};
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};
const display = (value) => value === null || value === undefined || value === "" ? "-" : value;
const field = (item, ...keys) => {
  for (const key of keys) if (item?.[key] !== undefined && item?.[key] !== null) return item[key];
  return "";
};
const dateKeys = new Set(["posting_date", "document_date", "net_due_date", "created_at", "updated_at", "periode"]);
const moneyKeys = new Set(["amount", "nilai_aging_periode", "nilai_aging_top_periode", "target_cabang"]);
const columns = [
  ["periode", "Periode"], ["company_code", "Company Code"], ["plant", "Plant"],
  ["profit_center_desc", "Profit Center Desc."], ["document_no", "Document No"],
  ["posting_date", "Posting Date"], ["document_type", "Document Type"],
  ["billing_no", "Billing No"], ["customer_no", "Customer No"], ["customer_name", "Customer Name"],
  ["lini_i", "Lini I"], ["lini_ii", "Lini II"], ["document_date", "Document Date"],
  ["amount", "Amount"], ["net_due_date", "Net Due Date"], ["text_information", "Text Information"],
  ["top", "TOP"], ["aging_standar", "Aging Standar"], ["nilai_aging_periode", "Nilai Aging Periode"],
  ["aging_top", "Aging TOP"], ["nilai_aging_top_periode", "Nilai Aging TOP Periode"],
  ["ket_target_cabang", "Ket. Target Cabang"], ["target_cabang", "Target Cabang"],
];

const TableMasterTarget = ({ dimensionScreenW, check, loginAccess, reloadData, setReloadData }) => {
  const [tableData, setTableData] = useState([]);
  const [options, setOptions] = useState({ cabang: [], channel: [], principle: [] });
  const [customerOptions, setCustomerOptions] = useState([]);
  const [summaryData, setSummaryData] = useState({ total_data: 0, total_amount: 0, total_target_cabang: 0, total_aging_standar: 0, total_aging_top: 0 });
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterSalesOffice, setFilterSalesOffice] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [filterCustomerGroup, setFilterCustomerGroup] = useState([]);
  const [filterPrinciple, setFilterPrinciple] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    let active = true;
    const loadReferences = async () => {
      try {
        const actions = storeSchema?.actions || {};
        const [refCabang, refChannel, principleRes] = await Promise.all([
          typeof actions.getReferensiByJenis === "function"
            ? actions.getReferensiByJenis("cabang_id")
            : Promise.resolve({ status: false, data: [] }),
          typeof actions.getReferensiByJenis === "function"
            ? actions.getReferensiByJenis("channel_id")
            : Promise.resolve({ status: false, data: [] }),
          typeof actions.getListPrinciple === "function"
            ? actions.getListPrinciple({ page: 1, limit: 9999, sortBy: "ASC" })
            : Promise.resolve({ status: false, data: { list_data: [] } }),
        ]);
        if (!active) return;
        setOptions((prev) => ({
          ...prev,
          cabang: refCabang?.status ? (refCabang.data || []).map((x) => ({ label: x.ur_ref, value: x.kd_ref })) : [],
          channel: refChannel?.status ? (refChannel.data || []).map((x) => ({ label: x.ur_ref, value: x.kd_ref })) : [],
          principle: principleRes?.status ? (principleRes.data?.list_data || []).map((x) => ({ label: x.nama_principle, value: x.principle })) : [],
        }));
      } catch (error) { console.error("Gagal memuat referensi Master Target:", error); }
    };
    loadReferences();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadCustomers = async () => {
      if (!filterSalesOffice.length) { setCustomerOptions([]); setFilterCustomer([]); return; }
      try {
        setLoadingCustomer(true);
        if (typeof storeSchema?.actions?.getDataPelanggan !== "function") {
          throw new Error("Action getDataPelanggan belum tersedia di global/store.");
        }
        const res = await storeSchema.actions.getDataPelanggan({ page: 1, limit: 9999, cabang_id: filterSalesOffice });
        if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data customer");
        const data = Array.isArray(res.data) ? res.data : (res.data?.list_data || res.data?.data || res.data?.rows || []);
        const mapped = data.map((item) => {
          const code = item?.kode_customer;
          if (code === null || code === undefined || String(code).trim() === "") return null;
          return { label: `${code}${item?.name ? ` - ${item.name}` : ""}`, value: code };
        }).filter(Boolean);
        if (active) {
          setCustomerOptions(mapped);
          setFilterCustomer((prev) => prev.filter((value) => mapped.some((x) => String(x.value) === String(value))));
        }
      } catch (error) {
        console.error("Gagal mengambil customer:", error);
        if (active) { setCustomerOptions([]); setFilterCustomer([]); }
      } finally { if (active) setLoadingCustomer(false); }
    };
    loadCustomers();
    return () => { active = false; };
  }, [filterSalesOffice]);

  const getMasterTarget = useCallback(async () => {
    try {
      setLoading(true);
      // Tambahkan action getMasterTarget pada global/store dengan payload berikut.
      if (typeof storeSchema?.actions?.getMasterTarget !== "function") {
        throw new Error("Action getMasterTarget belum tersedia di global/store.");
      }
      const payload = {
        page: currentPage, limit: perPage, keyword: searchKeyword,
        cabang_id: filterSalesOffice.length ? filterSalesOffice : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        channel: filterCustomerGroup.length ? filterCustomerGroup : "ALL",
        principle: filterPrinciple.length ? filterPrinciple : "ALL",
        start_date: filterStartDate, end_date: filterEndDate, periode: filterPeriode || "ALL",
      };
      const res = await storeSchema.actions.getMasterTarget(payload);
      if (res?.status !== true) throw new Error(res?.message || "Gagal mengambil data Master Target");
      const response = Array.isArray(res?.data) ? { list_data: res.data } : (res?.data || {});
      const rawRows = response.list_data || response.data || response.rows || [];
      const rows = Array.isArray(rawRows) ? rawRows : [];
      setTableData(rows);
      setTotalData(Number(response.total_data ?? rows.length));
      setTotalPage(Number(response.total_halaman ?? Math.ceil(Number(response.total_data ?? rows.length) / perPage)));
      const summary = response.summary || {};
      setSummaryData({
        total_data: Number(summary.total_data ?? response.total_data ?? rows.length),
        total_amount: numberValue(summary.total_amount ?? rows.reduce((sum, x) => sum + numberValue(x.amount), 0)),
        total_target_cabang: numberValue(summary.total_target_cabang ?? rows.reduce((sum, x) => sum + numberValue(x.target_cabang), 0)),
        total_aging_standar: numberValue(summary.total_aging_standar ?? rows.reduce((sum, x) => sum + numberValue(x.nilai_aging_periode), 0)),
        total_aging_top: numberValue(summary.total_aging_top ?? rows.reduce((sum, x) => sum + numberValue(x.nilai_aging_top_periode), 0)),
      });
    } catch (error) {
      console.error("ERROR GET MASTER TARGET:", error);
      setTableData([]); setTotalData(0); setTotalPage(0);
      setSummaryData({ total_data: 0, total_amount: 0, total_target_cabang: 0, total_aging_standar: 0, total_aging_top: 0 });
      if (error?.message?.includes("belum tersedia di global/store")) {
        console.error(error.message);
      } else {
        await swal.error(error?.message || "Gagal mengambil data Master Target");
      }
    } finally { setLoading(false); }
  }, [currentPage, perPage, searchKeyword, filterSalesOffice, filterCustomer, filterCustomerGroup, filterPrinciple, filterStartDate, filterEndDate, filterPeriode]);

  useEffect(() => { getMasterTarget(); }, [getMasterTarget]);
  useEffect(() => {
    if (!reloadData) return;
    if (currentPage !== 1) setCurrentPage(1); else getMasterTarget();
    setReloadData?.(false);
  }, [reloadData, currentPage, getMasterTarget, setReloadData]);

  const salesOfficeOptions = useMemo(() => options.cabang || [], [options.cabang]);
  const customerGroupOptions = useMemo(() => options.channel || [], [options.channel]);
  const principleOptions = useMemo(() => options.principle || [], [options.principle]);
  const handleSearch = () => { setCurrentPage(1); setSearchKeyword(keyword.trim()); };
  const resetFilter = () => {
    setKeyword(""); setSearchKeyword(""); setFilterSalesOffice([]); setFilterCustomer([]);
    setCustomerOptions([]); setFilterCustomerGroup([]); setFilterPrinciple([]);
    setFilterStartDate(""); setFilterEndDate(""); setFilterPeriode(""); setCurrentPage(1);
  };
  const formatCell = (key, value) => {
    if (value === null || value === undefined || value === "") return "-";
    if (dateKeys.has(key)) return formatDate(value);
    if (moneyKeys.has(key)) return formatRupiah(value);
    if (["aging_standar", "aging_top", "top"].includes(key)) return formatNumber(value);
    return String(value);
  };
  const startIndex = totalData ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex = Math.min(currentPage * perPage, totalData);

  return (
    <div className="flex flex-col gap-5">
      {/* SEARCH DAN FILTER: tetap dipertahankan */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-gray-400" />
            <input type="text" placeholder="Cari periode / billing / customer / document..." className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm focus:outline-none focus:ring-0" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <button type="button" onClick={handleSearch} title="Cari" aria-label="Cari" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90"><FaSearch /></button>
          </div>
          <button type="button" onClick={resetFilter} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"><FaFilter /> Reset Filter</button>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full min-w-[190px] sm:w-[220px]"><label className="mb-1 block text-xs font-medium text-gray-600">Cabang</label><Select isMulti options={salesOfficeOptions} value={selectedOptions(salesOfficeOptions, filterSalesOffice)} onChange={(v) => { setCurrentPage(1); setFilterSalesOffice((v || []).map((x) => x.value)); }} placeholder="Semua Cabang" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full min-w-[180px] sm:w-[210px]"><label className="mb-1 block text-xs font-medium text-gray-600">Channel</label><Select isMulti options={customerGroupOptions} value={selectedOptions(customerGroupOptions, filterCustomerGroup)} onChange={(v) => { setCurrentPage(1); setFilterCustomerGroup((v || []).map((x) => x.value)); }} placeholder="Semua Channel" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full min-w-[180px] sm:w-[210px]"><label className="mb-1 block text-xs font-medium text-gray-600">Principle</label><Select isMulti options={principleOptions} value={selectedOptions(principleOptions, filterPrinciple)} onChange={(v) => { setCurrentPage(1); setFilterPrinciple((v || []).map((x) => x.value)); }} placeholder="Semua Principle" closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full min-w-[180px] sm:w-[210px]"><label className="mb-1 block text-xs font-medium text-gray-600">Customer</label><Select isMulti isDisabled={!filterSalesOffice.length || loadingCustomer} isLoading={loadingCustomer} options={customerOptions} value={selectedOptions(customerOptions, filterCustomer)} onChange={(v) => { setCurrentPage(1); setFilterCustomer((v || []).map((x) => x.value)); }} placeholder={!filterSalesOffice.length ? "Pilih cabang dahulu" : loadingCustomer ? "Memuat customer..." : "Pilih Customer"} closeMenuOnSelect={false} hideSelectedOptions={false} components={filterSelectComponents} styles={filterSelectStyles} /></div>
          <div className="w-full sm:w-[180px]"><label className="mb-1 block text-xs font-medium text-gray-600">Periode</label><input type="month" value={filterPeriode} onChange={(e) => { setCurrentPage(1); setFilterPeriode(e.target.value); }} className="h-9 w-full rounded-full border border-gray-300 bg-white px-3 text-sm text-gray-600" /></div>
          <div className="w-full sm:w-auto"><label className="mb-1 block text-xs font-medium text-gray-600">Posting Date</label><div className="flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 shadow-sm"><FaCalendarAlt className="text-primary text-sm" /><input type="date" value={filterStartDate} max={filterEndDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterStartDate(e.target.value); }} className="w-[125px] bg-transparent text-sm outline-none" title="Tanggal mulai" /><span className="text-gray-300">-</span><input type="date" value={filterEndDate} min={filterStartDate || undefined} onChange={(e) => { setCurrentPage(1); setFilterEndDate(e.target.value); }} className="w-[125px] bg-transparent text-sm outline-none" title="Tanggal akhir" /></div></div>
        </div>
      </div>

      {/* SUMMARY CARDS MASTER TARGET */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 xl:grid-cols-3">
        <SummaryCard title="Total Data" value={formatNumber(summaryData.total_data)} icon={<FaClipboardList />} color="blue" />
        <SummaryCard title="Total Amount" value={formatCompactRupiah(summaryData.total_amount)} icon={<FaMoneyBillWave />} color="purple" />
        <SummaryCard title="Target Cabang" value={formatCompactRupiah(summaryData.total_target_cabang)} icon={<FaBuilding />} color="green" />
        {/* <SummaryCard title="Nilai Aging Standar" value={formatCompactRupiah(summaryData.total_aging_standar)} icon={<FaChartLine />} color="orange" />
        <SummaryCard title="Nilai Aging TOP" value={formatCompactRupiah(summaryData.total_aging_top)} icon={<FaFileInvoiceDollar />} color="teal" /> */}
      </div>

      {/* TABLE */}
      <div className={dimensionScreenW < 768 && check ? "bringToBack" : ""}>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="relative max-h-[65vh] overflow-auto">
            {loading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"><div className="flex flex-col items-center gap-3"><span className="loading loading-spinner loading-lg text-primary" /><span className="text-sm text-gray-600">Memuat Master Target...</span></div></div>}
            <table className="table w-full">
              <thead className="sticky top-0 z-10 bg-primary text-[13px] text-white"><tr><th className="whitespace-nowrap px-4 py-3">Aksi</th>{columns.map(([key, label]) => <th key={key} className="whitespace-nowrap px-4 py-3">{label}</th>)}</tr></thead>

              <tbody>
                {!Array.isArray(tableData) || tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="py-16 text-center text-gray-500"
                    >
                      <FaClipboardList className="mx-auto mb-3 text-4xl text-gray-300" />
                      Tidak ada data Master Target
                    </td>
                  </tr>
                ) : (
                  tableData.map((item, index) => {
                    // Pastikan setiap item berupa object
                    const row =
                      item && typeof item === "object" && !Array.isArray(item)
                        ? item
                        : {};

                    const rowKey =
                      row.id ??
                      row.billing_no ??
                      row.document_no ??
                      `target-${index}`;

                    return (
                      <tr
                        key={rowKey}
                        className="border-b transition hover:bg-blue-50"
                      >
                        {/* AKSI */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedData(row)}
                            title="Lihat detail"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <FaEye />
                          </button>
                        </td>

                        {/* DATA KOLOM */}
                        {columns.map(([key, label]) => {
                          let value = "-";

                          try {
                            value = field(row, key);
                            value = formatCell(key, value);
                          } catch (error) {
                            console.error(
                              `Error render kolom "${key}":`,
                              error
                            );
                            value = "-";
                          }

                          const rawValue = row[key];

                          return (
                            <td
                              key={key}
                              className="whitespace-nowrap px-4 py-3 text-sm text-gray-700"
                            >
                              <span
                                className={
                                  moneyKeys.has(key)
                                    ? "font-semibold"
                                    : ""
                                }
                                title={String(display(rawValue))}
                              >
                                {value === null ||
                                  value === undefined ||
                                  value === ""
                                  ? "-"
                                  : String(value)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 bg-slate-50 px-5 py-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap items-center gap-5"><div className="text-sm text-gray-600">Menampilkan <span className="font-semibold">{startIndex}</span> sampai <span className="font-semibold">{endIndex}</span> dari <span className="font-semibold">{totalData}</span> data</div><div className="flex items-center gap-2"><span className="text-sm text-gray-600">Baris:</span><select className="select select-bordered select-sm rounded-full bg-white" value={perPage} onChange={(e) => { setCurrentPage(1); setPerPage(Number(e.target.value)); }}><option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select></div></div>{totalPage > 0 && <ReactPaginate breakLabel="..." previousLabel="←" nextLabel="→" pageCount={totalPage} onPageChange={(e) => setCurrentPage(e.selected + 1)} forcePage={Math.min(currentPage - 1, Math.max(totalPage - 1, 0))} className="flex items-center gap-2" activeClassName="!border-primary !bg-primary !text-white" pageClassName="flex h-9 min-w-9 items-center justify-center rounded-full border border-gray-300 bg-white transition hover:bg-blue-50" pageLinkClassName="flex h-full w-full items-center justify-center" previousClassName="h-9 min-w-9 rounded-full border border-gray-300 bg-white" nextClassName="h-9 min-w-9 rounded-full border border-gray-300 bg-white" previousLinkClassName="flex h-full w-full items-center justify-center" nextLinkClassName="flex h-full w-full items-center justify-center" breakClassName="px-2 text-gray-500" disabledClassName="cursor-not-allowed opacity-50" />}</div></div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedData && <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setSelectedData(null)}><div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="sticky top-0 z-20 flex items-center justify-between bg-primary px-6 py-4 text-white"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><FaFileInvoiceDollar /></div><div><h3 className="text-lg font-bold">Detail Master Target</h3><p className="text-xs text-blue-100">Billing No: {display(selectedData.billing_no)}</p></div></div><button type="button" onClick={() => setSelectedData(null)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"><FaTimes /></button></div><div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">{columns.map(([key, label]) => <div key={key} className="rounded-xl border border-gray-100 bg-gray-50 p-3"><p className="mb-1 text-xs text-gray-400">{label}</p><p className="break-words font-semibold text-gray-700">{formatCell(key, field(selectedData, key))}</p></div>)}</div><div className="sticky bottom-0 flex justify-end border-t bg-gray-50 px-5 py-4"><button type="button" onClick={() => setSelectedData(null)} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Tutup</button></div></div></div>}
    </div>
  );
};

function SummaryCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-700", purple: "bg-purple-50 border-purple-100 text-purple-700",
    green: "bg-green-50 border-green-100 text-green-700", orange: "bg-orange-50 border-orange-100 text-orange-700",
    teal: "bg-teal-50 border-teal-100 text-teal-700",
  };
  return <div className={`rounded-2xl border p-4 ${colors[color] || colors.blue}`}><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-sm opacity-90">{title}</p><p className="mt-1 break-words text-xl font-bold">{value}</p></div><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-lg">{icon}</div></div></div>;
}

export default TableMasterTarget;
