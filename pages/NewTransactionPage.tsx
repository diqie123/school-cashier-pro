
import React, { useState, useMemo, useContext } from 'react';
import { Student, TransactionItem, Settings } from '../types';
import { mockStudents, mockSettings } from '../data/mockData';
import { formatRupiah } from '../utils/formatters';
import { PAYMENT_TYPES, PAYMENT_METHODS } from '../constants';
import { Search, User, Plus, Trash2, CheckCircle, Printer } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { AppContext } from '../contexts/AppContext';
import Receipt from '../components/transactions/Receipt';

type Step = 'select-student' | 'payment-details' | 'confirmation' | 'success';

const NewTransactionPage: React.FC = () => {
    const [step, setStep] = useState<Step>('select-student');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [items, setItems] = useState<TransactionItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'E-Wallet'>('Tunai');
    const [uangDiterima, setUangDiterima] = useState(0);
    const [diskon, setDiskon] = useState(0);
    const [lastTransactionCode, setLastTransactionCode] = useState<string | null>(null);

    const appContext = useContext(AppContext);
    
    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return mockStudents.filter(s => s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm)).slice(0, 5);
    }, [searchTerm]);

    const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.nominal, 0), [items]);
    const total = useMemo(() => subtotal - diskon, [subtotal, diskon]);
    const kembalian = useMemo(() => (paymentMethod === 'Tunai' ? uangDiterima - total : 0), [uangDiterima, total, paymentMethod]);

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setStep('payment-details');
    };

    const handleAddItem = (type: string) => {
        let nominal = 150000; // Default
        if (type === 'SPP' && selectedStudent) {
            const grade = selectedStudent.kelas.split('-')[0];
            nominal = mockSettings.nominalSPP[grade] || 500000;
        }
        setItems([...items, { jenisPembayaran: type, deskripsi: '', nominal }]);
    };
    
    const handleUpdateItem = (index: number, field: keyof TransactionItem, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };
    
    const processPayment = () => {
        if (!selectedStudent || items.length === 0) {
            appContext?.addNotification('Siswa dan item pembayaran harus diisi', 'error');
            return;
        }
        const today = new Date().toISOString().slice(0,10).replace(/-/g,"");
        const newCode = `TRX-${today}-${String(Date.now()).slice(-4)}`;
        setLastTransactionCode(newCode);

        // Here you would normally call an API to save the transaction
        console.log("Processing payment...", { selectedStudent, items, total, paymentMethod });
        appContext?.addNotification('Pembayaran berhasil diproses', 'success');
        setStep('success');
    }

    const startNewTransaction = () => {
        setStep('select-student');
        setSearchTerm('');
        setSelectedStudent(null);
        setItems([]);
        setPaymentMethod('Tunai');
        setUangDiterima(0);
        setDiskon(0);
        setLastTransactionCode(null);
    }
    
    const handlePrint = () => {
        const printContents = document.getElementById('receipt-component')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // To re-attach React
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaksi Baru</h1>
            
            {step === 'select-student' && (
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Langkah 1: Pilih Siswa</h2>
                    <div className="relative">
                        <Input 
                            placeholder="Cari berdasarkan NIS atau Nama"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            icon={<Search size={16} className="text-gray-400" />}
                        />
                        {searchResults.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg">
                                {searchResults.map(s => (
                                    <li key={s.id} onClick={() => handleSelectStudent(s)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <p className="font-semibold">{s.nama}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.nis} - {s.kelas}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>
            )}

            {(step === 'payment-details' || step === 'confirmation') && selectedStudent && (
                 <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold">Siswa Terpilih</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <img src={selectedStudent.fotoUrl || `https://i.pravatar.cc/150?u=${selectedStudent.id}`} alt={selectedStudent.nama} className="w-16 h-16 rounded-full"/>
                                <div>
                                    <p className="font-bold text-lg">{selectedStudent.nama}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{selectedStudent.nis} / {selectedStudent.kelas}</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => setStep('select-student')}>Ganti Siswa</Button>
                    </div>
                 </Card>
            )}

            {step === 'payment-details' && (
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Langkah 2: Detail Pembayaran</h2>
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                                <input type="text" value={item.jenisPembayaran} readOnly className="col-span-1 md:col-span-2 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm bg-gray-100 dark:bg-gray-800"/>
                                <Input type="number" placeholder="Nominal" value={item.nominal} onChange={e => handleUpdateItem(index, 'nominal', Number(e.target.value))} />
                                <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)}><Trash2 size={16} /></Button>
                            </div>
                        ))}
                    </div>
                     <div className="flex flex-wrap gap-2 mt-4">
                        {PAYMENT_TYPES.map(type => (
                            <Button key={type} variant="secondary" size="sm" onClick={() => handleAddItem(type)}>
                                <Plus size={14} className="mr-1" /> {type}
                            </Button>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button onClick={() => setStep('confirmation')} disabled={items.length === 0}>Lanjut ke Konfirmasi</Button>
                    </div>
                </Card>
            )}

            {step === 'confirmation' && (
                 <Card>
                    <h2 className="text-xl font-semibold mb-4">Langkah 3: Konfirmasi</h2>
                    <div className="space-y-4">
                         {/* Payment summary */}
                         <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 space-y-2">
                            {items.map((it, i) => <div key={i} className="flex justify-between"><p>{it.jenisPembayaran}</p><p>{formatRupiah(it.nominal)}</p></div>)}
                            <div className="flex justify-between font-bold"><p>Subtotal</p><p>{formatRupiah(subtotal)}</p></div>
                             <div className="flex justify-between"><p>Diskon</p><Input type="number" value={diskon} onChange={e => setDiskon(Number(e.target.value))} className="w-32 text-right" /></div>
                             <div className="flex justify-between font-bold text-lg text-primary-600 dark:text-primary-400"><p>Total</p><p>{formatRupiah(total)}</p></div>
                         </div>
                        
                         {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium">Metode Pembayaran</label>
                            <div className="mt-1 flex gap-2">
                                {PAYMENT_METHODS.map(method => (
                                    <Button key={method} variant={paymentMethod === method ? 'primary' : 'secondary'} onClick={() => setPaymentMethod(method)}>{method}</Button>
                                ))}
                            </div>
                        </div>

                        {paymentMethod === 'Tunai' && (
                            <div>
                                <Input label="Uang Diterima" type="number" value={uangDiterima} onChange={e => setUangDiterima(Number(e.target.value))} />
                                <p className={`mt-2 ${kembalian < 0 ? 'text-red-500' : 'text-green-500'}`}>Kembalian: {formatRupiah(kembalian)}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-4">
                             <Button variant="secondary" onClick={() => setStep('payment-details')}>Kembali</Button>
                             <Button onClick={processPayment} disabled={paymentMethod === 'Tunai' && kembalian < 0}>Proses Pembayaran</Button>
                        </div>
                    </div>
                 </Card>
            )}
            
             {step === 'success' && selectedStudent && lastTransactionCode && (
                <Card className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h2 className="mt-2 text-2xl font-semibold">Pembayaran Berhasil!</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Transaksi untuk {selectedStudent.nama} telah berhasil diproses.</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Button onClick={handlePrint} variant="secondary">
                            <Printer size={16} className="mr-2" /> Cetak Struk
                        </Button>
                        <Button onClick={startNewTransaction}>
                            Transaksi Baru
                        </Button>
                    </div>
                    <div id="receipt-component" className="hidden">
                        <Receipt transaction={{
                             id: 'temp-id',
                             transactionCode: lastTransactionCode,
                             studentId: selectedStudent.id,
                             studentName: selectedStudent.nama,
                             studentNis: selectedStudent.nis,
                             studentKelas: selectedStudent.kelas,
                             items: items,
                             subtotal: subtotal,
                             diskon: diskon,
                             total: total,
                             metodePembayaran: paymentMethod,
                             uangDiterima: paymentMethod === 'Tunai' ? uangDiterima : undefined,
                             kembalian: paymentMethod === 'Tunai' ? kembalian : undefined,
                             status: 'Lunas',
                             kasir: 'Admin (Siti Nurhaliza)',
                             createdAt: new Date().toISOString()
                        }} settings={mockSettings} />
                    </div>
                </Card>
             )}

        </div>
    );
};

export default NewTransactionPage;
