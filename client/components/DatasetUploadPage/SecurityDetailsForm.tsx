import PrimaryBtn from "@/components/SharedComponents/Btns/PrimaryBtn";
import { Copy } from "lucide-react";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";

function SecurityDetailsForm() {
  return (
    <form className="space-y-4">
      {/* Encryption Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Encryption Key</label>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter Encryption Key"
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg  border-r-0 "
          />
          <SecondaryBtn
          
            className="rounded-l-none "
          >
            Generate
          </SecondaryBtn>
        </div>
      </div>

      {/* Save Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Save Key</label>
        <div className="flex w-full rounded-lg overflow-hidden">
         <div className="flex border w-full dark:border-gray-700 border-r-0 rounded-lg rounded-r-none overflow-hidden"> <input
            type="text"
            placeholder="Key Will Appear Here"
            className="w-full px-4 py-2 border-none focus:outline-none"
            readOnly
          />
          <button  className="text-gray-500 dark:bg-[#141414] px-3 ">
            <Copy />
          </button>
          </div>
          <SecondaryBtn
        
            className=" rounded-l-none "
          >
            Download
          </SecondaryBtn>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms2"
          className="h-3 w-3 text-orange-500  border-gray-300 rounded"
        />
        <label htmlFor="terms2" className=" text-gray-600">
          accept terms and conditions
        </label>
      </div>

      <PrimaryBtn sparkelClass="hidden">Upload Dataset</PrimaryBtn>
    </form>
  );
}

export default SecurityDetailsForm;