"use client"
import { useState, useEffect, useMemo } from "react"
import toast, { Toaster } from "react-hot-toast"
// import QrImage from "../../../../components/QrImage"
import RescheduleModal from "./RescheduleModal"
import EditCardModal from "./EditCardModal"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import ViewModal from "./ViewModal"
import ExcelExportDropdown from "./ExcelExportDropdown"
import {
  Calendar,
  Edit,
  Eye,
  Trash2,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react"

export default function VisitorCardsPage() {
  const admin = process.env.NEXT_PUBLIC_ADMIN
  const [visitorCards, setVisitorCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [dateSortOrder, setDateSortOrder] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)

  // State to hold the current user loaded from localStorage
  const [currentUser, setCurrentUser] = useState(null)

  // We only set selectedFilter AFTER we know if the user is admin or not
  const [selectedFilter, setSelectedFilter] = useState("")

  // New state for editing a visitor card
  const [editingCard, setEditingCard] = useState(null)
  const [editName, setEditName] = useState("")
  const [editContactNumber, setEditContactNumber] = useState("")
  const [editQrMobile, setEditQrMobile] = useState("")

  // New state for validation errors
  const [contactError, setContactError] = useState("")
  const [qrError, setQrError] = useState("")

  // New state for reschedule modal and tracking data
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [rescheduleOldDate, setRescheduleOldDate] = useState("")
  const [rescheduleNewDate, setRescheduleNewDate] = useState("")
  const [rescheduleReason, setRescheduleReason] = useState("")
  const [rescheduleCardId, setRescheduleCardId] = useState(null)
  // New state for passing card.track into RescheduleModal
  const [rescheduleTrack, setRescheduleTrack] = useState(0)

  // New state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteCardId, setDeleteCardId] = useState(null)

  // New state for view modal
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewCardId, setViewCardId] = useState(null)

  // Cache buster: computed once per mount to force image refresh when updated
  const cacheBuster = useMemo(() => Date.now(), [])

  // Read user from localStorage once the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)
      }
    }
  }, [])

  // Once we have currentUser, decide what the initial selectedFilter should be
  useEffect(() => {
    if (currentUser) {
      if (currentUser.userName === admin) {
        setSelectedFilter("All")
      } else {
        setSelectedFilter(currentUser.userName)
      }
    }
  }, [currentUser, admin])

  // Derive isAdmin from currentUser
  const isAdmin = currentUser?.userName === admin
  const userName = currentUser?.userName || ""

  const cardsPerPage = 7

  // Fetch visitor cards
  useEffect(() => {
    async function fetchVisitorCards() {
      try {
        const response = await fetch("/api/visitorcards")
        const text = await response.text()
        let data = {}
        if (text) {
          data = JSON.parse(text)
        } else {
          data = { visitorCards: [] }
        }
        console.log("API response:", data)
        if (Array.isArray(data)) {
          setVisitorCards(data)
        } else if (data.visitorCards && Array.isArray(data.visitorCards)) {
          setVisitorCards(data.visitorCards)
        } else {
          setVisitorCards([])
        }
      } catch (error) {
        console.error("Error fetching visitor cards:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVisitorCards()
  }, [])

  // Reset to page 1 on changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedFilter, showPinnedOnly])

  // Filter: by assigned user
  const filteredByFilter = useMemo(() => {
    if (!selectedFilter) return visitorCards
    if (selectedFilter === "All") {
      return visitorCards
    }
    return visitorCards.filter((card) => card.assignTo === selectedFilter)
  }, [visitorCards, selectedFilter])

  // Filter: by search term
  const filteredCards = useMemo(() => {
    return filteredByFilter.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [filteredByFilter, searchTerm])

  // Filter: pinned only
  const finalFilteredCards = useMemo(() => {
    return showPinnedOnly ? filteredCards.filter((card) => card.pin) : filteredCards
  }, [filteredCards, showPinnedOnly])

  // Sort cards by scheduled date if needed
  const sortedCards = useMemo(() => {
    if (dateSortOrder) {
      return [...finalFilteredCards].sort((a, b) => {
        const dateA = new Date(a.sedulertime)
        const dateB = new Date(b.sedulertime)
        return dateSortOrder === "asc" ? dateA - dateB : dateB - dateA
      })
    }
    return finalFilteredCards
  }, [finalFilteredCards, dateSortOrder])

  // Pagination
  const totalPages = Math.ceil(sortedCards.length / cardsPerPage)
  const paginatedCards = useMemo(() => {
    const indexOfLastCard = currentPage * cardsPerPage
    const indexOfFirstCard = indexOfLastCard - cardsPerPage
    return sortedCards.slice(indexOfFirstCard, indexOfLastCard)
  }, [sortedCards, currentPage, cardsPerPage])

  // Create unique filters
  // const assignToSet = new Set(visitorCards.map((card) => card.assignTo))
  const assignToSet = useMemo(() => 
    new Set(visitorCards.map((card) => card.assignTo)), 
    [visitorCards]
  )

  const filterButtons = isAdmin ? ["All", ...assignToSet] : [userName]

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Format date for input value (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    const d = new Date(date)
    const month = (d.getMonth() + 1).toString().padStart(2, "0")
    const day = d.getDate().toString().padStart(2, "0")
    const year = d.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Toggle date sort order
  const toggleSortOrder = () => {
    setDateSortOrder((prev) => {
      if (prev === null) return "asc"
      if (prev === "asc") return "desc"
      return null
    })
  }

  // Open modal for enlarged image
  const handleImageClick = (imageUrl) => {
    setSelectedImage(`${imageUrl}?v=${cacheBuster}`)
  }

  // Toggle pin for a visitor card
  const handleTogglePin = async (id, currentPin) => {
    const newPin = !currentPin
    setVisitorCards((prevCards) => prevCards.map((card) => (card._id === id ? { ...card, pin: newPin } : card)))
    try {
      const response = await fetch("/api/visitorcards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field: "pin", value: newPin }),
      })
      if (!response.ok) {
        setVisitorCards((prevCards) => prevCards.map((card) => (card._id === id ? { ...card, pin: currentPin } : card)))
        console.error("Failed to update pin")
      }
    } catch (error) {
      console.error("Error updating pin:", error)
      setVisitorCards((prevCards) => prevCards.map((card) => (card._id === id ? { ...card, pin: currentPin } : card)))
    }
  }

  // Handler to open edit modal for a card
  const handleEdit = (card) => {
    setEditingCard(card)
    setEditName(card.name)
    setEditContactNumber(card.contactNumber)
    setEditQrMobile(card.qrmobile || "")
    setContactError("")
    setQrError("")
  }

  // Handler for contact number change with validation
  const handleContactChange = (e) => {
    const value = e.target.value
    setEditContactNumber(value)
    if (!/^\d{10}$/.test(value)) {
      setContactError("Enter exactly 10 digits")
    } else {
      setContactError("")
    }
  }

  // Handler for QR mobile change with validation
  const handleQrChange = (e) => {
    const value = e.target.value
    setEditQrMobile(value)
    if (!/^\d{10}$/.test(value)) {
      setQrError("Enter exactly 10 digits")
    } else {
      setQrError("")
    }
  }

  // Handler to save the edited card details with validation check
  const handleEditSave = async () => {
    if (editingCard.assignTo === "qrAdmin") {
      if (!/^\d{10}$/.test(editQrMobile)) {
        setQrError("Enter exactly 10 digits")
        return
      }
    } else {
      if (!/^\d{10}$/.test(editContactNumber)) {
        setContactError("Enter exactly 10 digits")
        return
      }
    }
    const updatedFields = {
      name: editName,
      ...(editingCard.assignTo === "qrAdmin" ? { qrmobile: editQrMobile } : { contactNumber: editContactNumber }),
    }
    try {
      const response = await fetch("/api/visitorcards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingCard._id, fields: updatedFields }),
      })
      if (response.ok) {
        setVisitorCards((prev) =>
          prev.map((card) => (card._id === editingCard._id ? { ...card, ...updatedFields } : card)),
        )
        setEditingCard(null)
        toast.success("Card updated successfully")
      } else {
        console.error("Failed to update card")
        toast.error("Failed to update card")
      }
    } catch (error) {
      console.error("Error updating card:", error)
      toast.error("Error updating card")
    }
  }

  // Handler for reschedule modal
  const handleReschedule = (card) => {
    setRescheduleCardId(card._id)
    setRescheduleOldDate(card.sedulertime)
    setRescheduleNewDate("")
    setRescheduleReason("")
    setRescheduleTrack(card.track || 0)
    setShowRescheduleModal(true)
  }

  const handleRescheduleSubmit = async () => {
    if (!rescheduleNewDate || !rescheduleReason) {
      toast.error("Please fill in both New Scheduled Date and Reason.")
      return
    }
    const trackData = {
      cardId: rescheduleCardId,
      oldDate: rescheduleOldDate,
      newDate: rescheduleNewDate,
      reason: rescheduleReason,
      track: rescheduleTrack,
    }
    try {
      const response = await fetch("/api/track-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackData),
      })
      if (response.ok) {
        toast.success("Track created successfully")
        setShowRescheduleModal(false)
      } else {
        toast.error("Failed to create track")
      }
    } catch (error) {
      console.error("Error creating track log:", error)
      toast.error("Error creating track")
    }
  }

  // New handler for view modal
  const openViewModal = (card) => {
    setViewCardId(card._id)
    setShowViewModal(true)
  }

  const handleViewSubmit = () => {
    toast.success(`VCID: ${viewCardId}`)
    setShowViewModal(false)
  }

  // New handler to open delete confirmation modal
  const openDeleteModal = (cardId) => {
    setDeleteCardId(cardId)
    setShowDeleteModal(true)
  }

  // Handler to confirm deletion
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch("/api/visitorcards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteCardId }),
      })
      if (response.ok) {
        setVisitorCards((prevCards) => prevCards.filter((card) => card._id !== deleteCardId))
        toast.success("Card deleted successfully")
      } else {
        console.error("Failed to delete card")
        toast.error("Failed to delete card")
      }
    } catch (error) {
      console.error("Error deleting card:", error)
      toast.error("Error deleting card")
    }
    setShowDeleteModal(false)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-orange-800 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-orange-50 to-white min-h-screen">
      {/* <Toaster position="top-right" /> */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-orange-800 flex items-center gap-2">
        <Calendar className="h-6 w-6" /> Visitor Cards
      </h1>

      {/* Search Bar & Pin Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-orange-500" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowPinnedOnly((prev) => !prev)}
          className={`hidden md:flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            showPinnedOnly ? "bg-orange-500 text-white" : "bg-orange-200 text-orange-800"
          }`}
          aria-label={showPinnedOnly ? "Show all cards" : "Show pinned cards only"}
          title={showPinnedOnly ? "Show all cards" : "Show pinned cards only"}
        >
          <Star className="h-4 w-4" fill={showPinnedOnly ? "white" : "none"} />
          <span>Imp</span>
        </button>
        <div className="hidden md:block">
          {/* <QrImage /> */}
        </div>
      </div>

      {/* Mobile Sort & Pin Filter */}
      <div className="md:hidden mb-4 flex gap-2">
        <button
          onClick={toggleSortOrder}
          className="flex-1 px-4 py-2 bg-orange-100 text-orange-800 rounded-lg flex justify-between items-center shadow-sm"
        >
          <span className="flex items-center gap-1">
            {dateSortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : dateSortOrder === "desc" ? (
              <SortDesc className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
            Sort by Date
          </span>
          <span>{dateSortOrder === null ? "(Def)" : dateSortOrder === "asc" ? "↑" : "↓"}</span>
        </button>
        <button
          onClick={() => setShowPinnedOnly((prev) => !prev)}
          className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg flex items-center gap-1 shadow-sm"
          aria-label={showPinnedOnly ? "Show all cards" : "Show pinned cards only"}
          title={showPinnedOnly ? "Show all cards" : "Show pinned cards only"}
        >
          <Star className="h-4 w-4" fill={showPinnedOnly ? "currentColor" : "none"} />
          <span>Imp</span>
        </button>
        <div>
          {/* <QrImage /> */}
        </div>
      </div>

      {/* Filter Buttons */}
      {/* <div className="mb-6 flex flex-wrap gap-2">
        {filterButtons.map((buttonLabel) => (
          <button
            key={buttonLabel}
            onClick={() => setSelectedFilter(buttonLabel)}
            className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg transition-colors shadow-sm ${
              selectedFilter === buttonLabel
                ? "bg-orange-500 text-white font-medium"
                : "bg-orange-200 text-orange-800 hover:bg-orange-300"
            }`}
          >
            {buttonLabel}
          </button>
        ))}
      </div> */}


      {/* Filter Buttons & Export */}
        <div className="mb-6 flex flex-wrap justify-between gap-2 items-center">
        {/* Existing filter buttons */}
        <div className=" items-center flex-wrap gap-6">
          {filterButtons.map((buttonLabel) => (
            <button
              key={buttonLabel}
              onClick={() => setSelectedFilter(buttonLabel)}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 mx-1  sm:text-base rounded-lg transition-colors shadow-sm ${
                selectedFilter === buttonLabel
                  ? "bg-orange-500 text-white font-medium"
                  : "bg-orange-200 text-orange-800 hover:bg-orange-300"
              }`}
            >
              {buttonLabel}
            </button>
          ))}

        </div>
       
      
        <ExcelExportDropdown 
          visitorCards={visitorCards}
          isAdmin={isAdmin}
           userName={userName}
           assignToSet={assignToSet}
        />

        </div>







      

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-orange-100 to-orange-50">
            <tr>
              <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold">#</th>
              <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold">Name</th>
              <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold">Front</th>
              <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold">Back</th>
              <th
                className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold cursor-pointer hover:bg-orange-200 transition-colors group"
                onClick={toggleSortOrder}
              >
                <div className="flex items-center gap-1">
                  <span>Sched.Date</span>
                  {dateSortOrder === null ? (
                    <Calendar className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                  ) : dateSortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold">
                Mobile
              </th>
              <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold">Note</th>
              <th className="py-3 px-4 border-b border-orange-200 text-left text-orange-800 font-semibold">
                Assign
              </th>
              {/* Track Column */}
              <th className="py-3 px-4 border-b border-orange-200 text-center text-orange-800 font-semibold">Track</th>
              <th className="py-3 px-4 border-b border-orange-200 text-center text-orange-800 font-semibold">
                Remind
              </th>
              <th className="py-3 px-4 border-b border-orange-200 text-center text-orange-800 font-semibold">Pin</th>
              <th className="py-3 px-4 border-b border-orange-200 text-center text-orange-800 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCards.map((card, index) => {
              const serialNo = (currentPage - 1) * cardsPerPage + index + 1
              return (
                <tr key={card._id} className="hover:bg-orange-50 transition-colors">
                  <td className="py-3 px-4 border-b border-orange-100 text-gray-600">{serialNo}</td>
                  <td className="py-3 px-4 border-b border-orange-100 font-medium">{card.name}</td>
                  <td className="py-3 px-4 border-b border-orange-100">
                    {card.visitorCardFront ? (
                      <img
                        loading="lazy"
                        src={`${card.visitorCardFront || "/placeholder.svg"}?v=${cacheBuster}`}
                        alt="Visitor Card Front"
                        className="h-16 w-auto cursor-pointer rounded-md border border-orange-200 hover:border-orange-400 transition-all hover:shadow-md"
                        onClick={() => handleImageClick(card.visitorCardFront)}
                      />
                    ) : (
                      <div className="h-16 w-12 flex items-center justify-center border border-orange-200 rounded-md text-orange-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b border-orange-100">
                    {card.visitorCardBack ? (
                      <img
                        loading="lazy"
                        src={`${card.visitorCardBack || "/placeholder.svg"}?v=${cacheBuster}`}
                        alt="Visitor Card Back"
                        className="h-16 w-auto cursor-pointer rounded-md border border-orange-200 hover:border-orange-400 transition-all hover:shadow-md"
                        onClick={() => handleImageClick(card.visitorCardBack)}
                      />
                    ) : (
                      <div className="h-16 w-12 flex items-center justify-center border border-orange-200 rounded-md text-orange-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b border-orange-100 text-gray-700">{formatDate(card.sedulertime)}</td>
                  <td className="py-3 px-4 border-b border-orange-100 text-gray-700">
                    {card.contactNumber ? card.contactNumber : card.qrmobile}
                  </td>
                  {/* <td className="py-3 px-4 border-b border-orange-100 text-gray-700">{card.note}</td> */}
                  <td className="py-3 px-4 border-b border-orange-100 text-gray-700">
                      <span className="relative group">
                        {card.note.length > 14 ? `${card.note.substring(0, 14)}...` : card.note}
                        {card.note.length > 14 && (
                          <span className="text-blue-500 cursor-pointer"> more</span>
                        )}

                        {/* Tooltip Box on Hover */}
                        <div className="absolute left-0 bottom-full hidden group-hover:block w-64 bg-white text-gray-900 text-sm p-3 rounded-lg shadow-lg border border-gray-300 break-words whitespace-pre-line">
                          {card.note}
                        </div>
                      </span>
                    </td>


                  <td className="py-3 px-4 border-b border-orange-100 text-gray-700">{card.assignTo}</td>
                  {/* Track Column */}
                  <td className="py-3 px-4 border-b border-orange-100 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      {/* <button
                        onClick={() => handleReschedule(card)}
                        className="bg-blue-100 text-blue-700 p-2 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                        title="Reschedule Date"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                       */}

                      {!isAdmin && (
                        <button
                          onClick={() => handleReschedule(card)}
                          className="bg-blue-100 text-blue-700 p-2 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                          title="Reschedule Date"
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                      )}

                     <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 min-w-[24px] whitespace-nowrap">
                        {`T-${card.track || 0}`}
                      </span>

                      <button
                        onClick={() => openViewModal(card)}
                        className="bg-green-100 text-green-700 p-2 rounded-md hover:bg-green-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-orange-100 text-center">
                    {card.whatsapp ? (
                      <div className="flex justify-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>
                    )}
                  </td>
                  <td
                    className="py-3 px-4 border-b border-orange-100 text-center cursor-pointer"
                    onClick={() => handleTogglePin(card._id, card.pin)}
                  >
                    <div className="flex justify-center">
                      {card.pin ? (
                        <Star className="h-5 w-5 text-orange-500" fill="currentColor" />
                      ) : (
                        <Star className="h-5 w-5 text-orange-300 hover:text-orange-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-orange-100 text-center">
                    <div className="flex gap-2 justify-center">
                      {/* <button
                        onClick={() => handleEdit(card)}
                        className="bg-orange-100 text-orange-700 p-2 rounded-md hover:bg-orange-200 transition-colors"
                        title="Edit Card"
                      >
                        <Edit className="h-4 w-4" />
                      </button> */}

                      {!isAdmin && (
                        <>
                        <button
                          onClick={() => handleEdit(card)}
                          className="bg-orange-100 text-orange-700 p-2 rounded-md hover:bg-orange-200 transition-colors"
                          title="Edit Card"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        </>
                      )}

                     {isAdmin && (
                        <button
                          onClick={() => openDeleteModal(card._id)}
                          className="bg-red-100 text-red-700 p-2 rounded-md hover:bg-red-200 transition-colors"
                          title="Delete Card"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedCards.map((card, index) => {
          const serialNo = (currentPage - 1) * cardsPerPage + index + 1
          return (
            <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-200">
              <div className="flex items-center justify-between bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {serialNo}
                  </span>
                  <h3 className="font-medium text-orange-800">{card.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {card.whatsapp ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                  <button onClick={() => handleTogglePin(card._id, card.pin)} className="text-orange-500">
                    {card.pin ? <Star className="h-5 w-5" fill="currentColor" /> : <Star className="h-5 w-5" />}
                  </button>

                  <button onClick={() => openViewModal(card)} className="text-green-600 p-1" aria-label="View">
                    <Eye className="h-5 w-5" />
                  </button>
                
                  {!isAdmin && (
                    <>
                      <button onClick={() => handleReschedule(card)} className="text-blue-600 p-1">
                        <Calendar className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleEdit(card)} className="text-orange-600 p-1">
                        <Edit className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {isAdmin && (
                  
                      <button onClick={() => openDeleteModal(card._id)} className="text-red-600 p-1" aria-label="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                  )}

                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-4 justify-center">
                  <div className="text-center">
                    <p className="text-xs text-orange-800 mb-1">Front</p>
                    {card.visitorCardFront ? (
                      <img
                        loading="lazy"
                        src={`${card.visitorCardFront || "/placeholder.svg"}?v=${cacheBuster}`}
                        alt="Visitor Card Front"
                        className="h-20 w-auto cursor-pointer rounded-md border border-orange-200 hover:shadow-md transition-all"
                        onClick={() => handleImageClick(card.visitorCardFront)}
                      />
                    ) : (
                      <div className="h-20 w-16 flex items-center justify-center border border-orange-200 rounded-md text-orange-400">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-orange-800 mb-1">Back</p>
                    {card.visitorCardBack ? (
                      <img
                        loading="lazy"
                        src={`${card.visitorCardBack || "/placeholder.svg"}?v=${cacheBuster}`}
                        alt="Visitor Card Back"
                        className="h-20 w-auto cursor-pointer rounded-md border border-orange-200 hover:shadow-md transition-all"
                        onClick={() => handleImageClick(card.visitorCardBack)}
                      />
                    ) : (
                      <div className="h-20 w-16 flex items-center justify-center border border-orange-200 rounded-md text-orange-400">
                        N/A
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-orange-500 font-medium">Scheduled Date</p>
                    <p className="text-gray-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(card.sedulertime)}
                    </p>
                  </div>
                  <div>
                    {/* <p className="text-xs text-orange-500 font-medium">Contact Number</p> */}
                    <p className="text-xs text-orange-500 font-medium">Mobile</p>
                    <p className="text-gray-700">{card.contactNumber ? card.contactNumber : card.qrmobile}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-500 font-medium">Assigned To</p>
                    <p className="text-gray-700">{card.assignTo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-500 font-medium">Track Count</p>
                    <p className="text-gray-700">{card.track || 0}</p>
                  </div>
                </div>
             
                   <div>
                    <p className="text-xs text-orange-500 font-medium">Note</p>
                    <p className="text-gray-700 break-words whitespace-pre-line">{card?.note }</p>
                   </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-200 text-orange-800 rounded-lg disabled:opacity-50 hover:bg-orange-300 transition-colors text-sm sm:text-base flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Prev</span>
        </button>
        {totalPages <= 5 ? (
          Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                currentPage === index + 1
                  ? "bg-orange-500 text-white"
                  : "bg-orange-200 text-orange-800 hover:bg-orange-300"
              }`}
            >
              {index + 1}
            </button>
          ))
        ) : (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                currentPage === 1 ? "bg-orange-500 text-white" : "bg-orange-200 text-orange-800 hover:bg-orange-300"
              }`}
            >
              1
            </button>
            {currentPage > 3 && <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-orange-800">...</span>}
            {currentPage > 2 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-orange-200 text-orange-800 hover:bg-orange-300 transition-colors text-sm sm:text-base"
              >
                {currentPage - 1}
              </button>
            )}
            {currentPage !== 1 && currentPage !== totalPages && (
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-orange-500 text-white text-sm sm:text-base">
                {currentPage}
              </button>
            )}
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-orange-200 text-orange-800 hover:bg-orange-300 transition-colors text-sm sm:text-base"
              >
                {currentPage + 1}
              </button>
            )}
            {currentPage < totalPages - 2 && <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-orange-800">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                currentPage === totalPages
                  ? "bg-orange-500 text-white"
                  : "bg-orange-200 text-orange-800 hover:bg-orange-300"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-200 text-orange-800 rounded-lg disabled:opacity-50 hover:bg-orange-300 transition-colors text-sm sm:text-base flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-full max-h-[90vh] bg-white p-2 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              loading="lazy"
              src={selectedImage || "/placeholder.svg"}
              alt="Enlarged Visitor Card"
              className="object-contain max-h-[80vh] max-w-full rounded"
            />
            <button
              className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-orange-600 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditCardModal
        editingCard={editingCard}
        editName={editName}
        editContactNumber={editContactNumber}
        editQrMobile={editQrMobile}
        onNameChange={(e) => setEditName(e.target.value)}
        onContactChange={handleContactChange}
        onQrChange={handleQrChange}
        onCancel={() => setEditingCard(null)}
        onSave={handleEditSave}
        contactError={contactError}
        qrError={qrError}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        show={showRescheduleModal}
        cardId={rescheduleCardId}
        oldDate={rescheduleOldDate}
        newDate={rescheduleNewDate}
        setNewDate={setRescheduleNewDate}
        reason={rescheduleReason}
        setReason={setRescheduleReason}
        onClose={() => setShowRescheduleModal(false)}
        onSubmit={handleRescheduleSubmit}
        formatDateForInput={formatDateForInput}
        track={rescheduleTrack}
      />

      {/* View Modal */}
      <ViewModal
        show={showViewModal}
        cardId={viewCardId}
        onClose={() => setShowViewModal(false)}
        onSubmit={handleViewSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Loading state overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-40">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-orange-800 font-medium">Loading...</p>
          </div>
        </div>
      )}
      <div className="h-24"></div>
    </div>
  )
}

