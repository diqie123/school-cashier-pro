
import React, { useState, useContext } from 'react';
import { Settings } from '../types';
import { mockSettings } from '../data/mockData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { AppContext } from '../contexts/AppContext';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const appContext = useContext(AppContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
        ...prev,
        nominalSPP: {
            ...prev.nominalSPP,
            [name]: Number(value)
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call
    console.log('Saving settings:', settings);
    appContext?.addNotification('Pengaturan berhasil disimpan', 'success');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Profil Sekolah</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nama Sekolah" name="namaSekolah" value={settings.namaSekolah} onChange={handleChange} />
            <Input label="Telepon" name="telepon" value={settings.telepon} onChange={handleChange} />
            <Input label="Alamat" name="alamat" value={settings.alamat} onChange={handleChange} className="md:col-span-2" />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Pengaturan Aplikasi</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input label="Tahun Ajaran Aktif" name="tahunAjaran" value={settings.tahunAjaran} onChange={handleChange} />
             <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nominal SPP Default</h3>
                <div className="space-y-2 mt-2">
                    {Object.entries(settings.nominalSPP).map(([kelas, nominal]) => (
                        <Input key={kelas} label={`Kelas ${kelas}`} name={kelas} type="number" value={nominal} onChange={handleSppChange} />
                    ))}
                </div>
             </div>
          </div>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit">Simpan Pengaturan</Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
