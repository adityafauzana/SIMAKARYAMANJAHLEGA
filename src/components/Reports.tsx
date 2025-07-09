import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  FileText, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  Printer,
  Download,
  Settings,
  AlertTriangle
} from 'lucide-react';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { 
    reports, 
    addReport, 
    updateReportStatus, 
    deleteReport 
  } = useData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showPrintInstructions, setShowPrintInstructions] = useState(false);

  const [newReport, setNewReport] = useState({
    title: '',
    period: 'quarterly' as 'quarterly' | 'annual',
    year: 2025,
    quarter: 1,
    content: '',
    documents: [] as string[]
  });

  const handleAddReport = () => {
    if (!newReport.title || !newReport.content) {
      alert('Judul dan konten laporan harus diisi');
      return;
    }

    addReport({
      title: newReport.title,
      period: newReport.period,
      year: newReport.year,
      quarter: newReport.period === 'quarterly' ? newReport.quarter : undefined,
      content: newReport.content,
      documents: newReport.documents,
      createdBy: user?.name || '',
      bidang: user?.bidang || '',
      status: 'pending'
    });

    setNewReport({ 
      title: '', 
      period: 'quarterly', 
      year: 2025, 
      quarter: 1, 
      content: '', 
      documents: [] 
    });
    setShowAddForm(false);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocuments: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newDocuments.push(event.target.result as string);
            if (newDocuments.length === files.length) {
              setNewReport(prev => ({
                ...prev,
                documents: [...prev.documents, ...newDocuments]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleValidateReport = (reportId: string, status: 'approved' | 'rejected') => {
    if (user?.role !== 'ketua') return;
    updateReportStatus(reportId, status, user.name);
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      deleteReport(reportId);
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
      setShowPrintInstructions(true);
    }
  };

  const printReport = (report: any) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title}</title>
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
          .report-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
            border: 1px solid #dee2e6;
          }
          .report-info h3 {
            margin-top: 0;
            color: #2563eb;
            font-size: 14pt;
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
          .status-approved {
            color: #059669;
            font-weight: bold;
          }
          .status-pending {
            color: #d97706;
            font-weight: bold;
          }
          .status-rejected {
            color: #dc2626;
            font-weight: bold;
          }
          @media print {
            body { 
              margin: 0;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .report-info, .content-section { 
              break-inside: avoid; 
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report.title}</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <h2>KECAMATAN RANCASARI KOTA BANDUNG</h2>
          <p>Jl. Manjahlega No. 123, Bandung 40286</p>
        </div>
        
        <div class="report-info">
          <h3>Informasi Laporan</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Periode:</span>
              <span>${report.period === 'quarterly' ? `Triwulan ${report.quarter}` : 'Tahunan'} ${report.year}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Bidang:</span>
              <span>${report.bidang}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Penanggung Jawab:</span>
              <span>${report.createdBy}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tanggal Dibuat:</span>
              <span>${new Date(report.createdAt).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="status-${report.status}">
                ${report.status === 'approved' ? 'Disetujui' : 
                  report.status === 'rejected' ? 'Ditolak' : 'Menunggu Persetujuan'}
              </span>
            </div>
            ${report.validatedBy ? `
              <div class="info-item">
                <span class="info-label">Divalidasi oleh:</span>
                <span>${report.validatedBy} pada ${report.validatedAt ? new Date(report.validatedAt).toLocaleDateString('id-ID') : '-'}</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="content-section">
          <h3>Isi Laporan</h3>
          <div class="content-text">
            ${report.content.split('\n').map((paragraph: string) => `<p>${paragraph}</p>`).join('')}
          </div>
        </div>
        
        ${report.documents && report.documents.length > 0 ? `
          <div class="content-section">
            <h3>Dokumen Pendukung</h3>
            <p>Laporan ini dilengkapi dengan ${report.documents.length} dokumen pendukung yang terlampir.</p>
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
            <p><strong>${report.createdBy}</strong></p>
            <p>${user?.role === 'ketua' ? 'Ketua' : 'Pengurus'} Karang Taruna</p>
            <p>${report.bidang}</p>
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

    printWithPopupCheck(printFunction, 'Laporan Kinerja');
  };

  const printQuarterlyReport = () => {
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    
    const quarterlyReports = reports.filter(r => 
      r.period === 'quarterly' && 
      r.year === currentYear && 
      r.quarter === currentQuarter &&
      r.status === 'approved'
    );

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Kinerja Triwulan ${currentQuarter} ${currentYear}</title>
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
          .report-item {
            margin-bottom: 40px;
            page-break-inside: avoid;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
          }
          .report-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2563eb;
            border-bottom: 1px solid #2563eb;
            padding-bottom: 5px;
          }
          .report-meta {
            background-color: #f8f9fa;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 3px;
          }
          .report-content {
            text-align: justify;
            line-height: 1.7;
          }
          .no-reports {
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
          <h1>Laporan Kinerja Triwulan ${currentQuarter} ${currentYear}</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <h2>KECAMATAN RANCASARI KOTA BANDUNG</h2>
          <p>Jl. Manjahlega No. 123, Bandung 40286</p>
        </div>
        
        <div class="content">
          ${quarterlyReports.length === 0 ? 
            '<div class="no-reports">Tidak ada laporan kinerja yang disetujui untuk triwulan ini.</div>' :
            quarterlyReports.map((report, index) => `
              <div class="report-item">
                <div class="report-title">${index + 1}. ${report.title}</div>
                <div class="report-meta">
                  <strong>Bidang:</strong> ${report.bidang}<br>
                  <strong>Penanggung Jawab:</strong> ${report.createdBy}<br>
                  <strong>Tanggal Dibuat:</strong> ${new Date(report.createdAt).toLocaleDateString('id-ID')}<br>
                  <strong>Disetujui oleh:</strong> ${report.validatedBy} pada ${report.validatedAt ? new Date(report.validatedAt).toLocaleDateString('id-ID') : '-'}
                </div>
                <div class="report-content">
                  ${report.content.split('\n').map((paragraph: string) => `<p>${paragraph}</p>`).join('')}
                </div>
                ${report.documents && report.documents.length > 0 ? 
                  `<p><strong>Dokumen Pendukung:</strong> ${report.documents.length} file terlampir</p>` : 
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

    printWithPopupCheck(printFunction, 'Laporan Triwulan');
  };

  const printAnnualReport = () => {
    const currentYear = new Date().getFullYear();
    
    const annualReports = reports.filter(r => 
      r.period === 'annual' && 
      r.year === currentYear &&
      r.status === 'approved'
    );

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Kinerja Tahunan ${currentYear}</title>
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
          .report-item {
            margin-bottom: 40px;
            page-break-inside: avoid;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
          }
          .report-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2563eb;
            border-bottom: 1px solid #2563eb;
            padding-bottom: 5px;
          }
          .report-meta {
            background-color: #f8f9fa;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 3px;
          }
          .report-content {
            text-align: justify;
            line-height: 1.7;
          }
          .no-reports {
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
          <h1>Laporan Kinerja Tahunan ${currentYear}</h1>
          <h2>KARANG TARUNA KELURAHAN MANJAHLEGA</h2>
          <h2>KECAMATAN RANCASARI KOTA BANDUNG</h2>
          <p>Jl. Manjahlega No. 123, Bandung 40286</p>
        </div>
        
        <div class="content">
          ${annualReports.length === 0 ? 
            '<div class="no-reports">Tidak ada laporan kinerja tahunan yang disetujui untuk tahun ini.</div>' :
            annualReports.map((report, index) => `
              <div class="report-item">
                <div class="report-title">${index + 1}. ${report.title}</div>
                <div class="report-meta">
                  <strong>Bidang:</strong> ${report.bidang}<br>
                  <strong>Penanggung Jawab:</strong> ${report.createdBy}<br>
                  <strong>Tanggal Dibuat:</strong> ${new Date(report.createdAt).toLocaleDateString('id-ID')}<br>
                  <strong>Disetujui oleh:</strong> ${report.validatedBy} pada ${report.validatedAt ? new Date(report.validatedAt).toLocaleDateString('id-ID') : '-'}
                </div>
                <div class="report-content">
                  ${report.content.split('\n').map((paragraph: string) => `<p>${paragraph}</p>`).join('')}
                </div>
                ${report.documents && report.documents.length > 0 ? 
                  `<p><strong>Dokumen Pendukung:</strong> ${report.documents.length} file terlampir</p>` : 
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

    printWithPopupCheck(printFunction, 'Laporan Tahunan');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Kinerja</h1>
          <p className="text-gray-600">Kelola laporan kinerja bidang triwulan dan tahunan</p>
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
            onClick={printQuarterlyReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Triwulan
          </button>
          <button
            onClick={printAnnualReport}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Tahunan
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Laporan
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
                    <h4 className="font-medium text-green-900 mb-2">✅ Fitur Otomatis:</h4>
                    <p className="text-sm text-green-800 mb-2">
                      Sistem akan otomatis membuka dialog print setelah pop-up terbuka. Anda tinggal pilih "Save as PDF" dan klik "Save".
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
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking System</h3>
            <p className="text-gray-600 text-sm">
              Setiap laporan yang disetujui akan menambah 25% ke progress Anda (maksimal 75% dari laporan)
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{reports.filter(r => r.status === 'approved').length}</div>
            <div className="text-sm text-gray-600">Laporan Disetujui</div>
          </div>
        </div>
      </div>

      {/* Add Report Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Laporan Kinerja</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Laporan
                  </label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Periode
                    </label>
                    <select
                      value={newReport.period}
                      onChange={(e) => setNewReport({ ...newReport, period: e.target.value as 'quarterly' | 'annual' })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="quarterly">Triwulan</option>
                      <option value="annual">Tahunan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun
                    </label>
                    <select
                      value={newReport.year}
                      onChange={(e) => setNewReport({ ...newReport, year: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[2025, 2026, 2027, 2028, 2029].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {newReport.period === 'quarterly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Triwulan
                      </label>
                      <select
                        value={newReport.quarter}
                        onChange={(e) => setNewReport({ ...newReport, quarter: parseInt(e.target.value) })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>I</option>
                        <option value={2}>II</option>
                        <option value={3}>III</option>
                        <option value={4}>IV</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Isi Laporan
                  </label>
                  <textarea
                    value={newReport.content}
                    onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dokumen Pendukung
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newReport.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{newReport.documents.length} dokumen dipilih</p>
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
                  onClick={handleAddReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada laporan yang ditambahkan</p>
                <p className="text-gray-400 text-sm mt-2">Mulai dengan membuat laporan kinerja pertama Anda!</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {report.period === 'quarterly' ? `Triwulan ${report.quarter}` : 'Tahunan'} {report.year}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {report.bidang}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {report.createdBy}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(report.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">{report.content}</p>

                      {report.documents.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Upload className="w-4 h-4 mr-2" />
                          {report.documents.length} dokumen pendukung
                        </div>
                      )}

                      {report.validatedBy && (
                        <p className="text-xs text-gray-500">
                          Divalidasi oleh {report.validatedBy} pada {report.validatedAt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {user?.role === 'ketua' && report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleValidateReport(report.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Setujui"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleValidateReport(report.id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Tolak"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => printReport(report)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Cetak"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {(report.createdBy === user?.name || user?.role === 'ketua') && (
                        <button
                          onClick={() => handleDeleteReport(report.id)}
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detail Laporan</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedReport.title}</h3>
                  {getStatusBadge(selectedReport.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Periode</p>
                    <p className="text-gray-900">
                      {selectedReport.period === 'quarterly' ? `Triwulan ${selectedReport.quarter}` : 'Tahunan'} {selectedReport.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bidang</p>
                    <p className="text-gray-900">{selectedReport.bidang}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Isi Laporan</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.content}</p>
                </div>

                {selectedReport.documents.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Dokumen Pendukung</p>
                    <div className="space-y-2">
                      {selectedReport.documents.map((doc: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Dokumen {index + 1}</span>
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
                    onClick={() => printReport(selectedReport)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Laporan
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

export default Reports;