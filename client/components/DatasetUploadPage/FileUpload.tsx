import { Upload } from "lucide-react";
import { DatasetFormData } from  "@/components/DatasetUploadPage/UploadDataset";

interface CoverUploadProps {
  formData: DatasetFormData;
  onFormDataChange: (updates: Partial<DatasetFormData>) => void;
}

function FileUpload({ formData, onFormDataChange }: CoverUploadProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFormDataChange({ file });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFormDataChange({ file });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div 
      className="border-2 border-dashed gap-5 text-gray-500 dark:text-gray-600 border-gray-300 rounded-lg flex flex-col items-center justify-center p-10 h-full text-center cursor-pointer hover:border-orange-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('dataset-file')?.click()}
    >
      <input
        id="dataset-file"
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept=".csv,.json,.xlsx,.txt,.pdf"
      />
      
      <Upload size={40}/>
      <p className="text-gray-600 text-lg">Drop dataset file here <br /> or <span className="text-blue-600 underline">browse</span></p>
      <p className="text-xs text-gray-500">Supports: CSV, JSON, XLSX, TXT, PDF</p>
            {formData.file && (
        <p className="text-sm text-green-600 mt-2">
          Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
}

export default FileUpload;
