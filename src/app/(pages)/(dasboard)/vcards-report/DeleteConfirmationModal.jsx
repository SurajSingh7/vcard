"use client";
import React, { useState } from "react";

export default function DeleteConfirmationModal({ show, onClose, onConfirm }) {
  if (!show) return null;
  const code = process.env.NEXT_PUBLIC_DELETE_CODE;
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (inputCode === code) {
      onConfirm();
    } else {
      setError("Incorrect delete code.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Please enter the delete code to confirm deletion:</p>
        <input
          type="text"
          value={inputCode}
          onChange={(e) => {
            setInputCode(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter delete code"
          className="border border-gray-300 rounded p-2 w-full mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}







// "use client";
// import React from "react";

// export default function DeleteConfirmationModal({ show, onClose, onConfirm }) {
//   if (!show) return null;
//   const code=process.env.NEXT_PUBLIC_DELETE_CODE;
//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="relative bg-white p-4 rounded-lg w-full max-w-sm"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
//         <p className="mb-4">Are you sure you want to delete this card?</p>
//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-3 py-1.5 bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
