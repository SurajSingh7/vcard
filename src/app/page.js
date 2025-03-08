'use client'

import LoginComp from "@/components/login/LoginComp";
import Link from "next/link";
import logo from "../../public/logo.png";
import Image from "next/image";



export default function Home() {
  return (
    <div>

      {/* NavBar for login */}
      <div>

        <div
          className={`flex h-[64px] items-center justify-center border-b-[0px] border-b-richblack-900
            fixed z-50 top-0 left-0 w-full bg-[#000814]
            transition-all duration-200 shadow-[10px_-5px_15px_-5px] shadow-white`}
        >
          <div className="mx-4 m-4 md:m-0 justify-between gap-x-1 sm:justify-center sm:gap-x-10 md:gap-x-0 flex w-11/12 max-w-maxContent items-center md:justify-between">
                {/* Logo */}
              <Link href="/">
                <Image
                  src={logo} // Image path
                  alt="Logo" // Accessibility alt text
                  width={64} // Specify the width in pixels
                  height={64} // Specify the height in pixels
                  className="shadow-[10px_-5px_49px_-5px] shadow-[#70ca70] rounded-lg"
                  loading="lazy"
                />
                {/* suraj */}
              </Link>

              <Link href="/">
             
                <h1 className="shadow-[10px_-5px_49px_-5px] shadow-white text-white font-bold text-xl rounded-lg px-3 py-1">
                  Gigantic Visitor Card
                </h1>
              </Link>
 

          </div>
        </div>
        
      </div>

      {/* login component */}
      <div>
         <LoginComp/>
      </div>
      
    </div>
  );
}

