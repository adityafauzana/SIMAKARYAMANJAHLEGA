import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  FileText, 
  CheckCircle,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const { userProgress, bidangProgress, getOverallStats } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(2025);

  const overallStats = getOverallStats();

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
    if (progress >= 90) return { level: 'Excellent', icon: '🏆' };
    if (progress >= 80) return { level: 'Very Good', icon: '🥇' };
    if (progress >= 70) return { level: 'Good', icon: '🥈' };
    if (progress >= 60) return { level: 'Fair', icon: '🥉' };
    if (progress >= 40) return { level: 'Needs Improvement', icon: '📈' };
    return { level: 'Poor', icon: '⚠️' };
  };

  const getMonthlyTrend = () => {
    // Generate mock monthly data based on current progress
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    return months.map((month, index) => ({
      month,
      activities: Math.floor(Math.random() * 10) + index * 2,
      reports: Math.floor(Math.random() * 5) + index,
      progress: Math.min((index + 1) * 15 + Math.random() * 10, 100)
    }));
  };

  const monthlyData = getMonthlyTrend();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistik & Analisis</h1>
          <p className="text-gray-600">Pantau kinerja dan progress anggota Karang Taruna secara real-time</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Bulanan</option>
            <option value="quarterly">Triwulan</option>
            <option value="yearly">Tahunan</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2025, 2026, 2027, 2028, 2029].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Progress Alert */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Real-time Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Progress diperbarui secara otomatis setiap kali aktivitas atau laporan disetujui
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{overallStats.averageProgress}%</div>
            <div className="text-sm text-gray-600">Rata-rata Progress</div>
          </div>
        </div>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Anggota Aktif</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{overallStats.activeMembers}</p>
              <p className="text-sm text-green-600 mt-1">Dari {userProgress.length} total</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
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
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress by Member */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Progress Individual (Real-time)</h2>
          <Target className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {userProgress.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada data progress</p>
              <p className="text-gray-400 text-sm mt-2">Progress akan muncul setelah ada aktivitas atau laporan yang disetujui</p>
            </div>
          ) : (
            userProgress
              .sort((a, b) => b.progressPercentage - a.progressPercentage)
              .map((member, index) => {
                const performance = getPerformanceLevel(member.progressPercentage);
                return (
                  <div key={member.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{member.userName}</h3>
                            <p className="text-xs text-gray-500">{member.bidang}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${getProgressTextColor(member.progressPercentage)}`}>
                            {member.progressPercentage}%
                          </span>
                          <p className="text-xs text-gray-500">
                            {performance.icon} {performance.level}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(member.progressPercentage)}`}
                          style={{ width: `${member.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          {member.activitiesCount} aktivitas (+{member.activitiesCount * 15}%)
                        </span>
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {member.reportsCount} laporan (+{member.reportsCount * 25}%)
                        </span>
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {member.tasksCompleted} tugas (+{member.tasksCompleted * 10}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Progress by Bidang */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Progress per Bidang</h2>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {bidangProgress.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada data progress bidang</p>
            </div>
          ) : (
            bidangProgress
              .sort((a, b) => b.averageProgress - a.averageProgress)
              .map((bidang, index) => (
                <div key={bidang.bidang} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{bidang.bidang}</h3>
                      <span className={`text-sm font-medium ${getProgressTextColor(bidang.averageProgress)}`}>
                        {bidang.averageProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(bidang.averageProgress)}`}
                        style={{ width: `${bidang.averageProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {bidang.totalMembers} anggota
                      </span>
                      <span className="flex items-center">
                        <Activity className="w-3 h-3 mr-1" />
                        {bidang.activitiesCount} aktivitas
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        {bidang.reportsCount} laporan
                      </span>
                      <span className="flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        {bidang.completionRate}% completion rate
                      </span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Tren Progress {selectedYear}</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {monthlyData.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{month.month}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {month.activities} Aktivitas, {month.reports} Laporan
                  </p>
                  <p className="text-xs text-gray-600">
                    Progress: {Math.round(month.progress)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${month.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 w-12">
                  {Math.round(month.progress)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Insight Kinerja Real-time</h2>
          <Award className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-2">🎯 Pencapaian Terbaik</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• {userProgress.filter(u => u.progressPercentage >= 80).length} anggota dengan progress ≥80%</li>
              <li>• {overallStats.totalActivities} aktivitas telah disetujui</li>
              <li>• Sistem tracking real-time aktif</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📊 Formula Progress</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Aktivitas: +15% per item (max 60%)</li>
              <li>• Laporan: +25% per item (max 75%)</li>
              <li>• Tugas: +10% per item (max 30%)</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">⚡ Area Perbaikan</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• {userProgress.filter(u => u.progressPercentage < 60).length} anggota perlu meningkatkan aktivitas</li>
              <li>• Progress dimulai dari 0% dan naik otomatis</li>
              <li>• Data tersinkronisasi real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;