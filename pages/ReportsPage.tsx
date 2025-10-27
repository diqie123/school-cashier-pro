
import React, { useMemo } from 'react';
import Card from '../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { formatRupiah } from '../utils/formatters';
import { mockTransactions } from '../data/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsPage: React.FC = () => {
  const monthlyBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {};
    mockTransactions.forEach(tx => {
      tx.items.forEach(item => {
        if (tx.status === 'Lunas') {
          breakdown[item.jenisPembayaran] = (breakdown[item.jenisPembayaran] || 0) + item.nominal;
        }
      });
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, []);
  
  const dailyTrend = useMemo(() => {
    const data: { name: string; Pemasukan: number }[] = [];
    const daysInMonth = 30;
    for (let i = daysInMonth - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('id-ID', { day: '2-digit' });

        const dailyIncome = mockTransactions
            .filter(t => t.createdAt.startsWith(dayStr) && t.status === 'Lunas')
            .reduce((acc, t) => acc + t.total, 0);
        
        data.push({ name: dayName, Pemasukan: dailyIncome });
    }
    return data.slice(-15); // Show last 15 days
}, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laporan</h1>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4">Laporan Pemasukan Bulanan</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1">
                 <h3 className="text-lg font-semibold mb-2 text-center">Breakdown per Jenis Pembayaran</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={monthlyBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {monthlyBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value) => formatRupiah(Number(value))}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          
            <div className="lg:col-span-2">
                 <h3 className="text-lg font-semibold mb-2">Trend Harian</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }} labelStyle={{ color: '#fff' }} formatter={(value) => [formatRupiah(Number(value)), "Pemasukan"]}/>
                        <Bar dataKey="Pemasukan" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
        </div>
      </Card>
      
      <Card>
          <h2 className="text-xl font-semibold mb-4">Generate Laporan Custom</h2>
          <p className="text-gray-600 dark:text-gray-400">Fitur laporan custom akan segera tersedia.</p>
      </Card>
    </div>
  );
};

export default ReportsPage;
