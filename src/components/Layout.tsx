import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Menu, 
  X, 
  Home, 
  Activity, 
  FileText, 
  Bell, 
  Users, 
  CheckSquare, 
  User,
  LogOut,
  BarChart3,
  Wifi,
  WifiOff,
  RefreshCw,
  Zap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { tasks, isOnline, lastSyncTime, syncData, forceRefresh } = useData();
  const [taskNotificationCount, setTaskNotificationCount] = useState(0);
  const [showSyncStatus, setShowSyncStatus] = useState(false);

  // Real-time task notification counter
  useEffect(() => {
    if (user) {
      const userTasks = tasks.filter(task => task.assignedTo === user.name);
      const newTasks = userTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        const now = new Date();
        const timeDiff = now.getTime() - taskDate.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        return hoursDiff < 24 && task.status === 'pending'; // Tasks created in last 24 hours
      });
      setTaskNotificationCount(newTasks.length);
    }
  }, [tasks, user]);

  // Show sync status temporarily when data changes
  useEffect(() => {
    if (lastSyncTime) {
      setShowSyncStatus(true);
      const timer = setTimeout(() => setShowSyncStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSyncTime]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'activities', label: 'Aktivitas Kegiatan', icon: Activity },
    { id: 'reports', label: 'Laporan Kinerja', icon: FileText },
    { id: 'announcements', label: 'Pengumuman', icon: Bell },
    { 
      id: 'tasks', 
      label: 'Tugas', 
      icon: CheckSquare,
      notification: taskNotificationCount > 0 ? taskNotificationCount : undefined
    },
    { id: 'members', label: 'Anggota', icon: Users },
    { id: 'statistics', label: 'Statistik', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: User },
  ];

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 ml-2">SIMAKARYA</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{getRoleDisplay(user?.role || '')}</p>
                  {user?.bidang && (
                    <p className="text-xs text-gray-400 mt-1">{user.bidang}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time Sync Status */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span className="text-xs text-gray-600">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <button
                  onClick={syncData}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Sync Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {lastSyncTime && (
                <p className="text-xs text-gray-400 mt-1">
                  Sync: {lastSyncTime}
                </p>
              )}
              {showSyncStatus && (
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <Zap className="w-3 h-3 mr-1" />
                  Data tersinkronisasi
                </div>
              )}
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </div>
                    {item.notification && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center animate-pulse">
                        {item.notification}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">SIMAKARYA</h1>
            <div className="flex items-center space-x-2">
              {/* Online/Offline indicator */}
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              
              {/* Task notifications */}
              {taskNotificationCount > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-500" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                    {taskNotificationCount}
                  </span>
                </div>
              )}
              
              {/* Sync button */}
              <button
                onClick={syncData}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Sync Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Real-time sync notification banner */}
        {showSyncStatus && (
          <div className="bg-green-50 border-b border-green-200 px-4 py-2">
            <div className="flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Data berhasil tersinkronisasi ke semua device
              </span>
            </div>
          </div>
        )}

        {/* Offline notification banner */}
        {!isOnline && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
            <div className="flex items-center justify-center">
              <WifiOff className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Anda sedang offline. Data akan tersinkronisasi saat kembali online.
              </span>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;