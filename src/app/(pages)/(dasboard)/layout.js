'use client';

import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { Eye, PlusCircle, GraduationCap, FilePlus,UserPen,UsersRound,BookUser } from 'lucide-react'
import { usePathname } from "next/navigation"; // Use for determining the current route
import { useState } from "react";
import { Bars3Icon, ChevronDoubleLeftIcon } from "@heroicons/react/24/outline"; // Import Heroicons
import SmallScreenBottomNav from "@/components/common/SmallScreenBottomNav";
import { Pen } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // Current path to highlight active link
  const [menuOpen, setMenuOpen] = useState(true); // Toggle menu visibility

  return (
    <div className="">

      {/* Navbar */}
      <div className="h-14 bg-red-600">
        <Navbar />
      </div>
      
      {/* for tablet & laptop md+ */}
      <div className="hidden md:flex min-h-screen ">
        {/* Fixed Sidebar */}
        {menuOpen && (
          <aside className={` hidden md:flex md:w-[15%] xl:w-[13%]  bg-gray-800 shadow-lg p-4 xl:p-4 text-white fixed top-14 left-0 bottom-0  flex-col`}>
            <nav className="">     
              <div className="h-4"></div>
              <ul className="space-y-6">
                <li>
                  {/* <div className="flex mt-4 items-center"> */}
                    <Link href="/visitor-card">
                      
                      {/* for laptop(xl+) */}
                      <div
                        className={` hidden xl:block text-center py-2  rounded-lg transition duration-300 ${
                          pathname === "/visitor-card"
                            ? "bg-[#2DD4BF] text-white"
                            : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                        }`}
                      >
                         <div className="flex justify-center gap-2">
                         <UserPen />
                             <div > V Card</div>
                        </div>


                      </div>

                       {/* for tablet(md+) */} 
                      <div
                        className={`   md:block xl:hidden  text-center py-2  rounded-lg transition duration-300 ${
                          pathname === "/visitor-card"
                            ? "bg-[#2DD4BF] text-white"
                            : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex justify-center gap-2">
                             <UserPen />
                             <div >Card</div>
                        </div>
                    

                      </div>



                    </Link>
                  
                  {/* </div> */}
                </li>
                <li>
                  <Link href="/vcards-report">

                   {/* for laptop(xl+) */}
                    <div
                      className={`hidden xl:block text-center  py-2  rounded-lg transition duration-300 ${
                        pathname === "/vcards-report"
                          ? "bg-[#2DD4BF] text-white"
                          : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                      }`}
                    >
                      
                      <div className="flex justify-center gap-2"> 
                            <BookUser/>  
                            <div > Report </div>   
                        </div>


                    </div>

                  {/* for tablet(md+) */} 
                    <div
                      className={` hidden md:block xl:hidden text-center  py-2  rounded-lg transition duration-300 ${
                        pathname === "/vcards-report"
                          ? "bg-[#2DD4BF] text-white"
                          : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                      }`}
                    >
                     
                        <div className="flex justify-center gap-2"> 
                               <BookUser/>  
                            <div >Report</div>   
                        </div>
                    </div>

                  </Link>
                </li>
                <li>
                    {/* for laptop(xl+) */}
                  <Link href="/staff-details">
                    <div
                      className={`hidden xl:block text-center py-2 rounded-lg transition duration-300 ${
                        pathname === "/staff-details"
                          ? "bg-[#2DD4BF] text-white"
                          : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex justify-center gap-2">  
                           <UsersRound/> 
                         <div > Staff</div> 
                     </div>

                    </div>

                     {/* for tablet(md+) */} 
                    <div
                      className={`hidden md:block xl:hidden text-center py-2  rounded-lg transition duration-300 ${
                        pathname === "/staff-details"
                          ? "bg-[#2DD4BF] text-white"
                          : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                      }`}
                    >
                       <div className="flex justify-center gap-2">  
                          <UsersRound/> 
                         <div > Staff</div> 
                     </div>



                      
                    </div>

                  </Link>
                </li>

                <li>
                    {/* for laptop(xl+) */}
                  <Link href="/vcards-report-admin">
                    <div
                      className={`hidden xl:block text-center py-2 rounded-lg transition duration-300 ${
                        pathname === "/vcards-report-admin"
                          ? "bg-[#2DD4BF] text-white"
                          : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex justify-center gap-2">  
                          <BookUser/>  
                         <div >Report</div> 
                     </div>

                    </div>

                     {/* for tablet(md+) */} 
                    <div
                      className={`hidden md:block xl:hidden text-center py-2  rounded-lg transition duration-300 ${
                        pathname === "/vcards-report-admin"
                          ? "bg-[#2DD4BF] text-white"
                          : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
                      }`}
                    >
                       <div className="flex justify-center gap-2">  
                             <BookUser/>  
                         <div > Report</div> 
                     </div>
                    </div>

                  </Link>
                </li>

              </ul>
            </nav>
          </aside>
        )}

        
         {/* slider button on navbar(by-top,left) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="  hidden md:block fixed  left-[10%] rounded-full top-3 p-2  bg-gray-900 hover:bg-gray-700 transition duration-300 z-50 shadow-lg"
          >
            {(!menuOpen)?<Bars3Icon className="h-6 w-6 text-[#c8eade]" />
                        :<ChevronDoubleLeftIcon className="h-6 w-6  font-extrabold text-[#c8eade]" />
            }
          </button>

        

        {/* Main Content */}
        <main className={`p-6 ${menuOpen ? "md:ml-[15%] md:w-[85%] xl:ml-[13%] xl:w-[87%]" : "w-full"}`}>
          {/* Ensure children content is unaffected */}
          <div className="rounded-lg shadow-lg">{children}</div>
        </main>

      </div>




      {/* for mobile responsive <md */}
      <div className="md:hidden flex min-h-screen ">
       
          {/* Main Content */}
          <main className={`p-6 w-full`}>
            <div className="rounded-lg shadow-lg">{children}</div>
          </main>

          {/* for footer show */}
          <div className="h-14 md:hidden"></div>

          <div className="md:hidden">
          <SmallScreenBottomNav/>
          </div>
      </div>

      

    </div>
  );
}








