
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { mockTransactions } from '../data/mockData';
import { KELAS_OPTIONS, PAYMENT_METHODS, PAYMENT_TYPES } from '../constants';
import { formatRupiah, formatDateTime } from '../utils/formatters';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Download } from 'lucide-react';

const TransactionsHistoryPage: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    jenisPembayaran: '',
    metodePembayaran: '',
    status: '',
    kelas: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const createdAt = new Date(t.createdAt);
      if (filters.dateStart && createdAt < new Date(filters.dateStart)) return false;
      if (filters.dateEnd && createdAt > new Date(filters.dateEnd)) return false;
      if (filters.jenisPembayaran && !t.items.some(item => item.jenisPembayaran === filters.jenisPembayaran)) return false;
      if (filters.metodePembayaran && t.metodePembayaran !== filters.metodePembayaran) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.kelas && t.studentKelas !== filters.kelas) return false;
      return true;
    }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, filters]);
  
  const getStatusBadge = (status: Transaction['status']) => {
    const base = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status) {
        case 'Lunas': return `${base} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
        case 'Pending': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`;
        case 'Dibatalkan': return `${base} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Riwayat Transaksi</h1>
        <Button variant="secondary">
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </div>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Input type="date" name="dateStart" value={filters.dateStart} onChange={handleFilterChange} />
            <Input type="date" name="dateEnd" value={filters.dateEnd} onChange={handleFilterChange} />
             <select name="jenisPembayaran" value={filters.jenisPembayaran} onChange={handleFilterChange} className="select-input">
                <option value="">Jenis Pembayaran</option>
                {PAYMENT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select name="metodePembayaran" value={filters.metodePembayaran} onChange={handleFilterChange} className="select-input">
                <option value="">Metode Pembayaran</option>
                {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="select-input">
                <option value="">Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Pending">Pending</option>
                <option value="Dibatalkan">Dibatalkan</option>
            </select>
            <select name="kelas" value={filters.kelas} onChange={handleFilterChange} className="select-input">
                <option value="">Kelas</option>
                {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
        </div>
      
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
             <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID Transaksi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Siswa</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nominal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metode</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tx.transactionCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDateTime(tx.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <div>{tx.studentName}</div>
                        <div className="text-xs text-gray-500">{tx.studentNis} / {tx.studentKelas}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-gray-100">{formatRupiah(tx.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tx.metodePembayaran}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={getStatusBadge(tx.status)}>{tx.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TransactionsHistoryPage;
