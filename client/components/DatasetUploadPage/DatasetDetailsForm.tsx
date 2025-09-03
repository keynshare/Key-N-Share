"use client"
import PrimaryBtn from "@/components/SharedComponents/Btns/PrimaryBtn";
import { FolderUp } from "lucide-react";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";

function DatasetDetailsForm() {
  return (
    <form className="space-y-4">
      {/* Dataset Name + Source in one row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dataset Name</label>
          <input type="text" placeholder="Dataset Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source of Data</label>
          <input type="text" placeholder="eg: this data was taken from spotify" className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none" />
        </div>
      </div>

      
      
      {/* Upload Dataset Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dataset</label>
        <div className="flex">
          <input type="text" placeholder="Click to upload Dataset" className="w-full px-4 py-2 border border-r-0 border-gray-300 rounded-l-lg  focus:outline-none" />
          <SecondaryBtn className="bg-black text-white px-3 rounded-l-none"><FolderUp/></SecondaryBtn>
        </div>
      </div>

      {/* Price + Category in one row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input type="text" placeholder="Enter Price in Matic" className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none">
            <option>Select Category</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Finance</option>
          </select>
        </div>
      </div>

      {/* Schema */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Schema of Dataset in JSON Format</label>
        <textarea  placeholder="eg: artist-name: Name of the artist, songs-no: number of songs" className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={1} placeholder="Description........" className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none"  />
      </div>

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="terms" className="h-3 w-3 text-orange-500  border-gray-300 rounded" />
        <label htmlFor="terms" className="text-gray-600">accept terms and conditions</label>
      </div>

      <PrimaryBtn sparkelClass="hidden">Upload Dataset</PrimaryBtn>
    </form>
  );
}

export default DatasetDetailsForm;
