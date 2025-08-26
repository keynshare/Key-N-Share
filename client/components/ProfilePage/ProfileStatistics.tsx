"use client";
import { useState } from "react";
import {Star} from 'lucide-react'
import NumberCard from "./NumberCard";
import PerformanceMatrices from "./PerformanceMatrices";

export default function ProfileStatistics() {
  const [activeTab, setActiveTab] = useState("about");
  const accountOverview=[{Num:8,Title:'Uploaded Datasets'},{Num:8,Title:'Datasets Sold'},{Num:2000,Title:'Profile Views'},{Num:8,Title:'Dispute Raised'},{Num:8,Title:'Dispute Solved'}]
  return (
    <div className="w-full mx-auto mt-8 p-4 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex gap-6 border-b dark:border-gray-800  text-sm font-medium">
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-2 font-bricola translate-y-[1px] ${activeTab === "about" ? "border-b-2 border-orange-500 font-bold" : "text-gray-500"}`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("datasets")}
          className={`pb-2 font-bricola translate-y-[1px] ${activeTab === "datasets" ? "border-b-2 border-orange-500  font-bold" : "text-gray-500"}`}
        >
          Datasets
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`pb-2 font-bricola translate-y-[1px] ${activeTab === "followers" ? "border-b-2 border-orange-500 font-bold " : "text-gray-500"}`}
        >
          Followers (24k)
        </button>
      </div>

      {/* About Section */}
      {activeTab === "about" && (
        <div className="mt-6 space-y-6">
          {/* Bio */}
          <div>
            <h2 className="text-xl font-semibold font-bricola">Bio</h2>
            <p className=" text-gray-700 dark:text-gray-300 mt-2 leading-relaxed line-clamp-6 ">
              Hi, I'm Mohammad Khomeni.  
              I'm a Data Scientist with over six years of hands-on experience in machine learning, deep learning, and delivering real-world computer vision projects.  
              I'm driven by curiosity, exploration, and insights, and I aim to learn from the amazing work of others in the Kaggle community.  
              My biggest motivation is to connect with people who share the same passion for AI.  
              I'm especially passionate about working with and processing data, from preprocessing and modeling to deployment and evaluation.  
              Whether it’s medical imaging, automation, or applied AI in business, I enjoy turning complex challenges into clean, responsible, and scalable solutions.  
              Feel free to follow me — let’s grow together and learn from each other’s experiences.
            </p>
          </div>

          {/* Reputation */}
          <div>
            <h2 className="text-xl font-semibold font-bricola">Reputation</h2>

            {/* Rating */}
            <div className="flex flex-col items-start gap-2 mt-2">
              <span className="text-4xl font-bold ">4.5</span>
              <div className="flex text-orange-400 ">
               <Star size={18} fill="#fb923c" />
               <Star size={18} fill="#fb923c"/>
               <Star size={18} fill="#fb923c"/>
               <Star size={18} fill="#fb923c"/>
               <Star size={18} />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ">120 reviews</span>
            </div>

            {/* Rating Bars */}
            <div className="mt-4 space-y-2">
              {[{ star: 5, percent: 40 }, { star: 4, percent: 30 }, { star: 3, percent: 15 }, { star: 2, percent: 10 }, { star: 1, percent: 5 }].map(
                ({ star, percent }) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-4">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-orange-400 rounded"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-right">{percent}%</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Account Overview */}
            <div className="space-y-3">
                
            <h2 className="text-xl font-semibold font-bricola">Account Overview</h2>
            
            <div className="flex gap-4 lg:justify-between items-start flex-wrap ">

                {
                    accountOverview.map((item,index) => (
                        <NumberCard key={index} Num={item.Num} Title={item.Title} />
                    ))
                }

            </div>

            </div>

                <PerformanceMatrices/>

        </div>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab === "datasets" && (
        <div className="mt-6 text-sm text-gray-600">Datasets will be displayed here.</div>
      )}
      {activeTab === "followers" && (
        <div className="mt-6 text-sm text-gray-600">Followers list will be displayed here.</div>
      )}
    </div>
  );
}
