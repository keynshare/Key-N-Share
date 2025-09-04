import PrimaryBtn from "@/components/SharedComponents/Btns/PrimaryBtn";
import { Copy, Download } from "lucide-react";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import { DatasetFormData } from "./UploadDataset";

interface SecurityDetailsFormProps {
  formData: DatasetFormData;
  onFormDataChange: (updates: Partial<DatasetFormData>) => void;
  onUpload: () => void;
  isUploading: boolean;
}

function SecurityDetailsForm({ formData, onFormDataChange, onUpload, isUploading }: SecurityDetailsFormProps) {
  const generateEncryptionKey = () => {
    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    onFormDataChange({ encryptionKey: key });
  };

  const copyToClipboard = async () => {
    if (formData.encryptionKey) {
      try {
        await navigator.clipboard.writeText(formData.encryptionKey);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const downloadKey = () => {
    if (formData.encryptionKey) {
      const blob = new Blob([formData.encryptionKey], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'encryption-key.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onUpload(); }}>
      {/* Encryption Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Encryption Key</label>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter Encryption Key"
            value={formData.encryptionKey}
            onChange={(e) => onFormDataChange({ encryptionKey: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg border-r-0 focus:outline-none focus:border-orange-500"
          />
          <SecondaryBtn
           
            onClick={generateEncryptionKey}
            className="rounded-l-none"
          >
            Generate
          </SecondaryBtn>
        </div>
      </div>

      {/* Save Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Save Key</label>
        <div className="flex w-full rounded-lg overflow-hidden">
          <div className="flex border w-full dark:border-gray-700 border-r-0 rounded-lg rounded-r-none overflow-hidden">
            <input
              type="text"
              placeholder="Key Will Appear Here"
              value={formData.encryptionKey}
              className="w-full px-4 py-2 border-none focus:outline-none bg-gray-50"
              readOnly
            />
            <button 
            
              onClick={copyToClipboard}
              className="text-gray-500 dark:bg-[#141414] px-3 hover:text-gray-700"
            >
              <Copy size={16} />
            </button>
          </div>
          <SecondaryBtn
           
            onClick={downloadKey}
            className="rounded-l-none"
            disabled={!formData.encryptionKey}
          >
            <Download size={16} />
          </SecondaryBtn>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms2"
          checked={formData.securityTermsAccepted}
          onChange={(e) => onFormDataChange({ securityTermsAccepted: e.target.checked })}
          className="h-3 w-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          required
        />
        <label htmlFor="terms2" className="text-gray-600 text-sm">
          I accept the security terms and conditions *
        </label>
      </div>

      <PrimaryBtn 
        Type="submit"
        sparkelClass="hidden"
        disabled={isUploading}
        className={isUploading ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isUploading ? "Uploading..." : "Upload Dataset"}
      </PrimaryBtn>
    </form>
  );
}

export default SecurityDetailsForm;