import { Upload } from "lucide-react";

function CoverUpload() {
  return (
    <div className="border-2 border-dashed gap-5 text-gray-500 dark:text-gray-600 border-gray-300 rounded-lg flex flex-col items-center justify-center p-10 h-full text-center">
      <Upload size={40}/>
      <p className="text-gray-600 text-2xl">Drop files to upload <br /> or <a href="#" className="text-blue-600 underline">browse</a></p>
    </div>
  );
}

export default CoverUpload;
