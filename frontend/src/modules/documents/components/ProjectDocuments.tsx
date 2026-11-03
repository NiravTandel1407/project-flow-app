import React, { useState, useRef } from 'react';
import {
  useProjectDocuments,
  useUploadDocument,
  useDeleteDocument,
} from '../hooks';
import { documentsApi } from '../api';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  FileCode,
  File,
  Download,
  Trash2,
  Loader2,
  HardDriveUpload,
} from 'lucide-react';

interface ProjectDocumentsProps {
  projectId: number;
}

export const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({
  projectId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { data: documents = [], isLoading } = useProjectDocuments(projectId);
  const uploadMutation = useUploadDocument(projectId);
  const deleteMutation = useDeleteDocument(projectId);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      try {
        await uploadMutation.mutateAsync(files[i]);
      } catch (err) {
        console.error('Failed to upload file', err);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDownload = async (docId: number, filename: string) => {
    try {
      setDownloadingId(docId);
      await documentsApi.downloadDocument(projectId, docId, filename);
    } catch (err) {
      console.error('Failed to download document', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (docId: number, filename: string) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await deleteMutation.mutateAsync(docId);
      } catch (err) {
        console.error('Failed to delete document', err);
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get File Type Icon & Style
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (['pdf'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
      );
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
      );
    }
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
      );
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <FileImage className="w-5 h-5" />
        </div>
      );
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <FileArchive className="w-5 h-5" />
        </div>
      );
    }
    if (['json', 'js', 'ts', 'html', 'css', 'py', 'sql'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <FileCode className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
        <File className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[14px] p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#3B5BFF] bg-[#EEF0FF]'
            : 'border-[#CDD1E0] bg-white hover:border-[#3B5BFF] hover:bg-[#FAFAFD]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#EEF0FF] text-[#3B5BFF] flex items-center justify-center mb-1">
            {uploadMutation.isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="text-[15px] font-semibold text-[#14162B]">
            {uploadMutation.isPending
              ? 'Uploading document...'
              : 'Click or drag files here to upload'}
          </div>

          <p className="text-[13px] text-[#5B6275] max-w-md m-0">
            Attach project briefs, specifications, designs, or spreadsheets (PDF,
            DOCX, XLSX, Images, ZIP, etc.).
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-[16px] font-bold text-[#14162B]">
            Project Documents ({documents.length})
          </h3>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[13px] font-semibold text-[#3B5BFF] hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <HardDriveUpload className="w-4 h-4" />
            Upload file
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B5BFF] border-t-transparent" />
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[14px] border border-[#E4E6EF] bg-white p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#5B6275] mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="m-0 text-base font-semibold text-[#14162B]">
              No documents yet
            </h4>
            <p className="text-xs text-[#5B6275] mt-1 max-w-sm">
              Upload and manage all files, briefs, and assets related to this
              project in one place.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {documents.map((doc) => {
              const isDownloading = downloadingId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-white border border-[#E4E6EF] rounded-[12px] shadow-sm hover:border-[#9DB0FF] transition-all group"
                >
                  {/* File Info */}
                  <div className="flex items-center gap-3.5 min-w-0 mr-3">
                    {getFileIcon(doc.filename)}
                    <div className="min-w-0">
                      <div
                        className="text-[14px] font-semibold text-[#14162B] truncate max-w-[220px] sm:max-w-[280px]"
                        title={doc.filename}
                      >
                        {doc.filename}
                      </div>
                      <div className="text-[12px] text-[#5B6275] mt-0.5 flex items-center gap-2">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDownload(doc.id, doc.filename)}
                      disabled={isDownloading}
                      className="p-2 rounded-lg text-[#5B6275] hover:text-[#3B5BFF] hover:bg-[#EEF0FF] transition-colors cursor-pointer"
                      title="Download file"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#3B5BFF]" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, doc.filename)}
                      className="p-2 rounded-lg text-[#5B6275] hover:text-[#B42318] hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDocuments;
