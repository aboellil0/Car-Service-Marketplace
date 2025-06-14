import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Upload, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Camera, 
  User, 
  Building2,
  Phone,
  Mail,
  RefreshCw,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';

interface VerificationDocument {
  id: string;
  name: string;
  type: 'business_license' | 'tax_certificate' | 'insurance' | 'owner_id' | 'workshop_photos';
  status: 'pending' | 'approved' | 'rejected' | 'missing';
  uploadDate?: Date;
  reviewDate?: Date;
  reviewNotes?: string;
  fileUrl?: string;
  required: boolean;
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  completedAt?: Date;
  estimatedTime?: string;
}

interface VerificationProcessProps {
  onClose: () => void;
  onComplete: () => void;
}

const VerificationProcess: React.FC<VerificationProcessProps> = ({ onClose, onComplete }) => {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([]);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'in_progress' | 'approved' | 'rejected'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<VerificationDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockDocuments: VerificationDocument[] = [
        {
          id: '1',
          name: 'السجل التجاري',
          type: 'business_license',
          status: 'approved',
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          reviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          fileUrl: '#',
          required: true
        },
        {
          id: '2',
          name: 'الشهادة الضريبية',
          type: 'tax_certificate',
          status: 'rejected',
          uploadDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          reviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          reviewNotes: 'الشهادة منتهية الصلاحية. يرجى رفع شهادة سارية المفعول.',
          fileUrl: '#',
          required: true
        },
        {
          id: '3',
          name: 'شهادة التأمين',
          type: 'insurance',
          status: 'pending',
          uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          fileUrl: '#',
          required: true
        },
        {
          id: '4',
          name: 'هوية المالك',
          type: 'owner_id',
          status: 'approved',
          uploadDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          reviewDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          fileUrl: '#',
          required: true
        },
        {
          id: '5',
          name: 'صور الورشة',
          type: 'workshop_photos',
          status: 'missing',
          required: false
        }
      ];

      const mockSteps: VerificationStep[] = [
        {
          id: '1',
          title: 'مراجعة المستندات',
          description: 'فحص جميع المستندات المرفوعة',
          status: 'in_progress',
          estimatedTime: '2-3 أيام عمل'
        },
        {
          id: '2',
          title: 'التحقق من المعلومات',
          description: 'التأكد من صحة المعلومات المقدمة',
          status: 'pending',
          estimatedTime: '1-2 يوم عمل'
        },
        {
          id: '3',
          title: 'زيارة ميدانية (اختيارية)',
          description: 'قد نحتاج لزيارة الورشة للتحقق',
          status: 'pending',
          estimatedTime: '3-5 أيام عمل'
        },
        {
          id: '4',
          title: 'الموافقة النهائية',
          description: 'تفعيل الحساب والبدء في استقبال الحجوزات',
          status: 'pending',
          estimatedTime: '1 يوم عمل'
        }
      ];

      setDocuments(mockDocuments);
      setVerificationSteps(mockSteps);
      setOverallStatus('in_progress');
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: VerificationDocument['status']) => {
    switch (status) {
      case 'approved': return <Check className="text-green-600" size={20} />;
      case 'rejected': return <X className="text-red-600" size={20} />;
      case 'pending': return <Clock className="text-yellow-600" size={20} />;
      case 'missing': return <AlertTriangle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: VerificationDocument['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'missing': return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: VerificationDocument['status']) => {
    switch (status) {
      case 'approved': return 'موافق عليه';
      case 'rejected': return 'مرفوض';
      case 'pending': return 'قيد المراجعة';
      case 'missing': return 'مفقود';
    }
  };

  const getStepStatusIcon = (status: VerificationStep['status']) => {
    switch (status) {
      case 'completed': return <Check className="text-green-600" size={20} />;
      case 'in_progress': return <RefreshCw className="text-blue-600 animate-spin" size={20} />;
      case 'failed': return <X className="text-red-600" size={20} />;
      case 'pending': return <Clock className="text-gray-400" size={20} />;
    }
  };

  const handleFileUpload = (documentId: string, file: File) => {
    setUploadingDocument(documentId);
    
    // Simulate upload
    setTimeout(() => {
      setDocuments(docs => docs.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'pending', uploadDate: new Date(), fileUrl: '#' }
          : doc
      ));
      setUploadingDocument(null);
      setShowUploadModal(false);
    }, 2000);
  };

  const handleReupload = (document: VerificationDocument) => {
    setSelectedDocument(document);
    setShowUploadModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل حالة التحقق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-blue-600 ml-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">عملية التحقق</h1>
                <p className="text-gray-600">تتبع حالة التحقق من ورشتك</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">حالة التحقق العامة</h2>
            <div className={`px-4 py-2 rounded-full font-medium ${
              overallStatus === 'approved' ? 'bg-green-100 text-green-800' :
              overallStatus === 'rejected' ? 'bg-red-100 text-red-800' :
              overallStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {overallStatus === 'approved' ? 'تم التحقق' :
               overallStatus === 'rejected' ? 'مرفوض' :
               overallStatus === 'in_progress' ? 'قيد المراجعة' : 'في الانتظار'}
            </div>
          </div>

          {overallStatus === 'in_progress' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <RefreshCw className="text-blue-600 ml-3 mt-1 animate-spin" size={20} />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">جاري المراجعة</h3>
                  <p className="text-blue-700 text-sm">
                    فريقنا يراجع مستنداتك حالياً. ستتلقى إشعار عند اكتمال المراجعة.
                    الوقت المتوقع: 2-5 أيام عمل.
                  </p>
                </div>
              </div>
            </div>
          )}

          {overallStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="text-red-600 ml-3 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-red-900 mb-1">يتطلب إجراء</h3>
                  <p className="text-red-700 text-sm">
                    بعض المستندات تحتاج إلى تصحيح. يرجى مراجعة الملاحظات أدناه وإعادة رفع المستندات المطلوبة.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents Status */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">حالة المستندات</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="ml-3">
                          {document.type === 'workshop_photos' ? <Camera size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {document.name}
                            {document.required && <span className="text-red-500 mr-1">*</span>}
                          </h3>
                          {document.uploadDate && (
                            <p className="text-sm text-gray-500">
                              رُفع في: {document.uploadDate.toLocaleDateString('ar-SA')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(document.status)}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(document.status)}`}>
                          {getStatusText(document.status)}
                        </span>
                      </div>
                    </div>

                    {document.reviewNotes && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start">
                          <MessageSquare className="text-red-600 ml-2 mt-0.5" size={16} />
                          <div>
                            <p className="text-red-800 text-sm font-medium mb-1">ملاحظات المراجع:</p>
                            <p className="text-red-700 text-sm">{document.reviewNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {document.status === 'missing' && (
                        <button
                          onClick={() => handleReupload(document)}
                          className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <Upload className="ml-1" size={16} />
                          رفع المستند
                        </button>
                      )}
                      
                      {document.status === 'rejected' && (
                        <button
                          onClick={() => handleReupload(document)}
                          className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <Upload className="ml-1" size={16} />
                          إعادة رفع
                        </button>
                      )}

                      {document.fileUrl && document.status !== 'missing' && (
                        <>
                          <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm">
                            <Eye className="ml-1" size={16} />
                            عرض
                          </button>
                          <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm">
                            <Download className="ml-1" size={16} />
                            تحميل
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Steps */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">خطوات التحقق</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {verificationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div className="flex-shrink-0 ml-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-100' :
                        step.status === 'in_progress' ? 'bg-blue-100' :
                        step.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {getStepStatusIcon(step.status)}
                      </div>
                      {index < verificationSteps.length - 1 && (
                        <div className={`w-0.5 h-12 mx-auto mt-2 ${
                          step.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      {step.estimatedTime && step.status === 'pending' && (
                        <p className="text-xs text-gray-500">الوقت المتوقع: {step.estimatedTime}</p>
                      )}
                      {step.completedAt && (
                        <p className="text-xs text-green-600">
                          اكتمل في: {step.completedAt.toLocaleDateString('ar-SA')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="text-blue-600" size={20} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">تحتاج مساعدة؟</h3>
              <p className="text-gray-600 mb-4">
                إذا كان لديك أي استفسارات حول عملية التحقق أو تحتاج مساعدة في رفع المستندات، 
                لا تتردد في التواصل مع فريق الدعم.
              </p>
              <div className="flex gap-4">
                <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Phone className="ml-2" size={16} />
                  اتصل بنا
                </button>
                <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                  <Mail className="ml-2" size={16} />
                  راسلنا
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">رفع {selectedDocument.name}</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedDocument(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {uploadingDocument === selectedDocument.id ? (
                <div>
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">جاري رفع الملف...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">اسحب الملف هنا أو انقر للاختيار</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(selectedDocument.id, file);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
                  >
                    اختيار ملف
                  </label>
                  <p className="text-xs text-gray-500 mt-4">PDF, JPG, PNG (حد أقصى 5MB)</p>
                </>
              )}
            </div>

            {selectedDocument.reviewNotes && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>ملاحظة:</strong> {selectedDocument.reviewNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationProcess;