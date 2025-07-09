import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Calendar, 
  Camera, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  Printer,
  Download,
  AlertTriangle,
  Settings
} from 'lucide-react';

const Activities: React.FC = () => {
  const { user } = useAuth();
  const { 
    activities, 
    addActivity, 
    updateActivityStatus, 
    deleteActivity 
  } = useData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showPrintInstructions, setShowPrintInstructions] = useState(false);

  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    date: '',
    photos: [] as string[]
  });

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.description || !newActivity.date) {
      alert('Semua field harus diisi');
      return;
    }

    addActivity({
      title: newActivity.title,
      description: newActivity.description,
      date: newActivity.date,
      photos: newActivity.photos,
      createdBy: user?.name || '',
      bidang: user?.bidang || '',
      status: 'pending'
    });

    setNewActivity({ title: '', description: '', date: '', photos: [] });
    setShowAddForm(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPhotos.push(event.target.result as string);
            if (newPhotos.length === files.length) {
              setNewActivity(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleValidateActivity = (activityId: string, status: 'approved' | 'rejected') => {
    if (user?.role !== 'ketua') return;
    updateActivityStatus(activityId, status, user.name);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
      deleteActivity(activityId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Disetujui</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Ditolak</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Menunggu</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>;
    }
  };

  const printWithPopupCheck = (printFunction: () => void, documentName: string) => {
    try {
      printFunction();
    } catch (error) {
      // If popup is blocked, show instructions
      setShowPrintInstructions(true);
    }
  };

  const printMonthlyReport = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const approvedActivities = activities.filter(a => a.status === 'approved');
    
    // Filter activities for current month
    const monthlyActivities = approvedActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate.getMonth() === currentDate.getMonth() && 
             activityDate.getFullYear() === currentDate.getFullYear();
    });
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Aktivitas Kegiatan Bulanan - ${currentMonth}</title>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 12pt;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 10px 0;
            text-transform: uppercase;
          }
          .header h2 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          .header p {
            font-size: 12pt;
            margin: 0;
          }
          .activity-item {
            margin-bottom: 30px;
            page-break-inside: avoid;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
          }
          .activity-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2563eb;
          }
          .activity-details {
            margin-bottom: 10px;
          }
          .activity-details strong {
            display: inline-block;
            width: 150px;
          }
          .activity-description {
            margin: 15px 0;
            text-align: justify;
            background-color: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #2563eb;
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
          .no-activities {
            text-align: center;
            font-style: italic;
            color: #666;
            margin: 40px 0;
          }
          @media print {
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .activity-item { 
              break-inside: avoid; 
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Laporan Aktivitas Kegiatan Bulanan</h1>
          <h1>${currentMonth.toUpperCase()}</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <h2>KECAMATAN RANCASARI KOTA BANDUNG</h2>
          <p>Jl. Manjahlega No. 123, Bandung 40286</p>
        </div>
        
        <div class="content">
          ${monthlyActivities.length === 0 ? 
            '<div class="no-activities">Tidak ada aktivitas yang disetujui pada bulan ini.</div>' :
            monthlyActivities.map((activity, index) => `
              <div class="activity-item">
                <div class="activity-title">${index + 1}. ${activity.title}</div>
                <div class="activity-details">
                  <p><strong>Tanggal:</strong> ${new Date(activity.date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Bidang:</strong> ${activity.bidang}</p>
                  <p><strong>Penanggung Jawab:</strong> ${activity.createdBy}</p>
                  <p><strong>Status:</strong> Disetujui oleh ${activity.validatedBy} pada ${activity.validatedAt ? new Date(activity.validatedAt).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <div class="activity-description">
                  <strong>Deskripsi Kegiatan:</strong><br>
                  ${activity.description}
                </div>
                ${activity.photos && activity.photos.length > 0 ? 
                  '<p><strong>Dokumentasi:</strong> ' + activity.photos.length + ' foto terlampir</p>' : 
                  ''
                }
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
            <p>${user?.role === 'ketua' ? 'Ketua' : 'Pengurus'} Karang Taruna</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    const printFunction = () => {
      const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
      } else {
        throw new Error('Pop-up blocked');
      }
    };

    printWithPopupCheck(printFunction, 'Laporan Aktivitas Bulanan');
  };

  const printSingleActivity = (activity: any) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Detail Aktivitas - ${activity.title}</title>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 12pt;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 10px 0;
          }
          .content {
            margin-bottom: 30px;
          }
          .detail-row {
            margin-bottom: 15px;
            display: flex;
          }
          .detail-label {
            font-weight: bold;
            width: 150px;
            display: inline-block;
          }
          .description-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #2563eb;
            margin: 20px 0;
          }
          .signature {
            margin-top: 50px;
            text-align: right;
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
          @media print {
            body { 
              margin: 0;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DETAIL AKTIVITAS KEGIATAN</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <p>Kecamatan Rancasari, Kota Bandung</p>
        </div>
        
        <div class="content">
          <div class="detail-row">
            <span class="detail-label">Judul Kegiatan:</span>
            <span>${activity.title}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tanggal:</span>
            <span>${new Date(activity.date).toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Bidang:</span>
            <span>${activity.bidang}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Penanggung Jawab:</span>
            <span>${activity.createdBy}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span>${activity.status === 'approved' ? 'Disetujui' : activity.status === 'rejected' ? 'Ditolak' : 'Menunggu Persetujuan'}</span>
          </div>
          ${activity.validatedBy ? `
            <div class="detail-row">
              <span class="detail-label">Divalidasi oleh:</span>
              <span>${activity.validatedBy} pada ${activity.validatedAt ? new Date(activity.validatedAt).toLocaleDateString('id-ID') : '-'}</span>
            </div>
          ` : ''}
          
          <div class="description-box">
            <strong>Deskripsi Kegiatan:</strong><br><br>
            ${activity.description}
          </div>
          
          ${activity.photos && activity.photos.length > 0 ? `
            <div class="detail-row">
              <span class="detail-label">Dokumentasi:</span>
              <span>${activity.photos.length} foto dokumentasi tersedia</span>
            </div>
          ` : ''}
        </div>
        
        <div class="signature">
          <p>Bandung, ${new Date().toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p><strong>${activity.createdBy}</strong></p>
            <p>Penanggung Jawab Kegiatan</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    const printFunction = () => {
      const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
      } else {
        throw new Error('Pop-up blocked');
      }
    };

    printWithPopupCheck(printFunction, 'Detail Aktivitas');
  };

  const downloadAsPDF = (content: string, filename: string) => {
    // Create a blob with the HTML content
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('File HTML telah diunduh. Anda dapat membukanya di browser dan mencetak sebagai PDF menggunakan Ctrl+P atau Cmd+P');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktivitas Kegiatan</h1>
          <p className="text-gray-600">Kelola dan pantau aktivitas kegiatan Karang Taruna</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPrintInstructions(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Panduan Cetak PDF
          </button>
          <button
            onClick={printMonthlyReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Laporan Bulanan
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Aktivitas
          </button>
        </div>
      </div>

      {/* Print Instructions Modal */}
      {showPrintInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">📄 Panduan Cetak ke PDF</h2>
                <button
                  onClick={() => setShowPrintInstructions(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Pop-up Diblokir?</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Jika pop-up diblokir oleh browser, ikuti langkah-langkah di bawah ini untuk mengaktifkan pop-up.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">🔧 Cara Mengaktifkan Pop-up:</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">🌐 Google Chrome:</h4>
                      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        <li>Klik ikon <strong>🔒</strong> di sebelah kiri URL</li>
                        <li>Pilih <strong>"Pop-ups and redirects"</strong></li>
                        <li>Ubah ke <strong>"Allow"</strong></li>
                        <li>Refresh halaman dan coba cetak lagi</li>
                      </ol>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">🦊 Mozilla Firefox:</h4>
                      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        <li>Klik ikon <strong>🛡️</strong> di address bar</li>
                        <li>Klik <strong>"Turn off Blocking for This Site"</strong></li>
                        <li>Refresh halaman dan coba cetak lagi</li>
                      </ol>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">🧭 Microsoft Edge:</h4>
                      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        <li>Klik ikon <strong>🔒</strong> di address bar</li>
                        <li>Pilih <strong>"Pop-ups and redirects"</strong></li>
                        <li>Ubah ke <strong>"Allow"</strong></li>
                        <li>Refresh halaman dan coba cetak lagi</li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Tips Cetak ke PDF:</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Setelah pop-up terbuka, tekan <strong>Ctrl+P</strong> (Windows) atau <strong>Cmd+P</strong> (Mac)</li>
                      <li>Pilih <strong>"Save as PDF"</strong> sebagai printer</li>
                      <li>Atur orientasi ke <strong>"Portrait"</strong> untuk hasil terbaik</li>
                      <li>Pastikan <strong>"Print backgrounds"</strong> diaktifkan untuk warna dan gambar</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">✅ Alternatif Jika Pop-up Tetap Diblokir:</h4>
                    <p className="text-sm text-green-800 mb-2">
                      Gunakan tombol "Download HTML" yang akan muncul jika pop-up diblokir. File HTML dapat dibuka di browser dan dicetak sebagai PDF.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPrintInstructions(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mengerti
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Info */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking System</h3>
            <p className="text-gray-600 text-sm">
              Setiap aktivitas yang disetujui akan menambah 15% ke progress Anda (maksimal 60% dari aktivitas)
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{activities.filter(a => a.status === 'approved').length}</div>
            <div className="text-sm text-gray-600">Aktivitas Disetujui</div>
          </div>
        </div>
      </div>

      {/* Add Activity Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Aktivitas Baru</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Aktivitas
                  </label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Dokumentasi
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newActivity.photos.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {newActivity.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
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
                  onClick={handleAddActivity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada aktivitas yang ditambahkan</p>
                <p className="text-gray-400 text-sm mt-2">Mulai dengan menambah aktivitas pertama Anda!</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        {getStatusBadge(activity.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(activity.date).toLocaleDateString('id-ID')}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {activity.bidang}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {activity.createdBy}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{activity.description}</p>

                      {activity.photos.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Camera className="w-4 h-4 mr-2" />
                          {activity.photos.length} foto dokumentasi
                        </div>
                      )}

                      {activity.validatedBy && (
                        <p className="text-xs text-gray-500">
                          Divalidasi oleh {activity.validatedBy} pada {activity.validatedAt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {user?.role === 'ketua' && activity.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleValidateActivity(activity.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Setujui"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleValidateActivity(activity.id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Tolak"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => printSingleActivity(activity)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Cetak Detail"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => setSelectedActivity(activity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {(activity.createdBy === user?.name || user?.role === 'ketua') && (
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
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

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detail Aktivitas</h2>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedActivity.title}</h3>
                  {getStatusBadge(selectedActivity.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal</p>
                    <p className="text-gray-900">{new Date(selectedActivity.date).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bidang</p>
                    <p className="text-gray-900">{selectedActivity.bidang}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Deskripsi</p>
                  <p className="text-gray-900">{selectedActivity.description}</p>
                </div>

                {selectedActivity.photos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Dokumentasi</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedActivity.photos.map((photo: string, index: number) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => printSingleActivity(selectedActivity)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;