'use client'
import { useState, useEffect } from "react";

export default function VisitorCardsPage() {
  const [visitorCards, setVisitorCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // dateSortOrder can be null (default), "asc", or "desc"
  const [dateSortOrder, setDateSortOrder] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null); // state for modal image

  const cardsPerPage = 7;

  useEffect(() => {
    async function fetchVisitorCards() {
      try {
        const response = await fetch("/api/visitorcards");
        const data = await response.json();
        console.log("API response:", data);
        if (Array.isArray(data)) {
          setVisitorCards(data);
        } else if (data.visitorCards && Array.isArray(data.visitorCards)) {
          setVisitorCards(data.visitorCards);
        } else {
          setVisitorCards([]);
        }
      } catch (error) {
        console.error("Error fetching visitor cards:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVisitorCards();
  }, []);

  // Reset page when search term or filter changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  // Filter by "Assigned To" if selected.
  const filteredByFilter = selectedFilter === "All"
    ? visitorCards
    : visitorCards.filter(card => card.assignTo === selectedFilter);

  // Further filter by search term (by name).
  const filteredCards = filteredByFilter.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the cards by scheduled date if sort order is set.
  const sortedCards = dateSortOrder 
    ? [...filteredCards].sort((a, b) => {
        const dateA = new Date(a.sedulertime);
        const dateB = new Date(b.sedulertime);
        return dateSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      })
    : filteredCards;

  // Pagination calculations.
  const totalPages = Math.ceil(sortedCards.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const paginatedCards = sortedCards.slice(indexOfFirstCard, indexOfLastCard);

  // Create unique filter buttons for "Assigned To".
  const assignToSet = new Set(visitorCards.map(card => card.assignTo));
  const filterButtons = ["All", ...assignToSet];

  // Helper function to format date as dd-mm-yyyy.
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Toggle the sort order when "Scheduled Date" header is clicked.
  // Cycle: Default (null) -> Ascending -> Descending -> Default...
  const toggleSortOrder = () => {
    setDateSortOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  // Open the modal with the selected image
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Toggle the pin status and update the backend.
  const handleTogglePin = async (id, currentPin) => {
    const newPin = !currentPin;
    // Update state optimistically.
    setVisitorCards(prevCards =>
      prevCards.map(card =>
        card._id === id ? { ...card, pin: newPin } : card
      )
    );
    try {
      const response = await fetch("/api/visitorcards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field: "pin", value: newPin }),
      });
      if (!response.ok) {
        // If update fails, revert change.
        setVisitorCards(prevCards =>
          prevCards.map(card =>
            card._id === id ? { ...card, pin: currentPin } : card
          )
        );
        console.error("Failed to update pin");
      }
    } catch (error) {
      console.error("Error updating pin:", error);
      setVisitorCards(prevCards =>
        prevCards.map(card =>
          card._id === id ? { ...card, pin: currentPin } : card
        )
      );
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Visitor Cards</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex space-x-2">
        {filterButtons.map((buttonLabel) => (
          <button
            key={buttonLabel}
            onClick={() => setSelectedFilter(buttonLabel)}
            className={`px-4 py-2 rounded ${
              selectedFilter === buttonLabel
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {buttonLabel}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              {/* Serial Number Column */}
              <th className="py-3 px-4 border-b">S.No</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Front</th>
              <th className="py-3 px-4 border-b">Back</th>
              <th 
                className="py-3 px-4 border-b cursor-pointer"
                onClick={toggleSortOrder}
              >
                Scheduled Date{" "}
                {dateSortOrder === null
                  ? "(Default)"
                  : dateSortOrder === "asc"
                  ? "↑"
                  : "↓"}
              </th>
              <th className="py-3 px-4 border-b">Contact Number</th>
              <th className="py-3 px-4 border-b">Note</th>
              <th className="py-3 px-4 border-b">Assigned To</th>
              {/* New Columns */}
              <th className="py-3 px-4 border-b">WhatsApp</th>
              <th className="py-3 px-4 border-b">Pin</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCards.map((card, index) => {
              // Calculate overall serial number based on pagination.
              const serialNo = (currentPage - 1) * cardsPerPage + index + 1;
              return (
                <tr key={card._id}>
                  <td className="py-2 px-4 border-b">{serialNo}</td>
                  <td className="py-2 px-4 border-b">{card.name}</td>
                  <td className="py-2 px-4 border-b">
                    {card.visitorCardFront ? (
                      <img
                        src={card.visitorCardFront}
                        alt="Visitor Card Front"
                        className="h-16 w-auto cursor-pointer"
                        onClick={() => handleImageClick(card.visitorCardFront)}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {card.visitorCardBack ? (
                      <img
                        src={card.visitorCardBack}
                        alt="Visitor Card Back"
                        className="h-16 w-auto cursor-pointer"
                        onClick={() => handleImageClick(card.visitorCardBack)}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(card.sedulertime)}
                  </td>
                  <td className="py-2 px-4 border-b">{card.contactNumber}</td>
                  <td className="py-2 px-4 border-b">{card.note}</td>
                  <td className="py-2 px-4 border-b">{card.assignTo}</td>
                  {/* WhatsApp Status Column with icons */}
                  <td className="py-2 px-4 border-b text-center">
                    {card.whatsapp ? (
                      <span className="text-green-500 text-xl" title="Sent">
                        ✅
                      </span>
                    ) : (
                      <span className="text-red-500 text-xl" title="Pending">
                        ⏰
                      </span>
                    )}
                  </td>
                  {/* Pin Column with toggle */}
                  <td 
                    className="py-2 px-4 border-b cursor-pointer text-xl"
                    onClick={() => handleTogglePin(card._id, card.pin)}
                  >
                    {card.pin ? "★" : "☆"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged Visitor Card"
            style={{ maxWidth: '80vw', maxHeight: '80vh' }}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
