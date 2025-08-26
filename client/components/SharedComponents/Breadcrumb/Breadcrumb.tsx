"use client";
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label?: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  isHome?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  showHome = true, 
  isHome=false,
  className = "" 
}) => {
  return (
    <nav className={`flex items-center space-x-2  ${className}`} aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link 
            href="/dashboard" 
            className={`${isHome ? 'text-orange-500' : ''} flex items-center text-gray-500 hover:text-orange-500 transition-colors duration-200`}
          >
            <Home size={16} className="mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
        </>
      )}
      
      {items && items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span 
            title={item.label}
              className={`${
                item.isActive 
                  ? "text-orange-500 font-medium max-w-[120px] sm:max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis" 
                  : "text-gray-400 "
              }`}
            >
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight size={16} className="text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
