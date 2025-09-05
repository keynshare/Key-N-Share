import Image from "next/image";
import { Star,ShoppingCart } from "lucide-react";
import User from "@/components/assets/User.svg";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import Matic from "@/components/assets/Matic"


type Dataset = {
  Image?: string;
  Title?: string;
  Description?: string;
  Type?: string;
  Price?: number | string;
  Size?: string;
  Extention?: string;
  Tags?: string[];
  CoverImage?: string;
  Name?: string;
  Rating?: string;
  Time?: string;
  UserImage?: string;
};

export default function Header({Size='256 mb',Extention='CSV',Price='46' ,Tags=[ "Arts and Entertainment", "Music", "Data Science", "Computer Science", ] ,CoverImage="/Thumbnail.svg" ,Title="Top Spotify Listening History Songs in Countries",Name='Mohammad Sumbul',Rating='4.5',Time='4 months',UserImage=User.src}:Dataset) {
  return (
    <>
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="lg:col-span-2 relative overflow-hidden rounded-xl border dark:border-2 border-gray-200 dark:border-gray-400">
        <img
          src={CoverImage}
          alt={Title}
          width={1600}
          height={900}
          className="w-full h-auto"
        />
      </div>
    
    </div>
    <div className="space-y-4 pb-6">
      <h1 className="text-3xl md:text-4xl font-bold font-bricola leading-tight">
        {Title}
      </h1>
       
       <div className="flex items-start gap-3">
                <Image src={UserImage} alt={Name} width={50} height={50} className="rounded-full" />
                <div className="flex flex-col">
                  <span className=" font-medium">{Name}</span>
                  <span className="inline-flex items-center gap-1"><Star size={18} className="text-yellow-500"/>{Rating}</span>
                </div>
        </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span>Uploaded {Time} ago</span>
        <span>•</span>
        <span>{Size}</span>
        <span>•</span>
        <span>{Extention}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 rounded-md border dark:border-gray-700">
            {tag}
          </span>
        ))}
      </div>

        <div className="flex flex-wrap justify-start items-center gap-4">

            <span className="flex items-center gap-2">
            <Matic size={32} /> 
            <h6 className="text-[42px]  ">{Price} </h6>
            </span>

            <SecondaryBtn> <ShoppingCart size={20} /> Add to Cart</SecondaryBtn>
            <PrimaryBtn>Buy Now</PrimaryBtn>
        </div>

    </div>
    </>
  );
}