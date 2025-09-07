// components/WellBeing.tsx
import React from "react";
import DataHosting from "@/components/assets/DataHosting.svg";
import Encryption from "@/components/assets/Encryption.svg";
import Trustless from "@/components/assets/Trustless.svg";
import Traceability from "@/components/assets/Traceability.svg";
import Privacy from "@/components/assets/Privacy.svg";
import Duplicate from "@/components/assets/Duplicate.svg";
import IPProtect from "@/components/assets/IPProtect.svg";
import Rating from "@/components/assets/Rating.svg";
import AboutFiller from "@/components/assets/AboutFiller.svg";
import Tutorial from "../LandingPage/Tutorial";

import Image from "next/image";
const features = [
  {
    icon: DataHosting,
    title: "Decentralized Data Hosting",
    desc: "No single point of failure your data lives securely across the IPFS network.",
  },
  {
    icon: Encryption,
    title: "End-to-End Encryption",
    desc: "Modern techniques of data encryption keeps your data safe from breaches.",
  },
  {
    icon: Trustless,
    title: "Trustless Architecture",
    desc: "Users don’t rely on any central authority; smart contracts handle fairness.",
  },
  {
    icon: Traceability,
    title: "Full Data Traceability",
    desc: "Every access and transaction is logged; misuse can be tracked with watermarking.",
  },
  {
    icon: Privacy,
    title: "User Privacy First",
    desc: "Email is only used for access; no personal data is stored or exposed.",
  },
  {
    icon: Duplicate,
    title: "Duplicate Detection Engine",
    desc: "Uses content hashing to identify and block duplicate datasets automatically.",
  },
  {
    icon: IPProtect,
    title: "Claim Original Ownership",
    desc: "Submit proof of authorship to challenge unauthorized or duplicated dataset uploads.",
  },
  {
    icon: Rating,
    title: "Verified Seller Ratings",
    desc: "Buyers can rate and review datasets, helping highlight trusted creators.",
  },
];

const WellBeing = () => {
  return (
    <div>
    <section className="py-16  px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20  overflow-hidden relative ">
      {/* Heading */}

        <div className="flex items-center justify-center mb-6 w-[180%] aspect-square z-[-1] absolute top-20 left-1/2 -translate-x-1/2 rounded-full [background:linear-gradient(1deg,rgba(255,255,255,0.00)_72.45%,#FF870F_110.19%)] shadow-[0_-39px_49px_-23px_rgba(255,128,0,0.6)] 10000px border-t-[5px] border-t-[#EF9300] " />

      <h2 className="text-xl md:text-3xl lg:text-[42px]  font-bold pt-52 text-center mb-12 font-bricola">
        Your Well Being Matters
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 z-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#131313] shadow-md rounded-lg p-5 flex flex-col gap-2 text-left border dark:border-gray-600 "
          >
            {/* Icon */}
            <Image src={item.icon} alt="icon" className="w-10 h-10" />
            {/* Title */}
            <h3 className="font-semibold text-lg ">{item.title}</h3>
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-200 text-sm md:text-base">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Bento Grid */}

         <div className=" flex flex-col gap-4 w-full mt-16 ">
     
        <div className="grid grid-cols-4 gap-4 auto-rows-[350px] w-full">
        <div className="bg-gray-200 rounded-md col-span-full md:col-span-3 row-span-1"></div>
        <div className="bg-gray-200 rounded-md col-span-full md:col-span-1 row-span-1"></div>
        </div>

        <div className="grid grid-cols-5 gap-4 auto-rows-[350px] w-full">
        <div className="bg-gray-200 rounded-md col-span-full md:col-span-3 row-span-1"></div>
        <div className="bg-gray-200 rounded-md col-span-full md:col-span-2 row-span-1"></div>
        </div>
     
        <div className="grid grid-cols-4 gap-4 auto-rows-[350px] w-full">
        <div className="bg-gray-200 rounded-md col-span-full md:col-span-1 row-span-1"></div>
        <div className="bg-gray-200 rounded-md col-span-full md:col-span-3 row-span-1"></div>
        </div>

      </div>

      

    </section>
    <div className="relative w-full overflow-hidden">
    <Tutorial/>
    <Image src={AboutFiller} alt="Key N Share Filler" className="absolute hidden md:block -top-40 z-[-1]  -right-0  h-full" />
   </div>
    </div>
  );
};

export default WellBeing;
