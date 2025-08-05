'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '@/public/logo.svg';

const Footer = () => {
  return (
    <footer className="border-t pt-8 pb-4 bg-white">
      <div className=" mx-5 xl:px-[80px] 3xl:px-[150px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row justify-between gap-10 lg:gap-14">
          {/* Logo Section */}
          <div className="flex-shrink-0">
          <div className={`text-[29px] flex items-center gap-4 font-bold text-black transform transition-all duration-700 ease-out `}>
            <Image
              src={Logo}
              alt="Key N Share"
              width={43}
              className="w-[30px] xl:w-[43.38px] "
            />
            <p
              className='font-cinzel transition-all text-2xl xl:text-[29px] duration-500 ease-in-out overflow-hidden whitespace-nowrap'
            >
              Key N Share
            </p>
          </div>
          </div>

          {/* Link Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 w-full lg:grid-cols-4 gap-5 lg:gap-0 flex-grow">
            <div>
              <h3 className="font-bold text-lg xl:text-xl mb-2 font-bricola">Pages</h3>
              <ul className="space-y-1 text-lg">
                <li className='hover:text-orange-500'><Link href="/about">About Us</Link></li>
                <li className='hover:text-orange-500'><Link href="/orders">Previous Orders</Link></li>
                <li className='hover:text-orange-500'><Link href="/datasets">Your Datasets</Link></li>
                <li className='hover:text-orange-500'><Link href="/upload">Upload Datasets</Link></li>
                <li className='hover:text-orange-500'><Link href="/favourites">Favourites</Link></li>
                <li className='hover:text-orange-500'><Link href="/cart">Cart</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-lg xl:text-xl font-bricola">Legal</h3>
              <ul className="space-y-1 text-lg">
                <li className='hover:text-orange-500'><Link href="/terms">Terms & Conditions</Link></li>
                <li className='hover:text-orange-500'><Link href="/privacy">Privacy Policy</Link></li>
                <li className='hover:text-orange-500'><Link href="/cookies">Cookies Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-lg xl:text-xl font-bricola ">Support</h3>
              <ul className="space-y-1   text-lg">
                <li className='hover:text-orange-500'><Link href="/contact">Contact Us</Link></li>
                <li className='hover:text-orange-500'><Link href="/faqs">FAQs</Link></li>
                <li className='hover:text-orange-500'><Link href="https://discord.gg/">Discord</Link></li>
                <li className='hover:text-orange-500'><Link href="https://github.com/">Github</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-bold mb-2 text-lg xl:text-xl whitespace-nowrap font-bricola">Subscribe to our newsletter</h3>
              <p className=" mb-3 text-lg md:w-[120%] 2xl:w-[110%] 3xl:w-auto">Lorem Ipsum is simply dummy text of the printing and industry.</p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter The Email"
                  className="px-4 py-2 border rounded-md text-sm"
                />
                <button
                  type="submit"
                  className="bg-black text-white py-2 rounded-md   hover:bg-gray-900"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-4 mt-8 text-center  md:text-lg text-gray-600">
          Copyright © 2025 <span className="text-orange-500 font-medium">Cinfinite</span> | Designed & Developed by <span className="text-orange-500 font-medium">Cinfinite</span> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
