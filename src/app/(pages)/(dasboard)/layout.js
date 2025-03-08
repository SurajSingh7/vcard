'use client';

import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { UserPen, UsersRound, BookUser } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Bars3Icon, ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import SmallScreenBottomNav from "@/components/common/SmallScreenBottomNav";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(true);

  // Memoized toggle to avoid inline function recreation on each render
  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div className="h-14 bg-red-600">
        <Navbar />
      </div>

      {/* For mobile (<md) */}
      <div className="flex min-h-screen">
        <main className=" w-full">
          <div className="rounded-lg shadow-lg">{children}</div>
        </main>
        <div className="h-14"></div>
        <div>
          <SmallScreenBottomNav />
        </div>
      </div>
    </div>
  );
}






















// 'use client';

// import Navbar from "@/components/common/Navbar";
// import Link from "next/link";
// import { UserPen, UsersRound, BookUser } from 'lucide-react';
// import { usePathname } from "next/navigation";
// import { useState, useCallback } from "react";
// import { Bars3Icon, ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
// import SmallScreenBottomNav from "@/components/common/SmallScreenBottomNav";

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();
//   const [menuOpen, setMenuOpen] = useState(true);

//   // Memoized toggle to avoid inline function recreation on each render
//   const toggleMenu = useCallback(() => {
//     setMenuOpen(prev => !prev);
//   }, []);

//   return (
//     <div>
//       {/* Navbar */}
//       <div className="h-14 bg-red-600">
//         <Navbar />
//       </div>

//       {/* For tablet & laptop (md+) */}
//       <div className="hidden md:flex min-h-screen relative">
//         {/* Sidebar is always rendered and slides in/out using CSS transform */}
//         <aside
//           className={`hidden md:flex md:w-[15%] xl:w-[13%] bg-gray-800 shadow-lg p-4 text-white fixed top-14 left-0 bottom-0 flex-col transition-transform duration-300 ${
//             menuOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <nav>
//             <div className="h-4" />
//             <ul className="space-y-6">
//               <li>
//                 <Link href="/visitor-card">
//                   <>
//                     {/* Laptop (xl+) */}
//                     <div
//                       className={`hidden xl:block text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/visitor-card"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <UserPen />
//                         <div>V Card</div>
//                       </div>
//                     </div>
//                     {/* Tablet (md+ and not xl) */}
//                     <div
//                       className={`md:block xl:hidden text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/visitor-card"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <UserPen />
//                         <div>Card</div>
//                       </div>
//                     </div>
//                   </>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/vcards-report">
//                   <>
//                     <div
//                       className={`hidden xl:block text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/vcards-report"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <BookUser />
//                         <div>Report</div>
//                       </div>
//                     </div>
//                     <div
//                       className={`hidden md:block xl:hidden text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/vcards-report"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <BookUser />
//                         <div>Report</div>
//                       </div>
//                     </div>
//                   </>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/staff-details">
//                   <>
//                     <div
//                       className={`hidden xl:block text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/staff-details"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <UsersRound />
//                         <div>Staff</div>
//                       </div>
//                     </div>
//                     <div
//                       className={`hidden md:block xl:hidden text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/staff-details"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <UsersRound />
//                         <div>Staff</div>
//                       </div>
//                     </div>
//                   </>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/vcards-report-admin">
//                   <>
//                     <div
//                       className={`hidden xl:block text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/vcards-report-admin"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <BookUser />
//                         <div>Report</div>
//                       </div>
//                     </div>
//                     <div
//                       className={`hidden md:block xl:hidden text-center py-2 rounded-lg transition duration-300 ${
//                         pathname === "/vcards-report-admin"
//                           ? "bg-[#2DD4BF] text-white"
//                           : "bg-gray-900 text-[#c8eade] hover:bg-gray-700"
//                       }`}
//                     >
//                       <div className="flex justify-center gap-2">
//                         <BookUser />
//                         <div>Report</div>
//                       </div>
//                     </div>
//                   </>
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Toggle Button */}
//         <button
//           onClick={toggleMenu}
//           className="hidden md:block fixed left-[10%] rounded-full top-3 p-2 bg-gray-900 hover:bg-gray-700 transition duration-300 z-50 shadow-lg"
//         >
//           {menuOpen ? (
//             <ChevronDoubleLeftIcon className="h-6 w-6 text-[#c8eade]" />
//           ) : (
//             <Bars3Icon className="h-6 w-6 text-[#c8eade]" />
//           )}
//         </button>

//         {/* Main Content */}
//         <main
//           className={`p-6 ${
//             menuOpen ? "md:ml-[15%] md:w-[85%] xl:ml-[13%] xl:w-[87%]" : "w-full"
//           }`}
//         >
//           <div className="rounded-lg shadow-lg">{children}</div>
//         </main>
//       </div>

//       {/* For mobile (<md) */}
//       <div className="md:hidden flex min-h-screen">
//         <main className="p-6 w-full">
//           <div className="rounded-lg shadow-lg">{children}</div>
//         </main>
//         <div className="h-14"></div>
//         <div>
//           <SmallScreenBottomNav />
//         </div>
//       </div>
//     </div>
//   );
// }























