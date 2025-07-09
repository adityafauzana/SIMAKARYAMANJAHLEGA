import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  User, 
  Calendar,
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertTriangle,
  Printer,
  Bell,
  Target,
  Zap,
  Users
} from 'lucide-react';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { 
    tasks, 
    addTask, 
    updateTaskStatus, 
    deleteTask,
    users 
  } = useData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [newTaskNotifications, setNewTaskNotifications] = useState<string[]>([]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Real-time notification system for new tasks
  useEffect(() => {
    const checkForNewTasks = () => {
      const userTasks = tasks.filter(task => task.assignedTo === user?.name);
      const recentTasks = userTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        const now = new Date();
        const timeDiff = now.getTime() - taskDate.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        return hoursDiff < 24 && task.status === 'pending'; // Tasks created in last 24 hours
      });

      const newTaskIds = recentTasks.map(task => task.id);
      setNewTaskNotifications(newTaskIds);
    };

    checkForNewTasks();
    const interval = setInterval(checkForNewTasks, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [tasks, user?.name]);

  // Get list of users for assignment (filtered by role)
  const getAssignableUsers = () => {
    const assignableRoles = [
      'kepala-bidang', 
      'ketua-unit-teknis-rw-1', 'ketua-unit-teknis-rw-2', 'ketua-unit-teknis-rw-3', 'ketua-unit-teknis-rw-4',
      'ketua-unit-teknis-rw-5', 'ketua-unit-teknis-rw-6', 'ketua-unit-teknis-rw-7', 'ketua-unit-teknis-rw-8',
      'ketua-unit-teknis-rw-9', 'ketua-unit-teknis-rw-10', 'ketua-unit-teknis-rw-11', 'ketua-unit-teknis-rw-12',
      'ketua-unit-teknis-rw-13', 'ketua-unit-teknis-rw-14', 'ketua-unit-teknis-rw-15', 'ketua-unit-teknis-rw-16',
      'anggota'
    ];
    
    return users
      .filter(u => assignableRoles.includes(u.role))
      .map(u => u.name);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.dueDate) {
      alert('Semua field harus diisi');
      return;
    }

    addTask({
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      createdBy: user?.name || '',
      dueDate: newTask.dueDate,
      status: 'pending',
      priority: newTask.priority
    });

    setNewTask({ 
      title: '', 
      description: '', 
      assignedTo: '', 
      dueDate: '', 
      priority: 'medium' 
    });
    setShowAddForm(false);

    // Show success message with assignee info
    const assignedUser = users.find(u => u.name === newTask.assignedTo);
    const getRoleDisplay = (role: string) => {
      if (role === 'kepala-bidang') return 'Kepala Bidang';
      if (role.startsWith('ketua-unit-teknis-rw-')) {
        const rwNumber = role.split('-').pop();
        return `Ketua Unit Teknis RW ${rwNumber}`;
      }
      return 'Anggota';
    };
    
    const roleDisplay = getRoleDisplay(assignedUser?.role || '');
    alert(`Tugas berhasil ditambahkan dan diberikan kepada ${newTask.assignedTo} (${roleDisplay} ${assignedUser?.bidang || ''})`);
  };

  const handleUpdateTaskStatus = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    updateTaskStatus(taskId, status);
    
    // Remove from new notifications when status changes
    setNewTaskNotifications(prev => prev.filter(id => id !== taskId));
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      deleteTask(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Selesai</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Berlangsung</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Menunggu</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Tinggi</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Sedang</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Rendah</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter tasks based on user role
  const getFilteredTasks = () => {
    if (user?.role === 'ketua') {
      return tasks; // Ketua can see all tasks
    }
    return tasks.filter(task => task.assignedTo === user?.name || task.createdBy === user?.name);
  };

  // Get tasks specifically assigned to current user
  const getMyTasks = () => {
    return tasks.filter(task => task.assignedTo === user?.name);
  };

  // Get tasks created by current user (for kepala bidang and ketua unit teknis)
  const getCreatedTasks = () => {
    return tasks.filter(task => task.createdBy === user?.name);
  };

  const canCreateTasks = user?.role === 'ketua' || 
                        user?.role === 'kepala-bidang' || 
                        (user?.role && user.role.startsWith('ketua-unit-teknis-rw-'));

  const printTaskReport = () => {
    const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const filteredTasks = getFilteredTasks();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Tugas - ${currentMonth}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 10px 0;
            text-transform: uppercase;
          }
          .task-item {
            margin-bottom: 30px;
            page-break-inside: avoid;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
          }
          .task-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2563eb;
          }
          .task-meta {
            background-color: #f8f9fa;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 3px;
          }
          .task-description {
            text-align: justify;
            line-height: 1.7;
          }
          .status-completed { color: #059669; font-weight: bold; }
          .status-in-progress { color: #2563eb; font-weight: bold; }
          .status-pending { color: #d97706; font-weight: bold; }
          .priority-high { color: #dc2626; font-weight: bold; }
          .priority-medium { color: #d97706; font-weight: bold; }
          .priority-low { color: #059669; font-weight: bold; }
          .overdue { color: #dc2626; font-weight: bold; }
          .no-tasks {
            text-align: center;
            font-style: italic;
            color: #666;
            margin: 40px 0;
          }
          .signature {
            margin-top: 50px;
            text-align: right;
            page-break-inside: avoid;
          }
          .signature-box {
            display: inline-block;
            text-align: center;
            margin-top: 20px;
          }
          .signature-line {
            border-bottom: 1px solid #333;
            width: 200px;
            height: 60px;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Laporan Tugas ${currentMonth.toUpperCase()}</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <h2>KECAMATAN RANCASARI KOTA BANDUNG</h2>
          <p>Jl. Manjahlega No. 123, Bandung 40286</p>
        </div>
        
        <div class="content">
          ${filteredTasks.length === 0 ? 
            '<div class="no-tasks">Tidak ada tugas pada periode ini.</div>' :
            filteredTasks.map((task, index) => `
              <div class="task-item">
                <div class="task-title">${index + 1}. ${task.title}</div>
                <div class="task-meta">
                  <strong>Ditugaskan kepada:</strong> ${task.assignedTo}<br>
                  <strong>Dibuat oleh:</strong> ${task.createdBy}<br>
                  <strong>Tenggat waktu:</strong> ${new Date(task.dueDate).toLocaleDateString('id-ID')} 
                  ${isOverdue(task.dueDate) && task.status !== 'completed' ? '<span class="overdue">(TERLAMBAT)</span>' : ''}<br>
                  <strong>Status:</strong> <span class="status-${task.status}">
                    ${task.status === 'completed' ? 'SELESAI' : 
                      task.status === 'in-progress' ? 'BERLANGSUNG' : 'MENUNGGU'}
                  </span><br>
                  <strong>Prioritas:</strong> <span class="priority-${task.priority}">
                    ${task.priority === 'high' ? 'TINGGI' : 
                      task.priority === 'medium' ? 'SEDANG' : 'RENDAH'}
                  </span>
                </div>
                <div class="task-description">
                  <strong>Deskripsi:</strong><br>
                  ${task.description}
                </div>
              </div>
            `).join('')
          }
        </div>
        
        <div class="signature">
          <p>Bandung, ${new Date().toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p><strong>${user?.name || 'Nama Penandatangan'}</strong></p>
            <p>${user?.role === 'ketua' ? 'Ketua' : 
                user?.role?.startsWith('ketua-unit-teknis-rw-') ? 'Ketua Unit Teknis RW' : 'Pengurus'} Karang Taruna</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } else {
      alert('Pop-up diblokir! Silakan izinkan pop-up untuk mencetak laporan tugas.');
    }
  };

  const myTasks = getMyTasks();
  const createdTasks = getCreatedTasks();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Tugas</h1>
          <p className="text-gray-600">Kelola dan pantau tugas untuk anggota Karang Taruna</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={printTaskReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Laporan
          </button>
          {canCreateTasks && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tugas
            </button>
          )}
        </div>
      </div>

      {/* Real-time Task Notifications */}
      {newTaskNotifications.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-blue-600 mr-3 animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">🔔 Tugas Baru Real-time!</h3>
                <p className="text-gray-600 text-sm">
                  Anda memiliki {newTaskNotifications.length} tugas baru yang perlu ditangani
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{newTaskNotifications.length}</div>
              <div className="text-sm text-gray-600">Tugas Baru</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Info */}
      <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking System</h3>
            <p className="text-gray-600 text-sm">
              Setiap tugas yang diselesaikan akan menambah 10% ke progress Anda (maksimal 30% dari tugas)
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{filteredTasks.filter(t => t.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Tugas Selesai</div>
          </div>
        </div>
      </div>

      {/* Task Dashboard for Kepala Bidang and Ketua Unit Teknis */}
      {(user?.role === 'kepala-bidang' || (user?.role && user.role.startsWith('ketua-unit-teknis-rw-'))) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tugas Saya</h3>
              <div className="flex items-center">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">{myTasks.length} tugas</span>
              </div>
            </div>
            <div className="space-y-3">
              {myTasks.slice(0, 3).map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${newTaskNotifications.includes(task.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    {newTaskNotifications.includes(task.id) && (
                      <Bell className="w-4 h-4 text-blue-600 animate-bounce" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Deadline: {new Date(task.dueDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))}
              {myTasks.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Tidak ada tugas yang ditugaskan</p>
              )}
            </div>
          </div>

          {/* Tasks I Created */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tugas yang Saya Buat</h3>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">{createdTasks.length} tugas</span>
              </div>
            </div>
            <div className="space-y-3">
              {createdTasks.slice(0, 3).map(task => (
                <div key={task.id} className="p-3 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Ditugaskan ke: {task.assignedTo}
                  </p>
                </div>
              ))}
              {createdTasks.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Belum ada tugas yang dibuat</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tugas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{filteredTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {filteredTasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Berlangsung</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {filteredTasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {filteredTasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Tugas Baru</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Tugas
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ditugaskan Kepada
                    </label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Anggota</option>
                      {getAssignableUsers().map(userName => {
                        const userData = users.find(u => u.name === userName);
                        const getRoleDisplay = (role: string) => {
                          if (role === 'kepala-bidang') return 'Kepala Bidang';
                          if (role.startsWith('ketua-unit-teknis-rw-')) {
                            const rwNumber = role.split('-').pop();
                            return `Ketua Unit Teknis RW ${rwNumber}`;
                          }
                          return 'Anggota';
                        };
                        const roleDisplay = getRoleDisplay(userData?.role || '');
                        return (
                          <option key={userName} value={userName}>
                            {userName} ({roleDisplay} {userData?.bidang || ''})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenggat Waktu
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioritas
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
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
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada tugas yang ditambahkan</p>
                <p className="text-gray-400 text-sm mt-2">
                  {canCreateTasks 
                    ? 'Mulai dengan menambah tugas pertama untuk anggota'
                    : 'Tugas yang ditugaskan kepada Anda akan muncul di sini'
                  }
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className={`border rounded-lg p-4 ${
                  isOverdue(task.dueDate) && task.status !== 'completed' ? 'border-red-200 bg-red-50' : 
                  newTaskNotifications.includes(task.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                        {newTaskNotifications.includes(task.id) && (
                          <span className="flex items-center text-blue-600 text-xs animate-pulse">
                            <Bell className="w-3 h-3 mr-1" />
                            Baru!
                          </span>
                        )}
                        {isOverdue(task.dueDate) && task.status !== 'completed' && (
                          <span className="flex items-center text-red-600 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Terlambat
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {task.assignedTo}
                          {users.find(u => u.name === task.assignedTo)?.role === 'kepala-bidang' && (
                            <span className="ml-1 text-xs text-blue-600">(Kepala Bidang)</span>
                          )}
                          {users.find(u => u.name === task.assignedTo)?.role?.startsWith('ketua-unit-teknis-rw-') && (
                            <span className="ml-1 text-xs text-orange-600">(Ketua Unit RW)</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(task.dueDate).toLocaleDateString('id-ID')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {getDaysUntilDue(task.dueDate) >= 0 ? `${getDaysUntilDue(task.dueDate)} hari lagi` : `${Math.abs(getDaysUntilDue(task.dueDate))} hari terlambat`}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">{task.description}</p>

                      <p className="text-xs text-gray-500">
                        Dibuat oleh {task.createdBy} pada {new Date(task.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {(task.assignedTo === user?.name || user?.role === 'ketua') && task.status !== 'completed' && (
                        <div className="flex space-x-1">
                          {task.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                            >
                              Mulai
                            </button>
                          )}
                          {task.status === 'in-progress' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {(task.createdBy === user?.name || user?.role === 'ketua') && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detail Tugas</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTask.title}</h3>
                  <div className="flex space-x-2">
                    {getStatusBadge(selectedTask.status)}
                    {getPriorityBadge(selectedTask.priority)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ditugaskan Kepada</p>
                    <p className="text-gray-900">
                      {selectedTask.assignedTo}
                      {users.find(u => u.name === selectedTask.assignedTo)?.role === 'kepala-bidang' && (
                        <span className="ml-1 text-sm text-blue-600">(Kepala Bidang)</span>
                      )}
                      {users.find(u => u.name === selectedTask.assignedTo)?.role?.startsWith('ketua-unit-teknis-rw-') && (
                        <span className="ml-1 text-sm text-orange-600">(Ketua Unit Teknis RW)</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tenggat Waktu</p>
                    <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Deskripsi</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedTask.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Dibuat Oleh</p>
                  <p className="text-gray-900">{selectedTask.createdBy} pada {new Date(selectedTask.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;