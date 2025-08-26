import React from 'react'
import Image from "next/image";
import User from "@/components/assets/User.svg";
import clsx from 'clsx';

type RequestSidebarProps = {
  ShowRequest?: boolean,
  Name? : string,
  Time? : string,
  UserImage? : string
}

function RequestSidebar({ShowRequest,Name='Mohammad Sumbul',Time='4 Minutes',UserImage=User.src}:RequestSidebarProps) {
  return (
      <aside className={clsx( ShowRequest ? '-translate-x-full lg:translate-x-0' : 'translate-x-0' ,"fixed top-0 left-0 h-[100vh] shadow-lg overflow-y-auto z-20 pt-24 transform transition-transform duration-300  bg-white dark:bg-[#131313] lg:pt-4 2xl:w-[80%]  w-fit lg:sticky col-span-1 lg:top-24 lg:h-fit lg:max-h-[82vh] lg:rounded-xl border-t border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-4")}>
        <div title='Mohammad Sumbul' className="flex lg:max-w-full items-center max-w-[231px] border dark:border-gray-600 p-2 rounded-lg gap-3">
          <Image src={UserImage} alt="author" width={50} height={50} className=" rounded-full" />
          <div className="flex flex-col">
            <span className=" line-clamp-1 ">{Name}</span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-500  ">Requested {Time} ago</span>
          </div>
        </div>       
      </aside>
  )
}

export default RequestSidebar
