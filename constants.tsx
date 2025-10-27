
import React from 'react';
import { LayoutDashboard, Users, ShoppingCart, History, BarChart2, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { User } from './types';

const ALL_SIDEBAR_LINKS = [
  { key: 'dashboard', label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { key: 'students', label: 'Data Siswa', path: '/students', icon: <Users size={20} /> },
  { key: 'new_transaction', label: 'Transaksi Baru', path: '/transactions/new', icon: <ShoppingCart size={20} /> },
  { key: 'history', label: 'Riwayat Transaksi', path: '/transactions/history', icon: <History size={20} /> },
  { key: 'reports', label: 'Laporan', path: '/reports', icon: <BarChart2 size={20} /> },
  { key: 'settings', label: 'Pengaturan', path: '/settings', icon: <Settings size={20} /> },
];

export const getSidebarLinks = (role: User['role']) => {
  if (role === 'admin') {
    return ALL_SIDEBAR_LINKS;
  }
  if (role === 'manager') {
    return ALL_SIDEBAR_LINKS.filter(link => ['dashboard', 'students', 'history', 'reports'].includes(link.key));
  }
  if (role === 'kasir') {
    return ALL_SIDEBAR_LINKS.filter(link => ['dashboard', 'students', 'new_transaction', 'history'].includes(link.key));
  }
  return [];
};


export const USER_MENU_ITEMS = (logout: () => void) => [
  { key: 'logout', label: 'Logout', onClick: logout, icon: <LogOut size={16} className="mr-2" /> },
];

export const THEME_TOGGLE_ITEMS = (theme: string, toggleTheme: () => void) => [
  { key: 'theme', label: theme === 'dark' ? 'Light Mode' : 'Dark Mode', onClick: toggleTheme, icon: theme === 'dark' ? <Sun size={16} className="mr-2"/> : <Moon size={16} className="mr-2"/> },
];

export const KELAS_OPTIONS = ['X-A', 'X-B', 'XI-IPA-1', 'XI-IPS-1', 'XII-A', 'XII-B', 'XII-IPA-1', 'XII-IPS-2'];

export const PAYMENT_TYPES = [
    'SPP', 
    'Buku Paket', 
    'Seragam Olahraga', 
    'Seragam Batik', 
    'Seragam Putih-Abu', 
    'Uang Kegiatan', 
    'Uang Ujian', 
    'Dana Sosial'
];

export const PAYMENT_METHODS: Array<'Tunai' | 'Transfer Bank' | 'E-Wallet'> = ['Tunai', 'Transfer Bank', 'E-Wallet'];
