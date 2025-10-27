
import React, { useMemo } from 'react';
import { DollarSign, Users, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../components/common/Card';
import { formatRupiah, formatDate } from '../utils/formatters';
import { mockTransactions, mockStudents } from '../data/mockData';
import { Transaction } from '../types';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-500 dark:text-primary-300">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
    {change && (
        <div className={`mt-2 flex items-center text-sm ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
            {change}
        </div>
    )}
  </Card>
);

const DashboardPage: React.FC = () => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

    const { totalPemasukanHariIni, jumlahTransaksiHariIni } = useMemo(() => {
        const todaysTransactions = mockTransactions.filter(t => t.createdAt >= startOfToday && t.status === 'Lunas');
        return {
            totalPemasukanHariIni: todaysTransactions.reduce((acc, t) => acc + t.total, 0),
            jumlahTransaksiHariIni: todaysTransactions.length
        };
    }, [startOfToday]);

    const incomeLast7Days = useMemo(() => {
        const data: { name: string; Pemasukan: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });

            const dailyIncome = mockTransactions
                .filter(t => t.createdAt.startsWith(dayStr) && t.status === 'Lunas')
                .reduce((acc, t) => acc + t.total, 0);
            
            data.push({ name: dayName, Pemasukan: dailyIncome });
        }
        return data;
    }, []);

    const recentTransactions = mockTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pemasukan Hari Ini" value={formatRupiah(totalPemasukanHariIni)} icon={<DollarSign />} change="vs kemarin" changeType="increase" />
        <StatCard title="Transaksi Hari Ini" value={jumlahTransaksiHariIni.toString()} icon={<ShoppingCart />} change="vs kemarin" changeType="decrease" />
        <StatCard title="Jumlah Siswa" value={mockStudents.length.toString()} icon={<Users />} />
        <StatCard title="Pembayaran Tertunda" value={mockTransactions.filter(t => t.status === 'Pending').length.toString()} icon={<DollarSign />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Pemasukan 7 Hari Terakhir</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeLast7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatRupiah(Number(value))} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }} labelStyle={{ color: '#fff' }} formatter={(value) => [formatRupiah(Number(value)), "Pemasukan"]} />
                    <Legend />
                    <Bar dataKey="Pemasukan" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </Card>

        <Card>
            <h2 className="text-lg font-semibold mb-4">5 Transaksi Terakhir</h2>
            <div className="space-y-4">
                {recentTransactions.map(tx => (
                    <div key={tx.id} className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-sm">{tx.studentName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.createdAt)}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm">{formatRupiah(tx.total)}</p>
                            <span className={getStatusBadge(tx.status)}>{tx.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
