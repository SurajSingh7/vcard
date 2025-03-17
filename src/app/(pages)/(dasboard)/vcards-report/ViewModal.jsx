"use client"
import { useEffect, useState } from "react"
import { X, Calendar, Clock, MessageSquare, ArrowLeft, ArrowRight } from "lucide-react"

// Custom hook to detect mobile screens
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}

export default function ViewModal({ show, cardId, onClose }) {
  const [trackLogs, setTrackLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMobile = useIsMobile()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Columns to display with "s.no" replacing "track"
  const columns = ["s.no", "oldScheduledDate", "newScheduledDate", "reason", "createdAt"]

  useEffect(() => {
    if (show && cardId) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const res = await fetch(`/api/track-log?vcid=${encodeURIComponent(cardId)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!res.ok) {
            const text = await res.text()
            throw new Error(`HTTP error! status: ${res.status}, response: ${text}`)
          }

          const data = await res.json()
          if (data.success) {
            setTrackLogs(data.trackLogs)
            setCurrentPage(1) // Reset to first page when new data is loaded
          } else {
            setError("Error retrieving track logs.")
          }
        } catch (err) {
          setError(err.message || "Something went wrong.")
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [show, cardId])

  if (!show) return null

  // Formatter for date only in day-month-year format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB")
  }

  // Formatter for date and time in day-month-year format
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB")
  }

  // Pagination logic
  const totalPages = Math.ceil(trackLogs.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = trackLogs.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${currentPage === 1 ? "text-gray-400" : "text-orange-500 hover:bg-orange-100"}`}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-full ${
                currentPage === page ? "bg-orange-500 text-white" : "text-orange-700 hover:bg-orange-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${currentPage === totalPages ? "text-gray-400" : "text-orange-500 hover:bg-orange-100"}`}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) return <div className="p-6 text-center text-orange-700">Loading details...</div>
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>
    if (!loading && !error && trackLogs.length === 0)
      return <div className="p-6 text-center text-orange-700">No track logs available.</div>

    if (isMobile) {
      return (
        <div className="space-y-4 px-2">
          {currentItems.map((log, index) => (
            <div key={log._id} className="bg-white rounded-lg shadow-md border border-orange-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-orange-300 px-4 py-2 text-white font-medium">
                Sn No.{indexOfFirstItem + index + 1}
              </div>
              <div className="p-4 space-y-3">
                {/* First row with two columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center text-xs font-medium text-orange-700 uppercase mb-1">
                      <Calendar size={14} className="mr-1" />
                      <span>Old SCH.Date</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {log.oldScheduledDate ? formatDate(log.oldScheduledDate) : "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center text-xs font-medium text-orange-700 uppercase mb-1">
                      <Calendar size={14} className="mr-1" />
                      <span>New SCH.Date</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {log.newScheduledDate ? formatDate(log.newScheduledDate) : "-"}
                    </span>
                  </div>
                </div>

                {/* Second row with created at */}
                <div className="flex flex-col">
                  <div className="flex items-center text-xs font-medium text-orange-700 uppercase mb-1">
                    <Clock size={14} className="mr-1" />
                    <span>Created At</span>
                  </div>
                  <span className="text-sm text-gray-700">{log.createdAt ? formatDateTime(log.createdAt) : "-"}</span>
                </div>

                {/* Third row with reason */}
                <div className="flex flex-col">
                  <div className="flex items-center text-xs font-medium text-orange-700 uppercase mb-1">
                    <MessageSquare size={14} className="mr-1" />
                    <span>Reason</span>
                  </div>
                  <span className="text-sm text-gray-700 bg-orange-50 p-2 rounded-md">{log.reason || "-"}</span>
                </div>
              </div>
            </div>
          ))}
          {renderPagination()}
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-orange-200 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-orange-400 to-orange-300">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  {col === "oldScheduledDate" ? (
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>Old SCH.Date</span>
                    </div>
                  ) : col === "newScheduledDate" ? (
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>New SCH.Date</span>
                    </div>
                  ) : col === "reason" ? (
                    <div className="flex items-center">
                      <MessageSquare size={14} className="mr-1" />
                      <span>Reason</span>
                    </div>
                  ) : col === "createdAt" ? (
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>Created At</span>
                    </div>
                  ) : (
                    col
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-orange-100">
            {currentItems.map((log, index) => (
              <tr key={log._id} className="hover:bg-orange-50 transition-colors">
                {columns.map((col) => {
                  if (col === "s.no") {
                    return (
                      <td key={col} className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                        {indexOfFirstItem + index + 1}
                      </td>
                    )
                  } else if (col === "createdAt") {
                    return (
                      <td key={col} className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                        {log[col] ? formatDateTime(log[col]) : "-"}
                      </td>
                    )
                  } else if (col === "oldScheduledDate" || col === "newScheduledDate") {
                    return (
                      <td key={col} className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                        {log[col] ? formatDate(log[col]) : "-"}
                      </td>
                    )
                  } else {
                    return (
                      <td key={col} className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                        {log[col] || "-"}
                      </td>
                    )
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="relative bg-white rounded-xl w-full max-w-4xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-2  border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-xl">
          <h2 className="text-xl font-bold text-orange-800">Track details</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-orange-500 hover:text-orange-700 hover:bg-orange-50 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-1 max-h-[70vh] overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  )
}

