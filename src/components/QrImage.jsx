"use client";

import React, { useState } from "react";
import Image from "next/image";
import qrimage from "../../public/convergence-qrcode.png";

const ImageModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Thumbnail Image */}
      <Image
        src={qrimage}
        alt="qrImage"
        width={42}
        className="cursor-pointer transition-transform transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      />

      {/* Modal for Full-size Image */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative">
            <Image
              src={qrimage}
              alt="Enlarged Image"
              width={800}
              height={600}
              className="rounded shadow-xl w-[800px] h-[600px] md:w-[400px] md:h-[300px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
