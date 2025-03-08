"use client"

import { useState, useRef, useEffect } from "react"
import Webcam from "react-webcam"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { Camera, X, Calendar, User, Phone, FileText, Users, Check } from "lucide-react"

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: "environment",
}

const VisitorCardForm = () => {
  // Front camera states
  const [capturedFront, setCapturedFront] = useState("")
  const [isCameraOnFront, setIsCameraOnFront] = useState(true)
  const [isFrontVideoReady, setIsFrontVideoReady] = useState(false)

  // Back camera states
  const [capturedBack, setCapturedBack] = useState("")
  const [isCameraOnBack, setIsCameraOnBack] = useState(true)
  const [isBackVideoReady, setIsBackVideoReady] = useState(false)

  // State for toggling active capture view
  const [activeCapture, setActiveCapture] = useState("front")

  // State for full-screen camera
  const [fullScreenCamera, setFullScreenCamera] = useState(false)
  const [fullScreenCameraType, setFullScreenCameraType] = useState("front")
  const [isFullScreenVideoReady, setIsFullScreenVideoReady] = useState(false)

  // Other form fields
  const [name, setName] = useState("")
  const [sedulertime, setSedulertime] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [note, setNote] = useState("")
  const [assignTo, setAssignTo] = useState("")

  // States for user and dropdown data
  const [userName, setUserName] = useState("")
  const [dropdownOptions, setDropdownOptions] = useState([])
  const [dropdownLoading, setDropdownLoading] = useState(false)
  const [contactError, setContactError] = useState("")

  // State to track form submission
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State to handle full image preview modal
  const [previewImage, setPreviewImage] = useState("")

  const router = useRouter()
  const webcamRefFront = useRef(null)
  const webcamRefBack = useRef(null)
  const fullScreenWebcamRef = useRef(null)

  // Load user data from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData?.name || userData?.userName) {
          setUserName(userData.userName || "")
          const combined = userData.userName ? `${userData.userName}` : ""
          setAssignTo(combined)
        }
      } catch (error) {
        console.error("Failed to parse local storage data for user:", error)
      }
    }
  }, [])

  // If the user userName is "hi@gmail.com", fetch dropdown options
  useEffect(() => {
    if (userName === "hi@gmail.com") {
      setDropdownLoading(true)
      fetch("/api/auth/signup")
        .then((res) => res.json())
        .then((data) => {
          const users = data.users || []
          const filteredUsers = users.filter((option) => option.userName !== "hi@gmail.com")
          setDropdownOptions(filteredUsers)
          setAssignTo("")
          setDropdownLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching dropdown options:", error)
          setDropdownLoading(false)
        })
    }
  }, [userName])

  // Open full-screen camera
  const openFullScreenCamera = (type) => {
    setFullScreenCameraType(type)
    setFullScreenCamera(true)
    setIsFullScreenVideoReady(false)

    // Add body class to prevent scrolling
    document.body.classList.add("overflow-hidden")
  }

  // Close full-screen camera
  const closeFullScreenCamera = () => {
    const videoTrack = fullScreenWebcamRef.current?.video?.srcObject
      ?.getTracks()
      .find((track) => track.kind === "video")
    if (videoTrack) {
      videoTrack.stop()
    }
    setFullScreenCamera(false)
    setIsFullScreenVideoReady(false)

    // Remove body class to allow scrolling again
    document.body.classList.remove("overflow-hidden")
  }

  // Capture from full-screen camera
  const captureFromFullScreen = () => {
    if (!isFullScreenVideoReady) {
      console.warn("Full-screen webcam not ready yet.")
      return
    }

    const imageSrc = fullScreenWebcamRef.current.getScreenshot()
    if (imageSrc) {
      if (fullScreenCameraType === "front") {
        setCapturedFront(imageSrc)
        setIsCameraOnFront(false)
      } else {
        setCapturedBack(imageSrc)
        setIsCameraOnBack(false)
      }
      closeFullScreenCamera()
    } else {
      console.error("Failed to capture image. Full-screen webcam not ready.")
    }
  }

  // --- FRONT CAMERA FUNCTIONS ---
  const captureFront = () => {
    if (capturedFront) return
    if (!isCameraOnFront) {
      turnOnCameraFront()
      return
    }
    if (!isFrontVideoReady) {
      console.warn("Front webcam not ready yet.")
      return
    }
    const imageSrc = webcamRefFront.current.getScreenshot()
    if (imageSrc) {
      setCapturedFront(imageSrc)
      turnOffCameraFront()
    } else {
      console.error("Failed to capture image. Front webcam not ready.")
    }
  }

  const removeFront = () => {
    if (!capturedFront) return
    setCapturedFront("")
    turnOnCameraFront()
  }

  const turnOffCameraFront = () => {
    const videoTrack = webcamRefFront.current?.video?.srcObject?.getTracks().find((track) => track.kind === "video")
    if (videoTrack) {
      videoTrack.stop()
    }
    setIsCameraOnFront(false)
    setIsFrontVideoReady(false)
  }

  const turnOnCameraFront = () => {
    setIsCameraOnFront(true)
  }

  // --- BACK CAMERA FUNCTIONS ---
  const captureBack = () => {
    if (capturedBack) return
    if (!isCameraOnBack) {
      turnOnCameraBack()
      return
    }
    if (!isBackVideoReady) {
      console.warn("Back webcam not ready yet.")
      return
    }
    const imageSrc = webcamRefBack.current.getScreenshot()
    if (imageSrc) {
      setCapturedBack(imageSrc)
      turnOffCameraBack()
    } else {
      console.error("Failed to capture image. Back webcam not ready.")
    }
  }

  const removeBack = () => {
    if (!capturedBack) return
    setCapturedBack("")
    turnOnCameraBack()
  }

  const turnOffCameraBack = () => {
    const videoTrack = webcamRefBack.current?.video?.srcObject?.getTracks().find((track) => track.kind === "video")
    if (videoTrack) {
      videoTrack.stop()
    }
    setIsCameraOnBack(false)
    setIsBackVideoReady(false)
  }

  const turnOnCameraBack = () => {
    setIsCameraOnBack(true)
  }

  // Auto turn off camera when tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (isCameraOnFront) turnOffCameraFront()
        if (isCameraOnBack) turnOffCameraBack()
        if (fullScreenCamera) closeFullScreenCamera()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.body.classList.remove("overflow-hidden")
    }
  }, [isCameraOnFront, isCameraOnBack, fullScreenCamera])

  // Handle date offset options
  const handleDateOffset = (days) => {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + days)
    const formattedDate = currentDate.toISOString().split("T")[0]
    setSedulertime(formattedDate)
  }

  // Helper function to optimize image before saving
  const optimizeImage = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = base64Str
      img.onload = () => {
        // Create a canvas with the original dimensions
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        // Draw the image at full size
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, img.width, img.height)

        // Convert to JPEG with high quality (0.9 = 90% quality)
        // This reduces file size while maintaining good quality
        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        resolve(optimizedDataUrl)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !sedulertime) {
      toast.error("Name and Scheduler Date are required")
      return
    }
    if (!assignTo) {
      toast.error("Assign To is required")
      return
    }
    if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
      toast.error("Contact Number must be exactly 10 digits")
      return
    }

    setIsSubmitting(true) // Start loading

    try {
      // Optimize images before sending to server
      let optimizedFront = capturedFront
      let optimizedBack = capturedBack

      if (capturedFront) {
        optimizedFront = await optimizeImage(capturedFront)
      }

      if (capturedBack) {
        optimizedBack = await optimizeImage(capturedBack)
      }

      const formData = new FormData()

      if (optimizedFront) {
        formData.append("visitorCardFront", optimizedFront)
      }

      if (optimizedBack) {
        formData.append("visitorCardBack", optimizedBack)
      }

      formData.append("name", name)
      formData.append("sedulertime", sedulertime)
      formData.append("contactNumber", contactNumber)
      formData.append("note", note)
      formData.append("assignTo", assignTo)

      const res = await fetch("/api/visitorcards", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        toast.success("Visitor Card Created!")
        // Delay refresh to allow toast to display properly
        setTimeout(() => {
          router.refresh()
          setIsSubmitting(false)
        }, 1500)
      } else {
        toast.error("Failed to create visitor card")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-orange-100">
      <Toaster />
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-center">Create Visitor Card</h1>
        <p className="text-center text-orange-100 mt-2">Capture and manage visitor information</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: Live Capture Fields */}
        <div className="space-y-8">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setActiveCapture("front")}
              className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                activeCapture === "front"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Camera size={18} />
                <span>Card Front</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveCapture("back")}
              className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                activeCapture === "back"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Camera size={18} />
                <span>Card Back</span>
              </div>
            </button>
          </div>

          {activeCapture === "front" && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <label className="block font-semibold text-gray-700 mb-2">Visitor Card Front</label>
              <div className="relative bg-white border-2 border-orange-200 rounded-lg overflow-hidden shadow-md h-64 mx-auto">
                {capturedFront ? (
                  <img
                    src={capturedFront || "/placeholder.svg"}
                    alt="Captured Front"
                    onClick={() => setPreviewImage(capturedFront)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-orange-300 mb-2" />
                      <p>No Image Captured</p>
                      <button
                        type="button"
                        onClick={() => openFullScreenCamera("front")}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                      >
                        Open Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {capturedFront && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={removeFront}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <div className="flex items-center space-x-2">
                      <X size={18} />
                      <span>Remove Front</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeCapture === "back" && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <label className="block font-semibold text-gray-700 mb-2">Visitor Card Back</label>
              <div className="relative bg-white border-2 border-orange-200 rounded-lg overflow-hidden shadow-md h-64 mx-auto">
                {capturedBack ? (
                  <img
                    src={capturedBack || "/placeholder.svg"}
                    alt="Captured Back"
                    onClick={() => setPreviewImage(capturedBack)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-orange-300 mb-2" />
                      <p>No Image Captured</p>
                      <button
                        type="button"
                        onClick={() => openFullScreenCamera("back")}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                      >
                        Open Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {capturedBack && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={removeBack}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <div className="flex items-center space-x-2">
                      <X size={18} />
                      <span>Remove Back</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column 2: Form Fields */}
        <div className="space-y-5">
          <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
            <div className="flex items-center space-x-2 mb-2">
              <User className="text-orange-500" size={20} />
              <label className="block font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter visitor's name"
              className="block w-full border border-orange-200 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
              required
            />
          </div>

          <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="text-orange-500" size={20} />
              <label className="block font-medium text-gray-700">
                Scheduler Date <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="date"
              value={sedulertime}
              onChange={(e) => setSedulertime(e.target.value)}
              className="block w-full border border-orange-200 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
              required
            />
            <div className="bg-white mt-3 p-2 rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-gray-700 font-medium px-2">Quick select:</span>
                {[3, 5, 7, 10, 15].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => handleDateOffset(days)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-1.5 rounded-md transition-colors"
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="text-orange-500" size={20} />
              <label className="block font-medium text-gray-700">Contact Number</label>
            </div>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => {
                const val = e.target.value
                // Allow only digits
                if (!/^\d*$/.test(val)) {
                  setContactError("Only digits are allowed")
                } else if (val.length > 10) {
                  setContactError("Contact number must be exactly 10 digits")
                } else {
                  setContactError("")
                }
                setContactNumber(val)
              }}
              maxLength={10}
              placeholder="Enter 10-digit contact number (optional)"
              className="block w-full border border-orange-200 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
            />
            {contactError && <p className="text-red-500 text-sm mt-1">{contactError}</p>}
          </div>

          <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="text-orange-500" size={20} />
              <label className="block font-medium text-gray-700">Note</label>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional notes"
              className="block w-full border border-orange-200 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 bg-white min-h-[80px]"
            />
          </div>

          <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="text-orange-500" size={20} />
              <label className="block font-medium text-gray-700">
                Assign To <span className="text-red-500">*</span>
              </label>
            </div>
            {userName === "hi@gmail.com" ? (
              dropdownLoading ? (
                <select
                  disabled
                  className="block w-full border border-orange-200 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  required
                >
                  <option>Loading...</option>
                </select>
              ) : (
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="block w-full border border-orange-200 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  required
                >
                  <option value="">Select assign to</option>
                  {dropdownOptions.map((option) => (
                    <option key={option._id || option.userName} value={`${option.name} (${option.userName})`}>
                      {option.name} ({option.userName})
                    </option>
                  ))}
                </select>
              )
            ) : (
              <input
                type="text"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                placeholder="Assign to..."
                className="block w-full border border-orange-200 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 bg-white"
                required
                readOnly={assignTo !== ""}
              />
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-lg font-medium transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-md flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Submit Visitor Card</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Full-screen Camera Modal */}
     {/* Full-screen Camera Modal */}
      {fullScreenCamera && (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Webcam
            ref={fullScreenWebcamRef}
            audio={false}
            screenshotFormat="image/png"
            forceScreenshotSourceSize={true}
            videoConstraints={videoConstraints}
            onUserMedia={() => setIsFullScreenVideoReady(true)}
            onUserMediaError={(error) => {
              console.error("Full-screen webcam error:", error)
              setIsFullScreenVideoReady(false)
            }}
            className="h-full w-full object-contain"
          />

          {/* Overlay controls on top of the camera view */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-between items-center px-6">
            <button
              type="button"
              onClick={closeFullScreenCamera}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-full"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={captureFromFullScreen}
              disabled={!isFullScreenVideoReady}
              className={`${
                !isFullScreenVideoReady ? "bg-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              } text-white font-medium px-6 py-3 rounded-full flex items-center space-x-2`}
            >
              <Camera size={20} />
              <span>Capture</span>
            </button>
          </div>

          <div className="absolute top-16 left-0 right-0 text-center text-white text-xl font-bold pointer-events-none">
            {fullScreenCameraType === "front" ? "Capture Card Front" : "Capture Card Back"}
          </div>
        </div>
      </div>
      )}


      {/* Full Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage("")}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setPreviewImage("")}
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Full Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default VisitorCardForm
