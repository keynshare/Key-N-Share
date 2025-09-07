import React from "react";
import PrimaryBtn from "@/components/SharedComponents/Btns/PrimaryBtn";

const TopSection = () => {
  return (
    <section className="flex flex-col items-center text-center px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20 gap-10 py-10">
      {/* Heading */}
     <div>
        <h2 className="text-[#929292] mb-2 text-xl sm:text-3xl md:text-[31px] lg:text-[42px] xl:text-5xl font-bold font-bricola">
        Ready to make Data Secure?
      </h2>
      <h1 className="text-xl sm:text-3xl font-bold md:text-[31px] lg:text-[42px] xl:text-5xl font-bricola">
        Use Key N Share Now
      </h1>
      </div> 

      {/* Button */}
      <PrimaryBtn sparkelClass='sm:!-top-4  -top-[17px] w-[180px] md:w-[200px]'>
        Upload Dataset
      </PrimaryBtn>

      {/* Image Placeholder */}
      <div className="w-full max-w-3xl h-[320px] lg:h-[400px] bg-gray-300 rounded-md flex items-center justify-center mt-6">
        <span className="text-gray-600 text-lg font-semibold">
          Group Photo Placeholder
        </span>
      </div>
    </section>
  );
};

export default TopSection;
