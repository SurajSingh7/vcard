"use client"

import { PenIcon as UserPen, UsersRound, BookUser } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function SmallScreenBottomNav() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState(pathname)

  // Update active item when pathname changes
  useEffect(() => {
    setActiveItem(pathname)
  }, [pathname])

  const navItems = [
    { name: "V Card", icon: UserPen, href: "/visitor-card" },
    { name: "Report", icon: BookUser, href: "/vcards-report" },
    { name: "Staffs", icon: UsersRound, href: "/staff-details" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 shadow-sm dark:bg-gray-900 dark:border-gray-800 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center transition-all duration-200"
              onClick={() => setActiveItem(item.href)}
            >
              <item.icon
                className={`w-5 h-4 mb-1 ${
                  activeItem === item.href ? "text-orange-500" : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  activeItem === item.href ? "text-orange-500" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.name}
              </span>
              {activeItem === item.href && <span className="absolute bottom-0 w-10 h-0.5 bg-orange-500 rounded-full" />}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}












// 'use client'

// import {UserPen ,UsersRound,BookUser} from 'lucide-react'
// import Link from "next/link"
// import { useState } from 'react'
// import { usePathname } from 'next/navigation'

// export default function SmallScreenBottomNav() {
//   const pathname = usePathname()
//   const [activeItem, setActiveItem] = useState(pathname)

//   const navItems = [
//     { name: 'V Card', icon: UserPen, href: '/visitor-card' },
//     { name: 'Report', icon: BookUser, href: '/vcards-report' },
//     { name: 'Staffs', icon: UsersRound, href: '/staff-details' },
//   ]

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
//       <div className="max-w-md mx-auto px-4">
//         <div className="flex items-center justify-between">
//           {navItems.map((item) => (
//             <Link 
//               key={item.name}
//               href={item.href}
//               className="flex flex-col items-center gap-1"
//               onClick={() => setActiveItem(item.href)}
//             >
//               <item.icon className={`w-6 h-6 ${activeItem === item.href ? 'text-black ' : 'text-gray-600'}`} />
//               <span className={`text-xs ${activeItem === item.href ? 'text-black font-bold' : 'text-gray-600'}`}>
//                 {item.name}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </nav>
//   )
// }







