
export interface Student {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  noTelpWali: string;
  emailWali?: string;
  alamat?: string;
  fotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  jenisPembayaran: string;
  deskripsi?: string;
  nominal: number;
}

export interface Transaction {
  id: string;
  transactionCode: string;
  studentId: string;
  studentName?: string; 
  studentNis?: string;
  studentKelas?: string;
  items: TransactionItem[];
  subtotal: number;
  diskon: number;
  total: number;
  metodePembayaran: 'Tunai' | 'Transfer Bank' | 'E-Wallet';
  uangDiterima?: number;
  kembalian?: number;
  catatan?: string;
  status: 'Lunas' | 'Pending' | 'Dibatalkan';
  kasir: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  nama: string;
  role: 'admin' | 'kasir' | 'manager';
}

export interface Settings {
  namaSekolah: string;
  alamat: string;
  telepon: string;
  logoUrl?: string;
  tahunAjaran: string;
  nominalSPP: {
    [key: string]: number;
  };
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
