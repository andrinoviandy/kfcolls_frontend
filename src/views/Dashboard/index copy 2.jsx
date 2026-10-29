import React, { useMemo, useState } from 'react';

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
   DUMMY MASTER DATA
========================================================= */

const principalOptions = [
  'Semua Principal',
  'BIOFARMA',
  'KIMIA FARMA',
  'PHAPROS, PT',
  'AMAROX PHARMA GLOBAL, PT',
  'SANBE',
  'NOVARTIS',
  'PFIZER',
  'ROCHE',
  'ABBOTT',
];

const cabangOptions = [
  'Semua Cabang',
  'KFTD Jakarta 1',
  'KFTD Jakarta 2',
  'KFTD Bandung',
  'KFTD Surabaya',
  'KFTD Semarang',
  'KFTD Medan',
  'KFTD Palembang',
  'KFTD Makassar',
  'KFTD Denpasar',
  'KFTD Jayapura',
];

const channelOptions = [
  'RS Pemerintah',
  'RS Swasta',
  'Apotek',
  'Klinik',
  'Puskesmas',
  'PBF',
  'Dinkes',
];


/* =========================================================
   DUMMY DATA UTAMA
========================================================= */

const dummyData = [

  {
    id: 1,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-07-15',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jakarta 1',
    customerGroup: 'RS Pemerintah',
    customer: 'RSUP Nasional',
    channel: 'RS Pemerintah',
    invoice: 1250,
    sales: 18500000000,
    piutang: 7200000000,
    collection: 4800000000,
    outstanding: 2400000000,
    aging: 0,
  },

  {
    id: 2,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-07-03',
    principal: 'BIOFARMA',
    cabang: 'KFTD Bandung',
    customerGroup: 'RS Pemerintah',
    customer: 'RSUD Kota Bandung',
    channel: 'RS Pemerintah',
    invoice: 980,
    sales: 13200000000,
    piutang: 5800000000,
    collection: 3500000000,
    outstanding: 2300000000,
    aging: 0,
  },

  {
    id: 3,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-20',
    principal: 'BIOFARMA',
    cabang: 'KFTD Surabaya',
    customerGroup: 'RS Swasta',
    customer: 'RS Siloam Surabaya',
    channel: 'RS Swasta',
    invoice: 820,
    sales: 9800000000,
    piutang: 4200000000,
    collection: 3100000000,
    outstanding: 1100000000,
    aging: 10,
  },

  {
    id: 4,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-07-30',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Jakarta 2',
    customerGroup: 'Apotek',
    customer: 'Apotek Kimia Sehat',
    channel: 'Apotek',
    invoice: 1560,
    sales: 7600000000,
    piutang: 3900000000,
    collection: 2800000000,
    outstanding: 1100000000,
    aging: 0,
  },

  {
    id: 5,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-28',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Semarang',
    customerGroup: 'Klinik',
    customer: 'Klinik Medika Utama',
    channel: 'Klinik',
    invoice: 730,
    sales: 5400000000,
    piutang: 2800000000,
    collection: 1800000000,
    outstanding: 1000000000,
    aging: 2,
  },

  {
    id: 6,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-07-05',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Medan',
    customerGroup: 'Apotek',
    customer: 'Apotek Sehat Bersama',
    channel: 'Apotek',
    invoice: 620,
    sales: 4300000000,
    piutang: 2100000000,
    collection: 1600000000,
    outstanding: 500000000,
    aging: 0,
  },

  {
    id: 7,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-10',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Palembang',
    customerGroup: 'Puskesmas',
    customer: 'Puskesmas Sehat Makmur',
    channel: 'Puskesmas',
    invoice: 540,
    sales: 3800000000,
    piutang: 1800000000,
    collection: 1100000000,
    outstanding: 700000000,
    aging: 20,
  },

  {
    id: 8,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-07-02',
    principal: 'AMAROX PHARMA GLOBAL, PT',
    cabang: 'KFTD Surabaya',
    customerGroup: 'RS Swasta',
    customer: 'RS Mitra Keluarga',
    channel: 'RS Swasta',
    invoice: 450,
    sales: 3200000000,
    piutang: 1600000000,
    collection: 1200000000,
    outstanding: 400000000,
    aging: 0,
  },

  {
    id: 9,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-15',
    principal: 'BIOFARMA',
    cabang: 'KFTD Makassar',
    customerGroup: 'Dinkes',
    customer: 'Dinas Kesehatan Sulsel',
    channel: 'Dinkes',
    invoice: 390,
    sales: 2900000000,
    piutang: 1300000000,
    collection: 800000000,
    outstanding: 500000000,
    aging: 15,
  },

  {
    id: 10,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-07-20',
    principal: 'SANBE',
    cabang: 'KFTD Denpasar',
    customerGroup: 'Apotek',
    customer: 'Apotek Bali Farma',
    channel: 'Apotek',
    invoice: 340,
    sales: 2400000000,
    piutang: 1100000000,
    collection: 900000000,
    outstanding: 200000000,
    aging: 0,
  },

  {
    id: 11,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-01',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jayapura',
    customerGroup: 'PBF',
    customer: 'PBF Papua Sehat',
    channel: 'PBF',
    invoice: 280,
    sales: 1900000000,
    piutang: 900000000,
    collection: 500000000,
    outstanding: 400000000,
    aging: 29,
  },

  {
    id: 12,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-07-01',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Jakarta 1',
    customerGroup: 'RS Swasta',
    customer: 'RS Harapan Kita',
    channel: 'RS Swasta',
    invoice: 710,
    sales: 6200000000,
    piutang: 2900000000,
    collection: 2100000000,
    outstanding: 800000000,
    aging: 0,
  },

  {
    id: 13,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-15',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jakarta 1',
    customerGroup: 'RS Pemerintah',
    customer: 'RS Pusat Jakarta',
    channel: 'RS Pemerintah',
    invoice: 1120,
    sales: 16800000000,
    piutang: 6800000000,
    collection: 4200000000,
    outstanding: 2600000000,
    aging: 0,
  },

  {
    id: 14,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-05',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Bandung',
    customerGroup: 'Apotek',
    customer: 'Apotek Bandung Sehat',
    channel: 'Apotek',
    invoice: 860,
    sales: 11400000000,
    piutang: 5100000000,
    collection: 3000000000,
    outstanding: 2100000000,
    aging: 0,
  },

  {
    id: 15,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-07-25',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Surabaya',
    customerGroup: 'RS Swasta',
    customer: 'RS Mitra Surabaya',
    channel: 'RS Swasta',
    invoice: 790,
    sales: 9200000000,
    piutang: 4000000000,
    collection: 2700000000,
    outstanding: 1300000000,
    aging: 6,
  },

  {
    id: 16,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-02',
    principal: 'BIOFARMA',
    cabang: 'KFTD Semarang',
    customerGroup: 'Klinik',
    customer: 'Klinik Sehat Utama',
    channel: 'Klinik',
    invoice: 640,
    sales: 5100000000,
    piutang: 2500000000,
    collection: 1600000000,
    outstanding: 900000000,
    aging: 0,
  },

  {
    id: 17,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-07-10',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Medan',
    customerGroup: 'Puskesmas',
    customer: 'Puskesmas Medan Sehat',
    channel: 'Puskesmas',
    invoice: 520,
    sales: 4100000000,
    piutang: 1900000000,
    collection: 1200000000,
    outstanding: 700000000,
    aging: 21,
  },

  {
    id: 18,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-30',
    principal: 'SANBE',
    cabang: 'KFTD Denpasar',
    customerGroup: 'Apotek',
    customer: 'Apotek Bali Farma',
    channel: 'Apotek',
    invoice: 410,
    sales: 2800000000,
    piutang: 1300000000,
    collection: 1000000000,
    outstanding: 300000000,
    aging: 0,
  },

  {
    id: 19,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-07-15',
    principal: 'AMAROX PHARMA GLOBAL, PT',
    cabang: 'KFTD Makassar',
    customerGroup: 'Dinkes',
    customer: 'Dinas Kesehatan Sulsel',
    channel: 'Dinkes',
    invoice: 360,
    sales: 3000000000,
    piutang: 1400000000,
    collection: 900000000,
    outstanding: 500000000,
    aging: 16,
  },

  {
    id: 20,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-04',
    principal: 'BIOFARMA',
    cabang: 'KFTD Palembang',
    customerGroup: 'PBF',
    customer: 'PBF Sumatera Sehat',
    channel: 'PBF',
    invoice: 310,
    sales: 2200000000,
    piutang: 1000000000,
    collection: 600000000,
    outstanding: 400000000,
    aging: 0,
  },

  {
    id: 21,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-25',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jakarta 2',
    customerGroup: 'RS Pemerintah',
    customer: 'RSUD Jakarta Selatan',
    channel: 'RS Pemerintah',
    invoice: 480,
    sales: 5200000000,
    piutang: 2400000000,
    collection: 1500000000,
    outstanding: 900000000,
    aging: 5,
  },

  {
    id: 22,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-18',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Bandung',
    customerGroup: 'RS Swasta',
    customer: 'RS Hermina Bandung',
    channel: 'RS Swasta',
    invoice: 530,
    sales: 6100000000,
    piutang: 2800000000,
    collection: 1700000000,
    outstanding: 1100000000,
    aging: 12,
  },

  {
    id: 23,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-06-10',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Surabaya',
    customerGroup: 'Apotek',
    customer: 'Apotek Sehat Surabaya',
    channel: 'Apotek',
    invoice: 390,
    sales: 3500000000,
    piutang: 1700000000,
    collection: 900000000,
    outstanding: 800000000,
    aging: 20,
  },

  {
    id: 24,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-05-25',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jakarta 1',
    customerGroup: 'RS Pemerintah',
    customer: 'RSUP Persahabatan',
    channel: 'RS Pemerintah',
    invoice: 420,
    sales: 4800000000,
    piutang: 2100000000,
    collection: 1200000000,
    outstanding: 900000000,
    aging: 36,
  },

  {
    id: 25,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-05-20',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Semarang',
    customerGroup: 'Puskesmas',
    customer: 'Puskesmas Semarang Barat',
    channel: 'Puskesmas',
    invoice: 350,
    sales: 3200000000,
    piutang: 1500000000,
    collection: 800000000,
    outstanding: 700000000,
    aging: 41,
  },

  {
    id: 26,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-05-05',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Medan',
    customerGroup: 'RS Swasta',
    customer: 'RS Columbia Medan',
    channel: 'RS Swasta',
    invoice: 460,
    sales: 4300000000,
    piutang: 1900000000,
    collection: 1000000000,
    outstanding: 900000000,
    aging: 56,
  },

  {
    id: 27,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-04-30',
    principal: 'SANBE',
    cabang: 'KFTD Denpasar',
    customerGroup: 'Apotek',
    customer: 'Apotek Dewata Farma',
    channel: 'Apotek',
    invoice: 280,
    sales: 2600000000,
    piutang: 1200000000,
    collection: 700000000,
    outstanding: 500000000,
    aging: 60,
  },

  {
    id: 28,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-04-15',
    principal: 'BIOFARMA',
    cabang: 'KFTD Makassar',
    customerGroup: 'Dinkes',
    customer: 'Dinas Kesehatan Makassar',
    channel: 'Dinkes',
    invoice: 310,
    sales: 3700000000,
    piutang: 1800000000,
    collection: 800000000,
    outstanding: 1000000000,
    aging: 76,
  },

  {
    id: 29,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-03-30',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Palembang',
    customerGroup: 'PBF',
    customer: 'PBF Sumatera Selatan',
    channel: 'PBF',
    invoice: 290,
    sales: 2900000000,
    piutang: 1400000000,
    collection: 600000000,
    outstanding: 800000000,
    aging: 90,
  },

  {
    id: 30,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-02-10',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Jakarta 2',
    customerGroup: 'RS Pemerintah',
    customer: 'RSUD Jakarta Timur',
    channel: 'RS Pemerintah',
    invoice: 270,
    sales: 3100000000,
    piutang: 1600000000,
    collection: 600000000,
    outstanding: 1000000000,
    aging: 140,
  },

  {
    id: 31,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-01-15',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jayapura',
    customerGroup: 'Puskesmas',
    customer: 'Puskesmas Jayapura',
    channel: 'Puskesmas',
    invoice: 230,
    sales: 2400000000,
    piutang: 1100000000,
    collection: 400000000,
    outstanding: 700000000,
    aging: 166,
  },

  {
    id: 32,
    tanggal: '2026-06-30',
    jatuhTempo: '2025-10-15',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Medan',
    customerGroup: 'PBF',
    customer: 'PBF Medan Sejahtera',
    channel: 'PBF',
    invoice: 180,
    sales: 1900000000,
    piutang: 900000000,
    collection: 250000000,
    outstanding: 650000000,
    aging: 258,
  },

  {
    id: 33,
    tanggal: '2026-06-30',
    jatuhTempo: '2025-09-20',
    principal: 'SANBE',
    cabang: 'KFTD Bandung',
    customerGroup: 'Apotek',
    customer: 'Apotek Prima Bandung',
    channel: 'Apotek',
    invoice: 160,
    sales: 1700000000,
    piutang: 800000000,
    collection: 200000000,
    outstanding: 600000000,
    aging: 283,
  },

  {
    id: 34,
    tanggal: '2026-06-30',
    jatuhTempo: '2025-03-15',
    principal: 'BIOFARMA',
    cabang: 'KFTD Surabaya',
    customerGroup: 'RS Swasta',
    customer: 'RS Swasta Surabaya',
    channel: 'RS Swasta',
    invoice: 140,
    sales: 1500000000,
    piutang: 750000000,
    collection: 150000000,
    outstanding: 600000000,
    aging: 472,
  },

  {
    id: 35,
    tanggal: '2026-06-30',
    jatuhTempo: '2024-12-10',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Semarang',
    customerGroup: 'PBF',
    customer: 'PBF Jawa Tengah',
    channel: 'PBF',
    invoice: 120,
    sales: 1300000000,
    piutang: 650000000,
    collection: 100000000,
    outstanding: 550000000,
    aging: 567,
  },

  {
    id: 36,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-20',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jakarta 1',
    customerGroup: 'RS Pemerintah',
    customer: 'RS Pusat Jakarta',
    channel: 'RS Pemerintah',
    invoice: 500,
    sales: 5800000000,
    piutang: 2700000000,
    collection: 1600000000,
    outstanding: 1100000000,
    aging: 0,
  },

  {
    id: 37,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-03',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Bandung',
    customerGroup: 'Apotek',
    customer: 'Apotek Bandung Farma',
    channel: 'Apotek',
    invoice: 450,
    sales: 4200000000,
    piutang: 1900000000,
    collection: 1100000000,
    outstanding: 800000000,
    aging: 0,
  },

  {
    id: 38,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-06-20',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Surabaya',
    customerGroup: 'RS Swasta',
    customer: 'RS Siloam Surabaya',
    channel: 'RS Swasta',
    invoice: 390,
    sales: 3600000000,
    piutang: 1700000000,
    collection: 800000000,
    outstanding: 900000000,
    aging: 41,
  },

  {
    id: 39,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-06-01',
    principal: 'BIOFARMA',
    cabang: 'KFTD Semarang',
    customerGroup: 'Klinik',
    customer: 'Klinik Medika Semarang',
    channel: 'Klinik',
    invoice: 330,
    sales: 2900000000,
    piutang: 1400000000,
    collection: 600000000,
    outstanding: 800000000,
    aging: 60,
  },

  {
    id: 40,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-05-20',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Medan',
    customerGroup: 'Puskesmas',
    customer: 'Puskesmas Medan Utara',
    channel: 'Puskesmas',
    invoice: 280,
    sales: 2700000000,
    piutang: 1300000000,
    collection: 500000000,
    outstanding: 800000000,
    aging: 72,
  },

  {
    id: 41,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-03-01',
    principal: 'PHAPROS, PT',
    cabang: 'KFTD Palembang',
    customerGroup: 'PBF',
    customer: 'PBF Palembang Sehat',
    channel: 'PBF',
    invoice: 250,
    sales: 2400000000,
    piutang: 1200000000,
    collection: 350000000,
    outstanding: 850000000,
    aging: 152,
  },

  {
    id: 42,
    tanggal: '2026-07-31',
    jatuhTempo: '2025-11-01',
    principal: 'SANBE',
    cabang: 'KFTD Denpasar',
    customerGroup: 'Apotek',
    customer: 'Apotek Bali Sejahtera',
    channel: 'Apotek',
    invoice: 170,
    sales: 1800000000,
    piutang: 850000000,
    collection: 200000000,
    outstanding: 650000000,
    aging: 272,
  },

  {
    id: 43,
    tanggal: '2026-07-31',
    jatuhTempo: '2025-04-01',
    principal: 'BIOFARMA',
    cabang: 'KFTD Jayapura',
    customerGroup: 'RS Pemerintah',
    customer: 'RSUD Jayapura',
    channel: 'RS Pemerintah',
    invoice: 130,
    sales: 1400000000,
    piutang: 700000000,
    collection: 100000000,
    outstanding: 600000000,
    aging: 486,
  },

  {
    id: 44,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-08-01',
    principal: 'AMAROX PHARMA GLOBAL, PT',
    cabang: 'KFTD Makassar',
    customerGroup: 'Dinkes',
    customer: 'Dinas Kesehatan Makassar',
    channel: 'Dinkes',
    invoice: 210,
    sales: 2100000000,
    piutang: 1000000000,
    collection: 500000000,
    outstanding: 500000000,
    aging: 0,
  },

  {
    id: 45,
    tanggal: '2026-07-31',
    jatuhTempo: '2026-07-28',
    principal: 'KIMIA FARMA',
    cabang: 'KFTD Jakarta 2',
    customerGroup: 'RS Swasta',
    customer: 'RS Harapan Jakarta',
    channel: 'RS Swasta',
    invoice: 300,
    sales: 3000000000,
    piutang: 1400000000,
    collection: 700000000,
    outstanding: 700000000,
    aging: 3,
  },

  {
    id: 46,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-05-10',
    principal: 'NOVARTIS',
    cabang: 'KFTD Jakarta 1',
    customerGroup: 'RS Swasta',
    customer: 'RS Harapan Kita',
    channel: 'RS Swasta',
    invoice: 260,
    sales: 2800000000,
    piutang: 1350000000,
    collection: 450000000,
    outstanding: 900000000,
    aging: 51,
  },

  {
    id: 47,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-04-20',
    principal: 'PFIZER',
    cabang: 'KFTD Bandung',
    customerGroup: 'RS Pemerintah',
    customer: 'RSUD Kota Bandung',
    channel: 'RS Pemerintah',
    invoice: 240,
    sales: 2600000000,
    piutang: 1250000000,
    collection: 350000000,
    outstanding: 900000000,
    aging: 71,
  },

  {
    id: 48,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-03-15',
    principal: 'ROCHE',
    cabang: 'KFTD Surabaya',
    customerGroup: 'RS Swasta',
    customer: 'RS Siloam Surabaya',
    channel: 'RS Swasta',
    invoice: 210,
    sales: 2300000000,
    piutang: 1100000000,
    collection: 300000000,
    outstanding: 800000000,
    aging: 107,
  },

  {
    id: 49,
    tanggal: '2026-06-30',
    jatuhTempo: '2026-02-15',
    principal: 'ABBOTT',
    cabang: 'KFTD Medan',
    customerGroup: 'Apotek',
    customer: 'Apotek Sehat Bersama',
    channel: 'Apotek',
    invoice: 190,
    sales: 2100000000,
    piutang: 980000000,
    collection: 280000000,
    outstanding: 700000000,
    aging: 135,
  },
];


/* =========================================================
   DUMMY PRODUK
========================================================= */

const produkData = [

  {
    id: 1,
    tanggal: '2026-06-30',
    salesOffice: '1010',
    descSalesOffice: 'KFTD Jakarta 1',
    billingNo: '2809361541',
    material: '13076374',
    namaProduk: 'ARTESUNATE INJ',
    principal: 'BIOFARMA',
    customer: 'RSUP Nasional',
    customerGroup: 'RS Pemerintah',
    channel: 'RS Pemerintah',
    quantity: 25,
    salesUnit: 'VIAL',
    unitPrice: 109998,
    totalDiscount: 0,
    totalPenjualan: 2749950,
    taxAmount: 302495,
    totalCogs: 2406205,
    sled: '31/10/2028',
  },

  {
    id: 2,
    tanggal: '2026-06-30',
    salesOffice: '1010',
    descSalesOffice: 'KFTD Jakarta 1',
    billingNo: '2809361542',
    material: '11001530',
    namaProduk: 'NITROKAF RETARD',
    principal: 'KIMIA FARMA',
    customer: 'RS Harapan Kita',
    customerGroup: 'RS Swasta',
    channel: 'RS Swasta',
    quantity: 12,
    salesUnit: 'DUS',
    unitPrice: 264450,
    totalDiscount: 176653,
    totalPenjualan: 3173400,
    taxAmount: 349074,
    totalCogs: 1772382,
    sled: '06/04/2028',
  },

  {
    id: 3,
    tanggal: '2026-06-30',
    salesOffice: '1010',
    descSalesOffice: 'KFTD Jakarta 1',
    billingNo: '2809361543',
    material: '11002323',
    namaProduk: 'MARCKS CLASSIC CREME 40GR',
    principal: 'KIMIA FARMA',
    customer: 'Apotek Kimia Sehat',
    customerGroup: 'Apotek',
    channel: 'Apotek',
    quantity: 35,
    salesUnit: 'PCS',
    unitPrice: 17300,
    totalDiscount: 5709,
    totalPenjualan: 605500,
    taxAmount: 66605,
    totalCogs: 448500,
    sled: '04/06/2031',
  },

  {
    id: 4,
    tanggal: '2026-06-30',
    salesOffice: '1020',
    descSalesOffice: 'KFTD Bandung',
    billingNo: '2809361544',
    material: '12004567',
    namaProduk: 'VAKSIN DASAR ANAK',
    principal: 'BIOFARMA',
    customer: 'RSUD Kota Bandung',
    customerGroup: 'RS Pemerintah',
    channel: 'RS Pemerintah',
    quantity: 50,
    salesUnit: 'VIAL',
    unitPrice: 350000,
    totalDiscount: 150000,
    totalPenjualan: 17500000,
    taxAmount: 1925000,
    totalCogs: 14500000,
    sled: '15/12/2029',
  },

  {
    id: 5,
    tanggal: '2026-06-30',
    salesOffice: '1030',
    descSalesOffice: 'KFTD Surabaya',
    billingNo: '2809361545',
    material: '13078421',
    namaProduk: 'ACTRAPID PENFILL',
    principal: 'BIOFARMA',
    customer: 'RS Swasta Surabaya',
    customerGroup: 'RS Swasta',
    channel: 'RS Swasta',
    quantity: 18,
    salesUnit: 'PEN',
    unitPrice: 185000,
    totalDiscount: 92500,
    totalPenjualan: 3330000,
    taxAmount: 366300,
    totalCogs: 2620000,
    sled: '12/01/2029',
  },

  {
    id: 6,
    tanggal: '2026-06-30',
    salesOffice: '1040',
    descSalesOffice: 'KFTD Semarang',
    billingNo: '2809361546',
    material: '11003456',
    namaProduk: 'PRIMOLUT N TABLET',
    principal: 'KIMIA FARMA',
    customer: 'Puskesmas Semarang Barat',
    customerGroup: 'Puskesmas',
    channel: 'Puskesmas',
    quantity: 30,
    salesUnit: 'BOX',
    unitPrice: 72500,
    totalDiscount: 36250,
    totalPenjualan: 2175000,
    taxAmount: 239250,
    totalCogs: 1600000,
    sled: '22/08/2028',
  },

  {
    id: 7,
    tanggal: '2026-06-30',
    salesOffice: '1050',
    descSalesOffice: 'KFTD Medan',
    billingNo: '2809361547',
    material: '11004567',
    namaProduk: 'SIMVASTATIN 20 MG',
    principal: 'PHAPROS, PT',
    customer: 'RS Columbia Medan',
    customerGroup: 'RS Swasta',
    channel: 'RS Swasta',
    quantity: 45,
    salesUnit: 'BOX',
    unitPrice: 42000,
    totalDiscount: 63000,
    totalPenjualan: 1890000,
    taxAmount: 207900,
    totalCogs: 1417500,
    sled: '18/11/2028',
  },

  {
    id: 8,
    tanggal: '2026-06-30',
    salesOffice: '1060',
    descSalesOffice: 'KFTD Denpasar',
    billingNo: '2809361548',
    material: '12005678',
    namaProduk: 'PROTECAL SOLUTION',
    principal: 'SANBE',
    customer: 'Apotek Dewata Farma',
    customerGroup: 'Apotek',
    channel: 'Apotek',
    quantity: 24,
    salesUnit: 'BOTOL',
    unitPrice: 68000,
    totalDiscount: 81600,
    totalPenjualan: 1632000,
    taxAmount: 179520,
    totalCogs: 1224000,
    sled: '09/02/2029',
  },

  {
    id: 9,
    tanggal: '2026-06-30',
    salesOffice: '1070',
    descSalesOffice: 'KFTD Makassar',
    billingNo: '2809361549',
    material: '13006789',
    namaProduk: 'VAKSIN INFLUENZA',
    principal: 'BIOFARMA',
    customer: 'Dinas Kesehatan Makassar',
    customerGroup: 'Dinkes',
    channel: 'Dinkes',
    quantity: 60,
    salesUnit: 'VIAL',
    unitPrice: 275000,
    totalDiscount: 825000,
    totalPenjualan: 15750000,
    taxAmount: 1732500,
    totalCogs: 12900000,
    sled: '30/06/2029',
  },

  {
    id: 10,
    tanggal: '2026-06-30',
    salesOffice: '1080',
    descSalesOffice: 'KFTD Palembang',
    billingNo: '2809361550',
    material: '11007890',
    namaProduk: 'AMOXICILLIN 500 MG',
    principal: 'KIMIA FARMA',
    customer: 'PBF Sumatera Selatan',
    customerGroup: 'PBF',
    channel: 'PBF',
    quantity: 80,
    salesUnit: 'BOX',
    unitPrice: 56000,
    totalDiscount: 112000,
    totalPenjualan: 4480000,
    taxAmount: 492800,
    totalCogs: 3360000,
    sled: '14/03/2028',
  },

  {
    id: 11,
    tanggal: '2026-06-30',
    salesOffice: '1010',
    descSalesOffice: 'KFTD Jakarta 1',
    billingNo: '2809361551',
    material: '12008901',
    namaProduk: 'PARACETAMOL INFUS',
    principal: 'BIOFARMA',
    customer: 'RSUP Persahabatan',
    customerGroup: 'RS Pemerintah',
    channel: 'RS Pemerintah',
    quantity: 36,
    salesUnit: 'BOTOL',
    unitPrice: 92000,
    totalDiscount: 165600,
    totalPenjualan: 3312000,
    taxAmount: 364320,
    totalCogs: 2484000,
    sled: '20/07/2029',
  },

  {
    id: 12,
    tanggal: '2026-06-30',
    salesOffice: '1020',
    descSalesOffice: 'KFTD Bandung',
    billingNo: '2809361552',
    material: '11009012',
    namaProduk: 'CETIRIZINE 10 MG',
    principal: 'KIMIA FARMA',
    customer: 'RS Hermina Bandung',
    customerGroup: 'RS Swasta',
    channel: 'RS Swasta',
    quantity: 40,
    salesUnit: 'BOX',
    unitPrice: 38500,
    totalDiscount: 77000,
    totalPenjualan: 1540000,
    taxAmount: 169400,
    totalCogs: 1155000,
    sled: '11/09/2028',
  },
];


/* =========================================================
   RELASI PRODUK UNTUK DATA PIUTANG

   Data dummy piutang tidak memiliki field produk secara langsung.
   Untuk kebutuhan chart Performa Piutang per Produk, produk dicari
   berdasarkan kombinasi customer + principal + channel dari produkData.
   Pada data real/API, sebaiknya field produk memang tersedia langsung
   pada setiap transaksi piutang agar relasinya akurat.
========================================================= */

const piutangData = dummyData.map((item) => {

  const matchedProduct = produkData.find(
    (product) =>
      product.customer === item.customer &&
      product.principal === item.principal &&
      product.channel === item.channel
  );

  return {
    ...item,
    produk: matchedProduct?.namaProduk || 'Produk Lainnya',
  };

});



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


const formatDate = (date) => {

  if (!date) {
    return '-';
  }

  const [year, month, day] =
    date.split('-');

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

const trendSaldoPiutangData = [
  { bulan: 'MAR 26', saldoPiutang: 104861, saldoOverdue: 10954, overduePct: 10.4 },
  { bulan: 'APR 26', saldoPiutang: 296832, saldoOverdue: 8710, overduePct: 2.9 },
  { bulan: 'MAY 26', saldoPiutang: 337441, saldoOverdue: 8589, overduePct: 2.7 },
  { bulan: 'JUN 26', saldoPiutang: 271101, saldoOverdue: 9160, overduePct: 3.4 },
  { bulan: 'JUL 26', saldoPiutang: 130752, saldoOverdue: 10497, overduePct: 8.0 },
  { bulan: 'AUG 26', saldoPiutang: 73167, saldoOverdue: 9412, overduePct: 12.9 },
];

const trendPencairanData = [
  { bulan: 'MAR', realisasi: 50303, achPencairan: 88 },
  { bulan: 'APR', realisasi: 62738, achPencairan: 81 },
  { bulan: 'MAY', realisasi: 106874, achPencairan: 184 },
  { bulan: 'JUN', realisasi: 223737, achPencairan: 99 },
  { bulan: 'JUL', realisasi: 202839, achPencairan: 100 },
  { bulan: 'AUG', realisasi: 83438, achPencairan: 133 },
];


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


const Dashboard = () => {

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const defaultFilter = {
    cabang: 'Semua Cabang',
    principal: 'Semua Principal',
    channel: 'Semua Channel',
    customer: 'Semua Customer',
    produk: 'Semua Produk',
    tanggal: '2026-06-30',
  };


  const [filter, setFilter] =
    useState(defaultFilter);


  const [appliedFilter, setAppliedFilter] =
    useState(defaultFilter);


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
     CUSTOMER OPTIONS
     
     CUSTOMER MENGIKUTI CHANNEL
  ======================================================= */

  const customerOptions = useMemo(() => {

    let sourceData = dummyData;


    if (
      filter.channel &&
      filter.channel !== 'Semua Channel'
    ) {

      sourceData = dummyData.filter(
        (item) =>
          item.channel ===
          filter.channel
      );

    }


    const customers = [
      ...new Set(
        sourceData
          .map(
            (item) =>
              item.customer
          )
          .filter(Boolean)
      ),
    ];


    return customers.sort();

  }, [filter.channel]);


  const productOptions = useMemo(() => (
    [...new Set(
      produkData
        .map((item) => item.namaProduk)
        .filter(Boolean)
    )].sort()
  ), []);


  /* =======================================================
     HANDLE FILTER
  ======================================================= */

  const handleFilterChange = (
    name,
    value
  ) => {

    setFilter((prev) => {

      const nextFilter = {
        ...prev,
        [name]: value,
      };


      if (name === 'channel') {

        nextFilter.customer =
          'Semua Customer';

      }


      return nextFilter;

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
      cabang: 'Semua Cabang',
      principal: 'Semua Principal',
      channel: 'Semua Channel',
      customer: 'Semua Customer',
      produk: 'Semua Produk',
      tanggal: '2026-06-30',
    };


    setFilter(newDefaultFilter);

    setAppliedFilter(
      newDefaultFilter
    );

  };


  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const filteredData = useMemo(() => {

    return piutangData.filter((item) => {

      const cabangMatch =
        appliedFilter.cabang ===
        'Semua Cabang' ||
        item.cabang ===
        appliedFilter.cabang;


      const principalMatch =
        appliedFilter.principal ===
        'Semua Principal' ||
        item.principal ===
        appliedFilter.principal;


      const channelMatch =
        appliedFilter.channel ===
        'Semua Channel' ||
        item.channel ===
        appliedFilter.channel;


      const customerMatch =
        appliedFilter.customer ===
        'Semua Customer' ||
        item.customer ===
        appliedFilter.customer;


      const productMatch =
        appliedFilter.produk ===
        'Semua Produk' ||
        item.produk ===
        appliedFilter.produk;


      const tanggalMatch =
        !appliedFilter.tanggal ||
        item.tanggal ===
        appliedFilter.tanggal;


      return (
        cabangMatch &&
        principalMatch &&
        channelMatch &&
        customerMatch &&
        productMatch &&
        tanggalMatch
      );

    });

  }, [appliedFilter]);


  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {

    return filteredData.reduce(
      (acc, item) => {

        acc.totalPenjualan +=
          item.sales;

        acc.totalPiutang +=
          item.piutang;

        acc.totalCollection +=
          item.collection;

        acc.saldoPiutang +=
          item.outstanding;

        acc.jumlahInvoice +=
          item.invoice;


        if (item.outstanding > 0) {

          acc.invoiceOutstanding +=
            item.invoice;

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

  }, [filteredData]);


  /* =========================================================
     GRAFIK SALDO PIUTANG BY AGING & CHANNEL
  ========================================================= */

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

    const rows = agingKeys.map((agingLabel) => {
      const row = {
        aging: agingLabel
          .replace(' Hari', '')
          .replace('0 - 30', '0-30')
          .replace('31 - 45', '31-45')
          .replace('46 - 60', '46-60')
          .replace('61 - 90', '61-90')
          .replace('91 - 180', '91-180')
          .replace('181 - 360', '181-360'),
        'RS Pemerintah': 0,
        'Instansi Pemerintah': 0,
        Swasta: 0,
      };

      filteredData.forEach((item) => {
        const aging = Number(item.aging || 0);
        const itemAging = getAgingCategory(aging);

        if (itemAging !== agingLabel) return;

        const value = Number(item.outstanding || 0) / 1000000;

        let channelGroup = 'Swasta';

        if (item.channel === 'RS Pemerintah') {
          channelGroup = 'RS Pemerintah';
        } else if (
          item.channel === 'Dinkes' ||
          item.channel === 'Puskesmas' ||
          item.customerGroup === 'Instansi Pemerintah'
        ) {
          channelGroup = 'Instansi Pemerintah';
        }

        row[channelGroup] += value;
      });

      return row;
    });

    return rows;
  }, [filteredData]);


  /* =========================================================
     RINGKASAN CHANNEL UNTUK TABEL
     Dibuat menyerupai tabel pada desain:
     Channel | Total | % | 2026 BLM JTO | SDH JTO |
     2025 BLM JTO | SDH JTO | < 2024 SDH JTO | % SDH JTO
  ========================================================= */

  const channelSummaryData = useMemo(() => {
    const groups = [
      {
        label: 'RS Pemerintah',
        match: (item) => item.channel === 'RS Pemerintah',
      },
      {
        label: 'Instansi Pemerintah',
        match: (item) =>
          item.channel === 'Dinkes' ||
          item.channel === 'Puskesmas' ||
          item.customerGroup === 'Instansi Pemerintah',
      },
      {
        label: 'Swasta',
        match: (item) =>
          item.channel !== 'RS Pemerintah' &&
          item.channel !== 'Dinkes' &&
          item.channel !== 'Puskesmas' &&
          item.customerGroup !== 'Instansi Pemerintah',
      },
    ];

    const totalOutstanding = filteredData.reduce(
      (sum, item) => sum + Number(item.outstanding || 0),
      0
    );

    const getRow = (group) => {
      const items = filteredData.filter(group.match);

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
  }, [filteredData]);



  /* =========================================================
     DUMMY ROW CHANNEL UNTUK KEBUTUHAN TAMPILAN TABLE

     Data dummy ini hanya menambah baris pada tabel Channel agar
     area table memenuhi tinggi card dan dapat diuji dengan
     vertical overflow.

     Perhitungan dashboard dan TOTAL tetap menggunakan
     channelSummaryData asli.
  ========================================================= */

  const channelTableRows = useMemo(() => {
    const actualRows = channelSummaryData.filter(
      (row) => row.channel !== 'TOTAL'
    );

    const dummyRows = [];

    const dummyConfig = [
      { source: 0, suffix: ' - Dummy 1', factor: 0.92 },
      { source: 1, suffix: ' - Dummy 1', factor: 0.88 },
      { source: 2, suffix: ' - Dummy 1', factor: 0.84 },
      { source: 0, suffix: ' - Dummy 2', factor: 0.76 },
      { source: 1, suffix: ' - Dummy 2', factor: 0.71 },
      { source: 2, suffix: ' - Dummy 2', factor: 0.67 },
    ];

    dummyConfig.forEach((config) => {
      const sourceRow = actualRows[config.source];

      if (!sourceRow) return;

      const factor = config.factor;

      dummyRows.push({
        ...sourceRow,
        channel: `${sourceRow.channel}${config.suffix}`,
        total: Math.round(sourceRow.total * factor),
        percentage: Number(
          (sourceRow.percentage * factor).toFixed(1)
        ),
        blmJto2026: Math.round(
          sourceRow.blmJto2026 * factor
        ),
        sdhJto2026: Math.round(
          sourceRow.sdhJto2026 * factor
        ),
        blmJto2025: Math.round(
          sourceRow.blmJto2025 * factor
        ),
        sdhJto2025: Math.round(
          sourceRow.sdhJto2025 * factor
        ),
        sdhJtoBefore2025: Math.round(
          sourceRow.sdhJtoBefore2025 * factor
        ),
        percentageSdhJto: sourceRow.percentageSdhJto,
        isDummy: true,
      });
    });

    return [...actualRows, ...dummyRows];
  }, [channelSummaryData]);


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
  ======================================================= */

  const saldoJatuhTempoData =
    useMemo(() => {

      const result = [
        {
          name: 'Belum JTO',
          value: 0,
        },
        {
          name: 'Segera JTO',
          value: 0,
        },
        {
          name: 'Sudah JTO',
          value: 0,
        },
      ];


      const today = new Date(
        `${appliedFilter.tanggal}T00:00:00`
      );


      const batasSegeraJTO =
        new Date(today);


      batasSegeraJTO.setDate(
        batasSegeraJTO.getDate() + 7
      );


      filteredData.forEach((item) => {

        if (!item.jatuhTempo) {
          return;
        }


        const jatuhTempo = new Date(
          `${item.jatuhTempo}T00:00:00`
        );


        if (jatuhTempo < today) {

          result[2].value +=
            item.outstanding;

        } else if (
          jatuhTempo <=
          batasSegeraJTO
        ) {

          result[1].value +=
            item.outstanding;

        } else {

          result[0].value +=
            item.outstanding;

        }

      });


      return result;

    }, [
      filteredData,
      appliedFilter.tanggal,
    ]);


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

      const field =
        currentPerformanceConfig.field;


      filteredData.forEach((item) => {

        const key =
          item[field];


        if (!key) {
          return;
        }


        if (!grouped[key]) {

          grouped[key] = {
            name: key,
            piutang: 0,
            collection: 0,
            saldo: 0,
          };

        }


        grouped[key].piutang +=
          item.piutang;


        grouped[key].collection +=
          item.collection;


        grouped[key].saldo +=
          item.outstanding;

      });


      return Object.values(grouped);

    }, [
      filteredData,
      currentPerformanceConfig.field,
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


      filteredData.forEach((item) => {

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

    }, [filteredData]);


  /* =======================================================
     AGING DATA
  ======================================================= */

  const agingSummary = useMemo(() => {

    const result =
      agingLabels.map((label) => ({
        label,
        value: 0,
      }));


    filteredData.forEach((item) => {

      const category =
        getAgingCategory(
          item.aging
        );


      const index =
        agingLabels.indexOf(
          category
        );


      if (index !== -1) {

        result[index].value +=
          item.outstanding;

      }

    });


    const total =
      result.reduce(
        (sum, item) =>
          sum + item.value,
        0
      );


    return result.map((item) => ({

      ...item,

      percentage:
        total > 0
          ? (
            item.value /
            total
          ) * 100
          : 0,

    }));

  }, [filteredData]);


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
          <thead>
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={agingLabels.length + 8} className="px-4 py-12 text-center text-gray-400">
                  Tidak ada data piutang produk
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const total = row.aging.reduce((sum, value) => sum + value, 0);

                return (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3 text-center text-gray-400">{index + 1}</td>
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

          <tfoot>
            <tr className="bg-blue-900 text-white">
              <td colSpan={6} className="px-4 py-3 font-bold text-xs">Grand Total</td>
              {agingLabels.map((_, agingIndex) => (
                <td key={agingIndex} className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                  {formatRupiah(data.reduce((sum, row) => sum + (row.aging[agingIndex] || 0), 0))}
                </td>
              ))}
              <td className="px-4 py-3 text-right font-bold whitespace-nowrap">
                {formatRupiah(data.reduce((grand, row) => grand + row.aging.reduce((sum, value) => sum + value, 0), 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );


  /* =======================================================
     FILTERED PRODUCT
  ======================================================= */

  const filteredProdukData =
    useMemo(() => {

      return produkData.filter(
        (item) => {

          const principalMatch =
            appliedFilter.principal ===
            'Semua Principal' ||
            item.principal ===
            appliedFilter.principal;


          const cabangMatch =
            appliedFilter.cabang ===
            'Semua Cabang' ||
            item.descSalesOffice ===
            appliedFilter.cabang;


          const channelMatch =
            appliedFilter.channel ===
            'Semua Channel' ||
            item.channel ===
            appliedFilter.channel;


          const customerMatch =
            appliedFilter.customer ===
            'Semua Customer' ||
            item.customer ===
            appliedFilter.customer;


          const productMatch =
            appliedFilter.produk ===
            'Semua Produk' ||
            item.namaProduk ===
            appliedFilter.produk;


          const tanggalMatch =
            !appliedFilter.tanggal ||
            item.tanggal ===
            appliedFilter.tanggal;


          return (
            principalMatch &&
            cabangMatch &&
            channelMatch &&
            customerMatch &&
            productMatch &&
            tanggalMatch
          );

        }
      );

    }, [appliedFilter]);

  const filteredPiutangProdukData = useMemo(() => (
    filteredProdukData.map((product) => {
      const matchingPiutang = dummyData.filter((item) => (
        item.cabang === product.descSalesOffice &&
        item.principal === product.principal &&
        item.customer === product.customer
      ));

      return {
        ...product,
        aging: agingLabels.map((label) => (
          matchingPiutang
            .filter((item) => getAgingCategory(item.aging) === label)
            .reduce((sum, item) => sum + item.outstanding, 0)
        )),
      };
    })
  ), [filteredProdukData]);


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



  /* =========================================================
     MASTER CABANG
     Semua cabang ditampilkan. Cabang yang belum memiliki data
     aktual menggunakan dummy value yang berbeda-beda.
  ========================================================= */

  const masterCabangPiutang = [
    'KFTD Banda Aceh',
    'KFTD Medan',
    'KFTD Pematang Siantar',
    'KFTD Padang',
    'KFTD Pekanbaru',
    'KFTD Batam',
    'KFTD Jambi',
    'KFTD Palembang',
    'KFTD Pangkal Pinang',
    'KFTD Bengkulu',
    'KFTD Bandar Lampung',
    'KFTD Jakarta 1',
    'KFTD Jakarta 2',
    'KFTD Tangerang',
    'KFTD Serang',
    'KFTD Bandung',
    'KFTD Bekasi',
    'KFTD Bogor',
    'KFTD Cirebon',
    'KFTD Tasikmalaya',
    'KFTD Tegal',
    'KFTD Purwokerto',
    'KFTD Semarang',
    'KFTD Surakarta',
    'KFTD Yogyakarta',
    'KFTD Madiun',
    'KFTD Malang',
    'KFTD Sidoarjo',
    'KFTD Jember',
    'KFTD Surabaya',
    'KFTD Denpasar',
    'KFTD Mataram',
    'KFTD Kupang',
    'KFTD Pontianak',
    'KFTD Palangkaraya',
    'KFTD Banjarmasin',
    'KFTD Samarinda',
    'KFTD Balikpapan',
    'KFTD Manado',
    'KFTD Makassar',
    'KFTD Kendari',
    'KFTD Gorontalo',
    'KFTD Ambon',
    'KFTD Ternate',
    'KFTD Sorong',
    'KFTD Jayapura',
    'KFTD Palu',
    'KFTD Jakarta 3',
  ];

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

  const getDummyOverdue = (index) => {
    const values = [
      38, 55, 72, 91, 110, 126, 143, 159,
      176, 194, 211, 228, 247, 265, 283, 301,
      319, 337, 356, 374, 392, 411, 429, 448,
      467, 486, 505, 524, 543, 562, 581, 600,
      620, 641, 663, 685, 708, 731, 754, 778,
      802, 826, 851, 876, 901, 927, 953, 980,
    ];

    return (values[index] || 100) * 1000000;
  };

  const getDummyOverdue360 = (index) => {
    const values = [
      55, 72, 88, 104, 121, 139, 158, 177,
      196, 216, 237, 258, 280, 302, 325, 348,
      371, 394, 418, 442, 466, 490, 515, 540,
      565, 590, 615, 640, 665, 690, 715, 740,
      765, 790, 815, 840, 865, 890, 915, 940,
      965, 990, 1015, 1040, 1065, 1090, 1115, 1140,
    ];

    return (values[index] || 50) * 1000000;
  };

  const branchScoreData = useMemo(() => {
    const rows = masterCabangPiutang.map((branch, index) => {
      const actual = branchPiutangBaseData[branch];

      const overdue =
        actual && actual.overdue > 0
          ? actual.overdue
          : getDummyOverdue(index);

      const outstanding =
        actual && actual.outstanding > 0
          ? actual.outstanding
          : overdue * 2.8;

      return {
        branch,
        overdue,
        outstanding,
        isDummy: !actual || actual.overdue <= 0,
      };
    });

    const maxOverdue = Math.max(
      ...rows.map((item) => item.overdue),
      1
    );
    const minOverdue = Math.min(
      ...rows.map((item) => item.overdue),
      0
    );
    const range = maxOverdue - minOverdue || 1;

    return rows
      .map((item) => ({
        ...item,
        // Overdue paling kecil = skor paling tinggi.
        score: Math.round(
          105 -
          (item.overdue - minOverdue) /
          range *
          88
        ),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.overdue - b.overdue;
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [branchPiutangBaseData]);

  const piutang360BranchData = useMemo(() => {
    return masterCabangPiutang
      .map((branch, index) => {
        const actual = branchPiutangBaseData[branch];

        return {
          branch,
          value:
            actual && actual.overdue360 > 0
              ? actual.overdue360
              : getDummyOverdue360(index),
          isDummy:
            !actual || actual.overdue360 <= 0,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [branchPiutangBaseData]);

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
            px-4
            py-2.5
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
                Data per tanggal
              </p>


              <p className="
                text-xs
                font-bold
                text-gray-700
              ">
                {formatDate(
                  appliedFilter.tanggal
                )}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            FILTER
        ================================================= */}

        <div className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          shadow-sm
          p-5
          mb-5
        ">

          <div className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-3
            mb-5
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


            <div className="
              text-[11px]
              text-gray-400
            ">

              Filter aktif:

              <span className="
                ml-1
                font-semibold
                text-blue-600
              ">
                {formatDate(
                  appliedFilter.tanggal
                )}
              </span>

            </div>

          </div>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-6
            gap-4
          ">

            {/* CABANG */}

            <div>

              <label className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              ">
                Cabang
              </label>


              <select
                value={filter.cabang}
                onChange={(e) =>
                  handleFilterChange(
                    'cabang',
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="Semua Cabang">
                  Semua Cabang
                </option>


                {cabangOptions
                  .filter(
                    (item) =>
                      item !==
                      'Semua Cabang'
                  )
                  .map((item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

              </select>

            </div>


            {/* PRINCIPAL */}

            <div>

              <label className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              ">
                Principal
              </label>


              <select
                value={filter.principal}
                onChange={(e) =>
                  handleFilterChange(
                    'principal',
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="Semua Principal">
                  Semua Principal
                </option>


                {principalOptions
                  .filter(
                    (item) =>
                      item !==
                      'Semua Principal'
                  )
                  .map((item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

              </select>

            </div>


            {/* CHANNEL */}

            <div>

              <label className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              ">
                Channel
              </label>


              <select
                value={filter.channel}
                onChange={(e) =>
                  handleFilterChange(
                    'channel',
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="Semua Channel">
                  Semua Channel
                </option>


                {channelOptions.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* CUSTOMER */}

            <div>

              <label className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              ">
                Customer
              </label>


              <select
                value={filter.customer}
                onChange={(e) =>
                  handleFilterChange(
                    'customer',
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="Semua Customer">
                  Semua Customer
                </option>


                {customerOptions.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>


              {filter.channel !==
                'Semua Channel' && (

                  <p className="
                    text-[9px]
                    text-blue-500
                    mt-1
                  ">

                    Customer mengikuti Channel{' '}

                    <span className="font-bold">
                      {filter.channel}
                    </span>

                  </p>

                )}

            </div>


            {/* PRODUK */}

            <div>

              <label className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              ">
                Produk
              </label>


              <select
                value={filter.produk}
                onChange={(e) =>
                  handleFilterChange(
                    'produk',
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              >

                <option value="Semua Produk">
                  Semua Produk
                </option>


                {productOptions.map((item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                ))}

              </select>

            </div>


            {/* TANGGAL */}

            <div>

              <label className="
                block
                text-xs
                font-semibold
                text-gray-600
                mb-1.5
              ">
                Tanggal
              </label>


              <input
                type="date"
                value={
                  filter.tanggal
                }
                onChange={(e) =>
                  handleFilterChange(
                    'tanggal',
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>

          </div>


          {/* ACTIVE FILTER */}

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
              {filter.cabang}
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
              {filter.principal}
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
              {filter.channel}
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
              {filter.customer}
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
              {filter.produk}
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
              {formatDate(
                filter.tanggal
              )}
            </span>

          </div>


          {/* BUTTON */}

          <div className="
            flex
            justify-end
            items-center
            gap-2
            mt-5
            pt-4
            border-t
            border-gray-100
          ">

            <button
              type="button"
              onClick={resetFilter}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2.5
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
                px-5
                py-2.5
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
                  data={trendSaldoPiutangData}
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
                  data={trendPencairanData}
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
                    }}
                  />

                  <Bar
                    dataKey="RS Pemerintah"
                    name="RS Pemerintah"
                    stackId="aging"
                    fill="#60a5fa"
                  >
                    <LabelList
                      dataKey="RS Pemerintah"
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

                  <Bar
                    dataKey="Instansi Pemerintah"
                    name="Instansi Pemerintah"
                    stackId="aging"
                    fill="#f59e0b"
                  >
                    <LabelList
                      dataKey="Instansi Pemerintah"
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

                  <Bar
                    dataKey="Swasta"
                    name="Swasta"
                    stackId="aging"
                    fill="#173b7a"
                  >
                    <LabelList
                      dataKey="Swasta"
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
                            className={`transition ${
                              row.isDummy
                                ? 'bg-slate-50/60 hover:bg-slate-100'
                                : 'hover:bg-slate-50'
                            }`}
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
          <DetailPiutangTable data={filteredPiutangProdukData} />
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