import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Calendar, 
  Users, 
  Activity, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Award,
  Bell,
  Zap,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    userProgress, 
    getOverallStats, 
    getUserProgress, 
    tasks, 
    isOnline, 
    lastSyncTime, 
    syncData 
  } = useData();

  const overallStats = getOverallStats();
  const currentUserProgress = getUserProgress(user?.name || '');

  // Get user's tasks for real-time notifications
  const userTasks = tasks.filter(task => task.assignedTo === user?.name);
  const newTasks = userTasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const now = new Date();
    const timeDiff = now.getTime() - taskDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff < 24 && task.status === 'pending';
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (progress: number) => {
    if (progress >= 90) return { level: 'Excellent', icon: '🏆', color: 'text-yellow-600' };
    if (progress >= 80) return { level: 'Very Good', icon: '🥇', color: 'text-green-600' };
    if (progress >= 70) return { level: 'Good', icon: '🥈', color: 'text-blue-600' };
    if (progress >= 60) return { level: 'Fair', icon: '🥉', color: 'text-orange-600' };
    if (progress >= 40) return { level: 'Needs Improvement', icon: '📈', color: 'text-yellow-600' };
    return { level: 'Poor', icon: '⚠️', color: 'text-red-600' };
  };

  const getTopPerformers = () => {
    return userProgress
      .sort((a, b) => b.progressPercentage - a.progressPercentage)
      .slice(0, 5);
  };

  const getRecentActivities = () => {
    const activities = [
      {
        id: 1,
        title: 'Real-time sync system activated',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        type: 'system'
      },
      {
        id: 2,
        title: 'Cross-device data synchronization',
        date: new Date().toISOString().split('T')[0],
        status: 'in-progress',
        type: 'system'
      },
      {
        id: 3,
        title: 'Multi-browser compatibility enabled',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        type: 'system'
      }
    ];

    // Add recent tasks if any
    if (newTasks.length > 0) {
      activities.unshift({
        id: 4,
        title: `${newTasks.length} tugas baru diterima`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        type: 'task'
      });
    }

    return activities;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in-progress': return 'Berlangsung';
      case 'pending': return 'Menunggu';
      default: return 'Unknown';
    }
  };

  const currentProgress = currentUserProgress?.progressPercentage || 0;
  const performanceLevel = getPerformanceLevel(currentProgress);

  return (
    <div className="p-6 space-y-6">
      {/* Real-time Sync Status Banner */}
      <div className={`rounded-xl p-6 border-2 ${
        isOnline 
          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isOnline ? (
              <div className="flex items-center">
                <Wifi className="w-8 h-8 text-green-600 mr-3 animate-pulse" />
                <Globe className="w-6 h-6 text-green-500 mr-3" />
              </div>
            ) : (
              <WifiOff className="w-8 h-8 text-red-600 mr-3" />
            )}
            <div>
              <h3 className={`text-lg font-bold ${
                isOnline ? 'text-green-800' : 'text-red-800'
              }`}>
                {isOnline ? '🌐 Sistem Online - Data Real-time Aktif' : '📴 Sistem Offline'}
              </h3>
              <p className={`text-sm ${
                isOnline ? 'text-green-700' : 'text-red-700'
              }`}>
                {isOnline 
                  ? 'Data tersinkronisasi secara real-time ke semua device, browser, dan pengguna'
                  : 'Data akan tersinkronisasi otomatis saat kembali online'
                }
              </p>
              {isOnline && (
                <div className="flex items-center mt-2 space-x-4 text-xs text-green-600">
                  <div className="flex items-center">
                    <Monitor className="w-3 h-3 mr-1" />
                    Cross-browser
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="w-3 h-3 mr-1" />
                    Multi-device
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    All users
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {lastSyncTime && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Sync terakhir:</p>
                <p className="text-xs font-medium text-gray-700">{lastSyncTime}</p>
              </div>
            )}
            <button
              onClick={syncData}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isOnline 
                  ? 'text-green-600 hover:bg-green-100 hover:scale-105' 
                  : 'text-red-600 hover:bg-red-100'
              }`}
              title="Sync Data Manual"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Header with Progress */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="text-blue-100 mb-4">
              Selamat datang di Sistem Manajemen Karang Taruna Kelurahan Manjahlega
            </p>
            {user?.bidang && (
              <p className="text-blue-200 text-sm mb-4">
                {user.bidang}
              </p>
            )}
            
            {/* Personal Progress Bar */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress Anda (Real-time)</span>
                <span className="text-lg font-bold">{currentProgress}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mb-2">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={performanceLevel.color}>
                  {performanceLevel.icon} {performanceLevel.level}
                </span>
                <span>
                  {currentUserProgress?.activitiesCount || 0} aktivitas, {currentUserProgress?.reportsCount || 0} laporan
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block ml-6">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Task Notifications for Kepala Bidang */}
      {newTasks.length > 0 && (user?.role === 'kepala-bidang' || user?.role === 'anggota') && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-orange-600 mr-3 animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">🔔 Tugas Baru Real-time!</h3>
                <p className="text-gray-600 text-sm">
                  Anda memiliki {newTasks.length} tugas baru yang perlu segera ditangani
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{newTasks.length}</div>
              <div className="text-sm text-gray-600">Tugas Baru</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {newTasks.slice(0, 3).map(task => (
              <div key={task.id} className="bg-white p-3 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <span className="text-xs text-orange-600 font-medium">
                    Deadline: {new Date(task.dueDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Aktivitas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{overallStats.totalActivities}</p>
              <p className="text-sm text-green-600 mt-1">Disetujui</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Laporan</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{overallStats.totalReports}</p>
              <p className="text-sm text-green-600 mt-1">Disetujui</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tugas Selesai</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{overallStats.totalTasks}</p>
              <p className="text-sm text-green-600 mt-1">Completed</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{overallStats.averageProgress}%</p>
              <p className="text-sm text-green-600 mt-1">{overallStats.activeMembers} anggota aktif</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performers (Real-time)</h2>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {getTopPerformers().map((performer, index) => (
              <div key={performer.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{performer.userName}</h3>
                    <p className="text-xs text-gray-500">{performer.bidang}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${getProgressTextColor(performer.progressPercentage)}`}>
                    {performer.progressPercentage}%
                  </span>
                  <p className="text-xs text-gray-500">
                    {performer.activitiesCount}A, {performer.reportsCount}L
                  </p>
                </div>
              </div>
            ))}
            {getTopPerformers().length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Belum ada data progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Sistem Real-time</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {getRecentActivities().map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                    {activity.type === 'task' && (
                      <Bell className="w-4 h-4 text-orange-500 ml-2 animate-bounce" />
                    )}
                    {activity.type === 'system' && (
                      <Zap className="w-4 h-4 text-blue-500 ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                  {getStatusText(activity.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Progress Insights Real-time</h2>
          <AlertCircle className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-2">🎯 Target Tercapai</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• {userProgress.filter(u => u.progressPercentage >= 80).length} anggota dengan progress ≥80%</li>
              <li>• {overallStats.totalActivities} aktivitas telah disetujui</li>
              <li>• Sistem tracking real-time aktif</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📊 Progress Formula</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Aktivitas: +15% per item (max 60%)</li>
              <li>• Laporan: +25% per item (max 75%)</li>
              <li>• Tugas: +10% per item (max 30%)</li>
            </ul>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-sm font-medium text-purple-800 mb-2">🔄 Sinkronisasi Real-time</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Data tersinkronisasi ke semua device</li>
              <li>• Update otomatis setiap 30 detik</li>
              <li>• Cross-tab synchronization aktif</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Media Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Sosial Karang Taruna</h2>
        <div className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm text-gray-600 mb-1">Follow Instagram Kami</p>
            <a
              href="https://instagram.com/karta_yp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              @karta_yp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;