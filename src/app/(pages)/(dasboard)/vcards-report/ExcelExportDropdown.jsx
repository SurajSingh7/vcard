"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Loader2, Download, X } from "lucide-react"

export default function ExcelExportDropdown({ visitorCards, assignToSet, isAdmin, userName }) {
  // State management
  const [selectedExportFilter, setSelectedExportFilter] = useState("")
  const [showExportConfirm, setShowExportConfirm] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState("")

  const handleExportChange = (value) => {
    // If the user selected the placeholder (""), do nothing
    if (value === "") return
    setSelectedExportFilter(value)
    setShowExportConfirm(true)
    // Clear any previous errors
    setExportError("")
  }

  const exportToExcel = async () => {
    setIsExporting(true)
    setExportError("")

    try {
      // Filter data based on selection
      const filteredData =
        selectedExportFilter === "All"
          ? visitorCards
          : visitorCards.filter((card) => card.assignTo === selectedExportFilter)

      if (filteredData.length === 0) {
        throw new Error("No data to export")
      }

      // Create worksheet data with headers
      const worksheetData = [
        // Header Row
        ["Name", "Scheduled Date", "Contact Number", "Note", "Assigned To"],

        // Data Rows
        ...filteredData.map((card) => [
          card.name || "",
          new Date(card.sedulertime), // Keep as Date object for Excel formatting
          String(card.contactNumber || card.qrmobile || ""), // Use empty string if undefined
          card.note || "",
          card.assignTo || "",
        ]),
      ]

      // Create worksheet with cell styles enabled
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData, {
        cellStyles: true,
        dateNF: "dd-mm-yyyy", // Date format
      })

      // Apply styling
      applyExcelStyling(worksheet)

      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Visitor Cards")

      // Generate Excel file
      XLSX.writeFile(workbook, `Visitor_Cards_${selectedExportFilter}.xlsx`, {
        compression: true,
        bookType: "xlsx",
      })
    } catch (error) {
      console.error("Export error:", error)
      setExportError(error.message || "Failed to export data")
    } finally {
      // Reset states
      setIsExporting(false)
      setShowExportConfirm(false)
      setSelectedExportFilter("")
    }
  }

  // Extracted styling logic for better readability
  const applyExcelStyling = (worksheet) => {
    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, // Name
      { wch: 15 }, // Scheduled Date
      { wch: 15 }, // Contact Number
      { wch: 40 }, // Note
      { wch: 15 }, // Assigned To
    ]

    // Add header style (font and fill)
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "FFA500" } }, // Orange background
    }

    // Define a border style
    const borderStyle = {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    }

    // Apply header styles to header row (r = 0)
    for (let col = 0; col < 5; col++) {
      const cellRef = XLSX.utils.encode_cell({ c: col, r: 0 })
      if (!worksheet[cellRef]) worksheet[cellRef] = {}
      worksheet[cellRef].s = headerStyle
    }

    // Loop through all cells to add border and alignment
    for (const cell in worksheet) {
      if (cell.startsWith("!")) continue
      const cellAddress = XLSX.utils.decode_cell(cell)
      const currentStyle = worksheet[cell].s || {}
      worksheet[cell].s = {
        ...currentStyle,
        border: borderStyle,
        alignment: { horizontal: "center", vertical: "center" },
        // Add alternate row background for data rows (even rows)
        ...(cellAddress.r > 0 && cellAddress.r % 2 === 0 ? { fill: { fgColor: { rgb: "F7F7F7" } } } : {}),
      }
    }

    // Set date formatting (ensuring date column gets formatted)
    worksheet["!cols"][1] = { ...worksheet["!cols"][1], numFmt: "dd-mm-yyyy" }

    // Add freeze pane (lock header row)
    worksheet["!freeze"] = { ySplit: 1 }
  }

  // Determine the filters based on user role
  const filters = isAdmin ? ["All", ...assignToSet] : [userName]

  return (
    <div className="relative">
      <select
        value={selectedExportFilter}
        onChange={(e) => handleExportChange(e.target.value)}
        className="px-4 py-2 bg-white border border-orange-300 rounded-lg text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
        aria-label="Export to Excel"
        disabled={isExporting}
      >
        {/* Placeholder option */}
        <option value="">Export Excel</option>

        {/* Filter options */}
        {filters.map((filter) => (
          <option key={filter} value={filter}>
            {filter}
          </option>
        ))}
      </select>

      {showExportConfirm && (
        <div className="absolute top-full mt-2 bg-white p-4 rounded-lg shadow-lg border border-orange-200 z-10 ">
          <p className="text-sm flex text-gray-700 mb-3">
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h2" />
          <path d="M8 17h2" />
          <path d="M14 13h2" />
          <path d="M14 17h2" />
        </svg>{selectedExportFilter === "All" ? "all" : selectedExportFilter}?
          </p>
          {exportError && <p className="text-sm text-red-500 mb-3">{exportError}</p>}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowExportConfirm(false)
                setSelectedExportFilter("")
                setExportError("")
              }}
              className="px-3 py-1.5 text-sm bg-red-400 text-white rounded-lg hover:bg-red-500"
              disabled={isExporting}
              aria-label="Cancel Export"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={exportToExcel}
              className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1"
              disabled={isExporting}
              aria-label="Download Excel"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}










// "use client"
// import { useState } from "react"
// import * as XLSX from "xlsx"

// export default function ExcelExportDropdown({ visitorCards, assignToSet, isAdmin, userName }) {
//   // Start with an empty string so the placeholder "Export Excel" is shown
//   const [selectedExportFilter, setSelectedExportFilter] = useState("")
//   const [showExportConfirm, setShowExportConfirm] = useState(false)

//   const handleExportChange = (value) => {
//     // If the user selected the placeholder (""), do nothing
//     if (value === "") return
//     setSelectedExportFilter(value)
//     setShowExportConfirm(true)
//   }

//   const exportToExcel = () => {
//     try {
//       // Filter data based on selection
//       const filteredData = selectedExportFilter === "All"
//         ? visitorCards
//         : visitorCards.filter(card => card.assignTo === selectedExportFilter)

//       // Create worksheet data with headers
//       const worksheetData = [
//         // Header Row (styled)
//         ["Name", "Scheduled Date", "Contact Number", "Note", "Assigned To"],
        
//         // Data Rows
//         ...filteredData.map(card => [
//           card.name,
//           new Date(card.sedulertime), // Keep as Date object for Excel formatting
//           String(card.contactNumber || card.qrmobile || ""), // Use empty string if undefined
//           card.note,
//           card.assignTo
//         ])
//       ]

//       // Create worksheet with cell styles enabled
//       const worksheet = XLSX.utils.aoa_to_sheet(worksheetData, {
//         cellStyles: true,
//         dateNF: "dd-mm-yyyy" // Date format
//       })

//       // Set column widths
//       worksheet["!cols"] = [
//         { wch: 25 }, // Name
//         { wch: 15 }, // Scheduled Date
//         { wch: 15 }, // Contact Number
//         { wch: 40 }, // Note
//         { wch: 15 }  // Assigned To
//       ]

//       // Add header style (font and fill)
//       const headerStyle = {
//         font: { bold: true, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "FFA500" } } // Orange background
//       }

//       // Apply header styles to header row (r = 0)
//       for (let col = 0; col < 5; col++) {
//         const cellRef = XLSX.utils.encode_cell({ c: col, r: 0 })
//         if (!worksheet[cellRef]) worksheet[cellRef] = {}
//         worksheet[cellRef].s = headerStyle
//       }

//       // Additional styling for a beautiful design:
//       // Define a border style
//       const borderStyle = {
//         top:    { style: "thin", color: { rgb: "CCCCCC" } },
//         bottom: { style: "thin", color: { rgb: "CCCCCC" } },
//         left:   { style: "thin", color: { rgb: "CCCCCC" } },
//         right:  { style: "thin", color: { rgb: "CCCCCC" } }
//       }

//       // Loop through all cells to add border and alignment
//       // Also add an alternate row fill for data rows (rows > 0)
//       for (let cell in worksheet) {
//         if (cell.startsWith("!")) continue
//         const cellAddress = XLSX.utils.decode_cell(cell)
//         const currentStyle = worksheet[cell].s || {}
//         worksheet[cell].s = {
//           ...currentStyle,
//           border: borderStyle,
//           alignment: { horizontal: "center", vertical: "center" },
//           // Add alternate row background for data rows (even rows)
//           ...(cellAddress.r > 0 && cellAddress.r % 2 === 0
//             ? { fill: { fgColor: { rgb: "F7F7F7" } } }
//             : {})
//         }
//       }

//       // Create workbook and add worksheet
//       const workbook = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Visitor Cards")

//       // Set date formatting (ensuring date column gets formatted)
//       worksheet["!cols"][1] = { ...worksheet["!cols"][1], numFmt: "dd-mm-yyyy" }

//       // Add freeze pane (lock header row)
//       worksheet["!freeze"] = { ySplit: 1 }

//       // Generate Excel file
//       XLSX.writeFile(workbook, `Visitor_Cards_${selectedExportFilter}.xlsx`, {
//         compression: true,
//         bookType: "xlsx"
//       })
//     } catch (error) {
//       console.error("Export error:", error)
//     } finally {
//       // Reset to allow re-selection of the same option
//       setShowExportConfirm(false)
//       setSelectedExportFilter("")
//     }
//   }

//   // Determine the filters based on user role
//   const filters = isAdmin ? ["All", ...assignToSet] : [userName]

//   return (
//     <div className="relative">
//       <select
//         value={selectedExportFilter}
//         onChange={(e) => handleExportChange(e.target.value)}
//         className="px-4 py-2 bg-white border border-orange-300 rounded-lg text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
//       >
//         {/* Placeholder option */}
//         <option value="">Export Excel</option>

//         {/* Number each filter as "1. All", "2. userName", etc. */}
//         {filters.map((filter, idx) => (
//           <option key={filter} value={filter}>
//             {` ${filter}`}
//           </option>
//         ))}
//       </select>

//       {showExportConfirm && (
//         <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded-lg shadow-lg border border-orange-200 z-10">
//           <p className="text-sm text-gray-700 mb-3">
//             Export {selectedExportFilter === "All" ? "all" : selectedExportFilter}'s records to Excel?
//           </p>
//           <div className="flex gap-2 justify-end">
//             <button
//               onClick={() => {
//                 setShowExportConfirm(false)
//                 setSelectedExportFilter("") // Reset here too
//               }}
//               className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={exportToExcel}
//               className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//             >
//               Export to Excel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }








