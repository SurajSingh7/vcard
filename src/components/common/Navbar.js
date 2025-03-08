"use client"; // This ensures the component runs on the client side since it uses Redux and browser-specific features.

import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropDown";
import Image from "next/image";
import logo from "../../../public/logo.png";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu in mobile view

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <div
        className={`flex h-[64px] items-center justify-center fixed z-50 top-0 left-0 w-full bg-gray-800 border-b border-gray-700
        shadow-lg transition-all duration-200`}
      >
        <div className="flex w-11/12  items-center justify-between mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={48}
              height={48}
              className="shadow-md rounded-lg"
              loading="lazy"
            />
          </Link>

          <h1 className="text-white font-bold  text-lg sm:text-xl shadow-md px-2 rounded-lg">
               Visitor Card
          </h1>

          {/* Links and ProfileDropdown for Desktop */}
          <div className="flex items-center gap-4">
            {token && <ProfileDropdown />}
          </div>

          {/* Hamburger menu for mobile */}
          {/* <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button> */}
        </div>

        {/* Dropdown Menu for Mobile */}
        {/* {isMenuOpen && (
          <div className="absolute   top-16 left-0 w-full bg-gray-800 shadow-lg p-4 md:hidden flex flex-col items-center gap-4">
            {token && <ProfileDropdown />}
          </div>
        )} */}
      </div>
    </>
  );
}

export default Navbar;










