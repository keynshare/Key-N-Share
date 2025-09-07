// components/TeamRecipe.tsx
import React from "react";
import Image from "next/image";
import GreedToLearn from "@/components/assets/TeamRecepie/GreedToLearn.svg"
import Coordination from "@/components/assets/TeamRecepie/Coordination.svg"
import Friendlyness from "@/components/assets/TeamRecepie/Friendlyness.svg"
import TeamWork from "@/components/assets/TeamRecepie/TeamWork.svg"

const teamData = [
  {
    color: "bg-[#E8735A]", // reddish
    image:GreedToLearn,
    title: "Greed to Lern",
    desc: "We are just a group of people who love to keep growing.",
  },
  {
    color: "bg-[#B29CF9]", // purple
    image:Coordination,
    title: "Right Coordination",
    desc: "We work together with clarity and purpose.",
  },
  {
    color: "bg-[#FFD36E]", // yellow-orange
    image: TeamWork,
    title: "Team Work",
    desc: "We encourage open discussions about anything in the team.",
  },
  {
    color: "bg-[#1E2D42]", // dark blue
    image:Friendlyness,
    title: "Friendlyness",
    desc: "We help and support each other professionally and privately.",
  },
];

const TeamRecipe = () => {
  return (
    <section className="py-12 flex flex-col items-center text-center px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20">
      {/* Heading */}
      <h2 className="text-xl md:text-3xl lg:text-[42px] font-bold mb-10 font-bricola">
        Our Unique Team Recipe
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl">
        {teamData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-start">
            {/* Placeholder image */}
            <div className={`${item.color} w-60 h-32 rounded-xl flex items-center overflow-hidden justify-center`}>
                <Image src={item.image} alt="" className="object-cover w-full h-full" />
            </div>
             

            {/* Text */}
            <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
            <p className="text-gray-600 text-start mt-1 max-w-[250px]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamRecipe;
