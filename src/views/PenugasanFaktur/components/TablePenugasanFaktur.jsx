import React, { useEffect, useMemo, useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaCheckDouble,
  FaClipboardList,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaFilter,
  FaMapMarkerAlt,
  FaUser,
  FaRoute,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaClock,
  FaExclamationCircle,
  FaCheck,
  FaEye,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import Select, { components as selectComponents } from "react-select";
import { swal } from "global/helper/swal";
import storeSchema from "global/store";

const FilterOption = (props) => (
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
const FilterMultiValue = () => null;
const FilterValueContainer = ({ children, ...props }) => {
  const selectedCount = props.getValue().length;
  return (
    <selectComponents.ValueContainer {...props}>
      {selectedCount > 0 ? `${selectedCount} dipilih` : children[0]}
      {children[1]}
    </selectComponents.ValueContainer>
  );
};
const filterSelectComponents = {
  Option: FilterOption,
  MultiValue: FilterMultiValue,
  ValueContainer: FilterValueContainer,
};
const filterSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    borderRadius: 9999,
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
    boxShadow: "none",
    fontSize: ".875rem",
    ":hover": { borderColor: "#2563eb" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  indicatorsContainer: (base) => ({ ...base, height: 36 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};
const getSelectedFilterOptions = (options, selectedValues) =>
  options.filter((option) => selectedValues.includes(option.value));
const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
const formatNumber = (value) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
    Number(value) || 0
  );
const firstValue = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "")
      return item[key];
  }
  return null;
};
const getId = (item) => firstValue(item, "piutang_id", "id", "faktur_id");
const getCustomer = (item) => item?.nama_customer || "-";
const getCabang = (item) => item?.nama_cabang || "-";
const getDocumentDate = (item) =>
  firstValue(
    item,
    "document_date",
    "documentDate",
    "posting_date",
    "tanggal_faktur",
    "tanggal"
  ) || null;
const getStatus = (item) => {
  const hasTukarFaktur = Boolean(
    firstValue(
      item,
      "tukar_faktur_nama",
      "tukar_faktur_nip",
      "tukar_faktur_assigned_at",
      "tukar_faktur_id",
      "faktur_petugas_tukar_faktur_id"
    )
  );
  const hasPenagihan = Boolean(
    firstValue(
      item,
      "penagihan_nama",
      "penagihan_nip",
      "penagihan_assigned_at",
      "penagihan_id",
      "faktur_petugas_penagihan_id"
    )
  );

  if (hasTukarFaktur || hasPenagihan) return "SUDAH_DITUGASKAN";

  const raw = String(
    firstValue(item, "status_penugasan", "status", "assignment_status") || ""
  ).toUpperCase();

  return raw.includes("SUDAH") ||
    (raw.includes("DITUGASKAN") && raw !== "BELUM_DITUGASKAN")
    ? "SUDAH_DITUGASKAN"
    : "BELUM_DITUGASKAN";
};
const getTukarFakturNama = (item) =>
  firstValue(item, "tukar_faktur_nama", "nama_petugas_tukar_faktur", "tukar_faktur_petugas_nama", "tukar_faktur_nip", "nip_tukar_faktur");
const getTukarFakturNip = (item) =>
  firstValue(item, "tukar_faktur_nip", "nip_tukar_faktur", "tukar_faktur_petugas_nip");
const getTukarFakturAssignedAt = (item) =>
  firstValue(item, "tukar_faktur_assigned_at", "assigned_at_tukar_faktur", "tukar_faktur_tanggal_penugasan");
const getPenagihanNama = (item) =>
  firstValue(item, "penagihan_nama", "nama_petugas_penagihan", "penagihan_petugas_nama", "penagihan_nip", "nip_penagihan");
const getPenagihanNip = (item) =>
  firstValue(item, "penagihan_nip", "nip_penagihan", "penagihan_petugas_nip");
const getPenagihanAssignedAt = (item) =>
  firstValue(item, "penagihan_assigned_at", "assigned_at_penagihan", "penagihan_tanggal_penugasan");
const normalizeRow = (item, index, page, perPage) => ({
  ...item,
  piutang_id: getId(item),
  no_faktur:
    firstValue(item, "no_faktur", "nomor_faktur", "billing_no", "no_billing") ||
    "-",
  nama_customer: getCustomer(item),
  alamat: firstValue(item, "alamat", "customer_address") || "-",
  cabang_id: item?.cabang,
  cabang: getCabang(item),
  document_date: getDocumentDate(item),
  jatuh_tempo: firstValue(item, "jatuh_tempo", "due_date") || null,
  dpp: Number(firstValue(item, "dpp", "DPP") || 0),
  ppn: Number(firstValue(item, "ppn", "PPN") || 0),
  pph: Number(firstValue(item, "pph", "PPH") || 0),
  total_invoice:
    Number(firstValue(item, "dpp", "DPP") || 0) +
    Number(firstValue(item, "ppn", "PPN") || 0),
  outstanding: Number(
    firstValue(item, "outstanding", "saldo_piutang", "saldo") || 0
  ),
  tukar_faktur_nama: getTukarFakturNama(item),
  tukar_faktur_nip: getTukarFakturNip(item),
  tukar_faktur_assigned_at: getTukarFakturAssignedAt(item),
  penagihan_nama: getPenagihanNama(item),
  penagihan_nip: getPenagihanNip(item),
  penagihan_assigned_at: getPenagihanAssignedAt(item),
  status: getStatus(item),
  No: (page - 1) * perPage + index + 1,
});

const statusConfig = {
  BELUM_DITUGASKAN: {
    label: "Belum Ditugaskan",
    icon: FaClock,
    className: "bg-amber-100 text-amber-700",
  },
  SUDAH_DITUGASKAN: {
    label: "Sudah Ditugaskan",
    icon: FaCheckCircle,
    className: "bg-green-100 text-green-700",
  },
};
const TablePenugasanFaktur = ({
  dimensionScreenW,
  check,
  loginAccess,
  reloadData,
  setReloadData,
}) => {
  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    total_faktur: 0,
    belum_ditugaskan: 0,
    sudah_ditugaskan: 0,
  });
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCabang, setFilterCabang] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedPetugas, setSelectedPetugas] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);
  const [petugasOptions, setPetugasOptions] = useState([]);
  const [loadingPetugas, setLoadingPetugas] = useState(false);

  // History penugasan Tukar Faktur dan Penagihan
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loadingHistoryPenugasan, setLoadingHistoryPenugasan] = useState(false);
  const [historyFaktur, setHistoryFaktur] = useState(null);
  const [historyTukarFaktur, setHistoryTukarFaktur] = useState([]);
  const [historyPenagihan, setHistoryPenagihan] = useState([]);

  const getReferensi = async () => {
    try {
      const refCabang = await storeSchema.actions.getReferensiByJenis(
        "cabang_id"
      );
      if (refCabang?.status === true) {
        setCabangOptions(
          (refCabang?.data || []).map((item) => ({
            label: item?.ur_ref,
            value: item?.kd_ref,
          }))
        );
      }
    } catch (error) {
      console.error("ERROR GET REFERENSI CABANG:", error);
    }
  };
  const loadCustomerOptions = async () => {
    try {
      if (!storeSchema?.actions?.getDataFakturPetugas) return;
      const res = await storeSchema.actions.getDataFakturPetugas({
        page: 1,
        limit: 9999,
        keyword: "",
        sales_office: "ALL",
        customer: "ALL",
        status: "ALL",
        start_date: "",
        end_date: "",
        kegiatan: "ALL",
      });
      if (res?.status === true) {
        const list = res?.data?.list_data || [];
        const unique = [
          ...new Map(
            list.map((item) => {
              const value = firstValue(
                item,
                "customer",
                "nama_customer",
                "customer_name"
              );
              return [
                String(value || ""),
                { label: value || "-", value: value || "" },
              ];
            })
          ).values(),
        ].filter((x) => x.value);
        setCustomerOptions(unique);
      }
    } catch (error) {
      console.error("ERROR GET CUSTOMER OPTIONS:", error);
    }
  };
  useEffect(() => {
    getReferensi();
    loadCustomerOptions();
  }, []);

  const getDataFakturPetugas = async () => {
    try {
      setLoading(true);
      const payload = {
        page: currentPage,
        limit: perPage,
        keyword: searchKeyword,
        sales_office: filterCabang.length ? filterCabang : "ALL",
        customer: filterCustomer.length ? filterCustomer : "ALL",
        status: selectedStatus,
        start_date: filterStartDate,
        end_date: filterEndDate,
        kegiatan: "ALL",
      };
      const res = await storeSchema.actions.getDataFakturPetugas(payload);
      if (res?.status !== true)
        throw new Error(res?.message || "Gagal mengambil data faktur petugas");
      const responseData = res?.data || {};
      const list = responseData?.list_data || [];
      setTableData(
        list.map((item, index) =>
          normalizeRow(item, index, currentPage, perPage)
        )
      );
      setTotalData(Number(responseData?.total_data || 0));
      setTotalPage(Number(responseData?.total_halaman || 0));
      const summary = responseData?.summary || {};
      setSummaryData({
        total_faktur: Number(
          summary?.total_faktur || responseData?.total_data || 0
        ),
        belum_ditugaskan: Number(summary?.belum_ditugaskan || 0),
        sudah_ditugaskan: Number(summary?.sudah_ditugaskan || 0),
      });
    } catch (error) {
      console.error("ERROR GET DATA FAKTUR PETUGAS:", error);
      setTableData([]);
      setTotalData(0);
      setTotalPage(0);
      setSummaryData({
        total_faktur: 0,
        belum_ditugaskan: 0,
        sudah_ditugaskan: 0,
      });
      await swal.error(error?.message || "Gagal mengambil data faktur petugas");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataFakturPetugas();
  }, [
    currentPage,
    perPage,
    searchKeyword,
    filterCabang,
    filterCustomer,
    selectedStatus,
    filterStartDate,
    filterEndDate,
  ]);
  useEffect(() => {
    if (!reloadData) return;
    if (currentPage === 1) getDataFakturPetugas();
    else setCurrentPage(1);
    if (setReloadData) setReloadData(false);
  }, [reloadData]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchKeyword(keyword.trim());
  };
  const resetFilter = () => {
    setKeyword("");
    setSearchKeyword("");
    setFilterCabang([]);
    setFilterCustomer([]);
    setSelectedStatus("ALL");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
    setSelectedIds([]);
    setSelectedCabang(null);
    setSelectedRowData({});
  };
  const handleRefresh = () => {
    setCurrentPage(1);
    if (setReloadData) setReloadData((prev) => !prev);
    else getDataFakturPetugas();
  };
  const selectedRows = selectedIds.map((id) => selectedRowData[id]).filter(Boolean);
  const isFullyAssigned = (item) =>
    Boolean(
      firstValue(
        item,
        "tukar_faktur_nama",
        "tukar_faktur_nip",
        "tukar_faktur_assigned_at",
        "tukar_faktur_id",
        "faktur_petugas_tukar_faktur_id"
      ) &&
        firstValue(
          item,
          "penagihan_nama",
          "penagihan_nip",
          "penagihan_assigned_at",
          "penagihan_id",
          "faktur_petugas_penagihan_id"
        )
    );
  const isSelectable = (item) => Boolean(getId(item)) && !isFullyAssigned(item);
  const currentPageSelectableRows = tableData.filter(
    (item) =>
      isSelectable(item) &&
      (!selectedCabang || getCabang(item) === selectedCabang)
  );
  const currentPageSelectableIds = currentPageSelectableRows.map((item) => getId(item));
  const isAllSelected =
    currentPageSelectableIds.length > 0 &&
    currentPageSelectableIds.every((id) => selectedIds.includes(id));
  const handleSelectOne = (id) => {
    const item = tableData.find((row) => getId(row) === id);
    if (!item || !isSelectable(item)) return;
    const cabang = getCabang(item);
    if (selectedIds.includes(id)) {
      const nextIds = selectedIds.filter((x) => x !== id);
      setSelectedIds(nextIds);
      setSelectedRowData((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (nextIds.length === 0) setSelectedCabang(null);
      return;
    }
    if (selectedCabang && cabang !== selectedCabang) return;
    setSelectedCabang(cabang);
    setSelectedRowData((prev) => ({ ...prev, [id]: item }));
    setSelectedIds((prev) => [...prev, id]);
  };
  const handleSelectAll = () => {};
  const getListPetugas = async (rows = []) => {
    try {
      setLoadingPetugas(true);
      const cabangIds = [
        ...new Set(
          rows
            .map((item) => item?.cabang_id ?? item?.cabang)
            .filter((value) => value !== undefined && value !== null && value !== "")
            .map((value) => String(value))
        ),
      ];
      if (!cabangIds.length) {
        setPetugasOptions([]);
        return;
      }
      const responses = await Promise.all(
        cabangIds.map((cabangId) =>
          storeSchema.actions.getListUserManagement({
            page: 1,
            limit: 9999,
            role_id: "04",
            cabang_id: cabangId,
          })
        )
      );
      const users = responses.flatMap((response) =>
        response?.status === true ? response?.data?.list_data || [] : []
      );
      const uniqueUsers = [
        ...new Map(
          users
            .filter((item) => item?.nip)
            .map((item) => [
              String(item.nip),
              {
                label: `${item?.nama || "-"} - ${item?.nip}`,
                value: item.nip,
                nama: item?.nama || "-",
                nip: item.nip,
              },
            ])
        ).values(),
      ];
      setPetugasOptions(uniqueUsers);
    } catch (error) {
      console.error("ERROR GET LIST PETUGAS:", error);
      setPetugasOptions([]);
      await swal.error(error?.message || "Gagal mengambil data petugas");
    } finally {
      setLoadingPetugas(false);
    }
  };

  const openAssignment = async (action) => {
    if (selectedIds.length === 0) return;
    setSelectedAction(action);
    setSelectedPetugas("");
    setShowAssignmentPanel(true);
    await getListPetugas(selectedRows);
  };
  const closeAssignment = () => {
    setSelectedPetugas("");
    setSelectedAction("");
    setShowAssignmentPanel(false);
  };
  const handleAssignment = async () => {
    if (!selectedPetugas || !selectedAction) return;
    const petugas = petugasOptions.find(
      (item) => String(item.value) === String(selectedPetugas)
    );
    if (!petugas) return;
    try {
      setLoading(true);
      for (const item of selectedRows) {
        const payload = {
          piutang_id: getId(item),
          nip: petugas.nip,
          kegiatan: selectedAction,
          is_active: "Y",
          assigned_at: new Date(),
          created_by:
            loginAccess?.nip ||
            loginAccess?.username ||
            loginAccess?.user_id ||
            "SYSTEM",
        };
        await storeSchema.actions.insertFakturPetugas(payload);
      }
      await swal.success(`${selectedIds.length} faktur berhasil ditugaskan`);
      setSelectedIds([]);
      setSelectedCabang(null);
      setSelectedRowData({});
      closeAssignment();
      await getDataFakturPetugas();
    } catch (error) {
      console.error("ERROR INSERT FAKTUR PETUGAS:", error);
      await swal.error(error?.message || "Gagal melakukan penugasan faktur");
    } finally {
      setLoading(false);
    }
  };
  const normalizeHistoryList = (response) => {
    const data = response?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.list_data)) return data.list_data;
    if (Array.isArray(data?.history)) return data.history;
    if (Array.isArray(data?.data)) return data.data;
    return data ? [data] : [];
  };

  const openHistoryPenugasan = async (faktur) => {
    const piutangId = firstValue(faktur, "piutang_id", "id", "faktur_id");

    if (!piutangId) {
      await swal.error("piutang_id faktur tidak ditemukan.");
      return;
    }

    setHistoryFaktur(faktur);
    setHistoryTukarFaktur([]);
    setHistoryPenagihan([]);
    setShowHistoryModal(true);
    setLoadingHistoryPenugasan(true);

    try {
      const [resTukarFaktur, resPenagihan] = await Promise.all([
        storeSchema.actions.historyPenugasan({
          piutang_id: piutangId,
          kegiatan: "TUKAR_FAKTUR",
        }),
        storeSchema.actions.historyPenugasan({
          piutang_id: piutangId,
          kegiatan: "PENAGIHAN",
        }),
      ]);

      if (resTukarFaktur?.status !== true) {
        throw new Error(
          resTukarFaktur?.message || "Gagal mengambil history penugasan Tukar Faktur."
        );
      }
      if (resPenagihan?.status !== true) {
        throw new Error(
          resPenagihan?.message || "Gagal mengambil history penugasan Penagihan."
        );
      }

      setHistoryTukarFaktur(normalizeHistoryList(resTukarFaktur));
      setHistoryPenagihan(normalizeHistoryList(resPenagihan));
    } catch (error) {
      console.error("ERROR HISTORY PENUGASAN:", error);
      await swal.error(error?.message || "Gagal mengambil history penugasan.");
    } finally {
      setLoadingHistoryPenugasan(false);
    }
  };

  const closeHistoryPenugasan = () => {
    setShowHistoryModal(false);
    setHistoryFaktur(null);
    setHistoryTukarFaktur([]);
    setHistoryPenagihan([]);
  };

  const renderHistorySection = (title, kegiatan, histories, Icon, accent) => (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <Icon />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{title}</h4>
          <p className="text-xs text-gray-500">Kegiatan: {kegiatan}</p>
        </div>
        <span className="badge badge-ghost ml-auto shrink-0">
          {histories.length} riwayat
        </span>
      </div>

      {loadingHistoryPenugasan ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
          <span className="loading loading-spinner loading-sm text-primary" />
          Memuat history...
        </div>
      ) : histories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
          <FaClipboardList className="mx-auto mb-2 text-xl text-gray-300" />
          <p className="text-sm font-medium text-gray-500">Belum ada history penugasan</p>
        </div>
      ) : (
        <ul className="steps steps-vertical w-full">
          {histories.map((history, index) => {
            const namaPetugas = firstValue(
              history,
              "nama",
              "nama_petugas",
              "petugas",
              "nama_user",
              "user_name",
              "nip"
            ) || "-";
            const nipPetugas = firstValue(history, "nip", "petugas_nip", "user_nip");
            const alasanPengembalian = firstValue(history, "alasan");
            const assignedAt = firstValue(
              history,
              "assigned_at",
              "tanggal_penugasan",
              "tanggal",
              "created_at",
              "updated_at"
            );
            const activeValue = String(
              firstValue(history, "is_active", "aktif", "status_aktif") || ""
            ).toUpperCase();
            const isActive = ["Y", "1", "AKTIF", "ACTIVE"].includes(activeValue);

            return (
              <li
                key={
                  history?.id ||
                  history?.penugasan_id ||
                  `${kegiatan}-${namaPetugas}-${assignedAt || index}`
                }
                className={`step ${isActive ? "step-success" : "step-neutral"}`}
              >
                <div className="w-full min-w-0 pb-5 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="break-words text-sm font-bold text-gray-800">
                      {namaPetugas}
                    </p>
                    <span className={`badge badge-sm ${isActive ? "badge-success" : "badge-ghost"}`}>
                      {isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                  {nipPetugas && (
                    <p className="mt-1 text-xs text-gray-500">NIP: {nipPetugas}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Tanggal Penugasan</p>
                  <p className="mt-1 break-words text-sm text-gray-700">
                    {assignedAt ? formatDate(assignedAt) : "-"}
                    {assignedAt && !Number.isNaN(new Date(assignedAt).getTime())
                      ? ` ${new Date(assignedAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : ""}
                  </p>
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-semibold text-amber-800">
                      Alasan Pengembalian
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                      {alasanPengembalian || "-"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  const renderStatus = (status) => {
    const config = statusConfig[status];
    if (!config) return <span className="text-gray-400">-</span>;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}
      >
        <Icon />
        {config.label}
      </span>
    );
  };
  const startIndex = totalData > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex = Math.min(currentPage * perPage, totalData);
  const headerTable = [
    { label: "No", icon: <span>#</span> },
    { label: "No. Faktur", icon: <FaFileInvoiceDollar /> },
    { label: "Customer", icon: <FaBuilding /> },
    { label: "Cabang", icon: <FaBuilding /> },
    { label: "Document Date", icon: <FaCalendarAlt /> },
    { label: "Jatuh Tempo", icon: <FaCalendarAlt /> },
    { label: "DPP", icon: <FaFileInvoiceDollar /> },
    { label: "PPN", icon: <FaFileInvoiceDollar /> },
    { label: "PPh", icon: <FaFileInvoiceDollar /> },
    { label: "Total Invoice", icon: <FaFileInvoiceDollar /> },
    { label: "Petugas Tukar Faktur", icon: <FaExchangeAlt /> },
    { label: "Petugas Penagihan", icon: <FaRoute /> },
    // { label: "Status", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          <div className="flex items-center w-full lg:w-[460px] h-12 px-2 border border-gray-300 rounded-full bg-white shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
            <FaSearch className="ml-3 shrink-0 text-base text-gray-400" />
            <input
              type="text"
              placeholder="Cari billing / customer / sales..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              value={keyword}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSearch}
              title="Cari"
              aria-label="Cari"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-90"
            >
              <FaSearch className="text-sm" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilter}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"
            >
              <FaFilter />
              Reset Filter
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Cabang
            </label>
            <Select
              isMulti
              options={cabangOptions}
              value={getSelectedFilterOptions(cabangOptions, filterCabang)}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCabang((selected || []).map((item) => item.value));
              }}
              placeholder="Semua Cabang"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Customer
            </label>
            <Select
              isMulti
              options={customerOptions}
              value={getSelectedFilterOptions(customerOptions, filterCustomer)}
              onChange={(selected) => {
                setCurrentPage(1);
                setFilterCustomer((selected || []).map((item) => item.value));
              }}
              placeholder="Semua Customer"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={filterSelectComponents}
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full min-w-[190px] sm:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Status
            </label>
            <Select
              options={[
                { label: "Semua Status", value: "ALL" },
                { label: "Belum Ditugaskan", value: "BELUM_DITUGASKAN" },
                { label: "Sudah Ditugaskan", value: "SUDAH_DITUGASKAN" },
              ]}
              value={[
                { label: "Semua Status", value: "ALL" },
                { label: "Belum Ditugaskan", value: "BELUM_DITUGASKAN" },
                { label: "Sudah Ditugaskan", value: "SUDAH_DITUGASKAN" },
              ].find((item) => item.value === selectedStatus)}
              onChange={(selected) => {
                setCurrentPage(1);
                setSelectedStatus(selected?.value || "ALL");
              }}
              placeholder="Semua Status"
              styles={filterSelectStyles}
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Document Date
            </label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 h-9 shadow-sm">
              <FaCalendarAlt className="text-primary text-sm" />
              <input
                type="date"
                value={filterStartDate}
                max={filterEndDate || undefined}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterStartDate(e.target.value);
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
              <span className="text-gray-300">-</span>
              <input
                type="date"
                value={filterEndDate}
                min={filterStartDate || undefined}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterEndDate(e.target.value);
                }}
                className="h-full text-sm bg-transparent outline-none text-gray-600 w-[125px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Faktur</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(summaryData.total_faktur)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaClipboardList className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-amber-700">Belum Ditugaskan</p>
              <p className="text-2xl font-bold text-amber-900">
                {formatNumber(summaryData.belum_ditugaskan)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaClock className="text-amber-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-green-700">Sudah Ditugaskan</p>
              <p className="text-2xl font-bold text-green-900">
                {formatNumber(summaryData.sudah_ditugaskan)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-green-600" />
            </div>
          </div>
        </div>
      </div>
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-blue-900">
            <FaCheckDouble />
            <span>
              <b>{selectedIds.length}</b> faktur dipilih
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedIds([]);
                setSelectedCabang(null);
                setSelectedRowData({});
              }}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => openAssignment("PENAGIHAN")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 shadow-md"
            >
              <FaRoute />
              Penagihan ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={() => openAssignment("TUKAR_FAKTUR")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 shadow-md"
            >
              <FaExchangeAlt />
              Tukar Faktur ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={() => openAssignment("tukar_faktur_penagihan")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 shadow-md"
            >
              <FaExchangeAlt />
              <FaRoute />
              Tukar Faktur &amp; Penagihan ({selectedIds.length})
            </button>
          </div>
        </div>
      )}
      <div className={dimensionScreenW < 768 && check ? "bringToBack" : ""}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-auto max-h-[65vh]">
            <table className="table w-full">
              <thead className="bg-primary text-white sticky top-0 text-[13px] z-10">
                <tr>
                  <th>#</th>
                  {/*
                  <th className="px-4 py-3 w-12">
                    <label
                      className={`flex items-center justify-center w-9 h-9 rounded-full border cursor-pointer transition ${
                        isAllSelected
                          ? "bg-blue-50 border-primary text-primary"
                          : "bg-white border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-primary"
                      } ${currentPageSelectableIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={
                        currentPageSelectableIds.length === 0
                          ? "Tidak ada faktur yang dapat dipilih"
                          : isAllSelected
                            ? "Batalkan semua pilihan"
                            : selectedCabang
                              ? `Pilih semua faktur cabang ${selectedCabang}`
                              : "Pilih semua faktur"
                      }
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isAllSelected}
                        disabled={currentPageSelectableIds.length === 0}
                        onChange={handleSelectAll}
                      />
                      {isAllSelected ? (
                        <FaCheckCircle />
                      ) : (
                        <span className="w-4 h-4 rounded border border-current" />
                      )}
                    </label>
                  </th>
                  */}
                  {headerTable.map((h, i) => (
                    <th key={i} className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{h.icon}</span>
                        {h.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={headerTable.length + 1}
                      className="text-center py-16 text-gray-500"
                    >
                      <span className="loading loading-spinner loading-md text-primary" />
                      <div className="mt-2">Memuat data...</div>
                    </td>
                  </tr>
                ) : tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headerTable.length + 1}
                      className="text-center py-16 text-gray-500"
                    >
                      <FaClipboardList className="text-4xl text-gray-300 mx-auto mb-3" />
                      Tidak ada data faktur
                    </td>
                  </tr>
                ) : (
                  tableData.map((v, i) => {
                    const id = getId(v);
                    return (
                      <tr
                        key={id || i}
                        className={`transition duration-200 border-b ${
                          selectedIds.includes(id)
                            ? "bg-blue-50"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <label
                            className={`flex items-center justify-center w-9 h-9 rounded-full border transition ${
                              selectedIds.includes(id)
                                ? "bg-blue-50 border-primary text-primary cursor-pointer"
                                : isSelectable(v)
                                  ? "bg-white border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-primary cursor-pointer"
                                  : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              isFullyAssigned(v)
                                ? "Petugas Tukar Faktur dan Penagihan sudah ditugaskan"
                                : selectedIds.length > 0 &&
                                    getCabang(v) !== selectedCabang
                                  ? `Cabang harus sama dengan ${selectedCabang}`
                                  : selectedIds.includes(id)
                                    ? "Batalkan pilihan"
                                    : "Pilih faktur"
                            }
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selectedIds.includes(id)}
                              disabled={!isSelectable(v) || (selectedIds.length > 0 && getCabang(v) !== selectedCabang)}
                              onChange={() => handleSelectOne(id)}
                            />
                            {selectedIds.includes(id) ? (
                              <FaCheck />
                            ) : (
                              <span className="w-4 h-4 rounded border border-current" />
                            )}
                          </label>
                          <button
                            type="button"
                            onClick={() => openHistoryPenugasan(v)}
                            title="History Penugasan"
                            aria-label="History Penugasan"
                            className="mt-2 flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                          >
                            <FaEye />
                          </button>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700">
                          {(currentPage - 1) * perPage + i + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                              <FaFileInvoiceDollar className="text-primary" />
                            </div>
                            <span className="font-semibold text-primary">
                              {v.no_faktur}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-[220px]">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                              <FaBuilding />
                            </div>
                            <p className="font-semibold text-gray-700">
                              {v.nama_customer}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <FaBuilding className="text-primary" />
                            {v.cabang}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <FaCalendarAlt className="text-primary" />
                            {formatDate(v.document_date)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <FaCalendarAlt className="text-orange-500" />
                            {formatDate(v.jatuh_tempo)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-700">
                          {formatRupiah(v.dpp)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-blue-600">
                          {formatRupiah(v.ppn)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-purple-600">
                          {formatRupiah(v.pph)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-800">
                          {formatRupiah(v.total_invoice)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {v.tukar_faktur_nama ? (
                            <div className="flex items-center gap-2 min-w-[190px]">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <FaExchangeAlt className="text-xs" />
                              </div>
                              <div className="leading-tight">
                                <p className="font-semibold text-gray-700 text-sm">
                                  {v.tukar_faktur_nama}
                                  <br />
                                  <span className="text-[11px] font-normal text-gray-400">
                                    {formatDate(v.tukar_faktur_assigned_at)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {v.penagihan_nama ? (
                            <div className="flex items-center gap-2 min-w-[190px]">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                                <FaRoute className="text-xs" />
                              </div>
                              <div className="leading-tight">
                                <p className="font-semibold text-gray-700 text-sm">
                                  {v.penagihan_nama}
                                  <br />
                                  <span className="text-[11px] font-normal text-gray-400">
                                    {formatDate(v.penagihan_assigned_at)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        {/* <td className="px-4 py-3">{renderStatus(v.status)}</td> */}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 bg-slate-50 py-4 px-5">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex items-center gap-5 flex-wrap">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{startIndex}</span> to{" "}
                  <span className="font-semibold">{endIndex}</span> of{" "}
                  <span className="font-semibold">{totalData}</span> entries
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows:</span>
                  <select
                    className="select select-bordered select-sm bg-white rounded-full"
                    value={perPage}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setPerPage(parseInt(e.target.value));
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
              {totalPage > 0 && (
                <ReactPaginate
                  breakLabel="..."
                  previousLabel="←"
                  nextLabel="→"
                  pageCount={totalPage}
                  onPageChange={(e) => setCurrentPage(e.selected + 1)}
                  forcePage={currentPage - 1}
                  className="flex items-center gap-2"
                  activeClassName="!bg-primary !text-white !border-primary"
                  pageClassName="min-w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center bg-white hover:bg-blue-50"
                  pageLinkClassName="w-full h-full flex items-center justify-center px-3"
                  previousClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white"
                  nextClassName="min-w-9 h-9 border border-gray-300 rounded-full bg-white"
                  previousLinkClassName="w-full h-full flex items-center justify-center"
                  nextLinkClassName="w-full h-full flex items-center justify-center"
                  breakClassName="px-2 text-gray-500"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showHistoryModal && (
        <div
          className="fixed inset-0 z-[510] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-5"
          onClick={closeHistoryPenugasan}
        >
          <div
            className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 bg-primary px-5 py-4 text-white sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <FaEye />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold">History Penugasan</h3>
                  <p className="mt-1 truncate text-xs text-white/80">
                    {historyFaktur?.no_faktur || historyFaktur?.nama_customer || "Detail riwayat penugasan"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeHistoryPenugasan}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10"
                title="Tutup"
              >
                <FaTimes />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 sm:p-6">
              {renderHistorySection(
                "History Penugasan Tukar Faktur",
                "TUKAR_FAKTUR",
                historyTukarFaktur,
                FaExchangeAlt,
                "bg-orange-50 text-orange-600"
              )}
              {renderHistorySection(
                "History Penugasan Penagihan",
                "PENAGIHAN",
                historyPenagihan,
                FaRoute,
                "bg-blue-50 text-blue-600"
              )}
            </div>

            <div className="flex shrink-0 justify-end border-t bg-white px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={closeHistoryPenugasan}
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignmentPanel && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          onClick={closeAssignment}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary px-5 sm:px-6 py-4 text-white shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    {selectedAction === "TUKAR_FAKTUR" ? (
                      <FaExchangeAlt />
                    ) : selectedAction === "tukar_faktur_penagihan" ? (
                      <span className="flex items-center gap-1"><FaExchangeAlt /><FaRoute /></span>
                    ) : (
                      <FaRoute />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {selectedAction === "TUKAR_FAKTUR"
                        ? "Penugasan Tukar Faktur"
                        : selectedAction === "tukar_faktur_penagihan"
                          ? "Penugasan Tukar Faktur & Penagihan"
                          : "Penugasan Penagihan"}
                    </h3>
                    <p className="text-xs text-white/70">
                      {selectedIds.length} faktur akan ditugaskan
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeAssignment}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Pilih Petugas
                </label>
                <Select
                  options={petugasOptions}
                  value={petugasOptions.find(
                    (item) => String(item.value) === String(selectedPetugas)
                  ) || null}
                  onChange={(selected) =>
                    setSelectedPetugas(selected?.value || "")
                  }
                  placeholder={loadingPetugas ? "Memuat petugas..." : "Pilih petugas..."}
                  isLoading={loadingPetugas}
                  isDisabled={loadingPetugas}
                  noOptionsMessage={() => "Tidak ada petugas untuk cabang yang dipilih"}
                  styles={filterSelectStyles}
                />
              </div>
              {selectedPetugas && (
                <div className="rounded-xl bg-green-50 border border-green-100 p-4 flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <FaUser className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Petugas terpilih</p>
                    <p className="font-semibold text-gray-700">
                      {petugasOptions.find(
                        (item) => String(item.value) === String(selectedPetugas)
                      )?.nama}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedPetugas}
                    </p>
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    {selectedAction === "TUKAR_FAKTUR"
                      ? "Faktur untuk Tukar Faktur"
                      : selectedAction === "tukar_faktur_penagihan"
                        ? "Faktur untuk Tukar Faktur & Penagihan"
                        : "Faktur untuk Penagihan"}
                  </p>
                  <span className="text-xs font-semibold text-primary bg-blue-50 px-2.5 py-1 rounded-full">
                    {selectedIds.length} Faktur
                  </span>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="max-h-[260px] overflow-y-auto">
                    {selectedRows.map((item) => (
                      <div
                        key={getId(item)}
                        className="flex items-center justify-between gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-blue-50"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-primary text-sm truncate">
                            {item.no_faktur}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {item.nama_customer}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Document Date: {formatDate(item.document_date)}
                          </p>
                        </div>
                        <FaFileInvoiceDollar className="text-gray-300 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t bg-gray-50 px-4 sm:px-5 py-4 flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={closeAssignment}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!selectedPetugas || loading}
                onClick={handleAssignment}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {selectedAction === "TUKAR_FAKTUR" ? (
                  <FaExchangeAlt />
                ) : selectedAction === "tukar_faktur_penagihan" ? (
                  <span className="flex items-center gap-1"><FaExchangeAlt /><FaRoute /></span>
                ) : (
                  <FaRoute />
                )}
                {selectedAction === "TUKAR_FAKTUR"
                  ? "Tugaskan Tukar Faktur"
                  : selectedAction === "tukar_faktur_penagihan"
                    ? "Tugaskan Tukar Faktur & Penagihan"
                    : "Tugaskan Penagihan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TablePenugasanFaktur;