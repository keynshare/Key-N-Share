"use client";
import { useState } from "react";
import { Search, Star } from "lucide-react";

const FilterSidebar = () => {
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");

  const fileTypes = ["XML", "JSON", "CSV"];
  const ratings = [
    { label: "4-5", value: "4-5" },
    { label: "3-4", value: "3-4" },
    { label: "2-3", value: "2-3" },
    { label: "2-1", value: "2-1" },
    { label: "less than 1", value: "less" },
  ];
  const votedFor = [
    "Well-documented",
    "Learning",
    "Clean Data",
    "Well-maintained",
    "Application",
    "Research",
  ];

  return (
    <div className="xl:w-72 bg-white dark:bg-[#131313] w-screen border-t dark:border-gray-800 dark:border-none border-gray-100 shadow-md h-fit rounded-2xl p-5 space-y-6 text-sm">
      {/* Header */}
      <h2 className="text-xl hidden xl:block font-semibold text-center">Filters</h2>

      {/* Search */}
      <div className="flex items-center dark:focus-within:border-orange-500 focus-within:border-orange-500 border dark:border-gray-600 rounded-lg px-2 py-1">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none dark:bg-[#141414] !border-none px-2 py-1 text-sm"
        />
        <Search className="w-4 h-4 text-gray-500" />
      </div>

      {/* File Size */}
      <div>
        <p className="font-semibold mb-2">FILE SIZE</p>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            placeholder="MIN"
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
            className="w-full border dark:border-gray-600 rounded-md px-2 py-1 text-sm"
          />
          <select className="border dark:border-gray-600 dark:bg-[#141414] rounded-md px-2 py-1 text-sm">
            <option>MB</option>
            <option>GB</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="MAX"
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
            className="w-full border dark:border-gray-600 rounded-md px-2 py-1 text-sm"
          />
          <select className="border dark:border-gray-600 dark:bg-[#141414]  rounded-md px-2 py-1 text-sm">
            <option>MB</option>
            <option>GB</option>
          </select>
        </div>
      </div>

      {/* File Type */}
      <div>
        <p className="font-semibold mb-2">FILE TYPE</p>
        <div className="flex flex-wrap gap-2">
          {fileTypes.map((type) => (
            <span
              key={type}
              className="px-3 py-1 border dark:border-gray-600 dark:hover:bg-slate-200/20 rounded-full text-sm cursor-pointer hover:bg-gray-100"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="font-semibold mb-2">RATING</p>
        <div className="flex flex-wrap gap-2">
          {ratings.map((r) => (
            <span
              key={r.value}
              className="px-3 py-1 border dark:border-gray-600 dark:hover:bg-slate-200/20 rounded-full flex items-center gap-1 cursor-pointer hover:bg-gray-100"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {r.label}
            </span>
          ))}
        </div>
      </div>

      {/* Highly Voted */}
      <div>
        <p className="font-semibold mb-2">HIGHLY VOTED FOR</p>
        <div className="flex flex-wrap gap-2">
          {votedFor.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 border dark:border-gray-600 dark:hover:bg-slate-200/20 rounded-full text-sm cursor-pointer hover:bg-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button className="bg-black hover:bg-gray-100 hover:text-black text-white px-5 py-2 rounded-full text-sm font-medium">
          Apply
        </button>
        <button className="bg-gray-200 hover:bg-[#c2c2c2]  text-black px-5 py-2 rounded-full text-sm font-medium">
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
