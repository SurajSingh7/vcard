"use client"; // This ensures the component is client-side since it uses hooks and window events.

import { useRef, useState, useEffect } from "react";
import { VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // Next.js router for client-side navigation
import { setToken, setUser } from "@/store/authSlice";
import toast from "react-hot-toast";
import axios from "axios";
// import { logout } from "../../../services/operations/authAPI";


export default function ProfileDropdown() {

   const router =useRouter();
   const logout= async()=>{
    try {
         
      // for cookies
      await axios.get('/api/auth/logout') 
      
      // redux
      dispatch(setToken(null))
      dispatch(setUser(null))

      // locacal storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      toast.success('Logout successful')

     
       // Set a 'logout' event in localStorage to signal other tabs
      localStorage.setItem('logoutEvent', Date.now()); // Using timestamp to make the value unique

      router.push('/')
      window.location.reload();
  

    } catch (error) {
      
      toast.error(error.message)
      
    }
   
   }
 


  const { user } = useSelector((state) => state.auth);
 
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const imgRef = useRef();
  const proRef = useRef();
  const iconRef = useRef();
  const iconChildRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        e.target !== imgRef.current &&
        e.target !== proRef.current &&
        e.target !== iconRef.current &&
        e.target !== iconChildRef.current
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // if (!user) return null;

  let userName = (user)?user?.name:"Gigantic";

  // let userName = "suraj singh";
  if (userName?.length > 8) {
    userName = `${userName.substring(0, 6)}.`;
  }

  return (
    <button className="relative">
      <div
        ref={proRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-x-1 text-sm text-yellow-50 font-bold"
      >
        <div className=" lg:block">{`Hi ${userName}!`}</div>

        <img
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${userName}`}
          ref={imgRef}
          onClick={() => setOpen(!open)}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[36px] rounded-full object-cover"
        />

        <svg
          ref={iconRef}
          onClick={() => setOpen(!open)}
          className="w-[12px] h-[12px] text-gray-800 text-sm text-richblack-100 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 10"
        >
          <path
            ref={iconChildRef}
            onClick={() => setOpen(!open)}
            d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z"
          />
        </svg>
      </div>

      {open && (
        <div
          className="absolute top-[135%] right-[-5%] md:top-[135%] md:right-[-5%] z-[1000] divide-y-[1px]
          divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-slate-800"
        >
          <div
            onClick={() => {
              // dispatch(logout(router)); // Use router for navigation
              logout();
              setOpen(false);
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[30px] text-sm text-white hover:bg-richblack-700 hover:text-richblack-25"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
}
