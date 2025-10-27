import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { Student } from '../types';
import { KELAS_OPTIONS } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const StudentForm: React.FC<{ student: Partial<Student> | null; onClose: () => void; onSave: (student: Partial<Student>) => void }> = ({ student, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Student>>(student || {
        nis: '',
        nama: '',
        kelas: KELAS_OPTIONS[0],
        noTelpWali: '',
        emailWali: '',
        alamat: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="NIS" name="nis" value={formData.nis} onChange={handleChange} required />
            <Input label="Nama Lengkap" name="nama" value={formData.nama} onChange={handleChange} required />
            <div>
                 <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
                 <select id="kelas" name="kelas" value={formData.kelas} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                    {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
            </div>
            <Input label="Nomor Telepon Wali" name="noTelpWali" value={formData.noTelpWali} onChange={handleChange} required />
            <Input label="Email Wali (Opsional)" name="emailWali" type="email" value={formData.emailWali} onChange={handleChange} />
            <div>
                 <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat (Opsional)</label>
                 <textarea id="alamat" name="alamat" value={formData.alamat} onChange={handleChange} rows={3} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                <Button type="submit">Simpan</Button>
            </div>
        </form>
    );
};


const StudentsPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKelas, setFilterKelas] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const appContext = useContext(AppContext);
    const authContext = useContext(AuthContext);
    const userRole = authContext?.user?.role;

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            appContext?.addNotification('Gagal memuat data siswa', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [appContext]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const filteredStudents = useMemo(() => {
        return students
            .filter(s => s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm))
            .filter(s => filterKelas === '' || s.kelas === filterKelas);
    }, [students, searchTerm, filterKelas]);
    
    const handleAddStudent = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditStudent = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleSaveStudent = async (studentData: Partial<Student>) => {
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent.id}`, studentData);
                appContext?.addNotification('Data siswa berhasil diperbarui', 'success');
            } else {
                await api.post('/students', studentData);
                appContext?.addNotification('Siswa baru berhasil ditambahkan', 'success');
            }
            fetchStudents(); // Re-fetch data
            setIsModalOpen(false);
        } catch (error) {
            appContext?.addNotification('Gagal menyimpan data siswa', 'error');
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
            try {
                await api.delete(`/students/${studentId}`);
                appContext?.addNotification('Data siswa berhasil dihapus', 'success');
                fetchStudents(); // Re-fetch data
            } catch (error) {
                 appContext?.addNotification('Gagal menghapus data siswa', 'error');
            }
        }
    }


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manajemen Data Siswa</h1>
        {userRole === 'admin' && (
            <Button onClick={handleAddStudent}>
              <Plus size={16} className="mr-2" />
              Tambah Siswa
            </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input 
            placeholder="Cari NIS atau Nama..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} className="text-gray-400"/>}
            className="flex-grow"
          />
          <select 
            value={filterKelas} 
            onChange={(e) => setFilterKelas(e.target.value)} 
            className="block w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="">Semua Kelas</option>
            {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? <p>Loading data...</p> : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">NIS</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No. Telp Wali</th>
                {userRole === 'admin' && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.nis}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.kelas}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.noTelpWali}</td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEditStudent(student)}><Edit size={14}/></Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteStudent(student.id)}><Trash2 size={14}/></Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </Card>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
      >
        <StudentForm 
            student={editingStudent}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveStudent}
        />
      </Modal>
    </div>
  );
};

export default StudentsPage;
