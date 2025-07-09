import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  Trash2,
  UserPlus,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';

const Members: React.FC = () => {
  const { user } = useAuth();
  const { users, addUser, deleteUser, updateUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterBidang, setFilterBidang] = useState('all');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [newMember, setNewMember] = useState({
    nrp: '',
    name: '',
    role: 'anggota' as 'ketua' | 'sekretaris' | 'bendahara' | 'wakil-sekretaris' | 'kepala-bidang' | 'ketua-unit-teknis-rw-1' | 'ketua-unit-teknis-rw-2' | 'ketua-unit-teknis-rw-3' | 'ketua-unit-teknis-rw-4' | 'ketua-unit-teknis-rw-5' | 'ketua-unit-teknis-rw-6' | 'ketua-unit-teknis-rw-7' | 'ketua-unit-teknis-rw-8' | 'ketua-unit-teknis-rw-9' | 'ketua-unit-teknis-rw-10' | 'ketua-unit-teknis-rw-11' | 'ketua-unit-teknis-rw-12' | 'ketua-unit-teknis-rw-13' | 'ketua-unit-teknis-rw-14' | 'ketua-unit-teknis-rw-15' | 'ketua-unit-teknis-rw-16' | 'anggota',
    bidang: '',
    password: '123321',
    email: '',
    phone: ''
  });

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'ketua': 'Ketua',
      'sekretaris': 'Sekretaris',
      'bendahara': 'Bendahara',
      'wakil-sekretaris': 'Wakil Sekretaris',
      'kepala-bidang': 'Kepala Bidang',
      'ketua-unit-teknis-rw-1': 'Ketua Unit Teknis RW 1',
      'ketua-unit-teknis-rw-2': 'Ketua Unit Teknis RW 2',
      'ketua-unit-teknis-rw-3': 'Ketua Unit Teknis RW 3',
      'ketua-unit-teknis-rw-4': 'Ketua Unit Teknis RW 4',
      'ketua-unit-teknis-rw-5': 'Ketua Unit Teknis RW 5',
      'ketua-unit-teknis-rw-6': 'Ketua Unit Teknis RW 6',
      'ketua-unit-teknis-rw-7': 'Ketua Unit Teknis RW 7',
      'ketua-unit-teknis-rw-8': 'Ketua Unit Teknis RW 8',
      'ketua-unit-teknis-rw-9': 'Ketua Unit Teknis RW 9',
      'ketua-unit-teknis-rw-10': 'Ketua Unit Teknis RW 10',
      'ketua-unit-teknis-rw-11': 'Ketua Unit Teknis RW 11',
      'ketua-unit-teknis-rw-12': 'Ketua Unit Teknis RW 12',
      'ketua-unit-teknis-rw-13': 'Ketua Unit Teknis RW 13',
      'ketua-unit-teknis-rw-14': 'Ketua Unit Teknis RW 14',
      'ketua-unit-teknis-rw-15': 'Ketua Unit Teknis RW 15',
      'ketua-unit-teknis-rw-16': 'Ketua Unit Teknis RW 16',
      'anggota': 'Anggota'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ketua':
        return 'bg-purple-100 text-purple-800';
      case 'sekretaris':
      case 'bendahara':
      case 'wakil-sekretaris':
        return 'bg-blue-100 text-blue-800';
      case 'kepala-bidang':
        return 'bg-green-100 text-green-800';
      case 'ketua-unit-teknis-rw-1':
      case 'ketua-unit-teknis-rw-2':
      case 'ketua-unit-teknis-rw-3':
      case 'ketua-unit-teknis-rw-4':
      case 'ketua-unit-teknis-rw-5':
      case 'ketua-unit-teknis-rw-6':
      case 'ketua-unit-teknis-rw-7':
      case 'ketua-unit-teknis-rw-8':
      case 'ketua-unit-teknis-rw-9':
      case 'ketua-unit-teknis-rw-10':
      case 'ketua-unit-teknis-rw-11':
      case 'ketua-unit-teknis-rw-12':
      case 'ketua-unit-teknis-rw-13':
      case 'ketua-unit-teknis-rw-14':
      case 'ketua-unit-teknis-rw-15':
      case 'ketua-unit-teknis-rw-16':
        return 'bg-orange-100 text-orange-800';
      case 'anggota':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueBidangs = () => {
    const bidangs = [
      'Keorganisasian dan Pengembangan Sumber Daya Manusia',
      'Sosial Kemasyarakatan',
      'Humas dan Kemitraan',
      'Usaha Ekonomi Produktif',
      'Pemuda dan Olahraga',
      'Karang Taruna Unit Teknis RW 1',
      'Karang Taruna Unit Teknis RW 2',
      'Karang Taruna Unit Teknis RW 3',
      'Karang Taruna Unit Teknis RW 4',
      'Karang Taruna Unit Teknis RW 5',
      'Karang Taruna Unit Teknis RW 6',
      'Karang Taruna Unit Teknis RW 7',
      'Karang Taruna Unit Teknis RW 8',
      'Karang Taruna Unit Teknis RW 9',
      'Karang Taruna Unit Teknis RW 10',
      'Karang Taruna Unit Teknis RW 11',
      'Karang Taruna Unit Teknis RW 12',
      'Karang Taruna Unit Teknis RW 13',
      'Karang Taruna Unit Teknis RW 14',
      'Karang Taruna Unit Teknis RW 15',
      'Karang Taruna Unit Teknis RW 16'
    ];
    return bidangs;
  };

  const generateNRP = () => {
    const currentYear = new Date().getFullYear();
    const existingNRPs = users.map(u => parseInt(u.nrp.slice(-3)));
    const maxNumber = Math.max(...existingNRPs, 0);
    const newNumber = (maxNumber + 1).toString().padStart(3, '0');
    return `${currentYear}${newNumber}`;
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.nrp) {
      alert('Nama dan NRP harus diisi');
      return;
    }

    // Check if NRP already exists
    if (users.find(u => u.nrp === newMember.nrp)) {
      alert('NRP sudah digunakan, silakan gunakan NRP lain');
      return;
    }

    // Validate bidang for certain roles
    const rolesRequiringBidang = [
      'kepala-bidang', 
      'ketua-unit-teknis-rw-1', 'ketua-unit-teknis-rw-2', 'ketua-unit-teknis-rw-3', 'ketua-unit-teknis-rw-4',
      'ketua-unit-teknis-rw-5', 'ketua-unit-teknis-rw-6', 'ketua-unit-teknis-rw-7', 'ketua-unit-teknis-rw-8',
      'ketua-unit-teknis-rw-9', 'ketua-unit-teknis-rw-10', 'ketua-unit-teknis-rw-11', 'ketua-unit-teknis-rw-12',
      'ketua-unit-teknis-rw-13', 'ketua-unit-teknis-rw-14', 'ketua-unit-teknis-rw-15', 'ketua-unit-teknis-rw-16',
      'anggota'
    ];
    
    if (rolesRequiringBidang.includes(newMember.role) && !newMember.bidang) {
      alert('Bidang harus dipilih untuk Kepala Bidang, Ketua Unit Teknis RW, dan Anggota');
      return;
    }

    const memberToAdd = {
      ...newMember,
      bidang: rolesRequiringBidang.includes(newMember.role) ? newMember.bidang : undefined
    };

    addUser(memberToAdd);
    
    setNewMember({
      nrp: '',
      name: '',
      role: 'anggota',
      bidang: '',
      password: '123321',
      email: '',
      phone: ''
    });
    setShowAddForm(false);
    alert('Anggota berhasil ditambahkan');
  };

  const handleDeleteMember = (memberNRP: string, memberName: string) => {
    // Prevent deleting the current user
    if (memberNRP === user?.nrp) {
      alert('Anda tidak dapat menghapus akun Anda sendiri');
      return;
    }

    // Prevent deleting the only Ketua
    const member = users.find(u => u.nrp === memberNRP);
    if (member?.role === 'ketua') {
      const ketuaCount = users.filter(u => u.role === 'ketua').length;
      if (ketuaCount <= 1) {
        alert('Tidak dapat menghapus Ketua terakhir. Harus ada minimal satu Ketua.');
        return;
      }
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${memberName} dari sistem?\n\nPeringatan: Semua data aktivitas, laporan, dan tugas yang terkait dengan anggota ini akan tetap ada tetapi tidak dapat diakses lagi.`)) {
      deleteUser(memberNRP);
      setShowDeleteConfirm(null);
      alert(`${memberName} berhasil dihapus dari sistem`);
    }
  };

  const filteredMembers = users.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nrp.includes(searchTerm);
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesBidang = filterBidang === 'all' || member.bidang === filterBidang;
    
    return matchesSearch && matchesRole && matchesBidang;
  });

  const getStatistics = () => {
    const total = users.length;
    const byRole = {
      ketua: users.filter(u => u.role === 'ketua').length,
      sekretariat: users.filter(u => ['sekretaris', 'bendahara', 'wakil-sekretaris'].includes(u.role)).length,
      kepalaBidang: users.filter(u => u.role === 'kepala-bidang').length,
      ketuaUnitTeknis: users.filter(u => u.role.startsWith('ketua-unit-teknis-rw-')).length,
      anggota: users.filter(u => u.role === 'anggota').length
    };
    
    return { total, byRole };
  };

  const stats = getStatistics();

  const isKetuaUnitTeknisRole = (role: string) => {
    return role.startsWith('ketua-unit-teknis-rw-');
  };

  const rolesRequiringBidang = [
    'kepala-bidang', 
    'ketua-unit-teknis-rw-1', 'ketua-unit-teknis-rw-2', 'ketua-unit-teknis-rw-3', 'ketua-unit-teknis-rw-4',
    'ketua-unit-teknis-rw-5', 'ketua-unit-teknis-rw-6', 'ketua-unit-teknis-rw-7', 'ketua-unit-teknis-rw-8',
    'ketua-unit-teknis-rw-9', 'ketua-unit-teknis-rw-10', 'ketua-unit-teknis-rw-11', 'ketua-unit-teknis-rw-12',
    'ketua-unit-teknis-rw-13', 'ketua-unit-teknis-rw-14', 'ketua-unit-teknis-rw-15', 'ketua-unit-teknis-rw-16',
    'anggota'
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Anggota</h1>
          <p className="text-gray-600">Kelola data anggota dan pengurus Karang Taruna</p>
        </div>
        {user?.role === 'ketua' && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Anggota
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Anggota</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sekretariat</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.byRole.ketua + stats.byRole.sekretariat}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kepala Bidang</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.byRole.kepalaBidang}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ketua Unit RW</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.byRole.ketuaUnitTeknis}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Anggota Bidang</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.byRole.anggota}</p>
            </div>
            <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau NRP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Jabatan</option>
              <option value="ketua">Ketua</option>
              <option value="sekretaris">Sekretaris</option>
              <option value="bendahara">Bendahara</option>
              <option value="wakil-sekretaris">Wakil Sekretaris</option>
              <option value="kepala-bidang">Kepala Bidang</option>
              {Array.from({length: 16}, (_, i) => i + 1).map(num => (
                <option key={num} value={`ketua-unit-teknis-rw-${num}`}>
                  Ketua Unit Teknis RW {num}
                </option>
              ))}
              <option value="anggota">Anggota</option>
            </select>

            <select
              value={filterBidang}
              onChange={(e) => setFilterBidang(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Bidang</option>
              {getUniqueBidangs().map(bidang => (
                <option key={bidang} value={bidang}>{bidang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Member Form Modal */}
      {showAddForm && user?.role === 'ketua' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Tambah Anggota Baru</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NRP (Nomor Registrasi Pengurus)
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={newMember.nrp}
                        onChange={(e) => setNewMember({ ...newMember, nrp: e.target.value })}
                        className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: 20250039"
                      />
                      <button
                        onClick={() => setNewMember({ ...newMember, nrp: generateNRP() })}
                        className="px-3 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jabatan
                    </label>
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="anggota">Anggota</option>
                      <option value="kepala-bidang">Kepala Bidang</option>
                      {Array.from({length: 16}, (_, i) => i + 1).map(num => (
                        <option key={num} value={`ketua-unit-teknis-rw-${num}`}>
                          Ketua Unit Teknis RW {num}
                        </option>
                      ))}
                      <option value="wakil-sekretaris">Wakil Sekretaris</option>
                      <option value="bendahara">Bendahara</option>
                      <option value="sekretaris">Sekretaris</option>
                      <option value="ketua">Ketua</option>
                    </select>
                  </div>

                  {rolesRequiringBidang.includes(newMember.role) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bidang
                      </label>
                      <select
                        value={newMember.bidang}
                        onChange={(e) => setNewMember({ ...newMember, bidang: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Pilih Bidang</option>
                        {getUniqueBidangs().map(bidang => (
                          <option key={bidang} value={bidang}>{bidang}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon (Opsional)
                    </label>
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Default
                  </label>
                  <input
                    type="text"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Password default"
                  />
                  <p className="text-xs text-gray-500 mt-1">Password default: 123321 (dapat diubah oleh anggota setelah login)</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddMember}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Anggota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.nrp} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {member.profilePhoto ? (
                        <img 
                          src={member.profilePhoto} 
                          alt={member.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">NRP: {member.nrp}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {user?.role === 'ketua' && member.nrp !== user.nrp && (
                      <button
                        onClick={() => handleDeleteMember(member.nrp, member.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Anggota"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(member.role)}`}>
                    {getRoleDisplay(member.role)}
                  </span>
                  
                  {member.bidang && (
                    <p className="text-sm text-gray-600 mt-2">{member.bidang}</p>
                  )}
                  
                  {member.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {member.email}
                    </div>
                  )}
                  
                  {member.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {member.phone}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada anggota yang ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detail Anggota</h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    {selectedMember.profilePhoto ? (
                      <img 
                        src={selectedMember.profilePhoto} 
                        alt={selectedMember.name} 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getRoleBadgeColor(selectedMember.role)}`}>
                      {getRoleDisplay(selectedMember.role)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Informasi Dasar</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">NRP</p>
                        <p className="text-gray-900">{selectedMember.nrp}</p>
                      </div>
                      {selectedMember.bidang && (
                        <div>
                          <p className="text-xs text-gray-500">Bidang</p>
                          <p className="text-gray-900">{selectedMember.bidang}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Kontak</h4>
                    <div className="space-y-3">
                      {selectedMember.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedMember.email}</span>
                        </div>
                      )}
                      {selectedMember.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedMember.phone}</span>
                        </div>
                      )}
                      {!selectedMember.email && !selectedMember.phone && (
                        <p className="text-gray-500 text-sm">Informasi kontak belum tersedia</p>
                      )}
                    </div>
                  </div>
                </div>

                {user?.role === 'ketua' && selectedMember.nrp !== user.nrp && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleDeleteMember(selectedMember.nrp, selectedMember.name)}
                      className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus Anggota
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for Ketua */}
      {user?.role === 'ketua' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Peringatan Manajemen Anggota</h3>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Anda tidak dapat menghapus akun Anda sendiri</li>
                <li>• Sistem harus memiliki minimal satu Ketua</li>
                <li>• Data aktivitas dan laporan anggota yang dihapus akan tetap ada tetapi tidak dapat diakses</li>
                <li>• Pastikan untuk membackup data penting sebelum menghapus anggota</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;