import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Bell, 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  AlertCircle,
  FileText,
  Image,
  Download,
  Printer,
  Users
} from 'lucide-react';

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const { 
    announcements, 
    addAnnouncement, 
    deleteAnnouncement 
  } = useData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    files: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Judul dan konten pengumuman harus diisi');
      return;
    }

    addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      files: newAnnouncement.files,
      createdBy: user?.name || '',
      priority: newAnnouncement.priority
    });

    setNewAnnouncement({ 
      title: '', 
      content: '', 
      files: [], 
      priority: 'medium' 
    });
    setShowAddForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newFiles.push(event.target.result as string);
            if (newFiles.length === files.length) {
              setNewAnnouncement(prev => ({
                ...prev,
                files: [...prev.files, ...newFiles]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      deleteAnnouncement(id);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Penting</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Sedang</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Rendah</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Bell className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const printAnnouncement = (announcement: any) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pengumuman - ${announcement.title}</title>
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
          .header h2 {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          .announcement-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
            border: 1px solid #dee2e6;
          }
          .announcement-info h3 {
            margin-top: 0;
            color: #2563eb;
            font-size: 16px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-item {
            display: flex;
          }
          .info-label {
            font-weight: bold;
            width: 120px;
            display: inline-block;
          }
          .content-section {
            margin-bottom: 30px;
          }
          .content-section h3 {
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .content-text {
            text-align: justify;
            line-height: 1.8;
            margin-bottom: 20px;
            white-space: pre-wrap;
          }
          .priority-high {
            color: #dc2626;
            font-weight: bold;
          }
          .priority-medium {
            color: #d97706;
            font-weight: bold;
          }
          .priority-low {
            color: #059669;
            font-weight: bold;
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
          @media print {
            body { margin: 0; }
            .announcement-info, .content-section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PENGUMUMAN RESMI</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <h2>KECAMATAN RANCASARI KOTA BANDUNG</h2>
          <p>Jl. Manjahlega No. 123, Bandung 40286</p>
        </div>
        
        <div class="announcement-info">
          <h3>Informasi Pengumuman</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Judul:</span>
              <span>${announcement.title}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tanggal:</span>
              <span>${new Date(announcement.createdAt).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Dibuat oleh:</span>
              <span>${announcement.createdBy}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Prioritas:</span>
              <span class="priority-${announcement.priority}">
                ${announcement.priority === 'high' ? 'PENTING' : 
                  announcement.priority === 'medium' ? 'SEDANG' : 'RENDAH'}
              </span>
            </div>
          </div>
        </div>
        
        <div class="content-section">
          <h3>Isi Pengumuman</h3>
          <div class="content-text">
            ${announcement.content}
          </div>
        </div>
        
        ${announcement.files && announcement.files.length > 0 ? `
          <div class="content-section">
            <h3>File Lampiran</h3>
            <p>Pengumuman ini dilengkapi dengan ${announcement.files.length} file lampiran.</p>
          </div>
        ` : ''}
        
        <div class="signature">
          <p>Bandung, ${new Date().toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p><strong>${announcement.createdBy}</strong></p>
            <p>Ketua Karang Taruna</p>
            <p>Kelurahan Manjahlega</p>
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
      alert('Pop-up diblokir! Silakan izinkan pop-up untuk mencetak pengumuman.');
    }
  };

  const printAllAnnouncements = () => {
    const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daftar Pengumuman - ${currentMonth}</title>
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
          .announcement-item {
            margin-bottom: 30px;
            page-break-inside: avoid;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
          }
          .announcement-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2563eb;
          }
          .announcement-meta {
            background-color: #f8f9fa;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 3px;
          }
          .announcement-content {
            text-align: justify;
            line-height: 1.7;
            white-space: pre-wrap;
          }
          .priority-high { color: #dc2626; font-weight: bold; }
          .priority-medium { color: #d97706; font-weight: bold; }
          .priority-low { color: #059669; font-weight: bold; }
          .no-announcements {
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
          <h1>Daftar Pengumuman ${currentMonth.toUpperCase()}</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <h2>KECAMATAN RANCASARI KOTA BANDUNG</h2>
          <p>Jl. Manjahlega No. 123, Bandung 40286</p>
        </div>
        
        <div class="content">
          ${announcements.length === 0 ? 
            '<div class="no-announcements">Tidak ada pengumuman pada periode ini.</div>' :
            announcements.map((announcement, index) => `
              <div class="announcement-item">
                <div class="announcement-title">${index + 1}. ${announcement.title}</div>
                <div class="announcement-meta">
                  <strong>Tanggal:</strong> ${new Date(announcement.createdAt).toLocaleDateString('id-ID')}<br>
                  <strong>Dibuat oleh:</strong> ${announcement.createdBy}<br>
                  <strong>Prioritas:</strong> <span class="priority-${announcement.priority}">
                    ${announcement.priority === 'high' ? 'PENTING' : 
                      announcement.priority === 'medium' ? 'SEDANG' : 'RENDAH'}
                  </span>
                </div>
                <div class="announcement-content">
                  ${announcement.content}
                </div>
                ${announcement.files && announcement.files.length > 0 ? 
                  `<p><strong>File Lampiran:</strong> ${announcement.files.length} file terlampir</p>` : 
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
            <p><strong>${user?.name || 'Ketua Karang Taruna'}</strong></p>
            <p>Ketua Karang Taruna</p>
            <p>Kelurahan Manjahlega</p>
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
      alert('Pop-up diblokir! Silakan izinkan pop-up untuk mencetak daftar pengumuman.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengumuman</h1>
          <p className="text-gray-600">
            {user?.role === 'ketua' 
              ? 'Kelola pengumuman untuk seluruh anggota Karang Taruna' 
              : 'Lihat pengumuman terbaru dari Ketua Karang Taruna'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={printAllAnnouncements}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Semua
          </button>
          {user?.role === 'ketua' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengumuman
            </button>
          )}
        </div>
      </div>

      {/* Real-time Updates Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Update Real-time untuk Semua Pengguna</h3>
              <p className="text-gray-600 text-sm">
                Pengumuman akan langsung terlihat oleh seluruh anggota dan pengurus Karang Taruna
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{announcements.length}</div>
            <div className="text-sm text-gray-600">Total Pengumuman</div>
          </div>
        </div>
      </div>

      {/* Add Announcement Form Modal */}
      {showAddForm && user?.role === 'ketua' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Pengumuman Baru</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul pengumuman"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioritas
                  </label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Penting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Isi Pengumuman
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tulis isi pengumuman di sini..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Lampiran (Foto/PDF)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newAnnouncement.files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{newAnnouncement.files.length} file dipilih</p>
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
                  onClick={handleAddAnnouncement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Publikasikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada pengumuman</p>
                <p className="text-gray-400 text-sm mt-2">
                  {user?.role === 'ketua' 
                    ? 'Mulai dengan membuat pengumuman pertama untuk seluruh anggota'
                    : 'Pengumuman dari ketua akan muncul di sini'
                  }
                </p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getPriorityIcon(announcement.priority)}
                        <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Oleh: {announcement.createdBy}</p>
                        <p>Tanggal: {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>

                      <p className="text-gray-700 mb-3 whitespace-pre-wrap line-clamp-3">{announcement.content}</p>

                      {announcement.files.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <FileText className="w-4 h-4 mr-2" />
                          {announcement.files.length} file lampiran
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => printAnnouncement(announcement)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Cetak Pengumuman"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {user?.role === 'ketua' && (
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
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

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detail Pengumuman</h2>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getPriorityIcon(selectedAnnouncement.priority)}
                  <h3 className="text-lg font-semibold text-gray-900">{selectedAnnouncement.title}</h3>
                  {getPriorityBadge(selectedAnnouncement.priority)}
                </div>

                <div className="text-sm text-gray-600">
                  <p>Oleh: {selectedAnnouncement.createdBy}</p>
                  <p>Tanggal: {new Date(selectedAnnouncement.createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Isi Pengumuman</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                  </div>
                </div>

                {selectedAnnouncement.files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">File Lampiran</p>
                    <div className="space-y-2">
                      {selectedAnnouncement.files.map((file: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">File {index + 1}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => printAnnouncement(selectedAnnouncement)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Pengumuman
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

export default Announcements;