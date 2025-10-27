
import React from 'react';
import { Transaction, Settings } from '../../types';
import { formatRupiah, formatDateTime } from '../../utils/formatters';

interface ReceiptProps {
  transaction: Transaction;
  settings: Settings;
}

const Receipt: React.FC<ReceiptProps> = ({ transaction, settings }) => {
  return (
    <div className="p-4 bg-white text-black font-mono text-xs max-w-xs mx-auto border-2 border-dashed border-gray-400">
      <div className="text-center space-y-1 mb-3 border-b-2 border-dashed border-gray-400 pb-2">
        <h1 className="font-bold text-base">{settings.namaSekolah}</h1>
        <p>{settings.alamat}</p>
        <p>Telp: {settings.telepon}</p>
      </div>
      
      <h2 className="text-center font-bold mb-3">BUKTI PEMBAYARAN</h2>
      
      <div>
        <p>ID Transaksi: {transaction.transactionCode}</p>
        <p>Tanggal     : {formatDateTime(transaction.createdAt)}</p>
      </div>
      
      <div className="my-3 border-t-2 border-dashed border-gray-400 pt-2">
        <p className="font-bold">Data Siswa:</p>
        <p>NIS  : {transaction.studentNis}</p>
        <p>Nama : {transaction.studentName}</p>
        <p>Kelas: {transaction.studentKelas}</p>
      </div>
      
      <div className="my-3 border-t-2 border-dashed border-gray-400 pt-2">
        <p className="font-bold">Rincian Pembayaran:</p>
        {transaction.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{index + 1}. {item.jenisPembayaran}</span>
            <span>{formatRupiah(item.nominal)}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-gray-400 my-1"></div>
        <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(transaction.subtotal)}</span>
        </div>
        {transaction.diskon > 0 && (
            <div className="flex justify-between">
                <span>Diskon</span>
                <span>-{formatRupiah(transaction.diskon)}</span>
            </div>
        )}
        <div className="border-t border-dashed border-gray-400 my-1"></div>
         <div className="flex justify-between font-bold">
            <span>TOTAL BAYAR</span>
            <span>{formatRupiah(transaction.total)}</span>
        </div>
      </div>
      
      <div className="my-3 border-t-2 border-dashed border-gray-400 pt-2">
         <p>Metode Pembayaran: {transaction.metodePembayaran}</p>
         {transaction.metodePembayaran === 'Tunai' && (
             <>
                <p>Uang Diterima: {formatRupiah(transaction.uangDiterima || 0)}</p>
                <p>Kembalian    : {formatRupiah(transaction.kembalian || 0)}</p>
             </>
         )}
      </div>

       <div className="my-3 border-t-2 border-dashed border-gray-400 pt-2 text-center space-y-1">
        <p>Petugas Kasir: {transaction.kasir}</p>
        <p>Terima kasih atas pembayarannya.</p>
        <p>Simpan struk ini sebagai bukti pembayaran.</p>
      </div>
    </div>
  );
};

export default Receipt;
