import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page



// "use client"
// import { useState, useEffect } from "react"

// export default function VisitorCardsPage() {
//   const [visitorCards, setVisitorCards] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedFilter, setSelectedFilter] = useState("All")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   // dateSortOrder can be null (default), "asc", or "desc"
//   const [dateSortOrder, setDateSortOrder] = useState(null)
//   const [selectedImage, setSelectedImage] = useState(null) // state for modal image
//   // New state for pin filter toggle
//   const [showPinnedOnly, setShowPinnedOnly] = useState(false)

//   const cardsPerPage = 7

//   useEffect(() => {
//     async function fetchVisitorCards() {
//       try {
//         const response = await fetch("/api/visitorcards")
//         const data = await response.json()
//         console.log("API response:", data)
//         if (Array.isArray(data)) {
//           setVisitorCards(data)
//         } else if (data.visitorCards && Array.isArray(data.visitorCards)) {
//           setVisitorCards(data.visitorCards)
//         } else {
//           setVisitorCards([])
//         }
//       } catch (error) {
//         console.error("Error fetching visitor cards:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchVisitorCards()
//   }, [])

//   // Reset page when search term, filter, or pin filter changes.
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchTerm, selectedFilter, showPinnedOnly])

//   // Filter by "Assigned To" if selected.
//   const filteredByFilter =
//     selectedFilter === "All" ? visitorCards : visitorCards.filter((card) => card.assignTo === selectedFilter)

//   // Further filter by search term (by name).
//   const filteredCards = filteredByFilter.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()))

//   // Apply the pin filter if enabled.
//   const finalFilteredCards = showPinnedOnly ? filteredCards.filter((card) => card.pin) : filteredCards

//   // Sort the cards by scheduled date if sort order is set.
//   const sortedCards = dateSortOrder
//     ? [...finalFilteredCards].sort((a, b) => {
//         const dateA = new Date(a.sedulertime)
//         const dateB = new Date(b.sedulertime)
//         return dateSortOrder === "asc" ? dateA - dateB : dateB - dateA
//       })
//     : finalFilteredCards

//   // Pagination calculations.
//   const totalPages = Math.ceil(sortedCards.length / cardsPerPage)
//   const indexOfLastCard = currentPage * cardsPerPage
//   const indexOfFirstCard = indexOfLastCard - cardsPerPage
//   const paginatedCards = sortedCards.slice(indexOfFirstCard, indexOfLastCard)

//   // Create unique filter buttons for "Assigned To".
//   const assignToSet = new Set(visitorCards.map((card) => card.assignTo))
//   const filterButtons = ["All", ...assignToSet]

//   // Helper function to format date as dd-mm-yyyy.
//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     const day = String(date.getDate()).padStart(2, "0")
//     const month = String(date.getMonth() + 1).padStart(2, "0")
//     const year = date.getFullYear()
//     return `${day}-${month}-${year}`
//   }

//   // Toggle the sort order when "Scheduled Date" header is clicked.
//   // Cycle: Default (null) -> Ascending -> Descending -> Default...
//   const toggleSortOrder = () => {
//     setDateSortOrder((prev) => {
//       if (prev === null) return "asc"
//       if (prev === "asc") return "desc"
//       return null
//     })
//   }

//   // Open the modal with the selected image.
//   const handleImageClick = (imageUrl) => {
//     setSelectedImage(imageUrl)
//   }

//   // Toggle the pin status and update the backend.
//   const handleTogglePin = async (id, currentPin) => {
//     const newPin = !currentPin
//     // Update state optimistically.
//     setVisitorCards((prevCards) => prevCards.map((card) => (card._id === id ? { ...card, pin: newPin } : card)))
//     try {
//       const response = await fetch("/api/visitorcards", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id, field: "pin", value: newPin }),
//       })
//       if (!response.ok) {
//         // If update fails, revert change.
//         setVisitorCards((prevCards) => prevCards.map((card) => (card._id === id ? { ...card, pin: currentPin } : card)))
//         console.error("Failed to update pin")
//       }
//     } catch (error) {
//       console.error("Error updating pin:", error)
//       setVisitorCards((prevCards) => prevCards.map((card) => (card._id === id ? { ...card, pin: currentPin } : card)))
//     }
//   }

//   if (loading) {
//     return <div className="text-center mt-10">Loading...</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 bg-orange-50">
//       <h1 className="text-3xl font-bold mb-6 text-orange-800">Visitor Cards</h1>

//       {/* Search Bar and Pin Filter Button */}
//       <div className="mb-4 flex flex-wrap items-center gap-2">
//         <div className="flex-1 min-w-[200px]">
//           <input
//             type="text"
//             placeholder="Search by name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
//           />
//         </div>
//         <button
//           onClick={() => setShowPinnedOnly((prev) => !prev)}
//           className={`p-2 rounded-full transition-colors ${
//             showPinnedOnly ? "bg-orange-500 text-white" : "bg-orange-200 text-orange-800"
//           }`}
//           aria-label={showPinnedOnly ? "Show all cards" : "Show pinned cards only"}
//           title={showPinnedOnly ? "Show all cards" : "Show pinned cards only"}
//         >
//           <span className="text-xl">{showPinnedOnly ? "★" : "☆"}</span>
//         </button>
//       </div>

//       {/* Filter Buttons */}
//       <div className="mb-4 flex flex-wrap gap-2">
//         {filterButtons.map((buttonLabel) => (
//           <button
//             key={buttonLabel}
//             onClick={() => setSelectedFilter(buttonLabel)}
//             className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded transition-colors ${
//               selectedFilter === buttonLabel ? "bg-orange-500 text-white" : "bg-orange-200 text-orange-800"
//             }`}
//           >
//             {buttonLabel}
//           </button>
//         ))}
//       </div>

//       {/* Date Sort Button for Mobile */}
//       <div className="md:hidden mb-4">
//         <button
//           onClick={toggleSortOrder}
//           className="w-full px-4 py-2 bg-orange-100 text-orange-800 rounded flex justify-between items-center"
//         >
//           <span>Sort by Date</span>
//           <span>{dateSortOrder === null ? "(Default)" : dateSortOrder === "asc" ? "↑" : "↓"}</span>
//         </button>
//       </div>

//       {/* Desktop Table View */}
//       <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-orange-100">
//             <tr>
//               {/* Serial Number Column */}
//               <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800">S.No</th>
//               <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800">Name</th>
//               <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800">Front</th>
//               <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800">Back</th>
//               <th
//                 className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 cursor-pointer hover:bg-orange-200"
//                 onClick={toggleSortOrder}
//               >
//                 Scheduled Date {dateSortOrder === null ? "(Default)" : dateSortOrder === "asc" ? "↑" : "↓"}
//               </th>
//               <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800">Contact Number</th>
//               <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800">Note</th>
//               <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800">Assigned To</th>
//               {/* New Columns */}
//               <th className="py-3 px-4 border-b border-orange-200 text-center text-orange-800">WhatsApp</th>
//               <th className="py-3 px-4 border-b border-orange-200 text-center text-orange-800">Pin</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedCards.map((card, index) => {
//               // Calculate overall serial number based on pagination.
//               const serialNo = (currentPage - 1) * cardsPerPage + index + 1
//               return (
//                 <tr key={card._id} className="hover:bg-orange-50 transition-colors">
//                   <td className="py-2 px-4 border-b border-orange-100">{serialNo}</td>
//                   <td className="py-2 px-4 border-b border-orange-100 font-medium">{card.name}</td>
//                   <td className="py-2 px-4 border-b border-orange-100">
//                     {card.visitorCardFront ? (
//                       <img
//                         src={card.visitorCardFront || "/placeholder.svg"}
//                         alt="Visitor Card Front"
//                         className="h-16 w-auto cursor-pointer rounded border border-orange-200 hover:border-orange-400 transition-all"
//                         onClick={() => handleImageClick(card.visitorCardFront)}
//                       />
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                   <td className="py-2 px-4 border-b border-orange-100">
//                     {card.visitorCardBack ? (
//                       <img
//                         src={card.visitorCardBack || "/placeholder.svg"}
//                         alt="Visitor Card Back"
//                         className="h-16 w-auto cursor-pointer rounded border border-orange-200 hover:border-orange-400 transition-all"
//                         onClick={() => handleImageClick(card.visitorCardBack)}
//                       />
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                   <td className="py-2 px-4 border-b border-orange-100">{formatDate(card.sedulertime)}</td>
//                   <td className="py-2 px-4 border-b border-orange-100">{card.contactNumber}</td>
//                   <td className="py-2 px-4 border-b border-orange-100">{card.note}</td>
//                   <td className="py-2 px-4 border-b border-orange-100">{card.assignTo}</td>
//                   {/* WhatsApp Status Column with icons */}
//                   <td className="py-2 px-4 border-b border-orange-100 text-center">
//                     {card.whatsapp ? (
//                       <span className="text-green-500 text-xl" title="Sent">
//                         ✅
//                       </span>
//                     ) : (
//                       <span className="text-orange-500 text-xl" title="Pending">
//                         ⏰
//                       </span>
//                     )}
//                   </td>
//                   {/* Pin Column with toggle */}
//                   <td
//                     className="py-2 px-4 border-b border-orange-100 cursor-pointer text-xl text-center"
//                     onClick={() => handleTogglePin(card._id, card.pin)}
//                   >
//                     {card.pin ? (
//                       <span className="text-orange-500">★</span>
//                     ) : (
//                       <span className="text-orange-300 hover:text-orange-500">☆</span>
//                     )}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="md:hidden space-y-4">
//         {paginatedCards.map((card, index) => {
//           // Calculate overall serial number based on pagination.
//           const serialNo = (currentPage - 1) * cardsPerPage + index + 1
//           return (
//             <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-200">
//               {/* Card Header with Name, Pin and Serial Number */}
//               <div className="flex items-center justify-between bg-orange-100 px-4 py-2">
//                 <div className="flex items-center gap-2">
//                   <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
//                     {serialNo}
//                   </span>
//                   <h3 className="font-medium text-orange-800">{card.name}</h3>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {/* WhatsApp Status */}
//                   <span
//                     className={card.whatsapp ? "text-green-500" : "text-orange-500"}
//                     title={card.whatsapp ? "Sent" : "Pending"}
//                   >
//                     {card.whatsapp ? "✅" : "⏰"}
//                   </span>
//                   {/* Pin Toggle */}
//                   <span className="cursor-pointer text-xl" onClick={() => handleTogglePin(card._id, card.pin)}>
//                     {card.pin ? <span className="text-orange-500">★</span> : <span className="text-orange-300">☆</span>}
//                   </span>
//                 </div>
//               </div>

//               {/* Card Content */}
//               <div className="p-4 space-y-3">
//                 {/* Images Row */}
//                 <div className="flex gap-4 justify-center">
//                   <div className="text-center">
//                     <p className="text-xs text-orange-800 mb-1">Front</p>
//                     {card.visitorCardFront ? (
//                       <img
//                         src={card.visitorCardFront || "/placeholder.svg"}
//                         alt="Visitor Card Front"
//                         className="h-20 w-auto cursor-pointer rounded border border-orange-200"
//                         onClick={() => handleImageClick(card.visitorCardFront)}
//                       />
//                     ) : (
//                       <div className="h-20 w-16 flex items-center justify-center border border-orange-200 rounded text-orange-400">
//                         N/A
//                       </div>
//                     )}
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-orange-800 mb-1">Back</p>
//                     {card.visitorCardBack ? (
//                       <img
//                         src={card.visitorCardBack || "/placeholder.svg"}
//                         alt="Visitor Card Back"
//                         className="h-20 w-auto cursor-pointer rounded border border-orange-200"
//                         onClick={() => handleImageClick(card.visitorCardBack)}
//                       />
//                     ) : (
//                       <div className="h-20 w-16 flex items-center justify-center border border-orange-200 rounded text-orange-400">
//                         N/A
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Info Grid */}
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div>
//                     <p className="text-xs text-orange-500">Scheduled Date</p>
//                     <p>{formatDate(card.sedulertime)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-orange-500">Contact Number</p>
//                     <p>{card.contactNumber}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-orange-500">Assigned To</p>
//                     <p>{card.assignTo}</p>
//                   </div>
//                 </div>

//                 {/* Note Section */}
//                 <div>
//                   <p className="text-xs text-orange-500">Note</p>
//                   <p className="text-sm bg-orange-50 p-2 rounded">{card.note || "No notes available"}</p>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex flex-wrap justify-center mt-6 gap-2">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-200 text-orange-800 rounded disabled:opacity-50 hover:bg-orange-300 transition-colors text-sm sm:text-base"
//         >
//           Previous
//         </button>
//         {totalPages <= 5 ? (
//           // Show all pages if 5 or fewer
//           Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-colors text-sm sm:text-base ${
//                 currentPage === index + 1
//                   ? "bg-orange-500 text-white"
//                   : "bg-orange-200 text-orange-800 hover:bg-orange-300"
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))
//         ) : (
//           // Show limited pages with ellipsis for more than 5 pages
//           <>
//             {/* First page */}
//             <button
//               onClick={() => setCurrentPage(1)}
//               className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-colors text-sm sm:text-base ${
//                 currentPage === 1 ? "bg-orange-500 text-white" : "bg-orange-200 text-orange-800 hover:bg-orange-300"
//               }`}
//             >
//               1
//             </button>

//             {/* Ellipsis or page before current */}
//             {currentPage > 3 && <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-orange-800">...</span>}

//             {/* Page before current if not first or second page */}
//             {currentPage > 2 && (
//               <button
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-orange-200 text-orange-800 hover:bg-orange-300 transition-colors text-sm sm:text-base"
//               >
//                 {currentPage - 1}
//               </button>
//             )}

//             {/* Current page if not first page */}
//             {currentPage !== 1 && currentPage !== totalPages && (
//               <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-orange-500 text-white text-sm sm:text-base">
//                 {currentPage}
//               </button>
//             )}

//             {/* Page after current if not last or second-to-last page */}
//             {currentPage < totalPages - 1 && (
//               <button
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-orange-200 text-orange-800 hover:bg-orange-300 transition-colors text-sm sm:text-base"
//               >
//                 {currentPage + 1}
//               </button>
//             )}

//             {/* Ellipsis or page after current */}
//             {currentPage < totalPages - 2 && <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-orange-800">...</span>}

//             {/* Last page */}
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-colors text-sm sm:text-base ${
//                 currentPage === totalPages
//                   ? "bg-orange-500 text-white"
//                   : "bg-orange-200 text-orange-800 hover:bg-orange-300"
//               }`}
//             >
//               {totalPages}
//             </button>
//           </>
//         )}
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-200 text-orange-800 rounded disabled:opacity-50 hover:bg-orange-300 transition-colors text-sm sm:text-base"
//         >
//           Next
//         </button>
//       </div>

//       {/* Modal for enlarged image */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
//           onClick={() => setSelectedImage(null)}
//         >
//           <div
//             className="relative max-w-full max-h-[90vh] bg-white p-2 rounded-lg"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={selectedImage || "/placeholder.svg"}
//               alt="Enlarged Visitor Card"
//               className="object-contain max-h-[80vh] max-w-full"
//             />
//             <button
//               className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-orange-600"
//               onClick={() => setSelectedImage(null)}
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Loading state */}
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-40">
//           <div className="text-orange-500 text-xl font-semibold">Loading...</div>
//         </div>
//       )}
//     </div>
//   )
// }

