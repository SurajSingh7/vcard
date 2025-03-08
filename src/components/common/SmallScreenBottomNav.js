'use client'

import {UserPen ,UsersRound,BookUser} from 'lucide-react'
import Link from "next/link"
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function SmallScreenBottomNav() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState(pathname)

  const navItems = [
    { name: 'V Card', icon: UserPen, href: '/visitor-card' },
    { name: 'Report', icon: BookUser, href: '/vcards-report' },
    { name: 'Staff', icon: UsersRound, href: '/staff-details' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1"
              onClick={() => setActiveItem(item.href)}
            >
              <item.icon className={`w-6 h-6 ${activeItem === item.href ? 'text-black ' : 'text-gray-600'}`} />
              <span className={`text-xs ${activeItem === item.href ? 'text-black font-bold' : 'text-gray-600'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}







