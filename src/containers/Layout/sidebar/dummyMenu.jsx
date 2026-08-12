import {
    FaTachometerAlt,
    FaFileAlt,
    FaChartBar,
    FaBook,
    FaUsersCog,
    FaWallet,
    FaReceipt,
    FaFileInvoiceDollar,
    FaDatabase,
    FaStore,
    FaUserShield,
} from "react-icons/fa";
import { FaRoute } from "react-icons/fa6";

export const dummyMenu = [
    {
        id: 1,
        name: "Dashboard",
        path: "/dashboard",
        icon: FaTachometerAlt,
        submenu: [],
    },
    {
        id: 2,
        name: "Pengajuan",
        icon: FaFileAlt,
        submenu: [
            {
                name: "Data Pengajuan",
                path: "/data-pengajuan",
                roles: ["RL01", "RL00", "RL16", "RL17"],
            },
            {
                name: "Approval Pengajuan",
                path: "/approval-pengajuan",
                roles: [
                    "RL02",
                    "RL03",
                    "RL04",
                    "RL05",
                    "RL06",
                    "RL07",
                    "RL08",
                    "RL09",
                    "RL10",
                    "RL11",
                    "RL13",
                    "RL14",
                    "RL15",
                ],
            },
            {
                name: "History Pengajuan",
                path: "/history-pengajuan",
                // tidak ada roles = semua boleh
            },
        ],
    },
    {
        id: 3,
        name: "Upload Penjualan",
        path: "/penjualan",
        icon: FaReceipt,
        roles: ["RL00", "RL06", "RL11"],
        submenu: [],
    },
    {
        id: 4,
        name: "User Management",
        path: "/user-management",
        icon: FaUsersCog,
        roles: ["RL00", "RL11"],
        submenu: [],
    },
    {
        id: 5,
        name: "Jenis Pajak",
        path: "/jenis-pajak",
        icon: FaFileInvoiceDollar,
        roles: ["RL05", "RL00", "RL11"],
        submenu: [],
    },
    {
        id: 6,
        name: "Manajemen Anggaran",
        path: "/manajemen-anggaran",
        icon: FaWallet,
        roles: ["RL08", "RL00", "RL11"],
        submenu: [],
    },
    // {
    //     id: 7,
    //     name: "Master Vendor",
    //     path: "/master-vendor",
    //     icon: FaStore,
    //     roles: ["RL03", "RL00", "RL13"],
    //     submenu: [],
    // },
    {
        id: 8,
        name: "Reporting",
        path: "/reporting",
        icon: FaChartBar,
        submenu: [],
    },
    {
        id: 9,
        name: "Flow Approval",
        path: "/master-approval",
        icon: FaRoute,
        roles: ["RL00", "RL11"],
        submenu: [],
    },
    {
        id: 10,
        name: "Manajemen Session",
        path: "/manajemen-session",
        icon: FaUserShield,
        roles: ["RL00", "RL11"],
        submenu: [],
    },
    {
        id: 11,
        name: "Master Data",
        icon: FaDatabase,
        submenu: [
            {
                name: "Referensi Data",
                path: "/master-data",
                roles: ["RL00", "RL11"],
            },
            {
                name: "Data Vendor",
                path: "/master-vendor",
                roles: ["RL00", "RL03", "RL13", '30000062', "RL11"],
            },
            
        ],
        roles: ["RL00", "RL03", "RL13", "RL11"]
    },
    {
        id: 12,
        name: "Manual Book",
        path: "/manual-book",
        icon: FaBook,
        submenu: [],
    },
];