import React from "react";
import Image from "next/image";
import banner from "../../../public/vms1.jpg"; // Adjust path based on the location of the `signup.jpg` in the `public` folder.
// import banner from "../../public/vms1.jpg"

const ContactBanner = () => {
  return (
    <div className="flex flex-col gap-8 rounded-xl bg-gray-800 p-4 lg:p-6">
      {/* Optimized Next.js Image */}
      <Image
        src={banner} // Image path
        alt="Contact Banner" // Accessibility alt text
        className="shadow-[10px_-5px_45px_-5px] shadow-[#70ca70] rounded-xl"
        loading="lazy" // Lazy load for performance
      />
    </div>
  );
};

export default ContactBanner;
// #DC143C