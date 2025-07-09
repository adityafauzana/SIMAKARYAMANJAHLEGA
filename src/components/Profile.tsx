import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Edit, 
  Save, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: user?.profilePhoto || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = () => {
    if (!profileData.name) {
      alert('Nama harus diisi');
      return;
    }

    if (user) {
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        profilePhoto: profileData.profilePhoto
      };
      updateUser(updatedUser);
      setIsEditing(false);
      alert('Profil berhasil diperbarui');
    }
  };

  const handlePasswordUpdate = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Semua field password harus diisi');
      return;
    }

    if (passwordData.currentPassword !== user?.password) {
      alert('Password saat ini tidak benar');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter');
      return;
    }

    if (user) {
      const updatedUser = {
        ...user,
        password: passwordData.newPassword
      };
      updateUser(updatedUser);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      alert('Password berhasil diperbarui');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData(prev => ({
            ...prev,
            profilePhoto: event.target?.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi profil dan pengaturan akun Anda</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Informasi Profil</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Batal' : 'Edit Profil'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profileData.profilePhoto ? (
                  <img 
                    src={profileData.profilePhoto} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-500" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-1 ${getRoleBadgeColor(user?.role || '')}`}>
                {getRoleDisplay(user?.role || '')}
              </span>
              {user?.bidang && (
                <p className="text-gray-600 mt-1">{user.bidang}</p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NRP
              </label>
              <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.nrp}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan email"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                  {profileData.email || 'Belum diisi'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                  {profileData.phone || 'Belum diisi'}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleProfileUpdate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Keamanan Akun</h2>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            {showPasswordForm ? 'Batal' : 'Ubah Password'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Password
              </button>
            </div>
          </div>
        )}

        {!showPasswordForm && (
          <div className="text-sm text-gray-600">
            <p>Password terakhir diubah: Belum pernah diubah</p>
            <p className="mt-1">Untuk keamanan akun, disarankan mengubah password secara berkala.</p>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Akun</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Jabatan</p>
            <p className="text-gray-900 mt-1">{getRoleDisplay(user?.role || '')}</p>
          </div>
          
          {user?.bidang && (
            <div>
              <p className="text-sm font-medium text-gray-700">Bidang</p>
              <p className="text-gray-900 mt-1">{user.bidang}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-700">Status Akun</p>
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mt-1">
              Aktif
            </span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Bergabung Sejak</p>
            <p className="text-gray-900 mt-1">Januari 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;